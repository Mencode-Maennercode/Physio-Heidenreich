import { Enthuellen } from "@/components/motion/Enthuellen";
import WortAuftritt from "@/components/motion/WortAuftritt";

/**
 * Schlichter Seitenkopf fuer Unterseiten.
 *
 * Kein Video, keine eingerueckte Karte, kein Verlauf - nur Flaeche, Text und
 * Luft. Genau das Muster, das "Ueber mich" und "Kontakt" schon vorher hatten:
 * Auf einer Unterseite geht es um Inhalt, nicht um Atmosphaere. Der grosse
 * Auftritt mit Video bleibt der Startseite vorbehalten, damit der Unterschied
 * zwischen Eingang und Innenraum spuerbar bleibt.
 *
 * `kinder` nimmt optionale Zusaetze unter dem Text auf (Statuszeile, Knoepfe).
 */
export default function GcSeitenKopf({
  kicker,
  titel,
  text,
  unterzeile,
  kinder,
}: {
  kicker: string;
  titel: string;
  text?: string;
  /** Kleine Zeile direkt unter der Ueberschrift, z. B. Berufsbezeichnung. */
  unterzeile?: string;
  kinder?: React.ReactNode;
}) {
  return (
    <section
      className="bg-grund-warm pt-[8.5rem] pb-[clamp(3rem,6vw,4.5rem)]"
    >
      <div className="huelle">
        <Enthuellen>
          <p className="augenbraue">{kicker}</p>
        </Enthuellen>

        {/* Der Seitentitel ist die erste Zeile, die jemand auf einer
            Unterseite liest - hier lohnt der Wort-fuer-Wort-Auftritt am
            meisten. Ohne Verzoegerung, weil oben auf der Seite niemand
            wartet. */}
        <WortAuftritt
          text={titel}
          als="h1"
          className="schrift-display titel-gross mt-7 max-w-[18ch]"
        />

        <Enthuellen verzoegerung={0.12}>
          {unterzeile ? (
            <p className="mt-4 text-[1.05rem] text-leise">{unterzeile}</p>
          ) : null}
          {text ? (
            <p className="lesespalte-weit mt-7 text-[1.1rem]">{text}</p>
          ) : null}
          {kinder}
        </Enthuellen>
      </div>
    </section>
  );
}
