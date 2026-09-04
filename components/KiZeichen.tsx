import { KI_KUERZEL } from "@/lib/ki-medien";
import { cn } from "@/lib/utils";

/**
 * Kennzeichnung an Bildern und Videos, die mit KI entstanden sind.
 *
 * Gestaltung ist hier ein rechtliches Thema, nicht nur Geschmack. Die
 * Leitlinie der EU-Kommission zu Artikel 50 nennt ausdruecklich als
 * unzureichend: eine "blasse Beschriftung auf einem Bild", ein Hinweis, der
 * nur kurz aufblitzt, sowie vage Kennzeichnungen. Eine feste Groesse oder
 * Form schreibt das Gesetz aber nicht vor - verlangt ist nur "klar und
 * unterscheidbar", nicht "auffaellig" oder "laut". Deshalb bewusst ruhiger
 * als ein Warn-Badge gehalten, ohne unter die Schwelle zu rutschen:
 *
 *  - Weiss auf dunklem Grund bleibt, aber durchscheinend statt deckend
 *    (55 % statt 72 %) und mit `backdrop-blur` - das Bild schimmert durch,
 *    wirkt wie eine leichte Bildunterschrift statt wie ein Aufkleber.
 *    Gegen Weiss gerechnet liegt der Kontrast bei rechnerisch knapp 4,5:1,
 *    dem Minimum fuer "klar lesbar" - der Rand fedbrandet zusaetzlich ab,
 *    sodass es auch dort noch trennscharf bleibt.
 *  - Normale statt fette Schrift, engere Kontur (`rounded` statt
 *    `rounded-md`), kein Buchstabenabstand mehr - weniger "Etikett", mehr
 *    Bildunterschrift.
 *  - 11 px bleibt die Untergrenze fuer die Lesbarkeit, das ruehrt niemand an.
 *  - "KI" bleibt aus demselben Grund wie zuvor: aus sich heraus
 *    verstaendlich statt eines vagen Zeichens. Die Fusszeile loest es
 *    zusaetzlich in einem vollstaendigen Satz auf.
 *
 * `aria-hidden` mit Absicht: Fuer Vorlesesoftware steht die vollstaendige
 * Aussage im Fusszeilensatz - dort als ganzer Satz, nicht als zwei
 * Buchstaben, die vorgelesen "kah ih" ergeben wuerden.
 *
 * `z-20`, nicht `z-10`: Im Hero-Video (siehe GcHero.tsx) legt sich auf dem
 * Handy die Merkmalsleiste mit demselben `z-10` und spaeterer
 * Reihenfolge im Quelltext ueber die untere rechte Ecke - genau dort, wo
 * dieses Zeichen sitzt. Bei gleichem Wert entscheidet die Reihenfolge, und
 * das Zeichen verschwand darunter. Eine Stufe hoeher gewinnt es unabhaengig
 * davon, was später im Quelltext folgt.
 */
export default function KiZeichen({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute right-2 bottom-2 z-20 rounded px-1.5 py-0.5 text-[11px] leading-none font-normal text-white backdrop-blur-sm",
        className,
      )}
      style={{ background: "rgba(28, 28, 28, 0.55)" }}
    >
      {KI_KUERZEL}
    </span>
  );
}
