<?php
/**
 * Versand des Rueckruf-Formulars.
 *
 * Laeuft auf dem netcup-Webspace neben den statischen Dateien. Kein Composer,
 * keine Bibliothek, kein externer Dienst - die Anfrage verlaesst den Server
 * nur als E-Mail an das eigene Postfach.
 *
 * Zwei Wege fuehren hier herein:
 *   1. Mit JavaScript: fetch() schickt die Daten, erwartet 200 und einen
 *      kurzen Text. Die Seite bleibt stehen.
 *   2. Ohne JavaScript: normales POST. Danach Weiterleitung auf die
 *      Bestaetigungsseite, damit ein Neuladen nichts doppelt verschickt.
 *
 * ---------------------------------------------------------------------------
 * PLATZHALTER: Vor dem Livegang die drei Konstanten unten setzen.
 * ---------------------------------------------------------------------------
 */

declare(strict_types=1);

/**
 * Keine Fehlermeldungen in die Antwort schreiben.
 *
 * Sonst schiebt PHP bei einem Problem - etwa einem nicht erreichbaren
 * Mailserver - eine Warnung VOR den Statuscode in die Ausgabe. Die Kopfzeilen
 * sind damit raus, `http_response_code(500)` verpufft, und der Browser bekommt
 * eine 200 mit Fehlertext. Das Formular meldet dann Erfolg, obwohl nie eine
 * Mail verschickt wurde. Genau das ist im Test passiert.
 */
ini_set('display_errors', '0');
ini_set('log_errors', '1');

/** Postfach, in dem die Anfragen landen. */
const EMPFAENGER = 'kontakt@nora-heidenreich.de';

/**
 * Absender. Muss eine Adresse der eigenen Domain sein, sonst stuft SPF die
 * Mail als gefaelscht ein und sie landet im Spam - oder wird verworfen.
 */
const ABSENDER = 'noreply@nora-heidenreich.de';

/** Wohin es ohne JavaScript nach dem Absenden geht. */
const BESTAETIGUNG = '/kontakt/danke/';

/** Kleinster Abstand zwischen zwei Anfragen derselben Adresse, in Sekunden. */
const SPERRE = 60;

// ---------------------------------------------------------------------------

header('X-Content-Type-Options: nosniff');

$perFetch = isset($_SERVER['HTTP_X_ANGEFORDERT_MIT'])
    || (isset($_SERVER['HTTP_ACCEPT']) && str_contains($_SERVER['HTTP_ACCEPT'], 'application/json'));

/** Antwort geben und beenden - je nach Weg als Text oder als Weiterleitung. */
function antworten(int $status, string $text, bool $perFetch, string $ziel = ''): never
{
    if ($perFetch) {
        http_response_code($status);
        header('Content-Type: text/plain; charset=utf-8');
        echo $text;
        exit;
    }

    if ($status === 200 && $ziel !== '') {
        header('Location: ' . $ziel, true, 303);
        exit;
    }

    http_response_code($status);
    header('Content-Type: text/html; charset=utf-8');
    echo '<!doctype html><html lang="de"><head><meta charset="utf-8">'
        . '<meta name="viewport" content="width=device-width,initial-scale=1">'
        . '<title>Nachricht konnte nicht gesendet werden</title></head><body '
        . 'style="font-family:system-ui,sans-serif;max-width:34rem;margin:12vh auto;padding:0 1.5rem;line-height:1.7;color:#252a2a">'
        . '<h1 style="font-weight:400">Das hat nicht geklappt</h1><p>' . htmlspecialchars($text, ENT_QUOTES) . '</p>'
        . '<p><a href="/kontakt/">Zurück zum Kontaktformular</a></p></body></html>';
    exit;
}

/** Zeilenumbrueche entfernen - sonst laesst sich der Mail-Kopf manipulieren. */
function sauber(string $wert, int $maximal = 300): string
{
    $wert = str_replace(["\r", "\n", "%0a", "%0d"], ' ', $wert);
    $wert = trim(strip_tags($wert));
    return mb_substr($wert, 0, $maximal);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    antworten(405, 'Diese Adresse nimmt nur abgeschickte Formulare entgegen.', $perFetch);
}

