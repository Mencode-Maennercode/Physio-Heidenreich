"use client";

import { useEffect, useState } from "react";

/**
 * Knopf in der Datenschutzerklaerung, mit dem sich eine erteilte
 * Einwilligung zur Reichweitenmessung widerrufen laesst.
 *
 * Der Widerruf muss "so einfach wie die Erteilung" sein (Art. 7 Abs. 3
 * DSGVO). Ein Hinweis wie "loeschen Sie die Cookies in Ihrem Browser" genuegt
 * dem nicht - deshalb hier ein Knopf, der genau das tut, was er sagt.
 *
 * Er meldet den Widerruf ueber ein Fensterereignis an das Banner, damit die
 * Frage ohne Neuladen wieder erscheint - siehe components/Einwilligung.tsx.
 */
export default function MessungWiderrufen() {
  const [erledigt, setzeErledigt] = useState(false);
  const [montiert, setzeMontiert] = useState(false);

  useEffect(() => setzeMontiert(true), []);

  /* Ohne Skript ist der Knopf wirkungslos - dann lieber gar nicht anzeigen
     und den Satz davor fuer sich stehen lassen. */
  if (!montiert) return null;

  if (erledigt) {
    return (
      <span role="status">
        Ihre Einwilligung wurde widerrufen. Es wird nichts mehr gemessen.
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        window.dispatchEvent(new Event("np-messung-widerrufen"));
        setzeErledigt(true);
      }}
      className="underline underline-offset-4 transition-colors hover:text-aktion"
    >
      Einwilligung jetzt widerrufen
    </button>
  );
}
