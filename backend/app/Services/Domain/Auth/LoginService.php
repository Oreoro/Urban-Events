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
use PHPOpenSourceSaver\JWTAuth\JWTAuth;
use Psr\Log\LoggerInterface;

readonly class LoginService
{
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
        $token = $this->jwtAuth->attempt([
            'email' => strtolower($email),
            'password' => $password,
        ]);

        if (! $token) {
            throw new UnauthorizedException(__('Username or Password are incorrect'));
        }

        // Reuse the user already loaded by attempt() to avoid a redundant
        // DB round-trip (planet-scale latency is ~1.5s per query).
        $guardUser = auth()->guard('api')->user();
        /** @var UserDomainObject $user */
        $user = UserDomainObject::hydrateFromModel($guardUser ?? $this->jwtAuth->user());

        $userAccounts = $this->accountUserRepository
            ->loadRelation(new Relationship(domainObject: AccountDomainObject::class, name: 'account'))
            ->findWhere([
                'user_id' => $user->getId(),
            ]);
        $accounts = $userAccounts->map(fn ($accountUser) => $accountUser->getAccount());

        $accounts = $userAccounts->map(fn ($accountUser) => $accountUser->getAccount());

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

        // Generate token from the already-authenticated user instead of
        // re-authenticating (saves a DB round-trip to PlanetScale).
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
