<?php

namespace HiEvents\DomainObjects\Enums;

enum PaymentProviders: string
{
    use BaseEnum;
    case Stripe = "STRIPE";
    case NEEM = 'NEEM';
    case OFFLINE = 'OFFLINE';
}
