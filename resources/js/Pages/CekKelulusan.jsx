// resources/js/Pages/CekKelulusan.jsx

import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { motion } from 'framer-motion'; 

// Ikon Kaca Pembesar (tetap sama)
const SearchIcon = () => (
    <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

export default function CekKelulusan({ flash = {}, auth }) {
    const { data, setData, post, processing, errors } = useForm({
        no_pendaftaran: '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route('kelulusan.check'));
    }

    return (
        <AppLayout auth={auth} heroTheme="dark"> 
            <Head title="Cek Kelulusan" />

            {/* HERO CONTAINER UTAMA: Background Bawaan Putih di bawah area gambar */}
            <div className="relative mt-[-75px] overflow-hidden">
                
                {/* 1. LAYER GAMBAR LATAR BELAKANG (DIBATASI HANYA 60% TINGGI CONTAINER) */}
                <motion.div
                    className="absolute inset-0 z-0 h-[55vh]" // Tinggi Hero Dibatasi 60%
                    initial={{ scale: 1.05 }} // Mulai zoom (awal)
                    animate={{ scale: 1.0 }}  // Akhir zoom (saat dimuat)
                    transition={{ duration: 1.5, ease: "easeOut" }} 
                    style={{
                        backgroundImage: "url('/images/rtq.jpg')", 
                        backgroundSize: 'cover', 
                        backgroundAttachment: 'fixed', // Fixed background attachment
                        backgroundPosition: 'center',
                    }}
                />

                {/* 2. OVERLAY HITAM SOLID (DIBATASI HANYA 60% TINGGI CONTAINER) */}
                <div className="absolute inset-0 h-[55vh] bg-black/60 z-10"></div>

                {/* KONTEN UTAMA (TERMASUK FORM) - z-20 */}
                <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 z-20">
                    {/* min-h-[70vh] memberi ruang pada Hero. items-start: Mulai dari atas. */}
                    <div className="flex flex-col lg:flex-row items-start min-h-[50vh] py-12 pt-32 lg:py-0"> 
                        
                        {/* === KOLOM KIRI (FORM) - Animasi Masuk === */}
                        <motion.div 
                            className="lg:w-5/12 w-full max-w-lg mt-64 pt-12" // mt-16 untuk Form
                            initial={{ opacity: 0, x: -50 }} // Mulai dari kiri
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                        >
                            <div className="bg-alyusra-orange p-8 md:p-10 rounded-2xl shadow-2xl text-white">
                                <p className="font-semibold">Cek Kelulusan</p>
                                <h1 className="text-3xl font-bold mt-1">Pendaftaran Siswa Baru</h1>
                                <p className="mt-4 opacity-90">Masukkan No Pendaftaran kamu</p>

                                <form onSubmit={handleSubmit} className="mt-6">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <SearchIcon />
                                        </div>
                                        <input
                                            type="text"
                                            name="no_pendaftaran"
                                            value={data.no_pendaftaran}
                                            onChange={(e) => setData('no_pendaftaran', e.target.value.toUpperCase())}
                                            className="w-full pl-12 pr-20 py-4 text-gray-800 rounded-lg focus:ring-2 focus:ring-alyusra-green border-none"
                                            placeholder="Contoh: RTQ2025001"
                                        />
                                        <button
                                            type="submit"
                                            className="absolute inset-y-0 right-0 m-1.5 px-6 bg-alyusra-dark-blue hover:bg-opacity-90 text-white font-semibold rounded-md flex items-center disabled:opacity-50"
                                            disabled={processing}
                                        >
                                            Cek
                                        </button>
                                    </div>
                                    {errors.no_pendaftaran && <p className="text-white text-sm mt-2">{errors.no_pendaftaran}</p>}
                                </form>
                            </div>
                            
                            {/* Flash Messages (Animasi Masuk) */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.8 }}
                            >
                                {flash.success && (
                                    <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                                        {flash.success}
                                    </div>
                                )}
                                {flash.error && (
                                    <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                                        {flash.error}
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>

                        {/* === KOLOM KANAN (GAMBAR & DESAIN TAMBAHAN) - Animasi Masuk === */}
                        <motion.div 
                            className="lg:w-7/12 flex flex-col items-center justify-center mt-12 lg:mt-16 lg:pl-12" // <<-- mt-16 DITERAPKAN DI SINI
                            initial={{ opacity: 0, x: 50 }} // Mulai dari kanan
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                        >
    <br />
                            <div className="text-center mb-6">
                                {/* Judul Santri Berprestasi (Mendapat dorongan dari lg:mt-16 di motion.div) */}
                                <h2 className="text-3xl font-bold text-white pt-20">Santri Berprestasi</h2>
                                <p className="text-gray-300">Generasi Qur'ani Kebanggaan Al-Yusra</p>
                            </div>
                            <div className="relative w-full max-w-xl bg-alyusra-orange rounded-tr-[80px] rounded-bl-[80px] shadow-2xl overflow-hidden p-4">
                                <img 
                                    src="/images/crop_santri4.png" 
                                    alt="Santri Berprestasi Al-Yusra"
                                    className="w-full h-full object-cover" 
                                    style={{ borderRadius: '60px' }}
                                />
                            </div>
                        </motion.div>
                    </div><br /><br /><br />
                </div>
                <div className="pb-16"></div> {/* Padding bottom untuk ruang di bawah hero */}
            </div>
        </AppLayout>
    );
}