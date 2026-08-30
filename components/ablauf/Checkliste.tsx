"use client";

import type { Checkliste } from "@/lib/content/typen";

import { useEffect } from "react";
import { Printer } from "lucide-react";
import { checkliste as checklisteDe } from "@/lib/content/ablauf";
import { kontakt, seite } from "@/lib/site-config";

/**
 * Druckbare Checkliste für den ersten Termin.
 *
 * Gedacht für Angehörige, die etwas in die Hand nehmen und an den Kühlschrank
 * hängen wollen. Der Knopf setzt eine Klasse am <body>; die Druckregeln in
 * globals.css blenden dann alles außer diesem Abschnitt aus - so entsteht ein
 * einzelnes Blatt statt zwölf Seiten Website.
 */
/*
  Inhalt als Parameter, deutscher Inhalt als Vorgabe - damit rendert
  derselbe Baustein beide Sprachen. Siehe lib/content/typen.ts.
*/
export default function Checkliste({
  checkliste = checklisteDe,
}: {
  checkliste?: Checkliste;
} = {}) {
  // Die Klasse muss auch dann verschwinden, wenn der Druckdialog abgebrochen
  // wird - sonst bleibt sie bis zum naechsten Seitenwechsel haengen.
  useEffect(() => {
    const aufraeumen = () => document.body.classList.remove("druckauswahl");
    window.addEventListener("afterprint", aufraeumen);
    return () => {
      window.removeEventListener("afterprint", aufraeumen);
      aufraeumen();
    };
  }, []);

  const drucken = () => {
    document.body.classList.add("druckauswahl");
    window.print();
  };

  return (
    <div className="druckbereich rounded-lg border border-linie bg-grund p-[clamp(1.75rem,4vw,3rem)]">
      {/* Kopf nur im Druck: auf Papier fehlt sonst jeder Bezug zur Herkunft. */}
      <div className="mb-8 hidden print:block">
        <p className="text-[13pt] font-semibold">{seite.nameLang}</p>
        <p className="text-[10pt]">
          {kontakt.telefonAnzeige} · {kontakt.email}
        </p>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="augenbraue">{checkliste.augenbraue}</p>
          <h3 className="schrift-display titel-klein mt-5">
            {checkliste.titel}
          </h3>
        </div>

        <button
          type="button"
          onClick={drucken}
          className="nicht-drucken inline-flex min-h-[3rem] items-center gap-2.5 rounded-full border border-linie px-5 text-[0.92rem] font-medium transition-colors hover:border-aktion hover:bg-grund-warm"
        >
          <Printer className="size-4" aria-hidden="true" />
          Liste drucken
        </button>
      </div>

      <p className="lesespalte-weit mt-6 text-leise">{checkliste.text}</p>

      <ul className="mt-9 grid gap-x-10 gap-y-4 sm:grid-cols-2">
        {checkliste.punkte.map((punkt) => (
          <li key={punkt} className="flex items-start gap-4">
            {/* Leeres Kaestchen zum Abhaken - auf Papier der eigentliche Zweck. */}
            <span
              aria-hidden="true"
              className="mt-1 size-4 flex-none rounded-[3px] border border-linie print:border-black"
            />
            {/* `min-w-0`: Als Flex-Kind behaelt der Text sonst seine
                natuerliche Breite und ragt bei 130 % Textgroesse aus der
                Spalte. Gemessen mit scripts/geraete.mjs. */}
            <span className="min-w-0">{punkt}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
