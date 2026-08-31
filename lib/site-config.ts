/**
 * Zentrale Stellschrauben der Seite.
 *
 * Alles, was sich ohne Codeaenderung aendern koennen muss, steht hier - und nur
 * hier. Wer die Seite spaeter pflegt, muss keine Komponente anfassen.
 *
 * Mit PLATZHALTER markierte Werte muessen vor dem Livegang ersetzt werden.
 * `npm run build` bricht deswegen nicht ab; die Pruefliste in der README fuehrt
 * sie alle auf.
 */

export const seite = {
  name: "Nora Heidenreich",
  zusatz: "Mobile Physiotherapie",
  nameLang: "Nora Heidenreich – Mobile Physiotherapie",

  /** PLATZHALTER - endgueltige Domain steht noch nicht fest. */
  domain: "https://www.nora-heidenreich.de",

  claim: "Therapie findet dort statt, wo Sie leben.",

  /**
   * Beschreibung fuer Suchmaschinen und Vorschaukarten.
   *
   * Bewusst mit den Worten, die Menschen tatsaechlich eintippen -
   * "Physiotherapie Hausbesuch", der Landkreis, "Privatpatienten". Alles
   * daran ist wahr; es ist nur in der Reihenfolge formuliert, in der gesucht
   * wird, statt in der Reihenfolge, in der man sich selbst vorstellt.
   * Laenge unter 160 Zeichen, sonst schneidet Google ab.
   */
  kurzbeschreibung:
    "Physiotherapie im Hausbesuch für Privatpatienten und Selbstzahler im Kreis Ahrweiler – Krankengymnastik, Neurologie, Lymphdrainage. Termin: 02641 8904973.",

  /**
   * Titelzeile der Startseite.
   *
   * Die Leistung steht vorn, der Name hinten. Wer "Physiotherapie
   * Hausbesuch Ahrweiler" sucht, kennt den Namen noch nicht - er ist als
   * Suchwort wertlos und als erstes Wort im Titel verschenkter Platz.
   * Umgekehrt findet, wer den Namen kennt, die Seite ohnehin.
   */
  seoTitel:
    "Physiotherapie Hausbesuch Kreis Ahrweiler | Mobile Physiotherapie Nora Heidenreich",

  /** Suchworte, die zum Angebot passen - jedes davon nachpruefbar wahr. */
  schlagworte: [
    "Physiotherapie Hausbesuch",
    "mobile Physiotherapie",
    "Physiotherapie zu Hause",
    "Hausbesuch Physiotherapeutin",
    "Physiotherapie Kreis Ahrweiler",
    "Physiotherapie Bad Neuenahr-Ahrweiler",
    "Physiotherapie Sinzig",
    "Physiotherapie Remagen",
    "Physiotherapie Grafschaft",
    "Krankengymnastik zu Hause",
    "Physiotherapie Privatpatienten",
    "Physiotherapie Selbstzahler",
    "neurologische Physiotherapie",
    "Physiotherapie nach Schlaganfall",
    "Physiotherapie bei Parkinson",
    "Manuelle Lymphdrainage",
    "Sturzprophylaxe",
    "Physiotherapie für Senioren",
    "Physiotherapie Pflegeheim",
  ],
} as const;

export const kontakt = {
  /**
   * Festnetz steht ueberall an erster Stelle. Ein grosser Teil der Anfragen
   * kommt von aelteren Menschen, die eine Festnetznummer eher waehlen als eine
   * Mobilnummer.
   *
   * `telefonAnzeige` ist bewusst grosszuegig gruppiert: Vorwahl, dann Bloecke
   * zu drei bzw. zwei Ziffern. Wer die Nummer von einem Bildschirm abliest und
   * parallel auf einer Tastatur waehlt, verliert sich in einer ungetrennten
   * Ziffernkette - genau die Zielgruppe hier.
   *
   * `telefonLink` ist die maschinenlesbare Fassung fuer `tel:` und enthaelt
   * KEINE Trennzeichen. Fruehere Fassung hatte hier eine Ziffer zu viel
   * ("+4926419991235") - beim Antippen waere eine falsche Nummer gewaehlt
   * worden. Regel: fuehrende 0 weg, "+49" davor, sonst exakt die Ziffern
   * aus `telefon`.
   */
  telefon: "02641 8904973",
  telefonLink: "+4926418904973",
  telefonAnzeige: "02641 / 890 49 73",

  mobil: "0160 2205263",
  mobilLink: "+491602205263",
  mobilAnzeige: "0160 220 52 63",

  /**
   * SMS an die Mobilnummer. Ohne Vorbelegung des Textes - die Nachricht
   * schreibt der Absender selbst, das wirkt weniger nach Formular.
   *
   * Hier stand frueher ein WhatsApp-Absprung. Der ist bewusst entfallen:
   * WhatsApp gleicht das gesamte Adressbuch mit Meta-Servern ab und
   * uebertraegt damit Rufnummern Dritter, die dem nie zugestimmt haben - ein
   * eigenstaendiger Verstoss, unabhaengig davon, was im Chat steht. Dazu
   * fehlt fuer Gesundheitsdaten ein Auftragsverarbeitungsvertrag nach
   * Art. 28 DSGVO, und als Angehoerige eines Heilberufs gilt zusaetzlich
   * § 203 StGB.
   *
   * SMS loest genau das, ohne die niedrige Huerde aufzugeben: Es ist auf
   * jedem Geraet vorhanden, niemand muss etwas installieren, und es
   * unterliegt dem Fernmeldegeheimnis statt der Datenverarbeitung eines
   * Drittlandanbieters.
   */
  sms: "sms:+491602205263",

  email: "kontakt@nora-heidenreich.de",

  /**
   * Ladungsfaehige Anschrift fuer das Impressum.
   *
   * Ohne eigene Praxisraeume ist das die Wohnanschrift - § 5 DDG (frueher
   * TMG) verlangt eine Anschrift, unter der man tatsaechlich erreichbar ist;
   * ein Postfach genuegt ausdruecklich nicht. Bei mobilen Praxen ohne
   * Betriebsstaette laesst sich das nicht vermeiden. Die Adresse wird damit
   * oeffentlich.
   */
  anschrift: {
    strasse: "Josef-Martin-Weg 4",
    plz: "53501",
    ort: "Grafschaft",
  },

  erreichbarkeit: [
    { zeit: "Montag bis Freitag", detail: "8 – 18 Uhr" },
    { zeit: "Außerhalb dieser Zeiten", detail: "Anrufbeantworter, ich rufe zurück" },
  ],
} as const;

