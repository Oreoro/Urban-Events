<?php

namespace HiEvents\DomainObjects\Enums;

enum PaymentProviders: string
{
    use BaseEnum;

    case NEEM = 'NEEM';
    case OFFLINE = 'OFFLINE';
}
