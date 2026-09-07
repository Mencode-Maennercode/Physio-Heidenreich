"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Mail, Send } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Rückruf-Formular.
 *
 * Absichtlich klein gehalten: Name, Telefon, Ort, Wunschzeit, kurze Nachricht.
 * Nach Gesundheitsangaben wird nicht gefragt - die gehören ins Telefonat und
 * nicht in eine E-Mail, die über mehrere Server läuft.
 *
 * Ohne JavaScript funktioniert das Formular ebenfalls: Dann greift das normale
 * `action`-Ziel und kontakt.php liefert eine schlichte Bestätigungsseite. Mit
 * JavaScript wird abgeschickt, ohne die Seite zu verlassen.
 *
 * Spam-Abwehr ohne Captcha, weil ein Captcha für ältere Menschen und für
 * Screenreader eine echte Hürde ist:
 *   1. Honigtopf-Feld, das nur Bots ausfüllen
 *   2. Zeitmessung - unter drei Sekunden hat kein Mensch getippt
 */

type Zustand = "leer" | "sendet" | "gesendet" | "fehler";

const PFLICHT = ["name", "telefon", "ort"] as const;

/*
  Ein Text fuer zwei Wege: den frischen Versand und die 60-Sekunden-Sperre.
  Beide enden fuer die absendende Person gleich - die Nachricht ist in der
  Praxis - und sollen deshalb auch gleich aussehen.
*/
const ERFOLG =
  "Ihre Nachricht ist angekommen. Ich melde mich zum gewünschten Zeitpunkt.";

