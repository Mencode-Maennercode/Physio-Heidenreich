/**
 * Inhalte der Ortsseiten.
 *
 * Warum es diese Seiten gibt: Gesucht wird nicht "Kreis Ahrweiler", gesucht
 * wird "physiotherapie hausbesuch ahrweiler". Die Startseite antwortet auf
 * die Region, nicht auf den Ort - und verliert deshalb gegen Seiten, deren
 * Adresse und Ueberschrift genau den gesuchten Ortsnamen tragen.
 *
 * Was hier stehen darf - und was nicht:
 *
 * Hier stehen ausschliesslich Angaben, die jemand VOR dem Anruf wirklich
 * braucht: Fahre ich ueberhaupt in mein Dorf? Wie lange ist die Anfahrt?
 * Wie wird der Termin geplant? Genau diese Fakten unterscheiden sich echt
 * von Ort zu Ort - sie sind damit zugleich der Grund, warum Google die
 * Seiten als eigenstaendig wertet und nicht als Doorway Pages.
 *
 * Hier stand frueher deutlich mehr: Absaetze ueber Ahrflut, Weinsteillagen
 * und mittelalterliche Gassen. Das ist bewusst entfernt worden. Solcher
 * Text liest sich als "fuer die Suchmaschine geschrieben", ohne einem
 * Patienten eine einzige Frage zu beantworten - und genau das ist das
 * Kriterium, an dem Google (und jeder menschliche Quality Rater) eine Seite
 * abwertet. Wer hier etwas ergaenzt, prueft zuerst: Wuerde jemand das vor
 * dem Anruf wissen wollen? Wenn nein, gehoert es nicht hierher.
 *
 * Keine Aussagen ueber Patienten, keine Aussagen ueber Behandlungserfolge:
 * Erfolgsgeschichten und Heilversprechen sind nach § 3 HWG und § 11 HWG
 * unzulaessig, gerade auf Seiten, die auf Reichweite zielen.
 */

export type Ortsseite = {
  /** Letzter Teil der Adresse: /physiotherapie-hausbesuch-<slug>/ */
  readonly slug: string;
  /** Ortsname, genau so wie er amtlich geschrieben wird. */
  readonly name: string;
  /**
   * Ortsname mit Praeposition und Artikel, fuer Fliesstext-Ueberschriften.
   * Eigenes Feld statt `"in " + name`: Die Grafschaft traegt einen Artikel
   * ("in DER Grafschaft"), die uebrigen Orte nicht. Zusammengesetzt waere
   * jede Ueberschrift dort falsch.
   */
  readonly imOrt: string;
  /** Titelzeile fuer die Suchergebnisse. Ort vorn, Leistung dahinter. */
  readonly seoTitel: string;
  /** Beschreibung fuer das Suchergebnis. Unter 160 Zeichen. */
  readonly beschreibung: string;
  /** Ueberschrift der Seite - die einzige Zeile, die den Ort im Hero nennt. */
  readonly h1: string;
  /** Fahrzeit von Grafschaft aus - ehrlich, nicht beschoenigt. */
  readonly anfahrt: string;
  /** Ortsteile, in denen Hausbesuche stattfinden. */
  readonly ortsteile: readonly string[];
  /** Einschraenkungen zur Ortsteilliste - was wann realistisch geht. */
  readonly ortsteileText: string;
};

