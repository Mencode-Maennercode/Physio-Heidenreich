"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Brain, House, Phone, UserRound } from "lucide-react";
import RuhigesVideo from "@/components/RuhigesVideo";
import { useRuhig } from "@/components/a11y/Einstellungen";
import MagnetKnopf from "./MagnetKnopf";
import { hero as heroDe, person as personDe } from "@/lib/content/golden-calm";
import type { Hero, Person } from "@/lib/content/typen";
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
export default function GcHero({
  hero = heroDe,
  person = personDe,
  anfrageLabel = "Hausbesuch anfragen",
  videoBeschreibung = "Ältere Frau geht mit einem Rollator durch ihr helles Wohnzimmer, bleibt stehen und lächelt",
}: {
  hero?: Hero;
  person?: Person;
  /* Beschriftung des zweiten Knopfes. Sie steht nicht in den Inhalten,
     weil sie zur Bedienung gehoert, nicht zum Text der Seite. */
  anfrageLabel?: string;
  /* Die Bildbeschreibung des Videos muss mit uebersetzt werden - sie ist
     fuer blinde Nutzer der einzige Zugang zum Motiv. */
  videoBeschreibung?: string;
} = {}) {
  const rahmen = useRef<HTMLElement>(null);
  const ruhig = useRuhig();

  /*
    Nur noch das sehr langsame Heranfahren des Bildes laeuft ueber GSAP.

    Der eigentliche Auftritt des Hero steckt in einer CSS-Animation
    (`.gc-hero-teil` in globals.css). Der Grund steht dort ausfuehrlich:
    Eine ueber JavaScript gesteuerte Einblendung setzt erst nach der
    Hydrierung ein - beim Hero, der schon sichtbar dasteht, blitzte die
    Ueberschrift dadurch messbar auf und verschwand wieder.

    Fuer das Heranfahren gilt das nicht: Es beginnt bei Groesse 1, also
    genau dort, wo das Bild ohnehin steht. Es kann nichts aufblitzen, weil
    es nichts verbirgt.

    Warum ueberhaupt: Das Hero-Video laeuft 4,7 Sekunden und bleibt dann auf
    dem letzten Bild stehen (siehe `schleife={false}`). Ohne diese Zugabe
    steht ab Sekunde fuenf ein Standbild da - genau in dem Moment, in dem
    die meisten noch lesen. 40 Sekunden fuer 5 % Groesse sind pro Sekunde
    weniger als ein Promille: Man sieht die Bewegung nie, man merkt nur,
    dass das Bild nicht tot ist.
  */
  useGSAP(
    () => {
      if (ruhig || !rahmen.current) return;

      const bild = rahmen.current.querySelector(".gc-hero-video video");
      if (!bild) return;

      gsap.fromTo(
        bild,
        { scale: 1 },
        { scale: 1.05, duration: 40, ease: "none", delay: 1 },
      );
    },
    { scope: rahmen, dependencies: [ruhig] },
  );

  return (
    <section
      ref={rahmen}
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
      <div className="relative flex flex-1 flex-col sm:flex-row sm:items-center">
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
        {/*
          Der Abstand nach oben kommt aus --kopf-hoehe, gemeldet von der
          Kopfzeile selbst (siehe dort). Vorher standen hier feste Werte,
          geraten fuer den zweizeiligen Umbruch auf schmalen Schirmen. Mit
          dem Terminstreifen waere das nicht mehr aufgegangen: Seine Hoehe
          haengt davon ab, ob er ueberhaupt angezeigt wird.

          Der Ersatzwert greift nur, bis das Skript uebernimmt.
        */}
        {/*
          `gc-hero-video` (globals.css) enthaelt beide Anordnungen: auf dem
          Handy ein vollbreites Band UNTER dem Text, ab sm die gepruefte
          Desktop-Fassung, in der das Video absolut hinter dem Text liegt
          und unterhalb der Kopfzeile beginnt. Das gehoert in eine
          CSS-Regel, weil der obere Abstand aus --kopf-hoehe kommt und
          sich als Inline-Angabe nicht nach Bildschirmbreite unterscheiden
          liesse.
        */}
        <div
          className="gc-hero-video gc-hero-auftritt order-2 sm:order-none"
          style={{ "--auftritt-verzug": "0.3s" } as React.CSSProperties}
        >
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
              beschreibung={videoBeschreibung}
              className="absolute inset-0 h-full w-full"
              /* Die Verschiebung um 12 % nach rechts stammt aus der Zeit,
                 als der Text auf dem Handy UEBER dem Video lag: Sie schob
                 die Person aus der Textspalte heraus. Seit der Text darueber
                 auf eigener Flaeche steht, gibt es nichts mehr auszuweichen -
                 die Person gehoert in die Mitte des Bandes. */
              videoKlasse="h-full w-full object-cover object-[50%_22%] sm:object-center"
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

            {/*
              Handy: nur noch zwei schmale Saeume, kein Schleier mehr.

              Vorher lag hier ein fast deckender Creme-Verlauf ueber dem
              ganzen Bild - noetig, solange der Text darauf stand. Er kostete
              das Motiv: Von der Person war praktisch nichts mehr zu sehen,
              und gleichzeitig stand die Schrift trotzdem auf bewegtem Bild.
              Beides ist behoben, seit der Text darueber auf eigener Flaeche
              steht.

              Geblieben sind: oben ein kurzer Saum, damit das Band nicht als
              harte Kante gegen den Text stoesst, und unten eine leichte
              Abdunklung. Sie deckt keinen Text ab - dafuer traegt die
              Merkmalsleiste ihre eigene Flaeche - sondern gibt dem Band
              unten Gewicht, damit es nicht in der hellen Leiste am
              Bildschirmrand ausfranst.
            */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 sm:hidden"
              style={{
                background: [
                  "linear-gradient(to bottom, var(--gc-bg) 0%, transparent 14%)",
                  "linear-gradient(to top, color-mix(in srgb, var(--gc-navy) 55%, transparent) 0%, transparent 40%)",
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
        <div
          className="huelle relative z-10 order-1 w-full min-w-0 pb-5 sm:order-none sm:pb-8 md:pb-10"
          style={{ paddingTop: "calc(var(--kopf-hoehe, 7.5rem) + 1rem)" }}
        >
          {/* Schmaler als zuvor (34rem): Die Spalte muss vollstaendig innerhalb
              der deckenden Zone des Verlaufs liegen, damit kein Videobild den
              Text beruehrt. 28rem enden bei 1440 px Fensterbreite rund bei
              42 % - der Verlauf deckt bis 44 %. */}
          <div className="max-w-[32rem]">
            {/* Stille Augenbraue statt des frueheren umrandeten Abzeichens -
                dieselbe Angabe, ohne den Blick als Erstes auf sich zu
                ziehen. */}
            <p
              className="gc-hero-teil gc-kicker mb-3 text-[12px] tracking-[0.2em] text-balance uppercase sm:mb-5"
              style={{ color: "#6E5940", "--auftritt-verzug": "0.05s" } as React.CSSProperties}
            >
              {hero.augenbraue}
            </p>
            <h1
              className="gc-hero-teil gc-h1 mb-3 font-[family-name:var(--font-cormorant)] font-normal sm:mb-6 text-[clamp(2.15rem,4.2vw,3.5rem)] leading-[1.08] tracking-[-0.01em]"
              style={{ color: "var(--gc-text)", "--auftritt-verzug": "0.13s" } as React.CSSProperties}
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
              className="gc-hero-teil mb-1 text-[0.98rem] font-medium sm:mb-2 sm:text-[1.05rem]"
              style={{ color: "var(--gc-text)", "--auftritt-verzug": "0.21s" } as React.CSSProperties}
            >
              {person.name}
            </p>
            <p
              className="gc-hero-teil mb-4 text-[0.85rem] leading-snug sm:mb-7 sm:text-[0.92rem] sm:leading-relaxed"
              style={{ color: "var(--gc-text-fein)", "--auftritt-verzug": "0.27s" } as React.CSSProperties}
            >
              {person.titel}
            </p>

            <p
              className="gc-hero-teil mb-5 max-w-[28em] text-[0.98rem] leading-[1.6] sm:mb-9 sm:text-[1.1rem] sm:leading-[1.7]"
              style={{ color: "var(--gc-text-leise)", "--auftritt-verzug": "0.34s" } as React.CSSProperties}
            >
              {hero.text}
            </p>

            <div
              className="gc-hero-teil flex w-full flex-wrap items-center gap-4 sm:w-auto"
              style={{ "--auftritt-verzug": "0.42s" } as React.CSSProperties}
            >
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

              {/*
                Auf dem Handy ist das der einzige Knopf im Hero - und damit
                der Hauptknopf. Er war bisher trotzdem in der
                Nebenrolle gesetzt: fast weiss auf cremefarbenem Grund, also
                praktisch unsichtbar. Auf dem Desktop stimmt diese Rolle
                (daneben steht die gefuellte Telefonnummer), auf dem Handy
                nicht - dort steht die Nummer in der Leiste am unteren Rand
                und dieser Knopf muss allein tragen.

                Deshalb wechselt er die Gestalt: gefuellt in Navy und ueber
                die volle Spaltenbreite auf dem Handy, ab sm zurueck zur
                zurueckhaltenden Umrandung neben dem Anruf-Knopf.
              */}
              <MagnetKnopf
                href="#kontakt"
                stark={0.08}
                className="gc-hero-knopf min-h-14 w-full rounded-full border px-7 text-[1rem] sm:min-h-16 sm:w-auto sm:text-[1.05rem]"
              >
                {anfrageLabel}
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
      {/*
        Auf dem Handy liegen die Merkmale AUF dem Videoband, nicht darunter.

        Darunter kosteten sie eine eigene Zeile von rund 90 px - auf 844 px
        Bildschirmhoehe der Unterschied zwischen "Video ist ein Band" und
        "Video ist ein Streifen".

        Sie bringen ihre eigene Flaeche mit (siehe `.gc-merkmale` in
        globals.css), statt sich auf einen Verlauf im Bild zu verlassen. Der
        Grund ist Lesbarkeit: Ein Verlauf muesste die halbe Bildhoehe
        abdunkeln, um drei Textzeilen ueber einem hellen Fenster sicher
        lesbar zu machen - und haette damit genau das Motiv wieder
        zugedeckt, das hier endlich zu sehen ist. Eine abgesetzte Leiste
        deckt nur die 88 px, die sie wirklich braucht.

        Ab sm stehen sie wieder unter dem Video auf cremefarbenem Grund -
        dort ist Platz, und das Video liegt in seiner eigenen Box rechts.
      */}
      <div className="relative z-10 -mt-[6.25rem] sm:mt-0">
        <ul
          className="gc-hero-teil gc-merkmale huelle grid grid-cols-3 gap-x-3 gap-y-6 sm:gap-x-8"
          style={{ "--auftritt-verzug": "0.55s" } as React.CSSProperties}
        >
          {hero.merkmale.map((merkmal) => {
            const Symbol = SYMBOLE[merkmal.symbol];
            return (
              <li
                key={merkmal.titel}
                className="flex min-w-0 flex-col items-center gap-1.5 text-center sm:gap-2"
              >
                {/* Auf dem Navy-Sockel traegt Braun nicht (1,9:1). Gold
                    kommt dort auf 5,4:1 und ist ohnehin die Akzentfarbe
                    fuer alles, was auf dunklem Grund liegt. */}
                <Symbol
                  className="size-[1.15rem] flex-none text-[#D9BE93] sm:size-6 sm:text-[#6E5940]"
                  strokeWidth={1.4}
                  aria-hidden="true"
                />
                {/* `w-full`, nicht `min-w-0`: In einer Spalten-Flexbox
                    richtet sich die Breite eines Kindes nach seinem Inhalt,
                    `min-width` aendert daran nichts. Der Text stand deshalb
                    bei 130 % Textgroesse 115 px breit in einer 85 px
                    schmalen Spalte und ragte in die Nachbarspalte. Erst
                    `w-full` zwingt ihn auf die Spaltenbreite - dann bricht
                    er innerhalb um. Gemessen mit scripts/geraete.mjs. */}
                {/*
                  `hyphens-none` ist hier Pflicht, nicht Geschmack: Die
                  Seite trennt Woerter global automatisch (siehe body-Regel
                  in globals.css, noetig fuer lange deutsche Komposita in
                  schmalen Spalten). In einer 105 px breiten Spalte wurde
                  daraus "Neurologisch- / e Erfahrung" - eine Trennung nach
                  dem vorletzten Buchstaben. Bei nur drei kurzen
                  Beschriftungen ist der Umbruch am Leerzeichen immer
                  moeglich; die Trennung darf deshalb hier weg.
                */}
                <span
                  className="w-full text-[0.72rem] leading-tight font-medium text-balance hyphens-none text-[#F4EEE3] sm:text-[clamp(0.85rem,1.6vw,1rem)] sm:hyphens-auto sm:text-[color:var(--gc-text)]"
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
