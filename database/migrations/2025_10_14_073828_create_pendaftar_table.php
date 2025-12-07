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
    Schema::create('pendaftar', function (Blueprint $table) {
        // --- PERUBAHAN DI SINI ---
        $table->id(); // Membuat kolom 'id' (Auto Increment) sebagai Primary Key
        $table->string('nik', 16); // NIK jadi kolom biasa (Hapus ->primary())
        // -------------------------

        $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
        
        $table->string('no_pendaftaran')->unique();
        $table->string('program_nama');
        $table->string('program_jenis');
        
        // ... kolom data diri lainnya tetap sama ...
        $table->string('nama');
        $table->string('no_hp', 20);
        $table->string('email');
        $table->string('tempat_lahir');
        $table->date('tanggal_lahir');
        $table->integer('umur');
        $table->string('jenis_kelamin');
        $table->text('alamat');
        $table->string('cabang')->nullable();

        // Data Wali
        $table->string('nama_orang_tua');

        // Berkas
        $table->string('ijazah_terakhir')->nullable();
        $table->string('kartu_keluarga')->nullable();
        $table->string('pas_foto')->nullable();
        $table->string('skbb')->nullable();
        $table->string('sks')->nullable();
        
        // Status & Pembayaran
        $table->string('status')->default('Menunggu Verifikasi');
        $table->bigInteger('nominal_pembayaran')->default(0);
        $table->string('status_pembayaran')->default('Belum Bayar');
        
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pendaftar');
    }
};