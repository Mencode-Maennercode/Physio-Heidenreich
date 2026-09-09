import Script from "next/script";
import { analyse } from "@/lib/site-config";

/**
 * Selbst gehostetes Matomo, cookielos - laedt ohne Einwilligungsbanner.
 *
 * Drei Einstellungen machen das rechtlich moeglich:
 *
 *  - `disableCookies` MUSS vor `trackPageView` aufgerufen werden. Ohne
 *    Cookie und ohne Speicherung im Browser greift die
 *    Einwilligungspflicht aus § 25 TDDDG nicht - sie betrifft ausdruecklich
 *    nur das Speichern oder Auslesen von Informationen auf dem Endgeraet.
 *  - Die IP-Adresse wird NICHT hier im Skript gekuerzt, sondern einmalig in
 *    den Matomo-Einstellungen selbst (Privatsphaere-Einstellungen, "IP
 *    anonymisieren", empfohlen: die letzten 2 Bytes maskieren). Das gehoert
 *    serverseitig konfiguriert, nicht in den Code der Website.
 *  - `enableHeartBeatTimer` schickt alle 15 Sekunden ein Signal, solange
 *    der Tab aktiv im Vordergrund ist. Ohne das wuerde die Verweildauer
 *    ausgerechnet bei der haeufigsten Situation dieser Seite falsch
 *    gemessen: jemand liest "Ablauf & Abrechnung" und greift danach zum
 *    Telefon, statt weiterzuklicken - ohne einen zweiten Seitenaufruf gibt
 *    es sonst keinen zweiten Messpunkt, aus dem sich die Zeit auf der
 *    Seite berechnen liesse.
 *
 * Anruf- und E-Mail-Klicks als Ereignis:
 *
 * `enableLinkTracking` erfasst ausgehende Links und Downloads - `tel:` und
 * `mailto:` gehoeren ausdruecklich NICHT dazu. Ohne die Zeilen weiter unten
 * bliebe damit ausgerechnet die wichtigste Handlung dieser Website
 * ungemessen: der Anruf. In Matomo haengen daran die Ziele "Anruf
 * gestartet" und "E-Mail geklickt".
 *
 * Ein einziger Listener am `document` statt einer Meldung pro Knopf:
 * Telefonnummern stehen in ueber dreissig Dateien (Kopfzeile, Hero, feste
 * Leiste auf dem Handy, Fusszeile, jede Unterseite). Einzeln verkabelt
 * waere garantiert einer vergessen worden - und zwar unbemerkt, weil eine
 * fehlende Meldung nichts kaputt macht, sondern nur fehlt.
 *
 * Als Bezeichnung wird der Pfad der Seite mitgeschickt, von der aus
 * angerufen wurde - nicht die Nummer. Die Nummer ist immer dieselbe und
 * damit ohne Aussage; die Frage, die zaehlt, ist "welche Seite fuehrt zum
 * Anruf".
 *
 * Kein Tracking auf localhost:
 *
 * `scripts/pruefen.mjs` startet den gebauten Stand lokal (Port 4321) und
 * ruft jede Seite auf; Playwright-Tests tun dasselbe auf wechselnden
 * Ports. Ohne die Abfrage unten landet dieser Testverkehr in der echten
 * Statistik - gemessen am 09.09.2026: 251 von 269 Aufrufen stammten aus
 * lokalen Testlaeufen, die Zahlen waren damit wertlos. In Matomo ist
 * zusaetzlich "nur bekannte URLs verfolgen" aktiv; das hier spart schon
 * die Anfrage.
 *
 * Beide Felder in site-config LEER lassen heisst: diese Komponente gibt
 * `null` zurueck, kein Skript steht im HTML.
 */
export default function Matomo() {
  if (!analyse.matomoUrl || !analyse.matomoSiteId) return null;

  return (
    <Script id="matomo-tracking" strategy="afterInteractive">
      {`
        (function() {
          var h = location.hostname;
          if (h === 'localhost' || h === '127.0.0.1' || h === '::1' || h === '[::1]') return;

          var _paq = window._paq = window._paq || [];
          _paq.push(['disableCookies']);
          _paq.push(['enableHeartBeatTimer', 15]);
          _paq.push(['trackPageView']);
          _paq.push(['enableLinkTracking']);

          document.addEventListener('click', function (e) {
            var ziel = e.target && e.target.closest
              ? e.target.closest('a[href^="tel:"], a[href^="mailto:"]')
              : null;
            if (!ziel) return;
            var art = ziel.getAttribute('href').indexOf('tel:') === 0 ? 'Anruf' : 'E-Mail';
            _paq.push(['trackEvent', 'Kontakt', art, location.pathname]);
          }, true);

          var u = ${JSON.stringify(analyse.matomoUrl)};
          _paq.push(['setTrackerUrl', u + 'matomo.php']);
          _paq.push(['setSiteId', ${JSON.stringify(analyse.matomoSiteId)}]);
          var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
          g.async = true;
          g.src = u + 'matomo.js';
          s.parentNode.insertBefore(g, s);
        })();
      `}
    </Script>
  );
}
