<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
        'scheme' => 'https',
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'stripe' => [
        // Urban Events uses one platform Stripe account for every organizer.
        // Derive readiness from the complete credential set so a stale
        // runtime flag cannot silently hide card payments after secret
        // rotation or a container rollout.
        'enabled' => env('STRIPE_ENABLED', false) || (
            filled(env('STRIPE_PUBLIC_KEY'))
            && filled(env('STRIPE_SECRET_KEY'))
            && filled(env('STRIPE_WEBHOOK_SECRET'))
        ),
        'platform_managed' => env('STRIPE_PLATFORM_MANAGED', false) || (
            filled(env('STRIPE_PUBLIC_KEY'))
            && filled(env('STRIPE_SECRET_KEY'))
            && filled(env('STRIPE_WEBHOOK_SECRET'))
        ),
        'secret_key' => env('STRIPE_SECRET_KEY'),
        'public_key' => env('STRIPE_PUBLIC_KEY'),
        'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),

        // Canadian platform (Optional)
        'ca_secret_key' => env('STRIPE_CA_SECRET_KEY', env('STRIPE_SECRET_KEY')),
        'ca_public_key' => env('STRIPE_CA_PUBLIC_KEY', env('STRIPE_PUBLIC_KEY')),
        'ca_webhook_secret' => env('STRIPE_CA_WEBHOOK_SECRET', env('STRIPE_WEBHOOK_SECRET')),

        // Irish platform (Optional)
        'ie_secret_key' => env('STRIPE_IE_SECRET_KEY', env('STRIPE_SECRET_KEY')),
        'ie_public_key' => env('STRIPE_IE_PUBLIC_KEY', env('STRIPE_PUBLIC_KEY')),
        'ie_webhook_secret' => env('STRIPE_IE_WEBHOOK_SECRET', env('STRIPE_WEBHOOK_SECRET')),

        // Primary platform for new organizers
        'primary_platform' => env('STRIPE_PRIMARY_PLATFORM'),
    ],
    'neem' => [
        'enabled' => env('NEEM_ENABLED', env('NEEM_BASE_TOKEN') !== null),
        'base_url' => env('NEEM_BASE_URL'),
        'base_token' => env('NEEM_BASE_TOKEN'),
        'partner_id' => env('NEEM_PARTNER_ID'),
        'decryption_key' => env('NEEM_DECRYPTION_KEY'),
        'placeholder_mobile_number' => env('NEEM_PLACEHOLDER_MOBILE_NUMBER', '923001234567'),
        'application_fee' => env('APPLICATION_FEE', 0),
    ],
    'open_exchange_rates' => [
        'app_id' => env('OPEN_EXCHANGE_RATES_APP_ID'),
    ],
    'geo' => [
        'provider' => env('GEO_PROVIDER', 'google'),
        'google' => [
            'api_key' => env('GOOGLE_MAPS_API_KEY'),
        ],
    ],
];
