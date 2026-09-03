/**
 * Holt die Platzhalter-Medien und bereitet sie fuer die Seite auf.
 *
 *   node scripts/medien.mjs          alles
 *   node scripts/medien.mjs bilder   nur Bilder
 *   node scripts/medien.mjs videos   nur Videos
 *
 * Warum lokal statt per Fremd-URL eingebunden:
 *   - keine Verbindung des Besucher-Browsers zu einem fremden Server
 *     (bei einer Gesundheitsseite sonst ein Datenschutzthema)
 *   - die Seite bleibt heil, wenn eine Quelle verschwindet
 *   - deutlich schneller, weil alles aus derselben Verbindung kommt
 *
 * Die Rohdateien liegen in public/media/_raw/ und sind von Git ausgenommen.
 * Ins Repo kommen nur die fertig optimierten Fassungen.
 */

import { mkdir, writeFile, readFile, access } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import sharp from "sharp";

/*
  Welche Bilder mit KI entstanden sind - dieselbe Liste, die auch die
  Anzeige nutzt (lib/ki-medien.ts liest dieselbe Datei). Doppelt gepflegte
  Listen wuerden auseinanderlaufen, und dann waere ein Bild entweder
  unmarkiert oder falsch markiert.
*/
const kiListe = JSON.parse(
  await readFile(new URL("../lib/ki-medien.json", import.meta.url), "utf8"),
);
const KI_BILDER = new Set(kiListe.bilder);

/**
 * Maschinenlesbare Herkunftsangabe nach IPTC.
 *
 * Ergaenzt die sichtbare Kennzeichnung am Bild, ersetzt sie NICHT: Artikel
 * 50 der EU-KI-Verordnung verlangt ausdruecklich eine fuer Menschen
 * wahrnehmbare Angabe, eine reine Dateimarkierung genuegt dafuer nicht.
 * Ihr Nutzen liegt woanders - Google liest dieses Feld und kennzeichnet
 * Treffer in der Bildersuche entsprechend. Kostet nichts und aendert am
 * Bild selbst nichts.
 *
 * `trainedAlgorithmicMedia` ist der IPTC-Code fuer "mit einem trainierten
 * Modell erzeugt".
 */
function xmpFuerKi(beschreibung) {
  const text = beschreibung.replace(/[<>&]/g, (z) =>
    z === "<" ? "&lt;" : z === ">" ? "&gt;" : "&amp;",
  );
  return `<?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
 <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <rdf:Description rdf:about=""
    xmlns:Iptc4xmpExt="http://iptc.org/std/Iptc4xmpExt/2008-02-29/"
    xmlns:dc="http://purl.org/dc/elements/1.1/">
   <Iptc4xmpExt:DigitalSourceType>http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia</Iptc4xmpExt:DigitalSourceType>
   <dc:description><rdf:Alt><rdf:li xml:lang="x-default">${text}</rdf:li></rdf:Alt></dc:description>
  </rdf:Description>
 </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>`;
}

const ausfuehren = promisify(execFile);
const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Die Rohdateien liegen bewusst AUSSERHALB von public/.
 *
 * Alles unter public/ wird von Next unveraendert nach out/ kopiert - die
 * unkomprimierten Quellen (allein das Hero-Video 34 MB) waeren sonst bei
 * jedem Deploy mit auf dem Webspace gelandet.
 */
const ROH = join(WURZEL, ".medien-roh");
const ZIEL = join(WURZEL, "public", "media");

/** Breiten, in denen jedes Bild erzeugt wird. */
const BREITEN = [640, 1024, 1600];

/**
 * Alle Bilder stammen von Pexels und stehen unter der Pexels-Lizenz:
 * kostenlos nutzbar, auch geschaeftlich, ohne Namensnennungspflicht.
 * Die Nennung in CREDITS.md erfolgt trotzdem - fuer den Tag, an dem jemand
 * fragt, woher ein Bild kommt.
 *
 * `zuschnitt` steuert, welcher Bildbereich beim Beschneiden erhalten bleibt.
 */
