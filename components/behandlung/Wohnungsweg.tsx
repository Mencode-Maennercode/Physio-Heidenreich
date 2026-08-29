"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useRuhig } from "@/components/a11y/Einstellungen";
import { RUHIGE_KURVE } from "@/components/motion/Enthuellen";
import { wohnungsweg } from "@/lib/content/behandlung";
import { cn } from "@/lib/utils";

/**
 * Der gescrollte Weg durch die Wohnung.
 *
 * Warum kein WebGL: Die Tiefe entsteht aus einer CSS-3D-Drehung eines
 * SVG-Grundrisses. Das kostet keine zusätzliche Bibliothek, lädt sofort, läuft
 * auf jedem alten Handy und lässt sich vollständig stilllegen. Ein Three.js-
 * Aufbau sähe kaum anders aus, brächte aber mehrere Megabyte und – bei einer
 * Zielgruppe mit Schwindel und Gangunsicherheit – ein echtes Risiko mit.
 *
 * Ebenso bewusst: Das Scrollen bleibt normal. Die Szene steht still, während
 * der Inhalt durchzieht (sticky), statt dass die Seite das Scrollen übernimmt.
 * Entkoppeltes Scrollen ist genau das, was bei Vestibularstörungen Übelkeit
 * auslöst – und wäre auf einer Physiotherapie-Seite besonders daneben.
 *
 * Drei Fassungen desselben Inhalts:
 *   - die Bühne (ab lg, volle Bewegung)
 *   - die Liste (kleine Schirme, sowie immer bei "weniger Bewegung")
 *   - eine nur für Hilfsmittel sichtbare Liste innerhalb der Bühne
 */

/** Räume des Grundrisses. Zeichenfläche 600 × 420. */
const RAEUME = [
  { name: "Schlafzimmer", x: 50, y: 60, b: 150, h: 150 },
  { name: "Bad", x: 200, y: 60, b: 140, h: 150 },
  { name: "Wohnzimmer", x: 340, y: 60, b: 220, h: 150 },
  { name: "Flur", x: 50, y: 210, b: 350, h: 75 },
  { name: "Treppenhaus", x: 400, y: 210, b: 160, h: 180 },
];

/** Der Weg selbst - dieselben Punkte wie die Stationen im Inhalt. */
const WEG =
  "M 125 135 L 270 135 L 270 247 L 330 247 L 440 247 L 440 300 L 440 330 L 505 348";

/** Stufen im Treppenhaus, nur als Andeutung. */
const STUFEN = [262, 278, 294, 310, 326];

/** Mittelpunkt der Zeichenfläche - Bezug für die Kamerafahrt. */
const MITTE = { x: 300, y: 210 };

