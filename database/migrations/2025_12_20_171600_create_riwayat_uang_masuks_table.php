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
    Schema::create('riwayat_uang_masuks', function (Blueprint $table) {
        $table->id();
        $table->foreignId('uang_masuk_id')->constrained()->onDelete('cascade');
        $table->decimal('jumlah_bayar', 15, 2);
        $table->date('tanggal_bayar');
        $table->string('keterangan')->nullable(); // Misal: "Cicilan ke-1"
        $table->foreignId('pencatat_id')->constrained('users'); // Admin yang mencatat
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('riwayat_uang_masuks');
    }
};
