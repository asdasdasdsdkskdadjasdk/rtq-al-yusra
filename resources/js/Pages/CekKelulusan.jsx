import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { motion } from 'framer-motion'; 

// Ikon Kaca Pembesar
const SearchIcon = () => (
    <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

export default function CekKelulusan({ auth, flash = {}, pendaftar, message, filters }) { // Terima props tambahan
    
    // Gunakan 'get' untuk pencarian agar URL terupdate (bisa di-bookmark)
    const { data, setData, get, processing, errors } = useForm({
        no_pendaftaran: filters?.no_pendaftaran || '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        // Pastikan route ini mengarah ke Controller method index dengan parameter query
        get(route('kelulusan.index'), {
            preserveScroll: true,
            preserveState: true,
        });
    }

    // Helper Warna Status
    const getStatusColor = (status) => {
        if (status === 'Lulus' || status === 'Sudah Daftar Ulang') return 'bg-green-100 border-green-500 text-green-800';
        if (status === 'Tidak Lulus') return 'bg-red-100 border-red-500 text-red-800';
        return 'bg-blue-100 border-blue-500 text-blue-800'; // Menunggu Hasil / Verifikasi
    };

    return (
        <AppLayout auth={auth} heroTheme="dark"> 
            <Head title="Cek Kelulusan" />

            {/* HERO CONTAINER UTAMA */}
            <div className="relative mt-[-75px] overflow-hidden min-h-screen">
                
                {/* 1. LAYER GAMBAR LATAR BELAKANG */}
                <motion.div
                    className="absolute inset-0 z-0 h-[65vh]" // Sedikit dipertinggi agar cover area hasil
                    initial={{ scale: 1.05 }}
                    animate={{ scale: 1.0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }} 
                    style={{
                        backgroundImage: "url('/images/rtq.jpg')", 
                        backgroundSize: 'cover', 
                        backgroundAttachment: 'fixed',
                        backgroundPosition: 'center',
                    }}
                />

                {/* 2. OVERLAY HITAM SOLID */}
                <div className="absolute inset-0 h-[65vh] bg-black/60 z-10"></div>

                {/* KONTEN UTAMA */}
                <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 z-20">
                    <div className="flex flex-col lg:flex-row items-start pt-32 pb-20"> 
                        
                        {/* === KOLOM KIRI (FORM & HASIL) === */}
                        <motion.div 
                            className="lg:w-5/12 w-full max-w-lg mt-12 lg:mt-24"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                        >
                            <br /><br /><br /><br />
                            <div className="bg-alyusra-orange p-8 md:p-10 rounded-2xl shadow-2xl text-white relative overflow-hidden">
                                <div className="relative z-10">
                                    <p className="font-semibold text-orange-100">Portal Akademik</p>
                                    <h1 className="text-3xl font-bold mt-1">Cek Kelulusan Santri</h1>
                                    <p className="mt-4 opacity-90 text-sm">Masukkan No. Pendaftaran untuk melihat hasil seleksi.</p>

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
                                                className="w-full pl-12 pr-24 py-4 text-gray-800 rounded-xl focus:ring-4 focus:ring-orange-300/50 border-none shadow-inner placeholder-gray-400 font-bold"
                                                placeholder="Contoh: RTQ-2025..."
                                            />
                                            <button
                                                type="submit"
                                                className="absolute inset-y-0 right-0 m-2 px-6 bg-alyusra-dark-blue hover:bg-gray-800 text-white font-bold rounded-lg flex items-center disabled:opacity-70 transition-colors shadow-md"
                                                disabled={processing}
                                            >
                                                {processing ? '...' : 'Cek'}
                                            </button>
                                        </div>
                                        {errors.no_pendaftaran && <p className="text-red-100 bg-red-500/20 py-1 px-2 rounded mt-2 text-xs border border-red-400/30">{errors.no_pendaftaran}</p>}
                                    </form>
                                </div>
                                
                                {/* Dekorasi Background Card */}
                                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                            </div>
                            
                            {/* === AREA HASIL PENCARIAN (MUNCUL DI BAWAH FORM) === */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                className="mt-6"
                            >
                                {/* PESAN ERROR / TIDAK DITEMUKAN */}
                                {(flash.error || message) && (
                                    <div className="p-6 bg-white border-l-4 border-red-500 text-red-700 rounded-xl shadow-lg flex items-start gap-3">
                                        <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <div>
                                            <h3 className="font-bold text-lg">Data Tidak Ditemukan</h3>
                                            <p className="text-sm">{flash.error || message}</p>
                                        </div>
                                    </div>
                                )}

                                {/* KARTU HASIL KELULUSAN */}
                                {pendaftar && (
                                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Hasil Seleksi</span>
                                            <span className="font-mono text-sm font-bold text-orange-600">{pendaftar.no_pendaftaran}</span>
                                        </div>
                                        
                                        <div className="p-6 text-center">
                                            <h3 className="text-2xl font-bold text-gray-800 mb-1">{pendaftar.nama}</h3>
                                            <p className="text-gray-500 text-sm mb-6">{pendaftar.program_nama} ({pendaftar.program_jenis})</p>
                                            
                                            <div className={`inline-block px-8 py-3 rounded-full text-xl font-extrabold border-2 ${getStatusColor(pendaftar.status)} shadow-sm mb-6`}>
                                                {pendaftar.status.toUpperCase()}
                                            </div>

                                            <div className="text-left bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800">
                                                {pendaftar.status === 'Lulus' || pendaftar.status === 'Sudah Daftar Ulang' ? (
                                                    <div>
                                                        <p className="font-semibold mb-2">Langkah Selanjutnya:</p>
                                                        <p className="mb-3">Silakan login ke akun Anda untuk melakukan daftar ulang dan mencetak berkas.</p>
                                                        <Link href={route('login')} className="block w-full text-center bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition">
                                                            Login Sekarang
                                                        </Link>
                                                    </div>
                                                ) : pendaftar.status === 'Tidak Lulus' ? (
                                                    <p>Tetap semangat! Kesempatan untuk belajar selalu terbuka lebar di tempat lain.</p>
                                                ) : (
                                                    <p>Data Anda sedang diproses atau menunggu jadwal pengumuman. Harap cek secara berkala.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>

                        {/* === KOLOM KANAN (GAMBAR & DESAIN TAMBAHAN) === */}
                        <motion.div 
                            className="lg:w-7/12 flex flex-col items-center justify-center mt-12 lg:mt-24 lg:pl-12 hidden lg:flex" 
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                        >
                            <div className="text-center mb-8 relative z-10">
                                <h2 className="text-4xl font-extrabold text-white drop-shadow-md">Generasi Qur'ani</h2>
                                <p className="text-xl text-gray-200 mt-2 font-light">Membangun Peradaban dengan Al-Qur'an</p>
                            </div>
                            
                            <div className="relative w-full max-w-md">
                                {/* Efek Glow di belakang gambar */}
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-500/30 rounded-full blur-3xl"></div>
                                
                                <div className="relative bg-white p-3 rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                                    <img 
                                        src="/images/crop_santri4.png" 
                                        alt="Santri Berprestasi"
                                        className="w-full h-auto rounded-xl" 
                                    />
                                    <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                                        <p className="font-bold text-gray-800 text-center text-sm">"Sebaik-baik kalian adalah yang mempelajari Al-Qur'an dan mengajarkannya."</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>
                
                {/* Padding bottom agar footer tidak nempel */}<br /><br /><br />
            </div>
        </AppLayout>
    );
}