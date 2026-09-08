/**
 * Inhalte der Ortsseiten.
 *
 * Warum es diese Seiten gibt: Gesucht wird nicht "Kreis Ahrweiler", gesucht
 * wird "physiotherapie hausbesuch ahrweiler". Die Startseite antwortet auf
 * die Region, nicht auf den Ort - und verliert deshalb gegen Seiten, deren
 * Adresse und Ueberschrift genau den gesuchten Ortsnamen tragen.
 *
 * Die Regel, an der solche Seiten sonst scheitern: Vier Seiten mit demselben
 * Text und ausgetauschtem Ortsnamen sind fuer Google eine Doorway Page und
 * werden abgewertet, nicht belohnt. Jeder Eintrag hier muss deshalb etwas
 * enthalten, das NUR fuer diesen Ort stimmt - Ortsteile, Baubestand,
 * Topografie, Anfahrt. Wer hier einen Ort ergaenzt, ohne dafuer eigene
 * Beobachtungen zu haben, macht die Seite schlechter, nicht groesser.
 *
 * Alle Ortsangaben sind nachpruefbare Geografie (Ortsteile, Lage, Baujahre,
 * Verkehrsanbindung) - keine Aussagen ueber Patienten, keine Aussagen ueber
 * Behandlungserfolge. Das ist keine Stilfrage: Erfolgsgeschichten und
 * Heilversprechen sind nach § 3 HWG und § 11 HWG unzulaessig, gerade auf
 * Seiten, die auf Reichweite zielen.
 */

export type Ortsseite = {
  /** Letzter Teil der Adresse: /physiotherapie-hausbesuch-<slug>/ */
  readonly slug: string;
  /** Ortsname, genau so wie er amtlich geschrieben wird. */
  readonly name: string;
  /** Titelzeile fuer die Suchergebnisse. Ort vorn, Leistung dahinter. */
  readonly seoTitel: string;
  /** Beschreibung fuer das Suchergebnis. Unter 160 Zeichen. */
  readonly beschreibung: string;
  readonly augenbraue: string;
  readonly h1: string;
  /** Zwei bis drei Saetze direkt unter der Ueberschrift. */
  readonly einleitung: string;
  /** Fahrzeit von Grafschaft aus - ehrlich, nicht beschoenigt. */
  readonly anfahrt: string;
  /** Ortsteile, in denen Hausbesuche stattfinden. */
  readonly ortsteile: readonly string[];
  readonly ortsteileText: string;
  /**
   * Der eigenstaendige Teil der Seite: was an DIESEM Ort die Wohnsituation
   * praegt. Ohne diesen Abschnitt waere die Seite austauschbar.
   */
  readonly lage: {
    readonly titel: string;
    readonly absaetze: readonly string[];
  };
  /** Konkrete Zugangssituationen vor Ort. */
  readonly wege: readonly {
    readonly titel: string;
    readonly text: string;
  }[];
};

