/**
 * Nimmt die Startseite in Handybreite in Etappen auf, damit sich die mobile
 * Gestaltung am Stueck beurteilen laesst. Einmalwerkzeug.
 *
 * Aufruf: node scripts/mobil.mjs [pfad] [breite]
 */

import { createServer } from "node:http";
import { readFile, stat, mkdir, rm } from "node:fs/promises";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");
const AUSGABE = join(WURZEL, "out");
const ZIEL = join(WURZEL, ".blick", "mobil");
/* Zufaelliger Port: Bleibt nach einem abgebrochenen Lauf ein
   Node-Prozess haengen, blockiert er sonst jeden weiteren Versuch. */
const PORT = 42000 + Math.floor(Math.random() * 2000);

const SEITE = process.env.SEITE ?? "/";
const BREITE = Number(process.env.BREITE ?? 390);
const HOEHE = 844;

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
};

await rm(ZIEL, { recursive: true, force: true });
await mkdir(ZIEL, { recursive: true });

const server = await new Promise((fertig) => {
  const s = createServer(async (q, a) => {
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
  s.listen(PORT, () => fertig(s));
});

const kandidaten = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
];
let exe;
for (const p of kandidaten) {
  try {
    await stat(p);
    exe = p;
    break;
  } catch {
    /* naechster */
  }
}

const browser = await puppeteer.launch({ executablePath: exe, headless: true });
const blatt = await browser.newPage();
await blatt.setViewport({
  width: BREITE,
  height: HOEHE,
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
await blatt.goto(`http://localhost:${PORT}${SEITE}`, {
  waitUntil: "domcontentloaded",
});
await new Promise((w) => setTimeout(w, 3500));

const gesamt = await blatt.evaluate(() => document.body.scrollHeight);
const etappen = Math.ceil(gesamt / HOEHE);
console.log(`${SEITE} @ ${BREITE}px: ${gesamt} px hoch, ${etappen} Etappen`);

for (let i = 0; i < etappen; i++) {
  const y = i * HOEHE;
  await blatt.evaluate((v) => window.scrollTo(0, v), y);
  await new Promise((w) => setTimeout(w, 900));
  await blatt.screenshot({
    path: join(ZIEL, `${String(i + 1).padStart(2, "0")}.png`),
  });
}

await browser.close();
server.close();
console.log(`Bilder in ${ZIEL}`);
