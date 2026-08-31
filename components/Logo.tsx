import Link from "next/link";
import { cn } from "@/lib/utils";
import { seite } from "@/lib/site-config";

/**
 * Bildmarke: zwei offene Boegen um denselben Mittelpunkt, unterschiedlich stark.
 *
 * Der aeussere Bogen traegt, der innere ist eine Haarlinie in Champagner - das
 * gleiche Prinzip wie im ganzen Design. Offen statt geschlossen, weil ein
 * geschlossener Kreis Stillstand bedeutet und diese Marke Bewegung meint.
 * Funktioniert bis 16 px herunter; unter 24 px traegt der aeussere Bogen allein.
 */
export function Bildmarke({
  className,
  ohneHaarlinie = false,
}: {
  className?: string;
  ohneHaarlinie?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={cn("size-10", className)}
    >
      <path
        d="M10.14 32 A16 16 0 0 1 37.86 16"
        stroke="currentColor"
        strokeWidth="2.75"
        strokeLinecap="round"
      />
      {ohneHaarlinie ? null : (
        <path
          d="M13.66 25.82 A10.5 10.5 0 0 1 29.25 14.91"
          stroke="var(--ui-akzent)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

/**
 * Wortmarke bewusst als HTML, nicht als SVG-Text: So gilt dieselbe Schrift wie
 * im Rest der Seite, der Name ist markierbar und Screenreader lesen ihn als
 * Text statt als Grafik.
 */
export function Wortmarke({
  className,
  aufDunkel = false,
}: {
  className?: string;
  aufDunkel?: boolean;
}) {
  return (
    <span className={cn("flex flex-col leading-none", className)}>
      {/*
        Auf dem Handy deutlich kleiner gesetzt - gerechnet, nicht geschaetzt.

        Die Kopfzeile hat dort 390 px. Davon gehen 41 px Innenabstand ab,
        166 px brauchen Barrierefreiheit, Sprache und Menue nebeneinander
        (drei Tippflaechen zu 44 px plus Abstaende - die sind nicht
        verhandelbar, siehe WCAG 2.5.5). Fuer die Marke bleiben damit
        174 px, Bildmarke und Abstand eingerechnet.

        Mit der Desktop-Groesse waren es 205 px, die Knopfgruppe brach in
        eine zweite Zeile um, und die feste Leiste wuchs auf 122 px - fast
        ein Siebtel des Bildschirms, dauerhaft. Gemessen mit
        scripts/messen.mjs.

        Bei vergroesserter Schrift wachsen alle Werte mit und die Zeile
        bricht dann doch um. Das ist gewollt: Dort ist Lesbarkeit wichtiger
        als eine kompakte Leiste.
      */}
      <span className="schrift-display text-[0.8rem] tracking-[0.04em] uppercase sm:text-[1.15rem] sm:tracking-[0.06em]">
        {seite.name}
      </span>
      <span
        className={cn(
          "mt-0.5 text-[0.45rem] font-medium tracking-[0.13em] uppercase sm:mt-1 sm:text-[0.6rem] sm:tracking-[0.24em]",
          aufDunkel ? "text-leise-dunkel" : "text-leise",
        )}
      >
        {seite.zusatz}
      </span>
    </span>
  );
}

export default function Logo({
  aufDunkel = false,
  className,
}: {
  aufDunkel?: boolean;
  className?: string;
}) {
  return (
    <Link
      href="/"
      className={cn(
        // Mindesthöhe, damit die Marke auch als Tippfläche taugt.
        "flex min-h-[2.75rem] items-center gap-2 transition-opacity hover:opacity-80 sm:gap-3",
        className,
      )}
      aria-label={`${seite.nameLang} — zur Startseite`}
    >
      <Bildmarke
        className={cn(
          "size-7 flex-none sm:size-9",
          aufDunkel ? "text-akzent-dunkel" : "text-aktion",
        )}
      />
      <Wortmarke aufDunkel={aufDunkel} />
    </Link>
  );
}
