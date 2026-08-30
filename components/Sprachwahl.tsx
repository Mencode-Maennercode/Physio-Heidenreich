"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { gegenstueck, spracheAus } from "@/lib/sprache";
import { cn } from "@/lib/utils";

/**
 * Umschalter zwischen der deutschen Seite und der englischen Fassung.
 *
 * Deutsch ist die Hauptsprache und bleibt es: Die Praxis arbeitet im Kreis
 * Ahrweiler, die Patientinnen und Patienten sprechen Deutsch. Englisch ist
 * ein Angebot fuer die wenigen, die es brauchen - nicht eine zweite,
 * gleichwertige Website.
 *
 * Das ist bewusst so gebaut, und der Grund ist die Sichtbarkeit bei Google:
 * Eine vollstaendig gespiegelte englische Seite verteilt dieselbe Bedeutung
 * auf zwei Adressen. Solange die englische Fassung nicht ebenso gepflegt und
 * ebenso stark verlinkt ist, schwaecht sie die deutsche, statt etwas
 * hinzuzugewinnen - und die deutsche ist die, die gefunden werden muss.
 *
 * Deshalb: eine sorgfaeltige englische Seite unter /en/, sauber ueber
 * hreflang verknuepft, statt sieben halbherziger Uebersetzungen.
 *
 * Gestaltung als zwei kurze Kuerzel statt eines Klappmenues: Bei zwei
 * Sprachen ist ein Menue ein Klick zu viel, und Flaggen waeren falsch -
 * Sprachen sind keine Laender.
 */
export default function Sprachwahl({ className }: { className?: string }) {
  const pfad = usePathname();
  const aufEnglisch = spracheAus(pfad) === "en";

  /* min-h-11 = 44 px: Beruehrflaechen duerfen nicht kleiner sein. Ohne die
     Angabe war der Knopf nur 33 px hoch - gemessen mit
     scripts/geraete.mjs. `inline-flex` statt Innenabstand, damit die Hoehe
     auch bei vergroesserter Schrift stimmt. */
  const knopf =
    "inline-flex min-h-11 items-center justify-center px-3 text-[0.78rem] tracking-[0.08em] uppercase transition-colors rounded-full min-w-[2.75rem] text-center";

  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      /* Vorlesesoftware soll das als das ansagen, was es ist. */
      role="group"
      aria-label="Sprache wählen"
    >
      <Link
        href={gegenstueck(pfad, "de")}
        hrefLang="de"
        aria-current={aufEnglisch ? undefined : "true"}
        className={cn(
          knopf,
          aufEnglisch
            ? "text-leise hover:text-aktion"
            : "bg-grund-warm font-medium text-aktion",
        )}
      >
        DE
      </Link>
      <Link
        href={gegenstueck(pfad, "en")}
        hrefLang="en"
        aria-current={aufEnglisch ? "true" : undefined}
        className={cn(
          knopf,
          aufEnglisch
            ? "bg-grund-warm font-medium text-aktion"
            : "text-leise hover:text-aktion",
        )}
      >
        EN
      </Link>
    </div>
  );
}
