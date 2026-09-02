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
 * WICHTIG - kein Gedaechtnis: Das Wegklicken gilt nur fuer den aktuellen
 * Besuch. Beim naechsten Aufruf ist der Streifen wieder da. Das ist eine
 * bewusste Entscheidung gegen die uebliche Loesung mit lokalem Speicher:
 * Ein Terminhinweis ist eine Nachricht, keine Einstellung. Wer die Seite
 * Wochen spaeter erneut oeffnet, soll ihn wiedersehen - sonst erfaehrt
 * ausgerechnet der wiederkehrende Interessent als Einziger nichts von den
 * freien Terminen. Der Preis ist gering: Innerhalb eines Besuchs bleibt er
 * weg, weil dieser Baustein in der Kopfzeile steht und beim Wechsel
 * zwischen Seiten nicht neu aufgebaut wird.
 *
 * Bei "Bewegung reduzieren" steht er sofort da und verschwindet sofort -
 * ohne Gleiten, aber mit demselben Inhalt.
 */
export default function TerminHinweis() {
  const ruhig = useRuhig();
  const [weg, setzeWeg] = useState(false);
  const [montiert, setzeMontiert] = useState(false);
  const [sprache, setzeSprache] = useState<"de" | "en">("de");

  useEffect(() => {
    setzeMontiert(true);
    setzeSprache(spracheAus(window.location.pathname));
  }, []);

  if (!terminHinweis) return null;

  /* Vergleich zum Buildzeitpunkt genuegt: Die Seite wird statisch erzeugt,
     ein abgelaufener Hinweis verschwindet beim naechsten Bauen. Ein Datum
     in der Vergangenheit waere schlechter als gar kein Hinweis. */
  if (new Date() >= new Date(terminHinweis.bisWann)) return null;

  const texte =
    sprache === "en"
      ? { anfrage: "Request an appointment", schliessen: "Hide this notice" }
      : { anfrage: "Termin anfragen", schliessen: "Hinweis ausblenden" };

  /* Erst nach dem Aufbau im Browser zeigen, damit der Streifen sauber
     hereingleitet statt beim Laden zu springen. */
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
            Die Aufforderung steckt deshalb IM Absatz: Sie bricht mit dem
            Text um, statt eine eigene Zeile zu beanspruchen.
          */}
          <div className="huelle flex min-h-[2.5rem] items-center gap-2.5 py-1 sm:min-h-[3rem] sm:gap-3 sm:py-1.5">
            {/*
              Der orange umrandete Kreis ist der Blickfang des Streifens.

              Ein Ring statt einer gefuellten Flaeche: Gefuellt waere es ein
              Warnzeichen, wie man es von Fehlermeldungen kennt. Der Ring
              mit der nur angedeuteten Fuellung wirkt wie eine Markierung -
              er zieht den Blick, ohne Dringlichkeit zu behaupten. Dieselbe
              Farbe traegt unten die Datumsangabe, damit Blickfang und
              eigentliche Nachricht zusammengehoeren.
            */}
            <span
              aria-hidden="true"
              className="flex size-7 flex-none items-center justify-center rounded-full border sm:size-9"
              style={{
                borderColor: "var(--gc-signal)",
                background: "color-mix(in srgb, var(--gc-signal) 14%, transparent)",
                color: "var(--gc-signal)",
              }}
            >
              <CalendarCheck className="size-[0.85rem] sm:size-[1.05rem]" />
            </span>

            <p className="min-w-0 flex-1 text-[0.8rem] leading-snug sm:text-[0.92rem]">
              {terminHinweis.text}{" "}
              {/* Das Datum ist die eigentliche Nachricht - es traegt die
                  Signalfarbe, nicht die ganze Zeile. */}
              {/* `whitespace-nowrap`: Ein Datum ist eine Einheit. Ohne die
                  Angabe trennte die globale Silbentrennung es mitten im
                  Monatsnamen ("1. Ok-" / "tober 2026") - auf einem schmalen
                  Android-Geraet gemeldet. Jetzt rutscht das Datum als
                  Ganzes in die zweite Zeile, wenn der Platz nicht reicht. */}
              <strong
                className="font-medium whitespace-nowrap"
                style={{ color: "var(--gc-signal)" }}
              >
                {terminHinweis.betonung}
              </strong>
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
                Ein Knopf, den man nicht trifft, ist bei unsicheren Haenden
                dasselbe wie keiner. */}
            <button
              type="button"
              onClick={() => setzeWeg(true)}
              aria-label={texte.schliessen}
              /* Die Tippflaeche bleibt 44 px hoch (WCAG 2.5.8), auch wenn
                 der Streifen selbst schmaler ist - das Kreuz ragt einfach
                 unsichtbar ueber ihn hinaus. Ein Knopf, den man nicht
                 trifft, ist bei unsicheren Haenden dasselbe wie keiner. */
              className="-my-2 flex size-11 flex-none items-center justify-center rounded-full transition-colors hover:bg-white/15"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
