import type { Metadata } from "next";
import { Phone } from "lucide-react";
import Bild from "@/components/Bild";
import Knopf from "@/components/Knopf";
import Sektionskopf from "@/components/Sektionskopf";
import Wohnungsweg from "@/components/behandlung/Wohnungsweg";
import GcSeitenKopf from "@/components/golden-calm/GcSeitenKopf";
import {
  BildWischer,
  Enthuellen,
  Staffel,
  StaffelKind,
} from "@/components/motion/Enthuellen";
import { kontakt } from "@/lib/site-config";
import {
  kopf,
  schwerpunkt,
  warumZuHause,
  weitereBehandlungen,
  wohnungsweg,
} from "@/lib/content/behandlung";

export const metadata: Metadata = {
  title: "Behandlungen im Hausbesuch",
  alternates: { canonical: "/behandlung/" },
  description:
    "Physiotherapie im Hausbesuch: Krankengymnastik, Mobilisation, Nachsorge nach Operationen, Sturzprophylaxe, Lymphdrainage und neurologische Behandlung mit besonderer Erfahrung.",
};

/**
 * Behandlungsseite im Golden-Calm-Stil der Startseite.
 *
 * Der Kopf ist ein schlichter GcSeitenKopf: kein Video, keine eingerueckte
 * Karte - dasselbe ruhige Muster wie auf "Ueber mich" und "Kontakt". Der
 * grosse Auftritt mit Video bleibt der Startseite vorbehalten.
 *
 * Alles ab hier steckt in `.gc-kontext`: Die Bausteine darunter
 * (Sektionskopf, Wohnungsweg, Knopf, Staffel/StaffelKind) sind unveraendert
 * dieselben Komponenten wie zuvor - sie nutzen ausschliesslich die geteilten
 * --ui-* Tokens, und `.gc-kontext` haengt diese innerhalb des Rahmens auf
 * Gold/Navy/Cormorant um (siehe app/globals.css). Deshalb kein Nachbau
 * dieser Bausteine noetig, nur die Umgebung stimmt jetzt.
 */
export default function BehandlungSeite() {
  return (
    <div className="gc-kontext" data-gc>
      <GcSeitenKopf
        kicker={kopf.augenbraue}
        titel={kopf.titel}
        text={kopf.text}
      />

        {/* ------------------------------------------------------------------
            Das vollstaendige Spektrum - zuerst, gleichwertig gelistet.
            Wer nicht neurologisch sucht, findet sein Thema sofort, statt
            sich erst durch die Vertiefung weiter unten zu scrollen.
            ------------------------------------------------------------------ */}
        <section className="sektion">
          <div className="huelle">
            <Sektionskopf
              augenbraue={weitereBehandlungen.augenbraue}
              titel={weitereBehandlungen.titel}
              text={weitereBehandlungen.text}
            />

            <Staffel alsListe className="mt-14 border-t border-linie-fein">
              {weitereBehandlungen.liste.map((eintrag) => (
                <StaffelKind
                  key={eintrag.titel}
                  alsPunkt
                  className="group grid min-w-0 gap-x-10 gap-y-3 border-b border-linie-fein py-8 md:grid-cols-[minmax(0,15rem)_1fr_1fr]"
                >
                  <h3 className="schrift-display text-[1.3rem] leading-tight transition-colors group-hover:text-aktion">
                    {eintrag.titel}
                  </h3>
                  <p className="text-[0.98rem]">{eintrag.was}</p>
                  <p className="text-[0.98rem] text-leise">{eintrag.fuerWen}</p>
                </StaffelKind>
              ))}
            </Staffel>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            Schwerpunkt Neurologie - die Vertiefung, mit dem meisten Raum.
            ------------------------------------------------------------------ */}
        <section className="sektion">
          <div className="huelle grid min-w-0 items-center gap-[clamp(2.5rem,6vw,5rem)] lg:grid-cols-[1fr_0.8fr]">
            <div className="min-w-0">
              <p className="augenbraue">{schwerpunkt.augenbraue}</p>
              <h2 className="schrift-display titel-mittel mt-6 max-w-[16ch]">
                {schwerpunkt.titel}
              </h2>
              <p className="lesespalte mt-7 text-[1.05rem]">{schwerpunkt.text}</p>

              <ul className="mt-9 flex flex-wrap gap-2.5">
                {schwerpunkt.indikationen.map((eintrag) => (
                  <li
                    key={eintrag}
                    className="rounded-full border border-linie px-4 py-2 text-[0.92rem] text-leise"
                  >
                    {eintrag}
                  </li>
                ))}
              </ul>
            </div>

            <BildWischer>
              <Bild
                name="haende"
                className="aspect-4/5 overflow-hidden"
                groessen="(min-width: 1024px) 36vw, 100vw"
              />
            </BildWischer>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            Warum zu Hause - der inhaltlich wichtigste Abschnitt der Seite.
            Warm abgesetzt, damit er nicht als weitere Aufzaehlung untergeht.
            ------------------------------------------------------------------ */}
        <section className="auf-warm sektion">
          <div className="huelle">
            <Sektionskopf
              augenbraue={warumZuHause.augenbraue}
              titel={warumZuHause.titel}
            />

            <Staffel className="mt-16 grid min-w-0 gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
              {warumZuHause.gruende.map((grund, i) => (
                <StaffelKind
                  key={grund.titel}
                  className="min-w-0 border-t border-linie-warm pt-7"
                >
                  <span
                    aria-hidden="true"
                    className="text-[0.72rem] tracking-[0.18em] text-akzent-warm"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="schrift-display mt-4 text-[1.35rem] leading-tight">
                    {grund.titel}
                  </h3>
                  <p className="mt-4 text-[0.98rem] text-leise">{grund.text}</p>
                </StaffelKind>
              ))}
            </Staffel>

            <Enthuellen className="mt-16">
              <div className="grid min-w-0 items-center gap-10 border-t border-linie-warm pt-12 lg:grid-cols-[0.9fr_1fr]">
                <BildWischer>
                  <Bild
                    name="treppe"
                    className="aspect-4/5 overflow-hidden"
                    groessen="(min-width: 1024px) 40vw, 100vw"
                  />
                </BildWischer>
                <p className="schrift-display text-[clamp(1.5rem,2.6vw,2.1rem)] leading-[1.35]">
                  Eine Treppe im Übungsraum ist eine Treppe. Ihre Treppe ist der
                  Weg ins Schlafzimmer.
                </p>
              </div>
            </Enthuellen>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            Der gescrollte Weg durch die Wohnung. Führt das Argument von oben
            fort - dort grundsätzlich, hier an fünf konkreten Stellen.
            ------------------------------------------------------------------ */}
        <section className="auf-warm">
          <div className="huelle pt-[var(--sektion-luft)] lg:hidden">
            <p className="text-leise">{wohnungsweg.text}</p>
          </div>
          <Wohnungsweg />
        </section>

        <section className="sektion bg-grund-warm">
          <div className="huelle-eng text-center">
            <Enthuellen className="flex flex-col items-center">
              <p className="augenbraue">Unsicher, was passt?</p>
              <h2 className="schrift-display titel-klein mt-6 max-w-[26ch]">
                Rufen Sie an. Fünfzehn Minuten Telefon ersparen oft drei Termine.
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
                <Knopf href="/ablauf/" art="linie" kind="Ablauf und Abrechnung" />
              </div>
            </Enthuellen>
          </div>
        </section>
    </div>
  );
}
