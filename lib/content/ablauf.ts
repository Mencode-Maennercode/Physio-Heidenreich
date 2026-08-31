/**
 * Texte des Reiters "Ablauf & Abrechnung" - das Kernstueck der Seite.
 *
 * Grundregel dieses Reiters: Es stehen keine Preise darauf, aber alles andere.
 * Wer hier durchliest, soll vor dem ersten Anruf wissen, was auf ihn zukommt -
 * einschliesslich der unbequemen Punkte.
 */

export const kopf = {
  augenbraue: "Ablauf & Abrechnung",
  titel: "Alles, was Sie vorher wissen sollten",
  text: "Wie die Kontaktaufnahme läuft, wie ein Termin zustande kommt, wer welche Rechnung bekommt und was Ihre Versicherung davon erstattet.",
} as const;

/** Vier Stationen, die sich beim Scrollen nacheinander zeichnen. */
export const stationen = [
  {
    nummer: "01",
    titel: "Sie melden sich",
    text: "Am liebsten telefonisch — dann ist vieles in fünf Minuten geklärt. SMS und das Formular gehen genauso.",
    details: [
      "Um wen geht es und was ist passiert?",
      "In welchem Ort wohnen Sie?",
      "Liegt eine ärztliche Verordnung vor?",
    ],
    hinweis:
      "Der Wohnort ist keine Nebensache: Ich fahre feste Routen, und daran entscheidet sich, ob ich einen Termin unterbringe.",
  },
  {
    nummer: "02",
    titel: "Vorgespräch am Telefon",
    text: "Etwa fünfzehn Minuten, kostenlos und unverbindlich. Danach wissen wir beide, ob es passt.",
    details: [
      "Was Sie brauchen und was ich leisten kann",
      "Ob eine Verordnung nötig ist und wer sie ausstellt",
      "Wie Ihre Versicherung damit umgeht",
      "Was die Behandlung kosten wird",
    ],
    hinweis:
      "Alles Besprochene bekommen Sie anschließend schriftlich — bevor irgendein Termin stattfindet.",
  },
  {
    nummer: "03",
    titel: "Der erste Termin bei Ihnen",
    text: "Befund, gemeinsame Zielsetzung, erste Behandlung. Und ein Blick auf die Wohnung.",
    details: [
      "Wo wird es im Alltag schwierig?",
      "Was soll in acht Wochen wieder gehen?",
      "Welche Stellen in der Wohnung sind unsicher?",
    ],
    hinweis:
      "Angehörige dürfen dabei sein. Meistens ist es sogar besser, wenn jemand mithört.",
  },
  {
    nummer: "04",
    titel: "Rechnung und Erstattung",
    text: "Nach Abschluss der verordneten Behandlungsserie, per Post oder E-Mail — mit allen Angaben, die Ihre Versicherung braucht. Bei länger laufender Begleitung stimmen wir das Intervall vorher ab.",
    details: [
      "Sie zahlen die Rechnung an mich",
      "Sie reichen sie bei Ihrer Versicherung ein",
      "Die Erstattung geht direkt an Sie",
    ],
    hinweis:
      "Auf der Rechnung steht nichts, was Sie nicht vorher kannten. Keine Positionen, über die wir nicht gesprochen haben.",
  },
] as const;

/**
 * Situations-Klaerer. Vier grosse Schaltflaechen, ein Klick zeigt den
 * jeweiligen Weg. Ohne Zahlen, aber mit klaren Ablaeufen - auch dort, wo die
 * Antwort unbequem ist.
 */
