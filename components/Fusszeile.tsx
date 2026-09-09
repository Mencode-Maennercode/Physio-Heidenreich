"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { KI_HINWEIS, KI_HINWEIS_EN } from "@/lib/ki-medien";
import { ortsPfad, ortsseiten } from "@/lib/content/orte";
import { Mail, Phone, Smartphone } from "lucide-react";
import { Bildmarke } from "./Logo";
import BarrierefreiheitPanel from "./a11y/BarrierefreiheitPanel";
import { kontakt, rechtsnavigation, seite } from "@/lib/site-config";
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
  Bauprinzip: Reihen, keine Spalten.

  Die Fusszeile war einmal 826 px hoch am Laptop und 1768 px am Handy. Der
  erste Umbau stellte vier Spalten nebeneinander - das half, hatte aber
  einen eingebauten Boden: Die hoechste Spalte bestimmt die Hoehe, und das
  waren immer die fuenf Seitenlinks. Neben der Wortmarke blieb dadurch ein
  handbreites Stueck leere Flaeche stehen, das nichts trug.

  Jetzt liegt jede Gruppe in EINER Zeile - Beschriftung links, Eintraege
  daneben:

      [Marke]                         Festnetz   Mobil   E-Mail
      EINSATZGEBIET   Bad Neuenahr-Ahrweiler  Sinzig  Remagen  ...

  Auf schmalen Schirmen rutscht die Beschriftung ueber ihre Zeile und die
  Eintraege brechen um - dieselbe Anordnung, nur gestapelt.

  Drei Dinge sind danach noch ganz entfallen, weil sie an anderer Stelle
  schon stehen:

  - Die Seitenlinks (Start, Behandlung, ...). Die Kopfzeile laeuft beim
    Scrollen mit und traegt dieselben fuenf Links auf jeder Seite; fuer
    Suchmaschinen war die Wiederholung im Fuss ohne Wert.
  - Der Beschreibungssatz. Wortgleicher Text am Rand jeder Seite ist
    Boilerplate, den Suchmaschinen nicht werten. Heimersheim und Bad
    Bodendorf - die beiden Orte ohne eigene Seite - stehen weiterhin in der
    Einsatzgebietskarte auf /ablauf/ und /kontakt/.
  - Der Link zur englischen Fassung. Die Sprachwahl in der Kopfzeile ist
    auf allen Breiten sichtbar, und die fuenf /en/-Seiten stehen in der
    sitemap.xml mit gegenseitiger hreflang-Auszeichnung.

  Was bleibt, bleibt mit Grund: die fuenf Ortsseiten (der einzige Verweis
  auf sie, der auf JEDER Seite steht), die KI-Offenlegung (Art. 50 KI-VO),
  Impressum und Datenschutz (§ 5 DDG, Art. 13 DSGVO).
*/

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

/* Beschriftung einer Reihe. Ab `sm` steht sie in der Zeile ihrer
   Eintraege und wird deshalb auf deren Hoehe zentriert. */
function Reihentitel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="feld-marke flex items-center self-start sm:min-h-[2.5rem]">
      {children}
    </h2>
  );
}

export default function Fusszeile() {
  const sprache = spracheAus(usePathname());

  return (
    <footer className="auf-warm nicht-drucken">
      <div className="huelle py-[clamp(1.75rem,3vw,2.5rem)]">
        <div className="flex flex-col gap-x-10 gap-y-3 lg:flex-row lg:items-center lg:justify-between">
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

          {/* Nur fuer Screenreader: In der Zeile tragen die Zeichen vor den
              Eintraegen die Bedeutung, aber die Gruppe soll dieselbe
              Ueberschrift haben wie die beiden Reihen darunter. */}
          <h2 className="sr-only">Kontakt</h2>
          <ul className="flex flex-wrap gap-x-7 text-[0.95rem] lg:justify-end">
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


        {/* Beschriftung links, Eintraege daneben. Die Beschriftungsspalte
            ist `auto` breit, richtet sich also nach dem laengeren der
            beiden Woerter - beide Reihen fluchten dadurch. */}
        <div className="mt-4 grid gap-x-8 sm:grid-cols-[auto_1fr]">
          <Reihentitel>Einsatzgebiet</Reihentitel>
          {/* Bewusst Links statt einer Aufzaehlung: Das ist der einzige
              Verweis auf die Ortsseiten, der auf JEDER Seite steht. Ohne
              ihn haengen sie an einer einzigen Stelle im Seitenbaum (der
              Karte auf /ablauf/ und /kontakt/) - zu wenig, damit eine
              Suchmaschine sie als vollwertige Seiten wertet. */}
          <ul className="flex flex-wrap gap-x-7 text-[0.95rem]">
            {ortsseiten.map((ort) => (
              <li key={ort.slug}>
                <Link
                  href={ortsPfad(ort.slug)}
                  className={`${zeile} text-leise transition-colors hover:text-text`}
                >
                  {ort.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="my-5 h-px bg-linie-warm" />

        {/*
          Aufloesung des "KI"-Zeichens an den Bildern.

          Sie steht bewusst hier und nicht nur im Impressum: Artikel 50 der
          EU-KI-Verordnung verlangt die Offenlegung dort, wo der Inhalt zu
          sehen ist - eine eigene Rechtsseite, die man erst ansteuern muss,
          genuegt ausdruecklich nicht. Das Kuerzel am Bild traegt die
          Aussage, dieser Satz macht sie vollstaendig.

          Normale Fusszeilengroesse und -farbe, kein Kleingedrucktes: Auch
          das ist Vorgabe, "blasse" oder versteckte Hinweise zaehlen nicht.

          Daneben stand bis hierher der Notfallhinweis ("kein Notfalldienst,
          im Notfall 112, ausserhalb der Sprechzeiten 116 117"). Der ist
          entfallen: Verlangt hat ihn kein Gesetz, und Notdienst und
          aerztlicher Bereitschaftsdienst sind Arztthemen. Wer 112 braucht,
          sucht nicht nach einer Physiotherapeutin fuer Hausbesuche - der
          Hinweis beantwortete eine Frage, die auf dieser Seite niemand
          stellt.
        */}
        <p className="text-[0.88rem] leading-snug text-leise">
          {sprache === "en" ? KI_HINWEIS_EN : KI_HINWEIS}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-1 text-[0.88rem] text-leise">
          {/* Nur der Name, nicht `nameLang`: "- Mobile Physiotherapie"
              steht oben in der Wortmarke und brach hier am Handy in eine
              zweite Zeile um. */}
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
              {rechtsnavigation.slice(0, 1).map((eintrag) => (
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
              {rechtsnavigation.slice(1).map((eintrag) => (
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