// --- Spam-Abwehr -----------------------------------------------------------
// Bewusst ohne Captcha: Fuer aeltere Menschen und fuer Screenreader ist ein
// Captcha eine echte Huerde. Honigtopf und Zeitmessung halten den weitaus
// groessten Teil der automatisierten Anfragen ab.

if (($_POST['webseite'] ?? '') !== '') {
    // Bots fuellen das versteckte Feld. Freundlich bestaetigen und verwerfen -
    // eine Fehlermeldung waere nur ein Hinweis, es anders zu versuchen.
    antworten(200, 'Danke.', $perFetch, BESTAETIGUNG);
}

$verweildauer = (int) ($_POST['verweildauer'] ?? 0);
if ($verweildauer > 0 && $verweildauer < 3000) {
    antworten(200, 'Danke.', $perFetch, BESTAETIGUNG);
}

// Einfache Bremse gegen wiederholtes Absenden von derselben Adresse.
$adresse = $_SERVER['REMOTE_ADDR'] ?? 'unbekannt';
$spur = sys_get_temp_dir() . '/nh-kontakt-' . md5($adresse);
if (is_file($spur) && (time() - (int) filemtime($spur)) < SPERRE) {
    antworten(429, 'Bitte warten Sie einen Moment, bevor Sie erneut senden.', $perFetch);
}

// --- Pflichtfelder ---------------------------------------------------------

$name    = sauber($_POST['name'] ?? '', 120);
$telefon = sauber($_POST['telefon'] ?? '', 60);
$ort     = sauber($_POST['ort'] ?? '', 120);
$email   = sauber($_POST['email'] ?? '', 180);
$zeit    = sauber($_POST['zeit'] ?? 'egal', 40);
$nachricht = trim(strip_tags((string) ($_POST['nachricht'] ?? '')));
$nachricht = mb_substr($nachricht, 0, 2000);

if ($name === '' || $telefon === '' || $ort === '') {
    antworten(422, 'Bitte füllen Sie Name, Telefonnummer und Wohnort aus.', $perFetch);
}

if (($_POST['datenschutz'] ?? '') === '') {
    antworten(422, 'Bitte bestätigen Sie den Hinweis zum Datenschutz.', $perFetch);
}

if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    antworten(422, 'Die E-Mail-Adresse sieht nicht gültig aus.', $perFetch);
}

// --- Mail zusammenbauen ----------------------------------------------------

$zeiten = [
    'egal'        => 'Egal',
    'vormittags'  => 'Vormittags',
    'nachmittags' => 'Nachmittags',
    'abends'      => 'Abends ab 17 Uhr',
];

$zeilen = [
    'Neue Anfrage über die Website',
    str_repeat('-', 40),
    '',
    'Name:      ' . $name,
    'Telefon:   ' . $telefon,
    'Ort:       ' . $ort,
    'E-Mail:    ' . ($email !== '' ? $email : '—'),
    'Rückruf:   ' . ($zeiten[$zeit] ?? $zeit),
    '',
    'Nachricht:',
    $nachricht !== '' ? $nachricht : '—',
    '',
    str_repeat('-', 40),
    'Eingegangen: ' . date('d.m.Y H:i'),
];

$betreff = '=?UTF-8?B?' . base64_encode('Rückruf-Anfrage: ' . $name . ' (' . $ort . ')') . '?=';

$kopf = [
    'From: ' . ABSENDER,
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Mailer: PHP/' . phpversion(),
];

// Antworten-an nur setzen, wenn eine gueltige Adresse vorliegt - sonst wuerde
// die Mail beim Antworten ins Leere gehen.
if ($email !== '') {
    $kopf[] = 'Reply-To: ' . $email;
}

// Das @ unterdrueckt die Warnung zusaetzlich zu display_errors - doppelt
// gesichert, weil manche Hoster display_errors per .htaccess erzwingen.
$erfolg = @mail(
    EMPFAENGER,
    $betreff,
    implode("\n", $zeilen),
    implode("\r\n", $kopf),
    '-f' . ABSENDER
);

if (!$erfolg) {
    antworten(
        500,
        'Die Nachricht konnte nicht verschickt werden. Bitte rufen Sie an.',
        $perFetch
    );
}

@touch($spur);

antworten(200, 'Danke, Ihre Nachricht ist angekommen.', $perFetch, BESTAETIGUNG);
