<?php
/**
 * Job application handler for cPanel / Apache + PHP.
 * Accepts CV upload: pdf/doc/docx <= 5MB.
 */
declare(strict_types=1);

const RECIPIENT = 'info@thinkinnovnexgen.co.jp';
const FROM_ADDRESS = 'noreply@thinkinnovnexgen.co.jp';
const RATE_WINDOW = 600;
const RATE_MAX = 6;
const MIN_SECONDS = 3;
const MAX_UPLOAD = 5 * 1024 * 1024;

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
    $dir = sys_get_temp_dir() . '/tin_apply_rl';
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

if (!empty($_POST['website'])) {
    echo json_encode(['ok' => true, 'message' => 'Thank you — your application was sent.']);
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

$required = [
    'first_name', 'last_name', 'email', 'phone', 'graduation', 'gender',
    'experience', 'employer', 'current_ctc', 'expected_ctc', 'notice',
    'skills', 'source', 'current_location', 'preferred_location',
];

foreach ($required as $key) {
    if (trim((string) ($_POST[$key] ?? '')) === '') {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Missing required fields.']);
        exit;
    }
}

if (empty($_POST['consent'])) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Consent is required.']);
    exit;
}

function header_safe(string $value): string {
    return trim(str_replace(["\r", "\n", "%0a", "%0d", "%0A", "%0D"], '', $value));
}

$email = header_safe((string) $_POST['email']);
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || str_contains($email, "\n") || str_contains($email, "\r")) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid email address.']);
    exit;
}

if (!isset($_FILES['resume']) || !is_array($_FILES['resume']) || ($_FILES['resume']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'CV upload is required.']);
    exit;
}

$file = $_FILES['resume'];
if (($file['size'] ?? 0) > MAX_UPLOAD) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'CV must be 5 MB or smaller.']);
    exit;
}

$origName = (string) ($file['name'] ?? 'resume');
$ext = strtolower(pathinfo($origName, PATHINFO_EXTENSION));
$allowed = ['pdf', 'doc', 'docx'];
if (!in_array($ext, $allowed, true)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'CV must be PDF, DOC or DOCX.']);
    exit;
}

$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime = $finfo->file($file['tmp_name']) ?: 'application/octet-stream';
$allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/zip', // some docx
    'application/octet-stream',
];
if (!in_array($mime, $allowedMimes, true)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid file type.']);
    exit;
}

$lines = [];
foreach ($_POST as $k => $v) {
    if (in_array($k, ['website', 'form_started', 'consent'], true)) {
        continue;
    }
    if (is_string($v)) {
        $lines[] = $k . ': ' . trim($v);
    }
}
$textBody = "New job application\n\n" . implode("\n", $lines) . "\n";

$boundary = '=_tin_' . bin2hex(random_bytes(12));
$filename = preg_replace('/[^A-Za-z0-9._-]/', '_', $origName) ?: ('resume.' . $ext);
$fileData = chunk_split(base64_encode((string) file_get_contents($file['tmp_name'])));

$subject = 'Job application — ' . trim((string) ($_POST['first_name'] ?? '')) . ' ' . trim((string) ($_POST['last_name'] ?? ''));
$job = trim((string) ($_POST['job'] ?? ''));
if ($job !== '') {
    $subject .= ' (' . $job . ')';
}

$body = "--{$boundary}\r\n";
$body .= "Content-Type: text/plain; charset=UTF-8\r\n\r\n";
$body .= $textBody . "\r\n";
$body .= "--{$boundary}\r\n";
$body .= 'Content-Type: ' . $mime . '; name="' . $filename . "\"\r\n";
$body .= "Content-Transfer-Encoding: base64\r\n";
$body .= 'Content-Disposition: attachment; filename="' . $filename . "\"\r\n\r\n";
$body .= $fileData . "\r\n";
$body .= "--{$boundary}--\r\n";

$headers = [
    'From: ThinkInnov-NexGen Careers <' . FROM_ADDRESS . '>',
    'Reply-To: ' . header_safe((string) ($_POST['first_name'] ?? '')) . ' ' . header_safe((string) ($_POST['last_name'] ?? '')) . ' <' . $email . '>',
    'MIME-Version: 1.0',
    'Content-Type: multipart/mixed; boundary="' . $boundary . '"',
];

$sent = @mail(RECIPIENT, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, implode("\r\n", $headers));

if (!$sent) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Mail could not be sent.']);
    exit;
}

echo json_encode(['ok' => true, 'message' => 'Thank you — your application was sent.']);
