// resources/js/Pages/Berita.jsx

import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import BeritaCard from '@/Components/Page/Berita/BeritaCard';
import React from 'react'; 
// Import motion untuk animasi zoom dan scroll trigger
import { motion } from 'framer-motion'; 
import '@/Components/Page/Beranda/YouTubeFeed.css';

// --- 1. DEFINISI KOMPONEN YOUTUBEFEED ---

const videoData = [
    {
        videoId: 'BOLnHhKs-ak', 
        title: 'Rumah Tahfidz Quran Putri/Akhwat AL YUSRA dengan suasana paling Hommy',
        duration: '3:45', 
        views: '15K',     
        date: '2 bulan lalu', 
        isNew: false,
    },
    {
        videoId: 'y1BxdRcRReE',
        title: 'Selamat Datang Santri Baru Calon Hafidzah di RTQ Al Yusra Pekanbaru',
        duration: '1:30',
        views: '8.2K',
        date: '1 bulan lalu',
        isNew: false,
    },
    {
        videoId: 'OpEb5Wwi7dQ',
        title: 'Murottal Merdu Sekali Surah Al Baqarah : 77-105 || SYAKIRA & KAISA || Santri RTQ Al Yusra Pekanbaru',
        duration: '50:55', 
        views: '1.1K',
        date: '3 hari lalu',
        isNew: true, 
    },
];

const CHANNEL_NAME = "RTQ Al Yusra Pekanbaru"; 
const CHANNEL_URL = 'https://www.youtube.com/@rtqalyusrapekanbaru4110/videos';


const YouTubeFeed = () => {
    return (
        <section className="youtube-feed-list py-12 "> 
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 "> 
                <h2 className="feed-title text-2xl font-bold text-gray-800 mb-6">Video Terbaru Kami</h2>
                <hr className="mb-8" />
                
                <div className="video-list">
                    {videoData.map((video) => (
                        <div className="video-list-item flex items-start space-x-4 mb-6 pb-6 border-b" key={video.videoId}>
                            
                            <a 
                                href={`https://www.youtube.com/watch?v=${video.videoId}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="video-thumbnail-container relative w-40 flex-shrink-0"
                            >
                                <img 
                                    src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`} 
                                    alt={video.title} 
                                    className="video-thumbnail-img w-full rounded-lg"
                                />
                                <span className="video-duration absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 rounded">{video.duration}</span>
                            </a>

                            <div className="video-details flex-grow">
                                <a 
                                    href={`https://www.youtube.com/watch?v=${video.videoId}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="video-title-link block text-gray-900 hover:text-alyusra-orange transition"
                                >
                                    <h3 className="video-title text-base font-semibold leading-snug">{video.title}</h3>
                                </a>
                                <div className="video-meta text-sm text-gray-500 mt-1">
                                    <span className="video-channel block">{CHANNEL_NAME}</span>
                                    <span className="video-stats">{video.views} views • {video.date}</span>
                                    {video.isNew && <span className="new-badge ml-2 bg-red-600 text-white px-1 rounded text-xs font-medium">New</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="more-videos-container text-center mt-8">
                    <a 
                        href={CHANNEL_URL} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="more-videos-button inline-block bg-alyusra-orange text-white px-6 py-2 rounded-md font-semibold hover:bg-opacity-90 transition"
                    >
                        Lihat Lebih Banyak Lagi
                    </a>
                </div>
            </div>
        </section>
    );
};


// --- 2. KOMPONEN BERITA ---

export default function Berita({ berita, auth }) {
    const youtubeDelay = berita.length * 0.1 + 0.2;

    return (
        <AppLayout auth={auth} heroTheme="dark">
            <Head title="Informasi dan Pengumuman" />

            {/* Bungkus semua konten utama dalam satu fragment */}
            <>
            {/* HERO CONTAINER UTAMA */}
            <div 
                className="relative bg-gray-800 pb-20 mt-[-80px] overflow-hidden" 
            >
                {/* 1. MOTION DIV UNTUK GAMBAR LATAR BELAKANG DAN EFEK ZOOM */}
                <motion.div
                    className="absolute inset-0 z-0" 
                    initial={{ scale: 1.05 }} // Mulai zoom (awal)
                    animate={{ scale: 1.0 }}  // Akhir zoom (saat dimuat)
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
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-white text-center mb-8 animate-fade-in animate-slide-in-up">
                        Informasi dan Pengumuman
                    </h1>
                    
                    <br /><br />
                    {/* Konten Berita Card dengan animasi bertahap */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                        {berita.map((post, index) => (
                            <BeritaCard 
                                key={post.id} 
                                post={post} 
                                className={`animate-slide-in-up`} 
                                style={{ animationDelay: `${index * 0.1}s` }} // 100ms delay per kartu
                            />
                            ))}
                    </div><br />
                </div> 
            </div>
                
                {/* YOUTUBE FEED SECTION: DIBUNGKUS DENGAN motion.div untuk SCROLL TRIGGER */}
                <motion.div 
                    initial={{ opacity: 0, y: 50 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.8, delay: youtubeDelay }} 
                    viewport={{ once: true, amount: 0.1 }} 
                >
                    <YouTubeFeed />
                </motion.div>
            </>
        </AppLayout>
    );
}