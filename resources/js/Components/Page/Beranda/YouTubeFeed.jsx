// resources/js/Components/Page/Beranda/YouTubeFeed.jsx

import React from 'react';
// Import motion untuk animasi scroll dan staggered
import { motion } from 'framer-motion'; 
import './YouTubeFeed.css'; 

// --- Data (Asumsi data ini dipindahkan ke file ini) ---
const videoData = [
    {
        videoId: 'BOLnHhKs-ak', 
        title: 'Rumah Tahfidz Quran Putri/Akhwat AL YUSRA dengan suasana paling Hommy',
        duration: '3:45', // Ganti durasi
        views: '15K',     // Ganti jumlah views
        date: '2 bulan lalu', // Ganti tanggal rilis
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
        duration: '50:55', // Ganti durasi
        views: '1.1K',
        date: '3 hari lalu',
        isNew: true, // Set 'true' jika video baru
    },
];

const CHANNEL_NAME = "RTQ Al Yusra Pekanbaru"; 
const CHANNEL_URL = 'https://www.youtube.com/@rtqalyusrapekanbaru4110/videos';
// ----------------------------------------------------


// Definisi variants untuk container (mengontrol staggered delay)
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1, // Jeda 100ms antara setiap item anak
        },
    },
};

// Definisi variants untuk item anak (efek slide up)
const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
};


const YouTubeFeed = () => {
    return (
        <section className="youtube-feed-list py-12 "> 
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 "> 
                <h2 className="feed-title">Video Terbaru Kami</h2>
                <hr />
                <br />
                
                {/* MOTION CONTAINER: Memicu animasi saat scroll */}
                <motion.div 
                    className="video-list"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }} // Pemicu saat 10% elemen terlihat
                >
                    {videoData.map((video) => (
                        // MOTION ITEM: Menggunakan variants dari container
                        <motion.div 
                            className="video-list-item "
                            key={video.videoId}
                            variants={itemVariants}
                        >
                            
                            {/* Thumbnail Kiri dengan Durasi */}
                            <a 
                                href={`https://www.youtube.com/watch?v=${video.videoId}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="video-thumbnail-container"
                            >
                                <img 
                                    src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`} 
                                    alt={video.title} 
                                    className="video-thumbnail-img"
                                />
                                <span className="video-duration">{video.duration}</span>
                            </a>

                            {/* Detail Video di Kanan */}
                            <div className="video-details">
                                <a 
                                    href={`https://www.youtube.com/watch?v=${video.videoId}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="video-title-link"
                                >
                                    <h3 className="video-title">{video.title}</h3>
                                </a>
                                <div className="video-meta">
                                    <span className="video-channel">{CHANNEL_NAME}</span>
                                    <span className="video-stats">{video.views} views • {video.date}</span>
                                    {video.isNew && <span className="new-badge">New</span>}
                                </div>
                            </div>

                            {/* Tombol Tiga Titik (Menu) */}
                            <div className="video-menu-icon">
                                &#8942; 
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Tombol 'Lebih Banyak' */}
                <div className="more-videos-container">
                    <a 
                        href={CHANNEL_URL} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="more-videos-button"
                    >
                        Lihat Lebih Banyak Lagi
                    </a>
                </div>
            </div>
        </section>
    );
};

export default YouTubeFeed;