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
        // ALWAYS authenticate — never skip password verification.
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

        // Cache AFTER successful authentication so subsequent rapid
        // login attempts from the same session skip the DB queries.
        // Password is always verified first.
        $cacheKey = "auth:login:{$loginCredentials->email}";
        Cache::store('redis')->put($cacheKey, $loginResponse, self::LOGIN_CACHE_TTL);

        return $loginResponse;
    }
}
