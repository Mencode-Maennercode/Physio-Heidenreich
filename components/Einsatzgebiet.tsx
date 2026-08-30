"use client";

import { motion } from "motion/react";
import { useRuhig } from "@/components/a11y/Einstellungen";
import { RUHIGE_KURVE } from "@/components/motion/Enthuellen";
import { einsatzgebiet } from "@/lib/site-config";

/**
 * Schematische Karte des Einsatzgebiets.
 *
 * Bewusst keine echte Kartenkomponente: Google Maps oder OpenStreetMap wuerden
 * den Browser des Besuchers mit einem fremden Server verbinden - bei einer
 * Gesundheitsseite ein Einwilligungsthema, und damit ein Cookie-Banner auf
 * einer Seite, die sonst keines braucht.
 *
 * Die Geometrie ist eine Vereinfachung, keine Vermessung: Ahr und Rhein als
 * Orientierung, Orte an ungefaehr richtiger Stelle. Wer den genauen Weg wissen
 * will, ruft an - genau das ist die Aussage der Sektion.
 *
 * Fuer Screenreader ist die Grafik ausgeblendet; daneben steht dieselbe
 * Information als echte Liste.
 */

type Ort = {
  name: string;
  x: number;
  y: number;
  kern: boolean;
  /**
   * Lage der Beschriftung zum Punkt. Die Orte im Ahrtal liegen tatsächlich
   * dicht beieinander - nebeneinandergesetzte Beschriftungen überlagern sich
   * dort unweigerlich. Deshalb wechseln sie entlang des Tals zwischen oben
   * und unten.
   */
  lage: "oben" | "unten" | "rechts" | "links";
};

/*
  Nur die Orte, die auch wirklich gefahren werden. Adenau, Niederzissen und
  Brohltal standen hier fruehers als Punkte - sie wieder aufzunehmen hiesse,
  auf der Karte ein Gebiet zu zeigen, das in der Liste daneben fehlt.
*/
const ORTE: Ort[] = [
  { name: "Altenahr", x: 240, y: 350, kern: true, lage: "oben" },
  { name: "Grafschaft", x: 424, y: 188, kern: true, lage: "oben" },
  { name: "Bad Neuenahr-Ahrweiler", x: 362, y: 318, kern: true, lage: "unten" },
  { name: "Heimersheim", x: 470, y: 306, kern: true, lage: "oben" },
  { name: "Bad Bodendorf", x: 556, y: 298, kern: true, lage: "unten" },
  { name: "Sinzig", x: 640, y: 296, kern: true, lage: "oben" },
  { name: "Remagen", x: 690, y: 190, kern: true, lage: "rechts" },
];

/** Beschriftungsposition und -ausrichtung aus der Lage ableiten. */
function beschriftung(ort: Ort) {
  switch (ort.lage) {
    case "oben":
      return { x: ort.x, y: ort.y - 17, anker: "middle" as const };
    case "unten":
      return { x: ort.x, y: ort.y + 27, anker: "middle" as const };
    case "links":
      return { x: ort.x - 17, y: ort.y + 5, anker: "end" as const };
    default:
      return { x: ort.x + 17, y: ort.y + 5, anker: "start" as const };
  }
}

/** Ahr: von Westen kommend, muendet bei Sinzig in den Rhein. */
const AHR =
  "M 74 342 C 150 318, 200 356, 252 336 C 320 310, 350 322, 404 312 C 470 300, 520 306, 572 294 C 606 286, 626 296, 664 300";

/** Rhein: von Sued nach Nord am oestlichen Rand. */
const RHEIN =
  "M 712 470 C 690 400, 700 350, 668 300 C 646 264, 668 226, 664 176 C 662 132, 686 96, 700 40";

