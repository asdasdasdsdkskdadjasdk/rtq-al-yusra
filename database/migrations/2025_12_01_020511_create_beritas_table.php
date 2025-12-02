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
    Schema::create('beritas', function (Blueprint $table) {
        $table->id();
        $table->string('judul');
        $table->string('slug')->unique(); // Untuk URL yang cantik
        $table->text('konten'); // Isi berita
        $table->string('gambar')->nullable(); // Path gambar berita
        $table->string('penulis');
        $table->boolean('is_published')->default(true); // Status tayang
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('beritas');
    }
};
