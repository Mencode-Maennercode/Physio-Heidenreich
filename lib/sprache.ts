/**
 * Sprachen der Seite und die Zuordnung ihrer Adressen.
 *
 * Deutsch ist die Hauptsprache und liegt im Wurzelverzeichnis, Englisch
 * unter /en/. Das ist bewusst so herum: Die Praxis arbeitet im Kreis
 * Ahrweiler, die deutsche Fassung muss gefunden werden. Waeren beide
 * Sprachen in Unterordnern (/de/ und /en/), muesste die Startadresse
 * weiterleiten - eine Weiterleitung, die jeder Besucher und jede
 * Suchmaschine zusaetzlich durchlaufen muss.
 *
 * `PAARE` ist die einzige Stelle, an der steht, welche Seite welcher
 * entspricht. Der Sprachumschalter und die hreflang-Angaben lesen beide von
 * hier - so koennen sie nicht auseinanderlaufen.
 */

export type Sprache = "de" | "en";

/** Deutsche Adresse -> englische Adresse. */
export const PAARE: Record<string, string> = {
  "/": "/en/",
  "/behandlung/": "/en/treatments/",
  "/ueber-mich/": "/en/about/",
  "/ablauf/": "/en/how-it-works/",
  "/kontakt/": "/en/contact/",
};

/** Englische Adresse -> deutsche Adresse. */
export const PAARE_RUECK: Record<string, string> = Object.fromEntries(
  Object.entries(PAARE).map(([de, en]) => [en, de]),
);

/** Sprache aus der aktuellen Adresse ableiten. */
export function spracheAus(pfad: string): Sprache {
  return pfad.startsWith("/en") ? "en" : "de";
}

/**
 * Die Entsprechung derselben Seite in der anderen Sprache.
 *
 * Faellt auf die jeweilige Startseite zurueck, wenn es keine Entsprechung
 * gibt - etwa bei Impressum und Datenschutz, die nur auf Deutsch existieren.
 * Ein Umschalter, der auf eine Fehlerseite fuehrt, waere schlimmer als einer,
 * der zur Startseite fuehrt.
 */
export function gegenstueck(pfad: string, ziel: Sprache): string {
  const sauber = pfad.endsWith("/") ? pfad : `${pfad}/`;
  if (ziel === "en") return PAARE[sauber] ?? "/en/";
  return PAARE_RUECK[sauber] ?? "/";
}

/**
 * canonical- und hreflang-Angaben fuer eine Seite.
 *
 * Warum das eine Funktion ist und nicht je Seite von Hand steht: Im
 * Wurzel-Layout stand einmal `alternates: { canonical: "/", languages: ... }`
 * als Vorgabe fuer alle Seiten. Jede Seite, die das nicht ueberschrieb, hat
 * damit BEHAUPTET, sie sei die Startseite - /impressum/, /datenschutz/ und
 * /kontakt/danke/ trugen `<link rel="canonical" href="/">`. Gleichzeitig
 * standen /impressum/ und /datenschutz/ in der sitemap.xml. Google bekam
 * also zwei sich widersprechende Ansagen und indexiert solche Seiten dann
 * gar nicht eigenstaendig.
 *
 * Ein vergessener Aufruf hier fuehrt zu einer FEHLENDEN Angabe - dann nimmt
 * Google schlicht die Adresse der Seite selbst, was richtig ist. Das ist der
 * Unterschied zu vorher: falsch war die Vorgabe, nicht ihr Fehlen.
 *
 * `x-default` ist die Fassung fuer alle Sprachen, fuer die es nichts
 * Passendes gibt - also Deutsch. Ohne diese Angabe bekaeme etwa jemand mit
 * oesterreichischer Spracheinstellung (de-AT trifft de-DE nicht exakt) kein
 * eindeutiges Ziel zugewiesen.
 */
export function sprachAlternativen(pfad: string) {
  const de = pfad.startsWith("/en") ? PAARE_RUECK[pfad] : pfad;
  const en = de ? PAARE[de] : undefined;

  /* Seite ohne Gegenstueck in der anderen Sprache - Impressum,
     Datenschutz, die Ortsseiten. Ein hreflang-Verweis auf eine Seite, die
     es nicht gibt, ist schlechter als keiner: Google verlangt, dass beide
     Seiten aufeinander zeigen, und verwirft den ganzen Verbund, wenn eine
     Richtung fehlt. */
  if (!de || !en) return { canonical: pfad };

  return {
    canonical: pfad,
    languages: { "de-DE": de, en, "x-default": de },
  };
}

/** Beschriftungen der Oberflaeche ausserhalb der Seiteninhalte. */
export const UI = {
  de: {
    menue: "Hauptmenü",
    menueOeffnen: "Menü öffnen",
    menueSchliessen: "Menü schließen",
    anrufen: "Anrufen",
    sprachwahl: "Sprache wählen",
    zumInhalt: "Direkt zum Inhalt",
    navigation: [
      { name: "Start", pfad: "/" },
      { name: "Behandlung", pfad: "/behandlung/" },
      { name: "Über mich", pfad: "/ueber-mich/" },
      { name: "Ablauf", pfad: "/ablauf/" },
      { name: "Kontakt", pfad: "/kontakt/" },
    ],
  },
  en: {
    menue: "Main menu",
    menueOeffnen: "Open menu",
    menueSchliessen: "Close menu",
    anrufen: "Call",
    sprachwahl: "Choose language",
    zumInhalt: "Skip to content",
    navigation: [
      { name: "Home", pfad: "/en/" },
      { name: "Treatments", pfad: "/en/treatments/" },
      { name: "About me", pfad: "/en/about/" },
      { name: "How it works", pfad: "/en/how-it-works/" },
      { name: "Contact", pfad: "/en/contact/" },
    ],
  },
} as const;
