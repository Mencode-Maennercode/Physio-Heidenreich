import type { Metadata } from "next";
import Ortsseite from "@/components/Ortsseite";
import { ortNachSlug, ortsPfad } from "@/lib/content/orte";

/* Ortsseite. Inhalt in lib/content/orte.ts, Geruest in components/Ortsseite.tsx.
   Siehe app/physiotherapie-hausbesuch-sinzig/page.tsx fuer die volle Begruendung
   dieses Musters. */
const ort = ortNachSlug["altenahr"];

export const metadata: Metadata = {
  title: { absolute: ort.seoTitel },
  description: ort.beschreibung,
  alternates: { canonical: ortsPfad(ort.slug) },
  openGraph: {
    title: ort.seoTitel,
    description: ort.beschreibung,
    url: ortsPfad(ort.slug),
    type: "website",
    locale: "de_DE",
  },
};

export default function Seite() {
  return <Ortsseite ort={ort} />;
}
