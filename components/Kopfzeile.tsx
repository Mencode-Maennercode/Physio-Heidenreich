"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import Logo from "./Logo";
import BarrierefreiheitPanel from "./a11y/BarrierefreiheitPanel";
import SmsKnopf from "./SmsKnopf";
import Sprachwahl from "@/components/Sprachwahl";
import TerminHinweis from "@/components/TerminHinweis";
import { kontakt, rechtsnavigation } from "@/lib/site-config";
import { UI, spracheAus } from "@/lib/sprache";
import { cn } from "@/lib/utils";

/**
 * Kopfzeile.
 *
 * Reihenfolge der Bedienelemente ist keine Geschmacksfrage: Die Festnetznummer
 * steht vor allem anderen, weil ein grosser Teil der Anfragen von aelteren
 * Menschen kommt, die anrufen statt zu tippen.
 *
 * Ganz oben sitzt die Leiste ohne eigenen Untergrund direkt auf der Flaeche
 * der Seite - keine Trennlinie, kein abgesetzter Balken. Erst beim Scrollen
 * legt sich ein leicht milchiger Grund darunter, damit der durchlaufende
 * Inhalt die Schrift nicht stoert. Der Uebergang ist bewusst nur eine
 * Farbaenderung ohne Kante: Eine Linie waere genau der harte Schnitt, den
 * der Aufbau der Startseite vermeidet.
 */
