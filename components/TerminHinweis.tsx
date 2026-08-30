"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CalendarCheck, X } from "lucide-react";
import { useRuhig } from "@/components/a11y/Einstellungen";
import { RUHIGE_KURVE } from "@/components/motion/Enthuellen";
import { terminHinweis } from "@/lib/site-config";
import { spracheAus } from "@/lib/sprache";

/**
 * Hinweis auf freie Termine - vollbreiter Streifen unter der Kopfzeile.
 *
 * Warum waagerecht und nicht senkrecht am Rand: Gedrehte Schrift zwingt zum
 * Kopfneigen und ist fuer aeltere Augen kaum lesbar; auf schmalen Schirmen
 * gibt es den Seitenrand ausserdem gar nicht. Ein Streifen liest sich
 * ueberall gleich und braucht keine zweite Loesung fuers Handy.
 *
 * Warum in der festen Leiste und nicht im Hero: Dort lag er vorher ueber
 * der Ueberschrift und schob sie nach unten - drei kleine Elemente
 * uebereinander, bevor die eigentliche Aussage kam. In der Leiste liegt er
 * ueber der ganzen Breite, beruehrt den Text nicht und verdeckt nichts.
 *
 * Die Bewegung ist Teil der Aussage: Er gleitet nach dem Aufbau von oben
 * herein, statt einfach dazustehen - das liest sich als "gerade
 * eingeblendet", nicht als fester Bestandteil der Seite. Beim Wegklicken
 * faehrt er nach oben zusammen; die Seite rueckt weich nach, weil die
 * Kopfzeile ihre Hoehe fortlaufend meldet.
 *
 * Bei "Bewegung reduzieren" steht er sofort da und verschwindet sofort -
 * ohne Gleiten, aber mit demselben Inhalt.
 */

const SCHLUESSEL = "np-termin-gesehen";

export default function TerminHinweis() {
  const ruhig = useRuhig();
  const [weg, setzeWeg] = useState(true);
  const [montiert, setzeMontiert] = useState(false);
  const [sprache, setzeSprache] = useState<"de" | "en">("de");

  /* Der Schluessel traegt das Datum: Ein neuer Termin ist ein neuer
     Hinweis und darf wieder erscheinen, ohne dass jemand etwas
     zuruecksetzen muss. */
  const marke = terminHinweis
    ? `${SCHLUESSEL}:${terminHinweis.bisWann}`
    : SCHLUESSEL;

  useEffect(() => {
    setzeMontiert(true);
    setzeSprache(spracheAus(window.location.pathname));
    try {
      setzeWeg(window.localStorage.getItem(marke) === "ja");
    } catch {
      setzeWeg(false);
    }
  }, [marke]);

  if (!terminHinweis) return null;

  /* Vergleich zum Buildzeitpunkt genuegt: Die Seite wird statisch erzeugt,
     ein abgelaufener Hinweis verschwindet beim naechsten Bauen. Ein Datum
     in der Vergangenheit waere schlechter als gar kein Hinweis. */
  if (new Date() >= new Date(terminHinweis.bisWann)) return null;

  function schliessen() {
    try {
      window.localStorage.setItem(marke, "ja");
    } catch {
      /* ohne Speicher gilt es nur fuer diese Sitzung - harmlos */
    }
    setzeWeg(true);
  }

  const texte =
    sprache === "en"
      ? { anfrage: "Request an appointment", schliessen: "Hide this notice" }
      : { anfrage: "Termin anfragen", schliessen: "Hinweis ausblenden" };

  /* Bis der Browser uebernommen hat, wird nichts gezeigt - sonst blitzt der
     Streifen bei jemandem auf, der ihn laengst weggeklickt hat, und die
     Seite ruckt beim Laden. */
  const sichtbar = montiert && !weg;

  return (
    <AnimatePresence initial={false}>
      {sichtbar ? (
        <motion.div
          key="terminhinweis"
          initial={ruhig ? false : { height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={ruhig ? { height: 0 } : { height: 0, opacity: 0 }}
          transition={
            ruhig
              ? { duration: 0 }
              : { duration: 0.5, ease: RUHIGE_KURVE, delay: 0.35 }
          }
          className="overflow-hidden"
          style={{ background: "var(--gc-navy)", color: "var(--gc-bg)" }}
        >
          {/*
            Eine Zeile, kein Umbruch in Einzelteile.

            Mit `flex-wrap` sprang auf schmalen Schirmen zuerst das Symbol
            allein in eine Zeile, dann der Text, dann der Link - der Kopf
            wurde 244 px hoch und schob den halben ersten Bildschirm weg.
            Symbol und Aufforderung stecken deshalb IM Absatz: Sie brechen
            dann mit dem Text um, statt eigene Zeilen zu beanspruchen.
          */}
          <div className="huelle flex min-h-[3rem] items-center gap-3 py-1.5">
            <CalendarCheck
              className="size-[1.05rem] flex-none"
              aria-hidden="true"
            />

            <p className="min-w-0 flex-1 text-[0.92rem] leading-snug">
              {terminHinweis.text}{" "}
              <strong className="font-medium">{terminHinweis.betonung}</strong>
              {/* Auf dem Handy entfaellt die Aufforderung: Der Streifen
                  sagt bereits, worum es geht, und die feste Leiste am
                  unteren Rand traegt dort Anruf und SMS in voller Breite. */}
              <span className="hidden sm:inline">
                {" · "}
                <Link
                  href={sprache === "en" ? "/en/contact/" : "/kontakt/"}
                  className="underline underline-offset-4 transition-opacity hover:opacity-80"
                >
                  {texte.anfrage}
                </Link>
              </span>
            </p>

            {/* Der Schliessen-Knopf sitzt aussen rechts und ist 44 px gross.
                Ein Hinweis, den man nicht loswird, wird beim zweiten Besuch
                zur Stoerung - und ein Knopf, den man nicht trifft, ist bei
                unsicheren Haenden dasselbe wie keiner. */}
            <button
              type="button"
              onClick={schliessen}
              aria-label={texte.schliessen}
              className="flex size-11 flex-none items-center justify-center rounded-full transition-colors hover:bg-white/15"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
