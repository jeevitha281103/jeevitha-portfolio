<?php
header('Content-Type: application/json');

$receiverEmail = 'jeevitharaja2811@gmail.com';

function clean_input($value) {
    return trim(str_replace(array("\r", "\n"), ' ', $value));
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(array(
        'success' => false,
        'message' => 'Invalid request.'
    ));
    exit;
}

$name = clean_input($_POST['name'] ?? '');
$email = clean_input($_POST['email'] ?? '');
$message = trim($_POST['message'] ?? '');

if ($name === '' || $email === '' || $message === '') {
    echo json_encode(array(
        'success' => false,
        'message' => 'Please fill all fields.'
    ));
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(array(
        'success' => false,
        'message' => 'Please enter a valid email address.'
    ));
    exit;
}

$subject = 'Portfolio Contact Message from ' . $name;
$body = "Name: {$name}\nEmail: {$email}\n\nMessage:\n{$message}";
$headers = array(
    'From: ' . $receiverEmail,
    'Reply-To: ' . $email,
    'Content-Type: text/plain; charset=UTF-8'
);

$sent = mail($receiverEmail, $subject, $body, implode("\r\n", $headers));

echo json_encode(array(
    'success' => $sent,
    'message' => $sent
        ? 'Message sent successfully.'
        : 'Server mail is not configured. Please email directly.'
));
?>
