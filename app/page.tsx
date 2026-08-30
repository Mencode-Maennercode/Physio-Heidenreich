import GcHero from "@/components/golden-calm/GcHero";
import GcKonzept from "@/components/golden-calm/GcKonzept";
import GcLeistungen from "@/components/golden-calm/GcLeistungen";
import GcUeberMich from "@/components/golden-calm/GcUeberMich";
import GcKontakt from "@/components/golden-calm/GcKontakt";
import TerminHinweis from "@/components/TerminHinweis";

/**
 * Startseite — Stilexperiment "Golden Calm".
 *
 * Bewusst getrennt vom Rest der Seite: eigene Farb-Tokens (--gc-*, siehe
 * app/globals.css), eigene Schriften (Cormorant Garamond + Plus Jakarta
 * Sans, siehe app/layout.tsx), eigene Inhalte (lib/content/golden-calm.ts).
 * Kopf- und Fusszeile bleiben die gepruefte, funktionale Version der
 * uebrigen Seiten - Telefon-Prioritaet, Barrierefreiheits-Panel und
 * mobiles Menue sind zu wertvoll, um sie fuer ein Stilexperiment zu
 * riskieren.
 *
 * Bewegung: Framer Motion (motion) fuer Interaktion (Magnet-Knoepfe,
 * Karten-Neigung, Zahl-Zaehler), GSAP + ScrollTrigger fuer scroll-gekoppelte
 * Choreografie (Parallax, gestaffeltes Einblenden). Beide respektieren
 * useRuhig() - bei "weniger Bewegung" laeuft nichts von alldem, die Seite
 * steht sofort in ihrer Ruhefassung da.
 */
export default function Startseite() {
  return (
    <div
      data-gc
      className="font-[family-name:var(--font-jakarta)] text-[1.05rem] leading-[1.7]"
      style={{ background: "var(--gc-bg)", color: "var(--gc-text)" }}
    >
      <GcHero />
      {/* Direkt unter dem Hero: faellt beim ersten Weiterscrollen auf,
          verdeckt aber nie etwas. Siehe Begruendung in der Komponente. */}
      <TerminHinweis />
      <GcKonzept />
      <GcLeistungen />
      <GcUeberMich />
      <GcKontakt />
    </div>
  );
}
