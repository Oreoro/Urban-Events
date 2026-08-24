<?php

namespace HiEvents\Http\Actions\Organizers;

use HiEvents\DomainObjects\ImageDomainObject;
use HiEvents\Http\Actions\BaseAction;
use HiEvents\Repository\Interfaces\OrganizerRepositoryInterface;
use HiEvents\Resources\Organizer\OrganizerResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class GetOrganizersAction extends BaseAction
{
    public function __construct(private readonly OrganizerRepositoryInterface $organizerRepository) {}

    public function __invoke(): JsonResponse
    {
        $accountId = $this->getAuthenticatedAccountId();

        // Cache organizers JSON for 60s to skip PlanetScale round-trips.
        $cacheKey = "account:{$accountId}:organizers:json";
        try {
            $cached = Cache::store('redis')->get($cacheKey);
            if ($cached !== null) {
                return response()->json($cached, 200);
            }
        } catch (\Exception $e) {
            Log::warning('Organizers cache read failed: ' . $e->getMessage());
        }

        $organizers = $this->organizerRepository
            ->loadRelation(ImageDomainObject::class)
            ->findwhere([
                'account_id' => $accountId,
            ]);

        $response = $this->resourceResponse(
            resource: OrganizerResource::class,
            data: $organizers,
        );

        try {
            Cache::store('redis')->put($cacheKey, json_decode($response->getContent(), true), 60);
        } catch (\Exception $e) {
            Log::warning('Organizers cache write failed: ' . $e->getMessage());
        }

        return $response;
    }
}
