"use client";

import { useEffect, useState } from "react";
import { analyse } from "@/lib/site-config";

/**
 * Widerspruch gegen die Matomo-Reichweitenmessung, fuer die
 * Datenschutzerklaerung.
 *
 * Matomo braucht zwar keine Einwilligung (siehe components/Matomo.tsx),
 * aber ein Widerspruchsrecht bleibt trotzdem bestehen - die Verarbeitung
 * stuetzt sich auf berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO), und
 * dagegen kann jede betroffene Person nach Art. 21 DSGVO widersprechen.
 *
 * Matomos eigene Opt-out-Funktion legt die Entscheidung selbst in einem
 * kleinen Speicherwert im Browser ab - das ist der eine Fall, in dem
 * Speichern auf dem Geraet noetig UND zulaessig ist: Ohne ihn koennte sich
 * die Ablehnung nicht merken, und beim naechsten Besuch muesste erneut
 * widersprochen werden.
 */
export default function MatomoWiderspruch() {
  const [montiert, setzeMontiert] = useState(false);
  const [abgemeldet, setzeAbgemeldet] = useState(false);

  useEffect(() => {
    setzeMontiert(true);
    const paq = (window as { _paq?: unknown[] })._paq;
    if (Array.isArray(paq)) {
      paq.push([
        "isUserOptedOut",
        (optedOut: boolean) => setzeAbgemeldet(optedOut),
      ]);
    }
  }, []);

  if (!analyse.matomoUrl || !analyse.matomoSiteId || !montiert) return null;

  function umschalten() {
    const paq = ((window as { _paq?: unknown[] })._paq ??= []);
    paq.push([abgemeldet ? "forgetUserOptOut" : "optUserOut"]);
    setzeAbgemeldet(!abgemeldet);
  }

  return (
    <button
      type="button"
      onClick={umschalten}
      className="underline underline-offset-4 transition-colors hover:text-aktion"
    >
      {abgemeldet
        ? "Zählung wieder zulassen"
        : "Der Zählung widersprechen"}
    </button>
  );
}
