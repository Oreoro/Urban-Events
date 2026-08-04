<?php

namespace Tests\Unit\Http\Actions\Common\Webhooks;

use HiEvents\Http\Actions\Common\Webhooks\StripeIncomingWebhookAction;
use HiEvents\Services\Application\Handlers\Order\Payment\Stripe\DTO\StripeWebhookDTO;
use HiEvents\Services\Application\Handlers\Order\Payment\Stripe\IncomingWebhookHandler;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Mockery;
use Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;
use Symfony\Component\HttpFoundation\Response;
use Tests\TestCase;
use UnexpectedValueException;

class StripeIncomingWebhookActionTest extends TestCase
{
    use MockeryPHPUnitIntegration;

    protected function setUp(): void
    {
        parent::setUp();

        Log::spy();
    }

    public function test_valid_webhook_is_processed_before_success_response(): void
    {
        $handler = Mockery::mock(IncomingWebhookHandler::class);
        $handler->shouldReceive('handle')
            ->once()
            ->with(Mockery::on(fn (StripeWebhookDTO $dto) => $dto->headerSignature === 'sig_test'
                && $dto->payload === '{"id":"evt_test"}'));

        $response = (new StripeIncomingWebhookAction($handler))(
            $this->makeRequest('sig_test')
        );

        $this->assertSame(Response::HTTP_NO_CONTENT, $response->getStatusCode());
    }

    public function test_missing_signature_is_rejected(): void
    {
        $handler = Mockery::mock(IncomingWebhookHandler::class);
        $handler->shouldNotReceive('handle');

        $response = (new StripeIncomingWebhookAction($handler))(
            Request::create('/public/webhooks/stripe', 'POST', content: '{"id":"evt_test"}')
        );

        $this->assertSame(Response::HTTP_BAD_REQUEST, $response->getStatusCode());
    }

    public function test_invalid_signed_payload_is_rejected(): void
    {
        $handler = Mockery::mock(IncomingWebhookHandler::class);
        $handler->shouldReceive('handle')->once()->andThrow(new UnexpectedValueException('invalid payload'));

        $response = (new StripeIncomingWebhookAction($handler))(
            $this->makeRequest('sig_invalid')
        );

        $this->assertSame(Response::HTTP_BAD_REQUEST, $response->getStatusCode());
    }

    public function test_transient_processing_failure_requests_a_stripe_retry(): void
    {
        $handler = Mockery::mock(IncomingWebhookHandler::class);
        $handler->shouldReceive('handle')->once()->andThrow(new \RuntimeException('temporary failure'));

        $response = (new StripeIncomingWebhookAction($handler))(
            $this->makeRequest('sig_test')
        );

        $this->assertSame(Response::HTTP_INTERNAL_SERVER_ERROR, $response->getStatusCode());
    }

    private function makeRequest(string $signature): Request
    {
        return Request::create(
            '/public/webhooks/stripe',
            'POST',
            server: ['HTTP_STRIPE_SIGNATURE' => $signature],
            content: '{"id":"evt_test"}',
        );
    }
}
