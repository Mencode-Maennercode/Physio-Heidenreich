/**
 * Prueft alle Seiten auf vielen echten Geraeteaufloesungen.
 *
 * Sucht drei Fehlerbilder, die auf schmalen Schirmen am haeufigsten
 * auftreten und am Schreibtisch nie auffallen:
 *
 *  1. waagerechtes Scrollen (Inhalt breiter als das Fenster)
 *  2. Beruehrflaechen unter 44 px (WCAG 2.5.8, fuer unsichere Haende
 *     entscheidend - genau die Zielgruppe dieser Seite)
 *  3. Text, der aus seinem Behaelter laeuft
 *
 * Zusaetzlich bei 130 % Textgroesse, weil die Seite das anbietet und die
 * meisten Layoutfehler erst dort auftreten.
 *
 * Aufruf: node scripts/geraete.mjs
 */

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");
const AUSGABE = join(WURZEL, "out");
/* Zufaelliger Port: Bleibt nach einem abgebrochenen Lauf ein
   Node-Prozess haengen, blockiert er sonst jeden weiteren Versuch. */
const PORT = 42000 + Math.floor(Math.random() * 2000);

const TYPEN = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".mp4": "video/mp4",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
};

/* Quer durch das, was tatsaechlich benutzt wird - vom kleinsten noch
   verbreiteten Schirm bis zum grossen Tablet. */
const GERAETE = [
  { name: "iPhone SE", breite: 375, hoehe: 667 },
  { name: "iPhone 12/13/14", breite: 390, hoehe: 844 },
  { name: "iPhone 15 Pro Max", breite: 430, hoehe: 932 },
  { name: "Galaxy S8/S20", breite: 360, hoehe: 740 },
  { name: "Pixel 7", breite: 412, hoehe: 915 },
  { name: "iPad mini hoch", breite: 768, hoehe: 1024 },
  { name: "iPad quer", breite: 1024, hoehe: 768 },
  { name: "Kleines Notebook", breite: 1280, hoehe: 800 },
];

const SEITEN = [
  "/",
  "/behandlung/",
  "/ueber-mich/",
  "/ablauf/",
  "/kontakt/",
  "/einfache-sprache/",
  "/impressum/",
  "/datenschutz/",
  "/en/",
  "/en/treatments/",
  "/en/about/",
  "/en/how-it-works/",
  "/en/contact/",
];

function starteServer() {
  const server = createServer(async (q, a) => {
    try {
      let pfad = decodeURIComponent((q.url ?? "/").split("?")[0]);
      if (pfad.endsWith("/")) pfad += "index.html";
      const inhalt = await readFile(join(AUSGABE, pfad));
      a.writeHead(200, {
        "Content-Type": TYPEN[extname(pfad)] ?? "application/octet-stream",
      });
      a.end(inhalt);
    } catch {
      a.writeHead(404);
      a.end("nicht gefunden");
    }
  });
  return new Promise((f) => server.listen(PORT, () => f(server)));
}