export default function Formular({
  kompakt = false,
}: {
  /**
   * Kurzfassung fuer die Startseite: nur die drei Pflichtangaben.
   *
   * Auf der Startseite steht das Formular neben einem Textblock. In voller
   * Laenge (sieben Felder) war die Karte doppelt so hoch wie ihre
   * Nachbarspalte - das Band wirkte dadurch unruhig und das Formular
   * erschlagend, obwohl fuer einen Rueckruf drei Angaben genuegen.
   *
   * Weggelassen werden ausschliesslich optionale Felder. Die Gegenstelle
   * (public/kontakt.php) liest jedes davon mit `?? ''`, es fehlt also nichts
   * - auch nicht ohne JavaScript, wo das normale POST greift. Die
   * vollstaendige Fassung mit Wunschzeit und Nachricht steht weiterhin auf
   * der Kontaktseite.
   *
   * Ausnahme ist das E-Mail-Feld: Es steht trotz seiner Optionalitaet auch
   * hier, weil ohne Adresse keine Eingangsbestaetigung moeglich waere.
   */
  kompakt?: boolean;
}) {
  const [zustand, setzeZustand] = useState<Zustand>("leer");
  const [fehler, setzeFehler] = useState<Record<string, string>>({});
  const [meldung, setzeMeldung] = useState("");
  const [zeigeToast, setzeZeigeToast] = useState(false);
  const geoeffnet = useRef(Date.now());
  const formular = useRef<HTMLFormElement>(null);
  const bestaetigung = useRef<HTMLDivElement>(null);

  /* Verschwindet von selbst - ein Toast, den man wegklicken muss, ist keiner. */
  useEffect(() => {
    if (!zeigeToast) return;
    const zeitgeber = setTimeout(() => setzeZeigeToast(false), 5000);
    return () => clearTimeout(zeitgeber);
  }, [zeigeToast]);

  /*
    Nach dem Absenden zur Bestaetigung scrollen.

    Ohne das bleibt die Bestaetigung unsichtbar: Die vollstaendige Fassung
    auf der Kontaktseite ist sieben Felder hoch, die Karte danach nur wenige
    Zeilen. Beim Austausch schrumpft die Seite also um mehrere hundert Pixel,
    die Scrollposition bleibt aber, wo sie war - und zeigt danach auf einen
    Punkt unterhalb der Karte. Wer unten am Knopf stand, sah nach dem Klick
    den Abschnitt HINTER dem Formular.

    Ohne `behavior`, mit Absicht: Der Wert faellt damit auf `scroll-behavior`
    aus dem Stylesheet zurueck. Das ist normal `smooth`, bei "weniger
    Bewegung" (und bei prefers-reduced-motion) aber `auto` - siehe
    globals.css. Ein fest gesetztes `smooth` wuerde diese Einstellung
    uebergehen.

    Nur scrollen, den Fokus bewusst NICHT setzen. Das waere die uebliche
    Ergaenzung, verlangt hier aber, den Fokusrahmen der Karte zu
    unterdruecken - und den zeichnet globals.css absichtlich auf alles, was
    Fokus bekommt ("Fokus: immer sichtbar, nie wegoptimiert"). Ein 3 px
    starker Rahmen um eine Dankesmeldung sieht aus wie eine Warnung; die
    Regel dafuer auszuhebeln waere der schlechtere Tausch. Angesagt wird die
    Karte ohnehin: `role="status"` meldet ihren Inhalt von selbst.
  */
  useEffect(() => {
    if (zustand !== "gesendet") return;
    bestaetigung.current?.scrollIntoView({ block: "center" });
  }, [zustand]);

  /*
    Von "Rückruf anfragen" auf der Ablauf-Seite kommt man mit `#formular`
    in der Adresse direkt hier an. Der Browser springt zum Anker von allein
    - zusaetzlich wandert der Fokus ins erste Feld, damit sofort losgetippt
    werden kann, ohne erst hinzuklicken.

    `document.getElementById("formular")` statt eines eigenen Ankers auf
    dem Formular selbst: Nur die Kontaktseite umschliesst das Formular mit
    dieser id (siehe app/kontakt/page.tsx); die kompakte Fassung auf der
    Startseite hat keine und bleibt damit unberuehrt, selbst wenn dort aus
    irgendeinem Grund derselbe Hash in der Adresse stuende.
  */
  useEffect(() => {
    if (window.location.hash !== "#formular") return;
    const ziel = document.getElementById("formular");
    if (!ziel || !formular.current || !ziel.contains(formular.current)) return;

    formular.current
      .querySelector<HTMLElement>('[name="name"]')
      ?.focus({ preventScroll: true });
  }, []);

  const absenden = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const daten = new FormData(e.currentTarget);

    const neueFehler: Record<string, string> = {};
    for (const feld of PFLICHT) {
      if (!String(daten.get(feld) ?? "").trim()) {
        neueFehler[feld] = "Bitte ausfüllen";
      }
    }
    if (!daten.get("datenschutz")) {
      neueFehler.datenschutz = "Bitte bestätigen";
    }

    setzeFehler(neueFehler);
    if (Object.keys(neueFehler).length > 0) {
      setzeMeldung("Bitte ergänzen Sie die markierten Felder.");
      // Zum ersten fehlenden Feld springen, damit niemand suchen muss.
      const erstes = Object.keys(neueFehler)[0];
      formular.current
        ?.querySelector<HTMLElement>(`[name="${erstes}"]`)
        ?.focus();
      return;
    }

    daten.set("verweildauer", String(Date.now() - geoeffnet.current));
    setzeZustand("sendet");
    setzeMeldung("Wird gesendet …");

    /*
      Nur der Netzwerkteil steht im try. Alles danach - Zurücksetzen der
      Felder, Toast - liegt bewusst ausserhalb.

      Grund: Hier stand einmal `e.currentTarget.reset()` INNERHALB des try,
      hinter dem `await`. React setzt `currentTarget` nach dem synchronen
      Durchlauf des Handlers auf null; nach einem `await` greift der Zugriff
      also ins Leere und wirft. Dieser Wurf landete im catch darunter, das
      den gerade gesetzten Erfolg wieder auf "fehler" drehte. Die Mail war
      laengst raus - das Formular meldete trotzdem einen Fehlschlag.
      Deshalb: Formular ueber die ref ansprechen, und im try steht nichts,
      was nach erfolgreichem Versand noch scheitern koennte.
    */
    let ergebnis: { emailBestaetigt?: boolean } | null = null;

    try {
      const antwort = await fetch("/kontakt.php", {
        method: "POST",
        body: daten,
        headers: { "X-Angefordert-Mit": "fetch" },
      });

      if (antwort.status === 429) {
        /*
          429 ist kein Fehlschlag, sondern die Sperre gegen doppeltes Senden -
          sie greift in kontakt.php erst NACH einem geglueckten Versand (siehe
          SPERRE dort). Fuer die absendende Person ist das Ergebnis damit
          genau dasselbe wie bei einem frischen Versand: Die Nachricht liegt
          in der Praxis. Deshalb dieselbe Bestaetigung wie sonst auch - ein
          Sonderfall im Formular waere ein Sonderfall, den es fuer die
          absendende Person gar nicht gibt.
        */
        setzeZustand("gesendet");
        setzeMeldung(ERFOLG);
        formular.current?.reset();
        return;
      }

      if (!antwort.ok) {
        /*
          kontakt.php schickt zu jedem echten Fehlschlag einen verstaendlichen
          deutschen Satz mit - etwa welches Pflichtfeld fehlt. Den zeigen wir,
          statt ihn wegzuwerfen.
        */
        const text = (await antwort.text().catch(() => "")).trim();
        setzeZustand("fehler");
        setzeMeldung(
          text !== "" && text.length < 300
            ? text
            : "Das Senden hat nicht geklappt. Bitte rufen Sie an oder schreiben Sie eine E-Mail.",
        );
        return;
      }

      ergebnis = await antwort.json().catch(() => null);
    } catch {
      setzeZustand("fehler");
      setzeMeldung(
        "Das Senden hat nicht geklappt. Bitte rufen Sie an oder schreiben Sie eine E-Mail.",
      );
      return;
    }

    setzeZustand("gesendet");
    setzeMeldung(ERFOLG);
    if (ergebnis?.emailBestaetigt) {
      setzeZeigeToast(true);
    }
    formular.current?.reset();
  };

  const toast = zeigeToast ? (
    <div
      role="status"
      className="fixed inset-x-0 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-50 flex justify-center px-4 sm:bottom-6"
    >
      <p className="inline-flex items-center gap-2.5 rounded-full bg-[#1b3535] px-5 py-3 text-[0.9rem] text-[color:var(--marke-offwhite)] shadow-lg">
        <Mail className="size-4 flex-none" aria-hidden="true" />
        E-Mail wurde versendet
      </p>
    </div>
  ) : null;

  if (zustand === "gesendet") {
    return (
      <>
        {toast}
        {/*
          `scroll-mt-...` haelt die Karte unter der klebenden Kopfzeile frei,
          falls der Browser sie doch am oberen Rand ausrichtet - dieselbe
          Rechnung wie beim Anker auf der Kontaktseite.
        */}
        <div
          ref={bestaetigung}
          role="status"
          className="scroll-mt-[calc(var(--kopf-hoehe,7.5rem)+1rem)] rounded-lg border border-aktion bg-grund-warm p-[clamp(1.75rem,4vw,2.5rem)]"
        >
          <h3 className="schrift-display titel-klein">
            Danke für Ihre Nachricht
          </h3>
          <p className="lesespalte mt-4">{meldung}</p>
          <button
            type="button"
            onClick={() => {
              setzeZustand("leer");
              setzeMeldung("");
              setzeZeigeToast(false);
            }}
            className="mt-7 text-aktion underline underline-offset-4"
          >
            Noch eine Nachricht schreiben
          </button>
        </div>
      </>
    );
  }

  return (
    <form
      ref={formular}
      action="/kontakt.php"
      method="post"
      onSubmit={absenden}
      noValidate
      className="flex flex-col gap-6 sm:gap-8"
    >
      {/* Honigtopf. Nicht per display:none versteckt, sonst überspringen ihn
          manche Bots gezielt - stattdessen aus dem Sichtfeld geschoben und
          für Screenreader ausgeblendet. */}
      <div className="honigtopf" aria-hidden="true">
        <label htmlFor="webseite">Diese Zeile bitte frei lassen</label>
        <input
          id="webseite"
          name="webseite"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <Feld
        name="name"
        marke="Ihr Name"
        autoComplete="name"
        fehler={fehler.name}
        pflicht
      />

      {/*
        Beide Beschriftungen muessen einzeilig bleiben, sonst stehen die
        Eingabefelder nebeneinander auf verschiedenen Hoehen - "Telefon fuer
        den Rueckruf" brach in der schmalen Spalte der Startseite genau so um
        und schob das Feld eine Zeile tiefer als sein Nachbar. Der Zusatz
        steht deshalb als Hinweis unter dem Feld, wo er ohnehin besser sitzt.

        Aus demselben Grund haben BEIDE Felder einen Hinweis: Haette nur eins
        einen, endete die Spalte darunter auf unterschiedlicher Hoehe.
      */}
      <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
        <Feld
          name="telefon"
          marke="Telefon"
          typ="tel"
          autoComplete="tel"
          hinweis="Für den Rückruf"
          fehler={fehler.telefon}
          pflicht
        />
        <Feld
          name="ort"
          marke="Wohnort"
          autoComplete="address-level2"
          hinweis="Für die Routenplanung"
          fehler={fehler.ort}
          pflicht
        />
      </div>

      {/*
        Auch in der Kurzfassung, obwohl sie sonst nur Pflichtfelder zeigt:
        Ohne Adresse kann kontakt.php keine Eingangsbestaetigung schicken -
        das Feld ist die einzige Stelle, an der sie ueberhaupt entstehen
        kann. Es bleibt optional, "drei Angaben genuegen" stimmt also
        weiterhin; wer nichts eintraegt, bekommt einfach nur den Rueckruf.
      */}
      <Feld
        name="email"
        marke="E-Mail (optional)"
        typ="email"
        autoComplete="email"
        hinweis="Für eine Bestätigung per E-Mail"
      />

      {kompakt ? null : (
        <>
          <div>
            <label htmlFor="zeit" className="feld-marke">
              Wann rufe ich am besten an?
            </label>
            <select id="zeit" name="zeit" className="feld mt-2.5 min-h-[3rem]">
              <option value="egal">Egal, ich gehe immer ran</option>
              <option value="vormittags">Vormittags</option>
              <option value="nachmittags">Nachmittags</option>
              <option value="abends">Abends ab 17 Uhr</option>
            </select>
          </div>

          <div>
            <label htmlFor="nachricht" className="feld-marke">
              Worum geht es? <span className="normal-case">(optional)</span>
            </label>
            <textarea
              id="nachricht"
              name="nachricht"
              rows={4}
              className="feld mt-2.5 resize-y"
              aria-describedby="nachricht-hinweis"
            />
            <p
              id="nachricht-hinweis"
              className="mt-2.5 text-[0.85rem] text-leise"
            >
              Ein Stichwort genügt. Bitte schreiben Sie hier keine
              Gesundheitsdaten — darüber sprechen wir am Telefon.
            </p>
          </div>
        </>
      )}

      <div>
        <label
          className={cn(
            "flex cursor-pointer items-start gap-4",
            fehler.datenschutz && "text-[#9a3412]",
          )}
        >
          <input
            type="checkbox"
            name="datenschutz"
            value="ja"
            aria-invalid={fehler.datenschutz ? true : undefined}
            className="mt-0.5 size-6 flex-none accent-[var(--ui-aktion)]"
          />
          <span className="text-[0.95rem]">
            Ich bin damit einverstanden, dass meine Angaben zur Bearbeitung
            meiner Anfrage gespeichert werden.{" "}
            <a href="/datenschutz/" className="underline underline-offset-4">
              Datenschutzerklärung
            </a>
          </span>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <button
          type="submit"
          disabled={zustand === "sendet"}
          className="inline-flex min-h-[3.25rem] items-center justify-center gap-2.5 rounded-full bg-aktion px-7 font-medium text-[color:var(--marke-offwhite)] transition-colors hover:bg-aktion-hover disabled:opacity-60"
        >
          {zustand === "sendet" ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="size-4" aria-hidden="true" />
          )}
          Rückruf anfragen
        </button>

        {/* Meldungen werden angesagt, nicht nur angezeigt. */}
        <p
          role="status"
          aria-live="polite"
          className={cn(
            "text-[0.95rem]",
            zustand === "fehler" ? "text-[#9a3412]" : "text-leise",
          )}
        >
          {meldung}
        </p>
      </div>
    </form>
  );
}

