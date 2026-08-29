import { Enthuellen } from "@/components/motion/Enthuellen";
import { cn } from "@/lib/utils";

/**
 * Augenbraue, Titel, optionaler Text - der immer gleiche Einstieg in eine
 * Sektion. Einmal gebaut, damit der Rhythmus ueber alle Seiten hinweg stimmt.
 */
export default function Sektionskopf({
  augenbraue,
  titel,
  text,
  className,
  mittig = false,
  alsUeberschrift: Ueberschrift = "h2",
}: {
  augenbraue?: string;
  titel: string;
  text?: string;
  className?: string;
  mittig?: boolean;
  alsUeberschrift?: "h1" | "h2";
}) {
  return (
    <Enthuellen className={cn(mittig && "flex flex-col items-center text-center", className)}>
      {augenbraue ? <p className="augenbraue">{augenbraue}</p> : null}
      <Ueberschrift
        className={cn(
          "schrift-display titel-mittel",
          augenbraue ? "mt-6" : "",
          mittig ? "max-w-[24ch]" : "max-w-[20ch]",
        )}
      >
        {titel}
      </Ueberschrift>
      {text ? (
        <p className={cn("lesespalte-weit mt-6 text-[1.05rem]", mittig && "text-center")}>
          {text}
        </p>
      ) : null}
    </Enthuellen>
  );
}
