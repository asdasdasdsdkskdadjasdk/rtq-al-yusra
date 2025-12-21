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
    Schema::table('pendaftar', function (Blueprint $table) {
        // Tambahkan kolom program_id setelah user_id
        $table->foreignId('program_id')->nullable()->after('user_id')->constrained('programs')->onDelete('set null');
    });
}

public function down()
{
    Schema::table('pendaftar', function (Blueprint $table) {
        $table->dropForeign(['program_id']);
        $table->dropColumn('program_id');
    });
}
};