export const ortsseiten: readonly Ortsseite[] = [
  /* ------------------------------------------------------------------
     Bad Neuenahr-Ahrweiler - die Kreisstadt und der wichtigste Ort.
     ------------------------------------------------------------------ */
  {
    slug: "bad-neuenahr-ahrweiler",
    name: "Bad Neuenahr-Ahrweiler",
    imOrt: "in Bad Neuenahr-Ahrweiler",
    /* "Ahrweiler" bewusst zusaetzlich im Titel und in der Beschreibung,
       nicht nur im Namen "Bad Neuenahr-Ahrweiler" versteckt: Ahrweiler war
       bis zur Gebietsreform 1969 eine eigenstaendige Stadt und wird bis
       heute oft allein gesucht, obwohl es verwaltungsrechtlich nur noch ein
       Stadtteil ist. EINE Seite fuer beide Suchbegriffe statt einer
       zweiten, fast identischen Seite - zwei Seiten fuer dieselbe Absicht
       wuerden sich bei Google gegenseitig schwaechen (Kannibalisierung). */
    /* "Ahrweiler" bewusst vorn, nicht nur als Namensteil von
       "Bad Neuenahr-Ahrweiler" versteckt - das ist der kuerzere Suchbegriff
       und der, unter dem der Ort bis 1969 eigenstaendig war. Mit dem vollen
       Namen zusaetzlich waere der Titel ueber der Laenge, die Google
       anzeigt (~60 Zeichen) und wuerde mitten in "Ahrweiler" abgeschnitten. */
    seoTitel: "Physiotherapie & Krankengymnastik Ahrweiler | Hausbesuch",
    beschreibung:
      "Physiotherapie Hausbesuch in Bad Neuenahr-Ahrweiler und Ahrweiler — Krankengymnastik, Neurologie, Lymphdrainage. Privatpatienten, Selbstzahler. 02641 8904973.",
    h1: "Physiotherapie und Krankengymnastik im Hausbesuch in Bad Neuenahr-Ahrweiler",
    anfahrt:
      "Von Grafschaft aus etwa eine Viertelstunde. Bad Neuenahr-Ahrweiler liegt damit im Zentrum meiner Touren — hier lassen sich Termine am ehesten kurzfristig einschieben.",
    ortsteile: [
      "Ahrweiler",
      "Bad Neuenahr",
      "Bachem",
      "Walporzheim",
      "Heimersheim",
      "Heppingen",
      "Lohrsdorf",
      "Kirchdaun",
      "Gimmigen",
      "Green",
      "Ramersbach",
    ],
    ortsteileText:
      "Ich fahre alle Stadtteile an. Ramersbach liegt am weitesten oben und braucht etwas mehr Vorlauf in der Planung — ausgeschlossen ist es nicht.",
  },

  /* ------------------------------------------------------------------
     Sinzig - Ahrmündung, Rheinschiene, Bad Bodendorf.
     ------------------------------------------------------------------ */
  {
    slug: "sinzig",
    name: "Sinzig",
    imOrt: "in Sinzig",
    seoTitel: "Physiotherapie & Krankengymnastik Sinzig | Hausbesuch",
    beschreibung:
      "Physiotherapie im Hausbesuch in Sinzig, Bad Bodendorf, Westum und Löhndorf — Krankengymnastik, Neurologie, Lymphdrainage. Privatpatienten und Selbstzahler. 02641 8904973.",
    h1: "Physiotherapie und Krankengymnastik im Hausbesuch in Sinzig",
    anfahrt:
      "Von Grafschaft aus rund zwanzig Minuten über die Höhe. Sinzig liegt auf derselben Achse wie Remagen — beide Orte lassen sich gut in eine gemeinsame Tour legen.",
    ortsteile: [
      "Sinzig",
      "Bad Bodendorf",
      "Westum",
      "Löhndorf",
      "Franken",
      "Koisdorf",
    ],
    ortsteileText:
      "Bad Bodendorf und die Kernstadt fahre ich am häufigsten. Löhndorf, Franken und Koisdorf liegen abseits der Hauptachse und brauchen einen Termin, der zur Route passt.",
  },

  /* ------------------------------------------------------------------
     Remagen - Rheinschiene und Höhenorte.
     ------------------------------------------------------------------ */
  {
    slug: "remagen",
    name: "Remagen",
    imOrt: "in Remagen",
    seoTitel: "Physiotherapie & Krankengymnastik Remagen | Hausbesuch",
    beschreibung:
      "Physiotherapie im Hausbesuch in Remagen, Kripp, Oberwinter und Rolandswerth — Krankengymnastik, Neurologie, Lymphdrainage. Privatpatienten und Selbstzahler. 02641 8904973.",
    h1: "Physiotherapie und Krankengymnastik im Hausbesuch in Remagen",
    anfahrt:
      "Von Grafschaft aus rund zwanzig Minuten. Die Höhenorte — Oedingen, Unkelbach, Bandorf — liegen der Grafschaft näher als der Remagener Innenstadt.",
    ortsteile: [
      "Remagen",
      "Kripp",
      "Oberwinter",
      "Rolandswerth",
      "Unkelbach",
      "Oedingen",
      "Bandorf",
    ],
    ortsteileText:
      "Die Rheinschiene und die Höhenorte fahre ich gleichermaßen. Oberwinter und Rolandswerth liegen am nördlichen Rand meines Gebiets — dort geht es, wenn der Termin in eine bestehende Tour passt.",
  },

  /* ------------------------------------------------------------------
     Grafschaft - die eigene Hochflaeche, kuerzeste Wege.
     ------------------------------------------------------------------ */
  {
    slug: "grafschaft",
    name: "Grafschaft",
    imOrt: "in der Grafschaft",
    seoTitel: "Physiotherapie & Krankengymnastik Grafschaft | Hausbesuch",
    beschreibung:
      "Physiotherapie im Hausbesuch in der Grafschaft — Gelsdorf, Ringen, Leimersdorf, Birresdorf und alle weiteren Ortsteile. Privatpatienten und Selbstzahler. 02641 8904973.",
    h1: "Physiotherapie und Krankengymnastik im Hausbesuch in der Grafschaft",
    anfahrt:
      "Fünf bis fünfzehn Minuten, je nach Ortsteil. Hier kann ich am ehesten kurzfristig kommen und am ehesten einen Termin verschieben, ohne dass eine ganze Tour kippt.",
    ortsteile: [
      "Gelsdorf",
      "Ringen",
      "Leimersdorf",
      "Birresdorf",
      "Nierendorf",
      "Vettelhoven",
      "Bengen",
      "Bölingen",
      "Eckendorf",
      "Esch",
      "Holzweiler",
      "Karweiler",
      "Lantershofen",
    ],
    ortsteileText:
      "Alle dreizehn Ortsteile. Das ist der einzige Ort in meinem Gebiet, bei dem ich das ohne Einschränkung sagen kann.",
  },

  /* ------------------------------------------------------------------
     Altenahr - engstes Tal, staerkster Flutort, ganz im Westen.
     ------------------------------------------------------------------ */
  {
    slug: "altenahr",
    name: "Altenahr",
    imOrt: "in Altenahr",
    seoTitel: "Physiotherapie & Krankengymnastik Altenahr | Hausbesuch",
    beschreibung:
      "Physiotherapie im Hausbesuch in Altenahr — Krankengymnastik, Neurologie, Lymphdrainage. Privatpatienten und Selbstzahler im engen Ahrtal. 02641 8904973.",
    h1: "Physiotherapie und Krankengymnastik im Hausbesuch in Altenahr",
    anfahrt:
      "Von Grafschaft aus knapp eine halbe Stunde, überwiegend an der Ahr entlang. Der weiteste Weg in meinem Einsatzgebiet — ich lege ihn deshalb bevorzugt mit einem zweiten Termin im Tal zusammen.",
    ortsteile: ["Altenahr"],
    ortsteileText:
      "Der Ort selbst, dicht am Fluss und am Fels gebaut. Für die umliegenden Weinorte des Ahrtals frage ich am Telefon nach der genauen Lage — je nachdem, ob sie noch in eine bestehende Route passen.",
  },
] as const;

/** Schneller Zugriff nach Adresse. */
export const ortNachSlug = Object.fromEntries(
  ortsseiten.map((ort) => [ort.slug, ort]),
) as Record<string, Ortsseite>;

/** Die Adresse einer Ortsseite - eine Stelle, damit Links nicht auseinanderlaufen. */
export function ortsPfad(slug: string): string {
  return `/physiotherapie-hausbesuch-${slug}/`;
}
