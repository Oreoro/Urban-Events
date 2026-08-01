<?php

namespace Tests\Unit\Helper;

use HiEvents\Helper\EmailHelper;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

class EmailHelperTest extends TestCase
{
    public function test_resolve_from_address_returns_a_valid_configured_address(): void
    {
        $this->assertSame(
            'mail@urbanevents.pk',
            EmailHelper::resolveFromAddress('  mail@urbanevents.pk  ')
        );
    }

    #[DataProvider('invalidFromAddressProvider')]
    public function test_resolve_from_address_falls_back_for_invalid_configuration(mixed $address): void
    {
        $this->assertSame(
            EmailHelper::DEFAULT_FROM_ADDRESS,
            EmailHelper::resolveFromAddress($address)
        );
    }

    public static function invalidFromAddressProvider(): array
    {
        return [
            'missing at sign' => ['noreply.urbanevents.pk'],
            'missing domain' => ['noreply@'],
            'empty string' => [''],
            'null' => [null],
            'boolean' => [false],
        ];
    }
}
