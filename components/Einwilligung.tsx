"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import Link from "next/link";
import { analyse } from "@/lib/site-config";

/**
 * Einwilligungsbanner und Reichweitenmessung.
 *
 * Baut auf einer Regel auf, die im Gesundheitsbereich nicht verhandelbar
 * ist: Vor der Zustimmung wird NICHTS geladen und NICHTS gespeichert. Das
 * Google-Skript steht deshalb nicht im HTML, sondern wird erst nach einem
 * Klick nachgeladen (§ 25 Abs. 1 TDDDG, Art. 6 Abs. 1 lit. a DSGVO).
 *
 * Gestaltung nach denselben Vorgaben, an denen die meisten Banner scheitern:
 *
 *  - "Ablehnen" ist genauso gross, genauso sichtbar und genauso leicht zu
 *    treffen wie "Einverstanden". Ein weggedruecktes oder graues Ablehnen
 *    macht die Einwilligung unwirksam.
 *  - Kein Verdecken des Inhalts, kein Popup ueber der ganzen Seite, keine
 *    Sperre. Das Banner sitzt unten und laesst sich ignorieren.
 *  - Die Entscheidung laesst sich jederzeit widerrufen - dafuer gibt es
 *    unten auf der Seite den Link "Messung widerrufen".
 *
 * Die Entscheidung selbst liegt im lokalen Speicher, nicht in einem Cookie.
 * Sie ist "unbedingt erforderlich" im Sinne des TDDDG - ohne sie muesste
 * bei jedem Aufruf erneut gefragt werden.
 *
 * Steht in site-config keine Mess-ID, gibt dieser Baustein `null` zurueck:
 * kein Banner, kein Skript, keine Speicherung. Genau so ist die Seite
 * ausgeliefert, solange niemand eine ID eintraegt.
 */

const SCHLUESSEL = "np-messung";

/** Zustand aus dem lokalen Speicher lesen - fehlertolerant. */
function gespeicherteWahl(): "ja" | "nein" | null {
  try {
    const wert = window.localStorage.getItem(SCHLUESSEL);
    return wert === "ja" || wert === "nein" ? wert : null;
  } catch {
    return null;
  }
}

export default function Einwilligung() {
  const [wahl, setzeWahl] = useState<"ja" | "nein" | null>(null);
  const [montiert, setzeMontiert] = useState(false);

  useEffect(() => {
    setzeMontiert(true);
    setzeWahl(gespeicherteWahl());

    /* Widerruf ueber den Link im Fuss: Der loest dieses Ereignis aus,
       damit das Banner ohne Neuladen wieder erscheint. */
    const zurueck = () => {
      try {
        window.localStorage.removeItem(SCHLUESSEL);
      } catch {
        /* egal - dann bleibt es bei der Sitzung */
      }
      setzeWahl(null);
    };
    window.addEventListener("np-messung-widerrufen", zurueck);
    return () => window.removeEventListener("np-messung-widerrufen", zurueck);
  }, []);

  /* Ohne Mess-ID existiert dieser Baustein praktisch nicht. */
  if (!analyse.googleId) return null;

  /* Vor dem Aufbau im Browser nichts zeigen - sonst blitzt das Banner bei
     jemandem auf, der laengst entschieden hat. */
  if (!montiert) return null;

  function entscheide(neu: "ja" | "nein") {
    try {
      window.localStorage.setItem(SCHLUESSEL, neu);
    } catch {
      /* egal */
    }
    setzeWahl(neu);
  }

  return (
    <>
      {/* Erst nach Zustimmung. Vorher steht das Skript nirgends im HTML. */}
      {wahl === "ja" ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${analyse.googleId}`}
            strategy="afterInteractive"
          />
          <Script id="np-gtag" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('consent', 'default', {
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                analytics_storage: 'granted'
              });
              gtag('config', '${analyse.googleId}', { anonymize_ip: true });
            `}
          </Script>
        </>
      ) : null}

      {wahl === null ? (
        <div
          role="dialog"
          aria-label="Hinweis zur Reichweitenmessung"
          className="fixed inset-x-0 bottom-0 z-50 border-t border-linie bg-grund/95 px-[clamp(1rem,4vw,2rem)] py-5 backdrop-blur-md sm:bottom-0"
        >
          <div className="huelle flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="max-w-[62ch] text-[0.95rem] leading-relaxed">
              Ich würde gern anonym messen, welche Seiten aufgerufen werden, um
              die Website zu verbessern. Dafür wird Google Analytics geladen.
              Ohne Ihre Zustimmung passiert das nicht.{" "}
              <Link
                href="/datenschutz/"
                className="underline underline-offset-4"
              >
                Mehr dazu im Datenschutz
              </Link>
              .
            </p>

            {/* Beide Knoepfe gleich gross und gleich auffaellig - sonst waere
                die Einwilligung nicht freiwillig und damit unwirksam. */}
            <div className="flex flex-none gap-3">
              <button
                type="button"
                onClick={() => entscheide("nein")}
                className="min-h-12 flex-1 rounded-full border border-linie px-6 text-[0.95rem] font-medium transition-colors hover:border-aktion md:flex-none"
              >
                Ablehnen
              </button>
              <button
                type="button"
                onClick={() => entscheide("ja")}
                className="min-h-12 flex-1 rounded-full border border-linie px-6 text-[0.95rem] font-medium transition-colors hover:border-aktion md:flex-none"
              >
                Einverstanden
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
