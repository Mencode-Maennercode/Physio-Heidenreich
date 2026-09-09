import Link from "next/link";
import * as Accordion from "@radix-ui/react-accordion";
import { MapPin, Plus } from "lucide-react";
import Brotkrumen from "@/components/Brotkrumen";
import GcHero from "@/components/golden-calm/GcHero";
import GcKonzept from "@/components/golden-calm/GcKonzept";
import GcLeistungen from "@/components/golden-calm/GcLeistungen";
import GcUeberMich from "@/components/golden-calm/GcUeberMich";
import GcKontakt from "@/components/golden-calm/GcKontakt";
import { hero as heroDe } from "@/lib/content/golden-calm";
import { seite } from "@/lib/site-config";
import { ortsPfad, ortsseiten, type Ortsseite as OrtsseiteDaten } from "@/lib/content/orte";

/**
 * Gemeinsames Geruest aller Ortsseiten.
 *
 * Der sichtbare Hauptteil ist ABSICHTLICH identisch mit der Startseite
 * (derselbe Hero, dieselben Abschnitte Konzept/Leistungen/UeberMich/Kontakt)
 * - einzig die H1 im Hero nennt den Ort. Das war frueher anders: Jede
 * Ortsseite hatte ihr eigenes Layout mit eigenen Absaetzen. Der gesamte
 * Inhalt, der frueher dort stand UND der Grund, warum diese Seiten fuer
 * Google eigenstaendig sind, steckt jetzt gesammelt im Klappblock am Ende
 * ("In »Ort«") - nicht gekuerzt, nur umsortiert. Google gewichtet
 * Akkordeon-Inhalt genauso wie offenen Text (auch beim mobilen Index).
 *
 * Zum JSON-LD: Hier steht bewusst KEIN zweiter `MedicalBusiness`. Die Praxis
 * gibt es einmal, sie hat in StrukturDaten.tsx die feste Kennung
 * `#praxis` - vier Ortsseiten mit vier Praxiseintraegen wuerden Google
 * glauben machen, es gaebe vier Standorte. Stattdessen ein `Service`, der
 * per `provider` auf denselben Eintrag zeigt und ueber `areaServed` sagt,
 * wo diese Leistung erbracht wird. Das ist die Auszeichnung, die fuer ein
 * Angebot ohne Praxisraeume vorgesehen ist.
 */
