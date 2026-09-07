"use client";

import type { Checkliste } from "@/lib/content/typen";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Printer } from "lucide-react";
import { checkliste as checklisteDe } from "@/lib/content/ablauf";
import { kontakt, seite } from "@/lib/site-config";

/**
 * Druckbare Checkliste für den ersten Termin.
 *
 * Gedacht für Angehörige, die etwas in die Hand nehmen und an den Kühlschrank
 * hängen wollen.
 *
 * Auf Papier steht deshalb NICHT die Bildschirmfassung. Vorher wurde die Karte
 * der Website gedruckt: zweispaltig, mit Kartenrahmen, in Bildschirmgrößen und
 * mit einem Layout, das für 1200 px gebaut ist - auf A4 sah das aus wie ein
 * abfotografierter Ausschnitt. Stattdessen hängt hier ein eigenes Blatt im
 * Dokument, das nur beim Drucken sichtbar wird: eigener Briefkopf, einspaltig
 * zum Abhaken, Maße in mm und pt statt in Bildschirmpixeln.
 *
 * Es liegt per Portal direkt am <body>, damit die Druckregeln in globals.css
 * alles andere mit `display: none` entfernen können. Das ist der Kern des
 * Ganzen: Wird der Rest der Seite nur unsichtbar geschaltet, behält er seine
 * Höhe - Chrome druckte dadurch acht leere Blätter vor der Liste.
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
  /* Das Portal braucht document.body - den gibt es beim statischen Erzeugen
     der Seite noch nicht. Bis zum ersten Aufbau im Browser bleibt das Blatt
     deshalb weg; gebraucht wird es ohnehin erst beim Klick auf den Knopf. */
  const [imBrowser, setzeImBrowser] = useState(false);
  useEffect(() => setzeImBrowser(true), []);

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
    <div className="rounded-lg border border-linie bg-grund p-[clamp(1.75rem,4vw,3rem)]">
      <p className="augenbraue">{checkliste.augenbraue}</p>
      <h3 className="schrift-display titel-klein mt-5">{checkliste.titel}</h3>

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

      {/* Der Knopf steht erst hier, nicht mehr oben neben dem Titel: Vorher
          stand "Liste drucken" da, bevor ueberhaupt eine Liste zu sehen war -
          ohne erkennbaren Bezug. Jetzt kommt er als Abschluss, nachdem man
          die Punkte gelesen hat. */}
      <div className="nicht-drucken mt-9 flex justify-end">
        <button
          type="button"
          onClick={drucken}
          className="inline-flex min-h-[3rem] items-center gap-2.5 rounded-full border border-linie px-5 text-[0.92rem] font-medium transition-colors hover:border-aktion hover:bg-grund-warm"
        >
          <Printer className="size-4" aria-hidden="true" />
          Liste drucken
        </button>
      </div>

      {imBrowser
        ? createPortal(<Druckblatt checkliste={checkliste} />, document.body)
        : null}
    </div>
  );
}

/**
 * Das Blatt, das tatsaechlich aus dem Drucker kommt.
 *
 * Eigene Klassen statt Tailwind: Die Maße sind hier Papiermaße (mm, pt) und
 * haben keine Entsprechung im Bildschirm-Raster. Die Regeln stehen im
 * Druck-Abschnitt von globals.css.
 */
function Druckblatt({ checkliste }: { checkliste: Checkliste }) {
  return (
    <div className="druckblatt">
      <header className="druckblatt-kopf">
        <p className="druckblatt-marke">{seite.nameLang}</p>
        <p className="druckblatt-kontakt">
          {kontakt.telefonAnzeige}
          <br />
          {kontakt.email}
        </p>
      </header>

      <p className="druckblatt-augenbraue">{checkliste.augenbraue}</p>
      <h1 className="druckblatt-titel">{checkliste.titel}</h1>
      <p className="druckblatt-text">{checkliste.text}</p>

      <ul className="druckblatt-liste">
        {checkliste.punkte.map((punkt) => (
          <li key={punkt}>
            <span className="druckblatt-kasten" />
            <span>{punkt}</span>
          </li>
        ))}
      </ul>

      <p className="druckblatt-fuss">
        {seite.nameLang} · {kontakt.telefonAnzeige} ·{" "}
        {seite.domain.replace(/^https?:\/\//, "")}
      </p>
    </div>
  );
}
