/**
 * Prueft, ob nach dem Laden irgendwo Inhalt unsichtbar stehen bleibt.
 *
 * Hintergrund: Die Auftritts-Bausteine in components/motion/Enthuellen.tsx
 * starten auf `opacity: 0` und werden erst sichtbar, wenn die Animation
 * ausloest. Loest sie nicht aus, bleibt der Abschnitt dauerhaft leer - und
 * genau das ist auf /behandlung/ und /ablauf/ aufgetreten.
 *
 * Der Test laedt jede Seite mehrfach (der Fehler war sporadisch), scrollt
 * einmal durch und meldet jedes Element, das danach noch durchsichtig ist.
 *
 * Aufruf: node scripts/sichtbarkeit.mjs
 * Setzt voraus, dass `out/` gebaut und ein Server auf PORT erreichbar ist -
 * beides erledigt das Skript selbst.
 */

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname } from "node:path";
import puppeteer from "puppeteer-core";

/* Zufaelliger Port: Bleibt nach einem abgebrochenen Lauf ein
   Node-Prozess haengen, blockiert er sonst jeden weiteren Versuch. */
const PORT = 42000 + Math.floor(Math.random() * 2000);
const WURZEL = new URL("../out/", import.meta.url).pathname.replace(/^\//, "");
const DURCHGAENGE = 3;

const SEITEN = [
  "/",
  "/behandlung/",
  "/ueber-mich/",
  "/ablauf/",
  "/kontakt/",
  "/einfache-sprache/",
  "/impressum/",
  "/en/",
  "/en/treatments/",
  "/en/about/",
  "/en/how-it-works/",
  "/en/contact/",
];

const TYPEN = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".mp4": "video/mp4",
  ".woff2": "font/woff2",
};

/** Chrome oder Edge auf diesem Rechner finden - wie in scripts/pruefen.mjs. */
async function browserPfad() {
  const kandidaten = [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  ];
  for (const pfad of kandidaten) {
    try {
      await stat(pfad);
      return pfad;
    } catch {
      /* naechster */
    }
  }
  throw new Error("Kein Chrome oder Edge gefunden.");
}

function starteServer() {
  const server = createServer(async (anfrage, antwort) => {
    try {
      let pfad = decodeURIComponent(anfrage.url.split("?")[0]);
      if (pfad.endsWith("/")) pfad += "index.html";
      let datei = join(WURZEL, pfad);
      try {
        await stat(datei);
      } catch {
        datei = join(WURZEL, pfad + ".html");
      }
      const inhalt = await readFile(datei);
      antwort.writeHead(200, {
        "Content-Type": TYPEN[extname(datei)] ?? "application/octet-stream",
      });
      antwort.end(inhalt);
    } catch {
      antwort.writeHead(404);
      antwort.end("nicht gefunden");
    }
  });
  return new Promise((fertig) => server.listen(PORT, () => fertig(server)));
}

/**
 * Sucht Elemente, die Inhalt tragen, aber unsichtbar sind.
 *
 * Absichtlich nur Elemente MIT Text und mit eigener Flaeche - sonst melden
 * dekorative Huellen und noch nicht erreichte Abschnitte falsche Treffer.
 */
const SUCHE = () => {
  const treffer = [];
  for (const knoten of document.querySelectorAll("main *")) {
    const stil = getComputedStyle(knoten);
    if (Number(stil.opacity) > 0.05) continue;
    if (stil.visibility === "hidden" || stil.display === "none") continue;

    const text = (knoten.textContent ?? "").trim();
    if (text.length < 3) continue;

    const kasten = knoten.getBoundingClientRect();
    if (kasten.height < 4) continue;

    /* Nur melden, was der Nutzer erreicht hat - Abschnitte weit unterhalb
       sind zu Recht noch nicht eingeblendet. */
    if (kasten.top > window.innerHeight) continue;

    treffer.push({
      marke: knoten.tagName.toLowerCase() + "." + (knoten.className || "").toString().split(" ")[0],
      text: text.slice(0, 70),
    });
  }
  return treffer;
};

const server = await starteServer();
const browser = await puppeteer.launch({
  executablePath: await browserPfad(),
  headless: true,
  args: ["--hide-scrollbars"],
});

let fehler = 0;

for (const seite of SEITEN) {
  for (let durchgang = 1; durchgang <= DURCHGAENGE; durchgang++) {
    const blatt = await browser.newPage();
    await blatt.setViewport({ width: 1440, height: 900 });
    await blatt.goto(`http://localhost:${PORT}${seite}`, {
      waitUntil: "networkidle2",
    });

    /* Einmal langsam durchscrollen, damit jeder Abschnitt an die Reihe
       kommt, danach zurueck nach oben. */
    await blatt.evaluate(async () => {
      const schritt = window.innerHeight * 0.8;
      for (let y = 0; y < document.body.scrollHeight; y += schritt) {
        window.scrollTo(0, y);
        await new Promise((w) => setTimeout(w, 220));
      }
      window.scrollTo(0, 0);
      await new Promise((w) => setTimeout(w, 600));
    });

    const treffer = await blatt.evaluate(SUCHE);
    if (treffer.length) {
      fehler += treffer.length;
      console.log(`\n${seite}  (Durchgang ${durchgang})`);
      for (const t of treffer) console.log(`  UNSICHTBAR  ${t.marke}  "${t.text}"`);
    }
    await blatt.close();
  }
  console.log(`${seite.padEnd(22)} ${DURCHGAENGE}x geprüft`);
}

await browser.close();
server.close();

console.log(
  fehler === 0
    ? "\nAlle Abschnitte sichtbar."
    : `\n${fehler} unsichtbare Stellen gefunden.`,
);
process.exit(fehler === 0 ? 0 : 1);