function Feld({
  name,
  marke,
  typ = "text",
  autoComplete,
  hinweis,
  fehler,
  pflicht = false,
}: {
  name: string;
  marke: string;
  typ?: string;
  autoComplete?: string;
  hinweis?: string;
  fehler?: string;
  pflicht?: boolean;
}) {
  const hinweisId = hinweis ? `${name}-hinweis` : undefined;
  const fehlerId = fehler ? `${name}-fehler` : undefined;
  const beschrieben = [hinweisId, fehlerId].filter(Boolean).join(" ");

  return (
    <div>
      <label htmlFor={name} className="feld-marke">
        {marke}
        {pflicht ? <span aria-hidden="true"> *</span> : null}
      </label>
      <input
        id={name}
        name={name}
        type={typ}
        autoComplete={autoComplete}
        required={pflicht}
        aria-invalid={fehler ? true : undefined}
        aria-describedby={beschrieben || undefined}
        className="feld mt-2.5"
      />
      {hinweis ? (
        <p id={hinweisId} className="mt-2 text-[0.85rem] text-leise">
          {hinweis}
        </p>
      ) : null}
      {fehler ? (
        <p id={fehlerId} className="mt-2 text-[0.85rem] text-[#9a3412]">
          {fehler}
        </p>
      ) : null}
    </div>
  );
}
