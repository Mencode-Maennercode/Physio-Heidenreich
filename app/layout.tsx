import type { Metadata, Viewport } from "next";
import {
  Inter,
  Instrument_Serif,
  Cormorant_Garamond,
  Plus_Jakarta_Sans,
} from "next/font/google";
import "./globals.css";
import Kopfzeile from "@/components/Kopfzeile";
import Fusszeile from "@/components/Fusszeile";
import Lesefortschritt from "@/components/Lesefortschritt";
import Einwilligung from "@/components/Einwilligung";
import Matomo from "@/components/Matomo";
import StrukturDaten from "@/components/StrukturDaten";
import { EinstellungenProvider } from "@/components/a11y/Einstellungen";
import { analyse, seite } from "@/lib/site-config";

// next/font laedt die Schriften beim Build herunter und liefert sie von der
// eigenen Domain aus. Der Browser der Besucher spricht nie mit Google - genau
// deshalb braucht diese Seite keinen Cookie-Hinweis.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

// Nur fuer die Startseite (Golden-Calm-Stilexperiment) - die uebrigen Seiten
// bleiben bei Inter/Instrument Serif.
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

/**
 * Setzt `data-js` und die Barrierefreiheits-Einstellungen, bevor das erste
 * Bild aufgebaut wird.
 *
 * `data-js` ist die Bedingung fuer jeden Auftritt, der etwas VERBIRGT, um es
 * dann einzublenden (siehe `.gc-hero-teil` in globals.css). Ohne diese Marke
 * duerfte nichts per CSS versteckt werden: Bei abgeschaltetem JavaScript
 * bliebe es fuer immer unsichtbar. Das Setzen passiert ausserhalb des
 * try-Blocks, weil es - anders als der Zugriff auf den lokalen Speicher -
 * nicht fehlschlagen kann und auch im privaten Modus gelten muss.
 *
 * Der Rest: Ohne dieses Skript blitzt bei jedem Seitenaufruf kurz die normale
 * Darstellung auf, bevor React die gespeicherte Einstellung anwendet - fuer
 * jemanden, der die Schrift vergroessert hat, ist das jedes Mal ein Stolpern.
 *
 * Die Schluessel muessen mit SPEICHER in components/a11y/Einstellungen.tsx
 * uebereinstimmen.
 */
const vorabSkript = `(function(){var d=document.documentElement;d.dataset.js="1";
try{var s=localStorage;
var t=s.getItem("nh-textgroesse");if(t)d.dataset.textgroesse=t;
var k=s.getItem("nh-kontrast");if(k)d.dataset.kontrast=k;
var b=s.getItem("nh-bewegung");if(b)d.dataset.bewegung=b;}catch(e){}})();`;

export const metadata: Metadata = {
  metadataBase: new URL(seite.domain),
  title: {
    /*
      Die Leistung steht vorn, der Name hinten - siehe `seoTitel` in
      site-config. Die Vorlage fuer Unterseiten haengt zusaetzlich die Region
      an: "Behandlung · Nora Heidenreich" wuerde bei einer Ortssuche nichts
      hergeben, "Behandlung · Physiotherapie Hausbesuch Kreis Ahrweiler"
      schon.
    */
    default: seite.seoTitel,
    template: `%s · Physiotherapie Hausbesuch Kreis Ahrweiler`,
  },
  description: seite.kurzbeschreibung,
  keywords: [...seite.schlagworte],
  authors: [{ name: seite.name }],
  creator: seite.name,
  publisher: seite.name,
  /* hreflang: sagt Google, dass /en/ die englische Entsprechung ist - und
     nicht etwa doppelter Inhalt. Ohne diese Angabe koennen sich beide
     Fassungen gegenseitig verdraengen. */
  alternates: {
    canonical: "/",
    languages: { "de-DE": "/", en: "/en/" },
  },
  openGraph: {
    siteName: seite.nameLang,
    type: "website",
    locale: "de_DE",
    url: seite.domain,
    title: seite.seoTitel,
    description: seite.kurzbeschreibung,
  },
  twitter: {
    card: "summary_large_image",
    title: seite.seoTitel,
    description: seite.kurzbeschreibung,
  },
  /* Bestaetigungscode der Search Console. Leer = das Feld entfaellt. */
  verification: analyse.sucheNachweis
    ? { google: analyse.sucheNachweis }
    : undefined,
  /* Telefonnummern nicht automatisch verlinken lassen - iOS formatiert
     sonst auch Datumsangaben und Hausnummern zu Anruflinks um. */
  formatDetection: { telephone: false, address: false, email: false },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#1b3535",
  // Zoomen darf nie gesperrt werden - fuer einen Teil der Besucher ist es die
  // einzige Moeglichkeit, die Seite zu lesen.
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="de"
      className={`${inter.variable} ${instrument.variable} ${cormorant.variable} ${jakarta.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: vorabSkript }} />
        <StrukturDaten />
      </head>
      <body>
        <EinstellungenProvider>
          <a href="#inhalt" className="sprunglink">
            Direkt zum Inhalt
          </a>
          <Kopfzeile />
          <Lesefortschritt />
          {/* Abstand unten: Platz fuer die feste Anruf-Leiste auf kleinen
              Schirmen, damit sie nichts verdeckt. */}
          <main id="inhalt" className="pb-[4.5rem] sm:pb-0">
            {children}
          </main>
          <Fusszeile />
          {/* Matomo braucht - anders als Einwilligung/Google Analytics -
              keinen Banner, siehe Begruendung in der Komponente. Sie steht
              deshalb unabhaengig davon im Baum, nicht dahinter. */}
          <Matomo />
          <Einwilligung />
        </EinstellungenProvider>
      </body>
    </html>
  );
}
