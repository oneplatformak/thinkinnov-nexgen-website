<?php
/**
 * Shared helpers for contact.php and apply.php (cPanel / Apache + PHP 8).
 *
 * The recipient is fixed here. Nothing a visitor submits can change who the
 * mail goes to, who it is from, or add headers, so the forms cannot be used
 * as a relay. To change the recipient, edit TIN_RECIPIENT and the matching
 * address in improved-src/config.js, then rebuild.
 */
declare(strict_types=1);

const TIN_RECIPIENT = 'info@thinkinnovnexgen.co.jp';
const TIN_FROM = 'noreply@thinkinnovnexgen.co.jp';
const TIN_RATE_WINDOW = 600; // seconds
const TIN_MIN_SECONDS = 3;

const TIN_MESSAGES = [
    'en' => [
        'sent_contact' => 'Thank you. Your enquiry has been sent.',
        'sent_apply' => 'Thank you. Your application has been sent.',
        'method' => 'This address only accepts form submissions.',
        'invalid' => 'Some details are missing or not valid. Please check the form and try again.',
        'email' => 'Please enter a valid email address.',
        'consent' => 'Please confirm your agreement to continue.',
        'rate' => 'Too many submissions from this connection. Please try again later, or email us directly.',
        'too_fast' => 'The form was submitted too quickly. Please wait a moment and try again.',
        'rejected' => 'Your submission could not be accepted. Please email us directly.',
        'file_missing' => 'Please attach your CV.',
        'file_size' => 'The file must be 5 MB or smaller.',
        'file_type' => 'The file must be PDF, DOC or DOCX.',
        'mail_failed' => 'Your message could not be sent. Please try again, or email us directly.',
        'title_ok' => 'Sent',
        'title_error' => 'Not sent',
        'back' => 'Back to the form',
        'home' => 'Home',
    ],
    'ja' => [
        'sent_contact' => 'お問い合わせありがとうございます。内容を送信いたしました。',
        'sent_apply' => 'ご応募ありがとうございます。応募内容を送信いたしました。',
        'method' => 'このアドレスはフォームからの送信のみ受け付けています。',
        'invalid' => '入力内容に不足または誤りがあります。フォームをご確認のうえ、もう一度お試しください。',
        'email' => '正しい形式のメールアドレスをご入力ください。',
        'consent' => '送信には同意が必要です。チェックを入れてください。',
        'rate' => '短時間に多数の送信がありました。しばらくしてからもう一度お試しいただくか、メールで直接ご連絡ください。',
        'too_fast' => '送信が早すぎます。少し時間をおいてから、もう一度お試しください。',
        'rejected' => '送信を受け付けられませんでした。お手数ですが、メールで直接ご連絡ください。',
        'file_missing' => '履歴書を添付してください。',
        'file_size' => 'ファイルサイズは5MB以下にしてください。',
        'file_type' => 'PDF、DOC、DOCX形式のファイルを添付してください。',
        'mail_failed' => '送信できませんでした。お手数ですが、もう一度お試しいただくか、メールで直接ご連絡ください。',
        'title_ok' => '送信完了',
        'title_error' => '送信できませんでした',
        'back' => 'フォームに戻る',
        'home' => 'ホーム',
    ],
];

function tin_options(): array {
    static $options = null;
    if ($options === null) {
        $options = require __DIR__ . '/enquiry-options.php';
    }
    return $options;
}

function tin_lang(): string {
    $lang = (string) ($_POST['lang'] ?? 'en');
    return in_array($lang, tin_options()['langs'], true) ? $lang : 'en';
}

function tin_wants_json(): bool {
    return str_contains((string) ($_SERVER['HTTP_ACCEPT'] ?? ''), 'application/json');
}

function tin_html(string $value): string {
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/** Sends the result as JSON to the page script, or as a small page when scripts are off. */
function tin_respond(int $status, string $code, string $formPage): void {
    $lang = tin_lang();
    $ok = $status === 200;
    $message = TIN_MESSAGES[$lang][$code];
    http_response_code($status);
    header('X-Content-Type-Options: nosniff');
    header('Cache-Control: no-store');
    header('X-Robots-Tag: noindex');
    if (tin_wants_json()) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($ok ? ['ok' => true, 'message' => $message] : ['ok' => false, 'code' => $code, 'error' => $message], JSON_UNESCAPED_UNICODE);
        exit;
    }
    $text = TIN_MESSAGES[$lang];
    $prefix = $lang === 'ja' ? 'ja/' : '';
    header('Content-Type: text/html; charset=utf-8');
    echo '<!doctype html><html lang="' . $lang . '"><head><meta charset="utf-8">'
        . '<meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">'
        . '<title>' . tin_html($text[$ok ? 'title_ok' : 'title_error']) . ' | ThinkInnov-NexGen</title>'
        . '<link rel="stylesheet" href="assets/styles.css"></head><body><main class="container section" id="main">'
        . '<h1>' . tin_html($text[$ok ? 'title_ok' : 'title_error']) . '</h1>'
        . '<p class="lead" role="' . ($ok ? 'status' : 'alert') . '">' . tin_html($message) . '</p>'
        . '<p><a href="mailto:' . TIN_RECIPIENT . '">' . TIN_RECIPIENT . '</a></p>'
        . '<p><a class="btn btn-ghost" href="' . $prefix . $formPage . '">' . tin_html($text['back']) . '</a> '
        . '<a class="btn btn-ghost" href="' . ($prefix === '' ? 'index.html' : $prefix) . '">' . tin_html($text['home']) . '</a></p>'
        . '</main></body></html>';
    exit;
}

