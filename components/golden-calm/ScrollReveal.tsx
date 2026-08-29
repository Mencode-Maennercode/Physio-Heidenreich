"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRuhig } from "@/components/a11y/Einstellungen";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

/**
 * Gestaffeltes Einblenden einer Kartengruppe beim Hereinscrollen, via GSAP.
 *
 * Erwartet direkte Kind-Elemente mit der Klasse `.gc-reveal-teil` - so kann
 * dieselbe Komponente 3er- und 4er-Raster gleichermassen bedienen, ohne dass
 * jede Karte eine eigene Ref braucht.
 *
 * Bei "weniger Bewegung" wird kein ScrollTrigger erzeugt: Alle Karten stehen
 * von Anfang an in voller Deckkraft da.
 */
export default function ScrollReveal({
  children,
  className,
  versatz = 34,
}: {
  children: React.ReactNode;
  className?: string;
  versatz?: number;
}) {
  const rahmen = useRef<HTMLDivElement>(null);
  const ruhig = useRuhig();

  useGSAP(
    () => {
      if (ruhig || !rahmen.current) return;
      const teile = rahmen.current.querySelectorAll(".gc-reveal-teil");
      if (!teile.length) return;

      gsap.fromTo(
        teile,
        { opacity: 0, y: versatz },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: rahmen.current,
            start: "top 82%",
            once: true,
          },
        },
      );
    },
    { scope: rahmen, dependencies: [ruhig, versatz] },
  );

  return (
    <div ref={rahmen} className={cn(className)}>
      {children}
    </div>
  );
}
