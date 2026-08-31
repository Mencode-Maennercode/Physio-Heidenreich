/** Einmalwerkzeug: misst einzelne Elemente in Handybreite. */
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
const TYPEN = { ".html":"text/html; charset=utf-8", ".css":"text/css", ".js":"text/javascript", ".svg":"image/svg+xml", ".jpg":"image/jpeg", ".png":"image/png", ".webp":"image/webp", ".avif":"image/avif", ".mp4":"video/mp4", ".woff2":"font/woff2" };

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
await blatt.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
await blatt.goto(`http://localhost:${PORT}/`, { waitUntil: "domcontentloaded" });
await new Promise((w) => setTimeout(w, 3000));

const daten = await blatt.evaluate(() => {
  const k = (s) => document.querySelector(s);
  const kasten = (el) => el ? { x: Math.round(el.getBoundingClientRect().x), y: Math.round(el.getBoundingClientRect().y), b: Math.round(el.getBoundingClientRect().width), h: Math.round(el.getBoundingClientRect().height) } : null;
  return {
    fenster: { b: innerWidth, h: innerHeight },
    kopfHoehe: getComputedStyle(document.documentElement).getPropertyValue("--kopf-hoehe"),
    header: kasten(k("header")),
    kopfreihe: kasten(k(".kopf-reihe")),
    hero: kasten(k("#top")),
    videoband: kasten(k(".gc-hero-video")),
    video: kasten(k("#top video")),
    h1: kasten(k("h1")),
    h1Groesse: k("h1") ? getComputedStyle(k("h1")).fontSize : null,
    kicker: k("#top p") ? getComputedStyle(k("#top p")).fontSize : null,
    merkmale: kasten(k("#top ul")),
    schiene: kasten(k(".gc-schiene")),
    schieneStil: k(".gc-schiene") ? (({paddingLeft,marginLeft,display})=>({paddingLeft,marginLeft,display}))(getComputedStyle(k(".gc-schiene"))) : null,
    ersteKarte: kasten(k(".gc-schiene > *")),
    schieneScroll: k(".gc-schiene") ? { left: k(".gc-schiene").scrollLeft, breite: k(".gc-schiene").scrollWidth, sicht: k(".gc-schiene").clientWidth } : null,
    querScroll: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    kopfKinder: [...document.querySelectorAll(".kopf-reihe > *")].map((el) => {
      const r = el.getBoundingClientRect();
      return { tag: el.tagName + "." + (el.className || "").slice(0, 30), x: Math.round(r.x), b: Math.round(r.width), h: Math.round(r.height) };
    }),
    werkzeugKinder: [...document.querySelectorAll(".kopf-reihe > div > div > *, .kopf-reihe > div > div > div > *")].map((el) => {
      const r = el.getBoundingClientRect();
      return { tag: el.tagName + "." + (el.className || "").slice(0, 24), x: Math.round(r.x), b: Math.round(r.width) };
    }),
    logoTeile: [...document.querySelectorAll(".kopf-reihe > a *")].filter((e)=>e.tagName!=="PATH").map((el) => {
      const r = el.getBoundingClientRect();
      return { tag: el.tagName, txt: (el.textContent||"").slice(0,22), b: Math.round(r.width) };
    }),
  };
});
console.log(JSON.stringify(daten, null, 1));
await browser.close();
server.close();
