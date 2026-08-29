import type { Metadata } from "next";
import {
  Abschnitt,
  Liste,
  Platzhalter,
  Rechtsseite,
} from "@/components/Rechtstext";
import { kontakt, seite } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Datenschutz",
  robots: { index: true, follow: false },
};

/**
 * Datenschutzerklärung.
 *
 * Kurz, weil die Seite tatsächlich wenig erhebt: keine Cookies, kein Tracking,
 * keine eingebundenen Karten, keine Schriften von fremden Servern. Was bleibt,
 * sind Server-Protokolle, das Kontaktformular und die im Browser gespeicherten
 * Darstellungseinstellungen.
 *
 * Kein Rechtsrat - vor dem Livegang prüfen lassen.
 */
export default function DatenschutzSeite() {
  return (
    <Rechtsseite
      titel="Datenschutzerklärung"
      stand="Stand: August 2026"
    >
      <Abschnitt titel="Das Wichtigste zuerst">
        <p>
          Diese Website setzt <strong>keine Cookies</strong>, bindet{" "}
          <strong>keine Analyse- oder Werbedienste</strong> ein und lädt{" "}
          <strong>keine Inhalte von fremden Servern</strong> nach. Schriften,
          Bilder und Videos liegen auf demselben Server wie die Seite selbst.
          Deshalb gibt es hier auch kein Einwilligungsbanner — es gäbe nichts,
          worin Sie einwilligen müssten.
        </p>
      </Abschnitt>

      <Abschnitt titel="Verantwortliche">
        <p>
          {seite.name}, {seite.zusatz}
          <br />
          <Platzhalter>{kontakt.anschrift.strasse}</Platzhalter>
          <br />
          <Platzhalter>
            {kontakt.anschrift.plz} {kontakt.anschrift.ort}
          </Platzhalter>
          <br />
          <Platzhalter>{kontakt.email}</Platzhalter>
        </p>
      </Abschnitt>

      <Abschnitt titel="Aufruf der Website (Server-Protokolle)">
        <p>
          Beim Aufruf werden vom Webspace-Anbieter automatisch Daten
          protokolliert, die Ihr Browser übermittelt: aufgerufene Adresse,
          Datum und Uhrzeit, übertragene Datenmenge, Meldung über den Erfolg des
          Abrufs, Browsertyp und Betriebssystem sowie die IP-Adresse.
        </p>
        <p>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Das berechtigte
          Interesse liegt im technisch fehlerfreien Betrieb und in der
          Sicherheit der Website. Eine Zusammenführung dieser Daten mit anderen
          Quellen findet nicht statt. Die Protokolle werden nach spätestens{" "}
          <Platzhalter>Aufbewahrungsfrist des Hosters eintragen</Platzhalter>{" "}
          gelöscht.
        </p>
        <p>
          Gehostet wird bei{" "}
          <Platzhalter>netcup GmbH, Karlsruhe — Anschrift ergänzen</Platzhalter>
          . Mit dem Anbieter besteht ein Vertrag zur Auftragsverarbeitung nach
          Art. 28 DSGVO.
        </p>
      </Abschnitt>

      <Abschnitt titel="Kontaktformular">
        <p>
          Wenn Sie das Formular nutzen, werden die eingegebenen Angaben — Name,
          Telefonnummer, Wohnort, optional E-Mail-Adresse, gewünschte
          Rückrufzeit und Nachricht — per E-Mail an mich übermittelt und dort
          gespeichert.
        </p>
        <p>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, da die Verarbeitung
          zur Beantwortung Ihrer Anfrage und zur Anbahnung eines
          Behandlungsvertrags erforderlich ist. Die Daten werden gelöscht,
          sobald die Anfrage abschließend bearbeitet ist und keine gesetzlichen
          Aufbewahrungsfristen entgegenstehen.
        </p>
        <p>
          Das Formular fragt bewusst <strong>keine Gesundheitsdaten</strong> ab.
          Bitte geben Sie auch im Nachrichtenfeld keine Angaben zu Diagnosen
          oder Beschwerden ein — diese besprechen wir am Telefon.
        </p>
        <p>
          Zur Abwehr automatisierter Einträge wird ein verstecktes Feld
          ausgewertet und die Zeit zwischen Aufruf und Absenden gemessen. Ein
          externer Dienst kommt dabei nicht zum Einsatz. Um wiederholtes
          Absenden zu begrenzen, wird für kurze Zeit ein Merkmal Ihrer
          IP-Adresse in verschlüsselter Form auf dem Server abgelegt.
        </p>
      </Abschnitt>

      {/*
        Frueher stand hier zusaetzlich ein Absatz zu WhatsApp: dass der Knopf
        nur ein Link sei, dass beim Antippen die Bedingungen von WhatsApp
        Ireland Ltd. gelten und Daten ausserhalb der EU verarbeitet werden
        koennen. Der Absatz entfaellt mit dem Kanal selbst.

        SMS braucht keine Entsprechung: Es laeuft ueber den Mobilfunkanbieter
        und unterliegt dem Fernmeldegeheimnis - es gibt keinen
        Drittlandtransfer und keinen Dienstanbieter, ueber den hier
        aufzuklaeren waere. Genau deshalb ist dieser Abschnitt jetzt kuerzer
        als zuvor.
      */}
      <Abschnitt titel="Kontakt per Telefon, SMS oder E-Mail">
        <p>
          Nehmen Sie auf einem dieser Wege Kontakt auf, verarbeite ich Ihre
          Angaben zur Bearbeitung des Anliegens. Rechtsgrundlage ist Art. 6
          Abs. 1 lit. b beziehungsweise lit. f DSGVO.
        </p>
        <p>
          Senden Sie mir per SMS oder E-Mail bitte keine Gesundheitsdaten.
          Beide Wege sind nicht Ende-zu-Ende verschlüsselt und dafür nicht
          geeignet — alles Medizinische besprechen wir am Telefon.
        </p>
      </Abschnitt>

      <Abschnitt titel="Einstellungen zur Darstellung">
        <p>
          Wenn Sie Textgröße, Kontrast oder Bewegung ändern, wird diese
          Einstellung im lokalen Speicher Ihres Browsers abgelegt, damit sie
          beim nächsten Besuch erhalten bleibt. Es handelt sich nicht um ein
          Cookie; die Angaben verlassen Ihr Gerät nicht und erreichen den Server
          nie. Sie können sie über die Einstellungen Ihres Browsers jederzeit
          löschen oder auf der Seite selbst zurücksetzen.
        </p>
      </Abschnitt>

      <Abschnitt titel="Behandlungsdaten">
        <p>
          Kommt eine Behandlung zustande, entstehen Gesundheitsdaten im Sinne
          von Art. 9 DSGVO. Diese werden ausschließlich außerhalb dieser Website
          verarbeitet — auf Grundlage von Art. 9 Abs. 2 lit. h DSGVO in
          Verbindung mit § 22 BDSG und unter Beachtung der Schweigepflicht nach
          § 203 StGB. Für die Dokumentation gelten die üblichen
          Aufbewahrungsfristen.
        </p>
      </Abschnitt>

      <Abschnitt titel="Ihre Rechte">
        <p>Sie haben jederzeit das Recht auf</p>
        <Liste
          punkte={[
            "Auskunft über die zu Ihnen gespeicherten Daten (Art. 15 DSGVO)",
            "Berichtigung unrichtiger Daten (Art. 16 DSGVO)",
            "Löschung (Art. 17 DSGVO)",
            "Einschränkung der Verarbeitung (Art. 18 DSGVO)",
            "Datenübertragbarkeit (Art. 20 DSGVO)",
            "Widerspruch gegen Verarbeitungen auf Grundlage berechtigter Interessen (Art. 21 DSGVO)",
            "Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO)",
          ]}
        />
        <p>
          Wenden Sie sich dafür formlos an die oben genannte Adresse.
        </p>
      </Abschnitt>

      <Abschnitt titel="Beschwerderecht">
        <p>
          Sie können sich bei einer Aufsichtsbehörde beschweren. Zuständig ist
          der Landesbeauftragte für den Datenschutz und die Informationsfreiheit
          Rheinland-Pfalz, Hintere Bleiche 34, 55116 Mainz.
        </p>
      </Abschnitt>

      <Abschnitt titel="Verschlüsselung">
        <p>
          Die Website wird ausschließlich über HTTPS ausgeliefert. Ihre Eingaben
          im Formular sind damit auf dem Weg zum Server verschlüsselt. Der
          anschließende E-Mail-Versand an mich ist eine gewöhnliche E-Mail und
          nicht Ende-zu-Ende-verschlüsselt — auch deshalb der Hinweis, dort
          keine Gesundheitsdaten einzutragen.
        </p>
      </Abschnitt>
    </Rechtsseite>
  );
}
