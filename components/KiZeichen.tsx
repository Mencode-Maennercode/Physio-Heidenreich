import { KI_KUERZEL } from "@/lib/ki-medien";
import { cn } from "@/lib/utils";

/**
 * Kennzeichnung an Bildern und Videos, die mit KI entstanden sind.
 *
 * Gestaltung ist hier ein rechtliches Thema, nicht nur Geschmack. Die
 * Leitlinie der EU-Kommission zu Artikel 50 nennt ausdruecklich als
 * unzureichend: eine "blasse Beschriftung auf einem Bild", ein Hinweis, der
 * nur kurz aufblitzt, sowie vage Kennzeichnungen. Daraus folgen drei
 * Festlegungen, die nicht "schoener" gemacht werden duerfen:
 *
 *  - Weiss auf dunkler, deckender Flaeche statt hellgrau auf dem Bild. So
 *    steht das Zeichen unabhaengig davon lesbar da, ob darunter ein helles
 *    Fenster oder ein dunkler Boden liegt - auf einem Foto laesst sich der
 *    Untergrund nicht vorhersagen.
 *  - 11 px, nicht kleiner. Klein ist erlaubt, unlesbar nicht.
 *  - "KI" statt eines Sternchens oder einer Ziffer. Zwei Buchstaben sagen
 *    aus sich heraus, worum es geht; ein blosses Zeichen waere die vage
 *    Kennzeichnung, die die Leitlinie ausschliesst. Die Fusszeile loest es
 *    zusaetzlich in einem vollstaendigen Satz auf.
 *
 * `aria-hidden` mit Absicht: Fuer Vorlesesoftware steht die vollstaendige
 * Aussage im Fusszeilensatz - dort als ganzer Satz, nicht als zwei
 * Buchstaben, die vorgelesen "kah ih" ergeben wuerden.
 */
export default function KiZeichen({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute right-2 bottom-2 z-10 rounded-md px-1.5 py-0.5 text-[11px] leading-none font-medium tracking-wide text-white",
        className,
      )}
      style={{ background: "rgba(20, 28, 36, 0.72)" }}
    >
      {KI_KUERZEL}
    </span>
  );
}