/**
 * Redaktionelle Statuszeile auf der Startseite.
 *
 * Ehrlich gepflegt erspart sie beiden Seiten aussichtslose Anfragen. `null`
 * blendet sie aus.
 */
export const terminstatus: { text: string; stand: string } | null = {
  text: "Aktuell nehme ich neue Patientinnen und Patienten auf.",
  stand: "Stand: August 2026",
};

/**
 * Hinweisstreifen auf der Startseite: aktuell freie Termine.
 *
 * `null` blendet ihn vollstaendig aus - dann steht er nicht einmal im HTML.
 *
 * Bewusst KEIN Popup und keine Einblendung, die sich ueber den Inhalt legt.
 * Ein Streifen, der beim Scrollen mitwandert und weggeklickt werden muss,
 * kostet bei genau dieser Zielgruppe Vertrauen - Angehoerige in einer
 * angespannten Lage haben keine Geduld fuer Werbeflaechen. Der Streifen
 * sitzt deshalb fest im Seitenfluss, direkt unter dem Hero: Er faellt beim
 * Weiterscrollen auf, laesst sich aber ignorieren und verdeckt nie etwas.
 *
 * `bisWann` ist eine Sicherung gegen die haeufigste Panne bei solchen
 * Hinweisen: Sie bleiben stehen, bis jemand sie bemerkt. Nach diesem Datum
 * verschwindet der Streifen von selbst - ein Datum in der Vergangenheit ist
 * schlechter als gar kein Hinweis.
 */
export const terminHinweis: {
  text: string;
  betonung: string;
  bisWann: string;
} | null = {
  text: "Wieder freie Termine ab",
  betonung: "1. Oktober 2026",
  /* ISO-Datum. Ab diesem Tag blendet sich der Streifen selbst aus. */
  bisWann: "2026-10-01",
};

/**
 * Schalter fuer den vorbereiteten Abschnitt "Behandlung ohne Rezept".
 *
 * Erst auf `true` stellen, wenn die sektorale Heilpraktikererlaubnis
 * (beschraenkt auf Physiotherapie) tatsaechlich vorliegt. Ohne Erlaubnis waere
 * die Bewerbung einer Behandlung ohne aerztliche Verordnung berufsrechtlich
 * angreifbar - der Abschnitt bleibt bis dahin komplett aus dem HTML.
 */
export const heilpraktikerErlaubnis = false;

/**
 * Reichweitenmessung und Suchmaschinen-Nachweis.
 *
 * `googleId` LEER lassen heisst: kein Analysedienst, kein Skript von Google,
 * kein Einwilligungsbanner - und die Datenschutzerklaerung sagt weiterhin
 * wahrheitsgemaess, dass nichts gemessen wird. Sobald hier eine Mess-ID
 * steht ("G-XXXXXXX"), erscheint das Banner, und Google Analytics laedt
 * ausschliesslich nach ausdruecklicher Zustimmung. Vorher wird nichts
 * geladen und nichts gespeichert - das verlangt § 25 TDDDG.
 *
 * `sucheNachweis` ist etwas voellig anderes und ausdruecklich unbedenklich:
 * ein reiner Bestaetigungscode fuer die Google Search Console. Er laedt kein
 * Skript, setzt nichts im Browser und braucht deshalb keine Einwilligung -
 * es ist nur eine Zeile im Kopf der Seite. Fuer die Sichtbarkeit bei Google
 * ist er das weit wichtigere Werkzeug von beiden.
 */