export default function Einsatzgebiet() {
  const ruhig = useRuhig();

  const flussUebergang = (verzoegerung: number) =>
    ruhig
      ? { duration: 0 }
      : { duration: 2.2, delay: verzoegerung, ease: RUHIGE_KURVE };

  return (
    <div className="grid items-center gap-12 md:grid-cols-[1.25fr_1fr]">
      {/*
        Auf schmalen Schirmen bleibt die Karte weg.

        Die Zeichenfläche ist 800 Einheiten breit; auf einem 390-px-Handy
        schrumpfen die 14-px-Ortsnamen auf gut 7 px - unlesbar, und damit
        schlechter als gar keine Karte. Die Ortslisten daneben tragen dieselbe
        Information vollständig.
      */}
      <div className="relative hidden md:block">
        <svg
          viewBox="0 0 800 500"
          className="w-full"
          role="presentation"
          aria-hidden="true"
        >
          {/* Ahr - neutrale Geografie, deshalb gedaempft statt hervorgehoben */}
          <motion.path
            d={AHR}
            fill="none"
            stroke="var(--ui-text-leise)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.55"
            initial={ruhig ? false : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={flussUebergang(0)}
          />
          {/* Rhein - kraeftiger, damit die Orientierung stimmt */}
          <motion.path
            d={RHEIN}
            fill="none"
            stroke="var(--ui-text-leise)"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.7"
            initial={ruhig ? false : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={flussUebergang(0.25)}
          />
          {/* Keine eingezeichnete Route: Vor dem ersten Patienten gibt es
              noch keine gefahrene Strecke - eine Linie haette eine Tour
              gezeigt, die es noch nicht gibt. Die Orte sprechen fuer sich,
              die Route entsteht erst mit echten Terminen. */}

          {ORTE.map((ort, i) => {
            const marke = beschriftung(ort);
            return (
              <motion.g
                key={ort.name}
                initial={ruhig ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-15% 0px" }}
                transition={
                  ruhig
                    ? { duration: 0 }
                    : { duration: 0.6, delay: 0.7 + i * 0.09 }
                }
              >
                {ort.kern ? (
                  <circle
                    cx={ort.x}
                    cy={ort.y}
                    r={11}
                    fill="none"
                    stroke="var(--ui-akzent-warm)"
                    strokeWidth="1"
                    opacity="0.4"
                  />
                ) : null}
                <circle
                  cx={ort.x}
                  cy={ort.y}
                  r={ort.kern ? 5 : 3.5}
                  fill={
                    ort.kern ? "var(--ui-akzent-warm)" : "var(--ui-text-leise)"
                  }
                />
                <text
                  x={marke.x}
                  y={marke.y}
                  textAnchor={marke.anker}
                  fill={ort.kern ? "var(--ui-text)" : "var(--ui-text-leise)"}
                  fontSize="14"
                  fontFamily="var(--font-inter), sans-serif"
                  letterSpacing="0.02em"
                >
                  {ort.name}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>

      {/* Dieselbe Information als Text - fuer Screenreader die einzige, fuer
          alle anderen die genauere Fassung. */}
      <div>
        <h3 className="feld-marke">Kreis Ahrweiler</h3>
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
          {einsatzgebiet.kern.map((ort) => (
            <li key={ort} className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-akzent-warm"
              />
              {ort}
            </li>
          ))}
        </ul>

        {/* Nur zeigen, wenn es tatsaechlich Orte auf Anfrage gibt - eine
            leere Ueberschrift waere schlimmer als keine. */}
        {einsatzgebiet.rand.length > 0 ? (
          <>
            <h3 className="feld-marke mt-9">Auf Anfrage</h3>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-leise">
              {einsatzgebiet.rand.map((ort) => (
                <li key={ort} className="flex items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className="size-1.5 rounded-full bg-leise"
                  />
                  {ort}
                </li>
              ))}
            </ul>
          </>
        ) : null}

        <p className="lesespalte mt-9 text-leise">{einsatzgebiet.hinweis}</p>
      </div>
    </div>
  );
}
