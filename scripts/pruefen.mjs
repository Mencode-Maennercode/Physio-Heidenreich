/**
 * Sicht- und Strukturprüfung im echten Browser.
 *
 *   npm run build && node scripts/pruefen.mjs
 *
 * Liefert Bildschirmfotos aller Seiten (Desktop und Handy, hell und in den
 * Barrierefreiheits-Modi) unter `.pruefung/` und meldet strukturelle Fehler
 * auf der Konsole:
 *   - Bilder ohne Alternativtext
 *   - Tippflächen unter 44 px
 *   - übersprungene Überschriftenebenen
 *   - Formularfelder ohne Beschriftung
 *   - waagerechtes Scrollen (auch bei 130 % Textgröße)
 *
 * Geprüft wird der fertige Export aus `out/`, nicht der Entwicklungsserver -
 * damit dasselbe getestet wird, was später hochgeladen wird.
 */

import { createServer } from "node:http";
import { existsSync } from "node:fs";
import { readFile, mkdir, rm } from "node:fs/promises";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");
const AUSGABE = join(WURZEL, "out");
const BILDER = join(WURZEL, ".pruefung");
const PORT = 4321;

const BROWSER = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
];

const TYPEN = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".mp4": "video/mp4",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".json": "application/json",
};

const SEITEN = [
  { pfad: "/", name: "start" },
  // Der Wohnungsweg ist eine feststehende Bühne: Auf einem Ganzseitenbild
  // erscheint er nur einmal, in seinem Anfangszustand. Deshalb zusätzlich
  // Einzelbilder an mehreren Scrollpositionen.
  { pfad: "/behandlung/", name: "behandlung", buehne: [0.42, 0.5, 0.58, 0.66] },
  { pfad: "/ueber-mich/", name: "ueber-mich" },
  { pfad: "/ablauf/", name: "ablauf" },
  { pfad: "/kontakt/", name: "kontakt" },
  { pfad: "/einfache-sprache/", name: "einfache-sprache" },
  { pfad: "/impressum/", name: "impressum" },
];

function serverStarten() {
  const server = createServer(async (anfrage, antwort) => {
    try {
      let pfad = decodeURIComponent((anfrage.url ?? "/").split("?")[0]);
      if (pfad.endsWith("/")) pfad += "index.html";
      const datei = join(AUSGABE, pfad);
      const inhalt = await readFile(datei);
      antwort.writeHead(200, {
        "Content-Type": TYPEN[extname(datei)] ?? "application/octet-stream",
      });
      antwort.end(inhalt);
    } catch {
      antwort.writeHead(404, { "Content-Type": "text/plain" });
      antwort.end("nicht gefunden");
    }
  });
  return new Promise((fertig) => server.listen(PORT, () => fertig(server)));
}

