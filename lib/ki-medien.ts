/**
 * Welche Bilder und Videos mit kuenstlicher Intelligenz entstanden sind.
 *
 * Diese Liste ist der einzige Ort, an dem das steht. Sie gehoert NICHT in
 * lib/bilder.ts - die Datei erzeugt scripts/medien.mjs neu, jede Angabe
 * darin waere beim naechsten Lauf weg.
 *
 * WOFUER: Seit dem 2. August 2026 gilt Artikel 50 der EU-KI-Verordnung.
 * Wer Bild- oder Videomaterial veroeffentlicht, das kuenstlich erzeugt oder
 * bearbeitet wurde und echt wirken kann, muss das offenlegen - klar
 * erkennbar und spaetestens dann, wenn jemand den Inhalt zu sehen bekommt.
 * Ein Hinweis allein im Impressum genuegt dafuer ausdruecklich nicht.
 *
 * WIE: Jedes hier gelistete Medium bekommt ein kleines "KI" in der Ecke
 * (siehe components/Bild.tsx und components/RuhigesVideo.tsx), die Fusszeile
 * loest es einmal pro Seite in einem vollstaendigen Satz auf. Das Kuerzel am
 * Bild sagt bereits, worum es geht - ein blosses Sternchen oder eine Ziffer
 * waere die "vage Kennzeichnung", die die Leitlinie der EU-Kommission
 * ausdruecklich als unzureichend nennt.
 *
 * NICHT gelistet sind Aufnahmen ohne Personen (Raum, Licht, Landschaft) -
 * sie stammen von Pexels und sind keine KI-Erzeugnisse. Steht so auch im
 * Impressum unter "Bildnachweis"; beide Stellen muessen zusammenpassen.
 */

import liste from "./ki-medien.json";

/**
 * Die Namen selbst stehen in ki-medien.json, nicht hier.
 *
 * Grund: scripts/medien.mjs schreibt beim Erzeugen der Bilddateien
 * zusaetzlich eine maschinenlesbare Markierung hinein (XMP,
 * IPTC-Digitalquelle) - und ein Bauskript in .mjs kann kein TypeScript
 * lesen. Zwei getrennte Listen wuerden frueher oder spaeter auseinander
 * laufen, und dann waere entweder ein Bild unmarkiert oder eines falsch
 * markiert. Eine JSON-Datei koennen beide Seiten lesen.
 */

/** Bildnamen aus lib/bilder.ts, die mit KI entstanden sind. */
export const KI_BILDER: ReadonlySet<string> = new Set(liste.bilder);

/**
 * Videonamen aus components/RuhigesVideo.tsx, die mit KI entstanden sind.
 *
 * Noch leer und bewusst so: Die Herkunft der drei Clips ist nicht sicher
 * geklaert. Sobald feststeht, welche davon KI sind, gehoeren sie in die
 * JSON-Datei - dann erscheint das Kuerzel automatisch auch dort.
 */
export const KI_VIDEOS: ReadonlySet<string> = new Set(liste.videos);

/** Das Kuerzel am Medium selbst. Kurz, aber aus sich heraus verstaendlich. */
export const KI_KUERZEL = "KI";

/** Die Aufloesung in der Fusszeile. */
export const KI_HINWEIS =
  "KI — Bilder und Videos auf dieser Website wurden mit künstlicher Intelligenz bearbeitet oder erstellt.";

/** Dasselbe auf Englisch, fuer /en/. */
export const KI_HINWEIS_EN =
  "AI — images and videos on this website were edited or created using artificial intelligence.";
