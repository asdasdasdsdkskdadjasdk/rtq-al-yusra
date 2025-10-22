// resources/js/Components/Page/Beranda/Hero.jsx

import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion'; 

export default function Hero() {

    // Varian animasi kolom & background (tetap sama)
    const leftColumnVariants = { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 }, };
    const rightColumnVariants = { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 }, };
    const backgroundVariants = { hidden: { scale: 1.15 }, visible: { scale: 1, transition: { duration: 1.5, ease: "easeOut" } }, };

    // --- PERBAIKAN: Setup Animasi Mengetik Karakter, tapi Grouping per Kata ---
    const titleText = "Selamat Datang Para Penghafal Quran Al-Yusra";
    // Pecah jadi KATA dulu untuk grouping
    const titleWords = titleText.split(' '); 

    // Varian untuk h1 (container): mengatur jeda antar KARAKTER
    const titleContainerVariants = {
        hidden: { opacity: 1 }, 
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.04, // Jeda per KARAKTER (kembali cepat)
                delayChildren: 0.5    
            }
        }
    };

    // Varian untuk setiap KARAKTER (motion.span terdalam)
    const titleCharVariants = {
        hidden: { opacity: 0, y: 10 }, // Mulai transparan & sedikit ke bawah
        visible: { opacity: 1, y: 0 }   // Muncul ke posisi normal
    };
    // --- AKHIR PERBAIKAN SETUP ---

    return (
        <section className="relative overflow-hidden min-h-screen -mt-20"> 
            
            {/* Background Animasi */}
            <motion.div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/images/rtq.jpg')" }}
                variants={backgroundVariants}
                initial="hidden"
                animate="visible"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 z-10"></div>

            {/* Kontainer Utama */}
            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 z-20"> 
                <div className="flex flex-col lg:flex-row items-center min-h-screen pt-20"> 

                    {/* === KOLOM KIRI (TEKS) === */}
                    <motion.div 
                        initial="hidden"
                        animate="visible" 
                        variants={leftColumnVariants}
                        transition={{ duration: 0.7, ease: "easeOut" }} 
                        className="lg:w-6/12 text-white text-center lg:text-left" 
                    >
                        {/* --- PERBAIKAN h1 UNTUK ANIMASI KETIK KARAKTER (RAPI) --- */}
                        <motion.h1 
                            className="text-5xl lg:text-7xl font-extrabold leading-tight drop-shadow-lg"
                            variants={titleContainerVariants} 
                            initial="hidden"
                            animate="visible" 
                        >
                            {/* 1. Map setiap KATA */}
                            {titleWords.map((word, wordIndex) => (
                                // 2. Bungkus setiap KATA + SPASI dalam span biasa (inline-block)
                                //    Ini memberitahu browser untuk menjaga kata tetap utuh
                                <span key={wordIndex} className="inline-block whitespace-pre">
                                    {/* 3. Map setiap KARAKTER di dalam kata */}
                                    {Array.from(word).map((char, charIndex) => (
                                        // 4. Animasikan setiap KARAKTER
                                        <motion.span 
                                            key={`${char}-${charIndex}`} 
                                            variants={titleCharVariants} 
                                            transition={{ duration: 0.3 }}
                                            className="inline-block" // Bisa juga dihapus jika 'whitespace-pre' cukup
                                        >
                                            {char}
                                        </motion.span>
                                    ))}
                                    {/* 5. Tambahkan spasi antar kata (juga dianimasikan) */}
                                    {wordIndex < titleWords.length - 1 && (
                                        <motion.span 
                                            variants={titleCharVariants} 
                                            transition={{ duration: 0.3 }}
                                            className="inline-block"
                                        >
                                            {' '}
                                        </motion.span>
                                    )}
                                </span>
                            ))}
                        </motion.h1>
                        {/* --- AKHIR PERBAIKAN h1 --- */}
                        
                        {/* Paragraf dan Tombol (delay dihitung berdasarkan total karakter + spasi) */}
                        <motion.p 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: titleText.length * 0.04 + 0.7 }} // Delay setelah judul
                            className="mt-6 text-lg text-gray-200 italic drop-shadow-md"
                        >
                            "Mencetak generasi Qur'ani yang berakhlak mulia, cerdas, dan bermanfaat bagi ummat."
                        </motion.p>
                        
                        <motion.div 
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ duration: 0.5, delay: titleText.length * 0.04 + 0.9 }} // Delay setelah paragraf
                        >
                            <Link
                                href={route('pendaftaran')} 
                                className="mt-8 bg-alyusra-green text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-opacity-90 transition inline-flex items-center space-x-2 shadow-lg"
                            >
                                <span>Daftar Sekarang</span>
                                <span className="font-bold">+</span>
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* === KOLOM KANAN (GAMBAR) === */}
                     <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={rightColumnVariants}
                        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }} 
                        className="lg:w-6/12 flex justify-center lg:justify-end mt-10 lg:mt-0" 
                    >
                       <div className="relative w-full max-w-xl bg-alyusra-orange/75 rounded-tr-[80px] rounded-bl-[80px] shadow-2xl overflow-hidden p-4"> 
                           <img 
                               src="/images/crop_santri4.png" 
                               alt="Santri Berprestasi Al-Yusra"
                               className="w-full h-full object-cover" 
                               style={{ borderRadius: '60px' }}
                           />
                       </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}