/** Läuft im Browser: sammelt strukturelle Mängel einer Seite. */
function pruefungImBrowser() {
  const mangel = [];

  for (const bild of document.querySelectorAll("img")) {
    if (bild.getAttribute("alt") === null) {
      mangel.push(`Bild ohne alt-Attribut: ${bild.currentSrc || bild.src}`);
    }
  }

  // Tippflächen. 44 px ist die kleinste Fläche, die als sicher treffbar gilt.
  for (const element of document.querySelectorAll(
    "a[href], button, input, select, textarea, [role='tab']",
  )) {
    // Steckt das Element in einer Beschriftung, ist DIESE die Tippfläche -
    // ein Klick irgendwo auf den Beschriftungstext schaltet das Feld. Sonst
    // würde jede Ankreuzfläche fälschlich als zu klein gemeldet.
    const umgebendeBeschriftung = element.closest("label");
    const ziel = umgebendeBeschriftung ?? element;

    const kasten = ziel.getBoundingClientRect();
    if (kasten.width === 0 && kasten.height === 0) continue; // unsichtbar
    const stil = getComputedStyle(element);
    if (stil.display === "none" || stil.visibility === "hidden") continue;
    // Absichtlich verborgene Bereiche - etwa der Honigtopf im Formular -
    // sollen klein bleiben; sie sind für niemanden ein Ziel.
    if (element.closest("[aria-hidden='true']")) continue;
    // Reine Textlinks im Fließtext sind ausgenommen - sie haben keine
    // eigene Fläche, sondern erben die Zeilenhöhe.
    if (element.tagName === "A" && stil.display === "inline") continue;
    if (kasten.height < 44 - 0.5 || kasten.width < 24) {
      mangel.push(
        `Tippfläche zu klein (${Math.round(kasten.width)}×${Math.round(kasten.height)}): ` +
          `${ziel.tagName.toLowerCase()} „${(ziel.textContent ?? "").trim().slice(0, 40)}"`,
      );
    }
  }

  for (const feld of document.querySelectorAll("input, select, textarea")) {
    if (feld.type === "hidden") continue;
    const hatBeschriftung =
      feld.labels?.length ||
      feld.getAttribute("aria-label") ||
      feld.getAttribute("aria-labelledby");
    if (!hatBeschriftung) {
      mangel.push(`Formularfeld ohne Beschriftung: ${feld.name || feld.id}`);
    }
  }

  // Überschriftenebenen: genau eine h1, keine übersprungene Ebene.
  const ueberschriften = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")]
    .filter((h) => !h.closest("[hidden]"))
    .map((h) => Number(h.tagName[1]));
  const anzahlH1 = ueberschriften.filter((n) => n === 1).length;
  if (anzahlH1 !== 1) mangel.push(`${anzahlH1} h1-Überschriften (erwartet: 1)`);
  for (let i = 1; i < ueberschriften.length; i++) {
    if (ueberschriften[i] - ueberschriften[i - 1] > 1) {
      mangel.push(
        `Überschriftenebene übersprungen: h${ueberschriften[i - 1]} → h${ueberschriften[i]}`,
      );
    }
  }

  if (!document.querySelector("a[href='#inhalt']")) {
    mangel.push("Sprunglink zum Inhalt fehlt");
  }

  // --- Kontrast -------------------------------------------------------------
  // Geprüft wird nur Text auf einer eindeutig ermittelbaren Volltonfläche.
  // Text über Bildern und Verläufen (Hero-Bereiche) lässt sich so nicht
  // messen; dort liegt in jedem Fall ein kräftiger Abdunkler darüber.
  const zuRgb = (wert) => {
    const teile = wert.match(/[\d.]+/g);
    return teile ? teile.slice(0, 4).map(Number) : null;
  };

  const leuchtdichte = ([r, g, b]) => {
    const k = [r, g, b].map((v) => {
      const n = v / 255;
      return n <= 0.03928 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * k[0] + 0.7152 * k[1] + 0.0722 * k[2];
  };

  const hintergrundFinden = (element) => {
    let knoten = element;
    while (knoten && knoten !== document.documentElement) {
      const stil = getComputedStyle(knoten);
      if (stil.backgroundImage !== "none") return null; // Bild oder Verlauf
      // Ein <video> sitzt per Positionierung dahinter, nicht als CSS-
      // Hintergrund - fuer die Farbwahl unsichtbar, ohne diese Pruefung faellt
      // der Code sonst auf sein Weiss-Off-White-Standard zurueck und meldet
      // fuer Text ueber dem Hero-Video einen erfundenen, viel zu niedrigen
      // Kontrast. Solche Stellen bleiben bewusst der Sichtpruefung
      // vorbehalten (siehe Kommentar am Aufruf).
      if (knoten.querySelector?.("video")) return null;
      const farbe = zuRgb(stil.backgroundColor);
      if (farbe && (farbe[3] === undefined || farbe[3] === 1) && farbe.slice(0, 3).some(() => true)) {
        if (stil.backgroundColor !== "rgba(0, 0, 0, 0)") return farbe.slice(0, 3);
      }
      knoten = knoten.parentElement;
    }
    return [248, 247, 243];
  };

  const gesehen = new Set();
  for (const element of document.querySelectorAll(
    "p, li, h1, h2, h3, h4, a, span, button, label, dd, dt, td, th",
  )) {
    // Nur Elemente mit eigenem Text, nicht die Hüllen darum.
    const text = [...element.childNodes]
      .filter((k) => k.nodeType === 3)
      .map((k) => k.textContent.trim())
      .join("");
    if (text.length < 3) continue;

    const stil = getComputedStyle(element);
    if (stil.visibility === "hidden" || stil.display === "none") continue;
    if (element.closest(".sr-only, [aria-hidden='true']")) continue;
    if (Number.parseFloat(stil.opacity) < 0.95) continue;

    const vorne = zuRgb(stil.color);
    const hinten = hintergrundFinden(element);
    if (!vorne || !hinten) continue;

    const l1 = leuchtdichte(vorne.slice(0, 3));
    const l2 = leuchtdichte(hinten);
    const verhaeltnis =
      (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

    // Grenze nach WCAG: 3:1 für großen Text (ab 24 px bzw. 18,66 px fett),
    // sonst 4,5:1.
    const groesse = Number.parseFloat(stil.fontSize);
    const fett = Number.parseInt(stil.fontWeight, 10) >= 700;
    const grenze = groesse >= 24 || (fett && groesse >= 18.66) ? 3 : 4.5;

    if (verhaeltnis < grenze) {
      const schluessel = `${stil.color}|${grenze}`;
      if (gesehen.has(schluessel)) continue;
      gesehen.add(schluessel);
      mangel.push(
        `Kontrast ${verhaeltnis.toFixed(2)}:1 (nötig ${grenze}:1) bei „${text.slice(0, 40)}"`,
      );
    }
  }

  if (document.documentElement.scrollWidth > window.innerWidth + 1) {
    mangel.push(
      `Waagerechtes Scrollen: ${document.documentElement.scrollWidth} px breit bei ${window.innerWidth} px Fenster`,
    );
  }

  return mangel;
}

/**
 * Einmal komplett durchscrollen und zurück.
 *
 * Ohne das bleiben alle Abschnitte, die erst beim Hereinscrollen auftauchen,
 * auf Deckkraft 0 - ein Ganzseitenbild zeigt dann große weiße Flächen, und man
 * hält ein Testartefakt für einen Fehler. Muss deshalb in JEDER Ansicht
 * passieren, nicht nur in der ersten.
 */
/**
 * Einmal komplett durchscrollen und zurück.
 *
 * Ohne das bleiben alle Abschnitte, die erst beim Hereinscrollen auftauchen,
 * auf Deckkraft 0 - ein Ganzseitenbild zeigt dann grosse leere Flaechen, und
 * man haelt ein Testartefakt fuer einen Fehler.
 *
 * Der Takt zwischen den Schritten ist keine Nebensaechlichkeit: Ein
 * IntersectionObserver (das steckt hinter jedem "beim Scrollen einblenden")
 * braucht mindestens einen Bildaufbau, um ein Element als sichtbar zu
 * erkennen. Bei zu kurzem Takt scrollt die Schleife an einem Abschnitt
 * vorbei, bevor der Beobachter ueberhaupt ausgeloest hat - bei gestaffelten
 * Listen (Staffel/StaffelKind) kommt die staggerChildren-Verzoegerung noch
 * dazu. Das ist kein Sonderfall des Seitenendes, sondern kann an jeder
 * Sektion passieren; ein einzelner Pausenschritt am Ende genuegt deshalb
 * nicht, der Takt muss ueberall grosszuegig genug sein.
 */
async function durchscrollen(tab) {
  await tab.evaluate(async () => {
    const schritt = window.innerHeight * 0.6;
    for (let y = 0; y < document.body.scrollHeight; y += schritt) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 220));
    }
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise((r) => setTimeout(r, 400));
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 700));
  });
}

