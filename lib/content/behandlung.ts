/**
 * Texte der Behandlungsseite.
 *
 * Aufbau mit Absicht: zuerst das vollstaendige Spektrum gleichwertig
 * aufgelistet, danach die Vertiefung in die Neurologie mit dem meisten Raum.
 * Vorher stand die Vertiefung vorn - das liess einen Besucher mit einem
 * orthopaedischen Anliegen erst durch drei neuro-lastige Abschnitte
 * scrollen, bevor sein Thema ueberhaupt auftauchte. Gerade zum Start der
 * Selbstaendigkeit ist das ein vermeidbares Risiko. Soll der Schwerpunkt
 * spaeter staerker geschaerft werden, aendert sich hier die Gewichtung -
 * nicht die Komponente.
 *
 * Alle Formulierungen halten sich an das Heilmittelwerbegesetz: keine
 * Heilversprechen, keine Erfolgsgeschichten, keine Vorher-Nachher-Vergleiche.
 * Es geht immer um das, was ich tue - nie um ein Ergebnis, das ich zusichere.
 */

export const kopf = {
  augenbraue: "Behandlung",
  titel: "Was ich bei Ihnen zu Hause mache",
  text: "Das ganze Spektrum der Physiotherapie im Hausbesuch. Der Schwerpunkt liegt in der Neurologie — die übrigen Behandlungen gehören genauso dazu.",
} as const;

export const schwerpunkt = {
  augenbraue: "Schwerpunkt",
  titel: "Neurologische Behandlung im häuslichen Umfeld",
  text: "Nach einem Schlaganfall, bei Parkinson, Multipler Sklerose oder Polyneuropathie, nach längerem Krankenhausaufenthalt. Auch dann, wenn die Reha lange zurückliegt und es darum geht, Beweglichkeit zu erhalten.",
  indikationen: [
    "Nach Schlaganfall",
    "Parkinson",
    "Multiple Sklerose",
    "Polyneuropathie",
    "Nach längerem Krankenhausaufenthalt",
    "Schwindel und Gangunsicherheit",
  ],
} as const;

/**
 * Der inhaltlich wichtigste Text der Seite. Er erklaert etwas, das die meisten
 * nicht wissen - und beantwortet damit die eigentliche Frage: warum sollte man
 * fuer einen Hausbesuch privat zahlen, statt in eine Praxis zu gehen?
 */
export const warumZuHause = {
  augenbraue: "Warum das zu Hause besser funktioniert",
  titel: "Neurologische Therapie zielt auf den Alltag. Also übt man im Alltag.",
  gruende: [
    {
      titel: "Geübt wird an Ihrer Treppe",
      text: "Nicht an einer Treppe im Übungsraum. Was Sie wiedererlangen wollen, sind konkrete Bewegungen an konkreten Orten: das eigene Bad, das eigene Bett, der Weg zur Haustür.",
    },
    {
      titel: "Der Bruch beim Nachhausekommen entfällt",
      text: "„In der Praxis hat es geklappt, zu Hause nicht mehr“ ist das häufigste Problem in der neurologischen Therapie. Wenn die Therapie zu Hause stattfindet, gibt es diesen Übertrag nicht.",
    },
    {
      titel: "Die Umgebung lässt sich direkt anpassen",
      text: "Stolperstellen, Sitzhöhen, Haltegriffe, Laufwege. Vieles davon sehe ich in zehn Minuten — und wir können es gemeinsam ändern, statt darüber zu sprechen.",
    },
    {
      titel: "Angehörige sind dabei",
      text: "Wer täglich mit anpackt, lernt die Handgriffe dort, wo sie gebraucht werden. Das entlastet spürbar und macht vieles zwischen den Terminen möglich.",
    },
    {
      titel: "Keine Kraft für den Weg",
      text: "Nach einem Schlaganfall oder bei Multipler Sklerose geht sonst die halbe Tagesenergie für Anfahrt und Rückweg drauf. Diese Kraft fließt hier in die Behandlung.",
    },
    {
      titel: "Vertraute Umgebung, gleiches Gesicht",
      text: "Bei Orientierungs- oder Gedächtnisproblemen ist das oft die Voraussetzung dafür, dass Therapie überhaupt greift. Sie haben immer dieselbe Therapeutin — keine wechselnden Behandler.",
    },
  ],
} as const;

