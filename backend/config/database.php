<?php

use Illuminate\Support\Str;

// Safely parse the DATABASE_URL. parse_url() can return false on malformed URLs.
// This ensures $url is always an array, preventing errors.
$url = parse_url(env('DATABASE_URL', ''));

return [

    /*
    |--------------------------------------------------------------------------
    | Default Database Connection Name
    |--------------------------------------------------------------------------
    */
    'default' => env('DB_CONNECTION', 'pgsql'),

    /*
    |--------------------------------------------------------------------------
    | Database Connections
    |--------------------------------------------------------------------------
    */
    'connections' => [
        // ... other connections like sqlite, mysql ...

        'pgsql' => [
            'driver' => 'pgsql',
            'url' => env('DATABASE_URL'),
            'host' => $url['host'] ?? env('DB_HOST', '127.0.0.1'),
            'port' => $url['port'] ?? env('DB_PORT', '5432'),
            // Correctly parse the database name from the URL path by removing the leading '/'
            'database' => isset($url['path']) ? ltrim($url['path'], '/') : env('DB_DATABASE', 'forge'),
            'username' => $url['user'] ?? env('DB_USERNAME', 'forge'),
            'password' => $url['pass'] ?? env('DB_PASSWORD', ''),
            'charset' => 'utf8',
            'prefix' => '',
            'prefix_indexes' => true,
            'search_path' => 'public',
            'sslmode' => "prefer",// Changed default to 'prefer' for better local dev compatibility
            /* 'sslrootcert' => env('DB_SSL_ROOT_CERT', ''), */
        
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Migration Repository Table
    |--------------------------------------------------------------------------
    */
    'migrations' => 'migrations',

    /*
    |--------------------------------------------------------------------------
    | Redis Databases
    |--------------------------------------------------------------------------
    |
    | Redis is an open source, in-memory data structure store, used as a
    | database, cache, and message broker. You may configure several
    | Redis connections to be used by your application.
    |
    */
    'redis' => [
        'client' => env('REDIS_CLIENT', 'phpredis'),

        'options' => [
            'cluster' => env('REDIS_CLUSTER', 'redis'),
            'prefix' => env('REDIS_PREFIX', Str::slug(env('APP_NAME', 'laravel'), '_').'_database_'),
        ],

        'default' => [
            'url' => env('REDIS_URL'), // Added support for REDIS_URL
            'host' => env('REDIS_HOST', '127.0.0.1'),
            'password' => env('REDIS_PASSWORD'),
            'port' => env('REDIS_PORT', '6379'),
            'database' => env('REDIS_DB', '0'),
            // Made TLS/SSL scheme configurable. Set to null for no encryption.
            'scheme' => env('REDIS_SCHEME', 'tcp'),
            'read_write_timeout' => -1,
        ],

        'cache' => [
            'url' => env('REDIS_URL'), // Added support for REDIS_URL
            'host' => env('REDIS_HOST', '127.0.0.1'),
            'password' => env('REDIS_PASSWORD'),
            'port' => env('REDIS_PORT', '6379'),
            'database' => env('REDIS_CACHE_DB', '1'),
            // Made TLS/SSL scheme configurable. Set to null for no encryption.
            'scheme' => env('REDIS_SCHEME', 'tcp'),
            'read_write_timeout' => -1,
        ],
    ],
];
