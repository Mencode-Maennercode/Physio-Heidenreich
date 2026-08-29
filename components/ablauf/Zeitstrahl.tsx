"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useSpring } from "motion/react";
import { useRuhig } from "@/components/a11y/Einstellungen";
import { stationen } from "@/lib/content/ablauf";

/**
 * Die vier Stationen des Ablaufs.
 *
 * Die senkrechte Linie fuellt sich, waehrend man durch den Abschnitt scrollt -
 * das ist die einzige Animation auf dieser Seite, die etwas aussagt statt nur
 * zu schmuecken: Sie zeigt, wie weit man im Ablauf ist.
 *
 * Damit das schon beim ersten Radschub sichtbar wird, greifen zwei Dinge
 * ineinander: Der Fuellstand startet, sobald die Liste ueberhaupt ins Bild
 * kommt (nicht erst auf halber Hoehe), und jede Station quittiert ihr
 * Erreichen selbst - der Punkt auf der Schiene fuellt sich, die Nummer tritt
 * hervor. Die Rueckmeldung haengt damit nicht mehr an der Gesamtlaenge des
 * Abschnitts, sondern an der einzelnen Station.
 *
 * Bei "weniger Bewegung" steht die Linie voll da und alle Stationen sind
 * aktiv. Der Inhalt ist in beiden Faellen vollstaendig - es ist eine
 * geordnete Liste, kein Karussell.
 */
export default function Zeitstrahl() {
  const bereich = useRef<HTMLOListElement>(null);
  const ruhig = useRuhig();

  const { scrollYProgress } = useScroll({
    target: bereich,
    // Frueher Start, frueher Schluss: Die Linie reagiert dadurch spuerbar auf
    // kurze Scrollwege, statt erst auf halber Bildschirmhoehe anzuspringen.
    offset: ["start 90%", "end 60%"],
  });

  const gefuellt = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <ol ref={bereich} className="relative">
      {/* Schiene und Fuellstand. Auf kleinen Schirmen links, ab lg mittig
          zwischen Nummer und Text. */}
      <div
        aria-hidden="true"
        className="absolute top-2 bottom-2 left-[0.4375rem] w-px bg-linie-warm lg:left-[calc(9rem+0.4375rem)]"
      >
        <motion.div
          className="h-full w-full origin-top bg-akzent-warm"
          style={ruhig ? { scaleY: 1 } : { scaleY: gefuellt }}
        />
      </div>

      {stationen.map((station) => (
        <Station key={station.nummer} station={station} ruhig={ruhig} />
      ))}
    </ol>
  );
}

/**
 * Eine Station. Sie beobachtet sich selbst: Sobald ihr oberer Rand knapp
 * ueber die Mitte des Bildschirms wandert, gilt sie als erreicht. `once`
 * sorgt dafuer, dass beim Zurueckscrollen nichts wieder ausgeht - der Ablauf
 * ist eine Abfolge, kein Zustand.
 */
function Station({
  station,
  ruhig,
}: {
  station: (typeof stationen)[number];
  ruhig: boolean;
}) {
  const punkt = useRef<HTMLLIElement>(null);
  const erreicht = useInView(punkt, {
    once: true,
    margin: "0px 0px -45% 0px",
  });
  const aktiv = ruhig || erreicht;

  return (
    <li
      ref={punkt}
      className="relative grid gap-x-10 gap-y-3 pb-11 pl-10 last:pb-0 lg:grid-cols-[9rem_1fr] lg:pl-0"
    >
      {/* Punkt auf der Schiene. Fuellt sich, wenn die Station erreicht ist -
          die kleinste mögliche Rueckmeldung, aber sie kommt sofort. */}
      <motion.span
        aria-hidden="true"
        className="absolute top-2 left-0 size-3.5 rounded-full border-2 border-akzent-warm bg-warm-flaeche lg:left-[9rem]"
        animate={
          ruhig
            ? undefined
            : {
                backgroundColor: aktiv
                  ? "var(--ui-akzent-warm)"
                  : "var(--ui-warm-flaeche)",
                scale: aktiv ? 1.15 : 1,
              }
        }
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="lg:pr-10 lg:text-right">
        <motion.span
          className="schrift-display block text-[2.5rem] leading-none text-akzent-warm"
          animate={ruhig ? undefined : { opacity: aktiv ? 1 : 0.35 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {station.nummer}
        </motion.span>
      </div>

      <div className="lg:pl-10">
        {/* h2, nicht h3: Die vier Stationen sind die ersten Abschnitte
            unter der Seitenüberschrift - dazwischen liegt keine Ebene. */}
        <h2 className="schrift-display text-[1.5rem] leading-tight">
          {station.titel}
        </h2>
        <p className="lesespalte-weit mt-2.5 text-[1.02rem] text-leise">
          {station.text}
        </p>

        <ul className="mt-4 flex flex-col gap-2">
          {station.details.map((detail) => (
            <li key={detail} className="flex items-baseline gap-3.5">
              <span
                aria-hidden="true"
                className="size-1.5 flex-none translate-y-[-0.15em] rounded-full bg-akzent-warm"
              />
              <span className="text-[0.98rem]">{detail}</span>
            </li>
          ))}
        </ul>

        <p className="lesespalte-weit mt-4 border-l border-linie-warm pl-5 text-[0.95rem] text-leise">
          {station.hinweis}
        </p>
      </div>
    </li>
  );
}
