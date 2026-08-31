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
 * Impressum nach § 5 Digitale-Dienste-Gesetz (DDG, seit 2024 an der Stelle
 * des frueheren § 5 TMG).
 *
 * Bei einem Heilberuf reichen die allgemeinen Angaben nicht: Nach § 5 Abs. 1
 * Nr. 5 DDG kommen Berufsbezeichnung, verleihender Staat, zustaendige
 * Aufsicht und die einschlaegigen berufsrechtlichen Regelungen hinzu -
 * einschliesslich der Angabe, wo diese einzusehen sind. Das ist der Punkt,
 * an dem Impressen von Heilberuflern am haeufigsten unvollstaendig sind und
 * abgemahnt werden.
 *
 * Kein Rechtsrat. Vor dem Livegang sollte das jemand pruefen, der das darf.
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
          {kontakt.anschrift.strasse}
          <br />
          {kontakt.anschrift.plz} {kontakt.anschrift.ort}
        </p>
        <p>
          Die Praxis wird ausschließlich im Hausbesuch geführt. Es gibt keine
          Praxisräume und keine Sprechzeiten vor Ort. Die genannte Anschrift ist
          die ladungsfähige Anschrift der Inhaberin, kein Behandlungsort.
        </p>
      </Abschnitt>

      <Abschnitt titel="Kontakt">
        <p>
          Telefon: {kontakt.telefonAnzeige}
          <br />
          Mobil: {kontakt.mobilAnzeige}
          <br />
          E-Mail: {kontakt.email}
        </p>
      </Abschnitt>

      <Abschnitt titel="Verantwortlich für den Inhalt">
        <p>
          {seite.name}, Anschrift wie oben (§ 18 Abs. 2
          Medienstaatsvertrag).
        </p>
      </Abschnitt>

      <Abschnitt titel="Berufsbezeichnung und berufsrechtliche Regelungen">
        <p>
          Gesetzliche Berufsbezeichnung: <strong>Physiotherapeutin</strong>
          <br />
          Verliehen in: Bundesrepublik Deutschland. Die Erlaubnis zum Führen
          der Berufsbezeichnung wurde nach dem Studium in den Niederlanden
          in Deutschland anerkannt (siehe „Zuständige Aufsichtsbehörde“
          unten).
        </p>
        <p>
          Akademische Grade: {grade.bachelor}, {grade.master}
        </p>
        <p>
          Für Physiotherapeutinnen und Physiotherapeuten besteht in
          Rheinland-Pfalz keine Kammer und damit keine Pflichtmitgliedschaft in
          einer Berufskammer.
        </p>
        <p>Es gelten insbesondere folgende berufsrechtliche Regelungen:</p>
        <Liste
          punkte={[
            "Gesetz über die Berufe in der Physiotherapie (Masseur- und Physiotherapeutengesetz, MPhG)",
            "Ausbildungs- und Prüfungsverordnung für Physiotherapeutinnen und Physiotherapeuten (PhysTh-APrV)",
            "Heilmittelwerbegesetz (HWG)",
            "Gesetz gegen den unlauteren Wettbewerb (UWG)",
            "Heilpraktikergesetz (HeilprG) — maßgeblich für die Grenze zwischen Behandlung auf ärztliche Verordnung und eigenständiger Heilkundeausübung",
            "Verschwiegenheitspflicht nach § 203 Strafgesetzbuch (StGB)",
            "Datenschutz-Grundverordnung (DSGVO) und Bundesdatenschutzgesetz (BDSG)",
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
          Stadt Münster
          <br />
          <Platzhalter>
            Genaue Dienststelle und Anschrift ergänzen — auf der
            Anerkennungsurkunde steht der Stempel „Stadt Münster“; welches
            Amt innerhalb der Stadtverwaltung zuständig war, steht im
            Anerkennungsbescheid selbst und sollte dort nachgeschlagen
            werden.
          </Platzhalter>
        </p>
        <p>
          Für die Anzeige der Tätigkeit und die Hygieneüberwachung zuständig:
          Kreisverwaltung Ahrweiler, Gesundheitsamt, Wilhelmstraße 24–30, 53474
          Bad Neuenahr-Ahrweiler.
        </p>
      </Abschnitt>

      <Abschnitt titel="Umsatzsteuer">
        <p>
          Heilbehandlungen im Bereich der Humanmedizin, die von
          Physiotherapeutinnen und Physiotherapeuten erbracht werden, sind nach
          § 4 Nr. 14 Buchstabe a Umsatzsteuergesetz von der Umsatzsteuer
          befreit. Auf Rechnungen wird daher keine Umsatzsteuer ausgewiesen.
        </p>
        <p>
          Vereinzelt angebotene Kurse ohne Heilbehandlungscharakter fallen
          nicht unter diese Befreiung. Da der Gesamtumsatz die Grenzen des{" "}
          <Platzhalter>
            § 19 UStG nicht überschreitet — bitte mit der Anmeldung beim
            Finanzamt (Fragebogen zur steuerlichen Erfassung) abgleichen —
          </Platzhalter>{" "}
          wird die Kleinunternehmerregelung nach § 19 UStG in Anspruch
          genommen; es wird keine Umsatzsteuer ausgewiesen.
        </p>
      </Abschnitt>

      <Abschnitt titel="Berufshaftpflichtversicherung">
        <p>
          Continentale Sachversicherung AG, Ruhrallee 92, 44139 Dortmund
          <br />
          Räumlicher Geltungsbereich: Bundesrepublik Deutschland
          <br />
          <Platzhalter>
            Versicherungsschein-Nummer nach Vertragsabschluss ergänzen.
          </Platzhalter>
        </p>
      </Abschnitt>

      <Abschnitt titel="Verbraucherstreitbeilegung">
        <p>
          Ich bin weder bereit noch verpflichtet, an Streitbeilegungsverfahren
          vor einer Verbraucherschlichtungsstelle teilzunehmen (§ 36
          Verbraucherstreitbeilegungsgesetz). Die Online-Streitbeilegungs­plattform
          der Europäischen Kommission wurde zum 20. Juli 2025 eingestellt; ein
          Verweis darauf entfällt daher.
        </p>
      </Abschnitt>

      <Abschnitt titel="Bildnachweis">
        <p>
          Die Aufnahmen, auf denen die Inhaberin zu sehen ist, wurden eigens für
          diese Website erstellt. Sie entstanden rechnergestützt auf Grundlage
          eigener Fotografien; die dabei dargestellten Patientinnen und
          Patienten sind keine realen Personen, sondern frei erfunden. Es werden
          keine tatsächlichen Behandlungssituationen und keine echten
          Patientinnen oder Patienten gezeigt.
        </p>
        <p>
          Einzelne Raum- und Landschaftsaufnahmen ohne Personen stammen von{" "}
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

      <Abschnitt titel="Hinweis zu den Inhalten">
        <p>
          Die Inhalte dieser Website dienen der allgemeinen Information über das
          Leistungsangebot. Sie ersetzen weder eine ärztliche Beratung noch eine
          Diagnose oder Behandlung. Ein Behandlungserfolg kann nicht zugesichert
          werden; jede Behandlung richtet sich nach dem individuellen Befund.
        </p>
      </Abschnitt>

      <Abschnitt titel="Haftung für Inhalte und Links">
        <p>
          Die Inhalte dieser Seiten wurden mit Sorgfalt erstellt. Für die
          Richtigkeit, Vollständigkeit und Aktualität kann keine Gewähr
          übernommen werden.
        </p>
        <p>
          Für die Inhalte verlinkter externer Seiten sind deren Betreiber
          verantwortlich. Zum Zeitpunkt der Verlinkung waren keine
          Rechtsverstöße erkennbar. Werden mir Rechtsverstöße bekannt, entferne
          ich entsprechende Links umgehend.
        </p>
      </Abschnitt>

      <Abschnitt titel="Urheberrecht">
        <p>
          Texte, Bilder und Gestaltung dieser Website sind urheberrechtlich
          geschützt. Eine Verwendung außerhalb der Grenzen des Urheberrechts
          bedarf meiner vorherigen schriftlichen Zustimmung.
        </p>
      </Abschnitt>
    </Rechtsseite>
  );
}
