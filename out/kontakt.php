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

/** Fuer den Text der Eingangsbestaetigung an die anfragende Person. */
const PRAXIS_NAME = 'Nora Heidenreich – Mobile Physiotherapie';

/** Wohin es ohne JavaScript nach dem Absenden geht. */
const BESTAETIGUNG = '/kontakt/danke/';

/** Kleinster Abstand zwischen zwei Anfragen derselben Adresse, in Sekunden. */
const SPERRE = 60;

// ---------------------------------------------------------------------------

header('X-Content-Type-Options: nosniff');

/*
  `strpos(...) !== false` statt `str_contains(...)`.

  Das war der Fehler, an dem das Formular auf dem Server gescheitert ist:
  `str_contains()` gibt es erst ab PHP 8.0. Der netcup-Webspace laeuft mit
  einer aelteren Fassung, dort bricht die Zeile mit einem schweren Fehler
  ab - der Server antwortet mit 500 und leerem Rumpf (Fehlermeldungen sind
  oben bewusst abgeschaltet). Nachweisbar daran, dass die Kopfzeile
  X-Content-Type-Options aus der Zeile darueber noch mitkam, die Antwort
  aber danach abbrach.

  `strpos` gibt es in jeder PHP-Fassung und tut hier dasselbe.
*/
$perFetch = isset($_SERVER['HTTP_X_ANGEFORDERT_MIT'])
    || (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false);

/** Antwort geben und beenden - je nach Weg als Text oder als Weiterleitung. */
/* `void` statt `never`: `never` gibt es erst ab PHP 8.1. Auf aelteren
   Fassungen wuerde PHP es als Klassennamen lesen - hier zwar folgenlos,
   weil die Funktion immer per `exit` endet, aber es gibt keinen Grund,
   sich darauf zu verlassen. */
function antworten(int $status, string $text, bool $perFetch, string $ziel = ''): void
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

    /*
      429 ist kein Fehlschlag, sondern die Sperre gegen doppeltes Senden -
      die greift erst NACH einem geglueckten Versand. Wer ohne JavaScript
      hier landet, soll nicht "Das hat nicht geklappt" lesen, wo eigentlich
      "Ihre Nachricht ist angekommen" gemeint ist.
    */
    $titel = $status === 429 ? 'Nachricht bereits angekommen' : 'Das hat nicht geklappt';
    $seitentitel = $status === 429
        ? 'Nachricht bereits angekommen'
        : 'Nachricht konnte nicht gesendet werden';

    http_response_code($status);
    header('Content-Type: text/html; charset=utf-8');
    echo '<!doctype html><html lang="de"><head><meta charset="utf-8">'
        . '<meta name="viewport" content="width=device-width,initial-scale=1">'
        . '<title>' . htmlspecialchars($seitentitel, ENT_QUOTES) . '</title></head><body '
        . 'style="font-family:system-ui,sans-serif;max-width:34rem;margin:12vh auto;padding:0 1.5rem;line-height:1.7;color:#252a2a">'
        . '<h1 style="font-weight:400">' . htmlspecialchars($titel, ENT_QUOTES) . '</h1><p>' . htmlspecialchars($text, ENT_QUOTES) . '</p>'
        . '<p><a href="/kontakt/">Zurück zum Kontaktformular</a></p></body></html>';
    exit;
}

/**
 * Erfolgsantwort - anders als antworten(), weil der Fetch-Weg hier zusaetzlich
 * mitteilen muss, ob eine Eingangsbestaetigung per E-Mail verschickt wurde.
 * Das Formular zeigt dafuer einen eigenen kleinen Hinweis (Toast) an.
 */
