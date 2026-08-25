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
    private const USER_CACHE_TTL = 120;

    public function __construct(
        private AuthManager $authManager,
        private AccountUserRepositoryInterface $accountUserRepository,
    ) {}

    public function getAuthenticatedAccountId(): ?int
    {
        // Read directly from JWT payload — avoids Auth::check() DB query (~1.5s).
        try {
            /** @var Payload $payload */
            $payload = $this->authManager->payload();
            return $payload->get('account_id');
        } catch (\Exception) {
            return null;
        }
    }

    public function getAuthenticatedUserRole(): ?Role
    {
        // Read directly from JWT payload — avoids Auth::check() DB query (~1.5s).
        try {
            /** @var Payload $payload */
            $payload = $this->authManager->payload();
            return Role::from($payload->get('role'));
        } catch (\Exception) {
            return null;
        }
    }

    public function getUser(): UserDomainObject|DomainObjectInterface|null
    {
        try {
            /** @var Payload $payload */
            $payload = $this->authManager->payload();
            $userId = (int) $payload->get('sub');
            $accountId = $payload->get('account_id');
        } catch (\Exception) {
            // Fallback to authManager->user() if payload fails.
            return $this->getUserFromDb();
        }

        if (!$userId) {
            return null;
        }

        // Try Redis cache FIRST — skip ALL DB queries (~3-4.5s saved).
        $cacheKey = "auth:user:{$userId}:{$accountId}";
        try {
            $cached = Cache::store('redis')->get($cacheKey);
            if (is_array($cached) && isset($cached['user'], $cached['account_user_id'])) {
                $userObj = UserDomainObject::hydrateFromArray($cached['user']);

                // Re-fetch accountUser by ID (fast index lookup, also cached).
                $auCacheKey = "auth:au:{$cached['account_user_id']}";
                $accountUser = Cache::store('redis')->get($auCacheKey);
                if ($accountUser === null) {
                    $accountUser = $this->accountUserRepository->findFirstWhere([
                        'id' => $cached['account_user_id'],
                    ]);
                    if ($accountUser) {
                        Cache::store('redis')->put($auCacheKey, $accountUser, self::USER_CACHE_TTL);
                    }
                }
                if ($accountUser) {
                    $userObj->setCurrentAccountUser($accountUser);
                }

                return $userObj;
            }
        } catch (\Exception $e) {
            Log::warning('Auth cache read failed: ' . $e->getMessage());
        }

        // Cache miss — load from DB (2-3 queries, ~3-4.5s to PlanetScale).
        $userObj = $this->getUserFromDb();
        if ($userObj === null) {
            return null;
        }

        $accountUserId = $userObj->getCurrentAccountUser()?->getId();

        // Cache the full user data + account_user ID for 120s.
        // Strip password hash for security.
        try {
            $userArray = $userObj->toArray();
            unset($userArray['password'], $userArray['remember_token']);
            Cache::store('redis')->put($cacheKey, [
                'user' => $userArray,
                'account_user_id' => $accountUserId,
            ], self::USER_CACHE_TTL);
        } catch (\Exception $e) {
            Log::warning('Auth cache write failed: ' . $e->getMessage());
        }

        return $userObj;
    }

    private function getUserFromDb(): ?UserDomainObject
    {
        if ($user = $this->authManager->user()) {
            $userId = $user->getKey();
            $accountId = $this->getAuthenticatedAccountId();
            $userObj = UserDomainObject::hydrateFromModel($user);

            if ($accountId) {
                $accountUser = $this->accountUserRepository->findFirstWhere([
                    'user_id' => $userId,
                    'account_id' => $accountId,
                ]);
                $userObj->setCurrentAccountUser($accountUser);
            }

            return $userObj;
        }

        return null;
    }
}
