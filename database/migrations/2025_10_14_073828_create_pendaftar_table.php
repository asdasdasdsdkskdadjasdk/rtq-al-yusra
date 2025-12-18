<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pendaftar', function (Blueprint $table) {
            $table->id(); 
            $table->string('nik', 16); 
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            
            $table->string('no_pendaftaran')->unique();
            $table->string('program_nama');
            $table->string('program_jenis');
            
            // Data Diri
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
            
            // Status, Pembayaran & Snap Token
            $table->string('status')->default('Menunggu Verifikasi');
            $table->bigInteger('nominal_pembayaran')->default(0);
            $table->string('status_pembayaran')->default('Belum Bayar');
            $table->string('snap_token')->nullable(); // <--- KOLOM SNAP TOKEN

            // Jadwal Ujian (YANG MEMBUAT ERROR SEBELUMNYA)
            $table->date('tanggal_ujian')->nullable();   // <--- PASTIKAN INI ADA
            $table->string('waktu_ujian')->nullable();   // <--- DAN INI
            $table->string('lokasi_ujian')->nullable();  // <--- DAN INI
            $table->text('catatan_ujian')->nullable();   // <--- DAN INI
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pendaftar');
    }
};