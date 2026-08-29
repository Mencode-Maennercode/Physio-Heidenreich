import { Enthuellen } from "@/components/motion/Enthuellen";
import WortAuftritt from "@/components/motion/WortAuftritt";
import { cn } from "@/lib/utils";

/**
 * Augenbraue, Titel, optionaler Text - der immer gleiche Einstieg in eine
 * Sektion. Einmal gebaut, damit der Rhythmus ueber alle Seiten hinweg stimmt.
 *
 * Die drei Teile treten getrennt auf statt als ein Block: Augenbraue, dann
 * die Ueberschrift Wort fuer Wort, dann der Text mit etwas Nachlauf. Das
 * liest sich als Reihenfolge - erst die Einordnung, dann die Aussage, dann
 * die Erlaeuterung - und genau so wird ein Sektionskopf auch gelesen.
 */
export default function Sektionskopf({
  augenbraue,
  titel,
  text,
  className,
  mittig = false,
  alsUeberschrift = "h2",
}: {
  augenbraue?: string;
  titel: string;
  text?: string;
  className?: string;
  mittig?: boolean;
  alsUeberschrift?: "h1" | "h2";
}) {
  return (
    <div
      className={cn(
        mittig && "flex flex-col items-center text-center",
        className,
      )}
    >
      {augenbraue ? (
        <Enthuellen>
          <p className="augenbraue">{augenbraue}</p>
        </Enthuellen>
      ) : null}

      <WortAuftritt
        text={titel}
        als={alsUeberschrift}
        className={cn(
          "schrift-display titel-mittel",
          augenbraue ? "mt-6" : "",
          mittig ? "max-w-[24ch]" : "max-w-[20ch]",
        )}
      />

      {text ? (
        <Enthuellen verzoegerung={0.12}>
          <p
            className={cn(
              "lesespalte-weit mt-6 text-[1.05rem]",
              mittig && "text-center",
            )}
          >
            {text}
          </p>
        </Enthuellen>
      ) : null}
    </div>
  );
}
