// resources/js/Components/Page/Beranda/CallToAction.jsx

import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion'; 
import { useInView } from 'react-intersection-observer'; 

export default function CallToAction() {
    // Setup useInView (tetap sama)
    const { ref, inView } = useInView({
        triggerOnce: true, 
        threshold: 0.2,    
    });

    // --- VARIAN ANIMASI ---

    // 1. Varian Background Zoom (seperti di Hero)
    const backgroundVariants = {
        hidden: { scale: 1.15 }, 
        visible: { 
            scale: 1, 
            transition: { 
                duration: 6, // Durasi zoom lambat
                ease: "easeOut" 
            }
        },   
    };

    // 2. Setup Animasi Mengetik Karakter (grouping per kata)
    const titleText = "Menuju 1 Rumah 1 Penghafal Al-Quran";
    const titleWords = titleText.split(' '); // Pecah jadi kata

    // Varian container judul (h2): Jeda antar KARAKTER
    const titleContainerVariants = {
        hidden: { opacity: 1 }, 
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.04, // Jeda per KARAKTER
                delayChildren: 0.3     // Mulai ketik sedikit setelah section muncul
            }
        }
    };

    // Varian untuk setiap KARAKTER
    const titleCharVariants = {
        hidden: { opacity: 0, y: 10 }, 
        visible: { opacity: 1, y: 0 }  
    };

    // 3. Varian untuk Subtitle & Tombol (slide-up standar)
    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
    };
    // --- AKHIR VARIAN ANIMASI ---


    return (
        // Section utama: ref, relatif, overflow
        <section 
            ref={ref} 
            className="relative py-28 overflow-hidden" 
        >
            {/* Background Animasi Zoom */}
            <motion.div
                className="absolute inset-0 bg-cover bg-center" 
                style={{ backgroundImage: "url('/images/rtq-gedung1.jpg')" }} 
                variants={backgroundVariants} 
                initial="hidden" 
                animate={inView ? "visible" : "hidden"} 
            />
            
            {/* Overlay gelap (z-10) */}
            <div className="absolute inset-0 bg-black/60 z-10"></div>

            {/* Kontainer untuk konten (z-20) */}
            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center z-20">
                
                {/* Judul dengan Animasi Mengetik */}
                <motion.h2 
                    variants={titleContainerVariants}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"} // Animasikan jika terlihat
                    className="text-5xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-lg"
                >
                    {/* Map setiap KATA */}
                    {titleWords.map((word, wordIndex) => (
                        // Bungkus KATA + SPASI dalam span biasa (inline-block)
                        <span key={wordIndex} className="inline-block whitespace-pre">
                            {/* Map setiap KARAKTER */}
                            {Array.from(word).map((char, charIndex) => (
                                // Animasikan KARAKTER
                                <motion.span 
                                    key={`${char}-${charIndex}`} 
                                    variants={titleCharVariants} 
                                    transition={{ duration: 0.3 }}
                                    className="inline-block"
                                >
                                    {char}
                                </motion.span>
                            ))}
                            {/* Animasikan SPASI */}
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
                    {/* Tambahkan garis bawah oranye (tidak perlu animasi terpisah) */}
                     <br /> {/* Pastikan Al-Quran di baris baru jika perlu */}
                     <span className="relative inline-block whitespace-nowrap">
                         <span className="relative z-10">Al-Quran</span>
                         <span 
                             className="absolute bottom-1.5 left-0 w-full h-4 bg-alyusra-orange transform -skew-x-12"
                         ></span>
                     </span>
                </motion.h2>

                {/* Subtitle dengan animasi item + delay */}
                <motion.p 
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    variants={itemVariants}
                    // Delay dihitung setelah animasi ketik selesai
                    transition={{ duration: 0.6, delay: titleText.length * 0.04 + 0.5, ease: "easeOut" }} 
                    className="text-gray-200 text-lg mt-6 mb-8 italic"
                >
                    "Menuju visi dan misi besar demi meraih impian bersama"
                </motion.p>

                {/* Tombol dengan animasi item + delay lebih lama */}
                 <motion.div
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    variants={itemVariants}
                     // Delay dihitung setelah subtitle
                    transition={{ duration: 0.6, delay: titleText.length * 0.04 + 0.7, ease: "easeOut" }} 
                 >
                    <Link 
                        href={route('pendaftaran')} 
                        className="bg-alyusra-orange text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-opacity-90 transition inline-flex items-center space-x-2 shadow-lg border-2 border-white/50"
                    >
                        <span>Ayo Bergabung</span>
                        <span>&rarr;</span>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}