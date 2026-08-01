<?php

declare(strict_types=1);

namespace Database\Factories;

use HiEvents\Helper\IdHelper;
use HiEvents\Models\Account;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Account>
 */
class AccountFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'timezone' => 'Asia/Karachi',
            'currency_code' => 'PKR',
            'short_id' => IdHelper::shortId(IdHelper::ACCOUNT_PREFIX),
            'account_configuration_id' => 1,
        ];
    }

    public function verified(): self
    {
        return $this->state(fn (array $attributes) => [
            'account_verified_at' => now(),
        ]);
    }

    public function manuallyVerified(): self
    {
        return $this->state(fn (array $attributes) => [
            'is_manually_verified' => true,
        ]);
    }
}
