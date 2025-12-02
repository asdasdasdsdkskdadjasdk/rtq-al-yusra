// resources/js/Pages/Berita.jsx

import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import BeritaCard from '@/Components/Page/Berita/BeritaCard';
import { motion } from 'framer-motion'; // Pastikan ini diimpor
import YouTubeFeed from '@/Components/Page/Beranda/YouTubeFeed'; // Pastikan path ini benar

// Menerima props 'berita' dari Controller
export default function Berita({ auth, berita }) { 
    
    // Menghitung delay animasi YouTube berdasarkan jumlah berita agar urutannya pas
    // Jika berita kosong, delay default 0.2 detik
    const youtubeDelay = berita && berita.length > 0 ? (berita.length * 0.1 + 0.2) : 0.2;

    return (
        <AppLayout auth={auth} heroTheme="dark">
            <Head title="Informasi dan Pengumuman" />

            {/* Bungkus semua konten utama dalam satu fragment */}
            <>
            {/* HERO CONTAINER UTAMA */}
            <div className="relative bg-gray-800 pb-16 md:pb-20 mt-[-80px] overflow-hidden">
                
                {/* 1. MOTION DIV UNTUK GAMBAR LATAR BELAKANG DAN EFEK ZOOM */}
                <motion.div
                    className="absolute inset-0 z-0" 
                    initial={{ scale: 1.05 }} // Mulai zoom (awal)
                    animate={{ scale: 1.0 }}  // Akhir zoom (saat dimuat)
                    transition={{ duration: 1.5, ease: "easeOut" }} 
                    style={{
                        backgroundImage: "url('/images/rtq-gedung1.jpg')", 
                        backgroundSize: 'cover', 
                        backgroundAttachment: 'fixed', 
                        backgroundPosition: 'center',
                    }}
                />

                {/* 2. OVERLAY HITAM SOLID (z-10) */}
                <div className="absolute inset-0 bg-black/70 z-10"></div>
                
                {/* KONTEN HERO (Judul, dll) - z-20 */}
                <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-32 z-20"> 
                    
                    {/* Animasi untuk Judul */}
                    <motion.h1 
                        className="text-3xl md:text-5xl font-extrabold text-white text-center mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        Informasi dan Pengumuman
                    </motion.h1>
                    
                    <br /><br />

                    {/* Konten Berita Card dengan animasi bertahap */}
                    {/* GRID RESPONSIVE: 1 kolom (HP), 2 kolom (Tablet), 3 kolom (Desktop) */}
{/* Tambahkan lg:gap-y-24 untuk memberi jarak vertikal ekstra yang cukup */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-y-24 items-start">
                        {/* Pengecekan: Jika ada berita, tampilkan. Jika tidak, tampilkan pesan kosong. */}
                        {berita && berita.length > 0 ? (
                            berita.map((post, index) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }} // Delay bertahap
                                    // PENTING: Tambahkan kelas agar kartu di tengah tidak tertimpa kartu lain saat membesar
                                    className="relative z-10 hover:z-20"
                                >
                                    {/* PENTING: Kirim prop 'index' untuk logika warna selang-seling */}
                                    <BeritaCard post={post} index={index} />
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full text-center text-gray-400 py-10">
                                <p>Belum ada informasi terbaru saat ini.</p>
                            </div>
                        )}

                    </div>
                    <br />
                </div> 
            </div>
                
            {/* YOUTUBE FEED SECTION: DIBUNGKUS DENGAN motion.div untuk SCROLL TRIGGER */}
            <motion.div 
                initial={{ opacity: 0, y: 50 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.8, delay: 0.2 }} // Delay statis agar tidak terlalu lama menunggu jika berita banyak
                viewport={{ once: true, amount: 0.1 }} 
                className="" // Tambahan background agar YouTube feed lebih rapi
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <YouTubeFeed />
                </div>
            </motion.div>
            </>
        </AppLayout>
    );
}