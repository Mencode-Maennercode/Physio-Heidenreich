import Link from "next/link";
import { Mail, Phone, Smartphone } from "lucide-react";
import { Bildmarke } from "./Logo";
import BarrierefreiheitPanel from "./a11y/BarrierefreiheitPanel";
import {
  einsatzgebiet,
  kontakt,
  navigation,
  rechtsnavigation,
  seite,
} from "@/lib/site-config";

function Spaltentitel({ children }: { children: React.ReactNode }) {
  return <h2 className="feld-marke mb-5">{children}</h2>;
}

export default function Fusszeile() {
  return (
    <footer className="auf-warm nicht-drucken">
      <div className="huelle py-[clamp(3.5rem,6vw,5.5rem)]">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <Bildmarke className="size-9 flex-none text-akzent-warm" />
              <span className="flex flex-col leading-none">
                <span className="schrift-display text-[1.15rem] tracking-[0.06em] uppercase">
                  {seite.name}
                </span>
                <span className="mt-1 text-[0.6rem] font-medium tracking-[0.24em] text-leise uppercase">
                  {seite.zusatz}
                </span>
              </span>
            </div>
            <p className="lesespalte mt-6 text-[0.95rem] text-leise">
              {seite.kurzbeschreibung}
            </p>
          </div>

          <div>
            <Spaltentitel>Kontakt</Spaltentitel>
            <ul className="flex flex-col gap-3 text-[0.95rem]">
              <li>
                <a
                  href={`tel:${kontakt.telefonLink}`}
                  className="inline-flex min-h-[2.5rem] items-center gap-3 transition-colors hover:text-akzent-warm"
                >
                  <Phone className="size-4 flex-none" aria-hidden="true" />
                  <span>
                    {kontakt.telefonAnzeige}
                    <span className="block text-[0.78rem] text-leise">
                      Festnetz
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${kontakt.mobilLink}`}
                  className="inline-flex min-h-[2.5rem] items-center gap-3 transition-colors hover:text-akzent-warm"
                >
                  <Smartphone className="size-4 flex-none" aria-hidden="true" />
                  <span>
                    {kontakt.mobilAnzeige}
                    <span className="block text-[0.78rem] text-leise">
                      Mobil und SMS
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${kontakt.email}`}
                  className="inline-flex min-h-[2.5rem] items-center gap-3 [overflow-wrap:anywhere] transition-colors hover:text-akzent-warm"
                >
                  <Mail className="size-4 flex-none" aria-hidden="true" />
                  {kontakt.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <Spaltentitel>Seiten</Spaltentitel>
            <ul className="flex flex-col gap-1 text-[0.95rem]">
              {navigation.map((eintrag) => (
                <li key={eintrag.pfad}>
                  <Link
                    href={eintrag.pfad}
                    className="inline-flex min-h-[2.5rem] items-center text-leise transition-colors hover:text-text"
                  >
                    {eintrag.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Spaltentitel>Einsatzgebiet</Spaltentitel>
            <p className="text-[0.95rem] text-leise">
              {einsatzgebiet.kern.slice(0, 4).join(" · ")} und Umgebung im Kreis
              Ahrweiler.
            </p>
            <div className="mt-6">
              <BarrierefreiheitPanel variante="fuss" />
            </div>
          </div>
        </div>

        <div className="my-10 h-px bg-linie-warm" />

        {/* Notfallhinweis. Gehoert auf jede Seite eines Gesundheitsangebots -
            und zwar dorthin, wo jemand in Panik zuerst hinsieht. */}
        <p className="mb-8 text-[0.9rem] text-leise">
          Diese Seite ist kein Notfalldienst. Bei akuten Notfällen wählen Sie{" "}
          <a
            href="tel:112"
            className="font-medium text-text underline underline-offset-4"
          >
            112
          </a>
          , bei dringenden ärztlichen Fragen außerhalb der Sprechzeiten den
          ärztlichen Bereitschaftsdienst unter{" "}
          <a
            href="tel:116117"
            className="font-medium text-text underline underline-offset-4"
          >
            116 117
          </a>
          .
        </p>

        <div className="flex flex-col gap-4 text-[0.88rem] text-leise sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {seite.nameLang}
          </p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {rechtsnavigation.map((eintrag) => (
              <li key={eintrag.pfad}>
                <Link
                  href={eintrag.pfad}
                  className="inline-flex min-h-[2.5rem] items-center transition-colors hover:text-text"
                >
                  {eintrag.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
