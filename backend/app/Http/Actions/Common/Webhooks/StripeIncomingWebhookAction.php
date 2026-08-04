<?php

namespace HiEvents\Http\Actions\Common\Webhooks;

use HiEvents\Http\Actions\BaseAction;
use HiEvents\Http\ResponseCodes;
use HiEvents\Services\Application\Handlers\Order\Payment\Stripe\DTO\StripeWebhookDTO;
use HiEvents\Services\Application\Handlers\Order\Payment\Stripe\IncomingWebhookHandler;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Stripe\Exception\SignatureVerificationException;
use Throwable;
use UnexpectedValueException;

class StripeIncomingWebhookAction extends BaseAction
{
    public function __construct(
        private readonly IncomingWebhookHandler $incomingWebhookHandler,
    ) {}

    public function __invoke(Request $request): Response
    {
        $headerSignature = $request->header('Stripe-Signature');

        if (! is_string($headerSignature) || $headerSignature === '') {
            return $this->noContentResponse(ResponseCodes::HTTP_BAD_REQUEST);
        }

        try {
            $this->incomingWebhookHandler->handle(new StripeWebhookDTO(
                headerSignature: $headerSignature,
                payload: $request->getContent(),
            ));
        } catch (SignatureVerificationException|UnexpectedValueException $exception) {
            logger()->warning('Rejected invalid Stripe webhook', [
                'exception' => $exception,
            ]);

            return $this->noContentResponse(ResponseCodes::HTTP_BAD_REQUEST);
        } catch (Throwable $exception) {
            logger()->error('Failed to handle incoming Stripe webhook', [
                'exception' => $exception,
            ]);

            return $this->noContentResponse(ResponseCodes::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $this->noContentResponse();
    }
}
