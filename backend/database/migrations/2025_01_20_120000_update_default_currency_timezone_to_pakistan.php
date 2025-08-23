<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        // Update existing accounts to use PKR as default currency and Asia/Karachi as timezone
        DB::table('accounts')
            ->whereNull('currency_code')
            ->orWhere('currency_code', 'USD')
            ->update(['currency_code' => 'PKR']);

        DB::table('accounts')
            ->whereNull('timezone')
            ->orWhere('timezone', 'America/Vancouver')
            ->orWhere('timezone', 'UTC')
            ->update(['timezone' => 'Asia/Karachi']);

        // Update existing organizers to use PKR as default currency
        DB::table('organizers')
            ->where('currency', 'USD')
            ->update(['currency' => 'PKR']);

        // Update existing events to use PKR as default currency and Asia/Karachi as timezone
        DB::table('events')
            ->where('currency', 'USD')
            ->update(['currency' => 'PKR']);

        DB::table('events')
            ->whereNull('timezone')
            ->orWhere('timezone', 'America/Vancouver')
            ->orWhere('timezone', 'UTC')
            ->update(['timezone' => 'Asia/Karachi']);
    }

    public function down(): void
    {
        // Rollback to USD and America/Vancouver (original defaults)
        DB::table('accounts')
            ->where('currency_code', 'PKR')
            ->update(['currency_code' => 'USD']);

        DB::table('accounts')
            ->where('timezone', 'Asia/Karachi')
            ->update(['timezone' => 'America/Vancouver']);

        DB::table('organizers')
            ->where('currency', 'PKR')
            ->update(['currency' => 'USD']);

        DB::table('events')
            ->where('currency', 'PKR')
            ->update(['currency' => 'USD']);

        DB::table('events')
            ->where('timezone', 'Asia/Karachi')
            ->update(['timezone' => 'America/Vancouver']);
    }
};

