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
    Schema::create('spp_transactions', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        
        // Target Pembayaran (Untuk bulan apa?)
        $table->integer('bulan'); // 1 - 12
        $table->integer('tahun'); // 2025
        
        $table->decimal('jumlah_bayar', 15, 0);
        $table->string('tipe_pembayaran'); // 'midtrans_auto', 'midtrans_manual', 'transfer_manual', 'admin_input'
        
        // Status: 'pending' (menunggu bayar/konfirmasi), 'approved' (lunas), 'rejected' (ditolak)
        $table->string('status')->default('pending');
        
        $table->string('bukti_bayar')->nullable(); // Untuk upload manual
        $table->string('snap_token')->nullable();  // Untuk midtrans
        $table->text('keterangan')->nullable();
        $table->foreignId('pencatat_id')->nullable()->constrained('users'); // Siapa yang approve/input
        $table->timestamps();
    });
}
};
