<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pendaftar extends Model
{
    use HasFactory;

    protected $table = 'pendaftar'; // Pastikan nama tabel di database sesuai

    // 1. Opsi Praktis: Izinkan semua kolom diisi (Mass Assignment)
    // Ini mencegah error "Add [program_id] to fillable property"
    protected $guarded = ['id']; 

    // Relasi ke User (Wali Santri)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi ke Program (Untuk ambil Harga & Nama Program)
    public function program()
    {
        // Pastikan kolom 'program_id' ada di tabel 'pendaftar'
        return $this->belongsTo(Program::class, 'program_id');
    }

    
}