const BILDER = [
  {
    name: "hero",
    id: 5793788,
    beschreibung: "Physiotherapeutin dehnt den Arm einer Patientin in einem sonnigen Raum",
    alt: "Physiotherapeutin bewegt behutsam den Arm einer liegenden Person in einem hellen Raum",
    zuschnitt: "attention",
    seitenverhaeltnis: 16 / 9,
  },
  {
    name: "haende",
    id: 5793694,
    beschreibung: "Hände an der Schulter einer bekleideten Person, helles Licht",
    alt: "Zwei Hände liegen ruhig an der Schulter einer Person in hellem Hemd",
    zuschnitt: "attention",
    seitenverhaeltnis: 4 / 5,
  },
  {
    name: "behandlung",
    id: 17553844,
    beschreibung: "Behandlung am Rücken, die Person sitzt bekleidet auf einem Sofa",
    alt: "Hände arbeiten am Rücken einer bekleideten Person, die auf einem Sofa sitzt",
    zuschnitt: "attention",
    seitenverhaeltnis: 3 / 2,
  },
  {
    name: "angehoerige",
    id: 7551671,
    beschreibung: "Jüngere Frau und älterer Mann sitzen nebeneinander in einem hellen Zimmer",
    alt: "Jüngere Frau sitzt neben einem älteren Mann in einem hellen Zimmer, beide im Gespräch",
    zuschnitt: "attention",
    seitenverhaeltnis: 3 / 2,
  },
  {
    name: "treppe",
    id: 29372743,
    beschreibung: "Ältere Frau wird beim Treppensteigen im eigenen Haus gestützt",
    alt: "Ältere Frau steigt eine Treppe im Haus, eine zweite Person stützt sie am Arm",
    zuschnitt: "attention",
    seitenverhaeltnis: 4 / 5,
  },
  {
    name: "wohnraum",
    id: 31658575,
    beschreibung: "Sessel mit Decken, Sonnenstreifen an der Wand",
    alt: "Sessel mit übergeworfenen Decken, Sonnenlicht wirft Streifen an die Wand",
    zuschnitt: "centre",
    seitenverhaeltnis: 4 / 5,
  },
  {
    name: "licht",
    id: 4003788,
    beschreibung: "Vorhang, Stehlampe und Sonnenlicht an einer Wand",
    alt: "Ruhige Zimmerecke mit Vorhang, Stehlampe und Sonnenlicht an der Wand",
    zuschnitt: "centre",
    seitenverhaeltnis: 3 / 2,
  },
  {
    name: "sessel",
    id: 16269015,
    beschreibung: "Beiger Ohrensessel am Fenster mit Pflanzen",
    alt: "Beiger Ohrensessel vor einem Fenster, daneben Zimmerpflanzen",
    zuschnitt: "centre",
    seitenverhaeltnis: 3 / 2,
  },
  {
    /**
     * PLATZHALTER und nichts anderes. Auf einer Personenmarke ist das Gesicht
     * einer fremden Person das Erste, was auffliegt - dieses Bild muss vor dem
     * Livegang durch ein echtes Foto ersetzt werden.
     */
    name: "portraet",
    id: 28494858,
    beschreibung: "PLATZHALTER — schlichtes Porträt vor hellem Hintergrund",
    alt: "Platzhalter für ein Porträtfoto",
    zuschnitt: "attention",
    seitenverhaeltnis: 4 / 5,
  },
  {
    name: "landschaft",
    id: 22845560,
    beschreibung: "Weinberge an einem Fluss — steht für die Ahr-Region",
    alt: "Weinberge auf sanften Hügeln an einem Fluss im Morgenlicht",
    zuschnitt: "centre",
    seitenverhaeltnis: 21 / 9,
  },
  {
    name: "flur",
    id: 33101005,
    beschreibung: "Ältere Frau mit Gehhilfe in einem hellen Flur",
    alt: "Ältere Frau geht mit einer Gehhilfe durch einen hellen Flur auf eine offene Tür zu",
    zuschnitt: "attention",
    seitenverhaeltnis: 3 / 2,
  },
];

/**
 * Videos werden auf 1600 px Breite, ohne Ton und stark komprimiert abgelegt.
 * Ein Hero-Video, das 27 MB wiegt, ist auf dem Land im Mobilfunknetz keine
 * Gestaltung mehr, sondern ein Hindernis.
 */
