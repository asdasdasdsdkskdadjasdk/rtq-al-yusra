// resources/js/Pages/DetailBerita.jsx

import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { motion } from 'framer-motion';

export default function DetailBerita({ auth, post }) {
    
    // 1. LOGIKA GAMBAR UNTUK KONTEN (BODY)
    // Ini gambar spesifik berita yang akan muncul di dalam kotak putih
    const rawImage = post.gambar || post.image;
    let contentImageUrl = null;
    
    if (rawImage) {
        contentImageUrl = rawImage.startsWith('http') ? rawImage : `${rawImage}`;
    }
    // Jika tidak ada gambar berita, kita biarkan null agar tidak merusak tampilan di body

    // 2. GAMBAR HEADER (HERO) - SELALU DEFAULT
    // Ganti dengan path gambar background yang Anda inginkan untuk header semua berita
    const heroImageUrl = '/images/rtq.jpg'; 

    // 3. FORMAT DATA LAINNYA
    const title = post.judul || post.title;
    const content = post.konten || post.content;
    const authorName = post.penulis || post.author || 'Admin';
    
    const formattedDate = post.created_at 
        ? new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) 
        : (post.date || '-');

    return (
        <AppLayout auth={auth} heroTheme="dark">
            <Head title={title} />

            {/* === HEADER GAMBAR (HERO SECTION) - DEFAULT IMAGE === */}
            <div className="relative bg-gray-900 pb-24 pt-32 mt-[-80px] overflow-hidden min-h-[50vh]">
                
                {/* Gambar Latar Belakang (Selalu Default) */}
                <motion.div
                    className="absolute inset-0 z-0"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1.0 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    style={{
                        backgroundImage: `url('${heroImageUrl}')`, 
                        backgroundSize: 'cover',
                        backgroundAttachment: 'fixed',
                        backgroundPosition: 'center',
                    }}
                />

                {/* Overlay Gelap */}
                <div className="absolute inset-0 bg-black/70 z-10"></div>

                {/* Judul & Info Berita */}
                <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 z-20 flex flex-col items-center justify-center h-full text-center pt-10">
                    
                    <span className="px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-white uppercase bg-alyusra-orange rounded-full shadow-lg">
                        Berita & Informasi
                    </span>

                    <motion.h1 
                        className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight max-w-5xl drop-shadow-2xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        {title}
                    </motion.h1>

                    <motion.div 
                        className="mt-6 text-gray-300 text-sm md:text-lg flex flex-wrap justify-center items-center gap-4 font-medium"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-alyusra-orange" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            {authorName}
                        </span>
                        <span className="hidden md:inline">•</span>
                        <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-alyusra-orange" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            {formattedDate}
                        </span>
                    </motion.div>
                </div>
            </div>

            {/* === KONTEN BERITA === */}
            <div className="relative pb-24 -mt-20 z-30 bg-dots-pattern bg-dots-size bg-repeat">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Kartu Konten */}
                    <motion.div 
                        className="bg-white rounded-3xl shadow-2xl p-6 md:p-12 max-w-4xl mx-auto border border-gray-100 overflow-hidden"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        {/* === GAMBAR BERITA (DI DALAM KONTAINER) === */}
                        {/* Hanya tampil jika ada gambar khusus berita */}
                        {contentImageUrl && (
                            <div className="mb-10 -mx-6 md:-mx-12 -mt-6 md:-mt-12 h-64 md:h-96 overflow-hidden rounded-xl shadow-lg">
                                <img 
                                    src={contentImageUrl} 
                                    alt={title} 
                                    className="w-full h-auto max-h-[500px] object-cover"
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                            </div>
                        )}

                        {/* Isi Artikel */}
                        <article className="prose prose-lg md:prose-xl max-w-none text-gray-700 leading-loose whitespace-pre-wrap font-serif">
                            {content}
                        </article>

                        {/* Tombol Kembali */}
                        <div className="mt-16 pt-10 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <Link 
                                href={route('berita.index')}
                                className="inline-flex items-center font-semibold text-gray-600 hover:text-alyusra-orange transition group"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                                Kembali ke Daftar Berita
                            </Link>
                        </div>
                    </motion.div>

                </div>
            </div>

        </AppLayout>
    );
}