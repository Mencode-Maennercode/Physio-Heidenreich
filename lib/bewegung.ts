/**
 * Wie lebhaft sich die Seite beim Scrollen bewegt.
 *
 * EIN Schalter fuer alle scroll-gekoppelten Zugaben: Wort-fuer-Wort-Auftritt
 * der Ueberschriften, Lesefortschritt, Bildtiefe, das kraeftigere Auftauchen
 * der Karten. Auf "ruhig" stellen und neu bauen - dann verhaelt sich die
 * Seite wieder wie vorher, ohne dass irgendwo Inhalt verlorengeht.
 *
 * Wichtig: Das hier ist NICHT die Barrierefreiheits-Einstellung. Wer
 * "Bewegung reduzieren" waehlt oder das im Betriebssystem eingestellt hat,
 * bekommt weiterhin gar keine Bewegung - unabhaengig von diesem Wert. Dieser
 * Schalter regelt nur, wie viel Leben die Seite fuer alle anderen mitbringt.
 */
export const BEWEGUNG = "lebhaft" as "lebhaft" | "ruhig";

/** Kurzform fuer die Abfrage in den Bausteinen. */
export const lebhaft = BEWEGUNG === "lebhaft";

/**
 * Gemeinsame Kurve fuer die scroll-gekoppelten Auftritte.
 *
 * `power3.out` startet zuegig und laeuft weich aus - das liest sich als
 * "kommt an und legt sich hin" statt als "faehrt mechanisch ein". Bewusst
 * dieselbe Kurve ueberall, damit die Seite trotz mehr Bewegung wie aus einem
 * Guss wirkt.
 */
export const KURVE = "power3.out";
