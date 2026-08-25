<?php

namespace HiEvents\Http\Middleware;

use Closure;
use HiEvents\Models\User;
use Illuminate\Support\Facades\Auth;

class SetAccountContext
{
    public function handle($request, Closure $next)
    {
        // Read account_id directly from JWT payload instead of Auth::check()
        // which triggers a DB query (~1.5s to PlanetScale).
        try {
            $accountId = Auth::payload()->get('account_id');
            if ($accountId) {
                User::setCurrentAccountId($accountId);
            }
        } catch (\Exception) {
            // No valid token — continue without account context.
        }

        return $next($request);
    }
}
