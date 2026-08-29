"use client";

import TiltKarte from "./TiltKarte";
import ScrollReveal from "./ScrollReveal";
import { konzept } from "@/lib/content/golden-calm";

export default function GcKonzept() {
  return (
    <section
      id="konzept"
      className="gc-anker mx-auto max-w-[1280px] px-[clamp(1.25rem,4vw,2.75rem)] pt-[clamp(4rem,9vw,6.5rem)]"
    >
      <div className="grid items-start gap-14 md:grid-cols-2 md:gap-20">
        <div>
          <p
            className="mb-[18px] text-[13px] tracking-[0.24em] uppercase"
            style={{ color: "#6E5940" }}
          >
            {konzept.kicker}
          </p>
          <h2
            className="mb-6 font-[family-name:var(--font-cormorant)] font-normal text-[clamp(2.1rem,3.8vw,3.1rem)] leading-[1.15]"
            style={{ color: "var(--gc-text)" }}
          >
            {konzept.titel}
          </h2>
          <p
            className="max-w-[27em] text-[1.2rem]"
            style={{ color: "var(--gc-text-leise)" }}
          >
            {konzept.text}
          </p>
        </div>

        <ScrollReveal className="grid gap-5">
          {konzept.karten.map((karte) => (
            <TiltKarte key={karte.nummer} className="gc-reveal-teil">
              <div
                className="flex items-start gap-6 rounded-[20px] border bg-white p-8"
                style={{
                  borderColor: "var(--gc-karte-rand)",
                  boxShadow: "var(--gc-schatten-weich)",
                }}
              >
                <span
                  className="grid size-11 flex-none place-items-center rounded-full border font-[family-name:var(--font-cormorant)] text-[1.2rem]"
                  style={{ borderColor: "var(--gc-gold)", color: "#6E5940" }}
                >
                  {karte.nummer}
                </span>
                <div className="flex min-w-0 flex-col gap-2">
                  <h3
                    className="font-[family-name:var(--font-cormorant)] text-[1.7rem] font-medium"
                    style={{ color: "var(--gc-text)" }}
                  >
                    {karte.titel}
                  </h3>
                  <p className="text-[1.1rem]" style={{ color: "var(--gc-text-leise)" }}>
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