export const situationen = [
  {
    id: "privat",
    knopf: "Privat versichert",
    titel: "Sie sind privat krankenversichert",
    ablauf: [
      {
        marke: "Sie brauchen",
        text: "Eine ärztliche Verordnung — das Privatrezept Ihrer Ärztin oder Ihres Arztes.",
      },
      {
        marke: "Ich behandle",
        text: "Und stelle Ihnen anschließend die Rechnung. Nicht der Versicherung.",
      },
      {
        marke: "Sie zahlen",
        text: "Die Rechnung an mich und reichen sie bei Ihrer Versicherung ein.",
      },
      {
        marke: "Sie bekommen zurück",
        text: "Was Ihr Tarif für Heilmittel vorsieht. Das steht in Ihren Versicherungsbedingungen unter „Heilmittel“ oder „Physiotherapie“.",
      },
    ],
    achtung:
      "Hausbesuch und Wegegeld sind in den meisten Tarifen enthalten — aber nicht in allen. Rufen Sie im Zweifel vorher bei Ihrer Versicherung an. Ich sage Ihnen genau, was auf der Rechnung stehen wird, damit Sie gezielt fragen können.",
  },
  {
    id: "beihilfe",
    knopf: "Beihilfe",
    titel: "Sie sind beihilfeberechtigt",
    ablauf: [
      {
        marke: "Sie brauchen",
        text: "Ebenfalls eine ärztliche Verordnung.",
      },
      {
        marke: "Sie reichen zweimal ein",
        text: "Einmal bei Ihrer Beihilfestelle, einmal bei Ihrer privaten Restkostenversicherung.",
      },
      {
        marke: "Es gilt",
        text: "Die Beihilfeverordnung Ihres Landes beziehungsweise des Bundes. Für Hausbesuche gibt es darin eigene Regelungen.",
      },
    ],
    achtung:
      "Die Beihilfe erstattet Heilmittel nur bis zu festgelegten Höchstbeträgen. Was darüber liegt, bleibt bei Ihnen. Im Vorgespräch sage ich Ihnen, womit Sie rechnen müssen — ohne dass Sie es später auf der Rechnung entdecken.",
  },
  {
    id: "selbstzahler",
    knopf: "Selbstzahler",
    titel: "Sie zahlen selbst",
    ablauf: [
      {
        marke: "Ohne Verordnung möglich",
        text: "Vorbeugung, Training, Beratung und die Anleitung von Angehörigen — zum Beispiel Sturzprophylaxe oder ein Übungsprogramm für zu Hause.",
      },
      {
        marke: "Mit Verordnung nötig",
        text: "Sobald die Behandlung auf eine Erkrankung zielt. Das schreibt das Heilpraktikergesetz vor, und daran halte ich mich.",
      },
      {
        marke: "Sie zahlen",
        text: "Die Rechnung direkt und vollständig. Eine Erstattung gibt es in aller Regel nicht.",
      },
    ],
    achtung:
      "Diese Grenze wird oft übergangen. Ich mache das nicht — sie schützt am Ende Sie. Ob Ihr Anliegen in den einen oder den anderen Bereich fällt, klären wir im Vorgespräch offen.",
  },
  {
    id: "gesetzlich",
    knopf: "Gesetzlich versichert",
    titel: "Sie sind gesetzlich krankenversichert",
    ablauf: [
      {
        marke: "Ganz offen",
        text: "Ich rechne nicht mit den gesetzlichen Krankenkassen ab. Eine Kassenverordnung kann ich nicht annehmen.",
      },
      {
        marke: "Möglich bleibt",
        text: "Eine Behandlung als Selbstzahler. Dann gilt für Sie das, was links unter „Selbstzahler“ steht.",
      },
      {
        marke: "Wenn Sie eine Kassenleistung suchen",
        text: "Praxen mit Kassenzulassung, die Hausbesuche fahren, sind hier selten — es gibt sie aber. Rufen Sie mich an, ich nenne Ihnen welche.",
      },
    ],
    achtung:
      "Einige Kassen erstatten unter bestimmten Voraussetzungen auch Rechnungen von Privatpraxen (Kostenerstattung nach § 13 SGB V). Das muss vorher mit Ihrer Kasse geklärt sein und ist eher die Ausnahme. Verlassen Sie sich nicht darauf, ohne nachgefragt zu haben.",
  },
] as const;

