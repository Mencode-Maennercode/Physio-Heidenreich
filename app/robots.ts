import type { MetadataRoute } from "next";
import { seite } from "@/lib/site-config";

export const dynamic = "force-static";

/**
 * robots.txt.
 *
 * Die KI-Sammler stehen hier ausdruecklich drin, obwohl `*` sie ohnehin
 * erlauben wuerde. Der Grund ist nicht technisch, sondern praktisch: Einige
 * Betreiber werten eine namentliche Erlaubnis als deutlicheres Signal, und
 * eine ausdrueckliche Zeile schuetzt davor, dass eine spaetere pauschale
 * Sperre sie versehentlich mit aussperrt. Fuer eine kleine Praxis ist es
 * heute ein echter Zugangsweg, in den Antworten von ChatGPT, Claude,
 * Perplexity und der KI-Uebersicht bei Google vorzukommen - wer dort nicht
 * auftaucht, existiert fuer einen wachsenden Teil der Suchenden nicht.
 *
 * `Google-Extended` steuert ausschliesslich, ob Inhalte fuer Googles
 * KI-Antworten genutzt werden duerfen - es hat KEINEN Einfluss auf das
 * normale Ranking und kann deshalb bedenkenlos erlaubt werden.
 */
const KI_SAMMLER = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "Bingbot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/kontakt/danke/"],
      },
      ...KI_SAMMLER.map((sammler) => ({
        userAgent: sammler,
        allow: "/",
        disallow: ["/kontakt/danke/"],
      })),
    ],
    sitemap: `${seite.domain}/sitemap.xml`,
    host: seite.domain,
  };
}
