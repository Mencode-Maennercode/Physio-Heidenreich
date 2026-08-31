/** Einmalwerkzeug: die LIVE-Seite in Handybreite ansehen (nicht out/). */
import { mkdir, stat, rm } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");
const ZIEL = join(WURZEL, ".blick", "live");
await rm(ZIEL, { recursive: true, force: true });
await mkdir(ZIEL, { recursive: true });

let exe;
for (const p of ["C:/Program Files/Google/Chrome/Application/chrome.exe","C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"]) {
  try { await stat(p); exe = p; break; } catch {}
}
const browser = await puppeteer.launch({
  executablePath: exe,
  headless: true,
  /* Das Zertifikat ist gueltig, aber der lokale Rechner loest den Namen ueber
     den Router auf, der noch den alten Eintrag im Zwischenspeicher hat. */
  args: ["--ignore-certificate-errors", "--host-resolver-rules=MAP www.nora-heidenreich.de 46.38.249.72, MAP nora-heidenreich.de 46.38.249.72"],
});
const blatt = await browser.newPage();
await blatt.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await blatt.goto("https://www.nora-heidenreich.de/", { waitUntil: "domcontentloaded" });
await new Promise((w) => setTimeout(w, 4000));

const hoehe = await blatt.evaluate(() => document.body.scrollHeight);
console.log("Seitenhoehe:", hoehe, "px");
for (let i = 0; i < 3; i++) {
  await blatt.evaluate((y) => window.scrollTo(0, y), i * 844);
  await new Promise((w) => setTimeout(w, 900));
  await blatt.screenshot({ path: join(ZIEL, `${i + 1}.png`) });
}
await browser.close();
console.log("Bilder in", ZIEL);
