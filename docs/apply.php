<?php
/**
 * Job application handler for cPanel / Apache + PHP 8.
 *
 * Accepts only the fields the form has, plus one CV file (PDF, DOC or DOCX,
 * 5 MB or smaller, checked by extension and by content). The role must be
 * one the site lists. The recipient is fixed in inc/form-lib.php.
 */
declare(strict_types=1);

require __DIR__ . '/inc/form-lib.php';

const FORM_PAGE = 'apply.html';
const MAX_UPLOAD = 5 * 1024 * 1024;

tin_guard('apply', 6, FORM_PAGE);

$options = tin_options();

// Field name => [label in the email, maximum length]. Nothing else is read.
$fields = [
    'first_name' => ['First name', 80],
    'last_name' => ['Last name', 80],
    'phone' => ['Contact number', 40],
    'graduation' => ['Year of graduation', 4],
    'gender' => ['Gender', 40],
    'experience' => ['Overall experience (years)', 40],
    'employer' => ['Current employer', 150],
    'current_ctc' => ['Current CTC (LPA)', 40],
    'expected_ctc' => ['Expected CTC (LPA)', 40],
    'notice' => ['Notice period (days)', 40],
    'source' => ['How did you find this vacancy?', 80],
    'current_location' => ['Current location', 120],
    'preferred_location' => ['Preferred location', 120],
    'skills' => ['Skill set', 500],
];

$values = [];
foreach ($fields as $key => [$label, $max]) {
    $values[$key] = tin_line($key, $max);
    if ($values[$key] === '') {
        tin_respond(400, 'invalid', FORM_PAGE);
    }
}
if (!preg_match('/^(19|20)\d{2}$/', $values['graduation']) || !preg_match('/^[0-9+().\-\s]{5,40}$/', $values['phone'])) {
    tin_respond(400, 'invalid', FORM_PAGE);
}

$emailRaw = tin_line('email', 254);
$email = tin_email('email');
if ($emailRaw === '') {
    tin_respond(400, 'invalid', FORM_PAGE);
}
if ($email === '') {
    tin_respond(400, 'email', FORM_PAGE);
}
if (empty($_POST['consent'])) {
    tin_respond(400, 'consent', FORM_PAGE);
}

$job = tin_choice('job', $options['jobs']);

$file = $_FILES['resume'] ?? null;
if (!is_array($file) || is_array($file['error'] ?? null)) {
    tin_respond(400, 'file_missing', FORM_PAGE);
}
$uploadError = (int) ($file['error'] ?? UPLOAD_ERR_NO_FILE);
if ($uploadError === UPLOAD_ERR_INI_SIZE || $uploadError === UPLOAD_ERR_FORM_SIZE) {
    tin_respond(400, 'file_size', FORM_PAGE);
}
if ($uploadError !== UPLOAD_ERR_OK || !is_uploaded_file((string) $file['tmp_name'])) {
    tin_respond(400, 'file_missing', FORM_PAGE);
}
if ((int) $file['size'] <= 0 || (int) $file['size'] > MAX_UPLOAD) {
    tin_respond(400, 'file_size', FORM_PAGE);
}

$extension = strtolower(pathinfo((string) $file['name'], PATHINFO_EXTENSION));
// What each extension's content may be detected as. DOCX is a zip container.
$allowedTypes = [
    'pdf' => ['application/pdf'],
    'doc' => ['application/msword', 'application/x-ole-storage', 'application/CDFV2', 'application/vnd.ms-office'],
    'docx' => ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip', 'application/octet-stream'],
];
if (!isset($allowedTypes[$extension])) {
    tin_respond(400, 'file_type', FORM_PAGE);
}
$detected = (new finfo(FILEINFO_MIME_TYPE))->file((string) $file['tmp_name']) ?: '';
if (!in_array($detected, $allowedTypes[$extension], true)) {
    tin_respond(400, 'file_type', FORM_PAGE);
}
$data = (string) file_get_contents((string) $file['tmp_name']);
$signatures = ['pdf' => '%PDF-', 'doc' => "\xD0\xCF\x11\xE0", 'docx' => "PK\x03\x04"];
if (!str_starts_with($data, $signatures[$extension])) {
    tin_respond(400, 'file_type', FORM_PAGE);
}

$lines = ['New job application', '', 'Role: ' . ($job !== '' ? $options['jobs'][$job] . ' (' . $job . ')' : 'General application'), 'Page language: ' . tin_lang(), ''];
foreach ($fields as $key => [$label]) {
    if ($key === 'phone') {
        $lines[] = 'Email: ' . $email;
    }
    $lines[] = $label . ': ' . $values[$key];
}
$lines[] = '';

$fullName = $values['first_name'] . ' ' . $values['last_name'];
$safeName = preg_replace('/[^A-Za-z0-9]+/', '-', $fullName) ?: 'applicant';
$attachmentName = 'cv-' . trim($safeName, '-') . '.' . $extension;
$attachmentType = $allowedTypes[$extension][0];
$boundary = '=_tin_' . bin2hex(random_bytes(12));

$body = "--{$boundary}\r\n"
    . "Content-Type: text/plain; charset=UTF-8\r\n"
    . "Content-Transfer-Encoding: 8bit\r\n\r\n"
    . implode("\r\n", $lines) . "\r\n"
    . "--{$boundary}\r\n"
    . 'Content-Type: ' . $attachmentType . '; name="' . $attachmentName . "\"\r\n"
    . "Content-Transfer-Encoding: base64\r\n"
    . 'Content-Disposition: attachment; filename="' . $attachmentName . "\"\r\n\r\n"
    . chunk_split(base64_encode($data))
    . "--{$boundary}--\r\n";

$subject = 'Job application: ' . $fullName . ($job !== '' ? ' (' . $options['jobs'][$job] . ')' : '');
$sent = tin_send('ThinkInnov-NexGen Careers', $subject, $body, $email, 'multipart/mixed; boundary="' . $boundary . '"');

tin_respond($sent ? 200 : 500, $sent ? 'sent_apply' : 'mail_failed', FORM_PAGE);
