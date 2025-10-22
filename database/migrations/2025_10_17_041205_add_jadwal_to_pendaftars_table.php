<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pendaftars', function (Blueprint $table) {
            // Tambahkan kolom untuk jadwal ujian (bisa tanggal dan waktu)
            $table->dateTime('jadwal_ujian')->nullable()->after('status');
            // Tambahkan kolom untuk jadwal masuk (cukup tanggal)
            $table->date('jadwal_masuk')->nullable()->after('jadwal_ujian');
        });
    }

    public function down(): void
    {
        Schema::table('pendaftars', function (Blueprint $table) {
            $table->dropColumn('jadwal_ujian');
            $table->dropColumn('jadwal_masuk');
        });
    }
};