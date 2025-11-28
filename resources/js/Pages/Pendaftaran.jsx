// resources/js/Pages/Pendaftaran.jsx

import { useState } from 'react'; 
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import ProgramCard from '@/Components/Page/Pendaftaran/ProgramCard';
import Modal from '@/Components/Modal'; 
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
// Impor motion, useScroll, dan useTransform untuk animasi Zoom dan Scroll Fade
import { motion, useScroll, useTransform } from 'framer-motion'; 

const programs = [
    { jenis: 'Reguler', nama: 'Taman Quran Tabarak', slug: 'taman-quran-tabarak', batas_pendaftaran: '20 Juli 2025', tes: 'Tes di Tempat', details: ['Untuk Ikhwan Akhwat 4-7 tahun','Lulus Toilet Training','Jenis Ujian Offline (kondisional)','Interview offline (Wali Murid)','Waktu Pelaksanaan 22 Juli 2025 08:00','Ujian dilaksanakan di Rumah Tahfidz Al-yusra','Ujian Menggunakan Pakaian Rapi dan Menutup Aurat',], biaya: 'Rp.300,000', color: '#E85B25', featured: false, },
    { jenis: 'Reguler', nama: 'Tahfiz Quran', slug: 'tahfiz-quran', batas_pendaftaran: '20 Juli 2025', tes: 'Tes di Tempat', details: ['Untuk Ikhwan Akhwat 12-23 tahun','Jenis Ujian Offline (kondisional)','Interview offline (murid dan Wali)','Waktu Pelaksanaan 22 Juli 2025 08:00','Ujian di laksanakan di Rumah Tahfidz Al-yusra','Ujian Menggunakan Pakaian Rapi dan Sopan Menutup Aurat',], biaya: 'Rp.300,000', color: '#22C5A3', featured: true, },
    { jenis: 'Beasiswa', nama: 'Tahfiz Yatim Duafa dan Lulusan S1', slug: 'tahfiz-yatim-duafa-dan-lulusan-s1', batas_pendaftaran: '20 Juli 2025', tes: 'Tes di Tempat', details: ['Untuk Yatim Duafa dan Lulusan S1','Untuk Ikhwan Akhwat 12-23 tahun','Jenis Ujian Offline (kondisional)','Interview offline (murid dan Wali)','Waktu Pelaksanaan 22 Juli 2025 08:00','Ujian di laksanakan di Rumah Tahfidz Al-yusra','Ujian Menggunakan Pakaian Rapi dan Sopan Menutup Aurat',], biaya: 'Rp.300,000', color: '#556187', featured: false, },
];

export default function Pendaftaran({ auth, flash = {} }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // === FRAMER MOTION SCROLL EFFECT: HERO FADE ===
    const { scrollYProgress } = useScroll();
    const opacity = useTransform(
        scrollYProgress, 
        [0, 0.2], // Fade out Hero dalam 20% perjalanan scroll
        [1, 0]    
    );
    // ===============================================

    return (
        <AppLayout auth={auth} heroTheme="dark">
            <Head title="Pendaftaran" />

            {/* HERO CONTAINER UTAMA: Mengatur posisi sejajar Navbar dan overflow */}
            <motion.div 
                className="relative bg-gray-800 pb-32 mt-[-80px] overflow-hidden" 
                style={{ opacity: opacity }} // Opasitas dinamis berdasarkan scroll
            >
                
                {/* 1. MOTION DIV UNTUK GAMBAR LATAR BELAKANG DAN EFEK ZOOM (Memperbaiki Glitch) */}
                <motion.div
                    className="absolute inset-0 z-0" 
                    initial={{ scale: 1.05 }} // Mulai zoom
                    animate={{ scale: 1.0 }}  // Akhir zoom
                    transition={{ duration: 1.5, ease: "easeOut" }} 
                    style={{
                        backgroundImage: "url('/images/rtq.jpg')", 
                        backgroundSize: 'cover', 
                        backgroundAttachment: 'fixed', // Fixed background attachment
                        backgroundPosition: 'top center',
                    }}
                />

                {/* 2. OVERLAY HITAM SOLID (z-10) */}
                <div className="absolute inset-0 bg-black/70 z-10"></div>
                
                {/* 3. KONTEN (Judul, Flash, dll) - z-20 */}
                <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-32 z-20">
                    
                    {/* Animasi untuk Judul */}
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-white text-center mb-10 animate-fade-in animate-slide-in-up">
                        Daftar Formulir
                    </h1>

                    {flash.success && (
                        <div className="max-w-3xl mx-auto mb-10 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center animate-zoom-in" style={{ animationDelay: '0.2s' }}>
                            {flash.success}
                        </div>
                    )}

                </div>
            </motion.div>


            {/* KONTEN PROGRAM CARD */}
            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 -mt-16 z-10">
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                    {programs.map((program, index) => (
                        <ProgramCard 
                            key={program.nama} 
                            program={program} 
                            auth={auth} 
                            onRegisterClick={openModal} 
                            // Animasi Slide-in-up dengan Staggered Delay
                            className={`animate-slide-in-up`}
                            style={{ animationDelay: `${index * 0.15}s` }} 
                        />
                    ))}
                </div>
            </div>

            <br /><br /><br />

            {/* KOMPONEN MODAL */}
            <Modal show={isModalOpen} onClose={closeModal}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Anda Harus Login Terlebih Dahulu
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Untuk dapat melanjutkan ke formulir pendaftaran, Anda diwajibkan untuk login atau membuat akun baru jika belum memilikinya.
                    </p>
                    <div className="mt-6 flex justify-end space-x-2">
                        <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                        <Link href={route('login')}>
                            <PrimaryButton>Login sekarang</PrimaryButton>
                        </Link>
                    </div>
                </div>
            </Modal>

        </AppLayout>
    );
}