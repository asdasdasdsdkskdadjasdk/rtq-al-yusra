// resources/js/Pages/Jadwal.jsx (Final Code untuk Full Width yang Benar)

import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import JadwalCard from '@/Components/Page/Jadwal/JadwalCard';
import { motion } from 'framer-motion'; 

// Data Jadwal (tetap sama)
const jadwalData = [
    {
        gelombang: 'Gelombang I',
        tahapan: [
            { title: 'Pendaftaran', date: 's.d 22 February 2025', color: 'white' },
            { title: 'Tes Masuk', date: 's.d 22 Maret 2025', color: 'orange' },
            { title: 'Pengumuman', date: 's.d 22 April 2025', color: 'white' },
            { title: 'Daftar Ulang', date: 's.d 22 May 2025', color: 'orange' },
        ],
    },
    {
        gelombang: 'Gelombang II',
        tahapan: [
            { title: 'Pendaftaran', date: 's.d 22 February 2025', color: 'white' },
            { title: 'Tes Masuk', date: 's.d 22 Maret 2025', color: 'orange' },
            { title: 'Pengumuman', date: 's.d 22 April 2025', color: 'white' },
            { title: 'Daftar Ulang', date: 's.d 22 May 2025', color: 'orange' },
        ],
    },
    {
        gelombang: 'Gelombang III',
        tahapan: [
            { title: 'Pendaftaran', date: 's.d 22 February 2025', color: 'white' },
            { title: 'Tes Masuk', date: 's.d 22 Maret 2025', color: 'orange' },
            { title: 'Pengumuman', date: 's.d 22 April 2025', color: 'white' },
            { title: 'Daftar Ulang', date: 's.d 22 May 2025', color: 'orange' },
        ],
    },
    {
        gelombang: 'Gelombang IV',
        tahapan: [
            { title: 'Pendaftaran', date: 's.d 22 February 2025', color: 'white' },
            { title: 'Tes Masuk', date: 's.d 22 Maret 2025', color: 'orange' },
            { title: 'Pengumuman', date: 's.d 22 April 2025', color: 'white' },
            { title: 'Daftar Ulang', date: 's.d 22 May 2025', color: 'orange' },
        ],
    },
];

export default function Jadwal({auth}) {
    return (
        <AppLayout auth={auth} heroTheme="dark"> 
            <Head title="Jadwal Pendaftaran" />

            {/* HERO CONTAINER UTAMA - SEKARANG FULL-WIDTH (TANPA "container mx-auto") */}
            <div 
                className="relative bg-gray-800 mt-[-80px] overflow-hidden" 
                style={{ 
                    backgroundImage: "url('/images/rtq.jpg')", 
                    backgroundSize: 'cover', 
                    backgroundAttachment: 'fixed', 
                    backgroundPosition: 'center',
                }}
            >
                {/* OVERLAY HITAM SOLID */}
                <div className="absolute inset-0 bg-black/70 z-10"></div>
                
                {/* KONTEN JADWAL UTAMA (TERMASUK JUDUL BESAR) */}
                {/* Judul Besar "Jadwal Pendaftaran" perlu dibungkus container mx-auto nya sendiri */}
                <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-32 z-20">
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-white text-center mb-10 animate-fade-in animate-slide-in-up">
                        Jadwal Pendaftaran
                    </h1>
                </div>

                {/* Konten Gelombang (ini akan menjadi full-width, dengan container internal) */}
                <div className="relative space-y-16 mt-16 z-20"> {/* Hapus "container mx-auto px-4..." di sini */}
                    {jadwalData.map((data, gelombangIndex) => {
                        const isEvenGelombang = gelombangIndex % 2 !== 0; 
                        
                        const textColor = isEvenGelombang ? 'text-alyusra-dark-blue' : 'text-white';
                        const borderColor = isEvenGelombang ? 'border-alyusra-orange' : 'border-white/50';

                        return (
                            // Wrapper luar untuk background (sekarang bisa full-width)
                            <div 
                                key={data.gelombang} 
                                className={`${isEvenGelombang ? 'bg-gray-50 shadow-xl bg-dots-pattern bg-dots-size bg-repeat' : ''} py-10`}
                            >
                                {/* Wrapper dalam untuk memusatkan konten */}
                                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                                    <div 
                                        className="animate-fade-in animate-slide-in-up" 
                                        style={{ animationDelay: `${gelombangIndex * 0.2 + 0.5}s` }}
                                    >
                                        {/* Judul dengan Garis Bawah */}
                                        <h2 className={`text-3xl font-bold pb-2 border-b-2 ${textColor} ${borderColor} mb-6`}>
                                            {data.gelombang}
                                        </h2>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                            {data.tahapan.map((tahap) => (
                                                <JadwalCard 
                                                    key={tahap.title} 
                                                    tahapan={tahap} 
                                                    isFullWhiteBg={isEvenGelombang} 
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            {/* Div padding bawah, jika diperlukan */}
            <div className="pb-16"></div> 
        </AppLayout>
    );
}