/** First $max characters of a UTF-8 string, with or without the mbstring extension. */
function tin_cut(string $value, int $max): string {
    if (function_exists('mb_substr')) {
        return mb_substr($value, 0, $max, 'UTF-8');
    }
    return preg_match('/^.{0,' . $max . '}/us', $value, $m) ? $m[0] : '';
}

/** One line of text: no control characters (so no header injection), collapsed spaces, limited length. */
function tin_line(string $key, int $max): string {
    $value = $_POST[$key] ?? '';
    if (!is_string($value)) {
        return '';
    }
    $value = preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $value) ?? '';
    $value = trim(preg_replace('/\s+/u', ' ', $value) ?? '');
    return tin_cut($value, $max);
}

/** Multi-line text for the message body only; never used in a header. */
function tin_text(string $key, int $max): string {
    $value = $_POST[$key] ?? '';
    if (!is_string($value)) {
        return '';
    }
    $value = str_replace(["\r\n", "\r"], "\n", $value);
    $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]+/u', '', $value) ?? '';
    return tin_cut(trim($value), $max);
}

/** A value that must be one of the keys the site itself offers; anything else becomes ''. */
function tin_choice(string $key, array $allowed): string {
    $value = $_POST[$key] ?? '';
    return is_string($value) && array_key_exists($value, $allowed) ? $value : '';
}

function tin_email(string $key): string {
    $value = tin_line($key, 254);
    return filter_var($value, FILTER_VALIDATE_EMAIL) ? $value : '';
}

function tin_honeypot_filled(): bool {
    return isset($_POST['website']) && $_POST['website'] !== '';
}

/** True when the page script recorded an opening time less than TIN_MIN_SECONDS ago. Without scripts there is no time to check. */
function tin_too_fast(): bool {
    $started = (int) ($_POST['form_started'] ?? 0);
    if ($started <= 0) {
        return false;
    }
    $elapsed = (int) round(microtime(true) * 1000) - $started;
    return $elapsed >= 0 && $elapsed < TIN_MIN_SECONDS * 1000;
}

/** Counts submissions per sender (one-way hash of the IP address) in the system temp directory. */
function tin_rate_limited(string $bucket, int $max): bool {
    $dir = sys_get_temp_dir() . '/tin_' . $bucket . '_rl';
    if (!is_dir($dir) && !@mkdir($dir, 0700, true) && !is_dir($dir)) {
        return false;
    }
    $now = time();
    if (random_int(1, 50) === 1) {
        foreach (glob($dir . '/*.json') ?: [] as $old) {
            if ($now - (int) @filemtime($old) > TIN_RATE_WINDOW) {
                @unlink($old);
            }
        }
    }
    $file = $dir . '/' . hash('sha256', (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown')) . '.json';
    $hits = [];
    if (is_file($file)) {
        $hits = json_decode((string) @file_get_contents($file), true) ?: [];
    }
    $hits = array_values(array_filter($hits, static fn($t) => ($now - (int) $t) < TIN_RATE_WINDOW));
    if (count($hits) >= $max) {
        return true;
    }
    $hits[] = $now;
    @file_put_contents($file, json_encode($hits), LOCK_EX);
    return false;
}

function tin_encode_header(string $value): string {
    return '=?UTF-8?B?' . base64_encode($value) . '?=';
}

/** Sends to the fixed recipient. $replyTo must already be a validated address. */
function tin_send(string $fromName, string $subject, string $body, string $replyTo, string $contentType): bool {
    $headers = [
        'From: ' . $fromName . ' <' . TIN_FROM . '>',
        'Reply-To: <' . $replyTo . '>',
        'MIME-Version: 1.0',
        'Content-Type: ' . $contentType,
    ];
    return @mail(TIN_RECIPIENT, tin_encode_header($subject), $body, implode("\r\n", $headers));
}

/** Checks shared by both forms, in the order that costs the server least. */
function tin_guard(string $bucket, int $rateMax, string $formPage): void {
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        header('Allow: POST');
        tin_respond(405, 'method', $formPage);
    }
    if (tin_honeypot_filled()) {
        tin_respond(400, 'rejected', $formPage);
    }
    if (tin_rate_limited($bucket, $rateMax)) {
        header('Retry-After: ' . TIN_RATE_WINDOW);
        tin_respond(429, 'rate', $formPage);
    }
    if (tin_too_fast()) {
        tin_respond(400, 'too_fast', $formPage);
    }
}
