<?php

namespace Database\Seeders;

use App\Models\Setting;
use App\Models\Cabang;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Data Sekolah (Global)
        $settings = [
            ['key' => 'nama_sekolah', 'value' => 'RTQ Al-Yusra'],
            ['key' => 'alamat_pusat', 'value' => 'Jalan Kamboja Indah, Tangkerang Timur, Tenayan Raya, Pekanbaru, Riau 28289'],
            ['key' => 'email', 'value' => 'admin@rtqalyusra.id'],
            ['key' => 'no_hp', 'value' => '0852186691228'],
            ['key' => 'facebook', 'value' => 'https://facebook.com/rtqalyusra'],
            ['key' => 'instagram', 'value' => 'https://instagram.com/rtqalyusra'],
            ['key' => 'youtube', 'value' => 'https://youtube.com/@rtqalyusra'],
        ];

        foreach ($settings as $set) {
            Setting::updateOrCreate(['key' => $set['key']], ['value' => $set['value']]);
        }

        // 2. Data Cabang
        $cabangs = [
            ['nama' => 'Pusat (Sukajadi)'],
            ['nama' => 'Gobah ikhwan'],
            ['nama' => 'Gobah akhwat'],
            ['nama' => 'Cabang rawa bening'],
            ['nama' => 'Cabang Rumbai'],
        ];

        foreach ($cabangs as $c) {
            Cabang::create($c);
        }
    }
}