// resources/js/Pages/Berita.jsx

import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout'; // <-- Panggil AppLayout yang sudah diperbaiki
import BeritaCard from '@/Components/Page/Berita/BeritaCard';

export default function Berita({ berita, auth }) {
    return (
        <AppLayout auth={auth}>
            <Head title="Informasi dan Pengumuman" />

            {/* INI KUNCI NO. 3:
              Div ini sekarang mulai di 'top: 0' (belakang navbar).
              Kita tambahkan 'pt-32' (padding-top) agar JUDUL 'h1'
              tidak tertutup oleh navbar yang melayang.
            */}
            <div 
                className="relative bg-gray-800 pt-32 pb-20" // <-- PASTIKAN ADA PADDING ATAS (pt-32)
                style={{ 
                    backgroundImage: "url('/images/rtq.jpg')", 
                    backgroundSize: 'cover', 
                    backgroundAttachment: 'fixed', 
                    backgroundPosition: 'center' 
                }}
            >
                <div className="absolute inset-0 bg-black/70"></div>

                {/* Konten ini sekarang aman di bawah Navbar */}
                <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-white text-center mb-16">
                        Informasi dan Pengumuman
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                        {berita.map((post) => (
                            <BeritaCard key={post.id} post={post} />
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}