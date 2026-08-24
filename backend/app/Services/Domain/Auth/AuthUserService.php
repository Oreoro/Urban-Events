<?php

namespace HiEvents\Services\Domain\Auth;

use HiEvents\DomainObjects\Enums\Role;
use HiEvents\DomainObjects\Interfaces\DomainObjectInterface;
use HiEvents\DomainObjects\UserDomainObject;
use HiEvents\Repository\Interfaces\AccountUserRepositoryInterface;
use Illuminate\Auth\AuthManager;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;
use PHPOpenSourceSaver\JWTAuth\Payload;

readonly class AuthUserService
{
    // Cache authenticated user profile for 60s to avoid 2 DB round-trips
    // to PlanetScale (~1.5s each) on repeated /api/users/me calls.
    private const USER_CACHE_TTL = 60;

    public function __construct(
        private AuthManager $authManager,
        private AccountUserRepositoryInterface $accountUserRepository,
    ) {}

    public function getAuthenticatedAccountId(): ?int
    {
        if (! $this->authManager->check()) {
            return null;
        }

        try {
            /** @var Payload $payload */
            $payload = $this->authManager->payload();
        } catch (JWTException) {
            return null;
        }

        return $payload->get('account_id');
    }

    public function getAuthenticatedUserRole(): ?Role
    {
        if (! $this->authManager->check()) {
            return null;
        }

        try {
            /** @var Payload $payload */
            $payload = $this->authManager->payload();
        } catch (JWTException) {
            return null;
        }

        try {
            return Role::from($payload->get('role'));
        } catch (\Exception) {
            return null;
        }
    }

    public function getUser(): UserDomainObject|DomainObjectInterface|null
    {
        if ($user = $this->authManager->user()) {
            $userId = $user->getKey();
            $accountId = $this->getAuthenticatedAccountId();
            $cacheKey = "auth:user:{$userId}:{$accountId}";

            // Try Redis cache first — saves ~3s of PlanetScale round-trips.
            try {
                $cached = Cache::store('redis')->get($cacheKey);
                if (is_array($cached)) {
                    $userObj = UserDomainObject::hydrateFromArray($cached['user']);
                    if (!empty($cached['account_user_id'])) {
                        $accountUser = $this->accountUserRepository->findFirstWhere([
                            'id' => $cached['account_user_id'],
                        ]);
                        if ($accountUser) {
                            $userObj->setCurrentAccountUser($accountUser);
                        }
                    }
                    return $userObj;
                }
            } catch (\Exception $e) {
                Log::warning('Auth cache read failed: ' . $e->getMessage());
            }

            // Cache miss — load from DB (2 queries, ~3s to PlanetScale).
            $userObj = UserDomainObject::hydrateFromModel($user);

            if ($accountId) {
                $accountUser = $this->accountUserRepository->findFirstWhere([
                    'user_id' => $userId,
                    'account_id' => $accountId,
                ]);
                $userObj->setCurrentAccountUser($accountUser);

                // Cache the account_user ID for 60s to skip the DB query next time.
                // We don't cache the full domain object arrays because hydrateFromArray
                // is fragile with nested relations. Instead we just cache the lookup key.
                try {
                    if ($accountUser) {
                        Cache::store('redis')->put($cacheKey, [
                            'user' => $userObj->toArray(),
                            'account_user_id' => $accountUser->getId(),
                        ], self::USER_CACHE_TTL);
                    }
                } catch (\Exception $e) {
                    Log::warning('Auth cache write failed: ' . $e->getMessage());
                }
            }

            return $userObj;
        }

        return null;
    }
}
