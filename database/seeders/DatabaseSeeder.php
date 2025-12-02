<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash; // Import Hash Facade

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Password default untuk semua akun
        $defaultPassword = Hash::make('admin12345');

        // 1. User untuk Admin PSB (Penerimaan Siswa Baru)
        User::factory()->create([
            'name' => 'Admin PSB',
            'email' => 'psb@example.com',
            'role' => 'PSB',
            'password' => $defaultPassword,
        ]);

        // 2. User untuk Admin Keuangan
        User::factory()->create([
            'name' => 'Admin Keuangan',
            'email' => 'keuangan@example.com',
            'role' => 'keuangan',
            'password' => $defaultPassword,
        ]);

        // 3. User untuk Calon Santri (Contoh)
        User::factory()->create([
            'name' => 'Calon Santri',
            'email' => 'santri@example.com',
            'role' => 'calon_santri',
            'password' => $defaultPassword,
        ]);

        // 4. User untuk Wali Santri (Contoh)
        User::factory()->create([
            'name' => 'Wali Santri',
            'email' => 'walisantri@example.com',
            'role' => 'wali_santri',
            'password' => $defaultPassword,
        ]);
        
        // 5. User Administrator Utama (Opsional, buat jaga-jaga)
        User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'admin@example.com',
            'role' => 'admin', // Pastikan role ini ditangani di sistem Anda jika ada
            'password' => $defaultPassword,
        ]);

        // Panggil Seeder Lainnya
        $this->call([
            BiayaSeeder::class,
            JadwalSeeder::class,
            // BeritaSeeder::class, // Uncomment jika sudah membuat BeritaSeeder
        ]);
    }
}