function Liste() {
  return (
    <div className="huelle sektion">
      <p className="augenbraue">{wohnungsweg.augenbraue}</p>
      <h2 className="schrift-display titel-mittel mt-6 max-w-[18ch]">
        {wohnungsweg.titel}
      </h2>
      <p className="lesespalte-weit mt-6 text-leise">{wohnungsweg.text}</p>

      <ol className="mt-12 border-t border-linie-warm">
        {wohnungsweg.stationen.map((station, i) => (
          <li
            key={station.marke}
            className="grid gap-x-10 gap-y-3 border-b border-linie-warm py-8 md:grid-cols-[minmax(0,10rem)_1fr]"
          >
            <span className="feld-marke text-akzent-warm">
              {String(i + 1).padStart(2, "0")} · {station.marke}
            </span>
            <div>
              <h3 className="schrift-display text-[1.35rem] leading-tight">
                {station.titel}
              </h3>
              <p className="lesespalte-weit mt-3 text-leise">{station.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function Wohnungsweg() {
  const ruhig = useRuhig();
  const bereich = useRef<HTMLDivElement>(null);
  const [aktiv, setzeAktiv] = useState(0);

  const { scrollYProgress } = useScroll({
    target: bereich,
    offset: ["start start", "end end"],
  });

  const anzahl = wohnungsweg.stationen.length;

  // Fortschritt des gezeichneten Weges. Etwas vorauseilend, damit die Linie
  // die Station erreicht hat, wenn ihr Text erscheint.
  const wegLaenge = useSpring(
    useTransform(scrollYProgress, [0, 0.92], [0.02, 1]),
    { stiffness: 80, damping: 26 },
  );

  useMotionValueEvent(scrollYProgress, "change", (wert) => {
    const index = Math.min(anzahl - 1, Math.max(0, Math.floor(wert * anzahl)));
    setzeAktiv(index);
  });

  if (ruhig) return <Liste />;

  const stelle = wohnungsweg.stationen[aktiv];

  return (
    <>
      {/*
        Auf kleinen Schirmen die Liste statt der Bühne.

        Die Bühne ist genau einen Bildschirm hoch. Auf einem Handy reicht das
        für Überschrift, Stationstext, Fortschritt UND Grundriss gerade so -
        bei 130 % Textgröße nicht mehr, dann würde unten etwas abgeschnitten.
        Die Entscheidung fällt über eine CSS-Klasse statt über gemessene
        Fensterbreite, damit beim ersten Bildaufbau nichts springt.
      */}
      <div className="lg:hidden">
        <Liste />
      </div>

      {/*
        Scrollweg der Buehne.

        Die Hoehe minus einem Bildschirm ist der Weg, ueber den sich die fuenf
        Stationen verteilen - vorher waren das 100vh pro Station, also ein
        ganzer Bildschirm Scrollen fuer jeden Textwechsel. Das liest sich wie
        Stillstand: Man scrollt und scrollt, und nichts passiert.

        Jetzt sind es rund 30vh pro Station. Kurz genug, dass schon der erste
        Radschub sichtbar etwas bewegt, und lang genug, dass zwei Saetze in
        Ruhe gelesen werden koennen, bevor die naechste Stelle kommt.
      */}
      <div
        ref={bereich}
        className="hidden lg:block"
        style={{ height: `${anzahl * 30 + 100}vh` }}
      >
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <div className="huelle grid w-full items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
            {/* --- Grundriss mit Tiefe ------------------------------------- */}
            <div className="relative" style={{ perspective: "1400px" }}>
              <motion.div
                className="origin-center"
                style={{ transformStyle: "preserve-3d" }}
                animate={{
                  // Flacher als eine klassische Isometrie: bei stärkerer
                  // Neigung verschwinden die hinteren Räume zu einem Strich.
                  rotateX: 48,
                  rotateZ: -26,
                  // Verschiebung so, dass die aktive Station Richtung Mitte
                  // rückt - aber nur teilweise. Bei vollem Ausgleich wandert
                  // der Grundriss an der letzten Station so weit, dass links
                  // der erste Raumname angeschnitten wird.
                  x: (MITTE.x - stelle.x) * 0.34,
                  y: (MITTE.y - stelle.y) * 0.34,
                  scale: 1.32,
                }}
                transition={{
                  type: "spring",
                  stiffness: 60,
                  damping: 22,
                  mass: 0.9,
                }}
              >
                <svg viewBox="0 0 600 420" className="w-full" aria-hidden="true">
                  {/* Räume. Die Beschriftung kippt mit der Ebene mit - genau so
                      sehen gezeichnete Grundrisse aus, und lesbar bleibt sie,
                      weil die Neigung flach ist.

                      War Off-White-basiert (helle Linien auf dunklem Grund),
                      jetzt Petrol-basiert fuer den hellen Greige-Grund - die
                      Rollen sind vertauscht, das Prinzip bleibt: zurueckhaltend,
                      nicht deckend. */}
                  {RAEUME.map((raum) => (
                    <g key={raum.name}>
                      <rect
                        x={raum.x}
                        y={raum.y}
                        width={raum.b}
                        height={raum.h}
                        fill="var(--ui-akzent-warm)"
                        fillOpacity="0.05"
                        stroke="var(--ui-akzent-warm)"
                        strokeOpacity="0.32"
                        strokeWidth="1.5"
                      />
                      <text
                        x={raum.x + raum.b / 2}
                        y={raum.y + 20}
                        textAnchor="middle"
                        fill="var(--ui-text-leise)"
                        fontSize="11"
                        letterSpacing="0.16em"
                        fontFamily="var(--font-inter), sans-serif"
                      >
                        {raum.name.toUpperCase()}
                      </text>
                    </g>
                  ))}

                  {/* Stufen */}
                  {STUFEN.map((y) => (
                    <line
                      key={y}
                      x1={410}
                      y1={y}
                      x2={550}
                      y2={y}
                      stroke="var(--ui-akzent-warm)"
                      strokeOpacity="0.3"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Der Weg - blasse Spur und darüber der gezeichnete Teil */}
                  {/* Der Weg: erst die blasse Spur, darueber der gezeichnete
                      Teil.

                      Der gezeichnete Teil laeuft in Navy, nicht im warmen
                      Akzent. Grund ist reiner Kontrast: Akzent-Warm (#6E5940)
                      und die blasse Spur liegen im Helligkeitswert zu dicht
                      beieinander, der Fortschritt war deshalb kaum vom noch
                      nicht gegangenen Weg zu unterscheiden. Navy setzt sich
                      auf Creme wie auf Greige deutlich ab - und bleibt in der
                      Palette, waehrend ein Signalrot auf einer Seite fuer
                      schwer erkrankte Menschen als Warnung gelesen wuerde. */}
                  <path
                    d={WEG}
                    fill="none"
                    stroke="var(--ui-text-leise)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.28"
                  />
                  <motion.path
                    d={WEG}
                    fill="none"
                    stroke="var(--ui-aktion)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ pathLength: wegLaenge }}
                  />

                  {/* Stationen */}
                  {wohnungsweg.stationen.map((station, i) => (
                    <g key={station.marke}>
                      <motion.circle
                        cx={station.x}
                        cy={station.y}
                        r={20}
                        fill="none"
                        stroke="var(--ui-akzent-warm)"
                        strokeWidth="1"
                        animate={{
                          opacity: aktiv === i ? 0.55 : 0,
                          scale: aktiv === i ? 1 : 0.6,
                        }}
                        style={{
                          transformOrigin: `${station.x}px ${station.y}px`,
                        }}
                        transition={{ duration: 0.5, ease: RUHIGE_KURVE }}
                      />
                      <motion.circle
                        cx={station.x}
                        cy={station.y}
                        r={7}
                        animate={{
                          fill:
                            aktiv >= i
                              ? "var(--ui-aktion)"
                              : "var(--ui-text-leise)",
                          scale: aktiv === i ? 1.25 : 1,
                        }}
                        style={{
                          transformOrigin: `${station.x}px ${station.y}px`,
                        }}
                        transition={{ duration: 0.4, ease: RUHIGE_KURVE }}
                      />
                    </g>
                  ))}
                </svg>
              </motion.div>
            </div>

            {/* --- Text ---------------------------------------------------- */}
            <div>
              <p className="augenbraue">{wohnungsweg.augenbraue}</p>
              <h2 className="schrift-display titel-klein mt-5 max-w-[18ch]">
                {wohnungsweg.titel}
              </h2>

              {/* Feste Höhe, damit der Grundriss beim Wechsel nicht springt.
                  Für Screenreader ist die Bühne ausgeblendet: Ein Inhalt, der
                  sich beim Scrollen austauscht, ist im Vorlesepuffer nicht
                  sinnvoll erfassbar. Die vollständige Liste steht stattdessen
                  weiter unten, sichtbar nur für Hilfsmittel. */}
              <div aria-hidden="true" className="relative mt-9 min-h-[15rem]">
                {wohnungsweg.stationen.map((station, i) => (
                  <motion.div
                    key={station.marke}
                    className={cn(
                      "top-0 left-0 w-full",
                      aktiv === i ? "relative" : "pointer-events-none absolute",
                    )}
                    animate={{
                      opacity: aktiv === i ? 1 : 0,
                      y: aktiv === i ? 0 : 14,
                    }}
                    transition={{ duration: 0.45, ease: RUHIGE_KURVE }}
                  >
                    <p className="feld-marke text-akzent-warm">
                      {String(i + 1).padStart(2, "0")} · {station.marke}
                    </p>
                    <h3 className="schrift-display mt-4 text-[clamp(1.5rem,3vw,2.2rem)] leading-tight">
                      {station.titel}
                    </h3>
                    <p className="lesespalte mt-5 text-[1.05rem] text-leise">
                      {station.text}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Fortschritt als Balkenreihe - zeigt, wie viel noch kommt. */}
              <ol className="mt-10 flex gap-2" aria-hidden="true">
                {wohnungsweg.stationen.map((station, i) => (
                  <li
                    key={station.marke}
                    className={cn(
                      "h-0.5 flex-1 transition-colors duration-500",
                      aktiv >= i ? "bg-aktion" : "bg-linie-warm",
                    )}
                  />
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* Für Hilfsmittel: derselbe Inhalt als vollständige Liste. */}
        <ol className="sr-only">
          {wohnungsweg.stationen.map((station) => (
            <li key={station.marke}>
              <h3>
                {station.marke}: {station.titel}
              </h3>
              <p>{station.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
