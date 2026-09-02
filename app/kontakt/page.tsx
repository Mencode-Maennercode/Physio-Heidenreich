import type { Metadata } from "next";
import Brotkrumen from "@/components/Brotkrumen";
import { Mail, MessageSquare, Phone, ShieldAlert, Smartphone } from "lucide-react";
import Einsatzgebiet from "@/components/Einsatzgebiet";
import Formular from "@/components/kontakt/Formular";
import { Enthuellen } from "@/components/motion/Enthuellen";
import { kontakt, terminstatus } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Termin anfragen",
  alternates: {
    canonical: "/kontakt/",
    languages: { "de-DE": "/kontakt/", en: "/en/contact/" },
  },
  description:
    "Telefonisch, per SMS oder über das Formular. Hausbesuche im Kreis Ahrweiler — Rückruf zur gewünschten Zeit.",
};

export default function KontaktSeite() {
  return (
    <div className="gc-kontext" data-gc>
      <Brotkrumen titel="Kontakt" pfad="/kontakt/" />

      <section
        className="bg-grund-warm pb-[clamp(3rem,6vw,4.5rem)]"
        style={{ paddingTop: "calc(var(--kopf-hoehe, 7.5rem) + 2.5rem)" }}
      >
        <div className="huelle">
          <p className="augenbraue">Kontakt</p>
          <h1 className="schrift-display titel-gross mt-7 max-w-[14ch]">
            Am schnellsten geht es am Telefon
          </h1>
          <p className="lesespalte-weit mt-7 text-[1.1rem]">
            Fünfzehn Minuten, kostenlos und unverbindlich. Danach wissen wir
            beide, ob es passt.
          </p>

          {terminstatus ? (
            <p className="mt-8 inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-full border border-linie px-5 py-2.5 text-[0.9rem]">
              <span
                aria-hidden="true"
                className="size-2 rounded-full bg-aktion"
              />
              {terminstatus.text}
              <span className="text-leise">{terminstatus.stand}</span>
            </p>
          ) : null}
        </div>
      </section>

      {/* ------------------------------------------------------------------
          Kontaktwege und Formular.

          Vorher standen links fuenf verschieden gestaltete Bloecke
          untereinander: die Wege als Kartenstapel, der Messenger als frei
          schwebender Knopf, die Erreichbarkeit als lose Liste, ein Hinweis im
          gefuellten Kasten und darunter ein Foto ohne Aussage. Fuenf Formen
          fuer vier Angaben - das war das Ueberladene daran, nicht die Menge.

          Jetzt gibt es links genau eine Form: eine Liste. Alle vier Wege -
          Festnetz, Mobil, SMS, E-Mail - liegen als gleich gebaute Zeilen
          darin, der Messenger-Weg eingeschlossen statt daneben. Darunter die
          Erreichbarkeit im selben Zeilenraster. Das dekorative Foto ist
          entfallen: Es trug nichts bei und liess die Spalte unten ausfransen.

          Festnetz behaelt als einzige Zeile die gefuellte Marke und die
          groessere Schrift - ein erheblicher Teil der Anfragen kommt von
          Menschen, die anrufen. Das ist Rangfolge, nicht Dekoration.
          ------------------------------------------------------------------ */}
      <section className="sektion">
        <div className="huelle grid items-start gap-[clamp(2.5rem,6vw,5rem)] lg:grid-cols-[1fr_1.1fr]">
          <div className="min-w-0">
            <h2 className="feld-marke">So erreichen Sie mich</h2>

            <ul className="mt-5 flex flex-col divide-y divide-linie-fein border-y border-linie-fein">
              <li>
                <a
                  href={`tel:${kontakt.telefonLink}`}
                  className="flex items-center gap-5 py-5 transition-colors hover:bg-grund-warm"
                >
                  <span className="flex size-11 flex-none items-center justify-center rounded-full bg-aktion text-[color:var(--marke-offwhite)]">
                    <Phone className="size-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="feld-marke">Festnetz</span>
                    <span className="schrift-display mt-1 block text-[1.5rem] leading-none">
                      {kontakt.telefonAnzeige}
                    </span>
                  </span>
                </a>
              </li>

              <li>
                <a
                  href={`tel:${kontakt.mobilLink}`}
                  className="flex items-center gap-5 py-5 transition-colors hover:bg-grund-warm"
                >
                  <span className="flex size-11 flex-none items-center justify-center rounded-full border border-linie text-aktion">
                    <Smartphone className="size-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="feld-marke">Mobil</span>
                    <span className="mt-1 block text-[1.1rem] leading-none">
                      {kontakt.mobilAnzeige}
                    </span>
                  </span>
                </a>
              </li>

              <li>
                <a
                  href={kontakt.sms}
                  className="flex items-center gap-5 py-5 transition-colors hover:bg-grund-warm"
                >
                  <span className="flex size-11 flex-none items-center justify-center rounded-full border border-linie text-aktion">
                    <MessageSquare className="size-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="feld-marke">SMS</span>
                    <span className="mt-1 block text-[1.1rem] leading-none">
                      {kontakt.mobilAnzeige}
                    </span>
                  </span>
                </a>
              </li>

              <li>
                <a
                  href={`mailto:${kontakt.email}`}
                  className="flex items-center gap-5 py-5 transition-colors hover:bg-grund-warm"
                >
                  <span className="flex size-11 flex-none items-center justify-center rounded-full border border-linie text-aktion">
                    <Mail className="size-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 break-all">
                    <span className="feld-marke">E-Mail</span>
                    <span className="mt-1 block text-[1rem] leading-tight">
                      {kontakt.email}
                    </span>
                  </span>
                </a>
              </li>
            </ul>

            <h2 className="feld-marke mt-10">Erreichbarkeit</h2>
            <ul className="mt-4 flex flex-col divide-y divide-linie-fein border-y border-linie-fein">
              {kontakt.erreichbarkeit.map((zeile) => (
                <li
                  key={zeile.zeit}
                  className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3.5"
                >
                  <span className="font-medium">{zeile.zeit}</span>
                  <span className="text-[0.95rem] text-leise">
                    {zeile.detail}
                  </span>
                </li>
              ))}
            </ul>

            {/* Der Hinweis gehoert genau hierhin: dorthin, wo jemand gerade im
                Begriff ist, eine Diagnose zu tippen. Als gefuellter Kasten war
                er allerdings die auffaelligste Flaeche der Spalte - lauter als
                die Telefonnummer darueber. Als stille Zeile mit Symbol steht
                er da, ohne den Ton der Seite zu kippen. */}
            <p className="mt-8 flex gap-3.5 text-[0.92rem] text-leise">
              <ShieldAlert
                className="size-4 flex-none translate-y-1 text-akzent-warm"
                aria-hidden="true"
              />
              <span>
                Bitte schicken Sie mir keine Gesundheitsdaten per SMS, E-Mail
                oder über das Formular. Diese Wege sind dafür nicht sicher
                genug. Alles Medizinische besprechen wir am Telefon.
              </span>
            </p>
          </div>

          {/*
            Das Formular sitzt in einer eigenen Karte, wie auf der Startseite.

            Frei auf der Seite stehend war nicht zu erkennen, wo der
            Schreib-Weg anfängt und der Anruf-Weg aufhört - beide Spalten
            liefen in derselben Fläche ineinander. Der abgesetzte Ton
            (––gc-bg-sekundaer statt der Cremefläche der Seite) zieht die
            Grenze, ohne einen Rahmen zeichnen zu müssen.

            Sand statt Weiß: Auf der cremefarbenen Seite wäre eine weiße
            Karte fast unsichtbar und müsste sich allein über ihren Schatten
            behaupten. Der wärmere Ton grenzt sichtbar ab und bleibt trotzdem
            ruhig. Die Eingabefelder tragen ohnehin nur eine Unterstreichung
            und keinen eigenen Füllton, ihnen ist der Untergrund gleich.
          */}
          <div className="min-w-0">
            <Enthuellen>
              <div
                className="rounded-[24px] p-[clamp(1.5rem,4vw,2.5rem)]"
                style={{
                  background: "var(--gc-bg-sekundaer)",
                  boxShadow: "var(--gc-schatten-weich)",
                }}
              >
                <h2 className="schrift-display titel-klein">
                  Oder schreiben Sie mir — ich rufe zurück
                </h2>
                <p className="lesespalte mt-4 text-leise">
                  Besonders für Angehörige, die tagsüber nicht telefonieren
                  können.
                </p>
                <div className="mt-9">
                  <Formular />
                </div>
              </div>
            </Enthuellen>
          </div>
        </div>
      </section>

      <section className="auf-warm sektion">
        <div className="huelle">
          <Enthuellen className="mb-14">
            <p className="augenbraue">Einsatzgebiet</p>
            <h2 className="schrift-display titel-mittel mt-6 max-w-[16ch]">
              Wo ich hinfahre
            </h2>
          </Enthuellen>
          <Einsatzgebiet />
        </div>
      </section>
    </div>
  );
}
