"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import KiZeichen from "@/components/KiZeichen";
import { useRuhig } from "@/components/a11y/Einstellungen";
import { KI_VIDEOS } from "@/lib/ki-medien";
import { breiten } from "@/lib/bilder";
import { cn } from "@/lib/utils";

/**
 * Video, das auch stillstehen kann.
 *
 * Bei "weniger Bewegung" wird das Video gar nicht erst geladen - es erscheint
 * nur das Standbild. Das spart nicht nur Reize, sondern auch mehrere Megabyte
 * bei genau den Menschen, die oft die schlechtere Verbindung haben.
 *
 * Der Pause-Knopf ist immer da: Auch wer keine Einstellung vorgenommen hat,
 * muss laufende Bewegung anhalten koennen (WCAG 2.2, Kriterium 2.2.2).
 */
export default function RuhigesVideo({
  name,
  beschreibung,
  className,
  videoKlasse,
  schleife = true,
  bedienbar = true,
  kiKlasse,
}: {
  name: "hero" | "behandlung" | "ablauf";
  /** Was zu sehen ist - fuer alle, die das Bild nicht sehen. */
  beschreibung: string;
  className?: string;
  videoKlasse?: string;
  /**
   * Die Hintergrundclips (Schatten, Haende) sind absichtslose Atmosphaere und
   * loopen deshalb endlos. Das Hero-Video erzaehlt dagegen eine kleine
   * Szene mit einem Schluss (die Person bleibt stehen und laechelt) - ein
   * Loop wuerde genau diesen Moment zerschneiden. Einmal abspielen und auf
   * dem letzten Bild stehen bleiben ist hier die richtige Wahl.
   */
  schleife?: boolean;
  /**
   * Pause-Knopf ausblenden - nur zulaessig, wenn der Clip von sich aus nach
   * weniger als fuenf Sekunden stehen bleibt.
   *
   * WCAG 2.2.2 verlangt eine Anhalte-Moeglichkeit fuer Bewegung, die
   * automatisch startet UND laenger als fuenf Sekunden dauert. Ein Clip, der
   * einmal durchlaeuft und dann steht, faellt bei kurzer Laufzeit nicht
   * darunter - der Knopf ist dann kein Gewinn, sondern nur ein Fleck auf dem
   * Bild. Bei Endlosschleifen bleibt er Pflicht, deshalb ist `true` die
   * Voreinstellung und die Ausnahme muss ausdruecklich gesetzt werden.
   */
  bedienbar?: boolean;
  /**
   * Abweichende Position der KI-Kennzeichnung fuer diesen einen Aufruf.
   *
   * Noetig beim Hero-Video: Dort legt sich auf dem Handy die
   * Merkmalsleiste ueber die untere Bildkante - accessibility-technisch
   * unproblematisch (die Kennzeichnung bleibt im DOM und wird vorgelesen),
   * aber fuer sehende Nutzer nicht mehr an der Stelle sichtbar, an der ein
   * Zeichen "beim ersten Kontakt" auch wahrgenommen werden kann. GcHero.tsx
   * setzt die Ecke fuer diesen Fall auf oben rechts, ausserhalb der
   * Ueberlappung.
   */
  kiKlasse?: string;
}) {
  const ruhig = useRuhig();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [laeuft, setzeLaeuft] = useState(true);

  // Wird die Einstellung waehrend des Besuchs geaendert, soll das Video sofort
  // reagieren - nicht erst beim naechsten Seitenaufruf.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (ruhig) {
      video.pause();
      setzeLaeuft(false);
    }
  }, [ruhig]);

  const poster = `/media/video/${name}-poster.jpg`;

  const standbild = (
    <picture className="absolute inset-0 block">
      <source
        type="image/avif"
        srcSet={breiten
          .map((b) => `/media/video/${name}-poster-${b}.avif ${b}w`)
          .join(", ")}
        sizes="100vw"
      />
      <source
        type="image/webp"
        srcSet={breiten
          .map((b) => `/media/video/${name}-poster-${b}.webp ${b}w`)
          .join(", ")}
        sizes="100vw"
      />
      <img
        src={poster}
        alt={beschreibung}
        className={cn("h-full w-full object-cover", videoKlasse)}
        fetchPriority="high"
        decoding="async"
      />
    </picture>
  );

  /* Auch das Standbild braucht die Kennzeichnung: Bei "weniger Bewegung"
     ist es das Einzige, was zu sehen ist. */
  const ki = KI_VIDEOS.has(name);

  if (ruhig) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        {standbild}
        {ki ? <KiZeichen className={kiKlasse} /> : null}
      </div>
    );
  }

  const umschalten = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
      setzeLaeuft(true);
    } else {
      video.pause();
      setzeLaeuft(false);
    }
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <video
        ref={videoRef}
        className={cn("h-full w-full object-cover", videoKlasse)}
        // Ein Video ohne Ton ist eine bewegte Illustration, keine Medienwiedergabe -
        // deshalb bekommt es keine Bedienleiste, nur den Pause-Knopf unten.
        autoPlay
        muted
        loop={schleife}
        playsInline
        preload="metadata"
        poster={poster}
        aria-label={beschreibung}
        onEnded={() => setzeLaeuft(false)}
      >
        <source src={`/media/video/${name}.mp4`} type="video/mp4" />
      </video>

      {bedienbar ? (
        <button
          type="button"
          onClick={umschalten}
          className="absolute right-4 bottom-4 z-10 flex size-11 items-center justify-center rounded-full border border-white/30 bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-black/55"
          aria-label={laeuft ? "Video anhalten" : "Video abspielen"}
        >
          {laeuft ? (
            <Pause className="size-4" aria-hidden="true" />
          ) : (
            <Play className="size-4" aria-hidden="true" />
          )}
        </button>
      ) : null}

      {ki ? <KiZeichen className={kiKlasse} /> : null}
    </div>
  );
}
