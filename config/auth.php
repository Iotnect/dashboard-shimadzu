<?php

return [
    'defaults' => ['guard' => 'web'],
    'guards' => [
        'web' => ['driver' => 'monitor-session'],
    ],
];
