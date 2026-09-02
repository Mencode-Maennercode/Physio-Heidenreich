import type { Metadata } from "next";
import Brotkrumen from "@/components/Brotkrumen";
import { Check, Phone, X } from "lucide-react";
import Bild from "@/components/Bild";
import Einsatzgebiet from "@/components/Einsatzgebiet";
import Knopf from "@/components/Knopf";
import Sektionskopf from "@/components/Sektionskopf";
import SmsKnopf from "@/components/SmsKnopf";
import Checkliste from "@/components/ablauf/Checkliste";
import Fragen from "@/components/ablauf/Fragen";
import SituationsKlaerer from "@/components/ablauf/SituationsKlaerer";
import Zeitstrahl from "@/components/ablauf/Zeitstrahl";
import GcSeitenKopf from "@/components/golden-calm/GcSeitenKopf";
import {
  BildWischer,
  Enthuellen,
  Staffel,
  StaffelKind,
} from "@/components/motion/Enthuellen";
import { heilpraktikerErlaubnis, kontakt } from "@/lib/site-config";
import {
  ablaufFragen as fragen,
  ablaufAngehoerige as fuerAngehoerige,
  ablaufGrenzen as grenzen,
  ablaufKeinePreisliste as keinePreisliste,
  ablaufKopf as kopf,
  ablaufZusagen as zusagen,
  ablaufStationen,
  ablaufSituationen,
  ablaufCheckliste,
} from "@/lib/content/en/seiten";
import { ohneRezept } from "@/lib/content/ablauf";

export const metadata: Metadata = {
  title: {
    absolute: "How It Works & Fees | Physiotherapy Ahrweiler District",
  },
  alternates: {
    canonical: "/en/how-it-works/",
    languages: { "de-DE": "/ablauf/", en: "/en/how-it-works/" },
  },
  description:
    "How to get in touch, how an appointment comes about, who receives which invoice and what your insurer reimburses — written out before you call.",
};

/**
 * Ablauf-Seite im Golden-Calm-Stil der Startseite.
 *
 * Siehe Kommentar in app/behandlung/page.tsx: schlichter GcSeitenKopf ohne
 * Video und ohne Karte, alles in `.gc-kontext` - dieselben Bausteine
 * (Zeitstrahl, SituationsKlaerer, Checkliste, Fragen, Einsatzgebiet), nur
 * umgefaerbt statt neu gebaut.
 */
