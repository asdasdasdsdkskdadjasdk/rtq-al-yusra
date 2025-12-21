<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\Pendaftar;
use App\Models\UangMasuk;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'role',
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function pendaftar()
    {
        return $this->hasMany(Pendaftar::class);
    }

    public function uangMasuk()
    {
        return $this->hasOne(UangMasuk::class);
    }

    // --- PERBAIKAN LOGIC IS_BEASISWA ---
    public function isBeasiswa()
    {
        // 1. Ambil pendaftar terakhir (tanpa filter status dulu untuk debugging)
        $pendaftar = $this->pendaftar()
            ->with('program')
            ->latest()
            ->first();

        // 2. Cek apakah ada data program?
        if ($pendaftar && $pendaftar->program) {
            
            $namaProgram = strtolower($pendaftar->program->nama);
            $jenisProgram = strtolower($pendaftar->program->jenis);

            // 3. Cek kata kunci 'beasiswa' (case insensitive)
            if (str_contains($namaProgram, 'beasiswa') || str_contains($jenisProgram, 'beasiswa')) {
                return true;
            }
        }

        return false;
    }
}