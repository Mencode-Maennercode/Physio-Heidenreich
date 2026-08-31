"use client";

import Bild from "@/components/Bild";
import TiltKarte from "./TiltKarte";
import WortAuftritt from "@/components/motion/WortAuftritt";
import ScrollReveal from "./ScrollReveal";
import GcSchiene from "./GcSchiene";
import { leistungen as leistungenDe } from "@/lib/content/golden-calm";
import type { Leistungen } from "@/lib/content/typen";

/*
  Der Inhalt kommt als Parameter herein, mit dem deutschen als Vorgabe.
  So rendert dieselbe Komponente die deutsche und die englische Seite -
  ohne Kopie und ohne dass die Gestaltung zweimal gepflegt werden muss.
  Bestehende Aufrufe ohne Parameter bleiben unveraendert deutsch.
*/
export default function GcLeistungen({
  leistungen = leistungenDe,
}: {
  leistungen?: Leistungen;
} = {}) {
  return (
    <section
      id="leistungen"
      className="gc-anker mt-[clamp(2.5rem,10vw,6.5rem)] py-[clamp(2.75rem,10vw,7rem)]"
      style={{ background: "var(--gc-bg-sekundaer)" }}
    >
      <div className="mx-auto max-w-[1280px] px-[clamp(1.25rem,4vw,2.75rem)]">
        <div className="mb-8 max-w-[40em] sm:mb-14">
          <p
            className="gc-kicker mb-3 text-[13px] tracking-[0.24em] uppercase sm:mb-[18px]"
            style={{ color: "#6E5940" }}
          >
            {leistungen.kicker}
          </p>
          <WortAuftritt
            text={leistungen.titel}
            className="mb-4 sm:mb-5 gc-h2 font-[family-name:var(--font-cormorant)] font-normal text-[clamp(2.1rem,3.8vw,3.1rem)] leading-[1.15]"
            style={{ color: "var(--gc-text)" }}
          />
          <p
            className="gc-lead text-[1.2rem]"
            style={{ color: "var(--gc-text-leise)" }}
          >
            {leistungen.text}
          </p>
        </div>

        {/*
          Auf dem Handy eine gewischte Reihe, ab Tablet das gewohnte Raster
          (3 Spalten balancieren fuenf Karten als 3+2, statt eine einzelne
          Karte allein in einer vierten Zeile stehen zu lassen).

          Der Grund fuer die Reihe steht ausfuehrlich in GcSchiene.tsx: Fuenf
          Karten untereinander sind auf 390 px vier Bildschirme Weg fuer
          einen Abschnitt.
        */}
        <ScrollReveal>
          <GcSchiene breit>
            {leistungen.karten.map((karte) => (
              <TiltKarte key={karte.titel} className="gc-reveal-teil">
                <div
                  className="flex h-full flex-col overflow-hidden rounded-[22px]"
                  style={{
                    background: "var(--gc-bg)",
                    boxShadow: "var(--gc-schatten-weich)",
                  }}
                >
                  <Bild
                    name={karte.bild}
                    className="aspect-[520/300] overflow-hidden"
                    groessen="(min-width: 1024px) 30vw, 100vw"
                  />
                  <div className="gc-karte-innen flex flex-1 flex-col gap-2.5 p-8 sm:gap-3.5">
                    <span
                      className="block h-0.5 w-9"
                      style={{ background: "var(--gc-gold)" }}
                    />
                    <h3
                      className="gc-h3 font-[family-name:var(--font-cormorant)] text-[1.6rem] font-medium"
                      style={{ color: "var(--gc-text)" }}
                    >
                      {karte.titel}
                    </h3>
                    <p
                      className="text-[0.95rem] sm:text-[1.05rem]"
                      style={{ color: "var(--gc-text-leise)" }}
                    >
                      {karte.text}
                    </p>
                  </div>
                </div>
              </TiltKarte>
            ))}
          </GcSchiene>
        </ScrollReveal>
      </div>
    </section>
  );
}
