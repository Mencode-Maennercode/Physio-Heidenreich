import type { Metadata } from "next";
import Link from "next/link";
import { Phone } from "lucide-react";
import SmsKnopf from "@/components/SmsKnopf";
import { einsatzgebiet, kontakt, seite } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Einfache Sprache",
  alternates: { canonical: "/einfache-sprache/" },
  description:
    "Alles Wichtige über die mobile Physiotherapie von Nora Heidenreich in kurzen, einfachen Sätzen.",
};

/**
 * Die Seite in einfacher Sprache.
 *
 * Regeln, an die sich der Text hier hält:
 *   - ein Gedanke pro Satz, kein Nebensatz
 *   - keine Fremdwörter ohne Erklärung
 *   - Zahlen als Ziffern
 *   - aktive Sätze, direkte Anrede
 *   - keine Bilder, die nichts erklären
 *
 * Größere Grundschrift als auf dem Rest der Seite und viel Abstand zwischen
 * den Blöcken. Das ist kein zweitrangiges Angebot, sondern für einen Teil der
 * Besucher der einzige Weg, die Seite überhaupt zu nutzen.
 */

function Block({
  frage,
  children,
}: {
  frage: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-linie pt-10">
      <h2 className="schrift-display text-[clamp(1.6rem,3vw,2.1rem)] leading-tight">
        {frage}
      </h2>
      <div className="mt-6 flex flex-col gap-4 text-[1.25rem] leading-[1.75]">
        {children}
      </div>
    </section>
  );
}

