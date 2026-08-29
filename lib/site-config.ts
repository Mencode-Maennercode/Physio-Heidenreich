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
  kurzbeschreibung:
    "Mobile Physiotherapie im Kreis Ahrweiler. Hausbesuche für Privatpatienten und Selbstzahler, mit Schwerpunkt in der Neurologie.",
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

  mobil: "0171 3900123",
  mobilLink: "+491713900123",
  mobilAnzeige: "0171 390 01 23",

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
  sms: "sms:+491713900123",

  /** PLATZHALTER */
  email: "kontakt@nora-heidenreich.de",

  /** PLATZHALTER - vollstaendige Anschrift fuer das Impressum. */
  anschrift: {
    strasse: "Musterstraße 00",
    plz: "53474",
    ort: "Bad Neuenahr-Ahrweiler",
  },

  erreichbarkeit: [
    { zeit: "Montag bis Freitag", detail: "8 – 9 Uhr und 17 – 19 Uhr" },
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
 * Schalter fuer den vorbereiteten Abschnitt "Behandlung ohne Rezept".
 *
 * Erst auf `true` stellen, wenn die sektorale Heilpraktikererlaubnis
 * (beschraenkt auf Physiotherapie) tatsaechlich vorliegt. Ohne Erlaubnis waere
 * die Bewerbung einer Behandlung ohne aerztliche Verordnung berufsrechtlich
 * angreifbar - der Abschnitt bleibt bis dahin komplett aus dem HTML.
 */
export const heilpraktikerErlaubnis = false;

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
    "Niederzissen",
    "Brohltal",
  ],
  rand: ["Adenau"],
  hinweis:
    "Termine vergebe ich entlang zusammenhängender Fahrtrouten. Deshalb frage ich beim ersten Telefonat immer zuerst nach Ihrem Wohnort.",
} as const;

export const navigation = [
  { name: "Start", pfad: "/" },
  { name: "Behandlung", pfad: "/behandlung/" },
  { name: "Über mich", pfad: "/ueber-mich/" },
  { name: "Ablauf & Abrechnung", pfad: "/ablauf/" },
  { name: "Kontakt", pfad: "/kontakt/" },
] as const;

export const rechtsnavigation = [
  { name: "Einfache Sprache", pfad: "/einfache-sprache/" },
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
