<?php

return [
    'yellowfin' => [
        'email' => env('YELLOWFIN_EMAIL'),
        'password' => env('YELLOWFIN_PASSWORD'),
        'domain' => env('YELLOWFIN_DOMAIN'),
        'reportId' => env('YELLOWFIN_REPORT_ID'),
        'reportType' => [
            'csv' => 'CSV',
            'pdf' => 'PDF',
        ],
        'getPath' => 'storages',
    ],
];
