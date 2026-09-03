import { bilder, breiten, type BildName } from "@/lib/bilder";
import KiZeichen from "@/components/KiZeichen";
import { KI_BILDER } from "@/lib/ki-medien";
import { cn } from "@/lib/utils";

/**
 * Bild als <picture> mit AVIF, WebP und JPEG.
 *
 * Kein next/image: Beim statischen Export gibt es keinen Server, der Bilder
 * zur Laufzeit umrechnen koennte. Die Groessen entstehen deshalb beim Bau
 * (scripts/medien.mjs), und hier wird nur noch das passende Format gewaehlt.
 *
 * Der Alt-Text kommt aus der erzeugten Liste, laesst sich aber ueberschreiben,
 * wenn ein Bild an einer Stelle etwas anderes zeigen soll als anderswo.
 */
export default function Bild({
  name,
  alt,
  className,
  bildKlasse,
  groessen = "100vw",
  vorrang = false,
  ohneKiZeichen = false,
}: {
  name: BildName;
  alt?: string;
  className?: string;
  bildKlasse?: string;
  /** Was der Browser wissen muss, um die richtige Breite zu waehlen. */
  groessen?: string;
  /** Nur fuer das erste sichtbare Bild einer Seite setzen. */
  vorrang?: boolean;
  /**
   * Kennzeichnung hier weglassen, weil sie ein aeusserer Rahmen setzt.
   *
   * Noetig bei ParallaxBild: Das Bild liegt dort in einem absichtlich zu
   * grossen Kasten, der ueber alle Raender hinausragt und beschnitten wird -
   * ein Zeichen an seiner Unterkante laege ausserhalb des Sichtbaren. Es
   * gehoert dann an den aeusseren, sichtbaren Rahmen.
   */
  ohneKiZeichen?: boolean;
}) {
  const daten = bilder[name];
  const quelle = (endung: "avif" | "webp") =>
    breiten
      .map((b) => `/media/bilder/${name}-${b}.${endung} ${b}w`)
      .join(", ");

  const ki = KI_BILDER.has(name) && !ohneKiZeichen;

  /*
    Ohne KI-Kennzeichnung bleibt alles wie bisher: ein <picture>, das die
    uebergebenen Klassen traegt. Mit Kennzeichnung kommt eine Huelle darum,
    die die Klassen uebernimmt - das Zeichen braucht einen Bezugsrahmen, an
    dem es sich ausrichten kann, und <picture> darf laut Norm nur <source>
    und <img> enthalten.
  */
  const inhalt = (
    <picture className={cn("block", ki ? "h-full w-full" : className)}>
      <source type="image/avif" srcSet={quelle("avif")} sizes={groessen} />
      <source type="image/webp" srcSet={quelle("webp")} sizes={groessen} />
      <img
        src={`/media/bilder/${name}.jpg`}
        alt={alt ?? daten.alt}
        width={1600}
        height={Math.round(1600 / daten.seitenverhaeltnis)}
        loading={vorrang ? "eager" : "lazy"}
        fetchPriority={vorrang ? "high" : undefined}
        decoding="async"
        className={cn("h-full w-full object-cover", bildKlasse)}
        // Unscharfe Miniatur als Untergrund: waehrend das Bild laedt, steht
        // dort schon die richtige Farbstimmung statt eines grauen Kastens.
        style={
          daten.platzhalter
            ? {
                backgroundImage: `url(${daten.platzhalter})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      />
    </picture>
  );

  if (!ki) return inhalt;

  return (
    <span className={cn("relative block", className)}>
      {inhalt}
      <KiZeichen />
    </span>
  );
}
