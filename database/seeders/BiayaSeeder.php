<?php

namespace Database\Seeders;

use App\Models\Biaya;
use Illuminate\Database\Seeder;

class BiayaSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'jenis' => 'Reguler',
                'nama' => 'Taman Quran Tabarak',
                'color' => '#E85B25', // Orange
                'featured' => false,
                'items' => [
                    ['label' => 'Infak Masuk', 'value' => 'Rp. 3,000,000', 'note' => '*sekali Pembayaran di awal'],
                    ['label' => 'Infak Bulanan', 'value' => 'Rp. 300,000', 'note' => null]
                ]
            ],
            [
                'jenis' => 'Reguler',
                'nama' => 'Tahfiz Quran',
                'color' => '#22C5A3', // Teal
                'featured' => true,
                'items' => [
                    ['label' => 'Infak Masuk', 'value' => 'Rp. 3,000,000', 'note' => null],
                    ['label' => 'Infak Bulanan', 'value' => 'Rp. 3,000,000', 'note' => null]
                ]
            ],
            [
                'jenis' => 'Beasiswa',
                'nama' => 'Tahfiz Yatim Duafa & S1',
                'color' => '#556187', // Abu-abu
                'featured' => false,
                'items' => [
                    ['label' => 'Infak Masuk', 'value' => 'Gratis', 'note' => null],
                    ['label' => 'Infak Bulanan', 'value' => 'Gratis', 'note' => null]
                ]
            ],
        ];

        foreach ($data as $biaya) {
            Biaya::create($biaya);
        }
    }
}