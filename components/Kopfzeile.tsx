"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import Logo from "./Logo";
import BarrierefreiheitPanel from "./a11y/BarrierefreiheitPanel";
import SmsKnopf from "./SmsKnopf";
import Sprachwahl from "@/components/Sprachwahl";
import { kontakt, navigation } from "@/lib/site-config";
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
  const [gescrollt, setzeGescrollt] = useState(false);
  const [menueOffen, setzeMenueOffen] = useState(false);

  useEffect(() => {
    const pruefen = () => setzeGescrollt(window.scrollY > 32);
    pruefen();
    window.addEventListener("scroll", pruefen, { passive: true });
    return () => window.removeEventListener("scroll", pruefen);
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
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-colors duration-300",
          durchsichtig
            ? "bg-transparent"
            : "bg-grund/85 backdrop-blur-md",
        )}
      >
        {/* min-h statt h, plus flex-wrap: Bei sehr grosser Schrift auf
            schmalen Schirmen (Logo + Telefon/Barrierefreiheits-/Menu-Knopf
            passen dann rechnerisch nicht mehr nebeneinander) rutscht die
            Knopfgruppe in eine zweite Zeile, statt die Seite horizontal
            aufzureissen. Alle Elemente behalten dabei ihre volle,
            mitwachsende Groesse - nichts wird fuer diesen Randfall
            verkleinert. */}
        <div className="huelle flex min-h-[4.75rem] flex-wrap items-center justify-between gap-x-6 gap-y-2 py-2">
          <Logo />

          <nav aria-label="Hauptmenü" className="hidden lg:block">
            <ul className="flex items-center gap-1">
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
                        "relative flex min-h-[2.75rem] items-center px-3.5 text-[0.92rem] transition-opacity",
                        aktiv ? "opacity-100" : "opacity-70 hover:opacity-100",
                      )}
                    >
                      {eintrag.name}
                      {aktiv ? (
                        <span
                          aria-hidden="true"
                          className={cn(
                            "absolute inset-x-3.5 bottom-1.5 h-px bg-akzent",
                          )}
                        />
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            {/* Sprachwahl ganz links in der Knopfgruppe: Sie ist der am
                seltensten gebrauchte Knopf und darf dem Telefon nicht den
                Platz streitig machen. Unter sm entfaellt sie - dort ist der
                Kopf fuer Logo, Telefon und Menue schon voll, und die
                englische Seite ist ueber den Fuss weiterhin erreichbar. */}
            <Sprachwahl className="hidden md:flex" />

            {/* Festnetz: ab sm mit Nummer im Kopf sichtbar. Darunter bleibt es
                versteckt - nicht weil das Telefonieren dort unwichtig waere,
                sondern im Gegenteil: Die feste Anruf-Leiste am unteren Rand
                (weiter unten in dieser Datei) deckt genau diesen Bereich
                bereits mit einem vollbreiten, groesseren Anruf-Knopf ab. Ein
                zweiter, engerer Anruf-Knopf oben waere dort nur redundant -
                und bei stark vergroesserter Schrift (Barrierefreiheits-
                Einstellung) reicht der Platz im Kopf fuer Logo, Telefon-,
                Barrierefreiheits- und Menu-Knopf zusammen nicht mehr; alle
                vier Elemente skalieren bewusst mit der Textgroesse fuer
                groessere Tippflaechen. */}
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

            <BarrierefreiheitPanel />

            <Dialog.Root open={menueOffen} onOpenChange={setzeMenueOffen}>
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  className={cn(
                    "flex size-11 items-center justify-center rounded-full border border-linie text-aktion transition-colors hover:bg-grund-warm lg:hidden",
                  )}
                  aria-label="Menü öffnen"
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
                        aria-label="Menü schließen"
                      >
                        <X className="size-5" aria-hidden="true" />
                      </button>
                    </Dialog.Close>
                  </div>

                  <nav
                    aria-label="Hauptmenü"
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
                      <SmsKnopf />
                    </div>
                  </nav>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </div>
      </header>

      {/* Feste Leiste am unteren Rand kleiner Schirme. Anrufen und SMS sind
          damit auf jeder Seite in Daumenreichweite, ohne zu scrollen. */}
      <div className="nicht-drucken fixed inset-x-0 bottom-0 z-40 border-t border-linie bg-grund/95 px-3 py-2.5 backdrop-blur-md sm:hidden">
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
