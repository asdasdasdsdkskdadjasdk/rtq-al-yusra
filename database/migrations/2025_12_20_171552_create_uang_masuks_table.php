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
    Schema::create('uang_masuks', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Wali Santri
        $table->decimal('total_tagihan', 15, 2)->default(0); // Total yang harus dibayar
        $table->decimal('sudah_dibayar', 15, 2)->default(0); // Total yang sudah masuk
        $table->enum('status', ['Belum Lunas', 'Lunas'])->default('Belum Lunas');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('uang_masuks');
    }
};
