<?php
/**
 * Contact form handler for cPanel / Apache + PHP.
 * Change RECIPIENT if needed — keep in sync with site email.
 */
declare(strict_types=1);

const RECIPIENT = 'info@thinkinnovnexgen.co.jp';
const FROM_ADDRESS = 'noreply@thinkinnovnexgen.co.jp';
const RATE_WINDOW = 600; // seconds
const RATE_MAX = 8;
const MIN_SECONDS = 3;

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

function client_ip(): string {
    return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
}

function rate_limited(): bool {
    $dir = sys_get_temp_dir() . '/tin_contact_rl';
    if (!is_dir($dir)) {
        @mkdir($dir, 0700, true);
    }
    $file = $dir . '/' . hash('sha256', client_ip()) . '.json';
    $now = time();
    $hits = [];
    if (is_file($file)) {
        $hits = json_decode((string) file_get_contents($file), true) ?: [];
    }
    $hits = array_values(array_filter($hits, static fn($t) => ($now - (int) $t) < RATE_WINDOW));
    if (count($hits) >= RATE_MAX) {
        return true;
    }
    $hits[] = $now;
    file_put_contents($file, json_encode($hits), LOCK_EX);
    return false;
}

// Honeypot
if (!empty($_POST['website'])) {
    echo json_encode(['ok' => true, 'message' => 'Thank you — your message was sent.']);
    exit;
}

if (rate_limited()) {
    http_response_code(429);
    echo json_encode(['ok' => false, 'error' => 'Too many requests. Please try again later.']);
    exit;
}

$started = (int) ($_POST['form_started'] ?? 0);
if ($started > 0 && (int) (microtime(true) * 1000) - $started < MIN_SECONDS * 1000) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Please wait a moment and try again.']);
    exit;
}

$name = trim((string) ($_POST['name'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$company = trim((string) ($_POST['company'] ?? ''));
$phone = trim((string) ($_POST['phone'] ?? ''));
$message = trim((string) ($_POST['message'] ?? ''));
$consent = !empty($_POST['consent']);

if ($name === '' || $email === '' || $message === '' || !$consent) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Missing required fields.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid email address.']);
    exit;
}

$subject = 'Website contact from ' . $name;
$body = "Name: {$name}\nEmail: {$email}\nCompany: {$company}\nPhone: {$phone}\n\nMessage:\n{$message}\n";
$headers = [
    'From: ThinkInnov-NexGen Website <' . FROM_ADDRESS . '>',
    'Reply-To: ' . $name . ' <' . $email . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
];

$sent = @mail(RECIPIENT, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, implode("\r\n", $headers));

if (!$sent) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Mail could not be sent.']);
    exit;
}

echo json_encode(['ok' => true, 'message' => 'Thank you — your message was sent.']);