/**
 * Der Weg durch die Wohnung.
 *
 * Fuenf Stationen entlang des Weges, den fast jeder Patient taeglich geht.
 * Sie tragen dasselbe Argument wie `warumZuHause`, aber konkret statt
 * grundsaetzlich: nicht "der Alltag ist wichtig", sondern "an dieser Treppe,
 * mit diesem Geländer".
 *
 * `x` und `y` beziehen sich auf den Grundriss in components/behandlung/
 * Wohnungsweg.tsx (Zeichenfläche 600 × 420).
 */
export const wohnungsweg = {
  augenbraue: "Ein Tag, fünf Stellen",
  titel: "Wo eine Behandlung zu Hause wirklich stattfindet",
  text: "Nicht im Behandlungsraum, sondern auf dem Weg, den Sie ohnehin jeden Tag gehen.",
  stationen: [
    {
      marke: "Am Bett",
      titel: "Der erste Transfer des Tages",
      text: "Sich drehen, an die Bettkante kommen, aufstehen. Gelingt das sicher, trägt es den ganzen Tag. Gelingt es nicht, hilft alles andere wenig.",
      x: 125,
      y: 135,
    },
    {
      marke: "Im Bad",
      titel: "Die engste Stelle der Wohnung",
      text: "Umsetzen auf wenigen Quadratmetern, Halt finden, ohne sich am Waschbecken hochzuziehen. Hier sehe ich in fünf Minuten, welcher Griff fehlt.",
      x: 270,
      y: 135,
    },
    {
      marke: "Im Flur",
      titel: "Gehen, wenden, Schwellen",
      text: "Auf engem Raum kehrtmachen, an einer Türschwelle nicht hängenbleiben, mit Rollator oder Stock durch eine normale Tür. Ob ein Gang sicher ist, zeigt sich hier — nicht auf zehn Metern freier Fläche.",
      x: 330,
      y: 247,
    },
    {
      marke: "An der Treppe",
      titel: "Rauf und runter, in der richtigen Reihenfolge",
      text: "Hinauf mit dem kräftigeren Bein, hinunter mit dem betroffenen. Geübt an Ihrem Geländer, in Ihrer Stufenhöhe, mit Ihrem Licht.",
      x: 440,
      y: 300,
    },
    {
      marke: "An der Haustür",
      titel: "Das Ziel der meisten",
      text: "Wieder allein vor die Tür. Schwelle, Schlüssel, der erste Schritt nach draußen — und der Weg zurück, der oft der schwerere ist.",
      x: 505,
      y: 348,
    },
  ],
} as const;

/**
 * Das vollstaendige Spektrum, als Erstes auf der Seite. Neurologie steht
 * auch hier vorn - aber als ganz normaler Listeneintrag neben allen anderen,
 * nicht als eigene Huerde vor ihnen. Wer nicht neurologisch sucht, findet
 * sein Thema sofort; wer neurologisch sucht, findet den Verweis auf die
 * Vertiefung weiter unten.
 */
