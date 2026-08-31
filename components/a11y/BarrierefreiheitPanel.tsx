"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Accessibility, X } from "lucide-react";
import {
  useEinstellungen,
  type Bewegung,
  type Kontrast,
  type Textgroesse,
} from "./Einstellungen";
import { cn } from "@/lib/utils";

/**
 * Ein einziges Fenster, drei Entscheidungen, keine Verschachtelung.
 *
 * Bewusst native Radio-Eingaben unter den Flaechen: Damit funktionieren
 * Pfeiltasten, Screenreader-Ansage und Gruppierung ohne eine Zeile eigenen
 * Tastatur-Code.
 */

type WahlProps<T extends string> = {
  name: string;
  wert: T;
  aktuell: T;
  onWahl: (wert: T) => void;
  titel: string;
  hinweis?: string;
  vorschau?: React.ReactNode;
};

function Wahl<T extends string>({
  name,
  wert,
  aktuell,
  onWahl,
  titel,
  hinweis,
  vorschau,
}: WahlProps<T>) {
  const gewaehlt = aktuell === wert;

  return (
    <label
      className={cn(
        "group relative flex min-h-[3.5rem] cursor-pointer items-center gap-4 rounded-lg border px-4 py-3 transition-colors",
        "has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--ui-aktion)]",
        gewaehlt
          ? "border-aktion bg-aktion/8"
          : "border-linie hover:border-aktion/50 hover:bg-grund-warm",
      )}
    >
      <input
        type="radio"
        name={name}
        value={wert}
        checked={gewaehlt}
        onChange={() => onWahl(wert)}
        className="sr-only"
      />
      <span
        aria-hidden="true"
        className={cn(
          "flex size-5 flex-none items-center justify-center rounded-full border-2 transition-colors",
          gewaehlt ? "border-aktion" : "border-linie",
        )}
      >
        <span
          className={cn(
            "size-2.5 rounded-full bg-aktion transition-transform",
            gewaehlt ? "scale-100" : "scale-0",
          )}
        />
      </span>

      <span className="flex-1">
        <span className="block font-medium">{titel}</span>
        {hinweis ? (
          <span className="block text-[0.82rem] leading-snug text-leise">
            {hinweis}
          </span>
        ) : null}
      </span>

      {vorschau ? (
        <span aria-hidden="true" className="flex-none text-leise">
          {vorschau}
        </span>
      ) : null}
    </label>
  );
}

function Gruppe({
  titel,
  children,
}: {
  titel: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="border-0 p-0">
      <legend className="feld-marke mb-3">{titel}</legend>
      <div className="flex flex-col gap-2">{children}</div>
    </fieldset>
  );
}

