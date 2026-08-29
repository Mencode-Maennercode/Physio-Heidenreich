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
import { EinstellungenProvider } from "@/components/a11y/Einstellungen";
import { seite } from "@/lib/site-config";

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
 * Setzt die Barrierefreiheits-Einstellungen, bevor das erste Bild aufgebaut
 * wird. Ohne dieses Skript blitzt bei jedem Seitenaufruf kurz die normale
 * Darstellung auf, bevor React die gespeicherte Einstellung anwendet - fuer
 * jemanden, der die Schrift vergroessert hat, ist das jedes Mal ein Stolpern.
 *
 * Die Schluessel muessen mit SPEICHER in components/a11y/Einstellungen.tsx
 * uebereinstimmen.
 */
const vorabSkript = `(function(){try{var d=document.documentElement,s=localStorage;
var t=s.getItem("nh-textgroesse");if(t)d.dataset.textgroesse=t;
var k=s.getItem("nh-kontrast");if(k)d.dataset.kontrast=k;
var b=s.getItem("nh-bewegung");if(b)d.dataset.bewegung=b;}catch(e){}})();`;

export const metadata: Metadata = {
  metadataBase: new URL(seite.domain),
  title: {
    default: `${seite.nameLang} · Kreis Ahrweiler`,
    template: `%s · ${seite.name}`,
  },
  description: seite.kurzbeschreibung,
  authors: [{ name: seite.name }],
  openGraph: {
    siteName: seite.nameLang,
    type: "website",
    locale: "de_DE",
    title: seite.nameLang,
    description: seite.kurzbeschreibung,
  },
  robots: { index: true, follow: true },
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
        </EinstellungenProvider>
      </body>
    </html>
  );
}
