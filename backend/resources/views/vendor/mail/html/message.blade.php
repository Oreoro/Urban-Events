<x-mail::layout>
    {{-- Header --}}
    <x-slot:header>
        </x-mail::header>
    </x-slot:header>

    {{-- Body --}}
    {{ $slot }}

    {{-- Subcopy --}}
    @isset($subcopy)
        <x-slot:subcopy>
            <x-mail::subcopy>
                {{ $subcopy }}
            </x-mail::subcopy>
        </x-slot:subcopy>
    @endisset

    {{-- Footer --}}
    <x-slot:footer>
        <x-mail::footer>
            @if($appEmailFooter = config('app.email_footer_text'))
                {{ $appEmailFooter }}
            @else
                {{-- If no custom footer is set, this will be displayed. --}}
                © {{ date('Y') }} {{ config('app.name') }}
                <br>
                Questions? Reach out to us at support@urbanevents.pk
            @endif
        </x-mail::footer>
    </x-slot:footer>
</x-mail::layout>