function erfolgAntworten(bool $perFetch, string $ziel, bool $emailBestaetigt): void
{
    if ($perFetch) {
        http_response_code(200);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'text' => 'Danke, Ihre Nachricht ist angekommen.',
            'emailBestaetigt' => $emailBestaetigt,
        ]);
        exit;
    }

    header('Location: ' . $ziel, true, 303);
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
//
// Die Spur wird erst nach einem geglueckten Versand gesetzt (siehe touch()
// weiter unten). Wer hier landet, hat also nachweislich schon eine Nachricht
// abgeschickt, die angekommen ist. Genau das sagt die Meldung auch - ein
// blosses "Bitte warten" liest sich wie ein Fehlschlag und laedt dazu ein,
// es gleich noch einmal zu versuchen.
$adresse = $_SERVER['REMOTE_ADDR'] ?? 'unbekannt';
$spur = sys_get_temp_dir() . '/nh-kontakt-' . md5($adresse);
if (is_file($spur) && (time() - (int) filemtime($spur)) < SPERRE) {
    antworten(
        429,
        'Ihre Nachricht wurde bereits versendet. Ich melde mich umgehend bei '
            . 'Ihnen. Vielen Dank!',
        $perFetch
    );
}

// --- Pflichtfelder ---------------------------------------------------------

$name    = sauber($_POST['name'] ?? '', 120);
$telefon = sauber($_POST['telefon'] ?? '', 60);
$ort     = sauber($_POST['ort'] ?? '', 120);
$email   = sauber($_POST['email'] ?? '', 180);
$zeit    = sauber($_POST['zeit'] ?? 'egal', 40);

/*
  Ob ueberhaupt nach einer Wunschzeit gefragt wurde.

  Die Kurzfassung des Formulars auf der Startseite zeigt das Feld nicht, es
  kommt dort also gar nicht erst mit. Ohne diese Unterscheidung stuende in
  der Eingangsbestaetigung "Gewuenschter Rueckruf: Egal" - eine Angabe, die
  die anfragende Person nie gemacht hat.
*/
$zeitGefragt = isset($_POST['zeit']) && $_POST['zeit'] !== '';
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

// --- Eingangsbestaetigung an die anfragende Person --------------------------
// Nur wenn eine E-Mail-Adresse angegeben wurde - das Feld ist optional, ohne
// sie hat niemand ein Postfach, an das eine Bestaetigung gehen koennte. Ein
// Fehlschlag hier darf die eigentliche Anfrage nicht scheitern lassen: Sie ist
// bereits bei EMPFAENGER angekommen, das ist das eigentliche Ziel.
$bestaetigungVersendet = false;

if ($email !== '') {
    $bestaetigungsZeilen = [
        'Guten Tag ' . $name . ',',
        '',
        'vielen Dank für Ihre Anfrage über die Website von ' . PRAXIS_NAME . '.',
        'Ihre Nachricht ist bei mir angekommen.',
        '',
    ];

    if ($zeitGefragt) {
        $bestaetigungsZeilen[] = 'Gewünschter Rückruf: ' . ($zeiten[$zeit] ?? $zeit);
        $bestaetigungsZeilen[] = '';
    }

    array_push(
        $bestaetigungsZeilen,
        'Ich melde mich telefonisch bei Ihnen, um einen Termin zu besprechen.',
        '',
        'Freundliche Grüße',
        'Nora Heidenreich'
    );

    $bestaetigungBetreff = '=?UTF-8?B?' . base64_encode('Ihre Anfrage ist angekommen') . '?=';

    // Eigener Kopf statt $kopf von oben: Dessen Reply-To zeigt auf $email
    // selbst (die anfragende Person), eine Antwort auf die Bestaetigung soll
    // aber bei EMPFAENGER landen.
    $bestaetigungKopf = [
        'From: ' . ABSENDER,
        'Reply-To: ' . EMPFAENGER,
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
        'X-Mailer: PHP/' . phpversion(),
    ];

    $bestaetigungVersendet = @mail(
        $email,
        $bestaetigungBetreff,
        implode("\n", $bestaetigungsZeilen),
        implode("\r\n", $bestaetigungKopf),
        '-f' . ABSENDER
    );
}

erfolgAntworten($perFetch, BESTAETIGUNG, $bestaetigungVersendet);