export const ortsseiten: readonly Ortsseite[] = [
  /* ------------------------------------------------------------------
     Bad Neuenahr-Ahrweiler - die Kreisstadt und der wichtigste Ort.
     ------------------------------------------------------------------ */
  {
    slug: "bad-neuenahr-ahrweiler",
    name: "Bad Neuenahr-Ahrweiler",
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
    seoTitel: "Physiotherapie Hausbesuch Ahrweiler | Bad Neuenahr-Ahrweiler",
    beschreibung:
      "Physiotherapie Hausbesuch in Bad Neuenahr-Ahrweiler und Ahrweiler — Krankengymnastik, Neurologie, Lymphdrainage. Privatpatienten, Selbstzahler. 02641 8904973.",
    augenbraue: "Hausbesuche in Bad Neuenahr-Ahrweiler",
    h1: "Physiotherapie im Hausbesuch in Bad Neuenahr-Ahrweiler",
    einleitung:
      "Die Kreisstadt ist der Ort, in dem ich am häufigsten behandle — und der mit den unterschiedlichsten Wohnungen. Zwischen einer Altbauwohnung in der Ahrweiler Altstadt und einem Bungalow in Heppingen liegen nicht nur ein paar Kilometer, sondern zwei völlig verschiedene Behandlungssituationen.",
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
    lage: {
      titel: "Zwei Städte, die zusammengewachsen sind",
      absaetze: [
        "Ahrweiler ist ein mittelalterlicher Stadtkern innerhalb einer erhaltenen Stadtmauer: enge Gassen, Fachwerk, Wohnungen über zwei oder drei Etagen, schmale steile Treppen, fast nie ein Aufzug. Wer hier im zweiten Stock wohnt und schlecht zu Fuß ist, kommt schon lange nicht mehr allein zu einer Praxis — die Treppe ins Haus ist die erste Hürde, nicht die letzte.",
        "Bad Neuenahr ist als Kurstadt des 19. Jahrhunderts gebaut worden und sieht entsprechend anders aus: breitere Straßen, Gründerzeitvillen, später viele Wohnanlagen mit Aufzug im Kurviertel. Hier ist der Zugang meist unproblematisch, dafür sind die Wohnungen oft weitläufig — mit Wegen innerhalb der Wohnung, die selbst schon Übungsstrecke sind.",
        "Dazu kommt, was die Ahrflut vom Juli 2021 hinterlassen hat. In Teilen von Ahrweiler, Bachem, Walporzheim und Heimersheim wird bis heute gebaut. Manche wohnen wieder im eigenen Haus, aber im Obergeschoss, weil unten noch nichts fertig ist. Andere sind in eine Übergangswohnung gezogen, die nie für jemanden mit Gehhilfe gedacht war. Das ändert die Therapie: Geübt wird an dem Weg, der jetzt da ist, nicht an dem, der einmal da war.",
      ],
    },
    wege: [
      {
        titel: "Altbau ohne Aufzug",
        text: "Häufigster Fall in der Altstadt. Die Treppe ist dann kein Hindernis auf dem Weg zur Behandlung, sondern der eigentliche Übungsgegenstand — mit dem Geländer, das tatsächlich dort hängt.",
      },
      {
        titel: "Nach der Reha zurück nach Hause",
        text: "Im Ort gibt es mehrere Rehakliniken. Wenn die Anschlussheilbehandlung endet, bricht die tägliche Therapie oft von hundert auf null ab. Genau diese Lücke lässt sich zu Hause weiterführen.",
      },
      {
        titel: "Wohnen im Provisorium",
        text: "Übergangswohnungen nach der Flut sind selten barrierefrei. Ich sehe mir an, was da ist, und arbeite damit — statt Übungen zu geben, die eine andere Wohnung voraussetzen.",
      },
      {
        titel: "Seniorenwohnanlage",
        text: "Zugang über den Aufzug, Behandlung in der eigenen Wohnung. Für Angehörige, die nicht vor Ort wohnen, ist das der Weg, ohne Fahrdienst zur Therapie zu kommen.",
      },
    ],
  },

  /* ------------------------------------------------------------------
     Sinzig - Ahrmündung, Rheinschiene, Bad Bodendorf.
     ------------------------------------------------------------------ */
  {
    slug: "sinzig",
    name: "Sinzig",
    seoTitel: "Physiotherapie Hausbesuch Sinzig | Mobile Physiotherapie",
    beschreibung:
      "Physiotherapie im Hausbesuch in Sinzig, Bad Bodendorf, Westum und Löhndorf — Krankengymnastik, Neurologie, Lymphdrainage. Privatpatienten und Selbstzahler. 02641 8904973.",
    augenbraue: "Hausbesuche in Sinzig",
    h1: "Physiotherapie im Hausbesuch in Sinzig",
    einleitung:
      "Sinzig liegt dort, wo die Ahr in den Rhein mündet — und ist damit zwei Orte in einem: die Kernstadt auf ihrer Terrasse über dem Tal, und die flachen Ortsteile unten am Wasser. Für einen Hausbesuch macht das mehr Unterschied, als die Karte vermuten lässt.",
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
    lage: {
      titel: "Oben die Altstadt, unten das Wasser",
      absaetze: [
        "Die Sinziger Kernstadt liegt erhöht über der Ahrmündung. Wer hier wohnt, hat fast immer eine Steigung vor der Haustür — die Wege zum Bäcker oder zur Bushaltestelle führen bergauf zurück. Das ist der Punkt, an dem viele aufhören, überhaupt vor die Tür zu gehen, lange bevor sie es sich eingestehen.",
        "Bad Bodendorf ist ein eigener Fall. Der Ort liegt unten an der Ahr, hat als Thermalbadeort einen hohen Anteil älterer Bewohnerinnen und Bewohner — und wurde 2021 von der Flut getroffen. Auch hier ist der Wiederaufbau bis heute nicht überall abgeschlossen.",
        "Die Rheinseite dagegen ist flach. Dort ist der Zugang meist einfach, und die Behandlung kann früher damit anfangen, wieder Strecke zu machen: Gangschule funktioniert auf ebenem Gehweg vor dem Haus besser als in einem Flur von vier Metern Länge.",
      ],
    },
    wege: [
      {
        titel: "Hanglage in der Kernstadt",
        text: "Steigungen lassen sich nicht wegtrainieren, aber man kann lernen, sie sicher zu gehen — bergab ist dabei fast immer das schwierigere Stück.",
      },
      {
        titel: "Bad Bodendorf",
        text: "Viele ältere Bewohner, ein Teil des Bestands noch im Wiederaufbau. Ich richte mich nach dem, was in der Wohnung tatsächlich möglich ist.",
      },
      {
        titel: "Ebenerdig am Rhein",
        text: "In Franken und den flachen Lagen lässt sich das Gehen draußen üben. Ein Gehweg vor der Tür ist die realistischste Übungsstrecke, die es gibt.",
      },
      {
        titel: "Anleitung für Angehörige",
        text: "Wenn jemand aus der Familie täglich unterstützt, zeige ich die Handgriffe direkt an der Situation, in der sie gebraucht werden — am eigenen Bett, an der eigenen Treppe.",
      },
    ],
  },

  /* ------------------------------------------------------------------
     Remagen - Rheinschiene und Höhenorte.
     ------------------------------------------------------------------ */
  {
    slug: "remagen",
    name: "Remagen",
    seoTitel: "Physiotherapie Hausbesuch Remagen | Mobile Physiotherapie",
    beschreibung:
      "Physiotherapie im Hausbesuch in Remagen, Kripp, Oberwinter und Rolandswerth — Krankengymnastik, Neurologie, Lymphdrainage. Privatpatienten und Selbstzahler. 02641 8904973.",
    augenbraue: "Hausbesuche in Remagen",
    h1: "Physiotherapie im Hausbesuch in Remagen",
    einleitung:
      "Remagen zieht sich als schmales Band am Rhein entlang und klettert dahinter den Hang hinauf. Der Unterschied zwischen einer Wohnung in Kripp und einem Haus in Oedingen ist für jemanden, der schlecht zu Fuß ist, größer als die vier Kilometer dazwischen.",
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
    lage: {
      titel: "Am Fluss flach, dahinter steil",
      absaetze: [
        "Remagen-Mitte, Kripp und Oberwinter liegen direkt am Wasser und sind eben. Hier sind die Wohnungen gut erreichbar, und draußen zu üben ist realistisch: Die Rheinpromenade ist eine der wenigen wirklich langen, ebenen und sicheren Gehstrecken im ganzen Kreis. Für jemanden, der nach einem Schlaganfall wieder Ausdauer im Gehen aufbauen soll, ist das ein echter Vorteil gegenüber einem Praxisflur.",
        "Hinter dem Ort steigt das Gelände scharf an. Unkelbach, Oedingen und Bandorf liegen auf der Höhe, Rolandswerth am Fuß des Hangs. Die Zufahrten sind eng und steil, die Häuser meist freistehend mit Stufen zur Haustür und Garten dahinter. Wer dort wohnt und nicht mehr Auto fährt, ist ohne Hilfe praktisch nicht mehr weg vom Grundstück.",
        "Der Bahnhaltepunkt hilft nur denen, die überhaupt bis dorthin kommen. Genau das ist bei einem Teil meiner Patienten der Punkt, an dem der Weg zu einer Praxis endgültig ausfällt — nicht die Therapie selbst ist das Problem, sondern die halbe Stunde davor und danach.",
      ],
    },
    wege: [
      {
        titel: "Ebenes Üben am Rhein",
        text: "Wo es die Verfassung zulässt, verlegen wir einen Teil der Behandlung nach draußen. Zwanzig Minuten Promenade sagen mehr über den Stand als zwanzig Minuten im Wohnzimmer.",
      },
      {
        titel: "Freistehendes Haus auf der Höhe",
        text: "Stufen zur Haustür, Schwelle zur Terrasse, Kellertreppe zur Waschmaschine. Das sind die drei Stellen, an denen zu Hause tatsächlich gestürzt wird — an denen üben wir.",
      },
      {
        titel: "Ohne Auto auf dem Land",
        text: "In den Höhenorten ist der Bus dünn. Ein Hausbesuch ist dort keine Bequemlichkeit, sondern oft die einzige Möglichkeit, überhaupt regelmäßig behandelt zu werden.",
      },
      {
        titel: "Nach einer Operation",
        text: "In den ersten Wochen nach einem Hüft- oder Knieeingriff ist die Fahrt zur Praxis der anstrengendste Teil des Tages. Zu Hause fällt genau der weg.",
      },
    ],
  },

  /* ------------------------------------------------------------------
     Grafschaft - die eigene Hochflaeche, kuerzeste Wege.
     ------------------------------------------------------------------ */
  {
    slug: "grafschaft",
    name: "Grafschaft",
    seoTitel: "Physiotherapie Hausbesuch Grafschaft | Mobile Physiotherapie",
    beschreibung:
      "Physiotherapie im Hausbesuch in der Grafschaft — Gelsdorf, Ringen, Leimersdorf, Birresdorf und alle weiteren Ortsteile. Privatpatienten und Selbstzahler. 02641 8904973.",
    augenbraue: "Hausbesuche in der Grafschaft",
    h1: "Physiotherapie im Hausbesuch in der Grafschaft",
    einleitung:
      "Die Grafschaft ist mein Wohnort — die Wege hierhin sind die kürzesten, die ich habe. Sie ist zugleich die Gemeinde in meinem Gebiet, in der ein Hausbesuch am wenigsten Komfort und am meisten Notwendigkeit ist: dreizehn Ortsteile, verstreut über die Hochfläche, ohne einen Ortskern, in dem alles liegt.",
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
    lage: {
      titel: "Dreizehn Dörfer und kein Zentrum",
      absaetze: [
        "Die Grafschaft liegt auf der Hochfläche zwischen Ahrtal und Rheintal — Obstanbau, weite Felder, dreizehn eigenständige Ortsteile. Es gibt keinen Hauptort, in dem Arzt, Apotheke, Einkauf und Therapie beieinanderliegen. Fast jeder Weg ist eine Fahrt.",
        "Das ist der Grund, warum mobile Therapie hier eine andere Bedeutung hat als in der Stadt. In Bad Neuenahr kann jemand mit Rollator im Zweifel noch zu Fuß zu einer Praxis. In Bengen oder Holzweiler ist die nächste Physiotherapie eine Autofahrt entfernt — und wenn niemand fährt, findet sie nicht statt. Der Bus fährt, aber er fährt selten, und die Haltestelle ist selbst schon ein Weg.",
        "Gebaut wird hier überwiegend freistehend: Einfamilienhäuser mit Stufen zur Haustür, Schlafzimmer im Obergeschoss, Garten hinter dem Haus. Viele Häuser sind in den Siebzigern und Achtzigern für junge Familien gebaut worden — die heute darin alt werden. Die Treppe, die damals kein Thema war, ist inzwischen das zentrale Thema.",
      ],
    },
    wege: [
      {
        titel: "Das Haus, in dem man alt geworden ist",
        text: "Schlafzimmer oben, Bad oben, Wohnen unten. Die Frage ist selten, ob die Treppe noch geht — sondern wie oft am Tag, und in welcher Reihenfolge der Tag deshalb geplant wird.",
      },
      {
        titel: "Kurzfristige Termine",
        text: "Weil ich hier wohne, sind die Fahrten kurz. Wenn in einer Woche etwas ausfällt, ist die Grafschaft der Ort, an dem ich am ehesten nachrücken kann.",
      },
      {
        titel: "Wenn niemand fährt",
        text: "Angehörige, die selbst arbeiten, können nicht zweimal pro Woche einen Fahrdienst leisten. Das ist die häufigste Vorgeschichte dafür, dass eine Verordnung unbehandelt ausläuft.",
      },
      {
        titel: "Sturzprophylaxe im eigenen Haus",
        text: "Teppichkante, Kellertreppe, Schwelle zur Terrasse. Ich gehe die Wege einmal mit ab, die täglich gegangen werden — das ergibt eine andere Liste als jede allgemeine Empfehlung.",
      },
    ],
  },

  /* ------------------------------------------------------------------
     Altenahr - engstes Tal, staerkster Flutort, ganz im Westen.
     ------------------------------------------------------------------ */
  {
    slug: "altenahr",
    name: "Altenahr",
    seoTitel: "Physiotherapie Hausbesuch Altenahr | Mobile Physiotherapie",
    beschreibung:
      "Physiotherapie im Hausbesuch in Altenahr — Krankengymnastik, Neurologie, Lymphdrainage. Privatpatienten und Selbstzahler im engen Ahrtal. 02641 8904973.",
    augenbraue: "Hausbesuche in Altenahr",
    h1: "Physiotherapie im Hausbesuch in Altenahr",
    einleitung:
      "Altenahr liegt dort, wo sich die Ahr am engsten durch den Fels windet — ein Weindorf unter einer Burgruine, mit Hängen, die zu steil für alles außer Reben sind. Es ist der westlichste Ort in meinem Gebiet und einer der Orte, die die Flut 2021 am schwersten getroffen hat.",
    anfahrt:
      "Von Grafschaft aus knapp eine halbe Stunde, überwiegend an der Ahr entlang. Der weiteste Weg in meinem Einsatzgebiet — ich lege ihn deshalb bevorzugt mit einem zweiten Termin im Tal zusammen.",
    ortsteile: ["Altenahr"],
    ortsteileText:
      "Der Ort selbst, dicht am Fluss und am Fels gebaut. Für die umliegenden Weinorte des Ahrtals frage ich am Telefon nach der genauen Lage — je nachdem, ob sie noch in eine bestehende Route passen.",
    lage: {
      titel: "Ein Dorf zwischen Fels und Fluss",
      absaetze: [
        "Die Ahr macht bei Altenahr ihre engste Schleife, mit Felswänden und der Ruine Are direkt über den Dächern. Gebaut ist entsprechend eng: schmale Gassen, Häuser dicht an dicht, oft mit Stufen von der Straße zur Haustür, weil ebener Baugrund hier knapp war. Für jemanden mit Rollator oder Gehstock ist schon der letzte Meter zur eigenen Tür eine Aufgabe.",
        "Die Hänge ringsum sind Weinsteillagen — zu steil für Maschinen, bewirtschaftet von Hand. Das prägt auch, wer hier alt wird: viele frühere Winzer und Winzerinnen, deren Knie und Hüften ein Leben in den Steillagen hinter sich haben, und die genau deshalb wissen, wie anstrengend jede Steigung tatsächlich ist.",
        "Altenahr gehört zu den Orten, die die Flut 2021 am unmittelbarsten getroffen hat — das enge Tal ließ dem Wasser keinen Raum zum Ausweichen. Der Wiederaufbau ist an vielen Stellen sichtbar noch nicht fertig, manche wohnen in Häusern, die nur teilweise wiederhergestellt sind, oder in Übergangslösungen. Das ist die Wohnsituation, in der die Behandlung stattfindet, und ich richte mich danach, nicht nach einem Zustand, der einmal war oder erst noch kommt.",
      ],
    },
    wege: [
      {
        titel: "Stufen von der Gasse zur Tür",
        text: "In der Kernlage praktisch immer vorhanden. Die letzten Meter vor der eigenen Wohnung sind hier oft das Schwierigste am ganzen Tag — genau dort setzt Gangschule sinnvoll an.",
      },
      {
        titel: "Nach Jahrzehnten in den Weinbergen",
        text: "Verschlissene Knie und Hüften nach einem Arbeitsleben in Steillagen. Häufig kein einzelnes Ereignis, sondern eine Abnutzung über Jahrzehnte — die Behandlung folgt entsprechend keinem festen Schema.",
      },
      {
        titel: "Wohnen im Wiederaufbau",
        text: "Ein Teil des Ortes ist bis heute Baustelle. Ich behandle in der Wohnung, die gerade da ist, ohne vorauszusetzen, dass demnächst alles wieder ist wie vorher.",
      },
      {
        titel: "Weiter Weg zu jeder Praxis",
        text: "Die nächste stationäre Physiotherapie ist von hier aus eine echte Fahrt. Für alle, die nicht mehr selbst fahren, ist der Hausbesuch oft die einzige realistische Möglichkeit.",
      },
    ],
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