export default function HowItWorksPage() {
  return (
    <div lang="en" className="gc-kontext" data-gc>
      <Brotkrumen titel="How it works" pfad="/en/how-it-works/" wurzel="Home" wurzelPfad="/en/" />

      <GcSeitenKopf
        kicker={kopf.augenbraue}
        titel={kopf.titel}
        text={kopf.text}
      />

        {/* ------------------------------------------------------------------
            Vier Stationen. Sie stehen auf derselben warmen Flaeche wie der
            Seitenkopf, damit Kopf und Ablauf als ein Block gelesen werden -
            der erste Farbwechsel kommt bewusst erst beim Situations-Klaerer.

            Das eigene `pt` ist Pflicht, nicht Geschmack: Ohne Top-Padding
            faellt der Abstand des ersten Kindes aus der Sektion heraus
            (Margin-Collapse) und die helle Grundflaeche blitzt als Streifen
            zwischen Kopf und Station 01 durch. Der Abstand gehoert deshalb an
            die Sektion, nicht an den Zeitstrahl.

            Die Haarlinie ersetzt den Farbsprung als Kapitelmarke: ein 1-px-
            Gold-Verlauf, der einzige grossflaechige Gold-Einsatz im System.
            ------------------------------------------------------------------ */}
        <section className="auf-warm pt-[clamp(2.5rem,5vw,4rem)] pb-[var(--sektion-luft)]">
          <div className="huelle">
            <div className="haarlinie" aria-hidden="true" />
            <div className="mt-[clamp(2.5rem,5vw,4rem)]">
              <Zeitstrahl stationen={ablaufStationen} />
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            Zusagen und Grenzen - direkt nach dem Ueberblick, noch vor den
            Abrechnungs-Details je Situation. Wer nur kurz reinliest, bevor er
            anruft, soll "was ich nicht anbiete" hier lesen - nicht erst nach
            Checkliste und Angehoerigen-Block weiter unten.
            ------------------------------------------------------------------ */}
        <section className="auf-warm sektion">
          <div className="huelle grid min-w-0 gap-[clamp(2.5rem,6vw,5rem)] lg:grid-cols-2">
            <div className="min-w-0">
              <p className="augenbraue">{zusagen.augenbraue}</p>
              <h2 className="schrift-display titel-mittel mt-6 max-w-[14ch]">
                {zusagen.titel}
              </h2>

              <Staffel alsListe className="mt-10 flex flex-col">
                {zusagen.punkte.map((punkt) => (
                  <StaffelKind
                    key={punkt.titel}
                    alsPunkt
                    className="flex gap-5 border-t border-linie-warm py-6 first:border-t-0 first:pt-0"
                  >
                    <Check
                      className="size-5 flex-none translate-y-0.5 text-akzent-warm"
                      aria-hidden="true"
                    />
                    <div>
                      <h3 className="font-medium">{punkt.titel}</h3>
                      <p className="mt-1.5 text-[0.98rem] text-leise">
                        {punkt.text}
                      </p>
                    </div>
                  </StaffelKind>
                ))}
              </Staffel>
            </div>

            <div className="min-w-0 lg:pt-[6.5rem]">
              <div className="rounded-lg border border-linie-warm p-[clamp(1.75rem,4vw,2.5rem)]">
                <h2 className="schrift-display titel-klein">{grenzen.titel}</h2>
                <p className="mt-4 text-[0.98rem] text-leise">{grenzen.text}</p>
                <ul className="mt-8 flex flex-col gap-4">
                  {grenzen.punkte.map((punkt) => (
                    <li key={punkt} className="flex gap-4">
                      <X
                        className="size-4 flex-none translate-y-1 text-leise"
                        aria-hidden="true"
                      />
                      <span className="text-[0.98rem]">{punkt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            Situations-Klärer - der Kern des Transparenzversprechens.
            ------------------------------------------------------------------ */}
        <section className="sektion">
          <div className="huelle">
            <Sektionskopf
              augenbraue="Fees"
              titel="What applies to you?"
              text="Choose your situation. You then see exactly the route that concerns you — who invoices whom, which documents are needed and who reimburses in the end."
              className="mb-14"
            />
            <SituationsKlaerer situationen={ablaufSituationen} />
          </div>
        </section>

        {/* ------------------------------------------------------------------
            Warum hier keine Preisliste steht.
            ------------------------------------------------------------------ */}
        <section className="pb-[var(--sektion-luft)]">
          <div className="huelle">
            <Enthuellen>
              <div className="grid min-w-0 gap-x-[clamp(2rem,5vw,4rem)] gap-y-8 border-y border-linie py-[clamp(2.5rem,5vw,4rem)] lg:grid-cols-[minmax(0,22rem)_1fr]">
                <h2 className="schrift-display titel-klein max-w-[16ch]">
                  {keinePreisliste.titel}
                </h2>
                <div className="lesespalte-weit flex flex-col gap-5 text-[1.05rem]">
                  {keinePreisliste.absaetze.map((absatz) => (
                    <p key={absatz}>{absatz}</p>
                  ))}
                </div>
              </div>
            </Enthuellen>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            Direktzugang. Steht nur im HTML, wenn die Erlaubnis vorliegt -
            Schalter in lib/site-config.ts.
            ------------------------------------------------------------------ */}
        {heilpraktikerErlaubnis ? (
          <section className="sektion bg-grund-warm">
            <div className="huelle-eng">
              <Enthuellen>
                <p className="augenbraue">{ohneRezept.augenbraue}</p>
                <h2 className="schrift-display titel-mittel mt-6 max-w-[18ch]">
                  {ohneRezept.titel}
                </h2>
                <div className="lesespalte-weit mt-7 flex flex-col gap-5 text-[1.05rem]">
                  {ohneRezept.absaetze.map((absatz) => (
                    <p key={absatz}>{absatz}</p>
                  ))}
                </div>
              </Enthuellen>
            </div>
          </section>
        ) : null}

        {/* ------------------------------------------------------------------
            Für Angehörige - der Block für die Mehrheit der Leser.
            ------------------------------------------------------------------ */}
        <section className="sektion bg-grund-warm">
          <div className="huelle">
            <div className="grid min-w-0 gap-[clamp(2.5rem,6vw,4.5rem)] lg:grid-cols-[0.8fr_1fr]">
              <div className="min-w-0">
                <p className="augenbraue">{fuerAngehoerige.augenbraue}</p>
                <h2 className="schrift-display titel-mittel mt-6 max-w-[14ch]">
                  {fuerAngehoerige.titel}
                </h2>
                <BildWischer className="mt-10 hidden lg:block">
                  <Bild
                    name="angehoerige"
                    className="aspect-3/2 overflow-hidden"
                    groessen="(min-width: 1024px) 34vw, 100vw"
                  />
                </BildWischer>
              </div>

              <Staffel className="flex min-w-0 flex-col">
                {fuerAngehoerige.bloecke.map((block) => (
                  <StaffelKind
                    key={block.titel}
                    className="border-t border-linie py-7 first:border-t-0 first:pt-0"
                  >
                    <h3 className="schrift-display text-[1.3rem] leading-tight">
                      {block.titel}
                    </h3>
                    <p className="lesespalte-weit mt-3.5 text-[1rem] text-leise">
                      {block.text}
                    </p>
                  </StaffelKind>
                ))}
              </Staffel>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            Checkliste
            ------------------------------------------------------------------ */}
        <section className="sektion">
          <div className="huelle-eng">
            <Enthuellen>
              <Checkliste checkliste={ablaufCheckliste} />
            </Enthuellen>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            Einsatzgebiet und Touren
            ------------------------------------------------------------------ */}
        <section className="sektion">
          <div className="huelle">
            <Sektionskopf
              augenbraue="Area and routes"
              titel="Why I ask where you live first"
              text="I work with a deliberately small number of patients and arrange appointments so that connected routes emerge from them."
              className="mb-14"
            />
          </div>
          <div className="auf-warm">
            <div className="huelle py-[clamp(3rem,6vw,5rem)]">
              <Einsatzgebiet />
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            Häufige Fragen
            ------------------------------------------------------------------ */}
        <section className="sektion">
          <div className="huelle grid min-w-0 gap-[clamp(2rem,5vw,4rem)] lg:grid-cols-[minmax(0,20rem)_1fr]">
            <div>
              <p className="augenbraue">{fragen.augenbraue}</p>
              <h2 className="schrift-display titel-mittel mt-6 max-w-[12ch]">
                {fragen.titel}
              </h2>
            </div>
            <Fragen fragen={fragen} />
          </div>
        </section>

        {/* ------------------------------------------------------------------
            Abschluss
            ------------------------------------------------------------------ */}
        <section className="sektion bg-grund-warm">
          <div className="huelle-eng text-center">
            <Enthuellen className="flex flex-col items-center">
              <p className="augenbraue">Still have questions?</p>
              <h2 className="schrift-display titel-klein mt-6 max-w-[24ch]">
                Whatever is not written here, I answer on the phone
              </h2>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Knopf
                  href={`tel:${kontakt.telefonLink}`}
                  kind={
                    <>
                      <Phone className="size-4" aria-hidden="true" />
                      {kontakt.telefonAnzeige}
                    </>
                  }
                />
                <SmsKnopf />
                <Knopf href="/en/contact/" art="linie" kind="Request a call back" />
              </div>
            </Enthuellen>
          </div>
        </section>
    </div>
  );
}
