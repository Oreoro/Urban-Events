<?php

namespace Tests\Unit\Http\Actions\Orders\Payment\Neem;

use HiEvents\Http\Actions\Orders\Payment\Neem\CreateNeemPaymentConfirmationActionPublic;
use HiEvents\Repository\Interfaces\AffiliateRepositoryInterface;
use HiEvents\Repository\Interfaces\AttendeeRepositoryInterface;
use HiEvents\Repository\Interfaces\OrderRepositoryInterface;
use HiEvents\Services\Domain\Order\OrderApplicationFeeService;
use HiEvents\Services\Domain\Product\ProductQuantityUpdateService;
use HiEvents\Services\Infrastructure\DomainEvents\DomainEventDispatcherService;
use Illuminate\Http\Request;
use Psr\Log\LoggerInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Tests\TestCase;

class CreateNeemPaymentConfirmationActionPublicTest extends TestCase
{
    public function test_decryption_errors_are_logged_without_being_exposed_to_the_customer(): void
    {
        config()->set('services.neem.decryption_key', 'invalid-private-key');

        $logger = $this->createMock(LoggerInterface::class);
        $logger->expects($this->once())
            ->method('error')
            ->with('Neem payment confirmation error', [
                'event_id' => 42,
                'order_short_id' => 'order-123',
                'exception' => \RuntimeException::class,
            ]);

        $action = new CreateNeemPaymentConfirmationActionPublic(
            $this->createStub(HttpClientInterface::class),
            $this->createStub(OrderRepositoryInterface::class),
            $this->createStub(OrderApplicationFeeService::class),
            $this->createStub(ProductQuantityUpdateService::class),
            $this->createStub(AffiliateRepositoryInterface::class),
            $this->createStub(DomainEventDispatcherService::class),
            $this->createStub(AttendeeRepositoryInterface::class),
            $logger,
        );

        $request = Request::create('/confirm', 'POST', [
            'status' => '%%%',
            'transactionId' => '%%%',
            'basketId' => '%%%',
        ]);

        $response = $action($request, 42, 'order-123');
        $payload = json_decode((string) $response->getContent(), true, flags: JSON_THROW_ON_ERROR);

        $this->assertSame(422, $response->getStatusCode());
        $this->assertSame('Neem could not confirm this payment. Please contact support.', $payload['message']);
        $this->assertStringNotContainsString('decode', $payload['message']);
    }
}
