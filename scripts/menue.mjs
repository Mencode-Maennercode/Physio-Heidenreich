/** Einmalwerkzeug: Menue und Sprachwahl in Handybreite oeffnen und ansehen. */
import { createServer } from "node:http";
import { readFile, stat, mkdir } from "node:fs/promises";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");
const AUSGABE = join(WURZEL, "out");
const ZIEL = join(WURZEL, ".blick", "menue");
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
await blatt.goto(`http://localhost:${PORT}/`, { waitUntil: "domcontentloaded" });
await new Promise((w) => setTimeout(w, 2500));

/* Sprachwahl */
await blatt.evaluate(() => document.querySelector('[aria-haspopup="menu"]')?.click());
await new Promise((w) => setTimeout(w, 500));
await blatt.screenshot({ path: join(ZIEL, "sprache.png") });

/* Menue */
await blatt.evaluate(() => document.body.click());
await new Promise((w) => setTimeout(w, 300));
await blatt.evaluate(() => {
  const knopf = [...document.querySelectorAll("header button")].find((b) =>
    (b.getAttribute("aria-label") || "").toLowerCase().includes("men"),
  );
  knopf?.click();
});
await new Promise((w) => setTimeout(w, 700));
await blatt.screenshot({ path: join(ZIEL, "menue.png") });

await browser.close();
server.close();
console.log("Bilder in", ZIEL);
