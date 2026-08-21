<?php

declare(strict_types=1);

namespace HiEvents\Redis;

use Predis\Configuration\OptionsInterface;
use Predis\Connection\Factory;

/**
 * Connection factory that uses UpstashConnection (which strips SELECT)
 * for all tcp/tls connections.
 */
class UpstashConnectionFactory extends Factory
{
    public function __construct()
    {
        parent::__construct();

        $this->define('tcp', UpstashConnection::class);
        $this->define('tls', UpstashConnection::class);
    }
}
