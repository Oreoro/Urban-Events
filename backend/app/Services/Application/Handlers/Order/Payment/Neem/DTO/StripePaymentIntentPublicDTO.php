<?php

namespace HiEvents\Services\Application\Handlers\Order\Payment\Neem\DTO;

use HiEvents\DataTransferObjects\BaseDTO;

class StripePaymentIntentPublicDTO extends BaseDTO
{
    public function __construct(
        public string $status,
        public string $paymentIntentId,
        public string $amount,
    )
    {
    }
}