export const weitereBehandlungen = {
  augenbraue: "Leistungen",
  titel: "Was ich behandle",
  text: "Vollständig und ohne Abstriche — ein Hausbesuch ist kein reduziertes Programm.",
  /*
    `symbol` und `schlagworte` sind NUR fuer die Handy-Kachelansicht
    (app/behandlung/page.tsx, unter md). Der Desktop zeigt weiterhin die
    volle Zeile mit `was` und `fuerWen` als ausgeschriebenen Satz - die
    Kacheln sind eine verdichtete Zweitfassung, kein Ersatz.

    `schlagworte` uebersetzt den `fuerWen`-Satz in zwei bis drei kurze
    Stichworte statt eines Satzes, damit acht Eintraege auf dem Handy als
    Kacheln statt als Textwand lesbar sind.
  */
  liste: [
    {
      symbol: "neurologie" as const,
      titel: "Neurologische Behandlung",
      was: "Gang, Gleichgewicht, Feinmotorik und Sicherheit im Alltag — mehr dazu im Abschnitt weiter unten.",
      fuerWen: "Nach Schlaganfall, bei Parkinson, Multipler Sklerose oder Polyneuropathie.",
      schlagworte: ["Schlaganfall", "Parkinson", "MS"],
    },
    {
      symbol: "kraft" as const,
      /* Weicher Trennstrich (U+00AD) vor "gymnastik": In der schmalen
         Handy-Kachel (siehe app/behandlung/page.tsx) ist die Spalte
         schmaler als jede Stelle, an der das automatische
         Silbentrennungswoerterbuch des Browsers einen Bruch fuer dieses
         eine Wort findet - es riss deshalb ohne Trennstrich mitten im
         Wort ("Krankengymnasti" / "k"). Der weiche Trennstrich erzwingt
         eine sprachlich korrekte Stelle und ist unsichtbar, solange dort
         nicht umgebrochen wird - auf dem Desktop und ueberall sonst also
         ohne jede Wirkung. */
      titel: "Kranken­gymnastik",
      was: "Aktive und passive Übungsbehandlung für Kraft, Beweglichkeit und Koordination.",
      fuerWen: "Bei Beschwerden an Gelenken, Wirbelsäule und Muskulatur.",
      schlagworte: ["Gelenke", "Wirbelsäule", "Muskulatur"],
    },
    {
      /* Bewusst NICHT "Manuelle Therapie": Das ist in Deutschland eine
         zertifikatspflichtige Heilmittelposition. Wer den Begriff fuehrt,
         behauptet damit die Zertifikatsfortbildung - unabhaengig davon, ob
         darueber abgerechnet wird. Ohne Zertifikat waere das irrefuehrend
         nach § 5 UWG und § 3 HWG und ein klassischer Abmahnanlass.

         Die Techniken selbst duerfen beschrieben werden, nur eben nicht
         unter dem geschuetzten Namen. Sobald das Zertifikat vorliegt, kann
         hier der Fachbegriff stehen. */
      symbol: "haende" as const,
      titel: "Mobilisation von Gelenken und Muskulatur",
      was: "Behandlung mit den Händen: Gelenke beweglicher machen, verkürzte Muskulatur dehnen, Gewebe lockern.",
      fuerWen: "Bei eingeschränkter Beweglichkeit, Steifigkeit und muskulärer Verspannung.",
      schlagworte: ["Beweglichkeit", "Steifigkeit", "Verspannung"],
    },
    {
      symbol: "nachsorge" as const,
      titel: "Nachsorge nach Operationen",
      was: "Weiterführung der Behandlung nach Klinik und Anschlussheilbehandlung, abgestimmt auf die Belastungsvorgaben.",
      fuerWen: "Nach Gelenkersatz, Wirbelsäulen- und Weichteiloperationen.",
      schlagworte: ["Gelenkersatz", "Wirbelsäulen-OP", "Weichteil-OP"],
    },
    {
      symbol: "sturz" as const,
      titel: "Sturzprophylaxe und Gangschule",
      was: "Gleichgewicht, sicheres Aufstehen, Umgang mit Gehhilfen — und ein Blick auf die Wohnung.",
      fuerWen: "Bei Gangunsicherheit, Schwindel und nach Stürzen.",
      schlagworte: ["Gangunsicherheit", "Schwindel", "Nach Stürzen"],
    },
    {
      symbol: "lymph" as const,
      titel: "Manuelle Lymphdrainage",
      was: "Sanfte Grifftechnik zur Anregung des Lymphabflusses, bei Bedarf mit Bandagierung.",
      fuerWen: "Bei Schwellungen nach Operationen und bei Lymphödemen.",
      schlagworte: ["Schwellungen", "Lymphödem"],
    },
    {
      symbol: "chronisch" as const,
      titel: "Begleitung bei chronischen Beschwerden",
      /* Gleicher Fall wie bei "Kranken­gymnastik" oben: weicher
         Trennstrich, damit das Wort in der schmalen Kachel nicht
         "Übungsprogram" / "m" reisst. */
      was: "Längerfristige Betreuung mit Übungs­programm für zwischendurch.",
      fuerWen: "Bei Verläufen, die nicht mit sechs Terminen abgeschlossen sind.",
      schlagworte: ["Langfristig", "Übungsprogramm"],
    },
    {
      symbol: "angehoerige" as const,
      titel: "Anleitung von Angehörigen",
      was: "Lagerung, Transfer, Hilfestellung beim Gehen — Handgriffe, die den Alltag sicherer machen.",
      fuerWen: "Für alle, die zu Hause mitpflegen und dabei den eigenen Rücken schonen wollen.",
      schlagworte: ["Lagerung", "Transfer", "Pflegende"],
    },
  ],
} as const;

/**
 * Die ehrliche Abgrenzung steht vollstaendig auf dem Ablauf-Reiter
 * (`lib/content/ablauf.ts`, Export `grenzen`). Hier wird nur darauf verwiesen,
 * damit die Liste nur an einer Stelle gepflegt werden muss.
 */
