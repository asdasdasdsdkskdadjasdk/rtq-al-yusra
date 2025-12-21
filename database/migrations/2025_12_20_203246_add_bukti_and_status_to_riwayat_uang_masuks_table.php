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
    Schema::table('riwayat_uang_masuks', function (Blueprint $table) {
        $table->string('bukti_bayar')->nullable()->after('keterangan');
        $table->enum('status', ['pending', 'approved', 'rejected'])->default('approved')->after('bukti_bayar'); 
        // Default approved agar data lama (Midtrans/Admin) dianggap lunas
    });
}

public function down()
{
    Schema::table('riwayat_uang_masuks', function (Blueprint $table) {
        $table->dropColumn(['bukti_bayar', 'status']);
    });
}
};
