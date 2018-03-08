<?php

// In PHP embedded server, if the URI contains a dot in the file part, then PHP does not position properly the SCRIPT_NAME value. Create a router.php file and send all the requests through it with your PHP embedded server.

if (preg_match('/\.(?:js|css|png|jpg|jpeg|gif)$/', $_SERVER["REQUEST_URI"])) {
    return false;    // Serve the requested resource as-is.
}

$_SERVER['SCRIPT_NAME'] = 'index.php';
include 'index.php';