const VIDEOS = [
  {
    /**
     * PLATZHALTER, manuell ausgewaehlt - kein Pexels-ID-basierter Download.
     *
     * Zeigt eine Therapeutin, die die gestreckten Arme einer aelteren Frau in
     * einem hellen Wohnzimmer fuehrt - genau die Situation, die der Claim der
     * Seite beschreibt. Herkunft/Lizenz vor dem Livegang klaeren, siehe
     * CREDITS.md und die Pruefliste in der README.
     *
     * Wird NICHT ueber `npm run medien` neu erzeugt (keine ID zum Nachladen).
     * Bei Bedarf manuell: Rohdatei nach .medien-roh/hero.mp4 legen, dann
     * `node scripts/medien.mjs videos` ueberspringt sie wegen des Namens nicht
     * automatisch - im Zweifel Video-Verarbeitung fuer "hero" von Hand fahren.
     */
    name: "hero",
    id: null,
    quelle: "manuell (Downloads/1.mp4)",
    beschreibung:
      "Therapeutin führt die gestreckten Arme einer älteren Patientin in einem hellen Wohnzimmer",
    start: 0,
    dauer: 13.7,
  },
  {
    name: "behandlung",
    id: 5793301,
    beschreibung:
      "Hände arbeiten an einer Schulter, mit Tuch abgedeckt — Kopf der Behandlungsseite",
    start: 1,
    dauer: 10,
  },
  {
    name: "ablauf",
    id: 35161057,
    beschreibung:
      "Blätterschatten wandern über einen sonnenbeschienenen Vorhang — Kopf des Ablauf-Reiters",
    start: 0,
    dauer: 10,
  },
];

const bildUrl = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=2400`;

/**
 * Die Dateinamen der Videos enthalten Aufloesung UND Bildrate, und die ist
 * nicht bei allen Clips gleich. Ein fest zusammengesetzter Pfad trifft deshalb
 * mal und geht mal ins Leere (403). Verlaesslich ist nur der Umweg ueber die
 * Weiterleitung des Download-Links: Sie nennt den echten Dateinamen, aus dem
 * sich dann die kleinere HD-Fassung ableiten laesst.
 */
async function videoUrl(id) {
  const antwort = await fetch(`https://www.pexels.com/download/video/${id}/`, {
    redirect: "manual",
  });
  const ort = antwort.headers.get("location");
  if (!ort) throw new Error(`keine Weiterleitung für Video ${id}`);

  const hd = ort.replace(/-uhd_\d+_\d+_/, "-hd_1920_1080_");
  if (hd === ort) return ort;

  const kopf = await fetch(hd, { method: "HEAD" });
  return kopf.ok ? hd : ort;
}

async function vorhanden(pfad) {
  try {
    await access(pfad);
    return true;
  } catch {
    return false;
  }
}

async function laden(url, ziel) {
  if (await vorhanden(ziel)) {
    console.log(`  übersprungen (schon da): ${ziel.replace(WURZEL, "")}`);
    return;
  }
  const antwort = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
  });
  if (!antwort.ok) {
    throw new Error(`${antwort.status} ${antwort.statusText} bei ${url}`);
  }
  const daten = Buffer.from(await antwort.arrayBuffer());
  await writeFile(ziel, daten);
  console.log(
    `  geladen: ${ziel.replace(WURZEL, "")} (${(daten.length / 1024 / 1024).toFixed(1)} MB)`,
  );
}

async function bilderVerarbeiten() {
  console.log("\nBilder");
  await mkdir(ROH, { recursive: true });
  await mkdir(join(ZIEL, "bilder"), { recursive: true });

  for (const bild of BILDER) {
    const roh = join(ROH, `${bild.name}.jpg`);
    await laden(bildUrl(bild.id), roh);

    const quelle = sharp(roh);
    const { width: originalBreite } = await quelle.metadata();
    const xmp = xmpFuerKi(bild.alt);

    for (const breite of BREITEN) {
      // Nicht ueber die Originalgroesse hinaus hochrechnen - das erzeugt nur
      // grosse Dateien ohne mehr Bildinformation.
      if (originalBreite && breite > originalBreite) continue;

      const hoehe = Math.round(breite / bild.seitenverhaeltnis);
      let basis = sharp(roh).resize(breite, hoehe, {
        fit: "cover",
        position: bild.zuschnitt,
      });
      if (KI_BILDER.has(bild.name)) basis = basis.withXmp(xmp);

      await basis
        .clone()
        .avif({ quality: 55, effort: 6 })
        .toFile(join(ZIEL, "bilder", `${bild.name}-${breite}.avif`));

      await basis
        .clone()
        .webp({ quality: 72 })
        .toFile(join(ZIEL, "bilder", `${bild.name}-${breite}.webp`));
    }

    // Ein JPEG als letzte Rueckfalloption fuer sehr alte Browser.
    let gross = sharp(roh).resize(
      1600,
      Math.round(1600 / bild.seitenverhaeltnis),
      { fit: "cover", position: bild.zuschnitt },
    );
    if (KI_BILDER.has(bild.name)) gross = gross.withXmp(xmp);
    await gross
      .jpeg({ quality: 78, mozjpeg: true })
      .toFile(join(ZIEL, "bilder", `${bild.name}.jpg`));

    // Winziges, stark unscharfes Bild als Platzhalter waehrend des Ladens.
    const unscharf = await sharp(roh)
      .resize(20, Math.round(20 / bild.seitenverhaeltnis), { fit: "cover" })
      .blur(1.4)
      .webp({ quality: 30 })
      .toBuffer();
    bild.platzhalter = `data:image/webp;base64,${unscharf.toString("base64")}`;

    console.log(`  fertig: ${bild.name}`);
  }
}

