import type { Metadata } from "next";
import {
  Abschnitt,
  Liste,
  Platzhalter,
  Rechtsseite,
} from "@/components/Rechtstext";
import MessungWiderrufen from "@/components/MessungWiderrufen";
import { analyse, kontakt, seite } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Datenschutz",
  robots: { index: true, follow: false },
};

/**
 * Datenschutzerklaerung.
 *
 * Der Abschnitt zur Reichweitenmessung erscheint nur, wenn in site-config
 * tatsaechlich eine Mess-ID hinterlegt ist. Solange dort nichts steht, misst
 * die Seite auch nichts - und die Erklaerung sagt weiterhin wahrheitsgemaess
 * aus, dass es weder Cookies noch Tracking gibt. Eine Datenschutzerklaerung,
 * die Dienste beschreibt, die gar nicht laufen, ist genauso falsch wie eine,
 * die laufende Dienste verschweigt.
 *
 * Kein Rechtsrat - vor dem Livegang pruefen lassen.
 */
export default function DatenschutzSeite() {
  const misst = Boolean(analyse.googleId);

  return (
    <Rechtsseite titel="Datenschutzerklärung" stand="Stand: August 2026">
      <Abschnitt titel="Das Wichtigste zuerst">
        {misst ? (
          <p>
            Diese Website lädt <strong>keine Inhalte von fremden Servern</strong>{" "}
            nach — Schriften, Bilder und Videos liegen auf demselben Server wie
            die Seite selbst. Zur Reichweitenmessung wird Google Analytics
            eingesetzt, aber <strong>ausschließlich nach Ihrer ausdrücklichen
            Zustimmung</strong>. Solange Sie nicht zugestimmt haben, wird nichts
            geladen, nichts gespeichert und nichts übertragen.
          </p>
        ) : (
          <p>
            Diese Website setzt <strong>keine Cookies</strong>, bindet{" "}
            <strong>keine Analyse- oder Werbedienste</strong> ein und lädt{" "}
            <strong>keine Inhalte von fremden Servern</strong> nach. Schriften,
            Bilder und Videos liegen auf demselben Server wie die Seite selbst.
            Deshalb gibt es hier auch kein Einwilligungsbanner — es gäbe nichts,
            worin Sie einwilligen müssten.
          </p>
        )}
      </Abschnitt>

      <Abschnitt titel="Verantwortliche">
        <p>
          {seite.name}, {seite.zusatz}
          <br />
          {kontakt.anschrift.strasse}
          <br />
          {kontakt.anschrift.plz} {kontakt.anschrift.ort}
          <br />
          Telefon: <Platzhalter>{kontakt.telefonAnzeige}</Platzhalter>
          <br />
          E-Mail: <Platzhalter>{kontakt.email}</Platzhalter>
        </p>
        <p>
          Eine Datenschutzbeauftragte oder ein Datenschutzbeauftragter muss
          nicht benannt werden: Die Voraussetzungen des § 38 BDSG liegen nicht
          vor, da die Verarbeitung von Gesundheitsdaten hier nicht die
          Kerntätigkeit einer umfangreichen regelmäßigen Beobachtung darstellt
          und weniger als zwanzig Personen damit befasst sind.
        </p>
      </Abschnitt>

      <Abschnitt titel="Aufruf der Website (Server-Protokolle)">
        <p>
          Beim Aufruf werden vom Webspace-Anbieter automatisch Daten
          protokolliert, die Ihr Browser übermittelt: aufgerufene Adresse, Datum
          und Uhrzeit, übertragene Datenmenge, Meldung über den Erfolg des
          Abrufs, Browsertyp und Betriebssystem sowie die IP-Adresse.
        </p>
        <p>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Das berechtigte
          Interesse liegt im technisch fehlerfreien Betrieb und in der
          Sicherheit der Website. Eine Zusammenführung dieser Daten mit anderen
          Quellen findet nicht statt. Die Protokolle werden nach spätestens{" "}
          <Platzhalter>
            Aufbewahrungsfrist des Hosters eintragen — bei netcup üblicherweise
            sieben Tage, bitte im Vertrag prüfen
          </Platzhalter>{" "}
          gelöscht.
        </p>
        <p>
          Gehostet wird bei der netcup GmbH, Daimlerstraße 25, 76185 Karlsruhe.
          Mit dem Anbieter besteht ein Vertrag zur Auftragsverarbeitung nach
          Art. 28 DSGVO. Die Server stehen in Deutschland.
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
        <p>
          Die Angabe der Daten ist freiwillig. Ohne Namen und Telefonnummer kann
          ich allerdings nicht zurückrufen — insoweit ist die Angabe für das
          Zustandekommen eines Kontakts erforderlich.
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
        aufzuklaeren waere.
      */}
      <Abschnitt titel="Kontakt per Telefon, SMS oder E-Mail">
        <p>
          Nehmen Sie auf einem dieser Wege Kontakt auf, verarbeite ich Ihre
          Angaben zur Bearbeitung des Anliegens. Rechtsgrundlage ist Art. 6
          Abs. 1 lit. b beziehungsweise lit. f DSGVO.
        </p>
        <p>
          Senden Sie mir per SMS oder E-Mail bitte keine Gesundheitsdaten. Beide
          Wege sind nicht Ende-zu-Ende verschlüsselt und dafür nicht geeignet —
          alles Medizinische besprechen wir am Telefon.
        </p>
      </Abschnitt>

      {misst ? (
        <Abschnitt titel="Reichweitenmessung mit Google Analytics">
          <p>
            Nur wenn Sie im Hinweis am unteren Seitenrand ausdrücklich
            zugestimmt haben, wird Google Analytics 4 geladen. Der Dienst wird
            angeboten von Google Ireland Limited, Gordon House, Barrow Street,
            Dublin 4, Irland.
          </p>
          <p>
            Erhoben werden dabei unter anderem aufgerufene Seiten, Verweildauer,
            ungefährer Standort, Gerätetyp und Browser. Ihre IP-Adresse wird
            gekürzt, bevor sie ausgewertet wird. Die Daten dienen ausschließlich
            dazu, die Website zu verbessern — es findet keine Werbung, kein
            Profiling und keine Zusammenführung mit anderen Daten statt.
          </p>
          <p>
            Rechtsgrundlage ist Ihre Einwilligung nach Art. 6 Abs. 1 lit. a
            DSGVO in Verbindung mit § 25 Abs. 1 TDDDG. Eine Übermittlung in die
            USA an die Google LLC ist nicht ausgeschlossen. Grundlage dafür sind
            die Standardvertragsklauseln der EU-Kommission sowie die Zertifizierung
            von Google nach dem EU-US Data Privacy Framework. Trotz dieser
            Garantien lässt sich ein Zugriff US-amerikanischer Behörden nicht
            vollständig ausschließen.
          </p>
          <p>
            <strong>Sie können Ihre Einwilligung jederzeit widerrufen</strong>,
            mit Wirkung für die Zukunft. Ein Widerruf ist so einfach wie die
            Zustimmung: <MessungWiderrufen />
          </p>
          <p>
            Weitere Angaben in der{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
            >
              Datenschutzerklärung von Google
            </a>
            .
          </p>
        </Abschnitt>
      ) : null}

      <Abschnitt titel="Einstellungen zur Darstellung">
        <p>
          Wenn Sie Textgröße, Kontrast oder Bewegung ändern, wird diese
          Einstellung im lokalen Speicher Ihres Browsers abgelegt, damit sie
          beim nächsten Besuch erhalten bleibt. Es handelt sich nicht um ein
          Cookie; die Angaben verlassen Ihr Gerät nicht und erreichen den Server
          nie. Sie können sie über die Einstellungen Ihres Browsers jederzeit
          löschen oder auf der Seite selbst zurücksetzen.
        </p>
        <p>
          Diese Speicherung ist zur Bereitstellung des von Ihnen ausdrücklich
          gewünschten Dienstes unbedingt erforderlich und daher nach § 25 Abs. 2
          Nr. 2 TDDDG einwilligungsfrei.
        </p>
      </Abschnitt>

      <Abschnitt titel="Behandlungsdaten">
        <p>
          Kommt eine Behandlung zustande, entstehen Gesundheitsdaten im Sinne
          von Art. 9 DSGVO. Diese werden ausschließlich außerhalb dieser Website
          verarbeitet — auf Grundlage von Art. 9 Abs. 2 lit. h DSGVO in
          Verbindung mit § 22 BDSG und unter Beachtung der Schweigepflicht nach
          § 203 StGB.
        </p>
        <p>
          Die Behandlungsdokumentation wird nach den berufsrechtlichen Vorgaben
          zehn Jahre nach Abschluss der Behandlung aufbewahrt und anschließend
          gelöscht. Eine Weitergabe an Ärztinnen, Ärzte, Pflegedienste oder
          Angehörige erfolgt ausschließlich, wenn Sie mich zuvor schriftlich von
          der Schweigepflicht entbunden haben.
        </p>
      </Abschnitt>

      <Abschnitt titel="Empfänger der Daten">
        <p>
          Über den Hosting-Anbieter hinaus{misst ? " und, nach Ihrer Zustimmung, Google" : ""}{" "}
          gebe ich Daten nicht an Dritte weiter. Es findet keine automatisierte
          Entscheidungsfindung und kein Profiling im Sinne von Art. 22 DSGVO
          statt.
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
        <p>Wenden Sie sich dafür formlos an die oben genannte Adresse.</p>
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
          nicht Ende-zu-Ende-verschlüsselt — auch deshalb der Hinweis, dort keine
          Gesundheitsdaten einzutragen.
        </p>
      </Abschnitt>

      <Abschnitt titel="Änderungen dieser Erklärung">
        <p>
          Ich passe diese Erklärung an, wenn sich die Website oder die
          Rechtslage ändert. Es gilt jeweils die hier veröffentlichte Fassung.
        </p>
      </Abschnitt>
    </Rechtsseite>
  );
}