export default function Kopfzeile() {
  const pfad = usePathname();
  /* Die Sprache steht in der Adresse - kein Zustand, kein Umschalten im
     Kopf. Damit stimmt sie auch beim ersten Aufbau auf dem Server. */
  const sprache = spracheAus(pfad);
  const { navigation, ...beschriftung } = UI[sprache];
  const [gescrollt, setzeGescrollt] = useState(false);
  const [menueOffen, setzeMenueOffen] = useState(false);
  const [versteckt, setzeVersteckt] = useState(false);

  const leiste = useRef<HTMLElement>(null);

  /*
    Zwei Dinge werden am Scrollen abgelesen, nicht eines.

    `gescrollt` entscheidet ueber den milchigen Untergrund - das war schon
    immer so. Neu ist `versteckt`: Auf schmalen Schirmen belegte die feste
    Leiste samt Terminstreifen dauerhaft 188 px von 844 px. Beim Lesen ist
    sie dort nur im Weg; gebraucht wird sie in dem Moment, in dem jemand
    zurueck nach oben will - und genau diese Geste holt sie zurueck.

    Die Schwelle von 8 px ist noetig, weil auf Telefonen jede Beruehrung
    ein paar Pixel in beide Richtungen erzeugt. Ohne sie flackerte die
    Leiste beim blossen Halten des Fingers.

    Ueber 1024 px bleibt sie stehen: Dort kostet sie kaum Platz, und eine
    Kopfzeile, die mit der Maus verschwindet, irritiert mehr, als sie
    nuetzt. Das erledigt die Regel `.kopf-weg` in globals.css - der
    Zustand hier wird trotzdem gefuehrt, damit beim Verkleinern des
    Fensters nichts nachgeholt werden muss.
  */
  useEffect(() => {
    let letzte = window.scrollY;

    const pruefen = () => {
      const jetzt = window.scrollY;
      setzeGescrollt(jetzt > 32);

      const weg = jetzt - letzte;
      if (Math.abs(weg) > 8) {
        /* Im obersten Bereich bleibt sie immer da: Dort ist noch kein Platz
           gewonnen, und der Terminhinweis soll beim Ankommen sichtbar sein. */
        setzeVersteckt(weg > 0 && jetzt > 140);
        letzte = jetzt;
      }
    };

    pruefen();
    window.addEventListener("scroll", pruefen, { passive: true });
    return () => window.removeEventListener("scroll", pruefen);
  }, []);

  /*
    Die Kopfzeile meldet ihre eigene Hoehe als CSS-Variable.

    Vorher stand die Hoehe an drei Stellen im Hero als feste Zahl
    (7,5 rem / 5,5 rem / 7,75 rem) - geraten fuer den Fall, dass die Leiste
    auf schmalen Schirmen zweizeilig umbricht. Jede Aenderung am Kopf
    musste dort von Hand nachgezogen werden, und mit dem Terminstreifen
    waere es endgueltig unhaltbar geworden: Seine Hoehe haengt davon ab, ob
    er ueberhaupt angezeigt wird.

    Der Beobachter misst stattdessen, was wirklich dasteht - auch wenn der
    Streifen zusammenfaehrt oder die Schrift vergroessert wird.
  */
  useEffect(() => {
    const knoten = leiste.current;
    if (!knoten) return;

    const melde = () => {
      document.documentElement.style.setProperty(
        "--kopf-hoehe",
        `${knoten.offsetHeight}px`,
      );
    };
    melde();

    const beobachter = new ResizeObserver(melde);
    beobachter.observe(knoten);
    return () => beobachter.disconnect();
  }, []);

  /*
    Frueher gab es hier zusaetzlich einen hellen Text-auf-dunkel-Zustand fuer
    einen vollflaechig dunklen Hero. Den gibt es nicht mehr: Die Startseite
    laeuft oben in dieselbe helle Grundfarbe aus wie jede Unterseite, die
    Schrift bleibt deshalb in beiden Zustaenden dunkel. Uebrig bleibt allein
    die Frage, ob schon ein Grund noetig ist.
  */
  const durchsichtig = !gescrollt;

  return (
    <>
      <header
        ref={leiste}
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-[transform,background-color,backdrop-filter] duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)]",
          durchsichtig ? "bg-transparent" : "bg-grund/85 backdrop-blur-md",
          /* Beim Herunterscrollen faehrt die Leiste weg, beim
             Hinaufscrollen kommt sie zurueck. Ab 1024 px hebt die Regel
             in globals.css das wieder auf - dort bleibt sie stehen. */
          versteckt && !menueOffen ? "kopf-weg" : "kopf-da",
        )}
      >
        {/* min-h statt h, plus flex-wrap: Bei sehr grosser Schrift auf
            schmalen Schirmen (Logo + Telefon/Barrierefreiheits-/Menu-Knopf
            passen dann rechnerisch nicht mehr nebeneinander) rutscht die
            Knopfgruppe in eine zweite Zeile, statt die Seite horizontal
            aufzureissen. Alle Elemente behalten dabei ihre volle,
            mitwachsende Groesse - nichts wird fuer diesen Randfall
            verkleinert. */}
        {/*
          Zwei Zonen statt drei.

          Vorher standen Logo, Navigation und Knopfgruppe als drei
          gleichrangige Kinder mit `justify-between` nebeneinander - zusammen
          zu breit, sodass die Knopfgruppe unter das Logo umbrach und links
          eine grosse Luecke entstand. Jetzt gibt es nur noch links (Logo)
          und rechts (alles andere); innerhalb der rechten Zone ordnen sich
          Navigation und Knoepfe selbst.

          Die Reihenfolge in der rechten Zone folgt der Wichtigkeit von
          links nach rechts: erst die Kapitel, dann die stillen Werkzeuge
          (Sprache, Barrierefreiheit), ganz aussen die Kontaktaufnahme. Der
          Anruf-Knopf steht damit an der auffaelligsten Stelle der Zeile -
          dem aeusseren Ende, das der Blick zuletzt und am sichersten
          trifft.
        */}
        {/* Auf dem Handy 3,5 rem statt 4,75 rem: Die Marke ist dort kleiner
            gesetzt (siehe Logo.tsx), und die Knopfgruppe passt daneben in
            dieselbe Zeile. Das spart zusammen mit dem kompakteren
            Terminstreifen rund 90 px - auf 844 px Bildschirmhoehe ein
            Neuntel des Sichtfelds. */}
        <div className="kopf-reihe flex min-h-[3.5rem] flex-wrap items-center justify-between gap-x-2 gap-y-2 py-1.5 sm:min-h-[4.75rem] sm:gap-x-4 sm:py-2">
          <Logo />

          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2 sm:gap-x-3 xl:gap-x-4">
            <nav aria-label={beschriftung.menue} className="hidden xl:block">
              <ul className="flex items-center gap-0.5">
                {navigation.map((eintrag) => {
                  const aktiv =
                    eintrag.pfad === "/"
                      ? pfad === "/"
                      : pfad.startsWith(eintrag.pfad);

                  return (
                    <li key={eintrag.pfad}>
                      <Link
                        href={eintrag.pfad}
                        aria-current={aktiv ? "page" : undefined}
                        className={cn(
                          "relative flex min-h-[2.75rem] items-center px-2 text-[0.92rem] transition-opacity",
                          aktiv ? "opacity-100" : "opacity-70 hover:opacity-100",
                        )}
                      >
                        {eintrag.name}
                        {aktiv ? (
                          <span
                            aria-hidden="true"
                            className={cn(
                              "absolute inset-x-2 bottom-1.5 h-px bg-akzent",
                            )}
                          />
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Feine Trennung zwischen Wegweisern und Werkzeugen. Ohne sie
                lesen sich Navigationslinks und Knoepfe als eine einzige
                lange Reihe gleichrangiger Dinge. */}
            <span
              aria-hidden="true"
              className="hidden h-6 w-px bg-linie xl:block"
            />

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/*
              Reihenfolge von innen nach aussen: erst die Kontaktaufnahme
              (Anruf, SMS), dann die stillen Werkzeuge (Barrierefreiheit,
              Sprache). Der Abstand dazwischen trennt beide Gruppen -
              ohne ihn lasen sich alle vier Knoepfe als eine gleichrangige
              Reihe und die Zeile wirkte gequetscht.

              Der Anruf ist der einzige gefuellte Knopf und steht vorn in
              seiner Gruppe: Ein grosser Teil der Anfragen kommt von
              aelteren Menschen, die anrufen statt zu tippen.

              Unter sm entfallen Anruf und SMS hier - die feste Leiste am
              unteren Rand deckt beide dort mit voller Breite ab. Zwei
              Anruf-Knoepfe uebereinander waeren nur Verdopplung, und bei
              vergroesserter Schrift reicht der Platz im Kopf ohnehin nicht.
            */}
            <a
              href={`tel:${kontakt.telefonLink}`}
              className={cn(
                "hidden min-h-[2.75rem] items-center gap-2.5 rounded-full bg-aktion px-4 text-[0.92rem] font-medium text-[color:var(--marke-offwhite)] transition-colors hover:bg-aktion-hover sm:flex",
              )}
            >
              <Phone className="size-4 flex-none" aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">
                {kontakt.telefonAnzeige}
              </span>
            </a>

            <div className="hidden sm:block">
              <SmsKnopf nurSymbol />
            </div>

            {/* Deutlicher Abstand zur Kontaktaufnahme: Erst dadurch lesen sich
                Barrierefreiheit und Sprache als eigene Gruppe am Rand und
                nicht als Fortsetzung der Knopfreihe. */}
            {/*
              Die Sprachwahl war bis md ausgeblendet - genau falsch herum
              gedacht. Wer die englische Fassung braucht (Angehoerige aus
              dem Bonner Umfeld, internationale Patienten), sitzt eher am
              Telefon als am Schreibtisch. Auf dem Handy zeigt der Knopf
              nur die Flagge, damit er in die eine Zeile passt.
            */}
            <div className="kopf-werkzeuge flex items-center gap-1.5 sm:gap-2">
              <BarrierefreiheitPanel />
              <Sprachwahl />
            </div>

            <Dialog.Root open={menueOffen} onOpenChange={setzeMenueOffen}>
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  className={cn(
                    "flex size-11 items-center justify-center rounded-full border border-linie text-aktion transition-colors hover:bg-grund-warm xl:hidden",
                  )}
                  aria-label={beschriftung.menueOeffnen}
                >
                  <Menu className="size-5" aria-hidden="true" />
                </button>
              </Dialog.Trigger>

              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-[#1b3535]/40 backdrop-blur-[2px]" />
                {/* Warme Flaeche statt fruehreres Tiefpetrol - hier liegt kein
                    Bild darunter, das eine dunkle Ueberlagerung braeuchte. */}
                <Dialog.Content className="auf-warm fixed inset-0 z-50 flex flex-col overflow-y-auto focus:outline-none">
                  <Dialog.Title className="sr-only">Menü</Dialog.Title>
                  <div className="huelle flex h-[4.75rem] flex-none items-center justify-between">
                    <Logo />
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        className="flex size-11 items-center justify-center rounded-full border border-linie-warm transition-colors hover:bg-grund/40"
                        aria-label={beschriftung.menueSchliessen}
                      >
                        <X className="size-5" aria-hidden="true" />
                      </button>
                    </Dialog.Close>
                  </div>

                  <nav
                    aria-label={beschriftung.menue}
                    className="huelle flex flex-1 flex-col justify-center py-10"
                  >
                    <ul className="flex flex-col gap-1">
                      {navigation.map((eintrag) => (
                        <li key={eintrag.pfad}>
                          <Link
                            href={eintrag.pfad}
                            onClick={() => setzeMenueOffen(false)}
                            className="schrift-display flex min-h-[3.5rem] items-center border-b border-linie-warm text-[1.75rem] transition-colors hover:text-akzent-warm"
                          >
                            {eintrag.name}
                          </Link>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-10 flex flex-col gap-3">
                      <a
                        href={`tel:${kontakt.telefonLink}`}
                        className="flex min-h-[3.25rem] items-center justify-center gap-2.5 rounded-full bg-aktion px-6 font-medium text-[color:var(--marke-offwhite)]"
                      >
                        <Phone className="size-4" aria-hidden="true" />
                        {kontakt.telefonAnzeige}
                      </a>
                      {/*
                        `border-linie-warm` statt der Voreinstellung: Im
                        Menue liegt eine Greige-Flaeche, und `--ui-linie` ist
                        genau dieses Greige - der Rand des SMS-Knopfes war
                        dort unsichtbar, der Knopf sah aus wie ein
                        freistehendes Wort neben einem echten Knopf.
                        `w-full` bringt ihn auf dieselbe Breite wie die
                        Telefonnummer darueber; ohne das schrumpfte er auf
                        seine Textbreite und die beiden standen
                        unterschiedlich breit uebereinander.
                      */}
                      <SmsKnopf className="w-full border-linie-warm" />
                    </div>

                    {/*
                      Impressum und Datenschutz standen bisher nur im Fuss
                      der Seite - auf dem Handy heisst das: bis ganz ans
                      Seitenende scrollen, vorbei an Kontaktzeilen,
                      Seiten-Liste und Einsatzgebiet-Text, in derselben
                      leisen Schrift wie der Rest. Leicht zu uebersehen,
                      obwohl der Link technisch da ist. Hier im Menue ist er
                      von jeder Seite aus in einem Tipp erreichbar - nur
                      Deutsch, weil auch nur die deutsche Seite diese
                      Unterseiten hat.
                    */}
                    {sprache === "de" ? (
                      <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-t border-linie-warm pt-6 text-[0.85rem] text-leise">
                        {rechtsnavigation
                          .filter((eintrag) => eintrag.pfad !== "/en/")
                          .map((eintrag) => (
                            <li key={eintrag.pfad}>
                              <Link
                                href={eintrag.pfad}
                                onClick={() => setzeMenueOffen(false)}
                                className="inline-flex min-h-11 items-center transition-colors hover:text-text"
                              >
                                {eintrag.name}
                              </Link>
                            </li>
                          ))}
                      </ul>
                    ) : null}
                  </nav>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
          </div>
        </div>

        {/* Der Terminstreifen gehoert in die feste Leiste, nicht in den
            Hero: So liegt er ueber der ganzen Seitenbreite, verdeckt nichts
            und schiebt den Inhalt nur so weit nach unten, wie er selbst
            hoch ist. Faehrt er zusammen, wandert der Inhalt wieder hoch -
            der Beobachter oben misst das mit. */}
        <TerminHinweis />
      </header>

      {/* Feste Leiste am unteren Rand kleiner Schirme. Anrufen und SMS sind
          damit auf jeder Seite in Daumenreichweite, ohne zu scrollen. */}
      {/* 85 statt 95 Prozent Deckung: Bei 95 % war der Weichzeichner
          dahinter wirkungslos - die Leiste lag als undurchsichtige Platte
          auf der Seite. Mit etwas mehr Durchsicht schimmert der Inhalt
          darunter durch und die Leiste liest sich als aufgelegte Schicht,
          nicht als abgeschnittener Seitenrand. Der Text darauf bleibt bei
          beiden Werten weit ueber der Kontrastschwelle, weil er in den
          gefuellten Knoepfen sitzt. */}
      <div className="nicht-drucken fixed inset-x-0 bottom-0 z-40 border-t border-linie bg-grund/85 px-3 py-2.5 backdrop-blur-xl sm:hidden">
        <div className="flex items-center gap-2">
          <a
            href={`tel:${kontakt.telefonLink}`}
            className="flex min-h-[3rem] flex-1 items-center justify-center gap-2 rounded-full bg-aktion px-4 font-medium text-[color:var(--marke-offwhite)]"
          >
            <Phone className="size-4" aria-hidden="true" />
            Anrufen
          </a>
          <SmsKnopf className="flex-1" />
        </div>
      </div>
    </>
  );
}
