// resources/js/Pages/BiayaPendidikan.jsx

import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import BiayaCard from '@/Components/Page/Biaya/BiayaCard';
// IMPORT motion untuk animasi zoom
import { motion } from 'framer-motion'; 

// Data Biaya Pendidikan (tetap sama)
const biayaData = [
    {
        jenis: 'Reguler',
        nama: 'Taman Quran Tabarak',
        color: '#E85B25', // alyusra-orange
        featured: false,
        items: [
            { label: 'Infak Masuk', value: 'Rp.3,000,000', note: '*sekali Pembayaran di awal' },
            { label: 'Infak bulanan', value: 'Rp. 300,000', note: null }
        ]
    },
    {
        jenis: 'Reguler',
        nama: 'Tahfiz Quran',
        color: '#22C5A3', // alyusra-teal
        featured: true,
        items: [
            { label: 'Infak Masuk', value: 'Rp.3,000,000', note: null },
            { label: 'Infak bulanan', value: 'Rp.3,000,000', note: null }
        ]
    },
    {
        jenis: 'Beasiswa',
        nama: 'Tahfiz Yatim Duafa dan Lulusan S1',
        color: '#556187', // Warna abu-abu kebiruan
        featured: false,
        items: [
            { label: 'Infak Masuk', value: 'Gratis', note: null },
            { label: 'Infak bulanan', value: 'Gratis', note: null }
        ]
    },
];


export default function BiayaPendidikan({auth}) {
    return (
        <AppLayout auth={auth} heroTheme="dark"> 
            <Head title="Biaya Pendidikan" />

            {/* HERO CONTAINER UTAMA (STATIS): Sejajar Navbar dan Fixed Background */}
            <div 
                className="relative bg-gray-800 pb-20 mt-[-80px] overflow-hidden" 
                // Hapus style background dari sini
            >
                {/* 1. MOTION DIV UNTUK GAMBAR LATAR BELAKANG DAN EFEK ZOOM */}
                <motion.div
                    className="absolute inset-0 z-0" 
                    initial={{ scale: 1.05 }} // Mulai zoom (awal)
                    animate={{ scale: 1.0 }}  // Akhir zoom (saat dimuat)
                    transition={{ duration: 1.5, ease: "easeOut" }} 
                    style={{
                        backgroundImage: "url('/images/rtq.jpg')", 
                        backgroundSize: 'cover', 
                        backgroundAttachment: 'fixed', // Fixed background attachment
                        backgroundPosition: ' top center',
                    }}
                />

                {/* 2. OVERLAY HITAM SOLID (z-10) */}
                <div className="absolute inset-0 bg-black/70 z-10"></div>
                
                <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-32 z-20"> 

                    {/* Animasi untuk Judul */}
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-white text-center mb-10 animate-fade-in animate-slide-in-up">
                        Biaya Pendidikan
                    </h1>
                </div>
            </div>
            
            {/* KONTEN KARTU BIAYA */}
            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 -mt-16 z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center">
                    {biayaData.map((program, index) => (
                        <BiayaCard 
                            key={program.nama} 
                            program={program} 
                            // Meneruskan style prop untuk animationDelay (staggered)
                            style={{ animationDelay: `${index * 0.15}s` }}
                        />
                    ))}
                </div>
            </div>
            
            <div className="pb-16"></div> 
        </AppLayout>
    );
}