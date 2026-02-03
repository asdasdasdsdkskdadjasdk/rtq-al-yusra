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
        Schema::create('daftar_ulangs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Tahun Ajaran / Tahun Kalender (Misal: 2026)
            $table->integer('tahun'); 
            
            $table->decimal('nominal_tagihan', 15, 0);
            
            // Status Pembayaran
            $table->string('status')->default('pending'); // pending, lunas, rejected
            
            // Bukti Bayar & Keterangan
            $table->string('bukti_bayar')->nullable();
            $table->text('keterangan')->nullable();
            
            // Siapa yang memverifikasi (Admin)
            $table->foreignId('verified_by')->nullable()->constrained('users');
            
            $table->timestamps();
            
            // Mencegah duplikasi tagihan untuk user yg sama di tahun yg sama
            $table->unique(['user_id', 'tahun']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daftar_ulangs');
    }
};
