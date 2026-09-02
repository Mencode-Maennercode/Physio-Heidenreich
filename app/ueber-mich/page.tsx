import type { Metadata } from "next";
import Brotkrumen from "@/components/Brotkrumen";
import { Phone } from "lucide-react";
import Bild from "@/components/Bild";
import Knopf from "@/components/Knopf";
import Sektionskopf from "@/components/Sektionskopf";
import {
  BildWischer,
  Enthuellen,
  Staffel,
  StaffelKind,
} from "@/components/motion/Enthuellen";
import { grade, kontakt } from "@/lib/site-config";
import {
  einleitung,
  haltung,
  kopf,
  qualifikation,
  warumHausbesuche,
  werdegang,
} from "@/lib/content/ueber-mich";

export const metadata: Metadata = {
  title: "Ihre Physiotherapeutin",
  alternates: {
    canonical: "/ueber-mich/",
    languages: { "de-DE": "/ueber-mich/", en: "/en/about/" },
  },
  description: `${grade.bachelor}, ${grade.master}. Viele Jahre Klinikerfahrung, überwiegend im neurologischen Bereich — jetzt als mobile Physiotherapie im Kreis Ahrweiler.`,
};

export default function UeberMichSeite() {
  return (
    <div className="gc-kontext" data-gc>
      <Brotkrumen titel="Über mich" pfad="/ueber-mich/" />

      {/* ------------------------------------------------------------------
          Kopf. Kein Video hier - auf dieser Seite geht es um einen Menschen,
          nicht um Atmosphäre.
          ------------------------------------------------------------------ */}
      <section
        className="bg-grund-warm pb-[clamp(3rem,6vw,5rem)]"
        style={{ paddingTop: "calc(var(--kopf-hoehe, 7.5rem) + 2.5rem)" }}
      >
        <div className="huelle grid items-end gap-[clamp(2.5rem,6vw,4.5rem)] lg:grid-cols-[1fr_0.75fr]">
          <div>
            <p className="augenbraue">{kopf.augenbraue}</p>
            <h1 className="schrift-display titel-gross mt-7">{kopf.titel}</h1>
            <p className="mt-4 text-[1.05rem] text-leise">
              {kopf.untertitel} · {grade.kurz}
            </p>

            <div className="lesespalte-weit mt-9 flex flex-col gap-5 text-[1.1rem]">
              {einleitung.absaetze.map((absatz) => (
                <p key={absatz}>{absatz}</p>
              ))}
            </div>
          </div>

          {/* Ohne Gegenbewegung: Das Portraet ist eng geschnitten, jede
              zusaetzliche Verschiebung ginge an Kopf oder Kinn. */}
          <BildWischer className="relative" tiefe={false}>
            <Bild
              name="portraet"
              className="aspect-4/5 overflow-hidden"
              groessen="(min-width: 1024px) 34vw, 100vw"
              vorrang
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-3 border border-akzent/40"
            />
          </BildWischer>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          Werdegang als stiller Zeitstrahl.
          ------------------------------------------------------------------ */}
      <section className="sektion">
        <div className="huelle">
          <Sektionskopf augenbraue={werdegang.augenbraue} titel={werdegang.titel} />

          <Staffel alsListe className="mt-14">
            {werdegang.stationen.map((station) => (
              <StaffelKind
                key={station.titel}
                alsPunkt
                className="relative grid gap-x-10 gap-y-3 border-t border-linie-fein py-8 last:border-b md:grid-cols-[minmax(0,9rem)_1fr]"
              >
                <span className="feld-marke pt-1">{station.zeit}</span>
                <div>
                  <h3 className="schrift-display text-[1.35rem] leading-tight">
                    {station.titel}
                  </h3>
                  <p className="lesespalte-weit mt-3 text-[0.98rem] text-leise">
                    {station.text}
                  </p>
                </div>
              </StaffelKind>
            ))}
          </Staffel>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          Qualifikation. Beide Grade stehen hier mit Fachrichtung - siehe
          Kommentar zu `grade` in lib/site-config.ts.
          ------------------------------------------------------------------ */}
      <section className="auf-warm sektion">
        <div className="huelle grid gap-[clamp(2.5rem,6vw,5rem)] lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="augenbraue">{qualifikation.augenbraue}</p>
            <h2 className="schrift-display titel-mittel mt-6 max-w-[16ch]">
              {qualifikation.titel}
            </h2>
            <p className="lesespalte mt-8 border-l-2 border-akzent-warm pl-6 text-leise">
              {qualifikation.hinweis}
            </p>
          </div>

          <div>
            <ul className="flex flex-col">
              {qualifikation.abschluesse.map((abschluss) => (
                <li
                  key={abschluss.titel}
                  className="border-t border-linie-warm py-6 first:border-t-0 first:pt-0"
                >
                  <h3 className="schrift-display text-[1.25rem]">
                    {abschluss.titel}
                  </h3>
                  <p className="mt-2 text-[0.95rem] text-leise">
                    {abschluss.detail}
                  </p>
                </li>
              ))}
            </ul>

            <h3 className="feld-marke mt-10">
              {qualifikation.fortbildungenTitel}
            </h3>
            <ul className="mt-5 flex flex-col gap-3">
              {qualifikation.fortbildungen.map((fortbildung) => (
                <li key={fortbildung} className="flex items-baseline gap-3.5">
                  <span
                    aria-hidden="true"
                    className="size-1.5 flex-none translate-y-[-0.15em] rounded-full bg-akzent-warm"
                  />
                  <span className="text-leise">{fortbildung}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[0.92rem] text-leise">
              {qualifikation.fortbildungenHinweis}
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          Haltung. Der Absatz behauptet keine Ruhe - er ist ruhig geschrieben.
          ------------------------------------------------------------------ */}
      <section className="sektion">
        <div className="huelle grid items-center gap-[clamp(2.5rem,6vw,5rem)] lg:grid-cols-[0.8fr_1fr]">
          <BildWischer>
            <Bild
              name="wohnraum"
              className="aspect-4/5 overflow-hidden"
              groessen="(min-width: 1024px) 36vw, 100vw"
            />
          </BildWischer>

          <div>
            <p className="augenbraue">{haltung.augenbraue}</p>
            <h2 className="schrift-display titel-mittel mt-6 max-w-[14ch]">
              {haltung.titel}
            </h2>
            <div className="lesespalte mt-8 flex flex-col gap-5 text-[1.05rem]">
              {haltung.absaetze.map((absatz) => (
                <p key={absatz}>{absatz}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          Warum Hausbesuche
          ------------------------------------------------------------------ */}
      <section className="sektion bg-grund-warm">
        <div className="huelle-eng">
          <Enthuellen>
            <p className="augenbraue">{warumHausbesuche.augenbraue}</p>
            <h2 className="schrift-display titel-mittel mt-6 max-w-[22ch]">
              {warumHausbesuche.titel}
            </h2>
            <div className="lesespalte-weit mt-8 flex flex-col gap-5 text-[1.05rem]">
              {warumHausbesuche.absaetze.map((absatz) => (
                <p key={absatz}>{absatz}</p>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Knopf
                href={`tel:${kontakt.telefonLink}`}
                kind={
                  <>
                    <Phone className="size-4" aria-hidden="true" />
                    {kontakt.telefonAnzeige}
                  </>
                }
              />
              <Knopf href="/behandlung/" art="linie" kind="Was ich behandle" />
            </div>
          </Enthuellen>
        </div>
      </section>
    </div>
  );
}
