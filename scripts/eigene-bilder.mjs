/**
 * Verarbeitet die drei per KI erstellten Fotos (echtes Gesicht von Nora,
 * Kleidung/Hintergrund angepasst) genau wie scripts/medien.mjs es fuer die
 * Pexels-Platzhalter tut - gleiche Breiten, gleiche Formate, gleicher
 * Unschaerfe-Platzhalter. Einmaliges Skript, nicht Teil von `npm run medien`.
 *
 *   node scripts/eigene-bilder.mjs
 */

import { mkdir, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");
const ZIEL = join(WURZEL, "public", "media", "bilder");
const QUELLEN = "C:\\Users\\HEIDEN~1\\AppData\\Local\\Temp\\claude\\C--Users-Heidenreich\\b52b7641-a0bd-4010-accb-780a517923f0\\scratchpad";

const BREITEN = [640, 1024, 1600];

/**
 * Jeder Eintrag traegt sein eigenes Seitenverhaeltnis, weil die Bilder an
 * zwei sehr unterschiedlichen Stellen landen: hochkant in lib/bilder.ts
 * deklarierte Portraet-Slots (4:5) und breite Leistungskarten (3:2). Die
 * tatsaechliche Anzeige schneidet ohnehin per CSS object-cover nach - dieser
 * Wert bestimmt nur den Zuschnitt der Ausgangsdatei und die width/height-
 * Attribute, nicht die finale Kachelform im Browser.
 */
const BILDER = [
  {
    name: "haende",
    quelle: join(QUELLEN, "leist-neuro-v2.png"),
    zuschnitt: "attention",
    seitenverhaeltnis: 4 / 5,
  },
  {
    name: "wohnraum",
    quelle: join(QUELLEN, "haltung.png"),
    zuschnitt: "attention",
    seitenverhaeltnis: 4 / 5,
  },
  {
    name: "lymphdrainage",
    quelle: join(QUELLEN, "leist-lymph.png"),
    zuschnitt: "attention",
    seitenverhaeltnis: 3 / 2,
  },
  {
    name: "angehoerige",
    quelle: join(QUELLEN, "angehoerige.png"),
    zuschnitt: "attention",
    seitenverhaeltnis: 3 / 2,
  },
  {
    name: "behandlung",
    quelle: join(QUELLEN, "ortho-stehen.png"),
    zuschnitt: "attention",
    seitenverhaeltnis: 3 / 2,
  },
  {
    name: "kinesiotaping",
    quelle: join(QUELLEN, "kinesiotaping.png"),
    zuschnitt: "attention",
    seitenverhaeltnis: 3 / 2,
  },
];

async function verarbeiten() {
  await mkdir(ZIEL, { recursive: true });

  for (const bild of BILDER) {
    console.log(`\n${bild.name}`);

    for (const breite of BREITEN) {
      const hoehe = Math.round(breite / bild.seitenverhaeltnis);
      const basis = sharp(bild.quelle).resize(breite, hoehe, {
        fit: "cover",
        position: bild.zuschnitt,
      });

      await basis
        .clone()
        .avif({ quality: 55, effort: 6 })
        .toFile(join(ZIEL, `${bild.name}-${breite}.avif`));

      await basis
        .clone()
        .webp({ quality: 72 })
        .toFile(join(ZIEL, `${bild.name}-${breite}.webp`));

      console.log(`  ${breite}px fertig`);
    }

    await sharp(bild.quelle)
      .resize(1600, Math.round(1600 / bild.seitenverhaeltnis), {
        fit: "cover",
        position: bild.zuschnitt,
      })
      .jpeg({ quality: 78, mozjpeg: true })
      .toFile(join(ZIEL, `${bild.name}.jpg`));

    const unscharf = await sharp(bild.quelle)
      .resize(20, Math.round(20 / bild.seitenverhaeltnis), { fit: "cover" })
      .blur(1.4)
      .webp({ quality: 30 })
      .toBuffer();

    console.log(`  jpg + Platzhalter fertig`);
    console.log(
      `  platzhalter: data:image/webp;base64,${unscharf.toString("base64")}`,
    );
  }
}

verarbeiten();
