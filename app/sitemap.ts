import type { MetadataRoute } from "next";
import { navigation, rechtsnavigation, seite } from "@/lib/site-config";

/**
 * Erzeugt sitemap.xml beim Bauen.
 *
 * Die Bestaetigungsseite nach dem Formularversand fehlt hier bewusst - sie
 * traegt `robots: noindex` und hat ohne vorherige Anfrage keinen Sinn.
 */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const heute = new Date();

  return [...navigation, ...rechtsnavigation].map((eintrag) => ({
    url: `${seite.domain}${eintrag.pfad}`,
    lastModified: heute,
    changeFrequency: eintrag.pfad === "/" ? "monthly" : "yearly",
    priority: eintrag.pfad === "/" ? 1 : eintrag.pfad === "/ablauf/" ? 0.9 : 0.7,
  }));
}
