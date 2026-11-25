<?php
/**
 * Contact form handler for cPanel / Apache + PHP 8.
 *
 * Accepts only the fields the form has. Enquiry type, topic, business need,
 * industry and company size must match the lists the site itself publishes
 * (inc/enquiry-options.php, written by the build); anything else is dropped.
 * The recipient is fixed in inc/form-lib.php.
 */
declare(strict_types=1);

require __DIR__ . '/inc/form-lib.php';

const FORM_PAGE = 'contact.html';

tin_guard('contact', 8, FORM_PAGE);

$options = tin_options();
$type = tin_choice('type', $options['types']);
$topic = tin_choice('topic', $options['topics']);
$need = tin_choice('need', $options['needs']);
$industry = tin_choice('industry', $options['industries']);
$size = tin_choice('size', $options['sizes']);
$name = tin_line('name', 100);
$company = tin_line('company', 150);
$phone = tin_line('phone', 40);
$message = tin_text('message', 5000);
$emailRaw = tin_line('email', 254);
$email = tin_email('email');

if ($type === '' || $name === '' || $message === '' || $emailRaw === '') {
    tin_respond(400, 'invalid', FORM_PAGE);
}
if ($email === '') {
    tin_respond(400, 'email', FORM_PAGE);
}
if ($phone !== '' && !preg_match('/^[0-9+().\-\s]{5,40}$/', $phone)) {
    tin_respond(400, 'invalid', FORM_PAGE);
}
if (empty($_POST['consent'])) {
    tin_respond(400, 'consent', FORM_PAGE);
}

$lines = [
    'Enquiry type: ' . $options['types'][$type],
    'Topic: ' . ($topic !== '' ? $options['topics'][$topic] : '-'),
    'Business need: ' . ($need !== '' ? $options['needs'][$need] : '-'),
    'Industry: ' . ($industry !== '' ? $options['industries'][$industry] : '-'),
    'Company size: ' . ($size !== '' ? $options['sizes'][$size] : '-'),
    'Page language: ' . tin_lang(),
    '',
    'Name: ' . $name,
    'Email: ' . $email,
    'Company: ' . ($company !== '' ? $company : '-'),
    'Phone: ' . ($phone !== '' ? $phone : '-'),
    '',
    'Message:',
    $message,
    '',
];

$subject = 'Website enquiry: ' . $options['types'][$type] . ' - ' . $name;
$sent = tin_send('ThinkInnov-NexGen Website', $subject, implode("\n", $lines), $email, 'text/plain; charset=UTF-8');

tin_respond($sent ? 200 : 500, $sent ? 'sent_contact' : 'mail_failed', FORM_PAGE);
