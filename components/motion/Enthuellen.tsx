"use client";

import { useEffect, useRef, useState } from "react";
import { motion, type Variants } from "motion/react";
import { useRuhig } from "@/components/a11y/Einstellungen";

/**
 * Bausteine fuer Bewegung.
 *
 * Gemeinsame Regel: Bei Ruhe wird nicht langsamer animiert, sondern gar nicht -
 * der Inhalt steht sofort da. Kein Baustein darf so gebaut sein, dass Inhalt
 * ohne Animation unsichtbar bliebe.
 */

export const RUHIGE_KURVE: [number, number, number, number] = [
  0.22, 0.61, 0.36, 1,
];

/**
 * Sichtbarkeit fuer alle Auftritte.
 *
 * Bewusst OHNE IntersectionObserver (`whileInView` / `useInView`). Der
 * Beobachter hat hier einen Aussetzer, der sich messen laesst: Er wird beim
 * Aufbau der Seite eingerichtet, feuert bei bereits sichtbaren Abschnitten
 * mitunter, bevor das Layout steht - und dann nie wieder, weil `once` gilt.
 * Der Inhalt bleibt auf `opacity: 0` stehen und ist dauerhaft unsichtbar.
 * Aufgetreten auf /behandlung/, /ueber-mich/, /ablauf/ und /kontakt/,
 * nachweisbar mit scripts/sichtbarkeit.mjs.
 *
 * Stattdessen eine eigene Pruefung, die drei Eigenschaften hat, auf die es
 * hier ankommt:
 *
 *  - Sie laeuft sofort nach dem Aufbau, nicht erst beim naechsten Ereignis.
 *  - Sie laeuft bei jedem Scrollen und jeder Groessenaenderung erneut
 *    (gebuendelt ueber requestAnimationFrame, also hoechstens einmal pro
 *    Bild).
 *  - Sie kennt nur einen Weg: einmal sichtbar, immer sichtbar.
 *
 * Entscheidend ist die Bedingung: geprueft wird ausschliesslich, ob die
 * Oberkante ueber der Schwelle liegt - ohne Untergrenze. Damit gilt alles
 * als sichtbar, was bereits nach oben aus dem Bild gescrollt ist. Ein
 * Abschnitt, den jemand schnell ueberrollt, kann so nicht uebersprungen
 * werden.
 *
 * Damit gilt die Regel aus dem Kopf dieser Datei wieder ohne Ausnahme: Die
 * Animation ist Zugabe, der Inhalt haengt nie an ihr.
 *
 * `aktiv` ist keine Bequemlichkeit, sondern der Kern der Sache. `useRuhig()`
 * meldet beim ERSTEN Durchlauf immer Ruhe (`!montiert || ruhig`), damit
 * Server- und Browserfassung uebereinstimmen. In diesem Durchlauf rendern
 * die Bausteine ihre schlichte Fassung - ohne Ref. Ein Effekt, der nur auf
 * `punkt` und `anteil` hoert, findet dann `null`, bricht ab und laeuft nie
 * wieder: Gleich darauf erscheint die animierte Fassung mit `opacity: 0`,
 * der Ref sitzt endlich, aber niemand misst mehr. Genau so entstand der
 * dauerhaft unsichtbare Inhalt. Ueber `aktiv` in den Abhaengigkeiten setzt
 * die Messung neu an, sobald das animierte Element wirklich steht.
 */
function useAuftritt(
  punkt: React.RefObject<Element | null>,
  anteil: number,
  aktiv: boolean,
) {
  const [sichtbar, setzeSichtbar] = useState(false);

  useEffect(() => {
    if (!aktiv) return;

    const knoten = punkt.current;
    if (!knoten) return;

    let angefordert = 0;
    let fertig = false;

    function pruefe() {
      angefordert = 0;
      if (fertig) return;

      const kasten = knoten!.getBoundingClientRect();
      const schwelle = window.innerHeight * (1 - anteil);

      if (kasten.top < schwelle) {
        fertig = true;
        setzeSichtbar(true);
        abmelden();
      }
    }

    /* Gebuendelt: Bei schnellem Scrollen sonst hunderte Messungen pro
       Sekunde, und jede erzwingt ein Layout. */
    function plane() {
      if (angefordert) return;
      angefordert = requestAnimationFrame(pruefe);
    }

    function abmelden() {
      window.removeEventListener("scroll", plane);
      window.removeEventListener("resize", plane);
      if (angefordert) cancelAnimationFrame(angefordert);
      angefordert = 0;
    }

    window.addEventListener("scroll", plane, { passive: true });
    window.addEventListener("resize", plane);
    pruefe();

    return abmelden;
  }, [punkt, anteil, aktiv]);

  return sichtbar;
}

