// resources/js/Pages/BiayaPendidikan.jsx

import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import BiayaCard from '@/Components/Page/Biaya/BiayaCard';
import { motion } from 'framer-motion'; 

// HAPUS variable const biayaData = [...] karena data sekarang datang dari Database

// Terima prop 'biayaList' dari Controller
export default function BiayaPendidikan({ auth, biayaList }) {
    
    // Fallback: Jika database kosong atau error, gunakan array kosong agar tidak crash
    const dataToShow = biayaList || [];

    return (
        <AppLayout auth={auth} heroTheme="dark"> 
            <Head title="Biaya Pendidikan" />

            {/* HERO CONTAINER UTAMA */}
            <div className="relative bg-gray-800 pb-20 mt-[-80px] overflow-hidden">
                {/* 1. Gambar Latar Belakang */}
                <motion.div
                    className="absolute inset-0 z-0" 
                    initial={{ scale: 1.05 }} 
                    animate={{ scale: 1.0 }} 
                    transition={{ duration: 1.5, ease: "easeOut" }} 
                    style={{
                        backgroundImage: "url('/images/rtq.jpg')", 
                        backgroundSize: 'cover', 
                        backgroundAttachment: 'fixed', 
                        backgroundPosition: 'top center',
                    }}
                />

                {/* 2. Overlay Hitam */}
                <div className="absolute inset-0 bg-black/70 z-10"></div>
                
                <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-32 z-20"> 
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-white text-center mb-10 animate-fade-in animate-slide-in-up">
                        Biaya Pendidikan
                    </h1>
                </div>
            </div>
            
            {/* KONTEN KARTU BIAYA */}
            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 -mt-16 z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center">
                    {/* Looping data dari Database */}
                    {dataToShow.map((program, index) => (
                        <BiayaCard 
                            key={program.id || index} // Gunakan ID dari database sebagai key
                            program={program} 
                            style={{ animationDelay: `${index * 0.15}s` }}
                        />
                    ))}
                </div>
                
                {/* Tampilkan pesan jika data kosong */}
                {dataToShow.length === 0 && (
                     <div className="text-center bg-white p-8 rounded-lg shadow-lg">
                        <p className="text-gray-500">Informasi biaya belum tersedia saat ini.</p>
                     </div>
                )}
            </div>
            
            <div className="pb-16"></div> 
        </AppLayout>
    );
}