<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pembayaran_spps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Wali Santri
            $table->string('bulan'); // Januari, Februari, dll
            $table->year('tahun');
            $table->decimal('jumlah', 10, 2);
            $table->string('bukti_transfer'); // Path file gambar
            $table->string('status')->default('Menunggu Konfirmasi'); // Menunggu, Diterima, Ditolak
            $table->text('catatan_admin')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pembayaran_spps');
    }
};