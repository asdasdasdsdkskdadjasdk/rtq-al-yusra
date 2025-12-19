import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { motion } from 'framer-motion';

// --- BAGIAN IKON (TETAP SAMA) ---
const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-3.987a1 1 0 01-.994-.959A15.01 15.01 0 003.11 9.987a1 1 0 01-.959-.994V5z" />
    </svg>
);
const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 00-2-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);
const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-1.25.5-1.75s1.25-.75 2-.75h1.5V5h-2c-2.4 0-4 .5-4 3v2.5H9V13.5h2V21h4v-7.5z"/></svg>
);
const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M7.5 10c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5-2.5-1.12-2.5-2.5zm10-5c-.7 0-1.3.3-1.8.8-.5.5-.8 1.1-.8 1.9 0 1.25.7 2.25 1.8 2.5.7.1 1.4-.2 1.9-.8.5-.5.8-1.2.8-2 0-.8-.3-1.4-.8-1.9-.5-.5-1.1-.8-1.9-.8zm-6.2 5c0 1.9-1.5 3.5-3.5 3.5s-3.5-1.6-3.5-3.5 1.5-3.5 3.5-3.5 3.5 1.6 3.5 3.5zm7.3 11c0 .28-.22.5-.5.5H3.5c-.28 0-.5-.22-.5-.5V8.5c0-.28.22-.5.5-.5h17c.28 0 .5.22.5.5v12z"/></svg>
);
const WhatsappIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12.03 2.001c-5.46 0-9.927 4.467-9.927 9.927 0 1.77.474 3.44 1.36 4.908l-.946 3.65 3.738-.98c1.42.77 3.03 1.178 4.815 1.178 5.46 0 9.927-4.467 9.927-9.927s-4.467-9.927-9.927-9.927zm3.565 12.392c-.065.105-.23.14-.385.197-.15.056-.9.336-1.16.368-.26.03-.42.046-.735-.156-.305-.195-1.17-.468-2.225-1.353-.83-.678-1.38-1.527-1.545-1.815-.16-.28-.01-.43-.16-.6-.16-.16-.31-.38-.475-.575-.16-.205-.335-.17-.49-.17-.15-.01-.325.04-.5.23-.15.195-.58.74-.58.985 0 .245.59.845.67.95.08.105.74 1.125 1.78 1.54.49.195.89.325 1.19.41.3.09.4.085.58.07.2-.015 1.485-.6 1.83-.875.33-.26.54-.42.74-.525.19-.09.325-.09.465-.05.15.035.93.455 1.05.71.12.255.125.465.085.61z" /></svg>
);
const YouTubeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.3 12.8L12 11.7l-3.3 3.1V9.2h6.6v5.6z"/></svg>
);

export default function KontakKami({ auth }) {
    // 1. AMBIL DATA DINAMIS DARI DATABASE
    const { sekolah } = usePage().props;

    // 2. LOGIKA FORMAT NOMOR WA (08xx -> 628xx)
    let whatsappLink = '#';
    if (sekolah.no_hp) {
        let clean = sekolah.no_hp.replace(/[^0-9]/g, ''); // Hapus non-angka
        if (clean.startsWith('0')) {
            clean = '62' + clean.slice(1); // Ganti 0 depan dengan 62
        }
        whatsappLink = `https://wa.me/${clean}`;
    }

    const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.65086910485!2d101.43044257496473!3d0.5249364994699299!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d5ab6bbb930ac3%3A0xf98043ac3549b8ef!2sRTQ%20AL%20YUSRA%20(%20Rumah%20Tahfidz%20Quran)!5e0!3m2!1sid!2sid!4v1764551694201!5m2!1sid!2sid";

    return (
        <AppLayout auth={auth} heroTheme="dark">
            <Head title="Kontak Kami" />

            {/* HERO CONTAINER UTAMA */}
            <div className="relative bg-gray-800 pb-16 pt-32 mt-[-80px] overflow-hidden" 
                 style={{ 
                     backgroundImage: "url('/images/rtq.jpg')", 
                     backgroundSize: 'cover', 
                     backgroundAttachment: 'fixed', 
                     backgroundPosition: 'center' 
                 }}>
                <div className="absolute inset-0 bg-black/70"></div>
                
                <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 z-20">
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-white text-center mb-6 animate-fade-in animate-slide-in-up">
                        Hubungi Kami
                    </h1>
                </div>
            </div>

            {/* KONTEN UTAMA */}
            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 -mt-16 z-20 pb-12">
                
                {/* GRID SYSTEM: 3 Kolom */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* KOLOM 1: INFORMASI KONTAK (Mengambil 1/3 bagian) */}
                    <motion.div 
                        className="lg:col-span-1 p-8 rounded-2xl shadow-lg bg-alyusra-orange text-white h-full"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h2 className="text-2xl font-bold mb-6 border-b pb-3 border-white/40">Detail Kontak</h2>
                        
                        <div className="space-y-6">
                            {/* ALAMAT */}
                            <div className="flex items-start">
                                <LocationIcon />
                                <div className="ml-3">
                                    <p className="font-semibold">Alamat Kami</p>
                                    <p className="text-sm opacity-90">
                                        {sekolah.alamat_pusat || 'Alamat belum diatur.'}
                                    </p>
                                </div>
                            </div>
                            
                            {/* EMAIL */}
                            <div className="flex items-center">
                                <MailIcon />
                                <div className="ml-3">
                                    <p className="font-semibold">Email</p>
                                    <p className="text-sm opacity-90">
                                        {sekolah.email || 'Email belum diatur.'}
                                    </p>
                                </div>
                            </div>
                            
                            {/* TELEPON */}
                            <div className="flex items-center">
                                <PhoneIcon />
                                <div className="ml-3">
                                    <p className="font-semibold">Telepon/WA</p>
                                    <p className="text-sm opacity-90">
                                        {sekolah.no_hp || 'No HP belum diatur.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        {/* SOSIAL MEDIA */}
                        <div className="mt-8 pt-6 border-t border-white/40">
                            <p className="font-semibold text-lg mb-3">Sosial Media Kami</p>
                            <div className="flex space-x-4">
                                {sekolah.facebook && (
                                    <a href={sekolah.facebook} target="_blank" rel="noreferrer" className="text-white hover:text-gray-200 transition">
                                        <FacebookIcon />
                                    </a>
                                )}
                                {sekolah.instagram && (
                                    <a href={sekolah.instagram} target="_blank" rel="noreferrer" className="text-white hover:text-gray-200 transition">
                                        <InstagramIcon />
                                    </a>
                                )}
                                {sekolah.youtube && (
                                    <a href={sekolah.youtube} target="_blank" rel="noreferrer" className="text-white hover:text-gray-200 transition">
                                        <YouTubeIcon />
                                    </a>
                                )}
                                
                                {/* LINK WHATSAPP DENGAN FORMAT BENAR */}
                                {sekolah.no_hp && (
                                    <a href={whatsappLink} target="_blank" rel="noreferrer" className="text-white hover:text-gray-200 transition">
                                        <WhatsappIcon />
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* KOLOM 2 & 3: MAP EMBED (Mengambil 2/3 bagian sisa) */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg overflow-hidden h-full min-h-[450px]">
                        <iframe 
                            src={mapEmbedUrl} 
                            width="100%" 
                            height="100%" 
                            style={{ border: 0, minHeight: '450px' }} 
                            allowFullScreen="" 
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Lokasi RTQ Al Yusra"
                            className="w-full h-full object-cover"
                        ></iframe>
                    </div>

                </div>
            </div>
            
        </AppLayout>
    );
}