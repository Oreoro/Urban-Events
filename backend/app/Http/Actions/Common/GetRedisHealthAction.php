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
        $connectionName = config('cache.stores.redis.connection');

        try {
            $pong = Redis::connection($connectionName)->command('PING');
            Cache::store('redis')->put('healthz:redis', true, 2);
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

        return $this->jsonResponse(data: [
            'cache_driver' => config('cache.default'),
            'redis_connection' => $connectionName,
            'status' => 'ok',
        ]);
    }
}