async function main() {
  await rm(BILDER, { recursive: true, force: true });
  await mkdir(BILDER, { recursive: true });

  const server = await serverStarten();
  const pfad = BROWSER.find((p) => existsSync(p));
  if (!pfad) throw new Error("Weder Chrome noch Edge gefunden.");

  const browser = await puppeteer.launch({
    executablePath: pfad,
    headless: true,
    args: ["--hide-scrollbars"],
  });

  let mangelGesamt = 0;

  for (const seite of SEITEN) {
    const tab = await browser.newPage();

    // Headless-Chrome meldet von sich aus "weniger Bewegung". Ohne diese Zeile
    // wird die gesamte Seite in ihrer Ruhefassung fotografiert - der gescrollte
    // Wohnungsweg erscheint dann als schlichte Liste, und die Animationen
    // bleiben ungeprüft.
    await tab.emulateMediaFeatures([
      { name: "prefers-reduced-motion", value: "no-preference" },
    ]);

    // --- Desktop -----------------------------------------------------------
    await tab.setViewport({ width: 1440, height: 960, deviceScaleFactor: 1 });
    await tab.goto(`http://localhost:${PORT}${seite.pfad}`, {
      waitUntil: "networkidle2",
    });
    await durchscrollen(tab);

    await tab.screenshot({
      path: join(BILDER, `${seite.name}-desktop.jpg`),
      fullPage: true,
      quality: 72,
      type: "jpeg",
    });

    const mangel = await tab.evaluate(pruefungImBrowser);

    // --- Feststehende Bühnen an mehreren Scrollpositionen -------------------
    if (seite.buehne) {
      for (const [i, anteil] of seite.buehne.entries()) {
        await tab.evaluate((a) => {
          window.scrollTo(0, document.body.scrollHeight * a);
        }, anteil);
        await new Promise((r) => setTimeout(r, 1100));
        await tab.screenshot({
          path: join(BILDER, `${seite.name}-buehne-${i + 1}.jpg`),
          quality: 78,
          type: "jpeg",
        });
      }
      await tab.evaluate(() => window.scrollTo(0, 0));
    }

    // --- Handy -------------------------------------------------------------
    await tab.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
    await tab.reload({ waitUntil: "networkidle2" });
    await durchscrollen(tab);
    await tab.screenshot({
      path: join(BILDER, `${seite.name}-handy.jpg`),
      fullPage: true,
      quality: 72,
      type: "jpeg",
    });
    const mangelHandy = await tab.evaluate(pruefungImBrowser);

    // --- Sehr große Schrift und erhöhter Kontrast ---------------------------
    await tab.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
    await tab.evaluate(() => {
      document.documentElement.dataset.textgroesse = "sehrgross";
      document.documentElement.dataset.kontrast = "hoch";
      document.documentElement.dataset.bewegung = "reduziert";
    });
    await new Promise((r) => setTimeout(r, 500));
    await durchscrollen(tab);
    await tab.screenshot({
      path: join(BILDER, `${seite.name}-gross-kontrast.jpg`),
      fullPage: true,
      quality: 72,
      type: "jpeg",
    });
    const mangelGross = await tab.evaluate(pruefungImBrowser);

    const alle = [
      ...mangel.map((m) => `  [Desktop] ${m}`),
      ...mangelHandy
        .filter((m) => !mangel.includes(m))
        .map((m) => `  [Handy] ${m}`),
      ...mangelGross
        .filter((m) => !mangel.includes(m) && !mangelHandy.includes(m))
        .map((m) => `  [130 % + Kontrast] ${m}`),
    ];

    console.log(`\n${seite.pfad}`);
    if (alle.length === 0) {
      console.log("  ohne Befund");
    } else {
      mangelGesamt += alle.length;
      // Gleiche Meldung nicht dreimal ausgeben.
      console.log([...new Set(alle)].join("\n"));
    }

    await tab.close();
  }

  await browser.close();
  server.close();

  console.log(
    `\n${mangelGesamt === 0 ? "Keine strukturellen Mängel." : `${mangelGesamt} Befunde.`}`,
  );
  console.log(`Bildschirmfotos: ${BILDER.replace(WURZEL, ".")}`);
}

main().catch((fehler) => {
  console.error(fehler);
  process.exit(1);
});
