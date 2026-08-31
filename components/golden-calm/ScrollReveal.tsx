"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRuhig } from "@/components/a11y/Einstellungen";
import { KURVE, lebhaft } from "@/lib/bewegung";
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
/**
 * Laeuft dieser Auftritt ueberhaupt noch als Auftritt?
 *
 * Ein ScrollTrigger, dessen Element beim Einrichten schon im Bild steht,
 * feuert sofort - und das ist genau der Fall, in dem die Animation nichts
 * mehr bewirken kann ausser Schaden: Der Inhalt steht seit dem ersten
 * Bildaufbau da, GSAP setzt ihn nach der Hydrierung auf Deckkraft 0 und
 * blendet ihn erneut ein. Gemessen mit scripts/auftritt.mjs auf
 * /behandlung/: Die Ueberschrift war von 0 bis 531 ms zu lesen, verschwand
 * dann und war erst bei 918 ms wieder vollstaendig da.
 *
 * Ein Auftritt gehoert dem, der noch nicht angekommen ist. Wer schon liest,
 * bekommt keinen mehr.
 */
function schonAngekommen(knoten: Element, anteil: number) {
  return knoten.getBoundingClientRect().top < window.innerHeight * anteil;
}

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

      /* 0.82 ist derselbe Wert wie `start: "top 82%"` weiter unten. */
      if (schonAngekommen(rahmen.current, 0.82)) return;

      /*
        Lebhafte Fassung: zusaetzlich zur Verschiebung ein leichtes
        Heranwachsen aus 96 % und ein etwas laengerer Versatz. Der
        Groessensprung ist bewusst klein - er soll als "kommt auf einen zu"
        wahrgenommen werden, nicht als Zoom. Zusammen mit dem dichteren
        Stagger entsteht der Eindruck, dass die Karten nacheinander
        einschwenken statt gemeinsam aufzublenden.
      */
      const stark = lebhaft && !ruhig;

      gsap.fromTo(
        teile,
        {
          opacity: 0,
          y: stark ? versatz * 1.5 : versatz,
          scale: stark ? 0.96 : 1,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: stark ? 0.95 : 0.8,
          ease: KURVE,
          stagger: stark ? 0.1 : 0.12,
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