export const analyse = {
  /** PLATZHALTER - GA4-Mess-ID, Format "G-XXXXXXXXXX". Leer = aus. */
  googleId: "",
  /** PLATZHALTER - Bestaetigungscode aus der Google Search Console. */
  sucheNachweis: "",

  /**
   * Selbst gehostetes Matomo - anonyme Reichweitenmessung ohne Cookies.
   *
   * Anders als Google Analytics NICHT hinter dem Einwilligungsbanner: Ohne
   * Cookies und ohne Speicherung im Browser greift § 25 TDDDG nicht, es
   * braucht also keine Zustimmung. Rechtsgrundlage ist stattdessen das
   * berechtigte Interesse an der Verbesserung des Angebots (Art. 6 Abs. 1
   * lit. f DSGVO) - siehe components/Matomo.tsx und die
   * Datenschutzerklaerung.
   *
   * Beide Felder LEER lassen heisst: aus, kein Skript im HTML.
   */
  /** z. B. "https://stats.nora-heidenreich.de/" - mit Schraegstrich am Ende. */
  matomoUrl: "https://stats.nora-heidenreich.de/",
  /** Numerische Website-ID aus Matomo, meist "1" bei der ersten Seite dort. */
  matomoSiteId: "1",
} as const;

/** Praxisumfang - bewusst klein. Steuert die Formulierungen zur Kapazitaet. */
export const kapazitaet = {
  stundenProWoche: 8,
  hinweisKurz: "Begrenzte Zahl an Terminen",
} as const;

/**
 * Einsatzgebiet. Die Reihenfolge bestimmt auch die Reihenfolge auf der Karte.
 * `kern` = wird sicher gefahren, `rand` = auf Anfrage.
 */
/**
 * Vor dem ersten Patienten gibt es noch keine gefahrenen Routen - eine
 * Aufteilung in "feste" und "nur auf Anfrage" Orte waere deshalb erfunden,
 * nicht beobachtet. Eine Liste fuer den Kreis Ahrweiler (Ahrtal und
 * Rheinseite), Adenau separat: Das liegt im Hocheifel, spuerbar weiter weg
 * als der Rest - eine echte Distanzfrage, keine Prioritaet.
 */
export const einsatzgebiet = {
  kern: [
    "Altenahr",
    "Bad Neuenahr-Ahrweiler",
    "Heimersheim",
    "Grafschaft",
    "Bad Bodendorf",
    "Sinzig",
    "Remagen",
  ],
  /* Leer: Adenau, Niederzissen und Brohltal sind bewusst draussen. Sie
     liegen abseits der Ahrtal-Rhein-Achse; sie mitzunehmen haette Anfahrten
     bedeutet, die sich nicht in eine Route einfuegen. Bleibt die Liste leer,
     entfaellt der Abschnitt "Auf Anfrage" automatisch. */
  rand: [] as readonly string[],
  hinweis:
    "Termine vergebe ich entlang zusammenhängender Fahrtrouten. Deshalb frage ich beim ersten Telefonat immer zuerst nach Ihrem Wohnort.",
} as const;

export const navigation = [
  { name: "Start", pfad: "/" },
  { name: "Behandlung", pfad: "/behandlung/" },
  { name: "Über mich", pfad: "/ueber-mich/" },
  /* Kurz im Menue, ausfuehrlich auf der Seite: "Ablauf & Abrechnung" war
     mit Abstand der breiteste Eintrag und zwang die ganze Knopfgruppe in
     eine zweite Zeile. Die Ueberschrift der Seite nennt weiterhin beides. */
  { name: "Ablauf", pfad: "/ablauf/" },
  { name: "Kontakt", pfad: "/kontakt/" },
] as const;

export const rechtsnavigation = [
  { name: "Einfache Sprache", pfad: "/einfache-sprache/" },
  /* Im Fuss statt in der Hauptnavigation: Die englische Seite ist ein
     Angebot fuer wenige, kein gleichwertiger zweiter Auftritt. Auf schmalen
     Schirmen, wo die Sprachwahl im Kopf entfaellt, ist das der Weg dorthin. */
  { name: "English", pfad: "/en/" },
  { name: "Impressum", pfad: "/impressum/" },
  { name: "Datenschutz", pfad: "/datenschutz/" },
] as const;

/**
 * Akademische Grade - immer mit Fachrichtung.
 *
 * Ein "M.Sc." ohne Fachangabe auf einer Physiotherapie-Seite legt nahe, der
 * Master sei in Physiotherapie. Das faellt unter irrefuehrende Werbung
 * (§ 3 HWG, § 5 UWG) und ist im Heilberufsbereich ein bekannter Abmahnanlass.
 * Diese Konstante wird ueberall verwendet, damit die Fachangabe nirgends
 * verlorengehen kann.
 */
export const grade = {
  bachelor: "Bachelor of Science Physiotherapie (Niederlande)",
  master: "Master of Arts Health Administration",
  kurz: "B.Sc. Physiotherapie · M.A. Health Administration",
} as const;
