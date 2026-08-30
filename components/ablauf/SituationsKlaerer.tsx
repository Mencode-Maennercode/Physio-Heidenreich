"use client";

import type { Situationen } from "@/lib/content/typen";

import { useId, useRef, useState } from "react";
import { AlertCircle } from "lucide-react";
import { situationen as situationenDe } from "@/lib/content/ablauf";
import { cn } from "@/lib/utils";

/**
 * "Was gilt für mich?" - vier Schaltflächen, eine Antwort.
 *
 * Der Kern des Transparenz-Versprechens: Statt eines langen Textes, in dem
 * jeder seinen Fall suchen muss, wählt man ihn aus und liest nur das, was einen
 * betrifft. Ohne Zahlen, aber mit dem vollständigen Weg - einschließlich der
 * unbequemen Antwort für gesetzlich Versicherte.
 *
 * Umgesetzt als klassisches Reitermuster nach ARIA: Pfeiltasten wechseln,
 * Pos1/Ende springen an den Rand, der Reiterinhalt ist selbst anfahrbar.
 */
/*
  Inhalt als Parameter, deutscher Inhalt als Vorgabe - damit rendert
  derselbe Baustein beide Sprachen. Siehe lib/content/typen.ts.
*/
export default function SituationsKlaerer({
  situationen = situationenDe,
}: {
  situationen?: Situationen;
} = {}) {
  const [aktiv, setzeAktiv] = useState(0);
  const basis = useId();
  const knoepfe = useRef<(HTMLButtonElement | null)[]>([]);

  const reiterId = (i: number) => `${basis}-reiter-${i}`;
  const inhaltId = (i: number) => `${basis}-inhalt-${i}`;

  const tastatur = (e: React.KeyboardEvent) => {
    const letzte = situationen.length - 1;
    let ziel: number | null = null;

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      ziel = aktiv === letzte ? 0 : aktiv + 1;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      ziel = aktiv === 0 ? letzte : aktiv - 1;
    } else if (e.key === "Home") {
      ziel = 0;
    } else if (e.key === "End") {
      ziel = letzte;
    }

    if (ziel !== null) {
      e.preventDefault();
      setzeAktiv(ziel);
      knoepfe.current[ziel]?.focus();
    }
  };

  const gewaehlt = situationen[aktiv];

  return (
    <div>
      <div
        role="tablist"
        aria-label="Ihre Versicherungssituation"
        onKeyDown={tastatur}
        className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4"
      >
        {situationen.map((situation, i) => (
          <button
            key={situation.id}
            ref={(el) => {
              knoepfe.current[i] = el;
            }}
            type="button"
            role="tab"
            id={reiterId(i)}
            aria-selected={aktiv === i}
            aria-controls={inhaltId(i)}
            tabIndex={aktiv === i ? 0 : -1}
            onClick={() => setzeAktiv(i)}
            className={cn(
              "flex min-h-[4rem] items-center justify-between gap-3 rounded-lg border px-5 py-4 text-left text-[1rem] font-medium transition-colors",
              aktiv === i
                ? "border-aktion bg-aktion text-[color:var(--marke-offwhite)]"
                : "border-linie bg-grund hover:border-aktion hover:bg-grund-warm",
            )}
          >
            {situation.knopf}
            <span
              aria-hidden="true"
              className={cn(
                "text-[1.1rem] transition-transform",
                aktiv === i ? "translate-x-0" : "-translate-x-1 opacity-40",
              )}
            >
              →
            </span>
          </button>
        ))}
      </div>

      {situationen.map((situation, i) => (
        <div
          key={situation.id}
          role="tabpanel"
          id={inhaltId(i)}
          aria-labelledby={reiterId(i)}
          hidden={aktiv !== i}
          tabIndex={0}
          className="mt-10 focus-visible:outline-[3px] focus-visible:outline-offset-4"
        >
          <h3 className="schrift-display titel-klein">{situation.titel}</h3>

          <dl className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2">
            {situation.ablauf.map((schritt) => (
              <div key={schritt.marke} className="border-t border-linie pt-5">
                <dt className="feld-marke">{schritt.marke}</dt>
                <dd className="mt-2.5 text-[1rem]">{schritt.text}</dd>
              </div>
            ))}
          </dl>

          {/* Der Hinweis, der sonst erst auf der Rechnung auffaellt. Steht
              deshalb hervorgehoben und nicht im Fliesstext. */}
          <div className="mt-8 flex gap-4 rounded-lg bg-grund-warm p-6">
            <AlertCircle
              className="size-5 flex-none translate-y-0.5 text-aktion"
              aria-hidden="true"
            />
            <p className="lesespalte-weit text-[0.98rem]">{situation.achtung}</p>
          </div>
        </div>
      ))}

      {/* Ohne JavaScript bleiben die Reiter stumm. Deshalb hier alle Inhalte
          noch einmal als schlichte Liste - sie erscheint nur, wenn das Skript
          nicht laeuft. */}
      <noscript>
        <div className="mt-10 flex flex-col gap-10">
          {situationen.map((situation) => (
            <div key={situation.id}>
              <h3 className="schrift-display titel-klein">{situation.titel}</h3>
              <dl className="mt-6 flex flex-col gap-5">
                {situation.ablauf.map((schritt) => (
                  <div key={schritt.marke}>
                    <dt className="feld-marke">{schritt.marke}</dt>
                    <dd className="mt-1.5">{schritt.text}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 rounded-lg bg-grund-warm p-5 text-[0.98rem]">
                {situation.achtung}
              </p>
            </div>
          ))}
        </div>
      </noscript>

      <p className="sr-only" aria-live="polite">
        {gewaehlt.titel}
      </p>
    </div>
  );
}
