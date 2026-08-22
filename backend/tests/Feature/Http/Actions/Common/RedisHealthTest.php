<?php

declare(strict_types=1);

namespace Tests\Feature\Http\Actions\Common;

use Closure;
use Illuminate\Contracts\Redis\Factory as RedisFactory;
use Illuminate\Redis\Connections\Connection;
use RuntimeException;
use Tests\TestCase;

class RedisHealthTest extends TestCase
{
    public function test_reports_healthy_when_redis_accepts_ping_and_cache_write(): void
    {
        $connection = new class extends Connection
        {
            public array $commands = [];

            public array $writes = [];

            public function createSubscription($channels, Closure $callback, $method = 'subscribe'): void {}

            public function command($method, array $parameters = [])
            {
                $this->commands[] = $method;

                return '+PONG';
            }

            public function setex($key, $seconds, $value): bool
            {
                $this->writes[] = [$key, $seconds, $value];

                return true;
            }
        };

        $this->app->instance(RedisFactory::class, new class($connection) implements RedisFactory
        {
            public function __construct(private readonly Connection $connection) {}

            public function connection($name = null): Connection
            {
                return $this->connection;
            }
        });
        $this->app->instance('redis', new class($connection) implements RedisFactory
        {
            public function __construct(private readonly Connection $connection) {}

            public function connection($name = null): Connection
            {
                return $this->connection;
            }
        });

        $response = $this->getJson('/health');

        $response->assertOk();
        $response->assertExactJson([
            'cache_driver' => 'array',
            'redis_connection' => 'cache',
            'status' => 'ok',
        ]);
        self::assertSame(['PING'], $connection->commands);
        self::assertCount(1, $connection->writes);
        self::assertSame(2, $connection->writes[0][1]);
        self::assertStringContainsString('healthz:redis', (string) $connection->writes[0][0]);
    }

    public function test_reports_unhealthy_when_redis_ping_fails(): void
    {
        $connection = new class extends Connection
        {
            public function createSubscription($channels, Closure $callback, $method = 'subscribe'): void {}

            public function command($method, array $parameters = [])
            {
                throw new RuntimeException('ping failed');
            }
        };

        $this->app->instance(RedisFactory::class, new class($connection) implements RedisFactory
        {
            public function __construct(private readonly Connection $connection) {}

            public function connection($name = null): Connection
            {
                return $this->connection;
            }
        });
        $this->app->instance('redis', new class($connection) implements RedisFactory
        {
            public function __construct(private readonly Connection $connection) {}

            public function connection($name = null): Connection
            {
                return $this->connection;
            }
        });

        $response = $this->getJson('/health');

        $response->assertServiceUnavailable();
        $response->assertExactJson(['status' => 'unhealthy']);
    }
}
