/**
 * Inhalte NUR für die Golden-Calm-Startseite.
 *
 * Bewusst getrennt von lib/content/start.ts: Dies ist ein Stilexperiment
 * nach einem separaten Referenzdesign, mit eigener Bildsprache und eigenem
 * Aufbau (Konzept-Karten, Leistungs-Raster, Fakten-Tabelle). Die übrigen
 * Seiten und ihre Inhalte bleiben unverändert.
 */

export const person = {
  name: "Nora Heidenreich",
  titel: "Physiotherapeutin (B.Sc. NL) | M.A. (Health Administration)",
} as const;

export const hero = {
  /*
    Der Hinweis auf die Privatpraxis steht wieder oben - aber als stille
    Zeile, nicht mehr als umrandetes Abzeichen. Er muss dort stehen: Wer
    gesetzlich versichert ist, soll das vor dem Anruf erfahren und nicht erst
    im Vorgespraech. Als Pille war er ein Blickfang, als Zeile ist er eine
    Angabe - das ist die richtige Gewichtung.
  */
  /*
    Augenbraue und Ueberschrift teilen sich die Arbeit neu auf: Der Ort steht
    jetzt in der H1, nicht mehr in der Augenbraue. Fuer Suchmaschinen ist die
    H1 die wichtigste Zeile der Seite - eine H1 ohne Ortsangabe verschenkt
    genau die Suchanfrage, um die es geht ("Physiotherapie Hausbesuch Kreis
    Ahrweiler"). Die Augenbraue traegt dafuer die Abrechnungsart, die vorher
    dort nur angedeutet war.
  */
  augenbraue: "Privatpraxis · für Privatpatienten und Selbstzahler",
  titelZeilen: ["Mobile Physiotherapie", "im Kreis Ahrweiler"],
  text: "Behandlung in Ihren eigenen vier Wänden – ohne Anfahrt, ohne Wartezimmer, mit voller Aufmerksamkeit für jeden Termin.",
  /*
    Drei Merkmale unter dem Video. Bewusst alle drei nachpruefbar und ohne
    Wirkversprechen: Sie beschreiben, WIE gearbeitet wird, nicht was dabei
    herauskommt. Ein "schnellere Genesung" oder "spuerbare Linderung" waere
    hier ein Heilversprechen nach § 3 HWG - dieselbe Linie wie beim
    entfernten Minuten-Abzeichen.
  */
  merkmale: [
    {
      symbol: "zuhause",
      titel: "Behandlung zu Hause",
      text: "Ohne Anfahrt, ohne Wartezimmer",
    },
    {
      symbol: "neurologie",
      /* Weicher Trennstrich: In der 105 px schmalen Spalte der
         Merkmalsleiste passt "Neurologische" nicht in eine Zeile. Ohne
         Trennstelle riss der Browser stumpf nach dem vorletzten Buchstaben
         ("Neurologisch" / "e Erfahrung") - gemeldet von einem Android-Geraet.
         Mit dieser Stelle bricht es sauber als "Neuro-" / "logische". */
      titel: "Neuro­logische Erfahrung",
      text: "Aus der klinischen Praxis",
    },
    {
      symbol: "person",
      titel: "Eine feste Therapeutin",
      text: "Kein Wechsel zwischen Terminen",
    },
  ],
} as const;

export const konzept = {
  kicker: "Das Konzept",
  titel: "Therapie, die sich Ihrem Leben anpasst – nicht umgekehrt.",
  text: "Sie bleiben zu Hause. Ich bringe alles mit, was für die Behandlung nötig ist, und arbeite in der Umgebung, in der Sie sich ohnehin bewegen. Das macht Fortschritte im Alltag sofort sichtbar.",
  karten: [
    {
      nummer: "01",
      titel: "Komfort zu Hause",
      text: "Mobile Physiotherapie direkt bei Ihnen zu Hause: flexibel, individuell und ohne Stress. Ihre Behandlung passt sich Ihrem Alltag an, nicht umgekehrt.",
    },
    {
      nummer: "02",
      titel: "Zugewandte Betreuung",
      text: "Ein fester Ansprechpartner, volle Vertraulichkeit. Auf Wunsch mit Abstimmung im Familienkreis.",
    },
    {
      nummer: "03",
      titel: "Zeit und Kompetenz",
      text: "Jede Behandlung bekommt die Zeit, die sie braucht – und wird dokumentiert, sodass Ihr Verlauf nachvollziehbar bleibt. Schwerpunkt Neurologie, laufend durch Fortbildungen vertieft.",
    },
  ],
} as const;

