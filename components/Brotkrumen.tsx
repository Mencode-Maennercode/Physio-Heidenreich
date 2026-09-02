import { seite } from "@/lib/site-config";

/**
 * Brotkrumenpfad als strukturierte Daten - unsichtbar auf der Seite.
 *
 * Zweck ist allein die Darstellung im Suchergebnis: Ohne diese Angabe zeigt
 * Google unter dem Titel die nackte Adresse
 * ("https://www.nora-heidenreich.de/behandlung/"), mit ihr stattdessen
 * "nora-heidenreich.de › Behandlung". Das liest sich als Wegweiser statt als
 * technische Zeichenkette und macht vor dem Klick klar, wo man landet - eine
 * der wenigen Stellschrauben an der Klickrate, die nichts am sichtbaren
 * Inhalt aendert und von Google ausdruecklich vorgesehen ist.
 *
 * Kein sichtbarer Brotkrumenpfad auf der Seite selbst: Bei fuenf flachen
 * Kapiteln ohne Unterebenen waere er eine Zeile, die nichts erklaert, was
 * die Navigation nicht schon zeigt. Google verlangt fuer die Auszeichnung
 * keinen sichtbaren Pfad, solange die Angaben stimmen - der Pfad hier
 * bildet exakt die tatsaechliche Adressstruktur ab.
 *
 * Die Startseite bekommt keinen: Ein einstufiger Pfad ist kein Pfad.
 */
export default function Brotkrumen({
  /** Beschriftung der aktuellen Seite, so wie in der Navigation. */
  titel,
  /** Adresse der aktuellen Seite, mit Schraegstrich am Ende. */
  pfad,
  /** Beschriftung der Startseite - auf Englisch "Home". */
  wurzel = "Start",
  /** Adresse der Startseite der jeweiligen Sprachfassung. */
  wurzelPfad = "/",
}: {
  titel: string;
  pfad: string;
  wurzel?: string;
  wurzelPfad?: string;
}) {
  const daten = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: wurzel,
        item: `${seite.domain}${wurzelPfad}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: titel,
        item: `${seite.domain}${pfad}`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      /* Wie in StrukturDaten.tsx: Der Inhalt entsteht ausschliesslich aus
         eigenen, beim Bauen feststehenden Werten - keine Eingabe von
         aussen, die hier einzuschleusen waere. */
      dangerouslySetInnerHTML={{ __html: JSON.stringify(daten) }}
    />
  );
}
