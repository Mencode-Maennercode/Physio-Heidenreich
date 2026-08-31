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
 * Beide Felder in site-config LEER lassen heisst: diese Komponente gibt
 * `null` zurueck, kein Skript steht im HTML.
 */
export default function Matomo() {
  if (!analyse.matomoUrl || !analyse.matomoSiteId) return null;

  return (
    <Script id="matomo-tracking" strategy="afterInteractive">
      {`
        var _paq = window._paq = window._paq || [];
        _paq.push(['disableCookies']);
        _paq.push(['enableHeartBeatTimer', 15]);
        _paq.push(['trackPageView']);
        _paq.push(['enableLinkTracking']);
        (function() {
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
