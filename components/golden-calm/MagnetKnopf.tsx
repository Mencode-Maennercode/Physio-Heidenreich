"use client";

import { useRef, type CSSProperties } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import Link from "next/link";
import { useRuhig } from "@/components/a11y/Einstellungen";
import { cn } from "@/lib/utils";

/**
 * Magnetischer Knopf: folgt dem Zeiger innerhalb der eigenen Fläche leicht.
 *
 * Reiner Komfort-Effekt für Maus-Nutzer - auf Touch-Geräten passiert nichts
 * (keine `mousemove`-Events), und bei "weniger Bewegung" bleibt der Knopf
 * komplett starr. Die Bewegung selbst ist eine gedaempfte Feder, keine
 * direkte 1:1-Kopplung - das wirkt hochwertig statt hektisch.
 *
 * `children` traegt hier direkt die volle Knopf-Optik (Klassen + Farben) -
 * es gibt keine zusaetzliche innere Huelle, um doppelte Polsterung/Hoehe zu
 * vermeiden.
 */
export default function MagnetKnopf({
  href,
  children,
  className,
  style,
  stark = 0.35,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Wie stark der Knopf dem Zeiger folgt - 0.2 dezent, 0.5 verspielt. */
  stark?: number;
}) {
  const feldRef = useRef<HTMLDivElement>(null);
  const ruhig = useRuhig();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const fx = useSpring(x, { stiffness: 200, damping: 18, mass: 0.4 });
  const fy = useSpring(y, { stiffness: 200, damping: 18, mass: 0.4 });

  const bewegen = (e: React.MouseEvent<HTMLDivElement>) => {
    if (ruhig || !feldRef.current) return;
    const feld = feldRef.current.getBoundingClientRect();
    x.set((e.clientX - feld.left - feld.width / 2) * stark);
    y.set((e.clientY - feld.top - feld.height / 2) * stark);
  };

  const zuruecksetzen = () => {
    x.set(0);
    y.set(0);
  };

  const intern =
    !href.startsWith("http") &&
    !href.startsWith("tel:") &&
    !href.startsWith("mailto:") &&
    !href.startsWith("#");

  const gemeinsameKlasse = cn(
    "inline-flex items-center transition-transform duration-200",
    className,
  );

  return (
    <motion.div
      ref={feldRef}
      onMouseMove={bewegen}
      onMouseLeave={zuruecksetzen}
      style={ruhig ? undefined : { x: fx, y: fy }}
      className="inline-block"
    >
      {intern ? (
        <Link href={href} className={gemeinsameKlasse} style={style}>
          {children}
        </Link>
      ) : (
        <a
          href={href}
          className={gemeinsameKlasse}
          style={style}
          {...(href.startsWith("http")
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {children}
        </a>
      )}
    </motion.div>
  );
}