/** Einfaches Auftauchen beim Hereinscrollen. */
export function Enthuellen({
  children,
  className,
  verzoegerung = 0,
  versatz = 24,
}: {
  children: React.ReactNode;
  className?: string;
  verzoegerung?: number;
  versatz?: number;
}) {
  const ruhig = useRuhig();
  const punkt = useRef<HTMLDivElement>(null);
  const sichtbar = useAuftritt(punkt, 0.12, !ruhig);

  if (ruhig) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={punkt}
      className={className}
      initial={{ opacity: 0, y: versatz }}
      animate={sichtbar ? { opacity: 1, y: 0 } : { opacity: 0, y: versatz }}
      transition={{ duration: 0.75, delay: verzoegerung, ease: RUHIGE_KURVE }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Titel, der zeilenweise unter einer Maske hervorkommt.
 *
 * Der Umbruch wird vorgegeben statt automatisch ermittelt - so bleibt die
 * Typografie kontrolliert, auch bei 130 % Textgroesse.
 */
export function ZeilenTitel({
  zeilen,
  className,
  alsUeberschrift = "h1",
  verzoegerung = 0,
}: {
  zeilen: readonly string[];
  className?: string;
  alsUeberschrift?: "h1" | "h2";
  verzoegerung?: number;
}) {
  const ruhig = useRuhig();
  const Ueberschrift = alsUeberschrift;

  if (ruhig) {
    return (
      <Ueberschrift className={className}>
        {zeilen.map((zeile) => (
          <span key={zeile} className="block">
            {zeile}
          </span>
        ))}
      </Ueberschrift>
    );
  }

  return (
    <Ueberschrift className={className}>
      {zeilen.map((zeile, i) => (
        // Die Maske braucht etwas Innenabstand, sonst schneidet sie
        // Unterlaengen wie das g in "liegen" ab.
        <span key={zeile} className="block overflow-hidden pb-[0.12em]">
          <motion.span
            className="block"
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{
              duration: 1,
              delay: verzoegerung + i * 0.11,
              ease: RUHIGE_KURVE,
            }}
          >
            {zeile}
          </motion.span>
        </span>
      ))}
    </Ueberschrift>
  );
}

/** Bild, das über einen Wischer erscheint statt einzublenden. */
export function BildWischer({
  children,
  className,
  verzoegerung = 0,
}: {
  children: React.ReactNode;
  className?: string;
  verzoegerung?: number;
}) {
  const ruhig = useRuhig();
  const punkt = useRef<HTMLDivElement>(null);
  const sichtbar = useAuftritt(punkt, 0.1, !ruhig);

  if (ruhig) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={punkt}
      className={className}
      initial={{ clipPath: "inset(0 0 100% 0)" }}
      animate={{
        clipPath: sichtbar ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)",
      }}
      transition={{ duration: 1.1, delay: verzoegerung, ease: RUHIGE_KURVE }}
    >
      {children}
    </motion.div>
  );
}

const eltern: Variants = {
  ruhe: {},
  auftritt: { transition: { staggerChildren: 0.09 } },
};

const kind: Variants = {
  ruhe: { opacity: 0, y: 20 },
  auftritt: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: RUHIGE_KURVE },
  },
};

/** Gestaffelte Gruppe. Für Listen `alsListe` setzen, damit `ul` entsteht. */
export function Staffel({
  children,
  className,
  alsListe = false,
}: {
  children: React.ReactNode;
  className?: string;
  alsListe?: boolean;
}) {
  const ruhig = useRuhig();
  const punkt = useRef<HTMLElement>(null);
  const sichtbar = useAuftritt(punkt, 0.1, !ruhig);

  if (ruhig) {
    return alsListe ? (
      <ul className={className}>{children}</ul>
    ) : (
      <div className={className}>{children}</div>
    );
  }

  const gemeinsam = {
    className,
    variants: eltern,
    initial: "ruhe" as const,
    animate: sichtbar ? ("auftritt" as const) : ("ruhe" as const),
  };

  return alsListe ? (
    <motion.ul
      ref={punkt as React.RefObject<HTMLUListElement>}
      {...gemeinsam}
    >
      {children}
    </motion.ul>
  ) : (
    <motion.div ref={punkt as React.RefObject<HTMLDivElement>} {...gemeinsam}>
      {children}
    </motion.div>
  );
}

export function StaffelKind({
  children,
  className,
  alsPunkt = false,
}: {
  children: React.ReactNode;
  className?: string;
  alsPunkt?: boolean;
}) {
  const ruhig = useRuhig();

  if (ruhig) {
    return alsPunkt ? (
      <li className={className}>{children}</li>
    ) : (
      <div className={className}>{children}</div>
    );
  }

  return alsPunkt ? (
    <motion.li className={className} variants={kind}>
      {children}
    </motion.li>
  ) : (
    <motion.div className={className} variants={kind}>
      {children}
    </motion.div>
  );
}
