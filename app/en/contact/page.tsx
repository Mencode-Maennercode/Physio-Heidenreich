import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageSquare, Phone, ShieldAlert, Smartphone } from "lucide-react";
import Einsatzgebiet from "@/components/Einsatzgebiet";
import GcSeitenKopf from "@/components/golden-calm/GcSeitenKopf";
import { Enthuellen } from "@/components/motion/Enthuellen";
import { einsatzgebiet, kontakt } from "@/lib/site-config";

export const metadata: Metadata = {
  title: {
    absolute: "Contact | Physiotherapy Ahrweiler District",
  },
  alternates: {
    canonical: "/en/contact/",
    languages: { "de-DE": "/kontakt/", en: "/en/contact/" },
  },
  description:
    "Request a physiotherapy home visit in the Ahrweiler district. By phone, text message or e-mail. English spoken.",
};

/**
 * Englische Kontaktseite.
 *
 * Bewusst ohne das Formular: Das Formular versendet ueber kontakt.php mit
 * deutschen Feldnamen und deutschen Bestaetigungstexten. Ein englisch
 * beschriftetes Formular, das eine deutsche Danke-Seite zeigt, waere
 * schlechter als gar keines - und die drei direkten Wege reichen hier
 * vollstaendig aus. Wer lieber schreibt, findet die E-Mail-Adresse.
 *
 * Die Zeilen sind dieselbe Liste wie auf der deutschen Kontaktseite: alle
 * Wege gleich aufgebaut, damit keiner wichtiger aussieht als er ist -
 * ausser dem Festnetz, das als einziges eine gefuellte Marke traegt.
 */

const WEGE = [
  {
    marke: "Landline",
    wert: kontakt.telefonAnzeige,
    href: `tel:${kontakt.telefonLink}`,
    symbol: Phone,
    stark: true,
  },
  {
    marke: "Mobile",
    wert: kontakt.mobilAnzeige,
    href: `tel:${kontakt.mobilLink}`,
    symbol: Smartphone,
    stark: false,
  },
  {
    marke: "Text message",
    wert: kontakt.mobilAnzeige,
    href: kontakt.sms,
    symbol: MessageSquare,
    stark: false,
  },
  {
    marke: "E-mail",
    wert: kontakt.email,
    href: `mailto:${kontakt.email}`,
    symbol: Mail,
    stark: false,
  },
] as const;

export default function ContactPage() {
  return (
    <div lang="en" className="gc-kontext" data-gc>
      <GcSeitenKopf
        kicker="Contact"
        titel="Request a home visit"
        text="Call, write a text message or send an e-mail. I speak English, German and Dutch."
      />

      <section className="sektion">
        <div className="huelle grid min-w-0 items-start gap-[clamp(2.5rem,6vw,5rem)] lg:grid-cols-[1fr_0.9fr]">
          <div className="min-w-0">
            <ul className="divide-y divide-linie-fein border-y border-linie-fein">
              {WEGE.map((weg) => {
                const Symbol = weg.symbol;
                return (
                  <li key={weg.marke}>
                    <a
                      href={weg.href}
                      className="grid min-h-[4.5rem] grid-cols-[auto_minmax(0,7rem)_1fr] items-center gap-5 py-5 transition-colors hover:text-aktion"
                    >
                      <span
                        aria-hidden="true"
                        className={
                          weg.stark
                            ? "flex size-10 flex-none items-center justify-center rounded-full bg-aktion text-[color:var(--marke-offwhite)]"
                            : "flex size-10 flex-none items-center justify-center rounded-full border border-linie text-aktion"
                        }
                      >
                        <Symbol className="size-[1.05rem]" />
                      </span>
                      <span className="feld-marke">{weg.marke}</span>
                      <span className="min-w-0 text-[1.05rem] break-words">
                        {weg.wert}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>

            <h2 className="feld-marke mt-12">When to reach me</h2>
            <ul className="mt-4 divide-y divide-linie-fein border-y border-linie-fein">
              <li className="grid grid-cols-[minmax(0,10rem)_1fr] gap-5 py-4">
                <span className="text-leise">Monday to Friday</span>
                <span>8 am – 6 pm</span>
              </li>
              <li className="grid grid-cols-[minmax(0,10rem)_1fr] gap-5 py-4">
                <span className="text-leise">Outside those hours</span>
                <span>Answering machine — I call back</span>
              </li>
            </ul>

            <p className="mt-10 flex gap-3.5 text-[0.95rem] text-leise">
              <ShieldAlert
                className="size-5 flex-none translate-y-0.5"
                aria-hidden="true"
              />
              <span className="lesespalte-weit">
                Please do not send health information by text message or
                e-mail. Neither is end-to-end encrypted, and as a health
                professional I am bound by confidentiality. We discuss anything
                medical on the phone.
              </span>
            </p>
          </div>

          <div
            className="rounded-[24px] p-[clamp(1.5rem,4vw,2.5rem)]"
            style={{
              background: "var(--gc-bg-sekundaer)",
              boxShadow: "var(--gc-schatten-weich)",
            }}
          >
            <h2 className="schrift-display titel-klein">Before you call</h2>
            <p className="mt-4 text-[1rem] text-leise">
              Three things help me answer straight away:
            </p>
            <ol className="mt-6 flex flex-col gap-4 text-[1rem]">
              <li className="flex gap-4">
                <span className="feld-marke flex-none pt-0.5">01</span>
                <span>Who is it about, and what has happened?</span>
              </li>
              <li className="flex gap-4">
                <span className="feld-marke flex-none pt-0.5">02</span>
                <span>Which town do you live in?</span>
              </li>
              <li className="flex gap-4">
                <span className="feld-marke flex-none pt-0.5">03</span>
                <span>Is there a doctor&rsquo;s prescription?</span>
              </li>
            </ol>

            <p className="mt-8 border-t border-linie pt-6 text-[0.95rem] text-leise">
              A reminder, so that no one is disappointed later:{" "}
              <strong className="font-medium">
                I do not bill statutory health insurance funds
              </strong>{" "}
              (gesetzliche Krankenkassen).{" "}
              <Link
                href="/en/how-it-works/"
                className="underline underline-offset-4"
              >
                How fees work
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="sektion">
        <div className="huelle">
          <h2 className="schrift-display titel-mittel max-w-[18ch]">
            Where I come
          </h2>
          <p className="lesespalte-weit mt-6 text-leise">
            The Ahrweiler district: {einsatzgebiet.kern.join(", ")}.
            Appointments are arranged along connected driving routes — that is
            why I ask where you live first.
          </p>
        </div>
        <div className="auf-warm mt-12">
          <div className="huelle py-[clamp(3rem,6vw,5rem)]">
            <Enthuellen>
              <Einsatzgebiet />
            </Enthuellen>
          </div>
        </div>
      </section>
    </div>
  );
}
