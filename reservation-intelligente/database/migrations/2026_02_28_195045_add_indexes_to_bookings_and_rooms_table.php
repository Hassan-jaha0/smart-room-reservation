<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->index('start_time');
            $table->index('end_time');
            $table->index('status');
            $table->index(['room_id', 'start_time', 'end_time']);
        });

        Schema::table('rooms', function (Blueprint $table) {
            $table->index('name');
        });
    }

    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropIndex(['start_time']);
            $table->dropIndex(['end_time']);
            $table->dropIndex(['status']);
            $table->dropIndex(['room_id', 'start_time', 'end_time']);
        });

        Schema::table('rooms', function (Blueprint $table) {
            $table->dropIndex(['name']);
        });
    }
};
