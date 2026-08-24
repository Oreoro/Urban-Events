<?php

namespace HiEvents\Services\Domain\Auth;

use Exception;
use HiEvents\DomainObjects\AccountUserDomainObject;
use HiEvents\DomainObjects\Enums\Role;
use HiEvents\DomainObjects\Interfaces\DomainObjectInterface;
use HiEvents\DomainObjects\UserDomainObject;
use HiEvents\Models\User;
use HiEvents\Repository\Interfaces\AccountUserRepositoryInterface;
use Illuminate\Auth\AuthManager;
use Illuminate\Support\Facades\Cache;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;
use PHPOpenSourceSaver\JWTAuth\Payload;

readonly class AuthUserService
{
    // Cache user profile for 60s to avoid DB round-trips on repeated
    // /api/users/me calls (each DB query to PlanetScale is ~1.5s).
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
        } catch (Exception) {
            return null;
        }
    }

    public function getUser(): UserDomainObject|DomainObjectInterface|null
    {
        /** @var User $user */
        if ($user = $this->authManager->user()) {
            $userId = $user->getId();
            $accountId = $this->getAuthenticatedAccountId();
            $cacheKey = "auth:user:{$userId}:{$accountId}";

            // Try to reconstruct from cached array data.
            $cached = Cache::store('redis')->get($cacheKey);
            if (is_array($cached)) {
                $userObj = UserDomainObject::hydrateFromArray($cached['user']);
                if (isset($cached['account_user'])) {
                    $accountUser = AccountUserDomainObject::hydrateFromArray($cached['account_user']);
                    if (isset($cached['account'])) {
                        $accountUser->setAccount(
                            \HiEvents\DomainObjects\AccountDomainObject::hydrateFromArray($cached['account'])
                        );
                    }
                    $userObj->setCurrentAccountUser($accountUser);
                }
                return $userObj;
            }

            // Cache miss — load from DB (2 queries, ~3s to PlanetScale).
            $userObj = UserDomainObject::hydrateFromModel($user);

            if ($accountId) {
                $accountUser = $this->accountUserRepository->findFirstWhere([
                    'user_id' => $userId,
                    'account_id' => $accountId,
                ]);
                $userObj->setCurrentAccountUser($accountUser);

                // Cache as arrays (domain objects can't be serialized to Redis).
                $cacheData = [
                    'user' => $userObj->toArray(),
                    'account_user' => $accountUser?->toArray(),
                    'account' => $accountUser?->getAccount()?->toArray(),
                ];
                Cache::store('redis')->put($cacheKey, $cacheData, self::USER_CACHE_TTL);
            }

            return $userObj;
        }

        return null;
    }
}
