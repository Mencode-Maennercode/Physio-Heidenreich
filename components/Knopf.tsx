import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Ein Knopf, drei Auspraegungen. Mehr braucht die Seite nicht.
 *
 * Mindesthoehe 3rem: bei Grundgroesse 18 px sind das 54 px - deutlich ueber den
 * 44 px, die als kleinste sichere Tippflaeche gelten. Die Zielgruppe zielt
 * nicht immer genau.
 */

type Art = "voll" | "linie" | "still";

const arten: Record<Art, string> = {
  voll: "bg-aktion text-[color:var(--marke-offwhite)] hover:bg-aktion-hover",
  linie:
    "border border-linie text-text hover:border-aktion hover:bg-grund-warm",
  still: "text-aktion underline decoration-linie underline-offset-[6px] hover:decoration-aktion",
};

const artenAufDunkel: Record<Art, string> = {
  voll: "bg-[color:var(--marke-offwhite)] text-[color:var(--marke-tief)] hover:bg-akzent-dunkel",
  linie:
    "border border-linie-dunkel text-auf-dunkel hover:border-akzent-dunkel hover:bg-white/5",
  still:
    "text-akzent-dunkel underline decoration-linie-dunkel underline-offset-[6px] hover:decoration-akzent-dunkel",
};

const grundstil =
  "inline-flex min-h-[3rem] items-center justify-center gap-2.5 rounded-full px-6 text-[0.95rem] font-medium transition-colors duration-200";

export function knopfStil(art: Art = "voll", aufDunkel = false) {
  const tabelle = aufDunkel ? artenAufDunkel : arten;
  return cn(
    art === "still"
      ? "inline-flex min-h-[2.75rem] items-center gap-2 font-medium"
      : grundstil,
    tabelle[art],
  );
}

export default function Knopf({
  href,
  kind,
  art = "voll",
  aufDunkel = false,
  className,
  ...rest
}: {
  href: string;
  kind: React.ReactNode;
  art?: Art;
  aufDunkel?: boolean;
  className?: string;
} & Omit<React.ComponentProps<typeof Link>, "href" | "children" | "className">) {
  const extern = href.startsWith("http") || href.startsWith("tel:");

  if (extern) {
    return (
      <a
        href={href}
        className={cn(knopfStil(art, aufDunkel), className)}
        {...(href.startsWith("http")
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {kind}
      </a>
    );
  }

  return (
    <Link href={href} className={cn(knopfStil(art, aufDunkel), className)} {...rest}>
      {kind}
    </Link>
  );
}
