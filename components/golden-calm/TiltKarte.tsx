"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRuhig } from "@/components/a11y/Einstellungen";
import { cn } from "@/lib/utils";

/**
 * Karte, die sich beim Hover leicht zum Zeiger neigt.
 *
 * Neigung ist bewusst klein (max. ~6°) - genug fuer ein "haptisches" Gefuehl,
 * ohne dass Text auf der Karte kippelig oder unlesbar wird. Bei "weniger
 * Bewegung" bleibt die Karte flach, Inhalt und Layout aendern sich nicht.
 */
export default function TiltKarte({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const ruhig = useRuhig();

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const federEinstellung = { stiffness: 220, damping: 22, mass: 0.5 };
  const fmx = useSpring(mx, federEinstellung);
  const fmy = useSpring(my, federEinstellung);

  const rotX = useTransform(fmy, [0, 1], [6, -6]);
  const rotY = useTransform(fmx, [0, 1], [-6, 6]);

  const bewegen = (e: React.MouseEvent<HTMLDivElement>) => {
    if (ruhig || !ref.current) return;
    const feld = ref.current.getBoundingClientRect();
    mx.set((e.clientX - feld.left) / feld.width);
    my.set((e.clientY - feld.top) / feld.height);
  };

  const zuruecksetzen = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={bewegen}
      onMouseLeave={zuruecksetzen}
      style={
        ruhig
          ? undefined
          : { rotateX: rotX, rotateY: rotY, transformPerspective: 900 }
      }
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
