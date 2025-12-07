import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function StatusPendaftaran({ auth, pendaftarList }) {
    
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

    // Jika data kosong
    if (!activePendaftar.no_pendaftaran) {
        return (
             <AppLayout auth={auth}>
                <div className="container mx-auto p-10 text-center">
                    <p className="text-gray-500">Data pendaftaran tidak ditemukan.</p>
                    <Link href={route('pendaftaran')} className="text-blue-600 hover:underline">
                        Daftar Baru
                    </Link>
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
                    
                    {/* 1. KARTU STATUS PENERIMAAN */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                        <div className="p-6 md:p-8 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Status Saat Ini
                            </h2>

                            {/* Logic Tampilan Status */}
                            <div className={`p-6 rounded-xl text-center border-2 transition-all duration-300 ${
                                activePendaftar.status === 'Lulus' ? 'bg-green-50 border-green-200' : 
                                activePendaftar.status === 'Tidak Lulus' ? 'bg-red-50 border-red-200' :
                                'bg-yellow-50 border-yellow-200'
                            }`}>
                                <p className="text-sm font-semibold uppercase tracking-wider mb-2 text-gray-500">
                                    Program: {activePendaftar.program_nama}
                                </p>
                                <h3 className={`text-3xl md:text-4xl font-extrabold mb-2 ${
                                    activePendaftar.status === 'Lulus' ? 'text-green-600' : 
                                    activePendaftar.status === 'Tidak Lulus' ? 'text-red-600' :
                                    'text-yellow-600'
                                }`}>
                                    {activePendaftar.status || 'MENUNGGU VERIFIKASI'}
                                </h3>
                                <p className="text-gray-600">
                                    {activePendaftar.status === 'Lulus' ? 'Selamat! Anda dinyatakan lulus seleksi.' : 
                                     activePendaftar.status === 'Tidak Lulus' ? 'Mohon maaf, Anda belum lulus seleksi.' :
                                     'Data Anda sedang diverifikasi oleh panitia atau menunggu hasil ujian.'}
                                </p>

                                {/* Tombol Bayar Muncul Jika Belum Lunas */}
                                {activePendaftar.status_pembayaran !== 'Lunas' && (
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
                        
                        {/* 2. KOLOM KIRI: JADWAL UJIAN */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                                <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-2">Jadwal Ujian Masuk</h3>
                                
                                <div className="space-y-4">
                                    
                                    {/* LOGIKA JADWAL OTOMATIS: JIKA LUNAS -> TAMPILKAN JADWAL */}
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
                                        /* JIKA BELUM BAYAR */
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

                                <div className="mt-8 pt-6 border-t border-dashed">
                                    <h4 className="font-semibold text-gray-800 mb-4">Materi Ujian:</h4>
                                    {/* Materi Ujian Dinamis */}
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
                                                        item.status === 'Tidak Lulus' ? 'bg-red-100 text-red-700' :
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