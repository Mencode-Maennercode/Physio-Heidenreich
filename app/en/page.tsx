import type { Metadata } from "next";
import Link from "next/link";
import { Phone, Mail, MessageSquare } from "lucide-react";
import { einsatzgebiet, grade, kontakt, seite } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Physiotherapy at Home – Ahrweiler District",
  description:
    "Physiotherapy home visits in the Ahrweiler district for privately insured patients and self-payers. Neurological rehabilitation, post-operative care, lymphatic drainage. English spoken.",
  alternates: {
    canonical: "/en/",
    languages: { "de-DE": "/", en: "/en/" },
  },
  openGraph: {
    locale: "en_GB",
    title: "Physiotherapy at Home – Ahrweiler District",
    description:
      "Physiotherapy home visits for privately insured patients and self-payers in the Ahrweiler district.",
  },
};

/**
 * Englische Fassung - EINE Seite, nicht die gespiegelte Website.
 *
 * Die Begruendung steht ausfuehrlich in components/Sprachwahl.tsx. Kurz: Die
 * Praxis arbeitet im Kreis Ahrweiler und wird auf Deutsch gesucht. Eine
 * vollstaendig gespiegelte englische Seite wuerde dieselbe Bedeutung auf
 * zwei Adressen verteilen und die deutsche Seite schwaechen, ohne dass ein
 * nennenswerter Teil der Patientinnen und Patienten etwas davon haette.
 *
 * Diese Seite deckt dafuer alles ab, was jemand ohne Deutschkenntnisse
 * wirklich braucht, um eine Entscheidung zu treffen und anzurufen -
 * einschliesslich des unbequemen Punktes, dass gesetzliche Kassen nicht
 * abgerechnet werden.
 *
 * `lang="en"` sitzt am Rahmen dieser Seite, damit Vorlesesoftware nicht
 * versucht, englischen Text mit deutscher Aussprache vorzulesen. Das ist
 * kein Detail: Ohne die Angabe ist der Text fuer blinde Nutzer praktisch
 * unverstaendlich.
 */

function Block({
  titel,
  children,
}: {
  titel: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-linie pt-9">
      <h2 className="schrift-display text-[clamp(1.5rem,2.8vw,2rem)] leading-tight">
        {titel}
      </h2>
      <div className="mt-5 flex flex-col gap-4 text-[1.05rem] leading-[1.7]">
        {children}
      </div>
    </section>
  );
}

