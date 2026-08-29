import Link from "next/link";
import { Phone } from "lucide-react";
import Knopf from "@/components/Knopf";
import { kontakt, navigation } from "@/lib/site-config";

export default function NichtGefunden() {
  return (
    <section className="flex min-h-[75svh] items-center bg-grund-warm pt-32 pb-[var(--sektion-luft)]">
      <div className="huelle-eng">
        <p className="augenbraue">Seite nicht gefunden</p>
        <h1 className="schrift-display titel-mittel mt-7 max-w-[20ch]">
          Diese Seite gibt es nicht mehr
        </h1>
        <p className="lesespalte-weit mt-7 text-[1.1rem]">
          Vielleicht hat sich die Adresse geändert. Wenn Sie einen Termin
          suchen: Rufen Sie einfach an, das ist ohnehin der schnellste Weg.
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
          <Knopf href="/" art="linie" kind="Zur Startseite" />
        </div>

        <nav aria-label="Alle Seiten" className="mt-14">
          <h2 className="feld-marke">Alle Seiten</h2>
          <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
            {navigation.map((eintrag) => (
              <li key={eintrag.pfad}>
                <Link
                  href={eintrag.pfad}
                  className="inline-flex min-h-[2.75rem] items-center text-aktion underline decoration-linie underline-offset-[6px] transition-colors hover:decoration-aktion"
                >
                  {eintrag.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
