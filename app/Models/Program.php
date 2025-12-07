<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'details' => 'array',   // Penting: agar JSON database jadi Array PHP/JS
        'materi_ujian' => 'array', // <--- Tambahkan ini
        'featured' => 'boolean',
    ];
}