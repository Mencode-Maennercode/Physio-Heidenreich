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

/*
  Bauprinzip dieser Fusszeile: nebeneinander statt untereinander.

  Sie war einmal 826 px hoch am Laptop und 1768 px am Handy - ein ganzer
  bzw. ein doppelter Bildschirm, den man am Ende jeder Seite durchscrollt.
  Weggefallen ist dabei kein einziger Link und kein Pflichthinweis; was
  gekuerzt wurde, ist ausschliesslich Luft:

  - Die Spalten stehen schon ab 640 px zu zweit nebeneinander, nicht erst
    ab 768 px; ab 768 px liegt die Wortmarke als flache Zeile darueber und
    die drei Listen daneben, ab 1280 px stehen alle vier nebeneinander.
  - Die Ortsliste ist zweispaltig, am Handy laufen auch "Seiten" und
    "Einsatzgebiet" in die Breite statt untereinander.
  - Die Zusaetze an den Rufnummern ("Festnetz", "Mobil und SMS") stehen
    hinter der Nummer statt darunter - halbe Hoehe, gleicher Inhalt.
  - Notfall- und KI-Hinweis stehen am Laptop nebeneinander statt
    hintereinander.
  - Tippflaechen bleiben unangetastet bei 45 px. Das ist der Punkt, an
    dem hier bewusst NICHT weiter gekuerzt wird - siehe `zeile` unten.
*/

function Spaltentitel({ children }: { children: React.ReactNode }) {
  return <h2 className="feld-marke mb-3">{children}</h2>;
}

/*
  Eine Zeile in den Linklisten.

  2,5 rem sind bei 112,5 % Grundschrift genau 45 px und damit die kleinste
  Flaeche, die `npm run pruefen` durchgehen laesst (Schwelle 44 px). Hier
  stand zwischenzeitlich `sm:min-h-0` - das machte die Fusszeile am Laptop
  noch einmal gut 30 px flacher und riss dabei jeden Link darin unter die
  Grenze. Die Hoehe der Fusszeile ist es nicht wert: Diese Seite richtet
  sich an aeltere Menschen, und die Tippflaeche ist der Grund, warum ein
  Link am Ende getroffen wird oder nicht.
*/
const zeile = "inline-flex min-h-[2.5rem] items-center";

