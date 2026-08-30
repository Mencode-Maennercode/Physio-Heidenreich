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
