<?php

declare(strict_types=1);

namespace HiEvents\Redis;

use Predis\Connection\StreamConnection;

/**
 * Predis connection that strips the SELECT command from init commands.
 *
 * Upstash free-tier Redis rejects SELECT with NOPERM. We remove it
 * before the parent connect() sends the init pipeline.
 */
class UpstashConnection extends StreamConnection
{
    public function connect(): void
    {
        $this->initCommands = array_values(array_filter(
            $this->initCommands,
            static fn ($cmd) => strtoupper($cmd->getId()) !== 'SELECT',
        ));

        parent::connect();
    }
}
