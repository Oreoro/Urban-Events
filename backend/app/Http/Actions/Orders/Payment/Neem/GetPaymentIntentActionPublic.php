<?php

namespace HiEvents\Http\Actions\Orders\Payment\Neem;

use HiEvents\DomainObjects\Generated\OrderDomainObjectAbstract;
use HiEvents\Http\Actions\BaseAction;
use HiEvents\Repository\Interfaces\OrderRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class GetPaymentIntentActionPublic extends BaseAction
{
    public function __construct(
        private readonly OrderRepositoryInterface $orderRepository,
    )
    {
    }

    public function __invoke(int $eventId, string $orderShortId): JsonResponse
    {
        $order = $this->orderRepository->findFirstWhere([
            OrderDomainObjectAbstract::EVENT_ID => $eventId,
            OrderDomainObjectAbstract::SHORT_ID => $orderShortId,
        ]);

        if ($order === null) {
            return $this->errorResponse("Order Not Found", Response::HTTP_NOT_FOUND);
        }

        return $this->jsonResponse([
            'status' => $order->getStatus(),
            'payment_status' => $order->getPaymentStatus(),
            'payment_provider' => $order->getPaymentProvider(),
        ]);
    }
}
