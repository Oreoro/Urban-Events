<?php

namespace HiEvents\Http\Actions\Orders\Payment\Neem;

use HiEvents\DomainObjects\Enums\PaymentProviders;
use HiEvents\DomainObjects\EventSettingDomainObject;
use HiEvents\DomainObjects\OrderDomainObject;
use HiEvents\DomainObjects\Status\OrderStatus;
use HiEvents\Exceptions\ResourceConflictException;
use HiEvents\Exceptions\UnauthorizedException;
use HiEvents\Http\Actions\BaseAction;
use HiEvents\Repository\Interfaces\EventSettingsRepositoryInterface;
use HiEvents\Repository\Interfaces\OrderRepositoryInterface;
use HiEvents\Services\Infrastructure\Session\CheckoutSessionManagementService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Throwable;

class CreateNeemPaymentIntentActionPublic extends BaseAction
{
    private const NEEM_TEST_MOBILE_NUMBER = '03114455788';

    public function __construct(
        private readonly HttpClientInterface $httpClient,
        private readonly OrderRepositoryInterface $orderRepository,
        private readonly EventSettingsRepositoryInterface $eventSettingsRepository,
        private readonly CheckoutSessionManagementService $sessionManagementService,
    ) {
    }

    public function __invoke(int $eventId, string $orderShortId): JsonResponse
    {
        try {
            $neemBaseUrl = rtrim($this->getRequiredConfig('NEEM_BASE_URL'), '/');
            $baseToken = $this->getRequiredConfig('NEEM_BASE_TOKEN');
            $baseToken = str_starts_with($baseToken, 'Basic ') ? $baseToken : 'Basic '.$baseToken;
            $neemPartnerId = $this->getRequiredConfig('NEEM_PARTNER_ID');
            $frontendUrl = rtrim($this->getRequiredConfig('APP_FRONTEND_URL'), '/');
            $neemRedirectUrl = $frontendUrl.'/checkout/'.$eventId.'/'.$orderShortId.'/payment_return';

            $order = $this->orderRepository->findByShortId($orderShortId);
            $this->validateOrder($order, $eventId);

            /** @var EventSettingDomainObject|null $eventSettings */
            $eventSettings = $this->eventSettingsRepository->findFirstWhere([
                'event_id' => $eventId,
            ]);
            $this->validateNeemPayment($eventSettings);

            // 1. Get OAuth2 token
            $authResponse = $this->httpClient->request('POST', $neemBaseUrl.'/v1/oauth2/token', [
                'headers' => [
                    'Authorization' => $baseToken,
                    'Content-Type' => 'application/x-www-form-urlencoded',
                ],
                'body' => [
                    'grant_type' => 'client_credentials',
                ],
            ]);

            $authData = $authResponse->toArray();
            $accessToken = $authData['access_token'] ?? null;

            if (!$accessToken) {
                return $this->errorResponse("Failed to get access token", Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            // 2. Prepare request data
            $requestData = [
                "Data" => [
                    "PODBill" => [
                        "BasketId" => $orderShortId,
                        "MobileNumber" => self::NEEM_TEST_MOBILE_NUMBER,
                        "Email" => $order->getEmail(),
                        "FullName" => $order->getFullName(),
                        "InstructedAmount" => [
                            "Amount" => (string)$order->getTotalGross(),
                            "Currency" => strtoupper($order->getCurrency()),
                        ],
                        "Scheme" => "POD",
                        "callBackUrl" => $neemRedirectUrl
                    ]
                ],
                "ExtendedProperties" => []
            ];

            // 3. Make the initiate call
            $initiateResponse = $this->httpClient->request('POST', $neemBaseUrl.'/v2/pod/initiate', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $accessToken,
                    'X-Neem-Partner-Id' => $neemPartnerId,
                    'Content-Type' => 'application/json',
                ],
                'json' => $requestData
            ]);

            $initiateResponse = $initiateResponse->toArray();

            if($initiateResponse['Data']['PODBill']['StatusCode'] != 'N100') {
                return $this->errorResponse('Failed to get Payment Provider Information', Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            return $this->jsonResponse([
                'redirect_url' => $initiateResponse['Data']['PODBill']['PaymentUrl']
            ]);
        } catch (Throwable $e) {
            return $this->errorResponse($e->getMessage(), Response::HTTP_UNPROCESSABLE_ENTITY);
        }
    }

    private function getRequiredConfig(string $key): string
    {
        $value = env($key);

        if (!is_string($value) || trim($value) === '') {
            throw new ResourceConflictException(__(':key is not configured.', ['key' => $key]));
        }

        return trim($value);
    }

    private function validateOrder(?OrderDomainObject $order, int $eventId): void
    {
        if ($order === null || $order->getEventId() !== $eventId) {
            throw new ResourceConflictException(__('Order not found'));
        }

        if ($order->getSessionId() === null || !$this->sessionManagementService->verifySession($order->getSessionId())) {
            throw new UnauthorizedException(__('Sorry, we could not verify your session. Please restart your order.'));
        }

        if ($order->getStatus() !== OrderStatus::RESERVED->name || $order->isReservedOrderExpired()) {
            throw new ResourceConflictException(__('Order is expired or not in a valid state.'));
        }
    }

    private function validateNeemPayment(?EventSettingDomainObject $eventSettings): void
    {
        if ($eventSettings === null || !collect($eventSettings->getPaymentProviders() ?? [])->contains(PaymentProviders::NEEM->value)) {
            throw new UnauthorizedException(__('Neem payments are not enabled for this event.'));
        }
    }
}