export default function Ortsseite({ ort }: { ort: OrtsseiteDaten }) {
  const pfad = ortsPfad(ort.slug);

  const dienstleistung = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${seite.domain}${pfad}#dienstleistung`,
    name: `Physiotherapie im Hausbesuch in ${ort.name}`,
    serviceType: "Mobile Physiotherapie",
    description: ort.beschreibung,
    provider: { "@id": `${seite.domain}/#praxis` },
    areaServed: [
      { "@type": "City", name: ort.name },
      ...ort.ortsteile
        .filter((teil) => teil !== ort.name)
        .map((teil) => ({ "@type": "Place", name: teil })),
    ],
    url: `${seite.domain}${pfad}`,
  };

  /* Die uebrigen Orte - Verweise stehen im Klappblock, nicht als eigene
     sichtbare Sektion (die gibt es auf der Startseite nicht). */
  const andere = ortsseiten.filter((eintrag) => eintrag.slug !== ort.slug);

  return (
    <div
      data-gc
      className="gc-kontext font-[family-name:var(--font-jakarta)] text-[1.05rem] leading-[1.7]"
      style={{ background: "var(--gc-bg)", color: "var(--gc-text)" }}
    >
      <Brotkrumen titel={`Hausbesuch in ${ort.name}`} pfad={pfad} />
      <script
        type="application/ld+json"
        /* Wie in StrukturDaten.tsx: ausschliesslich eigene, beim Bauen
           feststehende Werte - keine Eingabe von aussen. */
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dienstleistung) }}
      />

      {/* Nur die H1 (titelZeilen) ist ortsspezifisch - Augenbraue, Text,
          Merkmale und Person bleiben exakt wie auf der Startseite. */}
      <GcHero hero={{ ...heroDe, titelZeilen: [ort.h1] }} />
      <GcKonzept />
      <GcLeistungen />
      <GcUeberMich />
      <GcKontakt />

      {/* ------------------------------------------------------------------
          Alles Ortsspezifische, gesammelt in einem Block. Eingeklappt und
          ganz unten, weil es Nachschlage-Information fuer Google und fuer
          Besucher ist, die gezielt danach suchen - nicht der erste Eindruck
          der Seite. Der Trigger bleibt bewusst kurz, aber lesbar und fuer
          Screenreader zugaenglich: ein Bedienelement ohne jeden Text waere
          fuer echte Nutzer nicht auffindbar.
          ------------------------------------------------------------------ */}
      <section className="sektion">
        <div className="huelle-eng">
          <Accordion.Root
            type="single"
            collapsible
            className="border-t border-b border-linie-fein"
          >
            <Accordion.Item value="ort">
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full items-center justify-between gap-6 py-6 text-left transition-colors hover:text-aktion">
                  <span className="schrift-display text-[1.2rem] leading-snug">
                    In »{ort.name}«
                  </span>
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex size-8 flex-none items-center justify-center rounded-full border border-linie transition-transform duration-300 group-data-[state=open]:rotate-45"
                  >
                    <Plus className="size-4" />
                  </span>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden data-[state=closed]:animate-[zu_240ms_ease] data-[state=open]:animate-[auf_320ms_ease]">
                <div className="flex flex-col gap-10 pb-10">
                  <div>
                    <h2 className="schrift-display text-[1.3rem] leading-tight">
                      {ort.lage.titel}
                    </h2>
                    <div className="lesespalte mt-5 flex flex-col gap-4">
                      {ort.lage.absaetze.map((absatz) => (
                        <p key={absatz.slice(0, 24)} className="text-[0.98rem] text-leise">
                          {absatz}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="schrift-display text-[1.3rem] leading-tight">
                      Vier Situationen, die es in {ort.name} häufig gibt
                    </h2>
                    <div className="mt-5 grid gap-x-12 gap-y-6 md:grid-cols-2">
                      {ort.wege.map((weg, i) => (
                        <div key={weg.titel} className="min-w-0 border-t border-linie-warm pt-5">
                          <span
                            aria-hidden="true"
                            className="text-[0.72rem] tracking-[0.18em] text-akzent-warm"
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <h3 className="schrift-display mt-3 text-[1.1rem] leading-tight">
                            {weg.titel}
                          </h3>
                          <p className="mt-3 text-[0.95rem] text-leise">{weg.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="schrift-display text-[1.3rem] leading-tight">
                      Wohin ich in {ort.name} fahre
                    </h2>
                    <p className="mt-5 text-[0.98rem] text-leise">{ort.anfahrt}</p>
                    <div className="mt-6 flex flex-wrap gap-x-3 gap-y-3">
                      {ort.ortsteile.map((teil) => (
                        <span
                          key={teil}
                          className="flex items-center gap-2 rounded-full border border-linie px-4 py-2 text-[0.92rem] text-leise"
                        >
                          <MapPin
                            className="size-3.5 flex-none text-akzent-warm"
                            strokeWidth={1.8}
                            aria-hidden="true"
                          />
                          {teil}
                        </span>
                      ))}
                    </div>
                    <p className="lesespalte mt-6 text-[0.98rem] text-leise">
                      {ort.ortsteileText}
                    </p>
                  </div>

                  <div>
                    <h2 className="schrift-display text-[1.3rem] leading-tight">
                      Weitere Orte
                    </h2>
                    <ul className="mt-5 grid gap-x-8 gap-y-2 sm:grid-cols-2">
                      {andere.map((eintrag) => (
                        <li key={eintrag.slug}>
                          <Link
                            href={ortsPfad(eintrag.slug)}
                            className="inline-flex min-h-[2.75rem] items-center gap-2 text-[0.98rem] text-leise transition-colors hover:text-text"
                          >
                            <MapPin
                              className="size-3.5 flex-none text-akzent-warm"
                              strokeWidth={1.8}
                              aria-hidden="true"
                            />
                            Hausbesuch in {eintrag.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
        </div>
      </section>
    </div>
  );
}
