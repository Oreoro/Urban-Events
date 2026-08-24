<?php

declare(strict_types=1);

namespace HiEvents\Http\Actions\Common;

use HiEvents\Http\Actions\BaseAction;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redis;
use Throwable;

class GetRedisHealthAction extends BaseAction
{
    public function __invoke(): JsonResponse
    {
        // Cache health response for 10s to avoid hitting Redis on every check.
        $cached = Cache::store('redis')->get('healthz:response');
        if ($cached !== null) {
            return $this->jsonResponse(data: $cached);
        }

        $connectionName = config('cache.stores.redis.connection');

        try {
            $pong = Redis::connection($connectionName)->command('PING');
        } catch (Throwable) {
            return $this->jsonResponse(
                data: ['status' => 'unhealthy'],
                statusCode: 503,
            );
        }

        if (! in_array($pong, [true, '+PONG', 'PONG'], true)) {
            return $this->jsonResponse(
                data: ['status' => 'unhealthy'],
                statusCode: 503,
            );
        }

        $response = [
            'cache_driver' => config('cache.default'),
            'redis_connection' => $connectionName,
            'status' => 'ok',
        ];

        Cache::store('redis')->put('healthz:response', $response, 10);

        return $this->jsonResponse(data: $response);
    }
}
