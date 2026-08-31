import { einsatzgebiet, grade, kontakt, seite } from "@/lib/site-config";
import { fragen } from "@/lib/content/ablauf";

/**
 * Strukturierte Daten (JSON-LD) fuer Suchmaschinen und KI-Assistenten.
 *
 * Das ist der Baustein, der aus einer huebschen Website einen Eintrag macht,
 * den eine Maschine versteht. Fliesstext muss eine Suchmaschine deuten;
 * JSON-LD sagt ihr direkt: Das hier ist eine Physiotherapiepraxis, sie
 * arbeitet im Hausbesuch, sie deckt diese Orte ab, sie ist unter dieser
 * Nummer erreichbar. Genau diese Angaben braucht Google fuer die lokale
 * Suche - und genau daraus zitieren ChatGPT, Perplexity und die
 * KI-Uebersicht bei Google, wenn jemand nach einer Physiotherapie im Kreis
 * Ahrweiler fragt.
 *
 * Drei Typen:
 *
 *  - `MedicalBusiness` mit `Physiotherapy` als Fachrichtung: der
 *    Praxiseintrag selbst. `areaServed` statt `address` als Schwerpunkt,
 *    weil es keine Praxisraeume gibt, in die jemand kommen koennte.
 *  - `FAQPage`: die haeufigen Fragen vom Ablauf-Reiter. Sie koennen als
 *    aufklappbare Antworten direkt im Suchergebnis erscheinen und sind das
 *    Format, aus dem KI-Antworten am liebsten zitieren.
 *  - `Person`: verbindet die Praxis mit der Therapeutin und ihren
 *    Abschluessen.
 *
 * Alle Angaben stammen aus site-config und den Inhaltsdateien - sie koennen
 * damit nicht auseinanderlaufen, wenn sich etwas aendert.
 */
export default function StrukturDaten() {
  const adresse = {
    "@type": "PostalAddress",
    streetAddress: kontakt.anschrift.strasse,
    postalCode: kontakt.anschrift.plz,
    addressLocality: kontakt.anschrift.ort,
    addressRegion: "Rheinland-Pfalz",
    addressCountry: "DE",
  };

  const praxis = {
    "@context": "https://schema.org",
    "@type": ["MedicalBusiness", "Physiotherapy"],
    "@id": `${seite.domain}/#praxis`,
    name: seite.nameLang,
    alternateName: "Mobile Physiotherapie Nora Heidenreich",
    description: seite.kurzbeschreibung,
    url: seite.domain,
    telephone: kontakt.telefonLink,
    email: kontakt.email,
    address: adresse,
    /* Keine Laufkundschaft: Die Praxis kommt zum Patienten. Genau das sagt
       diese Kombination aus - Google zeigt die Adresse dann nicht als
       Besuchsadresse an. */
    areaServed: einsatzgebiet.kern.map((ort) => ({
      "@type": "City",
      name: ort,
    })),
    /*
      Das Einsatzgebiet als Kreis mit Mittelpunkt und Radius.

      Der Mittelpunkt liegt bewusst auf Bad Neuenahr-Ahrweiler, nicht auf
      der Wohnanschrift: Es ist der Schwerpunkt des Gebiets, und es haelt
      die genaue Hausadresse aus den Kartendiensten heraus. Fuer eine
      Praxis ohne Raeume ist das auch die sachlich richtige Angabe - es
      gibt keinen Ort, an den jemand kommen koennte.
    */
    serviceArea: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: 50.5428,
        longitude: 7.115,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Bad Neuenahr-Ahrweiler",
          addressRegion: "Rheinland-Pfalz",
          addressCountry: "DE",
        },
      },
      geoRadius: "20000",
      description: "Kreis Ahrweiler",
    },
    /*
      Bewusst KEIN openingHoursSpecification.

      Das Schema ist fuer "wann ist geoeffnet/erreichbar" gedacht und passt
      auf diese Praxis nicht sauber: Telefonisch ist Mo-Fr 8-18 Uhr jemand
      erreichbar, tatsaechliche Hausbesuche finden aber nur an einzelnen
      Tagen statt - und das aendert sich, je mehr Patienten dazukommen.
      Ein Eintrag wuerde in die eine oder andere Richtung falsch sein:
      "Mo-Fr 8-18" suggeriert Behandlung rund um die Uhr, "nur Mo+Fr"
      suggeriert an allen anderen Tagen "geschlossen", obwohl das Telefon
      erreichbar ist. Kein Eintrag ist hier ehrlicher als ein falscher.
    */
    availableLanguage: [
      { "@type": "Language", name: "German", alternateName: "de" },
      { "@type": "Language", name: "English", alternateName: "en" },
      { "@type": "Language", name: "Dutch", alternateName: "nl" },
    ],
    availableService: [
      "Krankengymnastik im Hausbesuch",
      "Neurologische Physiotherapie",
      "Mobilisation von Gelenken und Muskulatur",
      "Nachsorge nach Operationen",
      "Sturzprophylaxe und Gangschule",
      "Manuelle Lymphdrainage",
      "Kinesio Taping",
      "Anleitung von Angehörigen",
    ].map((name) => ({ "@type": "MedicalTherapy", name })),
    medicalSpecialty: "Physiotherapy",
    priceRange: "$$",
    currenciesAccepted: "EUR",
    paymentAccepted: "Überweisung",
    founder: { "@id": `${seite.domain}/#nora` },
    knowsLanguage: ["de", "nl", "en"],
  };

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${seite.domain}/#nora`,
    name: seite.name,
    jobTitle: "Physiotherapeutin",
    description:
      "Physiotherapeutin mit Studium in den Niederlanden und langjähriger Klinikerfahrung, Schwerpunkt Neurologie. Behandelt im Hausbesuch im Kreis Ahrweiler.",
    url: `${seite.domain}/ueber-mich/`,
    worksFor: { "@id": `${seite.domain}/#praxis` },
    hasCredential: [grade.bachelor, grade.master].map((titel) => ({
      "@type": "EducationalOccupationalCredential",
      name: titel,
    })),
    knowsAbout: [
      "Neurologische Physiotherapie",
      "Physiotherapie nach Schlaganfall",
      "Parkinson",
      "Multiple Sklerose",
      "Manuelle Lymphdrainage",
      "Sturzprophylaxe",
      "Hausbesuche",
    ],
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${seite.domain}/ablauf/#fragen`,
    mainEntity: fragen.liste.map((eintrag) => ({
      "@type": "Question",
      name: eintrag.frage,
      acceptedAnswer: { "@type": "Answer", text: eintrag.antwort },
    })),
  };

  const webseite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${seite.domain}/#website`,
    url: seite.domain,
    name: seite.nameLang,
    inLanguage: "de-DE",
    publisher: { "@id": `${seite.domain}/#praxis` },
  };

  return (
    <>
      {[praxis, person, faq, webseite].map((daten, i) => (
        <script
          key={i}
          type="application/ld+json"
          /* JSON.stringify erzeugt hier ausschliesslich eigene, im Build
             festgelegte Daten - keine Eingaben von aussen. */
          dangerouslySetInnerHTML={{ __html: JSON.stringify(daten) }}
        />
      ))}
    </>
  );
}
