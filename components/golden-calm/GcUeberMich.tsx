"use client";

import Bild from "@/components/Bild";
import WortAuftritt from "@/components/motion/WortAuftritt";
import ParallaxBild from "./ParallaxBild";
import { person as personDe, ueberMich as ueberMichDe } from "@/lib/content/golden-calm";
import type { Person, UeberMich } from "@/lib/content/typen";

/*
  Der Inhalt kommt als Parameter herein, mit dem deutschen als Vorgabe.
  So rendert dieselbe Komponente die deutsche und die englische Seite -
  ohne Kopie und ohne dass die Gestaltung zweimal gepflegt werden muss.
  Bestehende Aufrufe ohne Parameter bleiben unveraendert deutsch.
*/
export default function GcUeberMich({
  person = personDe,
  ueberMich = ueberMichDe,
}: {
  person?: Person;
  ueberMich?: UeberMich;
} = {}) {
  return (
    <section
      id="ueber-mich"
      className="gc-anker mx-auto max-w-[1280px] px-[clamp(1.25rem,4vw,2.75rem)] pt-[clamp(2.75rem,10vw,7rem)]"
    >
      <div className="grid items-center gap-8 md:grid-cols-2 md:gap-20">
        <ParallaxBild
          staerke={10}
          /* Auf dem Handy flacher: Ein 4:5-Portraet ist dort 480 px hoch
             und schiebt den Text komplett unter die Falz. 5:4 zeigt
             dasselbe Motiv in 310 px. */
          className="aspect-[5/4] rounded-[24px] sm:aspect-[4/5]"
          style={{ boxShadow: "0 60px 110px -60px rgba(44,37,35,0.5)" }}
        >
          <Bild
            name="portraet-start"
            className="h-full overflow-hidden"
            bildKlasse="h-full"
            groessen="(min-width: 768px) 42vw, 100vw"
          />
        </ParallaxBild>

        <div>
          <p
            className="gc-kicker mb-3 text-[13px] tracking-[0.24em] uppercase sm:mb-[18px]"
            style={{ color: "#6E5940" }}
          >
            {ueberMich.kicker}
          </p>
          <WortAuftritt
            text={ueberMich.titel}
            className="gc-h2 mb-1 font-[family-name:var(--font-cormorant)] font-normal text-[clamp(2.1rem,3.8vw,3.1rem)] leading-[1.15]"
            style={{ color: "var(--gc-text)" }}
          />
          <p
            className="mb-5 font-[family-name:var(--font-jakarta)] text-[0.92rem] sm:mb-7 sm:text-[1.05rem]"
            style={{ color: "var(--gc-text-fein)" }}
          >
            {person.titel}
          </p>

          <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:gap-5">
            {ueberMich.absaetze.map((absatz) => (
              <p
                key={absatz}
                className="gc-lead max-w-[32em] text-[1.2rem]"
                style={{ color: "var(--gc-text-leise)" }}
              >
                {absatz}
              </p>
            ))}
          </div>

          <div className="grid gap-px" style={{ borderTop: "1px solid var(--gc-bg-sekundaer)" }}>
            {ueberMich.fakten.map((fakt) => (
              <div
                key={fakt.label}
                /* `min-w-0` an beiden Spalten ist Pflicht, nicht Feinschliff:
                   Flex-Kinder schrumpfen sonst nie unter ihre Textbreite. Bei
                   130 % Textgroesse schob "M.A. Health Administration" die
                   Zeile dadurch 8 px ueber den Fensterrand und die ganze
                   Seite liess sich seitlich scrollen. Mit `min-w-0` bricht
                   der Wert stattdessen um. */
                className="flex justify-between gap-4 py-3 text-[0.92rem] sm:gap-6 sm:py-[18px] sm:text-[1.05rem]"
                style={{ borderBottom: "1px solid var(--gc-bg-sekundaer)" }}
              >
                {/* Die Bezeichnung ist immer ein einzelnes Wort und darf
                    nicht umbrechen - `min-w-0` allein hat sie stattdessen
                    beschnitten ("Ausbildung" wurde abgeschnitten). Sie
                    behaelt deshalb ihre Breite; schrumpfen und umbrechen
                    tut nur der Wert daneben. */}
                <span
                  className="flex-none whitespace-nowrap"
                  style={{ color: "var(--gc-text-fein)" }}
                >
                  {fakt.label}
                </span>
                <span
                  className="min-w-0 text-right break-words"
                  style={{ color: "var(--gc-text)" }}
                >
                  {fakt.wert}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
