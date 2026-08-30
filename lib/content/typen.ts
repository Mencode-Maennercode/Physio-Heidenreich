/**
 * Gemeinsame Formen fuer die Inhalte der Startseite.
 *
 * Warum das noetig ist: Die deutschen Inhalte stehen mit `as const` in der
 * Datei, ihr Typ ist deshalb der exakte Wortlaut ("Mobile Physiotherapie"),
 * nicht `string`. Wuerden die Bausteine `typeof heroDe` als Parametertyp
 * fuehren, koennte man ihnen nur genau diesen deutschen Text uebergeben -
 * die englische Fassung waere ein Typfehler.
 *
 * Die Formen hier beschreiben stattdessen den Bauplan: welche Felder es
 * gibt, nicht was darin steht. Zwei Ausnahmen bleiben eng gefasst, weil
 * dort tatsaechlich nur bestimmte Werte erlaubt sind - die Symbolnamen der
 * Merkmale und die Bildnamen. Beide werden aus den deutschen Inhalten
 * abgeleitet: Kommt dort ein Symbol hinzu, gilt es automatisch auch fuer
 * die englische Fassung, und ein Tippfehler faellt weiterhin beim Bauen auf.
 */

import type {
  checkliste as checklisteDe,
  fragen as fragenDe,
  situationen as situationenDe,
  stationen as stationenDe,
} from "./ablauf";
import type { wohnungsweg as wohnungswegDe } from "./behandlung";
import type {
  hero as heroDe,
  konzept as konzeptDe,
  kontaktBand as kontaktBandDe,
  leistungen as leistungenDe,
  person as personDe,
  ueberMich as ueberMichDe,
} from "./golden-calm";

/** "zuhause" | "neurologie" | "person" - abgeleitet, nicht abgeschrieben. */
export type MerkmalSymbol = (typeof heroDe.merkmale)[number]["symbol"];

/** Die Bildnamen, die lib/bilder.ts kennt. */
export type BildName = (typeof leistungenDe.karten)[number]["bild"];

export type Person = {
  readonly name: string;
  readonly titel: string;
};

export type Hero = {
  readonly augenbraue: string;
  readonly titelZeilen: readonly string[];
  readonly text: string;
  readonly merkmale: readonly {
    readonly symbol: MerkmalSymbol;
    readonly titel: string;
    readonly text: string;
  }[];
};

export type Konzept = {
  readonly kicker: string;
  readonly titel: string;
  readonly text: string;
  readonly karten: readonly {
    readonly nummer: string;
    readonly titel: string;
    readonly text: string;
  }[];
};

export type Leistungen = {
  readonly kicker: string;
  readonly titel: string;
  readonly text: string;
  readonly karten: readonly {
    readonly bild: BildName;
    readonly titel: string;
    readonly text: string;
  }[];
};

export type UeberMich = {
  readonly kicker: string;
  readonly titel: string;
  readonly absaetze: readonly string[];
  readonly fakten: readonly {
    readonly label: string;
    readonly wert: string;
  }[];
};

export type KontaktBand = {
  readonly kicker: string;
  readonly titel: string;
  readonly text: string;
  readonly anrufLabel: string;
  readonly sprechzeiten: string;
  readonly formularTitel: string;
  readonly formularText: string;
  readonly formularLink: string;
};

/* Die deutschen Inhalte muessen zu den Formen passen. Diese Zeilen
   erzeugen keinen Code - sie sorgen nur dafuer, dass das Bauen abbricht,
   wenn eine Form und der deutsche Inhalt auseinanderlaufen. */
type Pruefe<Form, Wert extends Form> = Wert;
export type _P1 = Pruefe<Person, typeof personDe>;
export type _P2 = Pruefe<Hero, typeof heroDe>;
export type _P3 = Pruefe<Konzept, typeof konzeptDe>;
export type _P4 = Pruefe<Leistungen, typeof leistungenDe>;
export type _P5 = Pruefe<UeberMich, typeof ueberMichDe>;
export type _P6 = Pruefe<KontaktBand, typeof kontaktBandDe>;


/* ---------------------------------------------------- Unterseiten-Formen */

export type Stationen = readonly {
  readonly nummer: string;
  readonly titel: string;
  readonly text: string;
  readonly details: readonly string[];
  readonly hinweis: string;
}[];

export type Situationen = readonly {
  readonly id: string;
  readonly knopf: string;
  readonly titel: string;
  readonly ablauf: readonly {
    readonly marke: string;
    readonly text: string;
  }[];
  readonly achtung: string;
}[];

export type Checkliste = {
  readonly augenbraue: string;
  readonly titel: string;
  readonly text: string;
  readonly punkte: readonly string[];
};

export type Fragen = {
  readonly augenbraue: string;
  readonly titel: string;
  readonly liste: readonly {
    readonly frage: string;
    readonly antwort: string;
  }[];
};

/* Die Koordinaten beziehen sich auf den Grundriss in
   components/behandlung/Wohnungsweg.tsx. Sie sind sprachunabhaengig - eine
   Treppe steht in beiden Fassungen an derselben Stelle. */
export type Wohnungsweg = {
  readonly augenbraue: string;
  readonly titel: string;
  readonly text: string;
  readonly stationen: readonly {
    readonly marke: string;
    readonly titel: string;
    readonly text: string;
    readonly x: number;
    readonly y: number;
  }[];
};

export type _P7 = Pruefe<Stationen, typeof stationenDe>;
export type _P8 = Pruefe<Situationen, typeof situationenDe>;
export type _P9 = Pruefe<Checkliste, typeof checklisteDe>;
export type _P10 = Pruefe<Fragen, typeof fragenDe>;
export type _P11 = Pruefe<Wohnungsweg, typeof wohnungswegDe>;
