/**
 * Texte der Seite "Über mich".
 *
 * Entwurf in Ich-Form, gedacht zum Ueberschreiben. Der Ton ist Absicht: ruhig,
 * ohne Ausrufezeichen, ohne Superlative. Ruhe laesst sich nicht behaupten -
 * ein Text kann nur ruhig geschrieben sein.
 *
 * Mit [...] markierte Stellen sind Platzhalter und sollen sichtbar bleiben,
 * bis die echten Angaben da sind.
 */

export const kopf = {
  augenbraue: "Über mich",
  titel: "Nora Heidenreich",
  untertitel: "Physiotherapeutin",
} as const;

export const einleitung = {
  absaetze: [
    "Ich bin Physiotherapeutin und fahre Hausbesuche im Kreis Ahrweiler. Vorher habe ich viele Jahre in Kliniken und Praxen gearbeitet — und mich dabei auf Menschen spezialisiert, deren Erkrankung chronisch ist. Das heißt: Sie geht nicht nach ein paar Wochen wieder vorbei, sondern bleibt Teil des Alltags.",
    "Diese Arbeit hat verändert, wie ich behandle. Ich denke nicht in Verordnungszeiträumen. Ich möchte Menschen in ihrem Alltag begleiten, dort, wo es für sie schwierig wird: Was muss morgen früh funktionieren? Was gelingt allein, was braucht Unterstützung? Wo im Flur ist die Stelle, an der es unsicher wird?",
  ],
} as const;

/**
 * Werdegang als stiller Zeitstrahl.
 *
 * Wachkoma, Palliativ und Hospiz stehen ausschliesslich hier - als Teil des
 * Werdegangs, sachlich in einer Zeile. Sie werden nirgends auf der Seite als
 * Leistung beworben.
 */
export const werdegang = {
  augenbraue: "Werdegang",
  titel: "Wo ich das gelernt habe",
  stationen: [
    {
      zeit: "2015",
      titel: "Studium Physiotherapie, Enschede (Niederlande)",
      text: "Bachelor of Science. Zusatzmodule zur Behandlung chronisch erkrankter Menschen; Bachelorarbeit in diesem Bereich.",
    },
    {
      zeit: "2015–2016",
      titel: "Franziskus-Hospital Münster, orthopädische Station",
      text: "Erste klinische Station nach dem Studium: Behandlung nach Operationen und bei orthopädischen Beschwerden.",
    },
    {
      zeit: "2016–2018",
      titel: "Universitätsklinikum Münster, neurologische Intensivstation",
      text: "Behandlung schwer betroffener Patientinnen und Patienten in der frühen Phase — dort, wo jede Bewegung erst wieder angebahnt werden muss.",
    },
    {
      zeit: "2019",
      titel: "Master of Arts Health Administration, Universität Bielefeld",
      text: "Masterarbeit über die Versorgung von Menschen mit schwerer Mehrfachbehinderung.",
    },
    {
      zeit: "2018–2026",
      titel: "Weitere klinische Stationen",
      text: "Verschiedene Praxen und andere Einrichtungen, unter anderem Wachkomastation, Palliativ- und Hospizarbeit sowie die Arbeit mit Menschen mit schwerer Mehrfachbehinderung.",
    },
    {
      zeit: "seit 2026",
      titel: "Eigene mobile Praxis",
      text: "Hausbesuche im Kreis Ahrweiler, für Privatpatienten und Selbstzahler.",
    },
  ],
} as const;

export const qualifikation = {
  augenbraue: "Qualifikation",
  titel: "Abschlüsse und Fortbildungen",
  /** Beide Grade immer mit Fachrichtung - siehe Kommentar in site-config.ts. */
  abschluesse: [
    {
      titel: "Bachelor of Science Physiotherapie",
      detail: "Studium in den Niederlanden – Schwerpunkt chronisch erkrankte Menschen",
    },
    {
      titel: "Master of Arts Health Administration",
      detail: "Masterarbeit über Menschen mit schwerer Mehrfachbehinderung",
    },
  ],
  /* Nicht mehr "mit neurologischem Schwerpunkt": Die Liste mischt jetzt
     allgemeine Techniken (Lymphdrainage, Triggerpunkt) mit neurologischen
     (PNF) - ein Titel, der nur Neurologie ankuendigt, wuerde den ersten
     Eintrag falsch einordnen.

     "Parkinson-Therapie" stand hier zuvor als eigener Punkt, fiel aber aus
     der Reihe: die uebrigen Eintraege sind Verfahren/Techniken, das war die
     einzige Diagnose in der Liste. Der Gedanke dahinter (laufende
     Weiterbildung, mit Schwerpunkt Neurologie) steht jetzt als Satz unter
     der Liste - siehe fortbildungenHinweis. */
  fortbildungenTitel: "Fortbildungen",
  fortbildungen: [
    "Manuelle Lymphdrainage",
    "Propriozeptive Neuromuskuläre Fazilitation (PNF) – neurologischer Schwerpunkt",
    "Triggerpunktbehandlung",
  ],
  fortbildungenHinweis:
    "Ich bilde mich fortlaufend weiter — mit einem Schwerpunkt in der Neurologie und darüber hinaus.",
  hinweis:
    "Ein Physiotherapie-Studium ist in Deutschland bis heute die Ausnahme — der Regelweg ist die Ausbildung. Ich nenne das nicht, um mich abzuheben, sondern weil es erklärt, warum ich anders an Befunde herangehe.",
} as const;

export const haltung = {
  augenbraue: "Haltung",
  titel: "Wie ich arbeite",
  absaetze: [
    "Ich plane meine Termine mit Zeitpuffer und bin zuverlässig zur Stelle — verschiebt sich doch einmal etwas, melde ich mich rechtzeitig. In der Behandlung selbst nehme ich mir die vereinbarte Zeit in Ruhe: kein Zeittakt, keine parallel laufenden Termine im Nebenraum.",
    "Ich erkläre, was ich tue und warum. Auch Angehörigen, auch mehrfach. Wer versteht, worauf eine Übung zielt, macht sie eher weiter, wenn ich wieder weg bin.",
    "Und ich sage es, wenn ich nicht die Richtige bin. Manchmal braucht es eine andere Fachrichtung, ein Hilfsmittel oder schlicht noch einmal den Arzt. Dann verweise ich weiter, statt Termine zu füllen.",
  ],
} as const;

export const warumHausbesuche = {
  augenbraue: "Warum Hausbesuche",
  titel: "Weil die Menschen, mit denen ich gearbeitet habe, nicht in eine Praxis kommen",
  absaetze: [
    "In der Klinik habe ich viele Patientinnen und Patienten entlassen — nach Hause, mit einer Verordnung in der Hand und dem Rat, sich eine Praxis zu suchen. Ein Teil von ihnen hat nie eine gefunden, die kommt.",
    "Genau diese Lücke schließe ich jetzt. Nicht als Notlösung, sondern weil die Behandlung zu Hause bei vielen Krankheitsbildern die bessere ist.",
  ],
} as const;
