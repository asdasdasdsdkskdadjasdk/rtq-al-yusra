<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PembayaranSpp extends Model
{
    protected $fillable = [
        'user_id',
        'bulan',
        'tahun',
        'jumlah',
        'bukti_transfer',
        'status',
        'catatan_admin',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}