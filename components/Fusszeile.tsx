"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { KI_HINWEIS, KI_HINWEIS_EN } from "@/lib/ki-medien";
import { ortsPfad, ortsseiten } from "@/lib/content/orte";
import { Mail, Phone, Smartphone } from "lucide-react";
import { Bildmarke } from "./Logo";
import BarrierefreiheitPanel from "./a11y/BarrierefreiheitPanel";
import {
  einsatzgebiet,
  kontakt,
  navigation,
  rechtsnavigation,
  seite,
} from "@/lib/site-config";
import { spracheAus } from "@/lib/sprache";

/*
  "use client" nur wegen dieser einen Zeile: Der KI-Hinweis muss auf /en/
  auf Englisch stehen, und ein Server-Baustein kennt seinen eigenen Pfad
  nicht von selbst. Der Rest der Fusszeile ist noch komplett Deutsch, auch
  auf der englischen Seite - ein bereits bekannter, groesserer Umbau, der
  hier bewusst nicht miterledigt wird. Diese eine Zeile war aber neu und
  sollte nicht denselben Fehler von Anfang an mitbringen.
*/

function Spaltentitel({ children }: { children: React.ReactNode }) {
  return <h2 className="feld-marke mb-5">{children}</h2>;
}

export default function Fusszeile() {
  const sprache = spracheAus(usePathname());

  return (
    <footer className="auf-warm nicht-drucken">
      <div className="huelle py-[clamp(2.5rem,6vw,5.5rem)]">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <Bildmarke className="size-9 flex-none text-akzent-warm" />
              <span className="flex flex-col leading-none">
                <span className="schrift-display text-[1.15rem] tracking-[0.06em] uppercase">
                  {seite.name}
                </span>
                <span className="mt-1 text-[0.6rem] font-medium tracking-[0.24em] text-leise uppercase">
                  {seite.zusatz}
                </span>
              </span>
            </div>
            <p className="lesespalte mt-6 text-[0.95rem] text-leise">
              {seite.kurzbeschreibung}
            </p>
          </div>

          <div>
            <Spaltentitel>Kontakt</Spaltentitel>
            <ul className="flex flex-col gap-3 text-[0.95rem]">
              <li>
                <a
                  href={`tel:${kontakt.telefonLink}`}
                  className="inline-flex min-h-[2.5rem] items-center gap-3 transition-colors hover:text-akzent-warm"
                >
                  <Phone className="size-4 flex-none" aria-hidden="true" />
                  <span>
                    {kontakt.telefonAnzeige}
                    <span className="block text-[0.78rem] text-leise">
                      Festnetz
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${kontakt.mobilLink}`}
                  className="inline-flex min-h-[2.5rem] items-center gap-3 transition-colors hover:text-akzent-warm"
                >
                  <Smartphone className="size-4 flex-none" aria-hidden="true" />
                  <span>
                    {kontakt.mobilAnzeige}
                    <span className="block text-[0.78rem] text-leise">
                      Mobil und SMS
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${kontakt.email}`}
                  className="inline-flex min-h-[2.5rem] items-center gap-3 [overflow-wrap:anywhere] transition-colors hover:text-akzent-warm"
                >
                  <Mail className="size-4 flex-none" aria-hidden="true" />
                  {kontakt.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <Spaltentitel>Seiten</Spaltentitel>
            <ul className="flex flex-col gap-1 text-[0.95rem]">
              {navigation.map((eintrag) => (
                <li key={eintrag.pfad}>
                  <Link
                    href={eintrag.pfad}
                    className="inline-flex min-h-[2.5rem] items-center text-leise transition-colors hover:text-text"
                  >
                    {eintrag.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Spaltentitel>Einsatzgebiet</Spaltentitel>
            {/* Bewusst Links statt der frueheren Aufzaehlung: Das ist der
                einzige Verweis auf die Ortsseiten, der auf JEDER Seite
                steht. Ohne ihn haengen sie an einer einzigen Stelle im
                Seitenbaum (der Karte auf /ablauf/ und /kontakt/) - zu wenig,
                damit eine Suchmaschine sie als vollwertige Seiten wertet.

                Zweispaltig statt einer langen Liste: Mit jeder neuen
                Ortsseite waechst die Fusszeile sonst um eine ganze Zeile -
                bei fuenf und mehr Orten faellt das auf. Zwei Spalten
                halbieren die Hoehe, ohne dass ein einzelner Link die
                Mindest-Tippflaeche unterschreitet. */}
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-[0.95rem]">
              {ortsseiten.map((ort) => (
                <li key={ort.slug}>
                  <Link
                    href={ortsPfad(ort.slug)}
                    className="inline-flex min-h-[2.25rem] items-center text-leise transition-colors hover:text-text"
                  >
                    {ort.name}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[0.95rem] text-leise">
              Dazu {einsatzgebiet.kern
                .filter((ort) => !ortsseiten.some((o) => o.name === ort))
                .join(", ")}{" "}
              und Umgebung im Kreis Ahrweiler.
            </p>
            <div className="mt-6">
              <BarrierefreiheitPanel variante="fuss" />
            </div>
          </div>
        </div>

        <div className="my-10 h-px bg-linie-warm" />

        {/* Notfallhinweis. Gehoert auf jede Seite eines Gesundheitsangebots -
            und zwar dorthin, wo jemand in Panik zuerst hinsieht. */}
        <p className="mb-8 text-[0.9rem] text-leise">
          Diese Seite ist kein Notfalldienst. Bei akuten Notfällen wählen Sie{" "}
          <a
            href="tel:112"
            className="font-medium text-text underline underline-offset-4"
          >
            112
          </a>
          , bei dringenden ärztlichen Fragen außerhalb der Sprechzeiten
          erreichen Sie den ärztlichen Bereitschaftsdienst unter{" "}
          <a
            href="tel:116117"
            className="font-medium text-text underline underline-offset-4"
          >
            116 117
          </a>
          .
        </p>

        {/*
          Aufloesung des "KI"-Zeichens an den Bildern.

          Sie steht bewusst hier und nicht nur im Impressum: Artikel 50 der
          EU-KI-Verordnung verlangt die Offenlegung dort, wo der Inhalt zu
          sehen ist - eine eigene Rechtsseite, die man erst ansteuern muss,
          genuegt ausdruecklich nicht. Das Kuerzel am Bild traegt die
          Aussage, dieser Satz macht sie vollstaendig.

          Normale Fusszeilengroesse und -farbe, kein Kleingedrucktes: Auch
          das ist Vorgabe, "blasse" oder versteckte Hinweise zaehlen nicht.
        */}
        <p className="mb-4 text-[0.88rem] text-leise">
          {sprache === "en" ? KI_HINWEIS_EN : KI_HINWEIS}
        </p>

        <div className="flex flex-col gap-4 text-[0.88rem] text-leise sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {seite.nameLang}
          </p>
          {/*
            Zwei Gruppen statt vier einzelner Eintraege im selben
            `flex-wrap`. Frueher brach die Zeile rein nach verfuegbarer
            Breite um - auf schmalen Schirmen landete "Datenschutz" dann
            allein in einer zweiten Zeile, obwohl es inhaltlich zu
            "Impressum" gehoert. Jede Gruppe ist innen `flex-nowrap`; bricht
            die Zeile, tut sie es zwischen den Gruppen, nie mitten in einer.
          */}
          <ul className="flex flex-wrap items-center gap-x-8 gap-y-2">
            <li className="flex flex-nowrap items-center gap-x-6">
              {rechtsnavigation.slice(0, 2).map((eintrag) => (
                <Link
                  key={eintrag.pfad}
                  href={eintrag.pfad}
                  className="inline-flex min-h-[2.5rem] items-center transition-colors hover:text-text"
                >
                  {eintrag.name}
                </Link>
              ))}
            </li>
            <li className="flex flex-nowrap items-center gap-x-6">
              {rechtsnavigation.slice(2).map((eintrag) => (
                <Link
                  key={eintrag.pfad}
                  href={eintrag.pfad}
                  className="inline-flex min-h-[2.5rem] items-center transition-colors hover:text-text"
                >
                  {eintrag.name}
                </Link>
              ))}
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
