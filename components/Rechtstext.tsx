import { cn } from "@/lib/utils";

/**
 * Bausteine für Impressum und Datenschutzerklärung.
 *
 * Diese Seiten liest niemand zum Vergnügen - sie müssen vor allem
 * durchsuchbar sein. Deshalb enge Lesespalte, klare Zwischenüberschriften und
 * keine Animation.
 */

export function Rechtsseite({
  titel,
  stand,
  children,
}: {
  titel: string;
  stand?: string;
  children: React.ReactNode;
}) {
  return (
    <article
      className="pb-[var(--sektion-luft)]"
      style={{ paddingTop: "calc(var(--kopf-hoehe, 7.5rem) + 2.5rem)" }}
    >
      <div className="huelle-eng">
        <h1 className="schrift-display titel-mittel">{titel}</h1>
        {stand ? <p className="mt-4 text-[0.92rem] text-leise">{stand}</p> : null}
        <div className="mt-12 flex flex-col gap-12">{children}</div>
      </div>
    </article>
  );
}

export function Abschnitt({
  titel,
  children,
}: {
  titel: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="schrift-display text-[1.4rem] leading-tight">{titel}</h2>
      {/* Rechtstexte enthalten lange, nicht trennbare Wörter - Paragrafen,
          Gesetzesnamen, E-Mail-Adressen. Ohne Umbruch an beliebiger Stelle
          schiebt eines davon bei großer Schrift die ganze Seite in die Breite. */}
      <div className="lesespalte-weit mt-5 flex flex-col gap-4 text-[1rem] [overflow-wrap:anywhere] hyphens-auto">
        {children}
      </div>
    </section>
  );
}

/**
 * Sichtbar markierte Lücke.
 *
 * Absichtlich auffällig: Eine unvollständige Angabe im Impressum ist
 * abmahnfähig. Solange diese Kästen auf der Seite stehen, darf sie nicht live
 * gehen - das sieht man dann auch.
 */
export function Platzhalter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <mark
      className={cn(
        /* `break-words` ist hier Pflicht, nicht Kosmetik: Platzhaltertexte
           enthalten lange Behoerdennamen und Paragrafenketten. Ohne die
           Angabe ragte die gelbe Markierung auf schmalen Schirmen ueber den
           Textrand hinaus - gemessen mit scripts/geraete.mjs. */
        /* `break-words` ist hier Pflicht, nicht Kosmetik: Platzhaltertexte
           enthalten lange Behoerdennamen und Paragrafenketten.

           Der seitliche Innenabstand ist klein gehalten: Fuellt die
           Markierung eine ganze Zeile, schiebt ihr Innenabstand die farbige
           Flaeche wenige Pixel ueber den Textrand hinaus. Das ist bei
           inline-Elementen mit Innenabstand nicht vermeidbar und faellt
           nur bei den langen Hinweistexten an - sobald die echten Angaben
           eingetragen sind, sind die Markierungen kurz und das Verhalten
           spielt keine Rolle mehr. */
        "rounded-[3px] bg-[#f3e6c9] px-1 py-0.5 text-[color:var(--marke-anthrazit)] decoration-clone break-words hyphens-auto",
        className,
      )}
    >
      {children}
    </mark>
  );
}

export function Liste({ punkte }: { punkte: readonly string[] }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {punkte.map((punkt) => (
        <li key={punkt} className="flex items-baseline gap-3.5">
          <span
            aria-hidden="true"
            className="size-1.5 flex-none translate-y-[-0.15em] rounded-full bg-akzent"
          />
          <span>{punkt}</span>
        </li>
      ))}
    </ul>
  );
}
