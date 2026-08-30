import type { MetadataRoute } from "next";
import { rechtsnavigation, seite } from "@/lib/site-config";
import { PAARE, UI } from "@/lib/sprache";

/**
 * Erzeugt sitemap.xml beim Bauen.
 *
 * Jede deutsche Seite traegt ihre englische Entsprechung als
 * `alternates.languages` bei sich - und umgekehrt. Google verlangt genau
 * das: Der hreflang-Verweis muss in BEIDE Richtungen zeigen, sonst wird er
 * ignoriert. Beides aus lib/sprache.ts, damit die Zuordnung nur an einer
 * Stelle gepflegt wird.
 *
 * Die Bestaetigungsseite nach dem Formularversand fehlt bewusst - sie traegt
 * `noindex` und hat ohne vorherige Anfrage keinen Sinn.
 */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const heute = new Date();

  const sprachpaar = (de: string, en: string) => ({
    languages: {
      "de-DE": `${seite.domain}${de}`,
      en: `${seite.domain}${en}`,
    },
  });

  /* Deutsche Seiten - die Hauptfassung, deshalb die hoeheren Werte. */
  const deutsch = UI.de.navigation.map((eintrag) => {
    const en = PAARE[eintrag.pfad];
    return {
      url: `${seite.domain}${eintrag.pfad}`,
      lastModified: heute,
      changeFrequency: (eintrag.pfad === "/" ? "monthly" : "yearly") as
        | "monthly"
        | "yearly",
      priority:
        eintrag.pfad === "/" ? 1 : eintrag.pfad === "/ablauf/" ? 0.9 : 0.8,
      ...(en ? { alternates: sprachpaar(eintrag.pfad, en) } : {}),
    };
  });

  /* Englische Seiten - vollwertig indexiert, aber nachrangig: Gesucht wird
     diese Praxis auf Deutsch. */
  const englisch = UI.en.navigation.map((eintrag) => {
    const de = Object.keys(PAARE).find((k) => PAARE[k] === eintrag.pfad);
    return {
      url: `${seite.domain}${eintrag.pfad}`,
      lastModified: heute,
      changeFrequency: "yearly" as const,
      priority: eintrag.pfad === "/en/" ? 0.7 : 0.5,
      ...(de ? { alternates: sprachpaar(de, eintrag.pfad) } : {}),
    };
  });

  /* Rechtstexte und einfache Sprache - nur auf Deutsch, ohne Sprachpaar. */
  const weitere = rechtsnavigation
    .filter((eintrag) => !eintrag.pfad.startsWith("/en"))
    .map((eintrag) => ({
      url: `${seite.domain}${eintrag.pfad}`,
      lastModified: heute,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    }));

  return [...deutsch, ...englisch, ...weitere];
}
