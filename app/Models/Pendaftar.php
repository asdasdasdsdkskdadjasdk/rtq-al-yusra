<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pendaftar extends Model
{
    use HasFactory;

    protected $table = 'pendaftar';

    protected $fillable = [
        'nik',
        'user_id',
        'no_pendaftaran',
        'program_nama',
        'program_jenis',
        'nama',
        'no_hp',
        'email',
        'tempat_lahir',
        'tanggal_lahir',
        'umur',
        'jenis_kelamin',
        'alamat',
        'cabang',
        'nama_orang_tua',
        
        // Berkas
        'ijazah_terakhir',
        'kartu_keluarga',
        'pas_foto',
        'skbb',
        'sks',
        
        // Status & Pembayaran
        'status',
        'nominal_pembayaran',
        'status_pembayaran',
        'snap_token',

        // --- TAMBAHKAN KOLOM JADWAL DI SINI ---
        'tanggal_ujian',
        'waktu_ujian',
        'lokasi_ujian',
        'catatan_ujian',
    ];
}