/** Der Block für die, die tatsächlich anrufen: Angehörige. */
export const fuerAngehoerige = {
  augenbraue: "Wenn Sie für jemand anderen anfragen",
  titel: "Das betrifft die meisten, die hier lesen",
  bloecke: [
    {
      titel: "Wer entscheidet",
      text: "Solange Ihre Angehörige oder Ihr Angehöriger selbst entscheiden kann, entscheidet sie oder er. Sonst braucht es eine Vorsorgevollmacht oder eine rechtliche Betreuung mit dem Aufgabenkreis Gesundheitssorge. Bringen Sie das Dokument zum ersten Termin mit.",
    },
    {
      titel: "Zusammenarbeit mit anderen",
      text: "Mit Hausarzt, Pflegedienst und weiteren Beteiligten spreche ich gern direkt — das erspart Ihnen, alles doppelt zu erzählen. Dafür brauche ich eine Entbindung von der Schweigepflicht. Ein Satz auf Papier genügt, das Formular bringe ich mit.",
    },
    {
      titel: "Sie dürfen dabei sein",
      text: "Und oft ist es besser so. Wer täglich mit anpackt, lernt die Handgriffe am besten dort, wo sie gebraucht werden — beim Aufstehen aus genau diesem Sessel.",
    },
    {
      titel: "Vorbereiten müssen Sie fast nichts",
      text: "Ein Stuhl ohne Armlehnen, etwa zwei Meter freie Fläche, und wenn möglich ein Bett, an das ich von beiden Seiten herankomme. Geräte und Matte bringe ich mit.",
    },
  ],
} as const;

/** Druckbare Checkliste. Bekommt ein eigenes Drucklayout. */
export const checkliste = {
  augenbraue: "Zum ersten Termin",
  titel: "Was bereitliegen sollte",
  text: "Nichts davon ist zwingend. Aber je mehr davon da ist, desto weniger Zeit geht beim ersten Termin für Organisation drauf.",
  punkte: [
    "Ärztliche Verordnung, falls vorhanden",
    "Name der Krankenversicherung, bei Beihilfe zusätzlich die Beihilfestelle",
    "Aktuelle Arztbriefe oder der Entlassungsbrief aus der Klinik",
    "Eine Liste der Medikamente",
    "Vorhandene Hilfsmittel — Rollator, Gehstock, Bettgriff, Schienen",
    "Bei rechtlicher Betreuung: Betreuerausweis oder Vorsorgevollmacht",
    "Name und Telefonnummer der Person, die ich bei Rückfragen erreiche",
  ],
} as const;

export const zusagen = {
  augenbraue: "Was Sie von mir bekommen",
  titel: "Verbindlich, und zwar schriftlich",
  punkte: [
    {
      titel: "Schriftliches Angebot vor dem ersten Termin",
      text: "Mit Dauer, Preis und Anfahrt. Bevor Sie sich entscheiden müssen.",
    },
    {
      titel: "Feste Termine",
      text: "Möglichst immer am gleichen Wochentag zur gleichen Zeit. Das erleichtert die Planung auf beiden Seiten.",
    },
    {
      titel: "Rechnung mit allen Angaben",
      text: "So aufgebaut, dass Versicherung und Beihilfe sie ohne Rückfragen annehmen.",
    },
    {
      titel: "Absage bis 24 Stunden vorher",
      /* Weicher Trennstrich vor "verstaendlich" - derselbe Fall wie bei
         "Kranken­gymnastik" in lib/content/behandlung.ts: In der schmalen
         Handy-Kachel riss das Wort sonst "selbstverstaendlic" / "h". */
      text: "Kostenfrei. Bei einer akuten Verschlechterung selbst­verständlich auch kurzfristiger.",
    },
  ],
} as const;

export const keinePreisliste = {
  titel: "Warum hier keine Preisliste steht",
  absaetze: [
    "Weil eine Zahl ohne Zusammenhang nichts aussagt. Wie lange eine Behandlung dauert, wie oft sie nötig ist und wie weit ich fahre, ist bei jedem anders.",
    "Den Preis nenne ich Ihnen im kostenlosen Vorgespräch und danach noch einmal schriftlich — verbindlich, vollständig und bevor irgendein Termin stattfindet. Auf der Rechnung steht später nichts, was Sie vorher nicht kannten.",
  ],
} as const;

