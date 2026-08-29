"use client";

import Bild from "@/components/Bild";
import ParallaxBild from "./ParallaxBild";
import { person, ueberMich } from "@/lib/content/golden-calm";

export default function GcUeberMich() {
  return (
    <section
      id="ueber-mich"
      className="gc-anker mx-auto max-w-[1280px] px-[clamp(1.25rem,4vw,2.75rem)] pt-[clamp(4.5rem,9vw,7rem)]"
    >
      <div className="grid items-center gap-16 md:grid-cols-2 md:gap-20">
        <ParallaxBild
          staerke={10}
          className="aspect-[4/5] rounded-[24px]"
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
            className="mb-[18px] text-[13px] tracking-[0.24em] uppercase"
            style={{ color: "#6E5940" }}
          >
            {ueberMich.kicker}
          </p>
          <h2
            className="mb-1 font-[family-name:var(--font-cormorant)] font-normal text-[clamp(2.1rem,3.8vw,3.1rem)] leading-[1.15]"
            style={{ color: "var(--gc-text)" }}
          >
            {ueberMich.titel}
          </h2>
          <p
            className="mb-7 font-[family-name:var(--font-jakarta)] text-[1.05rem]"
            style={{ color: "var(--gc-text-fein)" }}
          >
            {person.titel}
          </p>

          <div className="mb-8 flex flex-col gap-5">
            {ueberMich.absaetze.map((absatz) => (
              <p
                key={absatz}
                className="max-w-[32em] text-[1.2rem]"
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
                className="flex justify-between gap-4 py-[18px] text-[1.05rem] sm:gap-6"
                style={{ borderBottom: "1px solid var(--gc-bg-sekundaer)" }}
              >
                <span className="min-w-0" style={{ color: "var(--gc-text-fein)" }}>
                  {fakt.label}
                </span>
                <span
                  className="min-w-0 text-right"
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
