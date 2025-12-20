<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UangMasuk extends Model
{
    protected $guarded = [];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function riwayat() {
        return $this->hasMany(RiwayatUangMasuk::class)->latest();
    }
}