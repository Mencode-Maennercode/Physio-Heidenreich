"use client";

import { useRef, useState } from "react";
import { Loader2, Send } from "lucide-react";
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
   */
  kompakt?: boolean;
}) {
  const [zustand, setzeZustand] = useState<Zustand>("leer");
  const [fehler, setzeFehler] = useState<Record<string, string>>({});
  const [meldung, setzeMeldung] = useState("");
  const geoeffnet = useRef(Date.now());
  const formular = useRef<HTMLFormElement>(null);

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

    try {
      const antwort = await fetch("/kontakt.php", {
        method: "POST",
        body: daten,
        headers: { "X-Angefordert-Mit": "fetch" },
      });
      if (!antwort.ok) throw new Error(String(antwort.status));

      setzeZustand("gesendet");
      setzeMeldung(
        "Ihre Nachricht ist angekommen. Ich melde mich zum gewünschten Zeitpunkt.",
      );
      e.currentTarget.reset();
    } catch {
      setzeZustand("fehler");
      setzeMeldung(
        "Das Senden hat nicht geklappt. Bitte rufen Sie an oder schreiben Sie eine E-Mail.",
      );
    }
  };

  if (zustand === "gesendet") {
    return (
      <div
        role="status"
        className="rounded-lg border border-aktion bg-grund-warm p-[clamp(1.75rem,4vw,2.5rem)]"
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
          }}
          className="mt-7 text-aktion underline underline-offset-4"
        >
          Noch eine Nachricht schreiben
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formular}
      action="/kontakt.php"
      method="post"
      onSubmit={absenden}
      noValidate
      className="flex flex-col gap-8"
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
      <div className="grid gap-8 sm:grid-cols-2">
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

      {kompakt ? null : (
        <>
          <Feld
            name="email"
            marke="E-Mail (optional)"
            typ="email"
            autoComplete="email"
            hinweis="Falls Ihnen eine schriftliche Antwort lieber ist"
          />

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
