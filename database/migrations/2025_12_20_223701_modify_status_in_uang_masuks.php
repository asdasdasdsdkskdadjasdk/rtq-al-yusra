<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::table('uang_masuks', function (Blueprint $table) {
        // Kita pastikan ada kolom status dengan enum
        // Jika sudah ada sebelumnya, code ini aman (change)
        // Default 'Belum Lunas'
        $table->enum('status', ['Lunas', 'Belum Lunas'])->default('Belum Lunas')->change();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('uang_masuks', function (Blueprint $table) {
            //
        });
    }
};
