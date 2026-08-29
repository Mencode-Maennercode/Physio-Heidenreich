import type { Metadata } from "next";
import { Phone } from "lucide-react";
import Knopf from "@/components/Knopf";
import { kontakt } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Nachricht angekommen",
  robots: { index: false, follow: false },
};

/**
 * Bestaetigung nach dem Absenden ohne JavaScript.
 *
 * kontakt.php leitet hierher weiter (303), damit ein Neuladen die Anfrage
 * nicht ein zweites Mal verschickt. Mit JavaScript wird diese Seite nie
 * erreicht - dort bleibt man auf dem Formular.
 */
export default function DankeSeite() {
  return (
    <section className="flex min-h-[70svh] items-center bg-grund-warm pt-32 pb-[var(--sektion-luft)]">
      <div className="huelle-eng">
        <p className="augenbraue">Angekommen</p>
        <h1 className="schrift-display titel-mittel mt-7 max-w-[18ch]">
          Danke für Ihre Nachricht
        </h1>
        <p className="lesespalte-weit mt-7 text-[1.1rem]">
          Ich melde mich zum gewünschten Zeitpunkt bei Ihnen. Sollte es einmal
          länger dauern, liegt es daran, dass ich gerade unterwegs bin — nicht
          daran, dass Ihre Anfrage untergegangen ist.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Knopf
            href={`tel:${kontakt.telefonLink}`}
            kind={
              <>
                <Phone className="size-4" aria-hidden="true" />
                {kontakt.telefonAnzeige}
              </>
            }
          />
          <Knopf href="/" art="linie" kind="Zurück zur Startseite" />
        </div>
      </div>
    </section>
  );
}
