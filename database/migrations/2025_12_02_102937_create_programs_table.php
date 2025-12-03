<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('programs', function (Blueprint $table) {
            $table->id();
            $table->string('jenis'); // Contoh: Reguler, Beasiswa
            $table->string('nama');  // Contoh: Taman Quran Tabarak
            $table->string('slug')->unique(); // Untuk URL
            $table->string('batas_pendaftaran');
            $table->string('tes'); // Contoh: Tes di Tempat
            $table->json('details'); // Array list detail persyaratan
            $table->string('biaya'); // Contoh: Rp.300,000
            $table->string('color'); // Hex color code
            $table->boolean('featured')->default(false); // Kartu tengah
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('programs');
    }
};