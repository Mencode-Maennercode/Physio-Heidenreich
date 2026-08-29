# Nora Heidenreich – Mobile Physiotherapie

Website für eine mobile Physiotherapie-Praxis im Kreis Ahrweiler.
Statische Next.js-Seite, gedacht für einen netcup-Webspace.

```
npm install
npm run dev        # Entwicklungsserver auf http://localhost:3000
npm run build      # erzeugt ./out mit allen fertigen Dateien
npm run medien     # lädt und optimiert die Platzhalter-Bilder und -Videos
npm run pruefen    # nach dem Bauen: Browsertest + Bildschirmfotos
```

`npm run pruefen` startet einen echten Browser gegen `out/` und meldet
Bilder ohne Alternativtext, zu kleine Tippflächen, übersprungene
Überschriftenebenen, Formularfelder ohne Beschriftung, waagerechtes Scrollen
und zu schwache Kontraste — jeweils in drei Fassungen: Desktop, Handy und
Handy mit 130 % Textgröße plus erhöhtem Kontrast. Die Bildschirmfotos landen
unter `.pruefung/`.

---

## Vor dem Livegang

Diese Liste muss abgearbeitet sein. Solange irgendwo `PLATZHALTER` steht
oder ein gelb markierter Kasten auf Impressum oder Datenschutz sichtbar ist,
darf die Seite nicht online gehen.

### Angaben

- [ ] `lib/site-config.ts`: Telefonnummern, E-Mail, Anschrift, Domain
      *(die eingetragenen Nummern liegen im Bereich, den die Bundesnetzagentur
      für Film und Fiktion reserviert hat — sie gehören also niemandem, sind
      aber auch nicht erreichbar)*
- [ ] `public/kontakt.php`: `EMPFAENGER` und `ABSENDER` setzen.
      Der Absender **muss** eine Adresse der eigenen Domain sein, sonst
      landet die Mail wegen SPF im Spam.
- [ ] Impressum vollständig: Anschrift, verleihender Staat der
      Berufsbezeichnung, zuständiges Gesundheitsamt, Umsatzsteuer-Status,
      Berufshaftpflicht
- [ ] Datenschutzerklärung: Hoster-Anschrift und Löschfrist der Protokolle
- [ ] `lib/content/ueber-mich.ts`: alle `[...]`-Stellen ersetzen —
      Zeiträume, Klinikname, Titel von Bachelor- und Masterarbeit,
      Namen der Fortbildungen

### Rechtliches

- [ ] Impressum und Datenschutz von jemandem prüfen lassen, der
      Rechtsberatung erteilen darf. Bei einem Heilberuf sind die Anforderungen
      höher als bei einer gewöhnlichen Firmenseite.
- [ ] Texte gegen das Heilmittelwerbegesetz durchsehen: keine
      Heilversprechen, keine Erfolgsgeschichten von Patienten, keine
      Vorher-Nachher-Bilder
- [ ] Prüfen, dass **Wachkoma, Palliativ und Hospiz ausschließlich im
      Werdegang** unter „Über mich" vorkommen — nicht in Leistungen, Claim,
      Navigation oder Seitenbeschreibungen
- [ ] Prüfen, dass **beide akademischen Grade überall mit Fachrichtung**
      genannt sind. Ein „M.Sc." ohne Fachangabe auf einer Physiotherapie-Seite
      legt nahe, der Master sei in Physiotherapie — das ist irreführende
      Werbung (§ 3 HWG, § 5 UWG) und ein bekannter Abmahnanlass.

### Medien

- [ ] Alle Bilder und Videos sind Platzhalter von Pexels. Herkunft und
      Lizenz stehen in `public/media/CREDITS.md`.
- [ ] **Das Porträt muss zwingend ersetzt werden.** Auf einer Personenmarke
      ist das Gesicht einer fremden Person das Erste, was auffliegt.
- [ ] Empfehlung: ein halber Tag mit einem Fotografen, in echten Wohnungen.
      Bei einer Personenmarke sind Stockfotos die eine Stelle, an der man den
      Preis einer Website sieht.

### Technik

- [ ] Domain bestellen und auf den netcup-Webspace zeigen lassen
- [ ] Eigenes Dokumentenverzeichnis anlegen, getrennt von anderen Seiten auf
      demselben Webspace
- [ ] Die vier FTP-Secrets im GitHub-Repository hinterlegen
      (siehe `.github/workflows/deploy.yml`)
- [ ] Nach dem ersten Deploy das Formular **echt absenden** und prüfen, ob
      die Mail ankommt — einmal mit und einmal ohne JavaScript

---

## Aufbau

```
app/                    Seiten (App Router, statischer Export)
  page.tsx              Start
  behandlung/           Leistungen, Schwerpunkt Neurologie, Wohnungsweg
  ueber-mich/           Werdegang, Qualifikation, Haltung
  ablauf/               Ablauf & Abrechnung — das Kernstück
  kontakt/              Formular, Telefon, WhatsApp
  einfache-sprache/     dieselben Inhalte in kurzen Sätzen
  impressum/  datenschutz/  not-found.tsx

components/
  a11y/                 Einstellungen (Textgröße, Kontrast, Bewegung) + Panel
  ablauf/               Zeitstrahl, Situations-Klärer, Checkliste, Fragen
  behandlung/           Wohnungsweg (gescrollter Grundriss)
  kontakt/              Formular
  motion/               Enthüllen, Zeilentitel, Bildwischer, Staffel
  Einsatzgebiet.tsx     animierte Karte des Kreises Ahrweiler

lib/
  site-config.ts        Kontaktdaten, Statuszeile, Schalter „ohne Rezept"
  content/              alle Texte, getrennt vom Layout
  bilder.ts             erzeugt von scripts/medien.mjs

public/
  kontakt.php           Formularversand auf netcup
  media/                optimierte Bilder und Videos + CREDITS.md
  logo/                 Bild- und Wortmarke als SVG

scripts/
  medien.mjs            lädt und optimiert die Platzhalter-Medien
  sichten.mjs           Kontaktbogen zur Beurteilung von Motiven
```

