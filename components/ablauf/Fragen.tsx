"use client";

import type { Fragen } from "@/lib/content/typen";

import * as Accordion from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import { fragen as fragenDe } from "@/lib/content/ablauf";

/**
 * Häufige Fragen als Aufklappliste.
 *
 * Radix bringt die Tastaturbedienung und die ARIA-Verknüpfung mit; die
 * Aufklapp-Bewegung laeuft ueber CSS-Variablen, die Radix setzt, und wird bei
 * "weniger Bewegung" durch die globale Regel in globals.css stillgelegt.
 *
 * `type="multiple"` mit Absicht: Wer zwei Fragen vergleichen will, soll nicht
 * beim Aufklappen der zweiten die erste verlieren.
 */
/*
  Inhalt als Parameter, deutscher Inhalt als Vorgabe - damit rendert
  derselbe Baustein beide Sprachen. Siehe lib/content/typen.ts.
*/
export default function Fragen({
  fragen = fragenDe,
}: {
  fragen?: Fragen;
} = {}) {
  return (
    <Accordion.Root type="multiple" className="border-t border-linie-fein">
      {fragen.liste.map((eintrag) => (
        <Accordion.Item
          key={eintrag.frage}
          value={eintrag.frage}
          className="border-b border-linie-fein"
        >
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full items-start justify-between gap-6 py-6 text-left transition-colors hover:text-aktion">
              <span className="schrift-display text-[1.2rem] leading-snug">
                {eintrag.frage}
              </span>
              <span
                aria-hidden="true"
                className="mt-0.5 flex size-8 flex-none items-center justify-center rounded-full border border-linie transition-transform duration-300 group-data-[state=open]:rotate-45"
              >
                <Plus className="size-4" />
              </span>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden data-[state=closed]:animate-[zu_240ms_ease] data-[state=open]:animate-[auf_320ms_ease]">
            <p className="lesespalte-weit pr-14 pb-7 text-[1rem] text-leise">
              {eintrag.antwort}
            </p>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
