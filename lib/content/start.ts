/**
 * Texte der Startseite.
 *
 * Getrennt vom Layout, damit sich Formulierungen aendern lassen, ohne eine
 * Komponente zu oeffnen. Wenn der neurologische Schwerpunkt spaeter geschaerft
 * werden soll, reicht es, hier die Reihenfolge und die Saetze anzupassen.
 */

export const heldenbereich = {
  augenbraue: "Hausbesuche im Kreis Ahrweiler",
  /** Bewusst in Zeilen zerlegt: der Titel wird zeilenweise eingeblendet. */
  titelZeilen: ["Therapie findet dort statt,", "wo Sie leben."],
  text: "Mobile Physiotherapie für Privatpatienten und Selbstzahler — mit Schwerpunkt in der Neurologie.",
} as const;

/**
 * "Für wen ich komme" - vier ruhige Karten.
 *
 * Neurologie steht an erster Stelle und bleibt trotzdem eine von vieren. Die
 * Seite soll niemanden abschrecken, der nur nach einer Hüft-Operation wieder
 * auf die Beine kommen will.
 */
export const fuerWen = {
  augenbraue: "Für wen ich komme",
  titel: "Wenn der Weg in eine Praxis zu weit geworden ist",
  karten: [
    {
      titel: "Nach einer neurologischen Erkrankung",
      text: "Schlaganfall, Parkinson, Multiple Sklerose, Polyneuropathie. Auch lange nach der Reha, wenn es darum geht, Erreichtes zu halten.",
    },
    {
      titel: "Nach Krankenhaus oder Operation",
      text: "Wenn die Anschlussheilbehandlung vorbei ist, der Alltag zu Hause aber noch nicht wieder trägt.",
    },
    {
      titel: "Bei chronischen Beschwerden",
      text: "Verläufe, die über längere Zeit begleitet werden müssen, statt in sechs Terminen abgeschlossen zu sein.",
    },
    {
      titel: "Wenn Wege beschwerlich werden",
      text: "Bei nachlassender Beweglichkeit, Schwindel oder Sturzangst — dann ist die eigene Wohnung der richtige Ort zum Üben.",
    },
  ],
} as const;

/** Kurzvorstellung auf der Startseite. Streift den Hintergrund, erklärt ihn
 *  aber nicht aus - das gehört auf "Über mich". */
export const kurzvorstellung = {
  augenbraue: "Wer zu Ihnen kommt",
  titel: "Nora Heidenreich",
  absaetze: [
    "Ich habe Physiotherapie in den Niederlanden studiert und viele Jahre in Universitätskliniken gearbeitet, überwiegend im neurologischen Bereich.",
    "Was ich dort gelernt habe, bringe ich jetzt dorthin, wo es gebraucht wird: in Ihr Zuhause. Ohne Wartezimmer, ohne Zeittakt, ohne wechselnde Behandler.",
  ],
  hinweis:
    "Ich arbeite ruhig und ich nehme mir Zeit. Beides lässt sich schwer bewerben — Sie merken es beim ersten Termin.",
  linkText: "Mehr über meinen Werdegang",
} as const;

/** Teaser auf den Transparenz-Reiter. */
export const ablaufTeaser = {
  augenbraue: "Ablauf & Abrechnung",
  titel: "Sie sollen vorher wissen, worauf Sie sich einlassen",
  text: "Wie die Kontaktaufnahme läuft, wie ein Termin zustande kommt, wer am Ende welche Rechnung bekommt und was Ihre Versicherung davon erstattet — alles offen aufgeschrieben, bevor Sie anrufen.",
  punkte: [
    "Kostenloses Vorgespräch am Telefon",
    "Schriftliches Angebot vor dem ersten Termin",
    "Rechnung mit allen Angaben zur Einreichung",
  ],
  linkText: "Ablauf und Abrechnung ansehen",
} as const;
