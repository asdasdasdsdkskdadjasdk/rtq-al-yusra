import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react'; // Pastikan usePage diimport
import AppLayout from '@/Layouts/AppLayout';

export default function StatusPendaftaran({ auth, pendaftarList }) {
    
    // 1. AMBIL DATA SETTING (SEKOLAH) DARI PROPS GLOBAL
    const { sekolah } = usePage().props;

    
    // State untuk menangani data yang sedang dipilih (Default: data terbaru)
    const [activePendaftar, setActivePendaftar] = useState(pendaftarList?.[0] || {});

    // Update state jika props berubah
    useEffect(() => {
        if (pendaftarList && pendaftarList.length > 0) {
            setActivePendaftar(pendaftarList[0]);
        }
    }, [pendaftarList]);

    // Helper format tanggal (Indonesia)
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    // Helper format mata uang
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    }

    // Helper Warna Background Status
    const getStatusColorClass = (status) => {
        switch(status) {
            case 'Sudah Daftar Ulang': return 'bg-green-50 border-green-200';
            case 'Lulus': return 'bg-green-50 border-green-200';
            case 'Tidak Lulus': return 'bg-red-50 border-red-200';
            case 'Menunggu Hasil Pendaftaran': return 'bg-blue-50 border-blue-200';
            case 'Sudah Diverifikasi': return 'bg-purple-50 border-purple-200';
            default: return 'bg-yellow-50 border-yellow-200';
        }
    };

    // Helper Warna Text Status
    const getStatusTextClass = (status) => {
        switch(status) {
            case 'Sudah Daftar Ulang': return 'text-green-700';
            case 'Lulus': return 'text-green-600';
            case 'Tidak Lulus': return 'text-red-600';
            case 'Menunggu Hasil Pendaftaran': return 'text-blue-600';
            case 'Sudah Diverifikasi': return 'text-purple-600';
            default: return 'text-yellow-600';
        }
    };

    // Jika data kosong
    if (!activePendaftar || !activePendaftar.no_pendaftaran) {
        return (
             <AppLayout auth={auth}>
                <div className="container mx-auto p-10 text-center">
                    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h2 className="text-xl font-bold text-gray-700 mb-2">Belum Ada Pendaftaran</h2>
                        <p className="text-gray-500 mb-6">Anda belum melakukan pendaftaran untuk program apapun.</p>
                        <Link href={route('pendaftaran')} className="block w-full py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition">
                            Daftar Sekarang
                        </Link>
                    </div>
                </div>
             </AppLayout>
        )
    }

    return (
        <AppLayout auth={auth} heroTheme="dark">
            <Head title="Status Pendaftaran" />

            {/* Hero Section */}
            <div 
                className="relative bg-gray-800 pb-24 mt-[-80px] overflow-hidden print:hidden" 
                style={{ 
                    backgroundImage: "url('/images/rtq.jpg')", 
                    backgroundSize: 'cover', 
                    backgroundAttachment: 'fixed', 
                    backgroundPosition: 'center' 
                }}
            >
                <div className="absolute inset-0 bg-black/75"></div>
                <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-32 text-center">
                    <h1 className="text-3xl lg:text-4xl font-extrabold text-white mb-2">
                        Status Pendaftaran
                    </h1>
                    <p className="text-gray-300 text-lg">
                        Pantau status kelulusan, riwayat, dan jadwal ujian Anda di sini.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 -mt-16 z-20 pb-20">
                <div className="max-w-6xl mx-auto">
                    
                    {/* 1. KARTU STATUS UTAMA (HEADER) */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                        <div className="p-6 md:p-8 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Status Saat Ini
                            </h2>

                            <div className={`p-6 rounded-xl text-center border-2 transition-all duration-300 ${getStatusColorClass(activePendaftar.status)}`}>
                                <p className="text-sm font-semibold uppercase tracking-wider mb-2 text-gray-500">
                                    Program: {activePendaftar.program_nama}
                                </p>
                                <h3 className={`text-3xl md:text-4xl font-extrabold mb-2 ${getStatusTextClass(activePendaftar.status)}`}>
                                    {activePendaftar.status || 'MENUNGGU VERIFIKASI'}
                                </h3>
                                <p className="text-gray-600">
                                    {activePendaftar.status === 'Sudah Daftar Ulang' ? 'Selamat! Anda resmi terdaftar sebagai santri RTQ Al-Yusra.' :
                                     activePendaftar.status === 'Lulus' ? 'Selamat! Anda dinyatakan lulus seleksi. Segera lakukan daftar ulang.' : 
                                     activePendaftar.status === 'Tidak Lulus' ? 'Mohon maaf, Anda belum lulus seleksi.' :
                                     activePendaftar.status === 'Menunggu Hasil Pendaftaran' ? 'Ujian telah selesai. Mohon tunggu pengumuman kelulusan.' :
                                     'Data Anda sedang diverifikasi oleh panitia atau menunggu jadwal ujian.'}
                                </p>

                                {/* Tombol Bayar Muncul Jika Belum Lunas & Bukan Status Final/Gagal */}
                                {activePendaftar.status_pembayaran !== 'Lunas' && !['Lulus', 'Tidak Lulus', 'Sudah Daftar Ulang'].includes(activePendaftar.status) && (
                                    <div className="mt-6">
                                        <p className="text-red-500 font-medium mb-2">
                                            Status Pembayaran: {activePendaftar.status_pembayaran}
                                        </p>
                                        <a 
                                            href={route('pembayaran.show', activePendaftar.id)}
                                            className="inline-flex items-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full shadow-lg transition-transform hover:scale-105"
                                        >
                                            Selesaikan Pembayaran {formatRupiah(activePendaftar.nominal_pembayaran)} &rarr;
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* 2. KOLOM KIRI: TAMPILAN DINAMIS BERDASARKAN STATUS */}
                        <div className="lg:col-span-2 space-y-8">
                            
                            {/* --- KONDISI A: SUDAH DAFTAR ULANG (FINAL) --- */}
                            {activePendaftar.status === 'Sudah Daftar Ulang' ? (
                                <div className="bg-white rounded-2xl shadow-lg p-8 text-center border-t-4 border-green-600">
                                    <div className="mb-6 flex justify-center">
                                        <div className="p-4 bg-green-100 rounded-full animate-bounce">
                                            <svg className="w-16 h-16 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-3">Selamat Bergabung!</h3>
                                    <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                                        Proses Daftar Ulang Anda telah berhasil dan terverifikasi sistem.
                                        <br/>Status Akun Anda kini adalah <strong>WALI SANTRI</strong>.
                                    </p>
                                    
                                    {/* --- TOMBOL GABUNG GRUP WA (DINAMIS) --- */}
                                    {sekolah.link_grup_wa ? (
                                        <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                                            <p className="font-bold text-green-800 mb-3 text-sm">
                                                Silakan bergabung ke Grup WhatsApp untuk informasi kegiatan belajar mengajar:
                                            </p>
                                            <a 
                                                href={sekolah.link_grup_wa} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full shadow-lg transition-transform hover:scale-105 text-sm"
                                            >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                                                </svg>
                                                Bergabung ke Grup WhatsApp
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="bg-yellow-50 p-4 rounded-lg inline-block text-yellow-800 text-sm font-medium border border-yellow-200">
                                            Info Grup WhatsApp akan segera kami informasikan.
                                        </div>
                                    )}
                                </div>

                            /* --- KONDISI B: LULUS (MUNCUL TOMBOL DAFTAR ULANG) --- */
                            ) : activePendaftar.status === 'Lulus' ? (
                                <div className="bg-white rounded-2xl shadow-lg p-8 text-center border-t-4 border-green-500">
                                    <div className="mb-6 flex justify-center">
                                        <div className="p-4 bg-green-50 rounded-full">
                                            <svg className="w-16 h-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-3">Alhamdulillah, Selamat!</h3>
                                    <p className="text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed">
                                        Anda telah dinyatakan <strong>LULUS</strong> seleksi masuk RTQ Al-Yusra. 
                                        <br/>
                                        Silakan lakukan Registrasi Ulang untuk mengonfirmasi dan mengamankan kuota santri Anda.
                                    </p>
                                    
                                    <Link 
                                        href={route('daftar.ulang.show')} 
                                        className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full shadow-lg transition-transform hover:scale-105"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                        Lakukan Daftar Ulang Sekarang
                                    </Link>
                                    <p className="text-xs text-gray-400 mt-4">
                                        *Klik tombol di atas untuk mengunduh berkas dan finalisasi data.
                                    </p>
                                </div>

                            /* --- KONDISI C: TIDAK LULUS --- */
                            ) : activePendaftar.status === 'Tidak Lulus' ? (
                                <div className="bg-white rounded-2xl shadow-lg p-8 text-center border-t-4 border-red-500">
                                    <div className="mb-6 flex justify-center">
                                        <div className="p-4 bg-red-50 rounded-full">
                                            <svg className="w-16 h-16 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-3">Tetap Semangat!</h3>
                                    <p className="text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed">
                                        "Kegagalan bukanlah akhir dari segalanya, melainkan kesempatan untuk mencoba lagi dengan lebih baik."
                                        <br/><br/>
                                        Jangan berkecil hati. Allah pasti punya rencana terbaik untukmu.
                                    </p>
                                    
                                    <Link 
                                        href={route('pendaftaran')} 
                                        className="inline-flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full shadow-lg transition-transform hover:scale-105"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Daftar Lagi Sekarang
                                    </Link>
                                </div>

                            /* --- KONDISI D: MENUNGGU HASIL (PENGUMUMAN) --- */
                            ) : activePendaftar.status === 'Menunggu Hasil Pendaftaran' ? (
                                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border-l-4 border-blue-500">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                        </svg>
                                        Info Pengumuman
                                    </h3>
                                    <div className="bg-blue-50 rounded-xl p-8 text-center border border-blue-100">
                                        <p className="text-gray-600 mb-2 font-medium">Hasil seleksi akan diumumkan pada:</p>
                                        <p className="text-3xl md:text-4xl font-extrabold text-blue-700 my-4">
                                            {activePendaftar.tanggal_pengumuman_display || 'Segera'}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Silakan cek halaman ini secara berkala pada tanggal tersebut.
                                        </p>
                                    </div>
                                </div>

                            /* --- KONDISI E: DEFAULT (JADWAL UJIAN) --- */
                            ) : (
                                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                                    <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-2">Jadwal Ujian Masuk</h3>
                                    
                                    <div className="space-y-4">
                                        {/* Jika Lunas -> Tampilkan Jadwal */}
                                        {activePendaftar.status_pembayaran === 'Lunas' ? (
                                            <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 relative">
                                                <div className="absolute top-0 right-0 bg-green-600 text-white text-xs px-3 py-1 rounded-bl-lg rounded-tr-lg font-bold">
                                                    SIAP UJIAN
                                                </div>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <p className="text-xs text-gray-500 uppercase font-semibold">Kegiatan</p>
                                                        <p className="text-lg font-bold text-gray-800">Tes Masuk & Wawancara</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 uppercase font-semibold">Tanggal</p>
                                                        <p className="text-lg font-bold text-gray-800">
                                                            {activePendaftar.tanggal_ujian ? formatDate(activePendaftar.tanggal_ujian) : 'Jadwal Segera Terbit'}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 uppercase font-semibold">Waktu</p>
                                                        <p className="text-lg font-bold text-gray-800">
                                                            {activePendaftar.waktu_ujian ? activePendaftar.waktu_ujian + ' WIB' : '08:00 WIB'}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 uppercase font-semibold">Lokasi</p>
                                                        <p className="text-gray-800 font-medium">
                                                            {activePendaftar.lokasi_ujian || 'Gedung Utama RTQ Al-Yusra'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mt-6 pt-4 border-t flex justify-end">
                                                    <button onClick={() => window.print()} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-bold">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                                                        Cetak Kartu Ujian
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            /* Jika Belum Bayar */
                                            <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg text-yellow-800 border border-yellow-200">
                                                <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                                <div>
                                                    <p className="font-semibold">Menunggu Pembayaran</p>
                                                    <p className="text-sm mt-1">
                                                        Silakan selesaikan pembayaran untuk mendapatkan Jadwal Ujian secara otomatis.
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Materi Ujian (Hanya muncul jika ujian belum selesai) */}
                                    <div className="mt-8 pt-6 border-t border-dashed">
                                        <h4 className="font-semibold text-gray-800 mb-4">Materi Ujian:</h4>
                                        {activePendaftar.materi_ujian_program && activePendaftar.materi_ujian_program.length > 0 ? (
                                            <ul className="list-disc list-inside space-y-2 text-gray-600 text-sm">
                                                {activePendaftar.materi_ujian_program.map((item, index) => (
                                                    <li key={index}>{item}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <ul className="list-disc list-inside space-y-2 text-gray-600 text-sm">
                                                <li>Membaca Al-Qur'an (Tahsin)</li>
                                                <li>Hafalan Surat Pendek</li>
                                                <li>Wawancara</li>
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 3. KOLOM KANAN: DATA DIRI & RIWAYAT */}
                        <div className="space-y-8">
                            
                            {/* Card Data Diri */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Data Pendaftar</h3>
                                <div className="space-y-4 text-sm">
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase font-semibold">No. Pendaftaran</label>
                                        <p className="text-lg font-mono font-bold text-orange-600">{activePendaftar.no_pendaftaran}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase font-semibold">Nama Lengkap</label>
                                        <p className="font-medium text-gray-800">{activePendaftar.nama}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase font-semibold">Program</label>
                                        <p className="font-medium text-gray-800">{activePendaftar.program_nama}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase font-semibold">Status Pembayaran</label>
                                        <div className="mt-1">
                                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                                activePendaftar.status_pembayaran === 'Lunas' 
                                                ? 'bg-green-100 text-green-700' 
                                                : 'bg-red-100 text-red-700'
                                            }`}>
                                                {activePendaftar.status_pembayaran}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card Riwayat Pendaftaran */}
                            {pendaftarList && pendaftarList.length > 1 && (
                                <div className="bg-white rounded-2xl shadow-lg p-6 print:hidden">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Riwayat Pendaftaran</h3>
                                    <div className="flex flex-col gap-3">
                                        {pendaftarList.map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => setActivePendaftar(item)}
                                                className={`text-left p-3 rounded-lg border transition-all ${
                                                    activePendaftar.id === item.id 
                                                    ? 'bg-orange-50 border-orange-300 ring-1 ring-orange-300' 
                                                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                                }`}
                                            >
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-xs font-mono font-bold text-gray-500">
                                                        {item.no_pendaftaran}
                                                    </span>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                                                        item.status === 'Lulus' ? 'bg-green-100 text-green-700' :
                                                        item.status === 'Sudah Daftar Ulang' ? 'bg-green-100 text-green-700' :
                                                        item.status === 'Tidak Lulus' ? 'bg-red-100 text-red-700' :
                                                        item.status === 'Menunggu Hasil Pendaftaran' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                        {item.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm font-semibold text-gray-800">{item.program_nama}</p>
                                                <p className="text-xs text-gray-500 mt-1">{formatDate(item.created_at)}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>

                    </div>
                </div>
            </div>
        </AppLayout>
    );
}