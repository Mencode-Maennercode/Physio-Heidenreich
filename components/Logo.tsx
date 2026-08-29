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
      <span className="schrift-display text-[1.15rem] tracking-[0.06em] uppercase">
        {seite.name}
      </span>
      <span
        className={cn(
          "mt-1 text-[0.6rem] font-medium tracking-[0.24em] uppercase",
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
        "flex min-h-[2.75rem] items-center gap-3 transition-opacity hover:opacity-80",
        className,
      )}
      aria-label={`${seite.nameLang} — zur Startseite`}
    >
      <Bildmarke
        className={cn("size-9 flex-none", aufDunkel ? "text-akzent-dunkel" : "text-aktion")}
      />
      <Wortmarke aufDunkel={aufDunkel} />
    </Link>
  );
}
