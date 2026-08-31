/** Einmalwerkzeug: prueft, ob der Hero-Auftritt wirklich laeuft. */
import { createServer } from "node:http";
import { readFile, stat, mkdir } from "node:fs/promises";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");
const AUSGABE = join(WURZEL, "out");
const ZIEL = join(WURZEL, ".blick", "auftritt");
/* Zufaelliger Port: Bleibt nach einem abgebrochenen Lauf ein
   Node-Prozess haengen, blockiert er sonst jeden weiteren Versuch. */
const PORT = 42000 + Math.floor(Math.random() * 2000);
const TYPEN = { ".html":"text/html; charset=utf-8", ".css":"text/css", ".js":"text/javascript", ".svg":"image/svg+xml", ".jpg":"image/jpeg", ".png":"image/png", ".webp":"image/webp", ".avif":"image/avif", ".mp4":"video/mp4", ".woff2":"font/woff2" };

await mkdir(ZIEL, { recursive: true });
const server = await new Promise((f) => {
  const s = createServer(async (q, a) => {
    try {
      let p = decodeURIComponent((q.url ?? "/").split("?")[0]);
      if (p.endsWith("/")) p += "index.html";
      const c = await readFile(join(AUSGABE, p));
      a.writeHead(200, { "Content-Type": TYPEN[extname(p)] ?? "application/octet-stream" });
      a.end(c);
    } catch { a.writeHead(404); a.end("nf"); }
  });
  s.listen(PORT, () => f(s));
});

let exe;
for (const p of ["C:/Program Files/Google/Chrome/Application/chrome.exe","C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"]) {
  try { await stat(p); exe = p; break; } catch {}
}
const browser = await puppeteer.launch({ executablePath: exe, headless: true });
const blatt = await browser.newPage();
await blatt.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

console.log("Bewegungs-Einstellung des Browsers:", await blatt.evaluate(() => "n/a").catch(() => "?"));
await blatt.goto(`http://localhost:${PORT}${process.env.SEITE ?? "/"}`, { waitUntil: "domcontentloaded" });

/*
  Im Browser mitschreiben, statt von aussen zu stichproben: Gesucht ist ein
  Aufblitzen - der Fall, dass die Ueberschrift erst sichtbar dasteht und
  dann von GSAP wieder auf 0 gesetzt wird. Das dauert wenige Bilder und
  faellt bei Stichproben von aussen zuverlaessig durch.
*/
const verlauf = await blatt.evaluate(
  (wahl) =>
    new Promise((fertig) => {
      const werte = [];
      const start = performance.now();
      const el = document.querySelector(wahl);
      const schritt = () => {
        const cs = getComputedStyle(el);
        werte.push([
          Math.round(performance.now() - start),
          Number(cs.opacity).toFixed(2),
        ]);
        if (performance.now() - start < 2200) requestAnimationFrame(schritt);
        else fertig(werte);
      };
      requestAnimationFrame(schritt);
    }),
  process.env.WAHL ?? "h1",
);

const deckungen = verlauf.map((v) => Number(v[1]));
const erstesNull = verlauf.findIndex((v) => Number(v[1]) < 0.99);
const zuletztNull = verlauf.map((v) => Number(v[1])).lastIndexOf(
  deckungen.filter((d) => d < 0.99).slice(-1)[0],
);
console.log("Bilder gemessen:", verlauf.length);
console.log("kleinste Deckkraft:", Math.min(...deckungen));
console.log(
  "unsichtbar von/bis (ms):",
  erstesNull >= 0 ? verlauf[erstesNull][0] : "nie",
  erstesNull >= 0 ? verlauf[zuletztNull][0] : "-",
);
/* Aufblitzen = die Ueberschrift war schon voll da und wird DANN unsichtbar. */
const blitzt = deckungen.length > 3 && deckungen[0] > 0.99 && Math.min(...deckungen.slice(1)) < 0.9;
console.log(blitzt ? "ACHTUNG: Aufblitzen" : "kein Aufblitzen");

await browser.close();
server.close();