export default function Fusszeile() {
  const sprache = spracheAus(usePathname());

  return (
    <footer className="auf-warm nicht-drucken">
      <div className="huelle py-[clamp(2rem,3.5vw,3rem)]">
        <div className="grid grid-cols-2 gap-x-6 gap-y-6 sm:gap-x-8 sm:gap-y-8 md:grid-cols-[1.45fr_0.5fr_1.05fr] xl:grid-cols-[1.25fr_1.25fr_0.55fr_0.95fr] xl:gap-x-10">
          <div className="col-span-2 md:col-span-3 md:flex md:items-center md:gap-7 xl:col-span-1 xl:block">
            <div className="flex flex-none items-center gap-3">
              <Bildmarke className="size-8 flex-none text-akzent-warm" />
              <span className="flex flex-col leading-none">
                <span className="schrift-display text-[1.05rem] tracking-[0.06em] uppercase">
                  {seite.name}
                </span>
                <span className="mt-1 text-[0.6rem] font-medium tracking-[0.24em] text-leise uppercase">
                  {seite.zusatz}
                </span>
              </span>
            </div>
            <p className="mt-4 text-[0.9rem] text-leise md:mt-0 xl:mt-4">
              {seite.fusszeilenzeile}
            </p>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <Spaltentitel>Kontakt</Spaltentitel>
            <ul className="flex flex-col text-[0.95rem]">
              <li>
                <a
                  href={`tel:${kontakt.telefonLink}`}
                  className={`${zeile} gap-2.5 transition-colors hover:text-akzent-warm`}
                >
                  <Phone className="size-4 flex-none" aria-hidden="true" />
                  <span>
                    {kontakt.telefonAnzeige}
                    <span className="ml-1.5 text-[0.78rem] text-leise">
                      Festnetz
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${kontakt.mobilLink}`}
                  className={`${zeile} gap-2.5 transition-colors hover:text-akzent-warm`}
                >
                  <Smartphone className="size-4 flex-none" aria-hidden="true" />
                  <span>
                    {kontakt.mobilAnzeige}
                    <span className="ml-1.5 text-[0.78rem] text-leise">
                      Mobil und SMS
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${kontakt.email}`}
                  className={`${zeile} gap-2.5 [overflow-wrap:anywhere] transition-colors hover:text-akzent-warm`}
                >
                  <Mail className="size-4 flex-none" aria-hidden="true" />
                  {kontakt.email}
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <Spaltentitel>Seiten</Spaltentitel>
            {/* Am Handy laufen die Eintraege in die Breite und brauchen zwei
                Zeilen statt fuenf; ab `sm` ist Platz fuer die Spalte, die
                sich schneller ueberfliegen laesst. */}
            <ul className="flex flex-wrap gap-x-6 text-[0.95rem] sm:flex-col sm:gap-x-0">
              {navigation.map((eintrag) => (
                <li key={eintrag.pfad}>
                  <Link
                    href={eintrag.pfad}
                    className={`${zeile} text-leise transition-colors hover:text-text`}
                  >
                    {eintrag.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
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
            <ul className="flex flex-wrap gap-x-6 text-[0.95rem] sm:grid sm:grid-cols-2">
              {ortsseiten.map((ort) => (
                /* Lange Ortsnamen ueber beide Spalten: "Bad
                   Neuenahr-Ahrweiler" passt in keine halbe Fusszeilenspalte
                   und brach dort in zwei Zeilen um - der Umbruch kostete
                   genau die Zeile, die die zweite Spalte einsparen soll.
                   Nach Laenge statt nach Position, damit die Regel auch
                   nach dem naechsten neuen Ort noch stimmt. */
                <li key={ort.slug} className={ort.name.length > 14 ? "sm:col-span-2" : undefined}>
                  <Link
                    href={ortsPfad(ort.slug)}
                    className={`${zeile} text-leise transition-colors hover:text-text`}
                  >
                    {ort.name}
                  </Link>
                </li>
              ))}
            </ul>
            {/* Die Orte ohne eigene Seite trotzdem im Text: Sie werden
                gesucht, und die Zeile kostet keine eigene Bildschirmhoehe -
                sie fuellt den Platz unter der zweispaltigen Liste. */}
            <p className="mt-2 text-[0.9rem] text-leise">
              Dazu {einsatzgebiet.kern
                .filter((ort) => !ortsseiten.some((o) => o.name === ort))
                .join(", ")}{" "}
              und Umgebung im Kreis Ahrweiler.
            </p>
          </div>
        </div>

        <div className="my-6 h-px bg-linie-warm" />

        {/* Notfallhinweis und KI-Offenlegung nebeneinander. Beide muessen
            auf jede Seite, beide sind kurz genug fuer eine halbe Breite -
            untereinander kosteten sie mit ihren Abstaenden gut 150 px. */}
        <div className="grid gap-x-10 gap-y-3 text-[0.88rem] leading-snug text-leise lg:grid-cols-[1.5fr_1fr]">
          {/* Gehoert auf jede Seite eines Gesundheitsangebots - und zwar
              dorthin, wo jemand in Panik zuerst hinsieht. */}
          <p>
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
            Die zweite Spalte ist deshalb gleich gross gesetzt wie die erste.
          */}
          <p>{sprache === "en" ? KI_HINWEIS_EN : KI_HINWEIS}</p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-1 text-[0.88rem] text-leise">
          {/* Nur der Name, nicht `nameLang`: "- Mobile Physiotherapie"
              steht drei Zeilen weiter oben in der Wortmarke und brach hier
              am Handy in eine zweite Zeile um. */}
          <p className="mr-auto">
            © {new Date().getFullYear()} {seite.name}
          </p>
          {/*
            Zwei Gruppen statt vier einzelner Eintraege im selben
            `flex-wrap`. Frueher brach die Zeile rein nach verfuegbarer
            Breite um - auf schmalen Schirmen landete "Datenschutz" dann
            allein in einer zweiten Zeile, obwohl es inhaltlich zu
            "Impressum" gehoert. Jede Gruppe ist innen `flex-nowrap`; bricht
            die Zeile, tut sie es zwischen den Gruppen, nie mitten in einer.
          */}
          <ul className="flex flex-wrap items-center gap-x-8 gap-y-1">
            <li className="flex flex-nowrap items-center gap-x-6">
              {rechtsnavigation.slice(0, 2).map((eintrag) => (
                <Link
                  key={eintrag.pfad}
                  href={eintrag.pfad}
                  className={`${zeile} transition-colors hover:text-text`}
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
                  className={`${zeile} transition-colors hover:text-text`}
                >
                  {eintrag.name}
                </Link>
              ))}
            </li>
          </ul>
          {/* Stand vorher als eigener Block in der Einsatzgebiet-Spalte und
              kostete dort eine ganze Zeile Hoehe.

              Am Handy ganz ausgeblendet: Dort sitzt derselbe Knopf fest in
              der mitlaufenden Kopfzeile und ist damit auf jeder Seite ohne
              Scrollen erreichbar - besser als am Seitenende. Auf breiten
              Schirmen verschwindet die Kopfzeile beim Scrollen, deshalb
              bleibt er dort stehen. */}
          <span className="hidden sm:inline-flex">
            <BarrierefreiheitPanel variante="fuss" />
          </span>
        </div>
      </div>
    </footer>
  );
}
