<?php

namespace Tests\Unit\Services\Application\Handlers\Order\Payment\Stripe;

use HiEvents\DomainObjects\AccountDomainObject;
use HiEvents\DomainObjects\Enums\PaymentProviders;
use HiEvents\DomainObjects\Enums\StripePlatform;
use HiEvents\DomainObjects\EventDomainObject;
use HiEvents\DomainObjects\EventSettingDomainObject;
use HiEvents\DomainObjects\OrderDomainObject;
use HiEvents\DomainObjects\OrganizerDomainObject;
use HiEvents\DomainObjects\Status\OrderStatus;
use HiEvents\DomainObjects\StripePaymentDomainObject;
use HiEvents\Repository\Interfaces\AccountRepositoryInterface;
use HiEvents\Repository\Interfaces\EventSettingsRepositoryInterface;
use HiEvents\Repository\Interfaces\OrderRepositoryInterface;
use HiEvents\Repository\Interfaces\OrganizerRepositoryInterface;
use HiEvents\Repository\Interfaces\StripePaymentsRepositoryInterface;
use HiEvents\Services\Application\Handlers\Order\Payment\Stripe\CreatePaymentIntentHandler;
use HiEvents\Services\Domain\Payment\Stripe\StripePaymentIntentCreationService;
use HiEvents\Services\Infrastructure\Session\CheckoutSessionManagementService;
use HiEvents\Services\Infrastructure\Stripe\StripeClientFactory;
use HiEvents\Services\Infrastructure\Stripe\StripeConfigurationService;
use Mockery;
use Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;
use Stripe\StripeClient;
use Tests\TestCase;

class CreatePaymentIntentHandlerTest extends TestCase
{
    use MockeryPHPUnitIntegration;

    public function test_platform_managed_checkout_ignores_legacy_connected_account(): void
    {
        config([
            'services.stripe.enabled' => true,
            'services.stripe.platform_managed' => true,
        ]);

        $event = Mockery::mock(EventDomainObject::class);
        $event->shouldReceive('getOrganizerId')->andReturn(9);

        $stripePayment = Mockery::mock(StripePaymentDomainObject::class);
        $stripePayment->shouldReceive('getPaymentIntentId')->andReturn('pi_existing');

        $order = Mockery::mock(OrderDomainObject::class);
        $order->shouldReceive('getSessionId')->andReturn('checkout-session');
        $order->shouldReceive('getStatus')->andReturn(OrderStatus::RESERVED->name);
        $order->shouldReceive('isReservedOrderExpired')->andReturn(false);
        $order->shouldReceive('getEvent')->andReturn($event);
        $order->shouldReceive('getEventId')->andReturn(42);
        $order->shouldReceive('getStripePayment')->andReturn($stripePayment);

        $orderRepository = Mockery::mock(OrderRepositoryInterface::class);
        $orderRepository->shouldReceive('loadRelation')->times(3)->andReturnSelf();
        $orderRepository->shouldReceive('findByShortId')->with('ORDER123')->andReturn($order);

        $sessionService = Mockery::mock(CheckoutSessionManagementService::class);
        $sessionService->shouldReceive('verifySession')->with('checkout-session')->andReturn(true);

        $eventSettingsRepository = Mockery::mock(EventSettingsRepositoryInterface::class);
        $eventSettingsRepository->shouldReceive('findFirstWhere')
            ->with(['event_id' => 42])
            ->andReturn(
                (new EventSettingDomainObject)
                    ->setPaymentProviders([PaymentProviders::NEEM->value])
            );

        $organizer = Mockery::mock(OrganizerDomainObject::class);
        $organizer->shouldReceive('getActiveStripePlatform')->andReturn(StripePlatform::CANADA);
        $organizer->shouldReceive('getActiveStripeAccountId')->andReturn('acct_legacy');

        $organizerRepository = Mockery::mock(OrganizerRepositoryInterface::class);
        $organizerRepository->shouldReceive('loadRelation')->times(3)->andReturnSelf();
        $organizerRepository->shouldReceive('findById')->with(9)->andReturn($organizer);

        $accountRepository = Mockery::mock(AccountRepositoryInterface::class);
        $accountRepository->shouldReceive('findByEventId')
            ->with(42)
            ->andReturn(Mockery::mock(AccountDomainObject::class));

        $stripeConfiguration = Mockery::mock(StripeConfigurationService::class);
        $stripeConfiguration->shouldReceive('getPrimaryPlatform')->andReturn(null);
        $stripeConfiguration->shouldReceive('getPublicKey')->with(null)->andReturn('pk_test_platform');

        $stripeClient = new StripeClient('sk_test_platform');
        $stripeClientFactory = Mockery::mock(StripeClientFactory::class);
        $stripeClientFactory->shouldReceive('createForPlatform')->with(null)->andReturn($stripeClient);

        $paymentService = Mockery::mock(StripePaymentIntentCreationService::class);
        $paymentService->shouldReceive('retrievePaymentIntentClientSecretWithClient')
            ->with($stripeClient, 'pi_existing', null)
            ->andReturn('pi_existing_secret_test');

        $handler = new CreatePaymentIntentHandler(
            orderRepository: $orderRepository,
            stripePaymentService: $paymentService,
            sessionIdentifierService: $sessionService,
            stripePaymentsRepository: Mockery::mock(StripePaymentsRepositoryInterface::class),
            accountRepository: $accountRepository,
            organizerRepository: $organizerRepository,
            stripeClientFactory: $stripeClientFactory,
            stripeConfigurationService: $stripeConfiguration,
            eventSettingsRepository: $eventSettingsRepository,
        );

        $result = $handler->handle('ORDER123');

        $this->assertNull($result->accountId);
        $this->assertNull($result->stripePlatform);
        $this->assertSame('pk_test_platform', $result->publicKey);
        $this->assertSame('pi_existing_secret_test', $result->clientSecret);
    }
}
