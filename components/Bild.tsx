import { bilder, breiten, type BildName } from "@/lib/bilder";
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
}: {
  name: BildName;
  alt?: string;
  className?: string;
  bildKlasse?: string;
  /** Was der Browser wissen muss, um die richtige Breite zu waehlen. */
  groessen?: string;
  /** Nur fuer das erste sichtbare Bild einer Seite setzen. */
  vorrang?: boolean;
}) {
  const daten = bilder[name];
  const quelle = (endung: "avif" | "webp") =>
    breiten
      .map((b) => `/media/bilder/${name}-${b}.${endung} ${b}w`)
      .join(", ");

  return (
    <picture className={cn("block", className)}>
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
}
