<?php

namespace Database\Seeders;

use App\Models\Berita;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Faker\Factory as Faker;

class BeritaSeeder extends Seeder
{
    public function run(): void
    {
        // Gunakan locale Indonesia untuk data dummy yang lebih natural
        $faker = Faker::create('id_ID');

        // --- BAGIAN 1: DATA UTAMA (RELEVAN) ---
        // Data ini dibuat manual agar terlihat bagus saat presentasi/demo
        $beritas = [
            [
                'judul' => 'Penerimaan Santri Baru Tahun Ajaran 2025/2026',
                'konten' => 'RTQ Al-Yusra kembali membuka pendaftaran santri baru untuk tahun ajaran 2025/2026. Kami berkomitmen mencetak generasi penghafal Al-Qur\'an yang berakhlak mulia. Program unggulan kami mencakup Tahfiz 30 Juz, Bahasa Arab, dan Pendidikan Karakter. Segera daftarkan putra-putri Anda karena kuota terbatas.',
                'gambar' => 'images/rtq.jpg', // Menggunakan gambar yang ada di folder public Anda
                'penulis' => 'Panitia PSB',
                'is_published' => true,
                'created_at' => now(),
            ],
            [
                'judul' => 'Kegiatan Mabit dan Qiyamul Lail Bersama Santri',
                'konten' => 'Alhamdulillah telah terlaksana kegiatan Malam Bina Iman dan Taqwa (MABIT) bulanan. Kegiatan ini diisi dengan tilawah bersama, tausiyah motivasi, dan ditutup dengan Qiyamul Lail berjamaah. Semoga kegiatan ini dapat meningkatkan spiritualitas para santri.',
                'gambar' => 'images/crop_santri.png',
                'penulis' => 'Ustadz Abdullah',
                'is_published' => true,
                'created_at' => now()->subDays(2),
            ],
            [
                'judul' => 'Renovasi Gedung Asrama Santri Telah Selesai',
                'konten' => 'Puji syukur kami panjatkan, renovasi gedung asrama lantai 2 telah selesai dilaksanakan. Fasilitas baru ini diharapkan dapat menunjang kenyamanan santri dalam beristirahat dan menghafal Al-Qur\'an. Terima kasih kepada para donatur yang telah berkontribusi.',
                'gambar' => 'images/rtq-gedung.jpg',
                'penulis' => 'Humas RTQ',
                'is_published' => true,
                'created_at' => now()->subDays(5),
            ],
            [
                'judul' => 'Wisuda Tahfiz Angkatan Ke-5',
                'konten' => 'Selamat kepada para wisudawan yang telah menyelesaikan hafalan 30 Juz. Perjuangan kalian adalah inspirasi bagi adik-adik kelas. Semoga hafalan ini menjadi mahkota kemuliaan bagi orang tua di akhirat kelak.',
                'gambar' => 'images/crop_santri1.png',
                'penulis' => 'Admin',
                'is_published' => true,
                'created_at' => now()->subDays(10),
            ],
        ];

        foreach ($beritas as $data) {
            // Cek agar tidak duplikat jika seeder dijalankan berulang
            if (!Berita::where('judul', $data['judul'])->exists()) {
                Berita::create([
                    'judul' => $data['judul'],
                    'slug' => Str::slug($data['judul']), // Generate slug otomatis
                    'konten' => $data['konten'],
                    'gambar' => $data['gambar'],
                    'penulis' => $data['penulis'],
                    'is_published' => $data['is_published'],
                    'created_at' => $data['created_at'],
                ]);
            }
        }

        // --- BAGIAN 2: DATA DUMMY TAMBAHAN (FAKER) ---
        // Membuat 10 berita tambahan acak untuk tes pagination/scroll
        for ($i = 0; $i < 10; $i++) {
            $judul = $faker->sentence(6); // Judul acak 6 kata
            
            Berita::create([
                'judul' => $judul,
                'slug' => Str::slug($judul) . '-' . Str::random(5), // Slug unik
                'konten' => $faker->paragraph(4), // 4 paragraf teks dummy
                'gambar' => 'images/logo.png', // Fallback gambar logo
                'penulis' => $faker->name,
                'is_published' => $faker->boolean(80), // 80% kemungkinan terpublish
                'created_at' => $faker->dateTimeBetween('-1 year', 'now'),
            ]);
        }
    }
}