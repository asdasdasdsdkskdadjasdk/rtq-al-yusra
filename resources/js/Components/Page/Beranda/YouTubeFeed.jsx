// File: YouTubeFeed.jsx (DIUPDATE)

import React from 'react';
import './YouTubeFeed.css'; // File CSS yang sama

// --- KITA TAMBAHKAN INFO LEBIH DETAIL DI SINI ---
// (Saya isi data palsu untuk 'duration', 'views', 'date'. Ganti sesuai data Anda)
const videoData = [
    {
        videoId: 'BOLnHhKs-ak', 
        title: 'Rumah Tahfidz Quran Putri/Akhwat AL YUSRA dengan suasana paling Hommy',
        duration: '3:45', // Ganti durasi
        views: '15K',     // Ganti jumlah views
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

const CHANNEL_NAME = "RTQ Al Yusra Pekanbaru"; // Nama Channel Anda
const CHANNEL_URL = 'https://www.youtube.com/@rtqalyusrapekanbaru4110/videos';
// --- BATAS PENGATURAN ---


const YouTubeFeed = () => {
    return (
        <section className="youtube-feed-list "> {/* Nama kelas baru agar lebih jelas */}
            <h2 className="feed-title">Video Terbaru Kami</h2>
            <hr />
            <br />
            
            <div className="video-list">
                {videoData.map((video) => (
                    // Setiap video adalah item di daftar
                    <div className="video-list-item" key={video.videoId}>
                        
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
                            &#8942; {/* Ini adalah kode untuk ikon tiga titik vertikal */}
                        </div>
                    </div>
                ))}
            </div>

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
        </section>
    );
};

export default YouTubeFeed;