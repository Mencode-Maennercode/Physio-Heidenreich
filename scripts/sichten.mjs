/**
 * Sichtungshilfe fuer Platzhalter-Medien.
 *
 *   node scripts/sichten.mjs videos 8088283,7517686,5798403
 *   node scripts/sichten.mjs bilder 29153940,21342581
 *
 * Laedt zu jeder Pexels-ID ein kleines Vorschaubild (bei Videos ein Standbild
 * aus Sekunde zwei) und legt daraus einen beschrifteten Kontaktbogen unter
 * `.sichtung/_bogen.jpg` ab.
 *
 * Warum das noetig ist: Die Suchbegriffe auf Pexels treffen die Motive nur
 * grob. "Physiotherapie" liefert ueberwiegend Pilates-Studios und Sportlerinnen -
 * also genau das Gegenteil dessen, was diese Seite zeigen soll. Ohne
 * Sichtprobe landet so etwas im Hero.
 *
 * Der Ordner `.sichtung/` ist ein Arbeitsordner und gehoert nicht ins Repo.
 */

import { mkdir, writeFile, readdir, rm } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import sharp from "sharp";

const ausfuehren = promisify(execFile);
const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");

const ART = process.argv[2] ?? "videos";
const IDS = (process.argv[3] ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const ORDNER = join(WURZEL, ".sichtung", ART);

/** Kleinste verfuegbare Fassung eines Pexels-Videos ermitteln. */
async function kleineVideoUrl(id) {
  const antwort = await fetch(`https://www.pexels.com/download/video/${id}/`, {
    redirect: "manual",
  });
  const ort = antwort.headers.get("location");
  if (!ort) throw new Error("keine Weiterleitung");

  // .../123-uhd_3840_2160_25fps.mp4  ->  .../123-sd_640_360_25fps.mp4
  const klein = ort.replace(/-(uhd|hd)_\d+_\d+_/, "-sd_640_360_");
  const kopf = await fetch(klein, { method: "HEAD" });
  return kopf.ok ? klein : ort;
}

/**
 * Drei Standbilder statt einem.
 *
 * Ein einzelnes Bild aus Sekunde zwei taeuscht: Ein Clip, der ruhig anfaengt,
 * kann zehn Sekunden spaeter Hot-Stone-Massage zeigen. Genau das ist beim
 * ersten Anlauf passiert - deshalb Anfang, Mitte und Ende.
 */
async function videoVorschau(id) {
  const url = await kleineVideoUrl(id);
  const antwort = await fetch(url);
  if (!antwort.ok) throw new Error(`${antwort.status}`);

  const datei = join(ORDNER, `${id}.mp4`);
  await writeFile(datei, Buffer.from(await antwort.arrayBuffer()));

  // Laenge ermitteln, damit Mitte und Ende auch bei kurzen Clips passen.
  let dauer = 10;
  try {
    const { stdout } = await ausfuehren("ffprobe", [
      "-v", "error",
      "-show_entries", "format=duration",
      "-of", "default=noprint_wrappers=1:nokey=1",
      datei,
    ]);
    const gelesen = Number.parseFloat(stdout.trim());
    if (Number.isFinite(gelesen) && gelesen > 0) dauer = gelesen;
  } catch {
    // ffprobe fehlt: dann eben mit dem Schaetzwert.
  }

  const stellen = [1, dauer / 2, Math.max(1, dauer - 1)];
  for (const [i, sekunde] of stellen.entries()) {
    await ausfuehren("ffmpeg", [
      "-y", "-ss", sekunde.toFixed(2), "-i", datei,
      "-frames:v", "1", "-q:v", "4",
      join(ORDNER, `${id}-${i + 1}.jpg`),
    ]);
  }

  await rm(datei, { force: true });
}

async function bildVorschau(id) {
  const url = `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=900`;
  const antwort = await fetch(url);
  if (!antwort.ok) throw new Error(`${antwort.status}`);
  await writeFile(
    join(ORDNER, `${id}.jpg`),
    Buffer.from(await antwort.arrayBuffer()),
  );
}

async function bogenBauen() {
  const bilder = (await readdir(ORDNER))
    .filter((n) => n.endsWith(".jpg") && !n.startsWith("_"))
    .sort();
  if (!bilder.length) return;

  const B = 460;
  const H = ART === "bilder" ? 340 : 260;
  const BESCHRIFTUNG = 26;
  const SPALTEN = 3;
  const zeilen = Math.ceil(bilder.length / SPALTEN);
  const teile = [];

  for (const [i, name] of bilder.entries()) {
    const spalte = i % SPALTEN;
    const zeile = Math.floor(i / SPALTEN);
    const puffer = await sharp(join(ORDNER, name))
      .resize(B, H, { fit: "cover" })
      .jpeg({ quality: 80 })
      .toBuffer();

    teile.push({
      input: Buffer.from(
        `<svg width="${B}" height="${BESCHRIFTUNG}"><rect width="${B}" height="${BESCHRIFTUNG}" fill="#111"/><text x="8" y="18" font-family="sans-serif" font-size="15" fill="#fff">${name.replace(".jpg", "")}</text></svg>`,
      ),
      left: spalte * B,
      top: zeile * (H + BESCHRIFTUNG),
    });
    teile.push({
      input: puffer,
      left: spalte * B,
      top: zeile * (H + BESCHRIFTUNG) + BESCHRIFTUNG,
    });
  }

  const ziel = join(ORDNER, "_bogen.jpg");
  await sharp({
    create: {
      width: B * SPALTEN,
      height: zeilen * (H + BESCHRIFTUNG),
      channels: 3,
      background: { r: 0, g: 0, b: 0 },
    },
  })
    .composite(teile)
    .jpeg({ quality: 82 })
    .toFile(ziel);

  console.log(`\nKontaktbogen: ${ziel.replace(WURZEL, ".")}`);
}

/** Kontaktbogen der bereits eingebauten Bilder - zur Kontrolle nach dem Lauf. */
async function lokalSichten() {
  const quelle = join(WURZEL, "public", "media", "bilder");
  await mkdir(ORDNER, { recursive: true });
  for (const name of await readdir(quelle)) {
    if (!name.endsWith(".jpg")) continue;
    await sharp(join(quelle, name))
      .resize(900, null, { fit: "inside" })
      .jpeg({ quality: 80 })
      .toFile(join(ORDNER, name));
  }
}

async function main() {
  if (ART === "lokal") {
    await lokalSichten();
    await bogenBauen();
    return;
  }

  if (!IDS.length) {
    console.error("Keine IDs angegeben.");
    process.exit(1);
  }
  await mkdir(ORDNER, { recursive: true });

  for (const id of IDS) {
    try {
      if (ART === "videos") await videoVorschau(id);
      else await bildVorschau(id);
      console.log(`ok ${id}`);
    } catch (fehler) {
      console.log(`fehlgeschlagen ${id}: ${fehler.message}`);
    }
  }

  await bogenBauen();
}

main().catch((fehler) => {
  console.error(fehler);
  process.exit(1);
});
