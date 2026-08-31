"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Kartenreihe, die auf dem Handy waagerecht gewischt wird und ab Tablet
 * wieder ein normales Raster ist.
 *
 * Warum ueberhaupt: Fuenf Leistungskarten untereinander sind auf einem
 * 390 px breiten Schirm rund 3.400 px Weg - vier volle Bildschirme fuer
 * einen einzigen Abschnitt. Wer die fuenfte Karte sehen will, muss an
 * vier anderen vorbeiscrollen. Nebeneinander sind es 480 px, und das
 * Wischen ist auf dem Telefon ohnehin die gelernte Geste.
 *
 * Die Aufteilung steckt in `.gc-schiene` (globals.css): Bis 639 px eine
 * Flexreihe mit `scroll-snap`, darueber ein Raster. Hier im Baustein
 * bleibt nur, was JavaScript braucht - die Fortschrittsanzeige.
 *
 * Warum ein Balken und keine Punkte: Die Anzahl der Karten unterscheidet
 * sich je Abschnitt (drei im Konzept, fuenf bei den Leistungen). Punkte
 * muessten mitgezaehlt werden und werden bei mehr als vier Stueck zu klein
 * zum Erkennen. Ein Balken zeigt dieselbe Information - wie weit bin ich,
 * wie viel kommt noch - unabhaengig von der Anzahl.
 *
 * Er ist bewusst nicht bedienbar: ein 4 px hoher Streifen waere eine
 * Tippflaeche, die niemand trifft. Gewischt wird die Reihe selbst.
 */
export default function GcSchiene({
  children,
  className,
  breit = false,
}: {
  children: React.ReactNode;
  className?: string;
  /** Ab 1024 px drei statt zwei Spalten. */
  breit?: boolean;
}) {
  const schiene = useRef<HTMLDivElement>(null);
  const [anteil, setzeAnteil] = useState(0);
  /* Ob ueberhaupt etwas zu wischen ist. Im Raster ab sm gibt es keinen
     Ueberlauf - dann hat der Balken nichts anzuzeigen und faellt weg. */
  const [wischbar, setzeWischbar] = useState(false);

  useEffect(() => {
    const knoten = schiene.current;
    if (!knoten) return;

    const messen = () => {
      const weg = knoten.scrollWidth - knoten.clientWidth;
      setzeWischbar(weg > 8);
      setzeAnteil(weg > 8 ? knoten.scrollLeft / weg : 0);
    };

    messen();
    knoten.addEventListener("scroll", messen, { passive: true });

    /* Beim Drehen des Geraets und beim Wechsel der Schriftgroesse aendert
       sich beides - Breite und Anzahl sichtbarer Karten. */
    const beobachter = new ResizeObserver(messen);
    beobachter.observe(knoten);

    return () => {
      knoten.removeEventListener("scroll", messen);
      beobachter.disconnect();
    };
  }, []);

  return (
    <div>
      <div
        ref={schiene}
        className={cn("gc-schiene", breit && "gc-schiene-drei", className)}
      >
        {children}
      </div>

      {wischbar ? (
        <div
          aria-hidden="true"
          className="mt-4 h-[3px] w-full overflow-hidden rounded-full sm:hidden"
          style={{ background: "color-mix(in srgb, var(--gc-gold) 24%, transparent)" }}
        >
          {/*
            Die Breite des Griffs entspricht dem Anteil der Reihe, der
            gerade zu sehen ist - wie eine Bildlaufleiste. Bei fuenf Karten
            sind das rund ein Fuenftel, bei dreien ein Drittel. Der Nutzer
            liest daran ab, wie viel noch kommt, ohne dass irgendwo eine
            Zahl stehen muss.
          */}
          <div
            className="h-full rounded-full transition-transform duration-150 ease-out"
            style={{
              background: "var(--gc-gold)",
              width: "32%",
              transform: `translateX(${anteil * (100 / 0.32 - 100)}%)`,
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
