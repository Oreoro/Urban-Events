<?php

namespace Tests\Unit\Http\Actions\Orders\Payment\Neem;

use HiEvents\Http\Actions\Orders\Payment\Neem\CreateNeemPaymentIntentActionPublic;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use ReflectionClass;

class CreateNeemPaymentIntentActionPublicTest extends TestCase
{
    #[DataProvider('mobileNumberProvider')]
    public function test_neem_mobile_number_normalization(string $input, string $expected, bool $isValid): void
    {
        $action = (new ReflectionClass(CreateNeemPaymentIntentActionPublic::class))
            ->newInstanceWithoutConstructor();

        $normalized = $this->callPrivateMethod($action, 'normalizeNeemMobileNumber', [$input]);

        $this->assertSame($expected, $normalized);
        $this->assertSame($isValid, $this->callPrivateMethod($action, 'isValidNeemMobileNumber', [$normalized]));
    }

    public static function mobileNumberProvider(): array
    {
        return [
            'country code format' => ['923001234567', '923001234567', true],
            'local format' => ['03001234567', '923001234567', true],
            'international plus format' => ['+92 300 1234567', '923001234567', true],
            'international zero-zero format' => ['00923001234567', '923001234567', true],
            'empty value' => ['', '', false],
            'too short' => ['0300123', '92300123', false],
            'non-pakistan country code' => ['12025550123', '12025550123', false],
        ];
    }

    private function callPrivateMethod(object $object, string $method, array $args): mixed
    {
        $reflectionMethod = new ReflectionClass($object)->getMethod($method);

        return $reflectionMethod->invokeArgs($object, $args);
    }
}
