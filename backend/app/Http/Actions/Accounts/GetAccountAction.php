<?php

declare(strict_types=1);

namespace HiEvents\Http\Actions\Accounts;

use HiEvents\DomainObjects\Enums\Role;
use HiEvents\Http\Actions\BaseAction;
use HiEvents\Repository\Interfaces\AccountRepositoryInterface;
use HiEvents\Resources\Account\AccountResource;
use HiEvents\Services\Domain\Account\AccountDeletionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class GetAccountAction extends BaseAction
{
    public function __construct(
        private readonly AccountRepositoryInterface $accountRepository,
        private readonly AccountDeletionService $accountDeletionService,
    ) {}

    public function __invoke(?int $accountId = null): JsonResponse
    {
        $this->minimumAllowedRole(Role::ORGANIZER);

        $authenticatedAccountId = $this->getAuthenticatedAccountId();

        // Cache the full JSON response for 60s to skip 2 PlanetScale queries (~3s).
        $cacheKey = "account:{$authenticatedAccountId}:json";
        try {
            $cached = Cache::store('redis')->get($cacheKey);
            if ($cached !== null) {
                return response()->json($cached, 200);
            }
        } catch (\Exception $e) {
            Log::warning('Account cache read failed: ' . $e->getMessage());
        }

        $account = $this->accountRepository->findById($authenticatedAccountId);
        $account->setActiveDeletionRequest($this->accountDeletionService->findActiveRequest($authenticatedAccountId));

        $response = $this->resourceResponse(AccountResource::class, $account);

        // Cache the JSON response for 60s.
        try {
            Cache::store('redis')->put($cacheKey, json_decode($response->getContent(), true), 60);
        } catch (\Exception $e) {
            Log::warning('Account cache write failed: ' . $e->getMessage());
        }

        return $response;
    }
}
