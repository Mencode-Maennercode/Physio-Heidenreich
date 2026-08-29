/**
 * Findet das Element, das bei 130 % Textgroesse waagerechtes Scrollen
 * ausloest - also breiter ist als das Fenster.
 *
 * Einmalwerkzeug zur Fehlersuche, kein Teil der regulaeren Pruefung.
 * Aufruf: node scripts/ueberlauf.mjs
 */

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");
const AUSGABE = join(WURZEL, "out");
const PORT = 4323;

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

const server = await new Promise((fertig) => {
  const s = createServer(async (q, a) => {
    try {
      let pfad = decodeURIComponent((q.url ?? "/").split("?")[0]);
      if (pfad.endsWith("/")) pfad += "index.html";
      const datei = join(AUSGABE, pfad);
      const inhalt = await readFile(datei);
      a.writeHead(200, {
        "Content-Type": TYPEN[extname(datei)] ?? "application/octet-stream",
      });
      a.end(inhalt);
    } catch {
      a.writeHead(404);
      a.end("nicht gefunden");
    }
  });
  s.listen(PORT, () => fertig(s));
});

const pfade = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
];
let exe;
for (const p of pfade) {
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
await blatt.setViewport({ width: 390, height: 844 });
await blatt.goto(`http://localhost:${PORT}/`, { waitUntil: "networkidle2" });

await blatt.evaluate(() => {
  document.documentElement.dataset.textgroesse = "sehrgross";
  document.documentElement.dataset.kontrast = "hoch";
});
await new Promise((w) => setTimeout(w, 900));

const treffer = await blatt.evaluate(() => {
  const breite = document.documentElement.clientWidth;
  const liste = [];
  for (const k of document.querySelectorAll("body *")) {
    const r = k.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    /* Nur echte Uebertreter: rechts ueber den Rand hinaus. */
    if (r.right > breite + 0.5) {
      liste.push({
        marke: k.tagName.toLowerCase(),
        klasse: (k.className || "").toString().slice(0, 90),
        rechts: Math.round(r.right),
        breit: Math.round(r.width),
        text: (k.textContent ?? "").trim().slice(0, 45),
      });
    }
  }
  return { breite, liste };
});

console.log(`Fensterbreite: ${treffer.breite} px`);
console.log(`Übertreter: ${treffer.liste.length}\n`);
for (const t of treffer.liste.slice(0, 25)) {
  console.log(
    `${String(t.rechts).padStart(5)} px  ${t.marke.padEnd(6)} b=${String(t.breit).padStart(4)}  ${t.klasse}\n         "${t.text}"`,
  );
}

await browser.close();
server.close();
