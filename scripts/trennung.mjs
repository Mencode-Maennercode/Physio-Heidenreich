/**
 * Sucht Woerter, die beim Zeilenumbruch mitten im Wort zerrissen werden -
 * egal ob mit Trennstrich (Silbentrennung) oder ohne (harter Umbruch).
 *
 * Wie: Fuer jeden Textknoten wird Zeichen fuer Zeichen die Position im
 * Layout gemessen (Range + getBoundingClientRect). Springt die Zeile
 * zwischen zwei Zeichen um, ohne dass dazwischen ein Leerzeichen steht,
 * ist das Wort auseinandergerissen worden.
 *
 * Aufruf: node scripts/trennung.mjs
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");
const AUSGABE = join(WURZEL, "out");
const PORT = 42000 + Math.floor(Math.random() * 2000);
const TYPEN = { ".html":"text/html; charset=utf-8",".css":"text/css",".js":"text/javascript",".svg":"image/svg+xml",".jpg":"image/jpeg",".png":"image/png",".webp":"image/webp",".avif":"image/avif",".mp4":"video/mp4",".woff2":"font/woff2" };

const SEITEN = ["/", "/behandlung/", "/ueber-mich/", "/ablauf/", "/kontakt/", "/einfache-sprache/", "/en/", "/en/treatments/", "/en/how-it-works/"];
const BREITEN = [320, 360, 390, 430];

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

const PRUEFUNG = () => {
  const treffer = [];
  const lauf = document.createRange();
  const gehen = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);

  let knoten;
  while ((knoten = gehen.nextNode())) {
    const text = knoten.nodeValue ?? "";
    if (text.trim().length < 4 || text.length > 600) continue;
    const el = knoten.parentElement;
    if (!el) continue;
    const stil = getComputedStyle(el);
    if (stil.visibility === "hidden" || stil.display === "none") continue;
    if (el.closest("[aria-hidden='true'], .sr-only, script, style")) continue;
    if (el.getBoundingClientRect().width === 0) continue;

    let vorigeZeile = null;
    for (let i = 0; i < text.length; i++) {
      const zeichen = text[i];
      if (zeichen === " " || zeichen === "\n" || zeichen === "\t") { vorigeZeile = null; continue; }
      lauf.setStart(knoten, i);
      lauf.setEnd(knoten, i + 1);
      const kasten = lauf.getBoundingClientRect();
      if (kasten.height === 0) continue;
      const zeile = Math.round(kasten.top);
      if (vorigeZeile !== null && zeile > vorigeZeile + 3) {
        // Zeilenwechsel mitten im Wort: Zeichen davor war kein Leerzeichen.
        const anfang = Math.max(0, i - 14);
        const bruch = text.slice(anfang, i) + "|" + text.slice(i, Math.min(text.length, i + 12));
        treffer.push({
          text: bruch.replace(/\s+/g, " ").trim(),
          wo: el.tagName.toLowerCase() + (el.className && typeof el.className === "string" ? "." + el.className.split(" ").slice(0, 2).join(".") : ""),
        });
      }
      vorigeZeile = zeile;
    }
  }
  return treffer;
};

const alle = new Map();
for (const breite of BREITEN) {
  for (const seite of SEITEN) {
    const blatt = await browser.newPage();
    await blatt.setViewport({ width: breite, height: 900, isMobile: breite < 768, hasTouch: true });
    await blatt.goto(`http://localhost:${PORT}${seite}`, { waitUntil: "domcontentloaded" });
    await new Promise((w) => setTimeout(w, 1800));
    const treffer = await blatt.evaluate(PRUEFUNG);
    for (const t of treffer) {
      const schluessel = t.text;
      if (!alle.has(schluessel)) alle.set(schluessel, { ...t, seiten: new Set(), breiten: new Set() });
      alle.get(schluessel).seiten.add(seite);
      alle.get(schluessel).breiten.add(breite);
    }
    await blatt.close();
  }
}

if (alle.size === 0) {
  console.log("Keine zerrissenen Woerter gefunden.");
} else {
  console.log(`${alle.size} zerrissene Woerter:\n`);
  for (const [, t] of alle) {
    console.log(`  ${t.text}`);
    console.log(`      ${[...t.breiten].join("/")}px · ${[...t.seiten].join(" ")} · ${t.wo}`);
  }
}

await browser.close();
server.close();
