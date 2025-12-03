// resources/js/Pages/Pendaftaran.jsx

import { useState } from 'react'; 
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import ProgramCard from '@/Components/Page/Pendaftaran/ProgramCard';
import Modal from '@/Components/Modal'; 
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import { motion, useScroll, useTransform } from 'framer-motion'; 

// --- HAPUS variabel 'const programs = [...]' di sini karena data sekarang datang dari props ---

// Tambahkan 'programs' ke dalam props
export default function Pendaftaran({ auth, flash = {}, programs }) { // <--- UPDATE DI SINI
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // === FRAMER MOTION SCROLL EFFECT ===
    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

    return (
        <AppLayout auth={auth} heroTheme="dark">
            <Head title="Pendaftaran" />

            {/* HERO SECTION (Kode tetap sama) */}
            <motion.div 
                className="relative bg-gray-800 pb-32 mt-[-80px] overflow-hidden" 
                style={{ opacity: opacity }} 
            >
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
                <div className="absolute inset-0 bg-black/70 z-10"></div>
                <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-32 z-20">
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


            {/* KONTEN PROGRAM CARD (Looping data dari props) */}
            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 -mt-16 z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                    
                    {/* Pastikan programs ada isinya sebelum di-map untuk menghindari error jika data kosong */}
                    {programs && programs.length > 0 ? (
                        programs.map((program, index) => (
                            <ProgramCard 
                                key={program.id || index} // Gunakan ID dari database jika ada
                                program={program} 
                                auth={auth} 
                                onRegisterClick={openModal} 
                                className={`animate-slide-in-up`}
                                style={{ animationDelay: `${index * 0.15}s` }} 
                            />
                        ))
                    ) : (
                        <p className="text-white text-center col-span-3">Belum ada program pendaftaran yang tersedia.</p>
                    )}

                </div>
            </div>

            <br /><br /><br />

            {/* MODAL (Kode tetap sama) */}
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