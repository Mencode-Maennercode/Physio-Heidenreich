"use client";

import { Brain, House, Phone, UserRound } from "lucide-react";
import RuhigesVideo from "@/components/RuhigesVideo";
import MagnetKnopf from "./MagnetKnopf";
import { hero, person } from "@/lib/content/golden-calm";
import { kontakt } from "@/lib/site-config";

/** Symbole zu den drei Merkmalen - Zuordnung ueber den Namen im Inhalt. */
const SYMBOLE = {
  zuhause: House,
  neurologie: Brain,
  person: UserRound,
} as const;

/**
 * Hero der Startseite: Video ueber die volle Breite, das nach allen Seiten in
 * die Grundfarbe auslaeuft, darunter drei Merkmale.
 *
 * Vorher lag das Video in einer abgerundeten Karte innerhalb der 1280er
 * Spalte. Das kostete doppelt: Die Karte begrenzte die Breite, und der Text
 * lag mitten auf der Person. Randlos ist mehr Platz da - der Text sitzt links
 * auf ruhiger Flaeche, die Person steht rechts frei im Bild.
 *
 * Die Sektion ist mindestens einen Bildschirm hoch, damit die drei Merkmale
 * die letzte Zeile ueber der Kante bilden und der Abschnitt "Das Konzept"
 * erst beim Scrollen auftaucht. `svh` statt `vh`, weil auf dem Handy sonst
 * die ein- und ausfahrende Adressleiste die Hoehe springen laesst.
 *
 * Unter sm werden 4,5 rem abgezogen: Dort liegt die feste Anruf-Leiste am
 * unteren Rand (dieselbe Hoehe, die `main` als Polsterung reserviert). Ohne
 * den Abzug rechnet die Sektion mit Platz, den sie nicht hat, und die
 * Merkmalszeile verschwindet hinter der Leiste.
 */
