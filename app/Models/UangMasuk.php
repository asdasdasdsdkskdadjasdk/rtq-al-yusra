<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UangMasuk extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'total_tagihan', 'sudah_dibayar', 'status'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function riwayat()
    {
        return $this->hasMany(RiwayatUangMasuk::class);
    }
}