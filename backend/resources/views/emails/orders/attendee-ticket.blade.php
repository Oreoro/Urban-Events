@php use HiEvents\Helper\DateHelper; use Carbon\Carbon; @endphp
@php /** @uses \HiEvents\Mail\Order\OrderSummary */ @endphp
@php /** @var \HiEvents\DomainObjects\EventDomainObject $event */ @endphp
@php /** @var \HiEvents\DomainObjects\EventSettingDomainObject $eventSettings */ @endphp
@php /** @var \HiEvents\DomainObjects\OrganizerDomainObject $organizer */ @endphp
@php /** @var \HiEvents\DomainObjects\AttendeeDomainObject $attendee */ @endphp
@php /** @var \HiEvents\DomainObjects\OrderDomainObject $order */ @endphp

@php /** @var string $ticketUrl */ @endphp
@php /** @see \HiEvents\Mail\Attendee\AttendeeTicketMail */ @endphp

<x-mail::message>
# {{ __('You\'re going to') }} {{ $event->getTitle() }}! 🎉
<br>
<br>
@if($order->isOrderAwaitingOfflinePayment())
<div style="border-radius: 4px; background-color: #f8d7da; color: #842029; margin-bottom: 1.5rem; padding: 1rem;">
<p>
{{ __('ℹ️ Your order is pending payment. Tickets have been issued but will not be valid until payment is received.') }}
</p>
</div>
@endif

{{ __('Please find your ticket details below.') }}

# {{ __('Ticket Details') }}
**{{ __('Ticket Holder:') }}** {{ $attendee->getFullName() }}
<br>
**{{ __('Email:') }}** {{ $attendee->getEmail() }}
<br>
**{{ __('Ticket Type:') }}** {{ $attendee->getProduct()?->getTitle() ?? __('N/A') }}
<br>
**{{ __('Ticket ID:') }}** {{ $attendee->getPublicId() }}

# {{ __('Event Information') }}
**{{ __('Event:') }}** {{ $event->getTitle() }}
<br>
**{{ __('Date & Time:') }}** {{ (new Carbon(DateHelper::convertFromUTC($event->getStartDate(), $event->getTimezone())))->format('F j, Y') }} at {{ (new Carbon(DateHelper::convertFromUTC($event->getStartDate(), $event->getTimezone())))->format('g:i A') }}
@if($eventSettings->getLocationDetails())
<br>
**{{ __('Location:') }}** {{ $eventSettings->getAddressString() }}
@endif

<x-mail::button :url="$ticketUrl">
{{ __('View Ticket') }}
</x-mail::button>

{{ __('If you have any questions or need assistance, please reply to this email or contact the event organizer') }}
{{ __('at') }} <a href="mailto:{{$eventSettings->getSupportEmail()}}">{{$eventSettings->getSupportEmail()}}</a>.

{{ __('Best regards,') }}<br>
{{ $organizer->getName() ?: config('app.name') }}

</x-mail::message>

<script type="application/ld+json">
    {!! json_encode([
        '@context' => 'http://schema.org',
        '@type' => 'EventReservation',
        'reservationNumber' => $attendee->getPublicId(),
        'reservationStatus' => 'http://schema.org/Confirmed',
        'underName' => [
            '@type' => 'Person',
            'name' => trim($attendee->getFirstName() . ' ' . $attendee->getLastName()),
        ],
        'reservationFor' => array_filter([
            '@type' => 'Event',
            'name' => $event->getTitle(),
            'performer' => [
                '@type' => 'Organization',
                'name' => $organizer->getName(),
            ],
            'startDate' => DateHelper::convertFromUTC($event->getStartDate(), $event->getTimezone()),
            'endDate' => $event->getEndDate()
                ? DateHelper::convertFromUTC($event->getEndDate(), $event->getTimezone())
                : null,
            'location' => $eventSettings->getLocationDetails() ? [
                '@type' => 'Place',
                'name' => $eventSettings->getAddress()->venue_name,
                'address' => [
                    '@type' => 'PostalAddress',
                    'streetAddress' => trim($eventSettings->getAddress()->address_line_1 . ' ' . $eventSettings->getAddress()->address_line_2),
                    'addressLocality' => $eventSettings->getAddress()->city,
                    'addressRegion' => $eventSettings->getAddress()->state_or_region,
                    'postalCode' => $eventSettings->getAddress()->zip_or_postal_code,
                    'addressCountry' => $eventSettings->getAddress()->country,
                ]
            ] : null,
        ]),
        'ticketToken' => 'qrCode:' . $attendee->getPublicId(),
        'ticketNumber' => $attendee->getPublicId(),
        'ticketPrintUrl' => $ticketUrl,
    ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) !!}
</script>
