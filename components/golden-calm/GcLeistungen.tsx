"use client";

import Bild from "@/components/Bild";
import TiltKarte from "./TiltKarte";
import ScrollReveal from "./ScrollReveal";
import { leistungen } from "@/lib/content/golden-calm";

export default function GcLeistungen() {
  return (
    <section
      id="leistungen"
      className="gc-anker mt-[clamp(4rem,9vw,6.5rem)] py-[clamp(4.5rem,9vw,7rem)]"
      style={{ background: "var(--gc-bg-sekundaer)" }}
    >
      <div className="mx-auto max-w-[1280px] px-[clamp(1.25rem,4vw,2.75rem)]">
        <div className="mb-14 max-w-[40em]">
          <p
            className="mb-[18px] text-[13px] tracking-[0.24em] uppercase"
            style={{ color: "#6E5940" }}
          >
            {leistungen.kicker}
          </p>
          <h2
            className="mb-5 font-[family-name:var(--font-cormorant)] font-normal text-[clamp(2.1rem,3.8vw,3.1rem)] leading-[1.15]"
            style={{ color: "var(--gc-text)" }}
          >
            {leistungen.titel}
          </h2>
          <p className="text-[1.2rem]" style={{ color: "var(--gc-text-leise)" }}>
            {leistungen.text}
          </p>
        </div>

        {/* 5 Karten: 3 Spalten balancieren als 3+2 statt eine einzelne
            Karte allein in einer vierten Zeile stehen zu lassen. */}
        <ScrollReveal className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {leistungen.karten.map((karte) => (
            <TiltKarte key={karte.titel} className="gc-reveal-teil">
              <div
                className="flex h-full flex-col overflow-hidden rounded-[22px]"
                style={{ background: "var(--gc-bg)", boxShadow: "var(--gc-schatten-weich)" }}
              >
                <Bild
                  name={karte.bild}
                  className="aspect-[520/300] overflow-hidden"
                  groessen="(min-width: 1024px) 30vw, 100vw"
                />
                <div className="flex flex-1 flex-col gap-3.5 p-8">
                  <span className="block h-0.5 w-9" style={{ background: "var(--gc-gold)" }} />
                  <h3
                    className="font-[family-name:var(--font-cormorant)] text-[1.6rem] font-medium"
                    style={{ color: "var(--gc-text)" }}
                  >
                    {karte.titel}
                  </h3>
                  <p className="text-[1.05rem]" style={{ color: "var(--gc-text-leise)" }}>
                    {karte.text}
                  </p>
                </div>
              </div>
            </TiltKarte>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
