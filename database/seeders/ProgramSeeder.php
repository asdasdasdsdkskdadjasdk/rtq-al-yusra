<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Program;

class ProgramSeeder extends Seeder
{
    public function run(): void
    {
        $programs = [
            [
                'jenis' => 'Reguler',
                'nama' => 'Taman Quran Tabarak',
                'slug' => 'taman-quran-tabarak',
                'batas_pendaftaran' => '20 Juli 2025',
                'tes' => 'Tes di Tempat',
                'details' => [
                    'Untuk Ikhwan Akhwat 4-7 tahun',
                    'Lulus Toilet Training',
                    'Jenis Ujian Offline (kondisional)',
                    'Interview offline (Wali Murid)',
                    'Waktu Pelaksanaan 22 Juli 2025 08:00',
                    'Ujian dilaksanakan di Rumah Tahfidz Al-yusra',
                    'Ujian Menggunakan Pakaian Rapi dan Menutup Aurat',
                ],
                'biaya' => 'Rp.300,000',
                'color' => '#E85B25',
                'featured' => false,
            ],
            [
                'jenis' => 'Reguler',
                'nama' => 'Tahfiz Quran',
                'slug' => 'tahfiz-quran',
                'batas_pendaftaran' => '20 Juli 2025',
                'tes' => 'Tes di Tempat',
                'details' => [
                    'Untuk Ikhwan Akhwat 12-23 tahun',
                    'Jenis Ujian Offline (kondisional)',
                    'Interview offline (murid dan Wali)',
                    'Waktu Pelaksanaan 22 Juli 2025 08:00',
                    'Ujian di laksanakan di Rumah Tahfidz Al-yusra',
                    'Ujian Menggunakan Pakaian Rapi dan Sopan Menutup Aurat',
                ],
                'biaya' => 'Rp.300,000',
                'color' => '#22C5A3',
                'featured' => true,
            ],
            [
                'jenis' => 'Beasiswa',
                'nama' => 'Tahfiz Yatim Duafa dan Lulusan S1',
                'slug' => 'tahfiz-yatim-duafa-dan-lulusan-s1',
                'batas_pendaftaran' => '20 Juli 2025',
                'tes' => 'Tes di Tempat',
                'details' => [
                    'Untuk Yatim Duafa dan Lulusan S1',
                    'Untuk Ikhwan Akhwat 12-23 tahun',
                    'Jenis Ujian Offline (kondisional)',
                    'Interview offline (murid dan Wali)',
                    'Waktu Pelaksanaan 22 Juli 2025 08:00',
                    'Ujian di laksanakan di Rumah Tahfidz Al-yusra',
                    'Ujian Menggunakan Pakaian Rapi dan Sopan Menutup Aurat',
                ],
                'biaya' => 'Rp.300,000',
                'color' => '#556187',
                'featured' => false,
            ],
        ];

        foreach ($programs as $program) {
            Program::create($program);
        }
    }
}