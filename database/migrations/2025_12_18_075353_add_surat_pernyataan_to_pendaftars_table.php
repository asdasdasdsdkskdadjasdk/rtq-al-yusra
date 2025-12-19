<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // PERBAIKAN: Gunakan 'pendaftar' (bukan 'pendaftars')
        Schema::table('pendaftar', function (Blueprint $table) {
            $table->string('surat_pernyataan')->nullable()->after('sks');
        });
    }

    public function down()
    {
        // PERBAIKAN: Gunakan 'pendaftar'
        Schema::table('pendaftar', function (Blueprint $table) {
            $table->dropColumn('surat_pernyataan');
        });
    }
};