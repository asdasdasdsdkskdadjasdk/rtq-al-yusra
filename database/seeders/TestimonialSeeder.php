<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Testimonial;

class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'type' => 'white',
                'name' => 'Ust Abdul Somad',
                'role' => 'Ulama Indonesia',
                'quote' => 'Mendirikan Rumah Tahfidz adalah investasi terbaik untuk akhirat. Di tempat seperti Al-Yusra inilah, bibit-bibit generasi Qur\'ani yang akan memimpin umat di masa depan ditanam dan dirawat.',
                'avatar' => 'https://th.bing.com/th/id/OIP.F8uHI6ZA7rDTVKlg4lWCcgHaHa?w=166&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3'
            ],
            [
                'type' => 'orange',
                'name' => 'Muzammil Hasballah',
                'role' => 'Qori Internasional',
                'quote' => 'Keindahan Al-Quran tidak hanya terletak pada hafalannya, tetapi juga pada cara melantunkannya. Saya gembira melihat Al-Yusra fokus pada pembinaan tahsin dan tajwid untuk menyempurnakan bacaan para santri.',
                'avatar' => 'https://th.bing.com/th/id/OIP.M_K8D8WUG8KBB9C5pwiBbQHaHa?w=164&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3'
            ],
            [
                'type' => 'orange',
                'name' => 'Ust Hanan Attaki',
                'role' => 'Pendakwah',
                'quote' => 'Untuk anak-anak muda, mendekat kepada Al-Quran adalah cara terbaik menemukan ketenangan dan \'healing\' yang sesungguhnya. Semoga Al-Yusra menjadi rumah yang nyaman bagi hati-hati yang rindu pada petunjuk-Nya.',
                'avatar' => 'https://th.bing.com/th/id/OIP.5zQyOiUoFpmx-PDQ39rT8QHaEK?w=277&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3'
            ]
        ];

        foreach ($data as $item) {
            Testimonial::create($item);
        }
    }
}