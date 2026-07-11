<?php

namespace HiEvents\Http\Actions\Orders\Payment\Neem;

use HiEvents\Exceptions\Stripe\CreatePaymentIntentFailedException;
use HiEvents\Http\Actions\BaseAction;
use HiEvents\Repository\Interfaces\OrderRepositoryInterface;
use HiEvents\Services\Application\Handlers\Order\CompleteOrderHandler;
use HiEvents\Services\Application\Handlers\Order\DTO\CompleteOrderDTO;
use HiEvents\Services\Application\Handlers\Order\DTO\CompleteOrderOrderDTO;
use HiEvents\Services\Application\Handlers\Order\Payment\Neem\CreatePaymentIntentHandler;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class CreateNeemPaymentIntentActionPublic extends BaseAction
{
    private HttpClientInterface $httpClient;
    private OrderRepositoryInterface $orderRepository;

    public function __construct(HttpClientInterface $httpClient, OrderRepositoryInterface $orderRepository)
    {
        $this->httpClient = $httpClient;
        $this->orderRepository = $orderRepository;
    }

    public function __invoke(int $eventId, string $orderShortId): JsonResponse
    {

        try {

            $neem_base_url = env('NEEM_BASE_URL');
            $base_token = 'Basic '.env('NEEM_BASE_TOKEN');
            $neem_partner_id = env('NEEM_PARTNER_ID');
            $neem_redirect_url = env('APP_FRONTEND_URL').'/checkout/'.$eventId.'/'.$orderShortId.'/payment_return';

            // 1. Get OAuth2 token
            $authResponse = $this->httpClient->request('POST', $neem_base_url.'/v1/oauth2/token', [
                'headers' => [
                    'Authorization' => $base_token,
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

            $order = $this->orderRepository->findByShortId($orderShortId);

            // 2. Prepare request data
            $requestData = [
                "Data" => [
                    "PODBill" => [
                        "BasketId" => $orderShortId,
                        "MobileNumber" => "03114455788",
                        "Email" => $order->getEmail(),
                        "FullName" => $order->getFullName(),
                        "InstructedAmount" => [
                            "Amount" => (string)$order->getTotalGross(),
                            "Currency" => $order->getCurrency(),
                        ],
                        "Scheme" => "POD",
                        "callBackUrl" => $neem_redirect_url
                    ]
                ],
                "ExtendedProperties" => []
            ];

            // 3. Make the initiate call
            $initiateResponse = $this->httpClient->request('POST', $neem_base_url.'/v2/pod/initiate', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $accessToken,
                    'X-Neem-Partner-Id' => $neem_partner_id,
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
        } catch (\Throwable $e) {
            return $this->errorResponse($e->getMessage(), Response::HTTP_UNPROCESSABLE_ENTITY);
        }
    }
}