export default function EinfacheSpracheSeite() {
  return (
    <article
      className="pb-[var(--sektion-luft)]"
      style={{ paddingTop: "calc(var(--kopf-hoehe, 7.5rem) + 2.5rem)" }}
    >
      <div className="huelle-eng">
        <p className="augenbraue">Einfache Sprache</p>
        <h1 className="schrift-display titel-mittel mt-6">
          Kurz erklärt
        </h1>
        <p className="mt-6 max-w-[34rem] text-[1.3rem] leading-[1.7]">
          Hier steht alles Wichtige in kurzen Sätzen.
        </p>

        <div className="mt-16 flex flex-col gap-14">
          <Block frage="Wer bin ich?">
            <p>Ich heiße Nora Heidenreich.</p>
            <p>Ich bin Physiotherapeutin.</p>
            <p>Ich habe lange in Krankenhäusern gearbeitet.</p>
          </Block>

          <Block frage="Was mache ich?">
            <p>Ich mache Physiotherapie.</p>
            <p>Das heißt: Ich helfe Ihnen, sich besser zu bewegen.</p>
            <p>Zum Beispiel nach einem Schlaganfall.</p>
            <p>Oder nach einer Operation.</p>
            <p>Oder wenn Sie oft Schmerzen haben.</p>
          </Block>

          <Block frage="Wo mache ich das?">
            <p>Ich komme zu Ihnen nach Hause.</p>
            <p>Sie müssen also nicht zu mir fahren.</p>
            <p>Ich fahre im Kreis Ahrweiler.</p>
            <p>Zum Beispiel nach {einsatzgebiet.kern.slice(0, 3).join(", ")}.</p>
          </Block>

          <Block frage="Was kostet das?">
            {/* Vorher stand hier "Sie bezahlen die Behandlung selbst." Das
                widersprach dem naechsten Block: Privatversicherte bekommen
                Geld zurueck. In einfacher Sprache faellt so ein Widerspruch
                besonders auf, weil jeder Satz fuer sich gelesen wird. */}
            <p>Sie bekommen von mir eine Rechnung.</p>
            <p>Diese Rechnung bezahlen Sie an mich.</p>
            <p>Ich sage Ihnen vorher, was es kostet.</p>
            <p>Sie bekommen den Preis auch schriftlich.</p>
            <p>Erst danach fangen wir an.</p>
          </Block>

          <Block frage="Zahlt meine Krankenkasse?">
            <p>
              Bei einer <strong>privaten</strong> Krankenkasse: oft ja.
            </p>
            <p>Sie schicken die Rechnung an Ihre Kasse.</p>
            <p>Die Kasse zahlt Ihnen dann Geld zurück.</p>
            <p>Wie viel, steht in Ihrem Vertrag.</p>
            <p className="mt-4">
              Bei einer <strong>gesetzlichen</strong> Krankenkasse: nein.
            </p>
            <p>Mit diesen Kassen rechne ich nicht ab.</p>
            <p>Sie können aber selbst bezahlen.</p>
          </Block>

          <Block frage="Brauche ich ein Rezept?">
            <p>Für eine Behandlung bei Krankheit: ja.</p>
            <p>Das Rezept bekommen Sie bei Ihrer Ärztin oder Ihrem Arzt.</p>
            <p>Für Übungen und Beratung: nein.</p>
            <p>Rufen Sie an. Dann klären wir das.</p>
          </Block>

          <Block frage="Wie bekomme ich einen Termin?">
            <p>Rufen Sie mich an.</p>
            <p>Wir reden etwa 15 Minuten.</p>
            <p>Das Gespräch kostet nichts.</p>
            <p>Danach wissen Sie, wie es weitergeht.</p>
          </Block>

          {/* Neu: Wann jemand anrufen kann. Ohne diese Angabe ruft jemand
              abends an, erreicht niemanden und denkt, die Nummer stimmt
              nicht. Auf den anderen Seiten steht es, hier fehlte es. */}
          <Block frage="Wann kann ich anrufen?">
            <p>Von Montag bis Freitag.</p>
            <p>Von 8 bis 18 Uhr.</p>
            <p>Sonst geht der Anrufbeantworter an.</p>
            <p>Dann rufe ich Sie zurück.</p>
          </Block>

          {/* Neu: die ehrliche Abgrenzung. Sie steht auf dem Ablauf-Reiter
              schon - gerade hier ist sie aber wichtig, weil dieser Text oft
              die einzige Seite ist, die jemand liest. */}
          <Block frage="Was mache ich nicht?">
            <p>Ich bin kein Notdienst.</p>
            <p>Ich komme nicht am Wochenende.</p>
            <p>Ich komme nicht sofort am selben Tag.</p>
            <p>Ich stelle keine Diagnose. Das macht die Ärztin oder der Arzt.</p>
          </Block>

          <Block frage="Ich frage für jemand anderen">
            <p>Das ist in Ordnung.</p>
            <p>Viele Menschen rufen für ihre Eltern an.</p>
            <p>Oder für ihren Mann. Oder ihre Frau.</p>
            <p>Sie dürfen beim Termin dabei sein.</p>
          </Block>

          <Block frage="Wie erreichen Sie mich?">
            <p>
              Am besten mit dem Telefon:{" "}
              <a
                href={`tel:${kontakt.telefonLink}`}
                className="font-medium text-aktion underline underline-offset-4"
              >
                {kontakt.telefonAnzeige}
              </a>
            </p>
            <p>Sie können auch eine Nachricht schreiben.</p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={`tel:${kontakt.telefonLink}`}
                className="inline-flex min-h-[3.5rem] items-center justify-center gap-3 rounded-full bg-aktion px-7 text-[1.1rem] font-medium text-[color:var(--marke-offwhite)]"
              >
                <Phone className="size-5" aria-hidden="true" />
                Anrufen
              </a>
              <SmsKnopf className="min-h-[3.5rem] text-[1.1rem]" />
            </div>
          </Block>

          <Block frage="Wichtig">
            <p>Diese Seite ist kein Notruf.</p>
            <p>
              Bei einem Notfall wählen Sie{" "}
              <a
                href="tel:112"
                className="font-medium text-aktion underline underline-offset-4"
              >
                112
              </a>
              .
            </p>
          </Block>
        </div>

        <p className="mt-16 text-[1.1rem]">
          <Link
            href="/"
            className="text-aktion underline underline-offset-4"
          >
            Zurück zur Startseite von {seite.name}
          </Link>
        </p>
      </div>
    </article>
  );
}
