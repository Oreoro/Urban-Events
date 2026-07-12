<?php

namespace HiEvents\Http\Actions\Orders\Payment\Neem;

use HiEvents\DomainObjects\Status\OrderPaymentStatus;
use HiEvents\DomainObjects\Status\OrderStatus;
use HiEvents\Http\Actions\BaseAction;
use HiEvents\Repository\Interfaces\OrderRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class CreateNeemPaymentIntentActionPublic extends BaseAction
{
    private HttpClientInterface $httpClient;
    private OrderRepositoryInterface $orderRepository;

    public function __construct(
        HttpClientInterface $httpClient,
        OrderRepositoryInterface $orderRepository,
        private readonly LoggerInterface $logger,
    )
    {
        $this->httpClient = $httpClient;
        $this->orderRepository = $orderRepository;
    }

    public function __invoke(Request $request, int $eventId, string $orderShortId): JsonResponse
    {
        try {
            $neemBaseUrl = rtrim((string) env('NEEM_BASE_URL'), '/');
            $neemBaseToken = (string) env('NEEM_BASE_TOKEN');
            $neemPartnerId = (string) env('NEEM_PARTNER_ID');

            if ($neemBaseUrl === '' || $neemBaseToken === '' || $neemPartnerId === '') {
                $this->logger->error('Neem payment configuration is incomplete', [
                    'event_id' => $eventId,
                    'order_short_id' => $orderShortId,
                    'has_base_url' => $neemBaseUrl !== '',
                    'has_base_token' => $neemBaseToken !== '',
                    'has_partner_id' => $neemPartnerId !== '',
                ]);

                return $this->errorResponse(
                    __('Neem payments are not configured correctly. Please contact the organizer.'),
                    Response::HTTP_UNPROCESSABLE_ENTITY,
                );
            }

            $order = $this->orderRepository->findFirstWhere([
                'event_id' => $eventId,
                'short_id' => $orderShortId,
            ]);

            if (!$order) {
                return $this->errorResponse(__('Order not found'), Response::HTTP_NOT_FOUND);
            }

            if ($order->getStatus() !== OrderStatus::RESERVED->name || $order->isReservedOrderExpired()) {
                return $this->errorResponse(
                    __('This order is no longer available for payment. Please restart checkout.'),
                    Response::HTTP_CONFLICT,
                );
            }

            if ($order->getPaymentStatus() !== OrderPaymentStatus::AWAITING_PAYMENT->name || !$order->isPaymentRequired()) {
                return $this->errorResponse(
                    __('This order is not awaiting payment.'),
                    Response::HTTP_CONFLICT,
                );
            }

            $frontendUrl = rtrim((string) config('app.frontend_url'), '/');
            $frontendHost = parse_url($frontendUrl, PHP_URL_HOST);
            if ($frontendUrl === '' || in_array($frontendHost, ['localhost', '127.0.0.1', '::1'], true)) {
                $frontendUrl = $request->getSchemeAndHttpHost();
            }

            $neemRedirectUrl = $frontendUrl . '/checkout/' . $eventId . '/' . $orderShortId . '/payment_return';

            // 1. Get OAuth2 token
            $authResponse = $this->httpClient->request('POST', $neemBaseUrl . '/v1/oauth2/token', [
                'headers' => [
                    'Authorization' => 'Basic ' . $neemBaseToken,
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
                        "MobileNumber" => "03114455788",
                        "Email" => $order->getEmail(),
                        "FullName" => $order->getFullName(),
                        "InstructedAmount" => [
                            "Amount" => number_format((float) $order->getTotalGross(), 2, '.', ''),
                            "Currency" => $order->getCurrency(),
                        ],
                        "Scheme" => "POD",
                        "callBackUrl" => $neemRedirectUrl
                    ]
                ],
                "ExtendedProperties" => []
            ];

            // 3. Make the initiate call
            $initiateResponse = $this->httpClient->request('POST', $neemBaseUrl . '/v2/pod/initiate', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $accessToken,
                    'X-Neem-Partner-Id' => $neemPartnerId,
                    'Content-Type' => 'application/json',
                ],
                'json' => $requestData
            ]);

            $initiateResponse = $initiateResponse->toArray(false);
            $podBill = $initiateResponse['Data']['PODBill'] ?? [];
            $statusCode = $podBill['StatusCode'] ?? null;
            $providerMessage = $podBill['StatusMessage']
                ?? $podBill['Message']
                ?? $podBill['Description']
                ?? null;

            if ($statusCode !== 'N100') {
                $this->logger->warning('Neem payment initiation failed', [
                    'event_id' => $eventId,
                    'order_id' => $order->getId(),
                    'order_short_id' => $orderShortId,
                    'neem_status_code' => $statusCode,
                    'neem_message' => $providerMessage,
                ]);

                return $this->errorResponse(
                    __('Neem could not start this payment. Please try again or contact support.'),
                    Response::HTTP_UNPROCESSABLE_ENTITY,
                    [
                        'neem' => array_filter([
                            'status_code' => $statusCode,
                            'message' => $providerMessage,
                        ]),
                    ],
                );
            }

            if (empty($podBill['PaymentUrl'])) {
                $this->logger->warning('Neem payment initiation succeeded without a payment URL', [
                    'event_id' => $eventId,
                    'order_id' => $order->getId(),
                    'order_short_id' => $orderShortId,
                    'neem_status_code' => $statusCode,
                ]);

                return $this->errorResponse(
                    __('Neem did not return a payment link. Please try again or contact support.'),
                    Response::HTTP_UNPROCESSABLE_ENTITY,
                );
            }

            return $this->jsonResponse([
                'redirect_url' => $podBill['PaymentUrl']
            ]);
        } catch (\Throwable $e) {
            $this->logger->error('Neem payment initiation error', [
                'event_id' => $eventId,
                'order_short_id' => $orderShortId,
                'error' => $e->getMessage(),
            ]);

            return $this->errorResponse(
                __('Neem could not start this payment. Please try again or contact support.'),
                Response::HTTP_UNPROCESSABLE_ENTITY,
            );
        }
    }
}
