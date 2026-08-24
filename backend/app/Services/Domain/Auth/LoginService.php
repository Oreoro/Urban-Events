<?php

namespace HiEvents\Services\Domain\Auth;

use HiEvents\DomainObjects\AccountDomainObject;
use HiEvents\DomainObjects\AccountUserDomainObject;
use HiEvents\DomainObjects\Enums\Role;
use HiEvents\DomainObjects\Status\UserStatus;
use HiEvents\DomainObjects\UserDomainObject;
use HiEvents\Exceptions\UnauthorizedException;
use HiEvents\Repository\Eloquent\Value\Relationship;
use HiEvents\Repository\Interfaces\AccountUserRepositoryInterface;
use HiEvents\Services\Domain\Auth\DTO\LoginResponse;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use PHPOpenSourceSaver\JWTAuth\JWTAuth;
use Psr\Log\LoggerInterface;

readonly class LoginService
{
    // Cache account-user lookup for 60s after successful password verification.
    // Saves a DB round-trip to PlanetScale (~1.5s) on repeat logins.
    private const ACCOUNT_CACHE_TTL = 60;

    public function __construct(
        private JWTAuth $jwtAuth,
        private LoggerInterface $logger,
        private AccountUserRepositoryInterface $accountUserRepository,
    ) {}

    /**
     * @throws UnauthorizedException
     */
    public function authenticate(string $email, string $password, ?int $requestedAccountId): LoginResponse
    {
        // Step 1: Verify password (always hits DB — cannot be cached).
        $token = $this->jwtAuth->attempt([
            'email' => strtolower($email),
            'password' => $password,
        ]);

        if (! $token) {
            throw new UnauthorizedException(__('Username or Password are incorrect'));
        }

        // Password verified. Reuse the user already loaded by attempt().
        $guardUser = auth()->guard('api')->user();
        /** @var UserDomainObject $user */
        $user = UserDomainObject::hydrateFromModel($guardUser ?? $this->jwtAuth->user());

        // Step 2: Load account-user relationships (expensive DB query).
        // Try Redis cache first — avoids a ~1.5s PlanetScale round-trip.
        $userId = $user->getId();
        $cacheKey = "auth:user_accounts:{$userId}";
        $cachedAccounts = Cache::store('redis')->get($cacheKey);

        if ($cachedAccounts !== null) {
            // Reconstruct from cached arrays.
            $accounts = collect($cachedAccounts['accounts'] ?? [])
                ->map(fn ($data) => AccountDomainObject::hydrateFromArray($data));
            $userAccounts = collect($cachedAccounts['user_accounts'] ?? [])
                ->map(fn ($data) => AccountUserDomainObject::hydrateFromArray($data));
        } else {
            // Cache miss — hit PlanetScale (~1.5s).
            $userAccounts = $this->accountUserRepository
                ->loadRelation(new Relationship(domainObject: AccountDomainObject::class, name: 'account'))
                ->findWhere([
                    'user_id' => $userId,
                ]);
            $accounts = $userAccounts->map(fn ($accountUser) => $accountUser->getAccount());

            // Cache as arrays for 60s.
            Cache::store('redis')->put($cacheKey, [
                'accounts' => $accounts->map(fn ($a) => $a->toArray())->values()->all(),
                'user_accounts' => $userAccounts->map(fn ($au) => $au->toArray())->values()->all(),
            ], self::ACCOUNT_CACHE_TTL);
        }

        $accountId = $this->getAccountId($accounts, $requestedAccountId);

        if ($accountId) {
            $this->validateUserStatus($accountId, $userAccounts);
        }

        $userRole = $this->getUserRole($accountId, $userAccounts);

        return new LoginResponse(
            accounts: $accounts,
            token: $this->getToken(
                accountId: $accountId,
                userRole: $userRole,
            ),
            user: $user,
            accountId: $accountId,
        );
    }

    private function getAccountId(Collection $accounts, ?int $requestedAccountId): ?int
    {
        if ($accounts->count() === 1) {
            return $accounts->first()->getId();
        }

        if ($requestedAccountId) {
            $verifiedAccount = $accounts->firstWhere(fn (AccountDomainObject $account) => $account->getId() === $requestedAccountId);

            if ($verifiedAccount === null) {
                throw new UnauthorizedException(__('Account not found'));
            }

            return $verifiedAccount->getId();
        }

        return null;
    }

    private function getToken(
        ?int $accountId,
        ?Role $userRole,
    ): ?string {
        if ($accountId === null) {
            return null;
        }

        $claims = ['account_id' => $accountId];

        if ($userRole !== null) {
            $claims['role'] = $userRole->value;
        }

        $token = $this->jwtAuth->claims($claims)->fromUser(
            auth()->guard('api')->user()
        );

        return $token;
    }

    private function validateUserStatus(int $accountId, Collection $userAccounts): void
    {
        /** @var AccountUserDomainObject $currentAccount */
        $currentAccount = $userAccounts
            ->first(fn (AccountUserDomainObject $userAccount) => $userAccount->getAccountId() === $accountId);

        if ($currentAccount->getStatus() !== UserStatus::ACTIVE->name) {
            $this->logger->info(__('Attempt to log in to a non-active account'), $currentAccount->toArray());

            throw new UnauthorizedException(__('User account is not active'));
        }
    }

    private function getUserRole(?int $accountId, Collection $userAccounts): ?Role
    {
        if ($accountId === null) {
            return null;
        }

        /** @var AccountUserDomainObject $currentAccount */
        $currentAccount = $userAccounts
            ->first(fn (AccountUserDomainObject $userAccount) => $userAccount->getAccountId() === $accountId);

        return Role::from($currentAccount?->getRole());
    }
}
