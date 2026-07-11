<?php

namespace HiEvents\Http\Actions\Orders\Payment\Neem;

use HiEvents\DomainObjects\Enums\PaymentProviders;
use HiEvents\DomainObjects\Generated\OrderDomainObjectAbstract;
use HiEvents\DomainObjects\Generated\StripePaymentDomainObjectAbstract;
use HiEvents\DomainObjects\OrderDomainObject;
use HiEvents\DomainObjects\OrderItemDomainObject;
use HiEvents\DomainObjects\Status\AttendeeStatus;
use HiEvents\DomainObjects\Status\OrderApplicationFeeStatus;
use HiEvents\DomainObjects\Status\OrderPaymentStatus;
use HiEvents\DomainObjects\Status\OrderStatus;
use HiEvents\Events\OrderStatusChangedEvent;
use HiEvents\Exceptions\Stripe\CreatePaymentIntentFailedException;
use HiEvents\Http\Actions\BaseAction;
use HiEvents\Repository\Interfaces\AffiliateRepositoryInterface;
use HiEvents\Repository\Interfaces\AttendeeRepositoryInterface;
use HiEvents\Repository\Interfaces\OrderRepositoryInterface;
use HiEvents\Services\Application\Handlers\Order\DTO\MarkOrderAsPaidDTO;
use HiEvents\Services\Application\Handlers\Order\MarkOrderAsPaidHandler;
use HiEvents\Services\Domain\Order\OrderApplicationFeeService;
use HiEvents\Services\Domain\Product\ProductQuantityUpdateService;
use HiEvents\Services\Infrastructure\DomainEvents\DomainEventDispatcherService;
use HiEvents\Services\Infrastructure\DomainEvents\Enums\DomainEventType;
use HiEvents\Services\Infrastructure\DomainEvents\Events\OrderEvent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Stripe\PaymentIntent;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class CreateNeemPaymentConfirmationActionPublic extends BaseAction
{
    private HttpClientInterface $httpClient;
    private OrderRepositoryInterface $orderRepository;

    public function __construct(
        HttpClientInterface $httpClient,
        OrderRepositoryInterface $orderRepository,
        private readonly OrderApplicationFeeService      $orderApplicationFeeService,
        private readonly ProductQuantityUpdateService    $quantityUpdateService,
        private readonly AffiliateRepositoryInterface    $affiliateRepository,
        private readonly DomainEventDispatcherService    $domainEventDispatcherService,
        private readonly AttendeeRepositoryInterface     $attendeeRepository,
    )
    {
        $this->httpClient = $httpClient;
        $this->orderRepository = $orderRepository;
    }

    public function __invoke(Request $request, int $eventId, string $orderShortId): JsonResponse
    {
        try {
            $statusEncrypted = $request->input('status');
            $transactionIdEncrypted = $request->input('transactionId');
            $basketIdEncrypted = $request->input('basketId');

            // Neem RSA private key (provided Base64 version)
            $base64PrivateKey = env('NEEM_DECRYPTION_KEY');

            $status = $this->decryptNeemValue($statusEncrypted, $base64PrivateKey);

            if($status != 'success') {
                return $this->errorResponse("Order Payment Failed", Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            $transactionId = $this->decryptNeemValue($transactionIdEncrypted, $base64PrivateKey);
            $basketId = $this->decryptNeemValue($basketIdEncrypted, $base64PrivateKey);

            $order = $this->orderRepository->findByShortId($basketId);
            if(!$order) {
                return $this->errorResponse("Order Not Found", Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            $updatedOrder = $this->updateOrderStatuses($order->getId());

            $this->updateAttendeeStatuses($updatedOrder);

            $this->quantityUpdateService->updateQuantitiesFromOrder($updatedOrder);

            OrderStatusChangedEvent::dispatch($updatedOrder);

            $this->domainEventDispatcherService->dispatch(
                new OrderEvent(
                    type: DomainEventType::ORDER_CREATED,
                    orderId: $updatedOrder->getId()
                ),
            );

            $this->storeApplicationFeePayment($updatedOrder, env('APPLICATION_FEE'));

            return $this->jsonResponse([
                'success' => true
            ]);

        } catch (\Throwable $e) {
            return $this->errorResponse($e->getMessage(), Response::HTTP_UNPROCESSABLE_ENTITY);
        }
    }

    private function decryptNeemValue(string $input, string $base64Key): string
    {
        // Step 1: Replace characters as per Neem's spec
        $replacements = [
            '-' => '+',
            '_' => '/',
            '.' => '=',
            '*' => '%',
            '~' => '.',
            '!' => '?',
            '@' => '&',
            '$' => '#',
            ';' => ':',
            '`' => ',',
            ':' => ';',
        ];
        $normalized = strtr($input, $replacements);

        // Step 2: Base64 decode
        $decoded = base64_decode($normalized);

        // Step 3: Load private key
        $pemKey = "-----BEGIN PRIVATE KEY-----\n" . chunk_split($base64Key, 64, "\n") . "-----END PRIVATE KEY-----";
        $privateKey = openssl_pkey_get_private($pemKey);

        if (!$privateKey) {
            throw new \RuntimeException('Invalid private key.');
        }

        // Step 4: Decrypt
        $decrypted = null;
        if (!openssl_private_decrypt($decoded, $decrypted, $privateKey, OPENSSL_PKCS1_PADDING)) {
            throw new \RuntimeException('Failed to decrypt value.');
        }

        return $decrypted;
    }

    private function updateOrderStatuses($orderId): OrderDomainObject
    {
        $updatedOrder = $this->orderRepository
            ->loadRelation(OrderItemDomainObject::class)
            ->updateFromArray($orderId, [
                OrderDomainObjectAbstract::PAYMENT_STATUS => OrderPaymentStatus::PAYMENT_RECEIVED->name,
                OrderDomainObjectAbstract::STATUS => OrderStatus::COMPLETED->name,
                OrderDomainObjectAbstract::PAYMENT_PROVIDER => PaymentProviders::NEEM->value,
            ]);

        // Update affiliate sales if this order has an affiliate
        if ($updatedOrder->getAffiliateId()) {
            $this->affiliateRepository->incrementSales(
                affiliateId: $updatedOrder->getAffiliateId(),
                amount: $updatedOrder->getTotalGross()
            );
        }

        return $updatedOrder;
    }

    private function storeApplicationFeePayment(OrderDomainObject $updatedOrder, $applicationFee): void
    {
        $this->orderApplicationFeeService->createOrderApplicationFee(
            orderId: $updatedOrder->getId(),
            applicationFeeAmountMinorUnit: $applicationFee ?? 0,
            orderApplicationFeeStatus: OrderApplicationFeeStatus::PAID,
            paymentMethod: PaymentProviders::NEEM,
            currency: $updatedOrder->getCurrency(),
        );
    }

    private function updateAttendeeStatuses(OrderDomainObject $updatedOrder): void
    {
        $this->attendeeRepository->updateWhere(
            attributes: [
                'status' => AttendeeStatus::ACTIVE->name,
            ],
            where: [
                'order_id' => $updatedOrder->getId(),
                'status' => AttendeeStatus::AWAITING_PAYMENT->name,
            ],
        );
    }
}
