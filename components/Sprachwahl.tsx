"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, ChevronDown } from "lucide-react";
import { gegenstueck, spracheAus, type Sprache } from "@/lib/sprache";
import { cn } from "@/lib/utils";

/**
 * Sprachwahl als Flaggen-Klappmenue.
 *
 * Die Flaggen sind gezeichnet, nicht als Emoji gesetzt. Das ist kein
 * Feinschliff, sondern notwendig: Windows liefert bis heute keine farbigen
 * Flaggen-Emoji - Chrome und Edge zeigen dort statt der Flagge nur die zwei
 * Buchstaben "DE" beziehungsweise "GB". Ausgerechnet auf dem verbreitetsten
 * System waere von der Flagge also nichts zu sehen.
 *
 * Damit trotzdem niemand raten muss, steht im Menue neben jeder Flagge der
 * ausgeschriebene Sprachname, und der Knopf traegt eine Beschriftung fuer
 * Vorlesesoftware: Eine Flagge steht fuer ein Land, nicht fuer eine Sprache,
 * und bleibt allein mehrdeutig.
 *
 * Kein fremdes Klappmenue-Paket: Bei zwei Eintraegen waere eine zusaetzliche
 * Abhaengigkeit mehr Last als Nutzen. Was es braucht, steht hier
 * vollstaendig - Escape schliesst, ein Klick daneben schliesst, der Fokus
 * kehrt zum Knopf zurueck, und das Menue meldet sich als solches an.
 */

function FlaggeDe({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 60 36" className="size-full" aria-hidden="true">
      <clipPath id={id}>
        <rect width="60" height="36" rx="4" />
      </clipPath>
      <g clipPath={`url(#${id})`}>
        <rect width="60" height="12" fill="#000000" />
        <rect y="12" width="60" height="12" fill="#DD0000" />
        <rect y="24" width="60" height="12" fill="#FFCE00" />
      </g>
    </svg>
  );
}

function FlaggeEn({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 60 36" className="size-full" aria-hidden="true">
      <clipPath id={id}>
        <rect width="60" height="36" rx="4" />
      </clipPath>
      <g clipPath={`url(#${id})`}>
        <rect width="60" height="36" fill="#012169" />
        {/* Diagonalkreuz: weiss, darauf schmaler rot */}
        <path d="M0,0 L60,36 M60,0 L0,36" stroke="#FFFFFF" strokeWidth="7.2" />
        <path d="M0,0 L60,36 M60,0 L0,36" stroke="#C8102E" strokeWidth="2.8" />
        {/* Geradkreuz darueber - verdeckt die Diagonalen in der Mitte */}
        <path d="M30,0 V36 M0,18 H60" stroke="#FFFFFF" strokeWidth="12" />
        <path d="M30,0 V36 M0,18 H60" stroke="#C8102E" strokeWidth="7.2" />
      </g>
    </svg>
  );
}

const SPRACHEN = [
  { code: "de" as const, name: "Deutsch", Flagge: FlaggeDe },
  { code: "en" as const, name: "English", Flagge: FlaggeEn },
];

export default function Sprachwahl({ className }: { className?: string }) {
  const pfad = usePathname();
  const aktuell: Sprache = spracheAus(pfad);
  const [offen, setzeOffen] = useState(false);
  const huelle = useRef<HTMLDivElement>(null);
  const knopf = useRef<HTMLButtonElement>(null);
  const kennung = useId().replace(/:/g, "");

  useEffect(() => {
    if (!offen) return;

    const beiTaste = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setzeOffen(false);
        /* Fokus zurueck: Sonst landet er beim Schliessen am Seitenanfang,
           und wer mit der Tastatur bedient, verliert seine Position. */
        knopf.current?.focus();
      }
    };
    const beiKlick = (e: MouseEvent) => {
      if (!huelle.current?.contains(e.target as Node)) setzeOffen(false);
    };

    document.addEventListener("keydown", beiTaste);
    document.addEventListener("mousedown", beiKlick);
    return () => {
      document.removeEventListener("keydown", beiTaste);
      document.removeEventListener("mousedown", beiKlick);
    };
  }, [offen]);

  /* Beim Seitenwechsel schliessen, sonst bleibt das Menue offen stehen. */
  useEffect(() => setzeOffen(false), [pfad]);

  const jetzt = SPRACHEN.find((s) => s.code === aktuell) ?? SPRACHEN[0];
  const JetztFlagge = jetzt.Flagge;

  return (
    <div ref={huelle} className={cn("relative", className)}>
      <button
        ref={knopf}
        type="button"
        onClick={() => setzeOffen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={offen}
        aria-label={`Sprache wählen — aktuell ${jetzt.name}`}
        className="flex min-h-11 items-center gap-1.5 rounded-full border border-linie px-2.5 transition-colors hover:border-aktion"
      >
        <span className="h-[0.95rem] w-[1.55rem] flex-none overflow-hidden rounded-[3px]">
          <JetztFlagge id={`${kennung}-knopf`} />
        </span>
        <ChevronDown
          className={cn(
            "size-3.5 flex-none text-leise transition-transform",
            offen && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {offen ? (
        <div
          role="menu"
          aria-label="Sprache"
          /* Rechtsbuendig unter dem Knopf: Er sitzt am aeusseren Rand der
             Kopfzeile, ein linksbuendiges Menue liefe aus dem Bild. */
          className="absolute right-0 top-[calc(100%+0.5rem)] z-50 min-w-[11rem] overflow-hidden rounded-2xl border border-linie bg-grund py-1.5 shadow-[var(--schatten-tief)]"
        >
          {SPRACHEN.map((s) => {
            const Flagge = s.Flagge;
            const istAktiv = s.code === aktuell;
            return (
              <Link
                key={s.code}
                role="menuitem"
                href={gegenstueck(pfad, s.code)}
                hrefLang={s.code}
                aria-current={istAktiv ? "true" : undefined}
                onClick={() => setzeOffen(false)}
                className={cn(
                  "flex min-h-11 items-center gap-3 px-3.5 text-[0.95rem] transition-colors hover:bg-grund-warm",
                  istAktiv && "font-medium",
                )}
              >
                <span className="h-[0.95rem] w-[1.55rem] flex-none overflow-hidden rounded-[3px]">
                  <Flagge id={`${kennung}-${s.code}`} />
                </span>
                <span className="flex-1">{s.name}</span>
                {istAktiv ? (
                  <Check
                    className="size-4 flex-none text-aktion"
                    aria-hidden="true"
                  />
                ) : null}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
