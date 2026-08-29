import { MessageSquare } from "lucide-react";
import { kontakt } from "@/lib/site-config";
import { cn } from "@/lib/utils";

/**
 * Absprung in die SMS-App.
 *
 * Ersetzt den frueheren WhatsApp-Knopf. Begruendung steht bei `kontakt.sms`
 * in lib/site-config.ts - kurz: WhatsApp gleicht das Adressbuch mit
 * Meta-Servern ab und uebertraegt damit Rufnummern Dritter, und fuer
 * Gesundheitsdaten fehlt der Auftragsverarbeitungsvertrag.
 *
 * Der Vorteil gegenueber Signal oder Threema ist die Huerde: SMS ist auf
 * jedem Geraet vorhanden, es muss nichts installiert und nichts eingerichtet
 * werden. Genau das war der Grund, warum WhatsApp hier ueberhaupt stand.
 *
 * `sms:` ohne Textvorbelegung - der `?body=`-Zusatz wird von iOS und Android
 * unterschiedlich interpretiert (Semikolon vs. Fragezeichen als Trenner) und
 * landet je nach Geraet als sichtbarer Muell im Feld. Ein leeres Feld ist
 * verlaesslicher als eine Vorlage, die auf der Haelfte der Telefone bricht.
 */
export default function SmsKnopf({
  nurSymbol = false,
  className,
}: {
  nurSymbol?: boolean;
  className?: string;
}) {
  return (
    <a
      href={kontakt.sms}
      aria-label={`SMS an ${kontakt.mobilAnzeige} schreiben`}
      className={cn(
        "inline-flex items-center justify-center gap-2.5 font-medium transition-colors",
        nurSymbol
          ? "size-11 flex-none rounded-full border"
          : "min-h-[3rem] rounded-full border px-5 text-[0.95rem]",
        "border-linie text-aktion hover:border-aktion hover:bg-grund-warm",
        className,
      )}
    >
      <MessageSquare
        className={nurSymbol ? "size-[1.05rem]" : "size-4"}
        aria-hidden="true"
      />
      {nurSymbol ? null : <span>SMS</span>}
    </a>
  );
}
