import type { Metadata } from "next";
import {
  Abschnitt,
  Liste,
  Platzhalter,
  Rechtsseite,
} from "@/components/Rechtstext";
import { grade, kontakt, seite } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Impressum",
  robots: { index: true, follow: false },
};

/**
 * Impressum nach § 5 Digitale-Dienste-Gesetz.
 *
 * Nach bestem Wissen zusammengestellt, aber ohne Rechtsberatung: Bei einem
 * Heilberuf kommen zu den allgemeinen Angaben die berufsrechtlichen hinzu
 * (Berufsbezeichnung, verleihender Staat, zuständige Aufsicht, einschlägige
 * Vorschriften). Vor dem Livegang sollte das jemand prüfen, der das darf.
 */
export default function ImpressumSeite() {
  return (
    <Rechtsseite titel="Impressum" stand="Angaben gemäß § 5 DDG">
      <Abschnitt titel="Anbieterin">
        <p>
          {seite.name}
          <br />
          {seite.zusatz}
          <br />
          <Platzhalter>{kontakt.anschrift.strasse}</Platzhalter>
          <br />
          <Platzhalter>
            {kontakt.anschrift.plz} {kontakt.anschrift.ort}
          </Platzhalter>
        </p>
        <p>
          Die Praxis wird ausschließlich im Hausbesuch geführt. Es gibt keine
          Praxisräume und keine Sprechzeiten vor Ort.
        </p>
      </Abschnitt>

      <Abschnitt titel="Kontakt">
        <p>
          Telefon: <Platzhalter>{kontakt.telefonAnzeige}</Platzhalter>
          <br />
          Mobil: <Platzhalter>{kontakt.mobilAnzeige}</Platzhalter>
          <br />
          E-Mail: <Platzhalter>{kontakt.email}</Platzhalter>
        </p>
      </Abschnitt>

      <Abschnitt titel="Berufsbezeichnung und berufsrechtliche Regelungen">
        <p>
          Berufsbezeichnung: <strong>Physiotherapeutin</strong>
          <br />
          Verliehen in: <Platzhalter>Land der Berufszulassung ergänzen</Platzhalter>
        </p>
        <p>
          Akademische Grade: {grade.bachelor}, {grade.master}
        </p>
        <p>Es gelten insbesondere folgende berufsrechtliche Regelungen:</p>
        <Liste
          punkte={[
            "Gesetz über die Berufe in der Physiotherapie (Masseur- und Physiotherapeutengesetz, MPhG)",
            "Ausbildungs- und Prüfungsverordnung für Physiotherapeutinnen und Physiotherapeuten (PhysTh-APrV)",
            "Heilmittelwerbegesetz (HWG)",
          ]}
        />
        <p>
          Die Regelungen sind einsehbar unter{" "}
          <a
            href="https://www.gesetze-im-internet.de"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4"
          >
            gesetze-im-internet.de
          </a>
          .
        </p>
      </Abschnitt>

      <Abschnitt titel="Zuständige Aufsichtsbehörde">
        <p>
          <Platzhalter>
            Gesundheitsamt des Kreises Ahrweiler — vollständige Anschrift
            ergänzen
          </Platzhalter>
        </p>
      </Abschnitt>

      <Abschnitt titel="Umsatzsteuer">
        <p>
          <Platzhalter>
            Zutreffendes wählen: Kleinunternehmerin nach § 19 UStG, es wird
            keine Umsatzsteuer ausgewiesen — oder Umsatzsteuer-Identifikations­nummer
            nach § 27 a UStG eintragen.
          </Platzhalter>
        </p>
        <p>
          Heilbehandlungen im Bereich der Humanmedizin sind nach § 4 Nr. 14
          Buchstabe a UStG von der Umsatzsteuer befreit.
        </p>
      </Abschnitt>

      <Abschnitt titel="Berufshaftpflichtversicherung">
        <p>
          <Platzhalter>
            Name und Anschrift der Versicherung sowie räumlicher Geltungsbereich
            ergänzen.
          </Platzhalter>
        </p>
      </Abschnitt>

      <Abschnitt titel="Verbraucherstreitbeilegung">
        <p>
          Ich bin weder bereit noch verpflichtet, an Streitbeilegungsverfahren
          vor einer Verbraucherschlichtungsstelle teilzunehmen (§ 36
          Verbraucherstreitbeilegungsgesetz).
        </p>
      </Abschnitt>

      <Abschnitt titel="Bildnachweis">
        <p>
          Alle derzeit verwendeten Bilder und Videos sind Platzhalter von{" "}
          <a
            href="https://www.pexels.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4"
          >
            Pexels
          </a>{" "}
          und stehen unter der Pexels-Lizenz.
        </p>
      </Abschnitt>

      <Abschnitt titel="Haftung für Inhalte und Links">
        <p>
          Die Inhalte dieser Seiten wurden mit Sorgfalt erstellt. Für die
          Richtigkeit, Vollständigkeit und Aktualität kann keine Gewähr
          übernommen werden. Die Inhalte ersetzen keine ärztliche Beratung,
          Diagnose oder Behandlung.
        </p>
        <p>
          Für die Inhalte verlinkter externer Seiten sind deren Betreiber
          verantwortlich. Zum Zeitpunkt der Verlinkung waren keine
          Rechtsverstöße erkennbar. Werden mir Rechtsverstöße bekannt, entferne
          ich entsprechende Links umgehend.
        </p>
      </Abschnitt>
    </Rechtsseite>
  );
}
