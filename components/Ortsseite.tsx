import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import Brotkrumen from "@/components/Brotkrumen";
import Bild from "@/components/Bild";
import Knopf from "@/components/Knopf";
import Sektionskopf from "@/components/Sektionskopf";
import GcSeitenKopf from "@/components/golden-calm/GcSeitenKopf";
import {
  BildWischer,
  Enthuellen,
  Staffel,
  StaffelKind,
} from "@/components/motion/Enthuellen";
import { kontakt, seite } from "@/lib/site-config";
import { ortsPfad, ortsseiten, type Ortsseite as OrtsseiteDaten } from "@/lib/content/orte";

/**
 * Gemeinsames Geruest aller Ortsseiten.
 *
 * Das Layout ist geteilt, die Inhalte sind es ausdruecklich NICHT - jeder
 * Absatz kommt aus lib/content/orte.ts und gilt nur fuer diesen einen Ort.
 * Genau daran entscheidet sich, ob Google die Seiten als vier eigenstaendige
 * Antworten wertet oder als Doorway Pages abstraft.
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

  /* Die uebrigen Orte - fuer die Verweise am Fuss der Seite. */
  const andere = ortsseiten.filter((eintrag) => eintrag.slug !== ort.slug);

  return (
    <div className="gc-kontext" data-gc>
      <Brotkrumen titel={`Hausbesuch in ${ort.name}`} pfad={pfad} />
      <script
        type="application/ld+json"
        /* Wie in StrukturDaten.tsx: ausschliesslich eigene, beim Bauen
           feststehende Werte - keine Eingabe von aussen. */
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dienstleistung) }}
      />

      <GcSeitenKopf
        kicker={ort.augenbraue}
        titel={ort.h1}
        text={ort.einleitung}
      />

      {/* ------------------------------------------------------------------
          Was diesen Ort ausmacht. Steht bewusst ganz oben und nicht hinter
          einer Leistungsliste: Es ist der einzige Abschnitt, den es so nur
          auf dieser Seite gibt - und damit der Grund, warum sie existiert.
          ------------------------------------------------------------------ */}
      <section className="sektion">
        <div className="huelle grid min-w-0 items-start gap-[clamp(2.5rem,6vw,5rem)] lg:grid-cols-[1fr_0.75fr]">
          <div className="min-w-0">
            <Sektionskopf augenbraue="Vor Ort" titel={ort.lage.titel} />
            <div className="lesespalte mt-8 flex flex-col gap-5">
              {ort.lage.absaetze.map((absatz) => (
                <Enthuellen key={absatz.slice(0, 24)}>
                  <p className="text-[1.05rem]">{absatz}</p>
                </Enthuellen>
              ))}
            </div>
          </div>

          <BildWischer>
            <Bild
              name="wohnraum"
              className="aspect-4/5 overflow-hidden"
              groessen="(min-width: 1024px) 34vw, 100vw"
            />
          </BildWischer>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          Typische Zugangssituationen - konkret, nicht als Leistungsliste.
          ------------------------------------------------------------------ */}
      <section className="auf-warm sektion">
        <div className="huelle">
          <Sektionskopf
            augenbraue="Wie ein Hausbesuch hier aussieht"
            titel={`Vier Situationen, die es in ${ort.name} häufig gibt`}
          />

          <Staffel className="mt-14 grid min-w-0 gap-x-12 gap-y-10 md:grid-cols-2">
            {ort.wege.map((weg, i) => (
              <StaffelKind
                key={weg.titel}
                className="min-w-0 border-t border-linie-warm pt-7"
              >
                <span
                  aria-hidden="true"
                  className="text-[0.72rem] tracking-[0.18em] text-akzent-warm"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="schrift-display mt-4 text-[1.3rem] leading-tight">
                  {weg.titel}
                </h3>
                <p className="mt-4 text-[0.98rem] text-leise">{weg.text}</p>
              </StaffelKind>
            ))}
          </Staffel>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          Ortsteile und Anfahrt. Die Ortsteilliste ist der Teil, ueber den
          jemand aus einem kleinen Dorf ueberhaupt erst faendig wird - dort
          steht sonst nirgends im Netz, dass jemand dorthin faehrt.
          ------------------------------------------------------------------ */}
      <section className="sektion">
        <div className="huelle grid min-w-0 gap-[clamp(2.5rem,6vw,4.5rem)] lg:grid-cols-[minmax(0,22rem)_1fr]">
          <div>
            <p className="augenbraue">Ortsteile</p>
            <h2 className="schrift-display titel-klein mt-6 max-w-[14ch]">
              Wohin ich in {ort.name} fahre
            </h2>
            <p className="mt-7 text-[0.98rem] text-leise">{ort.anfahrt}</p>
          </div>

          <div className="min-w-0">
            <Staffel className="flex flex-wrap gap-x-3 gap-y-3">
              {ort.ortsteile.map((teil) => (
                <StaffelKind
                  key={teil}
                  className="flex items-center gap-2 rounded-full border border-linie px-4 py-2 text-[0.92rem] text-leise"
                >
                  <MapPin
                    className="size-3.5 flex-none text-akzent-warm"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                  {teil}
                </StaffelKind>
              ))}
            </Staffel>
            <Enthuellen>
              <p className="lesespalte mt-8 text-[0.98rem] text-leise">
                {ort.ortsteileText}
              </p>
            </Enthuellen>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          Was behandelt wird - kurz, mit Verweis auf die ausfuehrliche Seite.
          Bewusst KEINE Wiederholung der ganzen Leistungsliste: Vier Seiten
          mit derselben Aufzaehlung waeren genau der doppelte Inhalt, den
          diese Seiten vermeiden sollen.
          ------------------------------------------------------------------ */}
      <section className="auf-warm sektion">
        <div className="huelle-eng">
          <Enthuellen>
            <p className="augenbraue">Behandlungen</p>
            <h2 className="schrift-display titel-klein mt-6 max-w-[24ch]">
              Was ich mitbringe, ist überall dasselbe. Wo es angewendet wird,
              nicht.
            </h2>
            <p className="lesespalte-weit mt-7 text-[1.05rem]">
              Krankengymnastik, Mobilisation, Nachsorge nach Operationen,
              Sturzprophylaxe, manuelle Lymphdrainage und neurologische
              Behandlung mit besonderer Erfahrung — in {ort.name} wie im
              übrigen Kreis Ahrweiler. Was sich unterscheidet, ist die
              Wohnung, in der geübt wird.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Knopf href="/behandlung/" art="linie" kind="Alle Behandlungen" />
              <Knopf href="/ablauf/" art="linie" kind="Ablauf und Abrechnung" />
            </div>
          </Enthuellen>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          Anruf.
          ------------------------------------------------------------------ */}
      <section className="sektion">
        <div className="huelle-eng text-center">
          <Enthuellen className="flex flex-col items-center">
            <p className="augenbraue">Termin in {ort.name}</p>
            <h2 className="schrift-display titel-klein mt-6 max-w-[26ch]">
              Rufen Sie an. Die erste Frage ist immer die nach dem Wohnort.
            </h2>
            <p className="lesespalte mt-6 text-[0.98rem] text-leise">
              Weil ich Termine zu zusammenhängenden Routen bündele, entscheidet
              die Adresse darüber, welcher Tag möglich ist. Fünf Minuten am
              Telefon klären das schneller als jedes Formular.
            </p>
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
              <Knopf href="/kontakt/" art="linie" kind="Schriftlich anfragen" />
            </div>
          </Enthuellen>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          Verweise auf die uebrigen Ortsseiten. Zweck ist nicht Navigation -
          es sind die internen Links, ueber die Google die anderen Ortsseiten
          ueberhaupt findet und als zusammengehoerig erkennt.
          ------------------------------------------------------------------ */}
      <section className="auf-warm sektion">
        <div className="huelle">
          <p className="augenbraue">Weitere Orte</p>
          <ul className="mt-7 grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
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
      </section>
    </div>
  );
}
