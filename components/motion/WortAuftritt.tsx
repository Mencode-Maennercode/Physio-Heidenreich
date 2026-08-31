"use client";

import { Fragment, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRuhig } from "@/components/a11y/Einstellungen";
import { KURVE, lebhaft } from "@/lib/bewegung";

gsap.registerPlugin(ScrollTrigger);

/**
 * Ueberschrift, deren Worte beim Hereinscrollen nacheinander aufsteigen.
 *
 * Der Unterschied zum blossen Einblenden ist kein Effekt um seiner selbst
 * willen: Eine Zeile, die sich Wort fuer Wort aufbaut, wird gelesen statt
 * ueberflogen. Genau deshalb steht das hier nur auf Ueberschriften und
 * nirgends im Fliesstext - dort waere dasselbe Mittel eine Zumutung.
 *
 * Drei Dinge sind bewusst so gebaut:
 *
 *  - Der verborgene Anfangszustand wird AUSSCHLIESSLICH von GSAP gesetzt,
 *    nicht in HTML oder CSS. Laeuft kein Skript, steht die Ueberschrift
 *    einfach da. Damit gilt auch hier die Regel aus Enthuellen.tsx: Die
 *    Animation ist Zugabe, der Inhalt haengt nie an ihr.
 *  - Animiert wird `opacity` MIT der Bewegung, obwohl die Maske allein
 *    optisch genuegen wuerde. Grund: scripts/sichtbarkeit.mjs erkennt
 *    haengengebliebene Auftritte an der Deckkraft. Ein rein ueber
 *    Verschiebung verborgenes Wort wuerde dem Test entgehen.
 *  - `ruhig` steckt in den Abhaengigkeiten, damit der Aufbau neu ansetzt,
 *    sobald die animierte Fassung wirklich steht (siehe die ausfuehrliche
 *    Begruendung in components/motion/Enthuellen.tsx).
 *
 * Die Worte bleiben einzelne Textknoten mit echten Leerzeichen dazwischen -
 * Vorlesesoftware liest den Satz normal, und Zeilenumbrueche funktionieren
 * wie bei jeder anderen Ueberschrift.
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

export default function WortAuftritt({
  text,
  className,
  style,
  als: Als = "h2",
  verzoegerung = 0,
}: {
  text: string;
  className?: string;
  /* Durchgereicht, weil die Startseite ihre Farben ueber CSS-Variablen
     direkt am Element setzt (--gc-*) statt ueber Tailwind-Klassen. Ohne
     diesen Durchgang muesste fuer jede Ueberschrift eine eigene Klasse
     angelegt werden, nur um eine Farbe zu uebergeben. */
  style?: React.CSSProperties;
  als?: "h1" | "h2" | "h3";
  verzoegerung?: number;
}) {
  const rahmen = useRef<HTMLHeadingElement>(null);
  const ruhig = useRuhig();

  useGSAP(
    () => {
      if (ruhig || !lebhaft || !rahmen.current) return;

      const worte = rahmen.current.querySelectorAll("[data-wort]");
      if (!worte.length) return;

      /* 0.88 ist derselbe Wert wie `start: "top 88%"` weiter unten. */
      if (schonAngekommen(rahmen.current, 0.88)) return;

      gsap.fromTo(
        worte,
        { yPercent: 105, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.85,
          ease: KURVE,
          stagger: 0.05,
          delay: verzoegerung,
          scrollTrigger: {
            trigger: rahmen.current,
            /* Frueh genug, dass die Bewegung schon laeuft, wenn die Zeile
               in den Blick kommt - nicht erst, wenn man sie bereits liest. */
            start: "top 88%",
            once: true,
          },
        },
      );
    },
    { scope: rahmen, dependencies: [ruhig, verzoegerung] },
  );

  const worte = text.split(" ");

  return (
    <Als ref={rahmen} className={className} style={style}>
      {worte.map((wort, i) => (
        <Fragment key={`${wort}-${i}`}>
          {/*
            Die Maske braucht Innenabstand nach unten, sonst schneidet sie
            Unterlaengen ab (das g in "gelernt"). Gleiche Loesung wie bei
            ZeilenTitel. `align-bottom` haelt die Grundlinie ruhig - ein
            inline-block mit `overflow: hidden` setzt sie sonst auf die
            Unterkante und die Zeile springt.
          */}
          <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <span data-wort className="inline-block">
              {wort}
            </span>
          </span>
          {i < worte.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Als>
  );
}
