import Link from "next/link";
import { CalendarCheck } from "lucide-react";
import { terminHinweis } from "@/lib/site-config";

/**
 * Schmaler Hinweisstreifen: wann es wieder freie Termine gibt.
 *
 * Gestalterisch bewusst ein Streifen und kein Kasten: Er liegt in voller
 * Breite zwischen zwei Abschnitten, in der warmen Sekundaerfarbe. Dadurch
 * liest er sich als Teil der Seite, nicht als aufgeklebte Anzeige - der
 * Unterschied zwischen "aktuelle Information" und "Werbebanner" entsteht
 * fast vollstaendig ueber diese eine Entscheidung.
 *
 * Kein Popup, kein Schliessen-Knopf, keine Bewegung, kein Mitwandern beim
 * Scrollen. Ein Hinweis, den man wegklicken muss, ist bei Angehoerigen in
 * einer angespannten Lage der schnellste Weg, Vertrauen zu verlieren. Dieser
 * hier verdeckt nichts und laesst sich schlicht ueberlesen.
 *
 * Er blendet sich nach `bisWann` von selbst aus - siehe die Begruendung bei
 * `terminHinweis` in site-config.
 */
export default function TerminHinweis() {
  if (!terminHinweis) return null;

  /* Vergleich zum Buildzeitpunkt: Die Seite wird statisch erzeugt, ein
     abgelaufener Hinweis verschwindet also beim naechsten Bauen. Das
     genuegt - taeglich neu zu bauen waere fuer einen Terminhinweis
     unverhaeltnismaessig. */
  const abgelaufen = new Date() >= new Date(terminHinweis.bisWann);
  if (abgelaufen) return null;

  return (
    <aside
      className="border-y border-linie"
      style={{ background: "var(--gc-bg-sekundaer)" }}
    >
      <div className="huelle flex flex-wrap items-center justify-center gap-x-3 gap-y-2 py-4 text-center">
        <CalendarCheck
          className="size-[1.15rem] flex-none text-akzent-warm"
          aria-hidden="true"
        />
        <p className="text-[0.98rem]">
          {terminHinweis.text}{" "}
          <strong className="font-medium">{terminHinweis.betonung}</strong>
        </p>
        <Link
          href="/kontakt/"
          /* Eigenstaendiger Knopf, kein Link im Fliesstext - also volle
             44-px-Beruehrflaeche. */
          className="inline-flex min-h-11 items-center text-[0.98rem] underline underline-offset-4 transition-colors hover:text-aktion"
        >
          Termin anfragen
        </Link>
      </div>
    </aside>
  );
}
