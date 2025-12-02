<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('biayas', function (Blueprint $table) {
            $table->id();
            $table->string('jenis'); // Contoh: Reguler, Beasiswa
            $table->string('nama');  // Contoh: Taman Quran Tabarak
            $table->string('color'); // Contoh: #E85B25
            $table->boolean('featured')->default(false); // Untuk menandai kartu tengah/unggulan
            
            // Kita gunakan JSON untuk menyimpan detail item biaya (Infak Masuk, Bulanan, dll)
            // agar fleksibel jumlah barisnya
            $table->json('items'); 
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('biayas');
    }
};