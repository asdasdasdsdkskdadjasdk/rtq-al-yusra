<?php

namespace Database\Seeders;

use App\Models\Jadwal;
use Illuminate\Database\Seeder;

class JadwalSeeder extends Seeder
{
    public function run(): void
    {
        // Data 4 Gelombang
        $data = [
            [
                'gelombang' => 'Gelombang I',
                'tahapan' => [
                    ['title' => 'Pendaftaran', 'date' => 's.d 22 Februari 2025', 'color' => 'white'],
                    ['title' => 'Tes Masuk', 'date' => '23 Februari 2025', 'color' => 'orange'],
                    ['title' => 'Pengumuman', 'date' => '25 Februari 2025', 'color' => 'white'],
                    ['title' => 'Daftar Ulang', 'date' => 's.d 10 Maret 2025', 'color' => 'orange'],
                ]
            ],
            [
                'gelombang' => 'Gelombang II',
                'tahapan' => [
                    ['title' => 'Pendaftaran', 'date' => 's.d 22 Mei 2025', 'color' => 'white'],
                    ['title' => 'Tes Masuk', 'date' => '23 Mei 2025', 'color' => 'orange'],
                    ['title' => 'Pengumuman', 'date' => '25 Mei 2025', 'color' => 'white'],
                    ['title' => 'Daftar Ulang', 'date' => 's.d 10 Juni 2025', 'color' => 'orange'],
                ]
            ],
            [
                'gelombang' => 'Gelombang III',
                'tahapan' => [
                    ['title' => 'Pendaftaran', 'date' => 's.d 22 Agustus 2025', 'color' => 'white'],
                    ['title' => 'Tes Masuk', 'date' => '23 Agustus 2025', 'color' => 'orange'],
                    ['title' => 'Pengumuman', 'date' => '25 Agustus 2025', 'color' => 'white'],
                    ['title' => 'Daftar Ulang', 'date' => 's.d 10 September 2025', 'color' => 'orange'],
                ]
            ],
            [
                'gelombang' => 'Gelombang IV',
                'tahapan' => [
                    ['title' => 'Pendaftaran', 'date' => 's.d 22 November 2025', 'color' => 'white'],
                    ['title' => 'Tes Masuk', 'date' => '23 November 2025', 'color' => 'orange'],
                    ['title' => 'Pengumuman', 'date' => '25 November 2025', 'color' => 'white'],
                    ['title' => 'Daftar Ulang', 'date' => 's.d 10 Desember 2025', 'color' => 'orange'],
                ]
            ],
        ];

        // Loop untuk menyimpan ke database
        foreach ($data as $item) {
            Jadwal::create($item);
        }
    }
}