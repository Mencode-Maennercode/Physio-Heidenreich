"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/**
 * Barrierefreiheits-Einstellungen.
 *
 * Die Wahrheit liegt in den data-Attributen am <html>-Element, nicht im
 * React-State: So greifen die Einstellungen auch fuer reines CSS, und das
 * Vorab-Skript in app/layout.tsx kann sie setzen, bevor das erste Bild
 * aufgebaut wird. React haelt nur eine Kopie fuer die Bedienoberflaeche.
 */

export type Textgroesse = "normal" | "gross" | "sehrgross";
export type Kontrast = "normal" | "hoch";
export type Bewegung = "system" | "reduziert" | "voll";

type Einstellungen = {
  textgroesse: Textgroesse;
  kontrast: Kontrast;
  bewegung: Bewegung;
};

const STANDARD: Einstellungen = {
  textgroesse: "normal",
  kontrast: "normal",
  bewegung: "system",
};

/** Muss mit den Schluesseln im Vorab-Skript in app/layout.tsx uebereinstimmen. */
export const SPEICHER = {
  textgroesse: "nh-textgroesse",
  kontrast: "nh-kontrast",
  bewegung: "nh-bewegung",
} as const;

type Kontext = Einstellungen & {
  setzeTextgroesse: (wert: Textgroesse) => void;
  setzeKontrast: (wert: Kontrast) => void;
  setzeBewegung: (wert: Bewegung) => void;
  zuruecksetzen: () => void;
  /** true, wenn Animationen unterbleiben sollen - egal aus welchem Grund. */
  ruhig: boolean;
};

const EinstellungenKontext = createContext<Kontext | null>(null);

export function EinstellungenProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [werte, setzeWerte] = useState<Einstellungen>(STANDARD);
  const [systemRuhig, setzeSystemRuhig] = useState(false);

  // Nach dem Mounten das uebernehmen, was das Vorab-Skript bereits gesetzt hat.
  // Damit stimmt die Bedienoberflaeche mit der tatsaechlichen Darstellung
  // ueberein, ohne dass es beim Hydrieren zu Abweichungen kommt.
  useEffect(() => {
    const d = document.documentElement.dataset;
    setzeWerte({
      textgroesse: (d.textgroesse as Textgroesse) ?? STANDARD.textgroesse,
      kontrast: (d.kontrast as Kontrast) ?? STANDARD.kontrast,
      bewegung: (d.bewegung as Bewegung) ?? STANDARD.bewegung,
    });
  }, []);

  // Systemeinstellung mitlesen und auf Aenderungen reagieren.
  useEffect(() => {
    const abfrage = window.matchMedia("(prefers-reduced-motion: reduce)");
    const aktualisieren = () => setzeSystemRuhig(abfrage.matches);
    aktualisieren();
    abfrage.addEventListener("change", aktualisieren);
    return () => abfrage.removeEventListener("change", aktualisieren);
  }, []);

  const anwenden = useCallback(
    <S extends keyof Einstellungen>(schluessel: S, wert: Einstellungen[S]) => {
      const d = document.documentElement.dataset;
      const standard = STANDARD[schluessel];

      if (wert === standard) {
        delete d[schluessel];
      } else {
        d[schluessel] = wert;
      }

      try {
        if (wert === standard) {
          localStorage.removeItem(SPEICHER[schluessel]);
        } else {
          localStorage.setItem(SPEICHER[schluessel], wert);
        }
      } catch {
        // Privater Modus oder gesperrter Speicher: die Einstellung gilt dann
        // nur fuer diesen Besuch. Kein Grund, irgendetwas zu melden.
      }

      setzeWerte((alt) => ({ ...alt, [schluessel]: wert }));
    },
    [],
  );

  const wert = useMemo<Kontext>(
    () => ({
      ...werte,
      setzeTextgroesse: (v) => anwenden("textgroesse", v),
      setzeKontrast: (v) => anwenden("kontrast", v),
      setzeBewegung: (v) => anwenden("bewegung", v),
      zuruecksetzen: () => {
        anwenden("textgroesse", "normal");
        anwenden("kontrast", "normal");
        anwenden("bewegung", "system");
      },
      // "voll" ueberstimmt die Systemeinstellung bewusst: Wer sie ausdruecklich
      // anfordert, hat sie gerade selbst eingeschaltet.
      ruhig:
        werte.bewegung === "reduziert" ||
        (werte.bewegung === "system" && systemRuhig),
    }),
    [werte, systemRuhig, anwenden],
  );

  return (
    <EinstellungenKontext.Provider value={wert}>
      {children}
    </EinstellungenKontext.Provider>
  );
}

export function useEinstellungen() {
  const kontext = useContext(EinstellungenKontext);
  if (!kontext) {
    throw new Error("useEinstellungen braucht den EinstellungenProvider.");
  }
  return kontext;
}

/**
 * Kurzform fuer Komponenten, die nur wissen müssen, ob sie sich bewegen duerfen.
 *
 * Vor dem Mounten liefert der Hook `true` - also Ruhe. So laeuft beim ersten
 * Bildaufbau nichts los, was gleich darauf gestoppt werden muesste.
 */
export function useRuhig() {
  const { ruhig } = useEinstellungen();
  const [montiert, setzeMontiert] = useState(false);
  useEffect(() => setzeMontiert(true), []);
  return !montiert || ruhig;
}