/** Laeuft im Browser. */
const PRUEFUNG = () => {
  const befunde = [];
  const fensterBreite = document.documentElement.clientWidth;

  /* 1) Waagerechtes Scrollen.

     Gemessen wird, ob sich die Seite TATSAECHLICH schieben laesst - nicht
     nur, ob rechnerisch etwas breiter ist. `body { overflow-x: hidden }`
     faengt ueberstehenden Inhalt ab; die reine Breitenrechnung meldete
     deshalb Fehler, die niemand je zu sehen bekommt. Der Versuch, wirklich
     zu scrollen, ist die einzige verlaessliche Antwort. */
  window.scrollTo(20, window.scrollY);
  const laesstSichSchieben = window.scrollX > 0;
  window.scrollTo(0, window.scrollY);

  const dokBreite = document.documentElement.scrollWidth;
  if (laesstSichSchieben && dokBreite > fensterBreite + 1) {
    /* Den Uebeltaeter gleich mitliefern - sonst sucht man ihn haendisch. */
    let schuld = "unbekannt";
    for (const k of document.querySelectorAll("body *")) {
      const r = k.getBoundingClientRect();
      if (r.right > fensterBreite + 1 && r.width > 0) {
        const stil = getComputedStyle(k);
        /* Elemente in einem beschnittenen Behaelter zaehlen nicht - sie
           koennen gar nicht scrollen lassen. */
        let beschnitten = false;
        let eltern = k.parentElement;
        while (eltern) {
          const es = getComputedStyle(eltern);
          if (es.overflowX === "hidden" || es.overflow === "hidden") {
            beschnitten = true;
            break;
          }
          eltern = eltern.parentElement;
        }
        if (beschnitten || stil.position === "fixed") continue;
        schuld = `${k.tagName.toLowerCase()}.${String(k.className).split(" ")[0]}`;
        break;
      }
    }
    befunde.push(
      `Waagerechtes Scrollen: ${dokBreite} px bei ${fensterBreite} px Fenster (${schuld})`,
    );
  }

  /* 2) Zu kleine Beruehrflaechen */
  const klein = [];
  for (const k of document.querySelectorAll(
    "a[href], button, input, select, textarea",
  )) {
    const r = k.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const stil = getComputedStyle(k);
    if (stil.visibility === "hidden" || stil.display === "none") continue;
    /* Links im Fliesstext sind ausgenommen - fuer sie gilt die Regel nicht,
       sie sind Teil eines Satzes. */
    const imText =
      k.tagName === "A" &&
      k.parentElement &&
      ["P", "LI", "SPAN"].includes(k.parentElement.tagName);
    if (imText) continue;
    /* In einem <label> eingefasste Ankreuzfelder sind ausgenommen: Dort
       ist die Beruehrflaeche der gesamte Beschriftungstext, nicht das
       kleine Kaestchen. */
    if (k.tagName === "INPUT" && k.closest("label")) continue;
    /* Der Honigtopf gegen Spam ist absichtlich aus dem Sichtfeld
       geschoben und fuer Vorlesesoftware ausgeblendet - er ist kein
       Bedienelement und darf nicht als zu klein gelten. */
    if (k.tabIndex === -1 || k.closest("[aria-hidden='true']")) continue;
    if (r.height < 44 || r.width < 24) {
      klein.push(
        `${k.tagName.toLowerCase()} "${(k.textContent ?? "").trim().slice(0, 28)}" ${Math.round(r.width)}x${Math.round(r.height)}`,
      );
    }
  }
  if (klein.length) {
    befunde.push(`Zu kleine Bedienflächen (${klein.length}): ${klein.slice(0, 4).join(" | ")}`);
  }

  /* 3) Text laeuft aus seinem Behaelter */
  const ueber = [];
  for (const k of document.querySelectorAll("p, h1, h2, h3, li, span, a")) {
    if (k.scrollWidth > k.clientWidth + 2 && k.clientWidth > 0) {
      const stil = getComputedStyle(k);
      if (stil.overflowX === "auto" || stil.overflowX === "scroll") continue;

      /* Nur fuer Vorlesesoftware bestimmte Texte sind absichtlich auf
         1 px zusammengeschnitten - kein Fehler, sondern der Zweck. */
      if (k.classList.contains("sr-only") || k.closest(".sr-only")) continue;

      /* Elemente auf einer absichtlich beschnittenen Buehne (etwa der
         gescrollte Weg durch die Wohnung) melden hier immer einen
         Ueberlauf. Sie sind so gebaut und werden nacheinander
         eingeblendet. */
      let gestellt = false;
      let e = k.parentElement;
      while (e) {
        const es = getComputedStyle(e);
        if (es.position === "sticky" || es.position === "absolute") {
          gestellt = true;
          break;
        }
        e = e.parentElement;
      }
      if (gestellt) continue;
      ueber.push(`${k.tagName.toLowerCase()} "${(k.textContent ?? "").trim().slice(0, 30)}"`);
    }
  }
  if (ueber.length) {
    befunde.push(`Text über den Rand (${ueber.length}): ${ueber.slice(0, 3).join(" | ")}`);
  }

  return befunde;
};

const server = await starteServer();
const kandidaten = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
];
let exe;
for (const k of kandidaten) {
  try {
    await stat(k);
    exe = k;
    break;
  } catch {
    /* naechster */
  }
}

const browser = await puppeteer.launch({ executablePath: exe, headless: true });
let gesamt = 0;

for (const geraet of GERAETE) {
  const treffer = [];

  for (const seite of SEITEN) {
    for (const gross of [false, true]) {
      const blatt = await browser.newPage();
      await blatt.setViewport({
        width: geraet.breite,
        height: geraet.hoehe,
        isMobile: geraet.breite < 768,
        hasTouch: geraet.breite < 1024,
      });
      await blatt.goto(`http://localhost:${PORT}${seite}`, {
        waitUntil: "networkidle2",
      });

      if (gross) {
        await blatt.evaluate(() => {
          document.documentElement.dataset.textgroesse = "sehrgross";
        });
        await new Promise((w) => setTimeout(w, 400));
      }

      /* Einmal durchscrollen, damit auch die unteren Abschnitte aufgebaut
         und gemessen werden. */
      await blatt.evaluate(async () => {
        const schritt = window.innerHeight * 0.9;
        for (let y = 0; y < document.body.scrollHeight; y += schritt) {
          window.scrollTo(0, y);
          await new Promise((w) => setTimeout(w, 90));
        }
        window.scrollTo(0, 0);
        await new Promise((w) => setTimeout(w, 250));
      });

      const befunde = await blatt.evaluate(PRUEFUNG);
      for (const b of befunde) {
        treffer.push(`  ${seite}${gross ? " [130 %]" : ""}: ${b}`);
      }
      await blatt.close();
    }
  }

  gesamt += treffer.length;
  console.log(
    `\n${geraet.name} (${geraet.breite}x${geraet.hoehe})${treffer.length ? "" : "  ohne Befund"}`,
  );
  for (const t of treffer) console.log(t);
}

await browser.close();
server.close();

console.log(
  gesamt === 0
    ? "\nAlle Geräte ohne Befund."
    : `\n${gesamt} Befunde auf mobilen Auflösungen.`,
);
process.exit(gesamt === 0 ? 0 : 1);