export default function GcHero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[calc(100svh-4.5rem)] w-full flex-col overflow-hidden sm:min-h-svh"
      style={{ background: "var(--gc-bg)" }}
    >
      {/*
        Obere Zone: Video und Text. Sie traegt die Videoschicht, damit diese
        genau hier endet - die Merkmalszeile darunter liegt ausserhalb und
        steht deshalb auf reiner Grundfarbe, ohne bewegtes Bild dahinter.
        Waere die Videoschicht an die ganze Sektion gehaengt, liefe sie hinter
        den Merkmalen weiter.
      */}
      <div className="relative flex flex-1 items-center">
        {/*
          Die Videoschicht beginnt UNTERHALB der Kopfzeile, nicht am
          Seitenrand. Die Kopfzeile ist oben durchsichtig; laege das Video
          darunter, liefen bewegte Bilder hinter Logo und Navigation durch.
          Der Streifen darueber bleibt so die reine Grundfarbe - eine ruhige,
          einfarbige Leiste, in die das Video nach oben hinein ausblendet.
          Nach unten geschieht dasselbe zur Merkmalszeile hin.

          Der Wert ist auf schmalen Schirmen groesser, weil die Kopfzeile dort
          auf zwei Zeilen umbricht (Logo, darunter die Knopfgruppe).
        */}
        <div className="absolute inset-x-0 top-[7.5rem] bottom-0 flex items-center justify-end sm:top-[5.5rem]">
          {/*
            Ab sm liegt das Video in einer Box mit exakt seinem eigenen
            Seitenverhaeltnis (16:9) statt flaechendeckend darunter.

            Der Unterschied ist nicht nur Groesse: Fuellte es die ganze
            Flaeche, musste `object-cover` oben und unten abschneiden - und
            weggeschnitten wurde zuerst das untere Bilddrittel, also genau
            der Rollator. In einer 16:9-Box gibt es nichts mehr abzuschneiden,
            das Bild steht vollstaendig, vom Kopf bis zu den Raedern.

            Zweiter Gewinn: Schaerfe. Bei rund 800 px Anzeigebreite wird die
            1600-px-Quelle auf die Haelfte heruntergerechnet, statt fast 1:1
            ausgelegt zu werden - Herunterskalieren schaerft, Hochskalieren
            weicht auf. Deshalb ist der Clip jetzt auch hoeher aufgeloest
            encodiert (CRF 22 statt 29), bei kleinerer Datei als zuvor, weil
            die Bildflaeche geringer ist.

            Auf dem Handy bleibt es flaechendeckend: Dort ist neben dem Text
            kein Platz fuer eine zweite Spalte, das Video ist dort Hintergrund
            und kein eigenes Motiv.

            Kein ParallaxBild: Parallax legt seinen Inhalt 12 % ueber jeden
            Rand hinaus und skaliert ihn dadurch hoch - genau das Gegenteil
            dessen, was hier gebraucht wird. Das Video bringt seine Bewegung
            ohnehin selbst mit.
          */}
          <div className="relative h-full w-full sm:aspect-video sm:h-auto sm:max-h-full sm:w-[62%] sm:self-center lg:w-[56%]">
            <RuhigesVideo
              name="hero"
              beschreibung="Ältere Frau geht mit einem Rollator durch ihr helles Wohnzimmer, bleibt stehen und lächelt"
              className="absolute inset-0 h-full w-full"
              videoKlasse="h-full w-full translate-x-[12%] object-cover object-[50%_15%] sm:translate-x-0 sm:object-center"
              schleife={false}
              /* Der Clip laeuft 4,7 s und bleibt dann stehen - damit greift
               WCAG 2.2.2 nicht, und der Knopf darf weg. Siehe die
               ausfuehrliche Begruendung an der Eigenschaft selbst. */
              bedienbar={false}
            />

            {/*
            Das Video hat keine Kante: Es laeuft nach allen vier Seiten in die
            Grundfarbe aus, statt als Rechteck auf der Flaeche zu liegen.
            Gestapelte Verlaeufe derselben Farbe; wo sich zwei Saeume in den
            Ecken ueberlagern, addiert sich ihre Deckung - genau das laesst
            die Ecken zuerst verschwinden und nimmt dem Bild die
            Rechteckform.

            Ab sm sind alle vier Saeume gleich weich. Das war vorher anders:
            Solange das Video die ganze Breite fuellte, musste der linke Saum
            fast bis zur Mitte vollflaechig decken, weil der Text darauf lag.
            In der eigenen Box beruehrt das Video den Text nicht mehr - der
            Verlauf darf deshalb ueberall reiner Saum sein statt Abdeckung.

            Der untere Saum ist bewusst der kuerzeste: Dort stehen die Beine
            und die Raeder des Rollators, also der Teil, an dem das Motiv
            ueberhaupt erst lesbar wird. Ein langer Saum haette genau ihn
            wieder verschluckt - dasselbe Problem wie zuvor beim Beschnitt,
            nur mit weicherer Kante.

            Alle Stufen greifen auf --gc-bg zu statt auf einen festen Wert -
            damit stimmt der Uebergang auch, wenn die Grundfarbe wechselt.
          */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 hidden sm:block"
              style={{
                background: [
                  "linear-gradient(to right, var(--gc-bg) 0%, color-mix(in srgb, var(--gc-bg) 55%, transparent) 9%, transparent 24%)",
                  "linear-gradient(to left, var(--gc-bg) 0%, color-mix(in srgb, var(--gc-bg) 55%, transparent) 8%, transparent 22%)",
                  "linear-gradient(to bottom, var(--gc-bg) 0%, color-mix(in srgb, var(--gc-bg) 55%, transparent) 10%, transparent 26%)",
                  "linear-gradient(to top, var(--gc-bg) 0%, color-mix(in srgb, var(--gc-bg) 45%, transparent) 6%, transparent 16%)",
                ].join(", "),
              }}
            />

            {/* Unter sm fuellt das Video die Flaeche und der Text liegt darauf.
              Dort braucht es weiterhin die deckende Abdeckung links und einen
              Schleier von unten, sonst steht Schrift auf bewegtem Bild. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 sm:hidden"
              style={{
                background: [
                  "linear-gradient(180deg, color-mix(in srgb, var(--gc-bg) 70%, transparent) 0%, color-mix(in srgb, var(--gc-bg) 92%, transparent) 55%, var(--gc-bg) 100%)",
                  "linear-gradient(to bottom, var(--gc-bg) 0%, transparent 22%)",
                ].join(", "),
              }}
            />
          </div>
        </div>

        {/*
        Der Text liegt im normalen Fluss, nicht absolut ueber dem Video:
        Absolut positioniert wurde er auf schmalen Schirmen an der festen
        Hoehe abgeschnitten - Kicker und zweiter Knopf fielen weg. So waechst
        die Sektion mit, wenn der Inhalt mehr Platz braucht (etwa bei 130 %
        Textgroesse).

        `huelle` statt einer eigenen Breite: Damit sitzt die linke Kante des
        Textes exakt auf der des Logos in der Kopfzeile, das direkt darueber
        steht. Vorher lag der Text 40 px weiter rechts - ohne Bezug zu
        irgendetwas. Die Abschnitte weiter unten haben ihre eigene, engere
        Spalte; der Hero laeuft randlos und darf deshalb weiter aussen
        ansetzen.

        Das grosse `pt` auf schmalen Schirmen ist Pflicht, nicht Geschmack:
        Die Kopfzeile ist `fixed` und bricht dort auf zwei Zeilen um. Der
        Kicker lag vorher exakt darunter und war unsichtbar.
      */}
        <div className="huelle relative z-10 w-full min-w-0 pt-[7.75rem] pb-6 sm:pt-[7rem] sm:pb-8 md:pb-10">
          {/* Schmaler als zuvor (34rem): Die Spalte muss vollstaendig innerhalb
              der deckenden Zone des Verlaufs liegen, damit kein Videobild den
              Text beruehrt. 28rem enden bei 1440 px Fensterbreite rund bei
              42 % - der Verlauf deckt bis 44 %. */}
          <div className="max-w-[32rem]">
            {/* Stille Augenbraue statt des frueheren umrandeten Abzeichens -
                dieselbe Angabe, ohne den Blick als Erstes auf sich zu
                ziehen. */}
            <p
              className="mb-4 text-[12px] tracking-[0.2em] uppercase sm:mb-5"
              style={{ color: "#6E5940" }}
            >
              {hero.augenbraue}
            </p>
            <h1
              className="mb-4 font-[family-name:var(--font-cormorant)] font-normal sm:mb-6 text-[clamp(2.15rem,4.2vw,3.5rem)] leading-[1.08] tracking-[-0.01em]"
              style={{ color: "var(--gc-text)" }}
            >
              {/*
                Das Leerzeichen am Zeilenende ist kein Schoenheitsfehler,
                sondern noetig: Optisch trennt `block` die Zeilen ohnehin,
                der reine Textinhalt der Ueberschrift wuerde aber ohne
                Trenner zu "Mobile Physiotherapieim Kreis Ahrweiler"
                verschmelzen. Genau diesen Text lesen Suchmaschinen und
                Vorlesesoftware aus - sichtbar ist der Fehler nie.
              */}
              {hero.titelZeilen.map((zeile, i) => (
                <span key={zeile} className="block">
                  {zeile}
                  {i < hero.titelZeilen.length - 1 ? " " : null}
                </span>
              ))}
            </h1>

            {/*
              Name und Abschluesse direkt unter der Ueberschrift.

              Beide Grade stehen MIT Fachrichtung - das ist im Heilberuf
              keine Formsache: Ein "M.A." ohne Fachangabe auf einer
              Physiotherapie-Seite legt nahe, der Master sei in
              Physiotherapie, und das faellt unter irrefuehrende Werbung
              (§ 3 HWG, § 5 UWG). Die Herkunft (NL) darf stehen bleiben,
              obwohl niederlaendische Grade in Deutschland ohne Zusatz
              gefuehrt werden duerfen - ein abgeschlossenes Studium ist hier
              ein Unterscheidungsmerkmal, kein Makel.
            */}
            <p
              className="mb-1.5 text-[1.05rem] font-medium sm:mb-2"
              style={{ color: "var(--gc-text)" }}
            >
              {person.name}
            </p>
            <p
              className="mb-5 text-[0.92rem] leading-relaxed sm:mb-7"
              style={{ color: "var(--gc-text-fein)" }}
            >
              {person.titel}
            </p>

            <p
              className="mb-7 max-w-[28em] text-[1.1rem] leading-[1.7] sm:mb-9"
              style={{ color: "var(--gc-text-leise)" }}
            >
              {hero.text}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              {/* Sehr zurueckhaltender Magnet-Effekt (Standard waere 0.35).
                  Die beiden wichtigsten Knoepfe der Seite sollen ruhig
                  liegen - ein Knopf, der dem Zeiger sichtbar ausweicht,
                  wirkt hier verspielt statt hochwertig und erschwert das
                  Treffen. */}

              {/* Auf dem Handy steht die Nummer schon in der festen Leiste am
                  unteren Rand - derselbe Grund, aus dem sie auch aus der
                  Kopfzeile ausgeblendet ist. Zwei Knoepfe uebereinander
                  haetten den Hero hier so verlaengert, dass der zweite hinter
                  genau dieser Leiste verschwand. */}
              <div className="hidden sm:block">
                <MagnetKnopf
                  href={`tel:${kontakt.telefonLink}`}
                  stark={0.08}
                  className="min-h-16 gap-3 rounded-full px-8 text-[1.05rem] font-medium"
                  style={{
                    background: "var(--gc-navy)",
                    color: "var(--gc-bg)",
                    boxShadow: "0 22px 44px -20px rgba(30,45,59,0.7)",
                  }}
                >
                  <Phone className="size-[1.1rem]" aria-hidden="true" />
                  {kontakt.telefonAnzeige}
                </MagnetKnopf>
              </div>

              <MagnetKnopf
                href="#kontakt"
                stark={0.08}
                className="min-h-16 rounded-full border px-7 text-[1.05rem]"
                style={{
                  background: "rgba(255,255,255,0.85)",
                  borderColor: "var(--gc-feld-rand)",
                  color: "var(--gc-text)",
                }}
              >
                Hausbesuch anfragen
              </MagnetKnopf>
            </div>
          </div>
        </div>
      </div>

      {/*
        Drei Merkmale als Abschluss des Hero.

        Sie stehen hier und nicht in einem eigenen Abschnitt, weil sie die
        Sektion nach unten schliessen sollen: Wer die Seite oeffnet, sieht
        Video, Text und diese Zeile - und muss scrollen, um "Das Konzept" zu
        erreichen. Genau dafuer ist die Sektion einen Bildschirm hoch.

        Die feine Linie darueber ist der einzige Trenner im Hero. Sie
        markiert den Wechsel von Aussage zu Beleg, ohne einen Balken
        einzuziehen.
      */}
      <div className="relative z-10">
        <ul className="huelle grid grid-cols-3 gap-x-4 gap-y-6 py-[clamp(1rem,3vw,2rem)] sm:gap-x-8">
          {hero.merkmale.map((merkmal) => {
            const Symbol = SYMBOLE[merkmal.symbol];
            return (
              <li
                key={merkmal.titel}
                className="flex min-w-0 flex-col items-center gap-2 text-center"
              >
                <Symbol
                  className="size-6 flex-none"
                  strokeWidth={1.4}
                  style={{ color: "#6E5940" }}
                  aria-hidden="true"
                />
                {/* `w-full`, nicht `min-w-0`: In einer Spalten-Flexbox
                    richtet sich die Breite eines Kindes nach seinem Inhalt,
                    `min-width` aendert daran nichts. Der Text stand deshalb
                    bei 130 % Textgroesse 115 px breit in einer 85 px
                    schmalen Spalte und ragte in die Nachbarspalte. Erst
                    `w-full` zwingt ihn auf die Spaltenbreite - dann bricht
                    er innerhalb um. Gemessen mit scripts/geraete.mjs. */}
                <span
                  className="w-full text-[clamp(0.85rem,1.6vw,1rem)] font-medium leading-tight text-balance"
                  style={{ color: "var(--gc-text)" }}
                >
                  {merkmal.titel}
                </span>
                {/* Auf sehr schmalen Schirmen entfaellt die Unterzeile: Drei
                    Spalten nebeneinander lassen dort keinen Platz fuer zwei
                    Textebenen, ohne dass jede Spalte vierzeilig umbricht. */}
                <span
                  className="hidden w-full text-[0.85rem] leading-tight text-balance sm:block"
                  style={{ color: "var(--gc-text-fein)" }}
                >
                  {merkmal.text}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Das schwebende "60 Minuten"-Abzeichen ist bewusst entfernt, nicht
          nur wegen Bildschirmplatz: Als Werbeaussage waere eine feste
          Zeitangabe pro Termin riskant. Krankengymnastik hat im
          Heilmittelkatalog eine viel kuerzere Regelbehandlungszeit - eine
          volle Stunde setzt in der Regel eine verordnete Doppelbehandlung
          voraus, die nicht bei jeder Diagnose und jedem Rezept vorliegt.
          Eine pauschale Zeitangabe im Hero wuerde etwas versprechen, das
          nicht fuer jeden Patienten zutrifft - ein klassisches HWG/UWG-
          Risiko. Ohne konkrete Zahl bleibt die Aussage im Fliesstext oben
          ("volle Aufmerksamkeit fuer jeden Termin") wahr, ohne versprechen
          zu muessen, was am Ende von der Verordnung abhaengt. */}
    </section>
  );
}
