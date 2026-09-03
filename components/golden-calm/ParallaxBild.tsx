"use client";

import { useRef, type CSSProperties } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import KiZeichen from "@/components/KiZeichen";
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
  fokusY = 50,
  ki = false,
}: {
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Versatz in Prozent der Bildhoehe - 12 dezent, 25 deutlich. */
  staerke?: number;
  /**
   * Vertikaler Ankerpunkt des Ausschnitts, 0-100. 50 (Voreinstellung) ist
   * mittig - so war es bisher fest verdrahtet.
   *
   * Der innere Rahmen liegt 12 % ueber jeden Rand hinaus (siehe unten), damit
   * beim Scrollen nie ein leerer Streifen entsteht. Passt das
   * Seitenverhaeltnis der Box nicht zum Foto, addiert sich dieser Ueberstand
   * zum ohnehin noetigen Zuschnitt - bei einem Portraet in einer breiteren
   * Box endete das Bild dadurch an den Augenbrauen, obwohl am Foto selbst
   * nichts falsch war. `fokusY` verschiebt, wie die 24 % Gesamt-Ueberstand
   * (12 oben + 12 unten) zwischen oben und unten aufgeteilt werden, OHNE die
   * Gesamthoehe und damit das Seitenverhaeltnis des inneren Rahmens zu
   * aendern: Bei 0 faellt der gesamte Ueberstand nach unten (maximal viel
   * vom oberen Bildrand sichtbar), bei 100 umgekehrt.
   */
  fokusY?: number;
  /**
   * KI-Kennzeichnung an den sichtbaren Rahmen setzen.
   *
   * Sie kann nicht am Bild selbst haengen: Der innere Kasten ragt bewusst
   * ueber alle Raender hinaus (siehe unten) und wird beschnitten - ein
   * Zeichen an seiner Unterkante waere unsichtbar. Das Bild bekommt
   * deshalb `ohneKiZeichen`, und hier steht es an der Stelle, die man
   * wirklich sieht.
   */
  ki?: boolean;
}) {
  const rahmen = useRef<HTMLDivElement>(null);
  const bild = useRef<HTMLDivElement>(null);
  const ruhig = useRuhig();

  const gesamtUeberstand = 24;
  const obenUeberstand = (gesamtUeberstand * fokusY) / 100;
  const untenUeberstand = gesamtUeberstand - obenUeberstand;

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
      <div
        ref={bild}
        className="absolute inset-x-[-12%]"
        style={{ top: `-${obenUeberstand}%`, bottom: `-${untenUeberstand}%` }}
      >
        {children}
      </div>
      {ki ? <KiZeichen /> : null}
    </div>
  );
}
