import type { Metadata } from "next";
import GcHero from "@/components/golden-calm/GcHero";
import GcKonzept from "@/components/golden-calm/GcKonzept";
import GcLeistungen from "@/components/golden-calm/GcLeistungen";
import GcUeberMich from "@/components/golden-calm/GcUeberMich";
import GcKontakt from "@/components/golden-calm/GcKontakt";
import {
  hero,
  konzept,
  kontaktBand,
  leistungen,
  person,
  ueberMich,
} from "@/lib/content/en/start";

export const metadata: Metadata = {
  title: {
    absolute:
      "Physiotherapy Home Visits – Ahrweiler District | Nora Heidenreich",
  },
  description:
    "Physiotherapy at home for privately insured patients and self-payers in the Ahrweiler district – exercise therapy, neurology, lymphatic drainage. English spoken.",
  alternates: {
    canonical: "/en/",
    languages: { "de-DE": "/", en: "/en/" },
  },
  openGraph: {
    locale: "en_GB",
    title: "Physiotherapy Home Visits – Ahrweiler District",
    description:
      "Physiotherapy at home for privately insured patients and self-payers in the Ahrweiler district.",
  },
};

/**
 * Englische Startseite.
 *
 * Dieselben Bausteine wie die deutsche Startseite, nur mit englischem
 * Inhalt. Kein Nachbau: Aendert sich die Gestaltung, aendert sie sich in
 * beiden Sprachen gleichzeitig. Genau dafuer nehmen die Gc-Bausteine ihren
 * Inhalt seit dem Sprachumbau als Parameter entgegen.
 *
 * `lang="en"` sitzt am Rahmen, damit Vorlesesoftware nicht versucht,
 * englischen Text deutsch auszusprechen. Ohne die Angabe ist die Seite fuer
 * blinde Nutzer praktisch unbrauchbar.
 */
export default function EnglishHome() {
  return (
    <div
      lang="en"
      data-gc
      className="font-[family-name:var(--font-jakarta)] text-[1.05rem] leading-[1.7]"
      style={{ background: "var(--gc-bg)", color: "var(--gc-text)" }}
    >
      <GcHero hero={hero} person={person} />
      <GcKonzept konzept={konzept} />
      <GcLeistungen leistungen={leistungen} />
      <GcUeberMich person={person} ueberMich={ueberMich} />
      <GcKontakt kontaktBand={kontaktBand} formular={false} />
    </div>
  );
}
