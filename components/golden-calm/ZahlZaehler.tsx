"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "motion/react";
import { useRuhig } from "@/components/a11y/Einstellungen";

/**
 * Zahl, die beim Erscheinen von 0 hochzaehlt.
 *
 * Bei "weniger Bewegung" steht die Zielzahl sofort da - Zaehlen ist ein
 * Schmuckeffekt, kein Informationstraeger, der ausgesetzt werden duerfte.
 */
export default function ZahlZaehler({
  ziel,
  className,
}: {
  ziel: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const gesehen = useInView(ref, { once: true, margin: "-10%" });
  const ruhig = useRuhig();

  const wert = useMotionValue(0);
  const gefedert = useSpring(wert, { stiffness: 60, damping: 18 });

  useEffect(() => {
    if (gesehen && !ruhig) wert.set(ziel);
  }, [gesehen, ruhig, ziel, wert]);

  useEffect(() => {
    if (!ref.current) return;
    if (ruhig) {
      ref.current.textContent = String(ziel);
      return;
    }
    const abmelden = gefedert.on("change", (v) => {
      if (ref.current) ref.current.textContent = String(Math.round(v));
    });
    return () => abmelden();
  }, [gefedert, ruhig, ziel]);

  return (
    <span ref={ref} className={className}>
      0
    </span>
  );
}
