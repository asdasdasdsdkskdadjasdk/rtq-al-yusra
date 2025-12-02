<?php

namespace Database\Seeders;

use App\Models\Berita;
use Illuminate\Database\Seeder;

class BeritaSeeder extends Seeder
{
    public function run(): void
    {
        Berita::create([
            'judul' => 'Penerimaan Santri Baru Tahun Ajaran 2025/2026',
            'slug' => 'penerimaan-santri-baru-2025',
            'konten' => 'RTQ Al-Yusra kembali membuka pendaftaran santri baru...',
            'gambar' => 'images/rtq.jpg', // Pastikan gambar ini ada di public/images/
            'penulis' => 'Admin',
            'is_published' => true,
        ]);

        Berita::create([
            'judul' => 'Kegiatan Mabit Bersama Santri',
            'slug' => 'kegiatan-mabit-bersama',
            'konten' => 'Alhamdulillah telah terlaksana kegiatan Malam Bina Iman dan Taqwa...',
            'gambar' => 'images/crop_santri.png', // Pastikan gambar ini ada
            'penulis' => 'Ustadz A',
            'is_published' => true,
        ]);
    }
}
