"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useRuhig } from "@/components/a11y/Einstellungen";
import { lebhaft } from "@/lib/bewegung";

/**
 * Feine Linie am oberen Rand, die den Lesefortschritt der Seite zeigt.
 *
 * Auf den langen Seiten - vor allem "Ablauf & Abrechnung" - beantwortet sie
 * eine Frage, die sich sonst jeder selbst stellen muss: Wie viel kommt da
 * noch? Das ist der eigentliche Grund fuer die Linie; dass die Seite
 * dadurch lebendiger wirkt, ist der willkommene Nebeneffekt.
 *
 * Bewusst 2 px hoch und in der warmen Akzentfarbe: Sie soll am Rand des
 * Blickfelds mitlaufen, nicht mit der Kopfzeile um Aufmerksamkeit
 * konkurrieren. Deshalb liegt sie auch UNTER der Kopfzeile in der
 * Stapelreihenfolge und laeuft nicht ueber deren Inhalt.
 *
 * Bei "Bewegung reduzieren" faellt sie ganz weg. Eine Fortschrittsanzeige,
 * die bei jeder Mausraddrehung zuckt, ist genau das, was diese Einstellung
 * verhindern soll - und sie traegt keine Information, die sonst fehlen
 * wuerde.
 */
export default function Lesefortschritt() {
  const ruhig = useRuhig();
  const { scrollYProgress } = useScroll();

  /* Feder statt harter Kopplung: Ohne sie springt die Linie bei jedem
     Scrollschritt hart weiter. Wenig Steifigkeit, viel Daempfung - das
     laeuft nach, statt zu zappeln. */
  const breite = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  if (ruhig || !lebhaft) return null;

  return (
    <motion.div
      aria-hidden="true"
      /* Die Farbe steht in globals.css, nicht hier: Auf der Startseite gilt
         die Golden-Calm-Palette (Gold), auf allen uebrigen Seiten der warme
         Petrol-Akzent. Als Inline-Angabe waere das nicht zu unterscheiden -
         Inline schlaegt jede Regel. */
      className="lesefortschritt fixed inset-x-0 top-0 z-40 h-[2px] origin-left"
      style={{ scaleX: breite }}
    />
  );
}