async function videosVerarbeiten() {
  console.log("\nVideos");
  await mkdir(ROH, { recursive: true });
  await mkdir(join(ZIEL, "video"), { recursive: true });

  for (const video of VIDEOS) {
    if (video.id === null) {
      console.log(
        `  übersprungen (manuell, keine ID zum Nachladen): ${video.name}`,
      );
      continue;
    }

    const roh = join(ROH, `${video.name}.mp4`);
    await laden(await videoUrl(video.id), roh);

    const zielDatei = join(ZIEL, "video", `${video.name}.mp4`);
    await ausfuehren("ffmpeg", [
      "-y",
      "-ss", String(video.start),
      "-t", String(video.dauer),
      "-i", roh,
      "-an", // kein Ton: das Video laeuft ohnehin stumm
      "-vf", "scale=1600:-2",
      "-c:v", "libx264",
      "-profile:v", "high",
      "-crf", "30",
      "-preset", "slow",
      "-pix_fmt", "yuv420p",
      "-movflags", "+faststart",
      zielDatei,
    ]);

    // Standbild aus der Mitte: dient als Poster und als vollwertiger Ersatz,
    // wenn jemand "weniger Bewegung" eingestellt hat.
    const posterRoh = join(ROH, `${video.name}-poster.jpg`);
    await ausfuehren("ffmpeg", [
      "-y",
      "-ss", String(video.start + Math.min(2, video.dauer / 2)),
      "-i", roh,
      "-frames:v", "1",
      "-q:v", "2",
      posterRoh,
    ]);

    for (const breite of BREITEN) {
      const basis = sharp(posterRoh).resize(breite, null, { fit: "inside" });
      await basis
        .clone()
        .avif({ quality: 55, effort: 6 })
        .toFile(join(ZIEL, "video", `${video.name}-poster-${breite}.avif`));
      await basis
        .clone()
        .webp({ quality: 72 })
        .toFile(join(ZIEL, "video", `${video.name}-poster-${breite}.webp`));
    }

    await sharp(posterRoh)
      .resize(1600, null, { fit: "inside" })
      .jpeg({ quality: 78, mozjpeg: true })
      .toFile(join(ZIEL, "video", `${video.name}-poster.jpg`));

    console.log(`  fertig: ${video.name}`);
  }
}

/**
 * Apple-Touch-Icon als PNG.
 *
 * Fuer app/icon.svg reicht Next ein SVG; das Apple-Touch-Icon aber verlangt
 * ein Rasterbild - ein apple-icon.svg wird beim Bauen schlicht ignoriert und
 * fehlt dann auf dem Startbildschirm eines iPhones.
 */
