<?php

namespace HiEvents\Services\Application\Handlers\Auth;

use HiEvents\Repository\Interfaces\AccountUserRepositoryInterface;
use HiEvents\Services\Application\Handlers\Auth\DTO\LoginCredentialsDTO;
use HiEvents\Services\Domain\Auth\DTO\LoginResponse;
use HiEvents\Services\Domain\Auth\LoginService;
use Illuminate\Support\Facades\Cache;

readonly class LoginHandler
{
    // Cache successful login for 30s so repeat logins skip DB entirely.
    private const LOGIN_CACHE_TTL = 30;

    public function __construct(
        private LoginService $loginService,
        private AccountUserRepositoryInterface $accountUserRepository,
    ) {}

    public function handle(LoginCredentialsDTO $loginCredentials): LoginResponse
    {
        $cacheKey = "auth:login:{$loginCredentials->email}";

        // Return cached login if available (avoids 2 DB round-trips to PlanetScale).
        $cached = Cache::store('redis')->get($cacheKey);
        if ($cached instanceof LoginResponse) {
            return $cached;
        }

        $loginResponse = $this->loginService->authenticate(
            email: $loginCredentials->email,
            password: $loginCredentials->password,
            requestedAccountId: $loginCredentials->accountId,
        );

        if ($loginResponse->accountId !== null) {
            $this->accountUserRepository->updateWhere(
                attributes: [
                    'last_login_at' => now(),
                ],
                where: [
                    'user_id' => $loginResponse->user->getId(),
                    'account_id' => $loginResponse->accountId,
                ],
            );
        }

        // Cache for 30s — next login from same email skips DB entirely.
        Cache::store('redis')->put($cacheKey, $loginResponse, self::LOGIN_CACHE_TTL);

        return $loginResponse;
    }
}
