"use client";

import { useRef, type CSSProperties } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRuhig } from "@/components/a11y/Einstellungen";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

/**
 * Bild mit Parallax: bewegt sich beim Scrollen minimal langsamer als die
 * Seite, dadurch wirkt die Karte raeumlich statt flach aufgeklebt.
 *
 * GSAP + ScrollTrigger statt Framer Motion hier bewusst: `scrub` koppelt die
 * Bewegung direkt an die Scroll-Position (kein "Nachschwingen" wie bei einer
 * Feder), das ist fuer einen ruhigen Parallax-Effekt die praezisere Wahl.
 * Bei "weniger Bewegung" wird gar kein ScrollTrigger erzeugt - das Bild
 * steht dann einfach still.
 */
export default function ParallaxBild({
  children,
  className,
  style,
  staerke = 18,
}: {
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Versatz in Prozent der Bildhoehe - 12 dezent, 25 deutlich. */
  staerke?: number;
}) {
  const rahmen = useRef<HTMLDivElement>(null);
  const bild = useRef<HTMLDivElement>(null);
  const ruhig = useRuhig();

  useGSAP(
    () => {
      if (ruhig || !bild.current || !rahmen.current) return;
      gsap.fromTo(
        bild.current,
        { yPercent: -staerke / 2 },
        {
          yPercent: staerke / 2,
          ease: "none",
          scrollTrigger: {
            trigger: rahmen.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    },
    { scope: rahmen, dependencies: [ruhig, staerke] },
  );

  return (
    <div
      ref={rahmen}
      className={cn("relative overflow-hidden", className)}
      style={style}
    >
      <div ref={bild} className="absolute inset-[-12%]">
        {children}
      </div>
    </div>
  );
}
