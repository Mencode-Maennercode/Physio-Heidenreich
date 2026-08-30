"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarCheck, X } from "lucide-react";
import { terminHinweis } from "@/lib/site-config";

/**
 * Hinweis auf freie Termine - im Hero, farblich abgesetzt, wegklickbar.
 *
 * Bewusst KEIN Popup und keine Einblendung, die sich ueber den Inhalt legt.
 * Der Hinweis sitzt fest im Seitenfluss ganz oben im Hero, oberhalb der
 * Ueberschrift. Er faellt sofort ins Auge, weil er die einzige farbig
 * gefuellte Flaeche im Hero ist - verdeckt aber nichts und laesst sich
 * ueberlesen.
 *
 * Das Kreuz ist wichtiger, als es aussieht: Ein Hinweis, den man nicht
 * loswird, wird beim zweiten Besuch zur Stoerung. Die Entscheidung liegt im
 * lokalen Speicher, gebunden an den Termin selbst - aendert sich das Datum,
 * erscheint der Hinweis wieder, ohne dass jemand etwas zuruecksetzen muss.
 *
 * `bisWann` blendet ihn zusaetzlich von selbst aus. Ein Hinweis auf freie
 * Termine ab einem Datum in der Vergangenheit ist schlechter als gar keiner.
 */

const SCHLUESSEL = "np-termin-gesehen";

export default function TerminHinweis() {
  const [weg, setzeWeg] = useState(false);
  const [montiert, setzeMontiert] = useState(false);

  /* Der Schluessel traegt das Datum: Ein neuer Termin ist ein neuer
     Hinweis und darf wieder erscheinen. */
  const marke = terminHinweis
    ? `${SCHLUESSEL}:${terminHinweis.bisWann}`
    : SCHLUESSEL;

  useEffect(() => {
    setzeMontiert(true);
    try {
      if (window.localStorage.getItem(marke) === "ja") setzeWeg(true);
    } catch {
      /* ohne Speicher bleibt er sichtbar - das ist die harmlosere Seite */
    }
  }, [marke]);

  if (!terminHinweis) return null;

  /* Vergleich zum Buildzeitpunkt genuegt: Die Seite wird statisch erzeugt,
     ein abgelaufener Hinweis verschwindet beim naechsten Bauen. */
  if (new Date() >= new Date(terminHinweis.bisWann)) return null;

  /* Vor dem Aufbau im Browser nichts zeigen - sonst blitzt der Hinweis bei
     jemandem auf, der ihn laengst weggeklickt hat. */
  if (!montiert || weg) return null;

  function schliessen() {
    try {
      window.localStorage.setItem(marke, "ja");
    } catch {
      /* egal - dann gilt es nur fuer diese Sitzung */
    }
    setzeWeg(true);
  }

  return (
    <div
      className="mb-6 inline-flex max-w-full items-center gap-3 rounded-full py-2 pr-2 pl-4 sm:mb-7"
      style={{
        /* Die einzige gefuellte Flaeche im Hero. Navy auf hellem Grund
           hebt sich deutlich ab, ohne die ruhige Palette zu verlassen -
           ein Rot oder Gelb waere hier ein Alarmsignal auf einer
           Gesundheitsseite. */
        background: "var(--gc-navy)",
        color: "var(--gc-bg)",
      }}
    >
      <CalendarCheck className="size-4 flex-none" aria-hidden="true" />

      <p className="min-w-0 text-[0.9rem] leading-snug">
        {terminHinweis.text}{" "}
        <strong className="font-medium">{terminHinweis.betonung}</strong>
        <span className="hidden sm:inline">
          {" · "}
          <Link
            href="/kontakt/"
            className="underline underline-offset-4 hover:opacity-80"
          >
            Termin anfragen
          </Link>
        </span>
      </p>

      <button
        type="button"
        onClick={schliessen}
        aria-label="Hinweis ausblenden"
        /* 44 px, nicht kleiner: Ein Schliessen-Knopf, den man nicht
           trifft, ist schlimmer als keiner - und diese Zielgruppe hat oft
           unsichere Haende. */
        className="flex size-11 flex-none items-center justify-center rounded-full transition-colors hover:bg-white/15"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