export default function BarrierefreiheitPanel({
  variante = "kopf",
}: {
  variante?: "kopf" | "fuss";
}) {
  const [offen, setzeOffen] = useState(false);
  const e = useEinstellungen();
  const pfad = usePathname();
  const router = useRouter();

  /*
    "Alles zuruecksetzen" setzte bisher nur Textgroesse, Kontrast und
    Bewegung zurueck - stand man auf /einfache-sprache/, blieb man dort
    stehen, obwohl "alles" zurueckgesetzt wurde. Die einfache Sprache ist
    zwar keine der drei Einstellungen (sie hat keinen gespeicherten
    Zustand, sondern ist schlicht eine andere Seite), gehoert aus Sicht des
    Knopfes aber erkennbar dazu - wer zuruecksetzt, will die normale
    Ansicht der Seite, nicht nur normale Textgroesse auf der vereinfachten
    Seite.
  */
  const zuruecksetzen = () => {
    e.zuruecksetzen();
    if (pfad === "/einfache-sprache/" || pfad === "/einfache-sprache") {
      setzeOffen(false);
      router.push("/");
    }
  };

  return (
    <Dialog.Root open={offen} onOpenChange={setzeOffen}>
      <Dialog.Trigger asChild>
        {variante === "kopf" ? (
          <button
            type="button"
            className="flex size-11 items-center justify-center rounded-full border border-linie text-aktion transition-colors hover:border-aktion hover:bg-grund-warm"
            aria-label="Darstellung anpassen: Textgröße, Kontrast, Bewegung"
          >
            <Accessibility className="size-5" aria-hidden="true" />
          </button>
        ) : (
          <button
            type="button"
            className="inline-flex min-h-[2.75rem] items-center gap-2 text-leise underline decoration-linie-warm underline-offset-4 transition-colors hover:text-text"
          >
            <Accessibility className="size-4" aria-hidden="true" />
            Darstellung anpassen
          </button>
        )}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[#1b3535]/40 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed top-0 right-0 bottom-0 z-50 flex w-full max-w-[26rem] flex-col overflow-y-auto bg-grund shadow-tief focus:outline-none">
          <div className="flex items-start justify-between gap-4 border-b border-linie-fein px-6 py-5">
            <div>
              <Dialog.Title className="schrift-display text-[1.5rem]">
                Darstellung
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-[0.9rem] text-leise">
                Die Einstellungen bleiben auf diesem Gerät gespeichert.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="flex size-11 flex-none items-center justify-center rounded-full border border-linie text-aktion transition-colors hover:bg-grund-warm"
                aria-label="Schließen"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>

          <div className="flex flex-col gap-8 px-6 py-6">
            <Gruppe titel="Textgröße">
              {(
                [
                  ["normal", "Normal", "1,0×"],
                  ["gross", "Groß", "1,15×"],
                  ["sehrgross", "Sehr groß", "1,3×"],
                ] as [Textgroesse, string, string][]
              ).map(([wert, titel, faktor]) => (
                <Wahl
                  key={wert}
                  name="textgroesse"
                  wert={wert}
                  aktuell={e.textgroesse}
                  onWahl={e.setzeTextgroesse}
                  titel={titel}
                  vorschau={
                    <span
                      className="schrift-display"
                      style={{
                        fontSize:
                          wert === "normal"
                            ? "1rem"
                            : wert === "gross"
                              ? "1.25rem"
                              : "1.5rem",
                      }}
                    >
                      Aa
                    </span>
                  }
                  hinweis={faktor}
                />
              ))}
            </Gruppe>

            <Gruppe titel="Kontrast">
              {(
                [
                  ["normal", "Normal", "Gedeckte Farben, feine Linien"],
                  ["hoch", "Erhöht", "Dunklere Schrift und kräftigere Linien"],
                ] as [Kontrast, string, string][]
              ).map(([wert, titel, hinweis]) => (
                <Wahl
                  key={wert}
                  name="kontrast"
                  wert={wert}
                  aktuell={e.kontrast}
                  onWahl={e.setzeKontrast}
                  titel={titel}
                  hinweis={hinweis}
                />
              ))}
            </Gruppe>

            <Gruppe titel="Bewegung">
              {(
                [
                  [
                    "system",
                    "Wie im Betriebssystem",
                    "Übernimmt Ihre Geräteeinstellung",
                  ],
                  [
                    "reduziert",
                    "Weniger Bewegung",
                    "Videos stehen still, nichts blendet ein",
                  ],
                  ["voll", "Volle Bewegung", "Alle Animationen laufen"],
                ] as [Bewegung, string, string][]
              ).map(([wert, titel, hinweis]) => (
                <Wahl
                  key={wert}
                  name="bewegung"
                  wert={wert}
                  aktuell={e.bewegung}
                  onWahl={e.setzeBewegung}
                  titel={titel}
                  hinweis={hinweis}
                />
              ))}
            </Gruppe>

            <div className="haarlinie" />

            <div className="flex flex-col gap-4">
              <Link
                href="/einfache-sprache/"
                onClick={() => setzeOffen(false)}
                className="flex min-h-[3.5rem] items-center justify-between gap-4 rounded-lg border border-linie px-4 py-3 transition-colors hover:border-aktion hover:bg-grund-warm"
              >
                <span>
                  <span className="block font-medium">Einfache Sprache</span>
                  <span className="block text-[0.82rem] leading-snug text-leise">
                    Alles Wichtige in kurzen Sätzen
                  </span>
                </span>
                <span aria-hidden="true" className="text-aktion">
                  →
                </span>
              </Link>

              <button
                type="button"
                onClick={zuruecksetzen}
                className="self-start text-[0.9rem] text-leise underline underline-offset-4 transition-colors hover:text-text"
              >
                Alles zurücksetzen
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