---

## Entscheidungen, die nicht offensichtlich sind

**Kein Cookie-Banner, weil es nichts zu bannern gibt.** Schriften werden beim
Bauen heruntergeladen und liegen auf dem eigenen Server. Es gibt keine
Analyse, keine eingebettete Karte, kein Video von einem fremden Anbieter.
Wird später etwas Externes eingebunden, muss ein Banner her — dann ist auch
diese Erklärung hinfällig.

**Keine echte Kartenkomponente.** Die Karte des Einsatzgebiets ist ein
gezeichnetes SVG. Google Maps oder OpenStreetMap würden den Browser der
Besucher mit einem fremden Server verbinden — bei einer Gesundheitsseite ein
Einwilligungsthema.

**Kein Captcha.** Für ältere Menschen und für Screenreader ist ein Captcha
eine echte Hürde. Stattdessen ein verstecktes Feld und eine Zeitmessung.

**Kein Scroll-Jacking.** Der Wohnungsweg auf der Behandlungsseite arbeitet
mit einer feststehenden Bühne (`sticky`), das Scrollen bleibt normal.
Entkoppeltes Scrollen löst bei Vestibularstörungen Übelkeit aus — auf einer
Seite für Menschen mit Schwindel und Gangunsicherheit wäre das grob fahrlässig.

**Die Tiefe im Wohnungsweg ist CSS, kein WebGL.** Sieht praktisch gleich aus,
lädt sofort, läuft auf alten Geräten und lässt sich vollständig stilllegen.

**Der Abschnitt „Behandlung ohne Rezept" liegt fertig gebaut vor, ist aber
abgeschaltet.** Sobald die sektorale Heilpraktikererlaubnis vorliegt:
`heilpraktikerErlaubnis` in `lib/site-config.ts` auf `true`, neu bauen.

**Ein Standbild reicht nicht, um einen Stock-Clip zu beurteilen.** Der erste
Hero-Clip sah in Sekunde zwei ruhig aus und zeigte ab der Mitte
Hot-Stone-Massage. `scripts/sichten.mjs` prüft deshalb drei Stellen je Clip.

---

## Barrierefreiheit

Rechtlich ist das für eine Einzelpraxis nicht verpflichtend — das
Barrierefreiheitsstärkungsgesetz greift für Kleinstunternehmen hier nicht.
Für eine Zielgruppe aus älteren Menschen und pflegenden Angehörigen ist es
trotzdem das stärkste Argument, das die Seite hat.

Eingebaut sind: Textgröße in drei Stufen, erhöhter Kontrast, Abschalten aller
Bewegung, eine Fassung in einfacher Sprache, Sprunglink, sichtbare Fokusringe,
Tippflächen ab 44 px, Grundschrift 18 px, vollständige Tastaturbedienung und
ein Pause-Knopf an jedem Video.

Die Einstellungen liegen als `data`-Attribute am `<html>` und werden von einem
kleinen Skript im `<head>` gesetzt, bevor das erste Bild aufgebaut wird —
sonst blitzt bei jedem Seitenaufruf kurz die normale Darstellung auf.

---

## Farben

Durchgängig hell und warm — Beige, Sand, Off-White, Greige — mit Petrol als
einziger Textfarbe. Keine große dunkle Fläche mehr, außer dort, wo tatsächlich
ein Foto oder Video liegt und einen Schleier zur Lesbarkeit braucht.

| Rolle | Wert | Verwendung |
| --- | --- | --- |
| Petrol | `#315B5B` | **durchgängige Textfarbe**, Knöpfe, Icons — 7,05:1 auf Off-White, 6,36:1 auf Sand, 5,12:1 auf Greige |
| Petrol-dunkel | `#26494A` | Hover, Akzent auf warmer Fläche (ersetzt dort Champagner) |
| Sand | `#EFEBE3` | Zwischenton für Sektionswechsel |
| Off-White | `#F8F7F3` | Grundfläche |
| Greige | `#D9D4CA` | **warme Sektionsfläche** — ersetzt die früheren dunklen Tiefpetrol-Blöcke (Fußzeile, Karte, Zeitstrahl, Wohnungsweg-Bühne, Qualifikation) |
| Champagner | `#B9A47E` | nur Haarlinien — als Text überall unlesbar (2,3:1 auf Off-White, 1,6:1 auf Greige) |
| Tiefpetrol | `#1B3535` | **nur** Foto-/Video-Überlagerung (Hero, Seitenköpfe, Abschluss-CTA) |

Zwei Klassen tragen das System: `.auf-warm` (Greige-Fläche, Petrol-Text —
für flächige Sektionen ohne Bild darunter) und `.auf-dunkel` (Tiefpetrol,
Off-White-Text — ausschließlich für Sektionen mit Foto oder Video darunter,
wo der Untergrund je nach Bildinhalt wechselt und nur ein dunkler Schleier
verlässlich Kontrast liefert). Die Tokens dafür stehen in `app/globals.css`
unter „Rollen auf hellem und warmem Grund" bzw. „nur für Foto-/
Video-Ueberlagerungen" — beide sauber getrennt, damit ein Wechsel der einen
Sorte nicht versehentlich die andere mitzieht.
