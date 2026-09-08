import type { Metadata } from "next";
import Ortsseite from "@/components/Ortsseite";
import { ortNachSlug, ortsPfad } from "@/lib/content/orte";

/*
  Ortsseite. Inhalt steht in lib/content/orte.ts, Geruest in
  components/Ortsseite.tsx - hier nur die Adresse und die Kopfdaten.

  Bewusst eine eigene Datei je Ort statt einer dynamischen Route: Vier
  Ordner, die man im Verzeichnis sieht, sind fuer den, der die Seite spaeter
  pflegt, verstaendlicher als eine [slug]-Route mit generateStaticParams -
  und eine dynamische Route direkt in der Wurzel wuerde jede kuenftige
  statische Seite gleichen Namens verdecken.

  KEIN Eintrag in `alternates.languages`: Es gibt keine englische
  Entsprechung. Ein hreflang-Verweis auf eine Seite, die es nicht gibt,
  waere schlechter als keiner.
*/
const ort = ortNachSlug["bad-neuenahr-ahrweiler"];

export const metadata: Metadata = {
  title: {
    /* `absolute` umgeht die Vorlage aus dem Layout - die haengt
       "· Physiotherapie Hausbesuch Kreis Ahrweiler" an, was hier zu
       "... Sinzig · Physiotherapie Hausbesuch Kreis Ahrweiler" fuehren
       wuerde: doppelt gemoppelt und ueber der Laenge, die Google zeigt. */
    absolute: ort.seoTitel,
  },
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
