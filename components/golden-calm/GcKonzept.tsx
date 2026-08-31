"use client";

import TiltKarte from "./TiltKarte";
import WortAuftritt from "@/components/motion/WortAuftritt";
import ScrollReveal from "./ScrollReveal";
import { konzept as konzeptDe } from "@/lib/content/golden-calm";
import type { Konzept } from "@/lib/content/typen";

/*
  Der Inhalt kommt als Parameter herein, mit dem deutschen als Vorgabe.
  So rendert dieselbe Komponente die deutsche und die englische Seite -
  ohne Kopie und ohne dass die Gestaltung zweimal gepflegt werden muss.
  Bestehende Aufrufe ohne Parameter bleiben unveraendert deutsch.
*/
export default function GcKonzept({
  konzept = konzeptDe,
}: {
  konzept?: Konzept;
} = {}) {
  return (
    <section
      id="konzept"
      className="gc-anker mx-auto max-w-[1280px] px-[clamp(1.25rem,4vw,2.75rem)] pt-[clamp(2.5rem,10vw,6.5rem)]"
    >
      <div className="grid items-start gap-9 md:grid-cols-2 md:gap-20">
        <div>
          <p
            className="gc-kicker mb-3 text-[13px] tracking-[0.24em] uppercase sm:mb-[18px]"
            style={{ color: "#6E5940" }}
          >
            {konzept.kicker}
          </p>
          <WortAuftritt
            text={konzept.titel}
            className="mb-4 sm:mb-6 gc-h2 font-[family-name:var(--font-cormorant)] font-normal text-[clamp(2.1rem,3.8vw,3.1rem)] leading-[1.15]"
            style={{ color: "var(--gc-text)" }}
          />
          <p
            className="gc-lead max-w-[27em] text-[1.2rem]"
            style={{ color: "var(--gc-text-leise)" }}
          >
            {konzept.text}
          </p>
        </div>

        <ScrollReveal className="grid gap-3.5 sm:gap-5">
          {konzept.karten.map((karte) => (
            <TiltKarte key={karte.nummer} className="gc-reveal-teil">
              {/*
                Drei Kinder in einem Raster statt zwei ineinander
                geschachtelte Flexboxen - die Anordnung steckt in
                `.gc-konzept-karte` (globals.css) und unterscheidet sich
                nach Bildschirmbreite:

                Auf dem Desktop steht die Ziffer links neben dem ganzen
                Textblock. Auf dem Handy kostet diese Spalte 50 px von
                345 px - der Fliesstext bekam dadurch eine Spalte, in der
                jeder Satz vierzeilig umbrach. Dort steht die Ziffer
                deshalb nur noch neben der Ueberschrift, der Text laeuft
                darunter ueber die volle Breite.
              */}
              <div
                className="gc-karte-innen gc-konzept-karte rounded-[20px] border bg-white p-8"
                style={{
                  borderColor: "var(--gc-karte-rand)",
                  boxShadow: "var(--gc-schatten-weich)",
                }}
              >
                <span
                  className="grid size-9 flex-none place-items-center rounded-full border font-[family-name:var(--font-cormorant)] text-[1.05rem] sm:size-11 sm:text-[1.2rem]"
                  style={{ borderColor: "var(--gc-gold)", color: "#6E5940" }}
                >
                  {karte.nummer}
                </span>
                <h3
                  className="gc-h3 min-w-0 font-[family-name:var(--font-cormorant)] text-[1.7rem] font-medium"
                  style={{ color: "var(--gc-text)" }}
                >
                  {karte.titel}
                </h3>
                <p
                  className="min-w-0 text-[0.95rem] sm:text-[1.1rem]"
                  style={{ color: "var(--gc-text-leise)" }}
                >
                  {karte.text}
                </p>
              </div>
            </TiltKarte>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
