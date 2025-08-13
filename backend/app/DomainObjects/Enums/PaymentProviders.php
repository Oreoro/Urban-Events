<?php

namespace HiEvents\DomainObjects\Enums;

enum PaymentProviders: string
{
    use BaseEnum;
    
    case STRIPE = "STRIPE";
    case NEEM = 'NEEM';
    case OFFLINE = 'OFFLINE';
}