export const leistungen = {
  kicker: "Leistungen",
  titel: "Ein Schwerpunkt, ein Behandlungsplan",
  text: "Jede Behandlung beginnt mit einem ausführlichen Befund. Daraus entsteht ein Plan, der zu Ihrem Befinden, Ihrem Tempo und Ihrer Wohnsituation passt.",
  karten: [
    {
      bild: "haende" as const,
      titel: "Neurologische Behandlung",
      text: "Nach Schlaganfall, bei Parkinson, Multipler Sklerose oder Polyneuropathie: Gang, Gleichgewicht, Feinmotorik und Sicherheit im Alltag.",
    },
    {
      bild: "behandlung" as const,
      titel: "Orthopädische Behandlungen",
      text: "Gezielte Mobilisation von Gelenken und Gewebe bei Beschwerden in Rücken, Schulter, Hüfte und Knie – auch in der postoperativen Nachsorge.",
    },
    {
      bild: "treppe" as const,
      titel: "Sturzprophylaxe",
      text: "Kraft, Gleichgewicht und Standfestigkeit – inklusive Blick auf Stolperstellen in der Wohnung und Übungen für die Woche.",
    },
    {
      bild: "lymphdrainage" as const,
      titel: "Lymphdrainage",
      text: "Sanfte Grifftechnik zur Anregung des Lymphabflusses bei Schwellungen nach Operationen und bei Lymphödemen, bei Bedarf mit Bandagierung.",
    },
    {
      bild: "kinesiotaping" as const,
      titel: "Kinesio Taping",
      text: "Elastisches Tape zur Entlastung von Muskeln und Gelenken – unterstützend bei Beschwerden und zur Stabilisierung im Alltag.",
    },
  ],
} as const;

export const ueberMich = {
  kicker: "Über mich",
  titel: "Nora Heidenreich",
  absaetze: [
    "Ich habe Physiotherapie in den Niederlanden studiert und viele Jahre in Universitätskliniken gearbeitet, überwiegend im neurologischen Bereich. Dort habe ich gemerkt, wie viel Behandlung an Anfahrt, Wartezeit und Zeitdruck verloren geht.",
    "Deshalb komme ich zu meinen Patientinnen und Patienten nach Hause – mit festen Terminen, ausreichend Zeit und einer bewusst kleinen Kartei. Angehörige binde ich auf Wunsch ein, damit Übungen auch zwischen den Terminen sicher stattfinden.",
  ],
  fakten: [
    /* "Studium", nicht "Ausbildung" - das ist im Heilberuf ein Unterschied
       mit Gewicht: Der Regelweg in die Physiotherapie ist in Deutschland
       eine schulische Ausbildung, ein abgeschlossenes Studium haben die
       wenigsten Mitbewerber. Dasselbe Wort steht aus demselben Grund im
       Impressum und auf der Seite "Ueber mich". */
    { label: "Studium", wert: "B.Sc. Physiotherapie, Niederlande" },
    { label: "Weiterbildung", wert: "M.A. Health Administration" },
    { label: "Schwerpunkt", wert: "Neurologische Rehabilitation" },
    { label: "Einsatzgebiet", wert: "Kreis Ahrweiler und Umgebung" },
  ],
} as const;

export const kontaktBand = {
  kicker: "Kontakt",
  titel: "Hausbesuch anfragen",
  text: "Schreiben Sie mir, oder rufen Sie an. Ich melde mich zeitnah zurück und wir klären in Ruhe, ob und wie ich helfen kann.",
  anrufLabel: "Direkt anrufen",
  sprechzeiten: "Sprechzeiten für Anfragen: Montag bis Freitag, 8 – 18 Uhr",
  formularTitel: "Lieber schreiben?",
  formularText: "Drei Angaben genügen – ich rufe zurück.",
  formularLink: "Ausführliches Formular mit Wunschzeit und Nachricht",
} as const;