export const grenzen = {
  titel: "Was ich nicht anbiete",
  text: "Damit Sie nicht anrufen und dann hören, dass es nicht geht.",
  punkte: [
    "Keine Abrechnung über die gesetzliche Krankenkasse",
    "Keine Notfälle und keine Termine am Wochenende",
    "Keine kurzfristigen Einsätze — ich plane in festen Routen",
    "Keine Behandlung ohne vorheriges Telefongespräch",
    "Keine ärztliche Diagnostik — die bleibt bei Ihrer Ärztin oder Ihrem Arzt",
  ],
} as const;

/**
 * Vorbereiteter Abschnitt. Erscheint nur, wenn `heilpraktikerErlaubnis` in
 * site-config.ts auf true steht - bis dahin liegt er nicht einmal im HTML.
 */
export const ohneRezept = {
  augenbraue: "Direktzugang",
  titel: "Behandlung ohne ärztliche Verordnung",
  absaetze: [
    "Ich habe die auf die Physiotherapie beschränkte Heilpraktikererlaubnis. Sie können also direkt zu mir kommen, ohne vorher einen Arzttermin zu brauchen.",
    "Abgerechnet wird nach der Gebührenordnung für Heilpraktiker. Gesetzliche Krankenkassen übernehmen diese Leistungen nicht; private Versicherungen und Zusatztarife häufig ganz oder teilweise — das klären wir vorher.",
  ],
} as const;

export const fragen = {
  augenbraue: "Häufige Fragen",
  titel: "Was mich am häufigsten gefragt wird",
  liste: [
    {
      frage: "Brauche ich eine ärztliche Verordnung?",
      antwort:
        "Für eine Behandlung, die auf eine Erkrankung zielt: ja. Für Vorbeugung, Training und die Anleitung von Angehörigen: nein. Was auf Ihren Fall zutrifft, klären wir am Telefon.",
    },
    {
      frage: "Was kostet eine Behandlung?",
      antwort:
        "Das sage ich Ihnen im kostenlosen Vorgespräch und bestätige es schriftlich, bevor der erste Termin stattfindet. Eine pauschale Zahl wäre unehrlich, weil Dauer, Häufigkeit und Anfahrt sehr unterschiedlich sind.",
    },
    {
      frage: "Wie schnell bekomme ich einen Termin?",
      antwort:
        "Ich arbeite mit einer bewusst kleinen Zahl an Patientinnen und Patienten und fahre feste Routen. Wenn es in Ihrem Ort und zu Ihrer Zeit passt, geht es schnell — sonst kann es dauern. Ich sage Ihnen das ehrlich, statt Sie hinzuhalten.",
    },
    {
      frage: "Wie lange dauert ein Termin?",
      antwort:
        "In der Regel zwischen 30 und 60 Minuten, je nach Behandlung und Belastbarkeit. Der erste Termin dauert länger, weil Befund und Zielsetzung dazukommen.",
    },
    {
      frage: "Kommen Sie auch ins Pflegeheim oder in betreutes Wohnen?",
      antwort:
        "Ja, sofern die Einrichtung einverstanden ist. Die Absprache mit der Pflegedienstleitung übernehme ich gern.",
    },
    {
      frage: "Was passiert, wenn es meinem Vater am Termintag schlecht geht?",
      antwort:
        "Dann sagen Sie ab. Bis 24 Stunden vorher ist das ohnehin kostenfrei, bei einer akuten Verschlechterung auch kurzfristiger. Niemand soll behandelt werden, weil ein Termin im Kalender steht.",
    },
    {
      frage: "Muss ich Geräte oder eine Matte haben?",
      antwort:
        "Nein. Was ich brauche, bringe ich mit. Alles Weitere richten wir mit dem ein, was bei Ihnen ohnehin da ist — das ist der halbe Sinn der Sache.",
    },
    {
      frage: "Sprechen Sie mit meinem Hausarzt?",
      antwort:
        "Gern, wenn Sie mich von der Schweigepflicht entbinden. Rückmeldung an die verordnende Praxis gehört für mich zur Behandlung dazu.",
    },
    {
      frage: "Behandeln Sie auch Kinder?",
      antwort:
        "Mein Schwerpunkt sind Erwachsene. Bei Kindern verweise ich auf Kolleginnen und Kollegen mit entsprechender Weiterbildung.",
    },
  ],
} as const;