export default function EnglishPage() {
  return (
    <article lang="en" className="pt-[8.5rem] pb-[var(--sektion-luft)]">
      <div className="huelle-eng">
        <p className="augenbraue">English</p>
        <h1 className="schrift-display titel-mittel mt-6 max-w-[20ch]">
          Physiotherapy in your own home
        </h1>
        <p className="mt-6 max-w-[36rem] text-[1.2rem] leading-[1.65]">
          I am {seite.name}, a physiotherapist working exclusively through home
          visits in the Ahrweiler district. I speak English, German and Dutch.
        </p>

        <div className="mt-14 flex flex-col gap-12">
          <Block titel="What I do">
            <p>
              I treat adults at home — after a stroke, with Parkinson&rsquo;s
              disease or multiple sclerosis, after surgery, and for long-term
              conditions that make leaving the house difficult.
            </p>
            <p>
              My main focus is neurological rehabilitation, but I cover the full
              range of physiotherapy: exercise therapy, mobilisation of joints
              and muscles, post-operative care, fall prevention and gait
              training, manual lymphatic drainage and kinesio taping. I also
              show relatives the handling techniques they need day to day.
            </p>
            <p>
              Everything needed for the treatment is brought with me, including
              a mobile treatment table.
            </p>
          </Block>

          <Block titel="Where I work">
            <p>
              The Ahrweiler district: {einsatzgebiet.kern.join(", ")}.
            </p>
            <p>
              Appointments are arranged along connected driving routes, so the
              first thing I ask on the phone is where you live. There are no
              practice rooms — I come to you.
            </p>
          </Block>

          <Block titel="Costs and insurance">
            <p>
              <strong>
                I do not bill German statutory health insurance funds
                (gesetzliche Krankenkassen).
              </strong>{" "}
              If you are insured that way, treatment is still possible, but you
              pay privately and will not be reimbursed.
            </p>
            <p>
              <strong>Privately insured patients</strong> and those entitled to{" "}
              <strong>Beihilfe</strong> receive an invoice from me, pay it, and
              submit it to their insurer. How much is reimbursed depends on your
              policy — home visits and travel costs are covered by most, but not
              all.
            </p>
            <p>
              There are no prices on this website on purpose. Duration,
              frequency and travel distance differ too much for a single figure
              to mean anything. You will be told the exact cost during the free
              telephone consultation, and receive it in writing before any
              appointment takes place.
            </p>
          </Block>

          <Block titel="Do you need a doctor's referral?">
            <p>
              For treatment of a medical condition, yes — a prescription
              (Verordnung or Privatrezept) from your doctor is required by
              German law.
            </p>
            <p>
              For prevention, exercise programmes, advice and instructing
              relatives, no referral is needed.
            </p>
            <p>We can clarify which applies to you on the phone.</p>
          </Block>

          <Block titel="How it works">
            <p>
              <strong>1.</strong> You call, write an SMS or send an e-mail.
            </p>
            <p>
              <strong>2.</strong> We speak for about fifteen minutes, free of
              charge, and decide together whether I am the right fit.
            </p>
            <p>
              <strong>3.</strong> The first appointment at your home: assessment,
              shared goals, first treatment, and a look at the rooms you move
              through every day.
            </p>
            <p>
              <strong>4.</strong> You receive an invoice after the prescribed
              series of treatments is complete.
            </p>
          </Block>

          <Block titel="My background">
            <p>{grade.bachelor}.</p>
            <p>{grade.master}.</p>
            <p>
              Several years in hospitals, including the neurological intensive
              care unit at Münster University Hospital, an orthopaedic ward, and
              work in palliative and hospice care.
            </p>
          </Block>

          <Block titel="What I do not offer">
            <p>No emergency service and no weekend appointments.</p>
            <p>No same-day visits — I plan in fixed routes.</p>
            <p>No medical diagnosis; that stays with your doctor.</p>
            <p>No billing through statutory health insurance.</p>
          </Block>

          <Block titel="Get in touch">
            <p>
              Best reached by phone, Monday to Friday, 8–9 in the morning and
              17–19 in the evening. Outside those hours please leave a message
              and I will call back.
            </p>
            <p>
              Please do not send health information by SMS or e-mail — neither
              is end-to-end encrypted. We discuss anything medical on the phone.
            </p>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={`tel:${kontakt.telefonLink}`}
                className="inline-flex min-h-[3.25rem] items-center justify-center gap-3 rounded-full bg-aktion px-7 font-medium text-[color:var(--marke-offwhite)]"
              >
                <Phone className="size-4" aria-hidden="true" />
                {kontakt.telefonAnzeige}
              </a>
              <a
                href={kontakt.sms}
                className="inline-flex min-h-[3.25rem] items-center justify-center gap-3 rounded-full border border-linie px-7 transition-colors hover:border-aktion"
              >
                <MessageSquare className="size-4" aria-hidden="true" />
                SMS
              </a>
              <a
                href={`mailto:${kontakt.email}`}
                className="inline-flex min-h-[3.25rem] items-center justify-center gap-3 rounded-full border border-linie px-7 transition-colors hover:border-aktion"
              >
                <Mail className="size-4" aria-hidden="true" />
                E-mail
              </a>
            </div>
          </Block>

          <Block titel="Emergencies">
            <p>
              This website is not an emergency service. In an emergency call{" "}
              <a
                href="tel:112"
                className="font-medium text-aktion underline underline-offset-4"
              >
                112
              </a>
              . For urgent but non-critical medical advice, the on-call medical
              service is{" "}
              <a
                href="tel:116117"
                className="font-medium text-aktion underline underline-offset-4"
              >
                116 117
              </a>
              .
            </p>
          </Block>
        </div>

        <p className="mt-14 text-[1.05rem]">
          <Link href="/" hrefLang="de" className="text-aktion underline underline-offset-4">
            Zur deutschen Seite — the full website in German
          </Link>
        </p>
      </div>
    </article>
  );
}