async function symboleSchreiben() {
  const marke = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">
    <rect width="180" height="180" fill="#1B3535"/>
    <g transform="translate(26 26) scale(2.66)">
      <path d="M10.14 32 A16 16 0 0 1 37.86 16" stroke="#F8F7F3" stroke-width="3" stroke-linecap="round" fill="none"/>
      <path d="M13.66 25.82 A10.5 10.5 0 0 1 29.25 14.91" stroke="#B9A47E" stroke-width="1.6" stroke-linecap="round" fill="none"/>
    </g>
  </svg>`;

  await sharp(Buffer.from(marke))
    .resize(180, 180)
    .png()
    .toFile(join(WURZEL, "app", "apple-icon.png"));

  console.log("app/apple-icon.png geschrieben");
}

async function nachweisSchreiben() {
  const zeilen = [
    "# Herkunft und Lizenz der Medien",
    "",
    "Alle Dateien in diesem Ordner sind **Platzhalter**. Sie stammen von",
    "[Pexels](https://www.pexels.com) und stehen unter der",
    "[Pexels-Lizenz](https://www.pexels.com/de-de/lizenz/): kostenlose Nutzung,",
    "auch geschäftlich, ohne Pflicht zur Namensnennung. Die Nennung hier ist",
    "freiwillig — sie soll später beantworten können, woher eine Datei kam.",
    "",
    "Erneut erzeugen: `npm run medien`",
    "",
    "## Bilder",
    "",
    "| Datei | Quelle | Inhalt |",
    "| --- | --- | --- |",
    ...BILDER.map(
      (b) =>
        `| \`bilder/${b.name}-*\` | [Pexels ${b.id}](https://www.pexels.com/de-de/foto/${b.id}/) | ${b.beschreibung} |`,
    ),
    "",
    "## Videos",
    "",
    "| Datei | Quelle | Inhalt |",
    "| --- | --- | --- |",
    ...VIDEOS.map((v) =>
      v.id === null
        ? `| \`video/${v.name}.mp4\` | **${v.quelle} — Lizenz ungeklärt, vor Livegang prüfen** | ${v.beschreibung} |`
        : `| \`video/${v.name}.mp4\` | [Pexels ${v.id}](https://www.pexels.com/de-de/video/${v.id}/) | ${v.beschreibung} |`,
    ),
    "",
    "## Beim Austausch beachten",
    "",
    "Die Bildsprache ist Absicht: Nähe, Hände, Licht, Ruhe. Weder Sport- und",
    "Fitnessmotive noch Klinik- und Pflegebettmotive. Menschen möglichst ohne",
    "erkennbares Gesicht in Behandlungssituationen — das verlangt das",
    "Heilmittelwerbegesetz ebenso wie das Persönlichkeitsrecht.",
    "",
  ];

  await writeFile(join(ZIEL, "CREDITS.md"), zeilen.join("\n"), "utf8");
  console.log("\nCREDITS.md geschrieben");
}

/**
 * Schreibt die Bildliste als TypeScript-Datei, damit Alt-Texte und
 * Unschaerfe-Platzhalter im Code typsicher zur Verfuegung stehen und nicht
 * an zwei Stellen gepflegt werden muessen.
 */
async function bildlisteSchreiben() {
  const eintraege = BILDER.map(
    (b) => `  ${b.name}: {
    alt: ${JSON.stringify(b.alt)},
    seitenverhaeltnis: ${b.seitenverhaeltnis.toFixed(6)},
    platzhalter: ${JSON.stringify(b.platzhalter ?? "")},
  },`,
  ).join("\n");

  const inhalt = `/**
 * Erzeugt von scripts/medien.mjs - nicht von Hand aendern.
 * Neu erzeugen mit: npm run medien
 */

export const bilder = {
${eintraege}
} as const;

export type BildName = keyof typeof bilder;

export const breiten = [${BREITEN.join(", ")}] as const;
`;

  await writeFile(join(WURZEL, "lib", "bilder.ts"), inhalt, "utf8");
  console.log("lib/bilder.ts geschrieben");
}

async function main() {
  const was = process.argv[2] ?? "alles";

  if (was === "alles" || was === "bilder") await bilderVerarbeiten();
  if (was === "alles" || was === "videos") await videosVerarbeiten();

  // Die Unschaerfe-Platzhalter entstehen erst beim Bildlauf. Wird nur "videos"
  // gebaut, bleibt eine vorhandene lib/bilder.ts unangetastet.
  if (was === "alles" || was === "bilder") {
    await bildlisteSchreiben();
  }
  // Kostet Millisekunden und darf deshalb bei jedem Lauf mitlaufen.
  await symboleSchreiben();
  await nachweisSchreiben();

  console.log("\nFertig.");
}

main().catch((fehler) => {
  console.error("\nAbgebrochen:", fehler.message);
  process.exit(1);
});
