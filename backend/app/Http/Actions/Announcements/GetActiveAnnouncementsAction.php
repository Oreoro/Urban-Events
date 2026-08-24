<?php

declare(strict_types=1);

namespace HiEvents\Http\Actions\Announcements;

use HiEvents\Exceptions\UnauthorizedException;
use HiEvents\Http\Actions\BaseAction;
use HiEvents\Resources\Announcement\AnnouncementResource;
use HiEvents\Services\Application\Handlers\Announcement\DTO\GetActiveAnnouncementsDTO;
use HiEvents\Services\Application\Handlers\Announcement\GetActiveAnnouncementsHandler;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class GetActiveAnnouncementsAction extends BaseAction
{
    public function __construct(
        private readonly GetActiveAnnouncementsHandler $handler,
    ) {}

    public function __invoke(): JsonResponse
    {
        if ((bool) Auth::payload()->get('is_impersonating', false)) {
            return $this->jsonResponse(['data' => []]);
        }

        try {
            $accountId = $this->getAuthenticatedAccountId();
        } catch (UnauthorizedException) {
            return $this->jsonResponse(['data' => []]);
        }

        $userId = $this->getAuthenticatedUser()->getId();

        // Cache announcements for 60s to skip PlanetScale queries.
        $cacheKey = "account:{$accountId}:announcements:{$userId}:json";
        try {
            $cached = Cache::store('redis')->get($cacheKey);
            if ($cached !== null) {
                return response()->json($cached, 200);
            }
        } catch (\Exception $e) {
            Log::warning('Announcements cache read failed: ' . $e->getMessage());
        }

        $announcements = $this->handler->handle(new GetActiveAnnouncementsDTO(
            userId: $userId,
            accountId: $accountId,
        ));

        $response = $this->resourceResponse(
            resource: AnnouncementResource::class,
            data: $announcements,
        );

        try {
            Cache::store('redis')->put($cacheKey, json_decode($response->getContent(), true), 60);
        } catch (\Exception $e) {
            Log::warning('Announcements cache write failed: ' . $e->getMessage());
        }

        return $response;
    }
}
