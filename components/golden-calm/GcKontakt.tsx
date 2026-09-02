"use client";

import Link from "next/link";
import { Mail, MessageSquare, Phone } from "lucide-react";
import Formular from "@/components/kontakt/Formular";
import MagnetKnopf from "./MagnetKnopf";
import { kontaktBand as kontaktBandDe } from "@/lib/content/golden-calm";
import type { KontaktBand } from "@/lib/content/typen";
import WortAuftritt from "@/components/motion/WortAuftritt";
import { kontakt } from "@/lib/site-config";

/**
 * Kontakt-Band in warmem Braun, Formular als eingebettete Karte.
 *
 * Das Formular selbst ist unveraendert das gepruefte Formular.tsx (Honigtopf,
 * Zeitmessung, PHP-Anbindung, Barrierefreiheit) - es wird nur farblich
 * umgefaerbt, indem die geteilten --ui-* Tokens innerhalb dieses Rahmens auf
 * die Golden-Calm-Werte umgehaengt werden. Kein Code doppelt gepflegt.
 */
/*
  Der Inhalt kommt als Parameter herein, mit dem deutschen als Vorgabe.
  So rendert dieselbe Komponente die deutsche und die englische Seite -
  ohne Kopie und ohne dass die Gestaltung zweimal gepflegt werden muss.
  Bestehende Aufrufe ohne Parameter bleiben unveraendert deutsch.
*/
export default function GcKontakt({
  kontaktBand = kontaktBandDe,
  formular = true,
}: {
  kontaktBand?: KontaktBand;
  /*
    Auf Deutsch immer `true`. Auf Englisch `false`: Formular.tsx ist
    unuebersetzt (Feldbeschriftungen, Datenschutz-Hinweis, Bestaetigung -
    alles Deutsch) UND versendet ueber kontakt.php mit einer deutschen
    Danke-Seite. Dieselbe Begruendung, aus der /en/contact/ von Anfang an
    ganz ohne Formular auskommt (siehe dort) - sie galt hier nur bisher
    nicht, weil GcKontakt uebersehen wurde, als die englische Seite
    entstand. Ein englisch beschrifteter Rahmen um ein deutsches Formular
    waere schlechter als gar keines.
  */
  formular?: boolean;
} = {}) {
  return (
    <section
      id="kontakt"
      className="gc-anker mt-[clamp(2.75rem,10vw,7rem)] py-[clamp(2.75rem,10vw,7rem)]"
      style={{ background: "var(--gc-braun)", color: "#F3EDE4" }}
    >
      {/*
        `items-center` statt der Voreinstellung `stretch`: Beide Spalten sind
        unterschiedlich hoch (links vier kurze Bloecke, rechts eine Karte).
        Oben buendig gesetzt entstand daraus eine grosse leere Flaeche unter
        dem Textblock - das war die Unruhe im Band. Mittig zueinander
        ausgerichtet liegt das Gewicht auf einer Linie.
      */}
      <div className="mx-auto grid max-w-[1280px] items-center gap-9 px-[clamp(1.25rem,4vw,2.75rem)] md:grid-cols-2 md:gap-20">
        <div>
          <p
            className="gc-kicker mb-3 text-[13px] tracking-[0.24em] uppercase sm:mb-[18px]"
            style={{ color: "#E0C79A" }}
          >
            {kontaktBand.kicker}
          </p>
          <WortAuftritt
            text={kontaktBand.titel}
            className="gc-h2 mb-4 sm:mb-6 font-[family-name:var(--font-cormorant)] font-normal text-[clamp(2.1rem,3.8vw,3.1rem)] leading-[1.15]"
            style={{ color: "#FBF8F2" }}
          />
          <p
            className="gc-lead mb-6 max-w-[28em] text-[1.2rem] sm:mb-9"
            style={{ color: "#E2D8C9" }}
          >
            {kontaktBand.text}
          </p>

          <MagnetKnopf
            href={`tel:${kontakt.telefonLink}`}
            stark={0.2}
            className="min-h-[4.5rem] gap-4 rounded-2xl border px-6 py-4"
            style={{
              background: "rgba(255,255,255,0.07)",
              borderColor: "rgba(197,155,108,0.5)",
              color: "#FBF8F2",
            }}
          >
            <span
              className="grid size-[46px] flex-none place-items-center rounded-full"
              style={{ background: "rgba(197,155,108,0.2)" }}
            >
              <Phone
                className="size-[1.05rem]"
                style={{ color: "var(--gc-gold)" }}
                aria-hidden="true"
              />
            </span>
            <span className="flex min-w-0 flex-col text-left leading-[1.35]">
              <span
                className="text-[14px] tracking-[0.16em] uppercase"
                style={{ color: "#E0C79A" }}
              >
                {kontaktBand.anrufLabel}
              </span>
              <span className="font-[family-name:var(--font-cormorant)] text-[1.7rem]">
                {kontakt.telefonAnzeige}
              </span>
            </span>
          </MagnetKnopf>

          <p className="mt-6 text-[1.05rem]" style={{ color: "#D2C6B9" }}>
            {kontaktBand.sprechzeiten}
          </p>
        </div>

        {/*
          Token-Umfaerbung: nur innerhalb dieses Rahmens. Formular.tsx nutzt
          .feld (Unterstrich-Eingabe), text-aktion, bg-aktion, text-leise,
          feld-marke - alle zeigen hier auf Gold/Navy statt auf die
          Petrol-Tokens der uebrigen Seite.
        */}
        <div
          className="rounded-[24px] p-9"
          style={
            {
              background: "#FBF8F2",
              // Die umschliessende Braun-Sektion setzt color:#F3EDE4 fuer
              // ihren eigenen (hellen) Text - ohne Reset hier wuerde diese
              // helle Farbe auf die weisse Formular-Karte durchschlagen und
              // z. B. das Datenschutz-Label auf 1,1:1 druecken.
              color: "var(--gc-text)",
              boxShadow: "var(--gc-schatten-tief)",
              "--ui-aktion": "var(--gc-navy)",
              "--ui-aktion-hover": "var(--gc-navy-dunkel)",
              "--ui-linie": "var(--gc-feld-rand)",
              "--ui-text": "var(--gc-text)",
              "--ui-text-leise": "var(--gc-text-leise)",
              "--ui-grund-warm": "var(--gc-bg-sekundaer)",
            } as React.CSSProperties
          }
        >
          <p
            className="font-[family-name:var(--font-cormorant)] text-[1.5rem] leading-tight"
            style={{ color: "var(--gc-text)" }}
          >
            {kontaktBand.formularTitel}
          </p>
          <p
            className="mt-1.5 mb-8 text-[0.98rem]"
            style={{ color: "var(--gc-text-leise)" }}
          >
            {kontaktBand.formularText}
          </p>

          {formular ? (
            <>
              <Formular kompakt />

              {/* Der Weg zur vollstaendigen Fassung bleibt sichtbar - wer
                  die Wunschzeit angeben oder etwas schildern will, soll
                  das nicht suchen muessen. */}
              <p className="mt-7 text-[0.9rem]">
                <Link
                  href="/kontakt/"
                  className="underline underline-offset-4"
                  style={{ color: "var(--gc-text-leise)" }}
                >
                  {kontaktBand.formularLink}
                </Link>
              </p>
            </>
          ) : (
            <div className="flex flex-col gap-3">
              <MagnetKnopf
                href={`mailto:${kontakt.email}`}
                stark={0.08}
                className="min-h-[3.25rem] gap-3 rounded-full border px-6"
                style={{ borderColor: "var(--gc-feld-rand)", color: "var(--gc-text)" }}
              >
                <Mail className="size-4 flex-none" aria-hidden="true" />
                {kontakt.email}
              </MagnetKnopf>
              <MagnetKnopf
                href={kontakt.sms}
                stark={0.08}
                className="min-h-[3.25rem] gap-3 rounded-full border px-6"
                style={{ borderColor: "var(--gc-feld-rand)", color: "var(--gc-text)" }}
              >
                <MessageSquare className="size-4 flex-none" aria-hidden="true" />
                {kontaktBand.smsLabel ?? "SMS"}
              </MagnetKnopf>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
