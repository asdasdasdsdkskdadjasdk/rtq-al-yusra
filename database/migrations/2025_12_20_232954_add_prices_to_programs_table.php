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
    Schema::table('programs', function (Blueprint $table) {
        $table->decimal('nominal_uang_masuk', 15, 0)->default(0)->after('nama');
        $table->decimal('nominal_spp', 15, 0)->default(0)->after('nominal_uang_masuk');
    });
}

public function down()
{
    Schema::table('programs', function (Blueprint $table) {
        $table->dropColumn(['nominal_uang_masuk', 'nominal_spp']);
    });
}
};
