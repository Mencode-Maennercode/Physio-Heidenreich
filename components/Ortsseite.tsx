import Link from "next/link";
import { MapPin } from "lucide-react";
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
 * - einzig die H1 im Hero nennt den Ort. Dazu kommt am Ende ein kurzer
 * Einsatzgebiet-Block: Ortsteile, Anfahrtszeit, Terminplanung.
 *
 * Warum genau dieser Block und nicht mehr: Er beantwortet die einzige
 * Frage, die sich vor dem Anruf wirklich pro Ort unterscheidet - "kommst
 * du ueberhaupt zu mir, und wie schnell?". Damit ist er zugleich echter
 * Nutzen fuer Anrufer UND der Grund, warum Google die fuenf Seiten als
 * eigenstaendig wertet statt als Doorway Pages.
 *
 * Er steht sichtbar da und ist NICHT eingeklappt. Das ist Absicht: Ein
 * Abschnitt, der nur fuer die Suchmaschine existiert und vor Besuchern
 * versteckt wird, ist genau das, was Googles Spam-Richtlinien meinen -
 * unabhaengig davon, ob er technisch aufklappbar waere. Wer hier kuerzt
 * oder erweitert, haelt sich an dieselbe Regel: Steht hier nur, was
 * jemand vor dem Anruf wissen will.
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
    name: `Physiotherapie im Hausbesuch ${ort.imOrt}`,
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
      <Brotkrumen titel={`Hausbesuch ${ort.imOrt}`} pfad={pfad} />
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
          Einsatzgebiet. Kurz, sichtbar, nachpruefbar - und pro Ort
          tatsaechlich verschieden (andere Ortsteile, andere Fahrzeit).
          ------------------------------------------------------------------ */}
      <section className="sektion">
        <div className="huelle-eng">
          <h2 className="schrift-display text-[1.5rem] leading-tight">
            Hausbesuche {ort.imOrt}
          </h2>
          <p className="lesespalte mt-5 text-[1rem] text-leise">{ort.anfahrt}</p>

          <div className="mt-8 flex flex-wrap gap-x-3 gap-y-3">
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

          {/* Verweise auf die uebrigen Ortsseiten: fuer jemanden, der doch im
              Nachbarort wohnt - und zugleich die internen Links, ueber die
              Google die anderen Ortsseiten findet. */}
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-1 border-t border-linie-fein pt-6">
            {andere.map((eintrag) => (
              <li key={eintrag.slug}>
                <Link
                  href={ortsPfad(eintrag.slug)}
                  className="inline-flex min-h-[2.75rem] items-center gap-2 text-[0.95rem] text-leise transition-colors hover:text-text"
                >
                  <MapPin
                    className="size-3.5 flex-none text-akzent-warm"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                  {eintrag.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
