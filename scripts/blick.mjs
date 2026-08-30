/**
 * Nimmt gezielte Bildschirmfotos einzelner Stellen auf, um eine Aenderung
 * optisch zu pruefen. Einmalwerkzeug, kein Teil der regulaeren Pruefung.
 *
 * Aufruf: node scripts/blick.mjs
 */

import { createServer } from "node:http";
import { readFile, stat, mkdir } from "node:fs/promises";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");
const AUSGABE = join(WURZEL, "out");
const ZIEL = join(WURZEL, ".blick");
const PORT = 4329;

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
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
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

/** Auf ein Element scrollen, Animation abwarten, Ausschnitt aufnehmen. */
const ZIELE = [
  { seite: "/en/", wahl: "h1", name: "en-start" },
  { seite: "/en/treatments/", wahl: "h1", name: "en-treatments" },
];

for (const z of ZIELE) {
  const blatt = await browser.newPage();
  await blatt.setViewport({ width: 1440, height: 900 });
  await blatt.goto(`http://localhost:${PORT}${z.seite}`, {
    waitUntil: "networkidle2",
  });

  const gefunden = await blatt.evaluate((wahl) => {
    const el = document.querySelector(`main ${wahl}`);
    if (!el) return false;
    el.scrollIntoView({ block: "center" });
    return true;
  }, z.wahl);

  if (gefunden) {
    await new Promise((w) => setTimeout(w, 1800));
    const el = await blatt.$(`main ${z.wahl}`);
    const kasten = await el.boundingBox();
    if (kasten) {
      await blatt.screenshot({
        path: join(ZIEL, `${z.name}.png`),
        clip: {
          x: Math.max(0, kasten.x - 30),
          y: Math.max(0, kasten.y - 60),
          width: Math.min(1440, kasten.width + 60),
          height: kasten.height + 120,
        },
      });
      console.log(`${z.name}: ${Math.round(kasten.height)} px hoch`);
    }
  }
  await blatt.close();
}

await browser.close();
server.close();
console.log(`\nBilder in ${ZIEL}`);
