<?php

namespace HiEvents\Helper;

class EmailHelper
{
    public const DEFAULT_FROM_ADDRESS = 'noreply@urbanevents.pk';

    private const PLUS_ALIASING_PROVIDERS = [
        'gmail.com',
        'googlemail.com',
        'outlook.com',
        'hotmail.com',
        'live.com',
        'protonmail.com',
        'proton.me',
        'fastmail.com',
        'yahoo.com',
        'icloud.com',
    ];

    public static function normalize(string $email): string
    {
        $email = strtolower(trim($email));
        [$local, $domain] = explode('@', $email, 2);

        if (in_array($domain, self::PLUS_ALIASING_PROVIDERS, true)) {
            $local = preg_replace('/\+.*$/', '', $local);
        }

        return $local.'@'.$domain;
    }

    public static function resolveFromAddress(mixed $email): string
    {
        if (!is_string($email)) {
            return self::DEFAULT_FROM_ADDRESS;
        }

        $email = trim($email);

        if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
            return self::DEFAULT_FROM_ADDRESS;
        }

        return $email;
    }
}
