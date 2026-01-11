import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import Modal from '@/Components/Modal';

export default function Dashboard({ 
    stats = {}, 
    gender = { ikhwan: 0, akhwat: 0 }, 
    per_cabang = [], 
    per_program = [], 
    per_status = [],
    terbaru = [],
    chart_data = [],
    // --- Props Khusus Wali Santri ---
    progressHafalan = null, 
    attendanceStats = null, 
    setoranTerakhir = null
}) {
    const { auth } = usePage().props;
    const user = auth.user;
    const isLunas = auth.is_uang_masuk_lunas; 
    const tunggakanSpp = auth.spp_tunggakan || 0; 

    // State Modal Wali Santri
    const [showUangMasukModal, setShowUangMasukModal] = useState(false);
    const [showSppModal, setShowSppModal] = useState(false);

    // Effect Modal Wali Santri
    useEffect(() => {
        if (user.role === 'wali_santri') {
            if (!isLunas) {
                setShowUangMasukModal(true);
            } else if (tunggakanSpp > 0) {
                setShowSppModal(true);
            }
        }
    }, [user.role, isLunas, tunggakanSpp]);
    
    // Helper Functions
    const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num || 0);
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    const getPercent = (val) => stats.total_pendaftar > 0 ? (val / stats.total_pendaftar) * 100 : 0; 

    // Helper Untuk Chart Admin
    const getMaxChartVal = () => {
        if (!chart_data || chart_data.length === 0) return 10;
        return Math.max(...chart_data.map(c => Math.max(c.total_siswa, c.spp_count)));
    };
    const maxChartVal = getMaxChartVal();

    // Fallback logic untuk Wali
    const waliStats = attendanceStats || { Hadir: 0, Sakit: 0, Izin: 0, Alpha: 0 };

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            {user.role === 'wali_santri' ? (
                // =========================================================
                // 1. VIEW WALI SANTRI
                // =========================================================
                <div className="py-6">
                    <div className="max-w-7xl mx-auto space-y-6">
                        
                        {/* A. Welcome Card */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-xl">
                            <div className="p-6 text-gray-900 flex items-center gap-4">
                                <div className="bg-blue-100 p-3 rounded-full">
                                    <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold">Assalamu'alaikum, {user.name}!</h2>
                                    <p className="text-sm text-gray-500">Selamat datang di Sistem Informasi RTQ Al-Yusra.</p>
                                </div>
                            </div>
                        </div>

                        {/* B. Status Keuangan */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {!isLunas ? (
                                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-xl shadow-sm relative overflow-hidden">
                                    <div className="relative z-10">
                                        <h3 className="font-bold text-red-700 text-lg mb-2 flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                            Tanggungan Uang Masuk
                                        </h3>
                                        <p className="text-gray-700 text-sm mb-4">Mohon maaf, terdeteksi bahwa Anda belum melunasi tagihan Uang Masuk.</p>
                                        <Link href={route('wali.uang-masuk.index')} className="inline-flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-red-700 transition shadow-lg shadow-red-200">
                                            Bayar Sekarang <span aria-hidden="true">&rarr;</span>
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-xl shadow-sm relative overflow-hidden">
                                    <div className="relative z-10">
                                        <h3 className="font-bold text-green-700 text-lg mb-2 flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            Administrasi Tuntas
                                        </h3>
                                        <p className="text-gray-700 text-sm">Alhamdulillah, pembayaran Uang Masuk Anda telah <strong>LUNAS</strong>.</p>
                                    </div>
                                </div>
                            )}

                            {tunggakanSpp > 0 ? (
                                <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-xl shadow-sm relative overflow-hidden">
                                    <div className="relative z-10">
                                        <h3 className="font-bold text-orange-800 text-lg mb-2 flex items-center gap-2">
                                            <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            Tunggakan SPP ({tunggakanSpp} Bulan)
                                        </h3>
                                        <p className="text-gray-700 text-sm mb-4">Ada <strong>{tunggakanSpp} bulan</strong> tagihan SPP yang belum diselesaikan.</p>
                                        <Link href={route('spp.index')} className="inline-flex items-center gap-2 bg-orange-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-orange-700 transition shadow-lg shadow-orange-200">
                                            Cek & Bayar SPP <span aria-hidden="true">&rarr;</span>
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-xl shadow-sm">
                                    <h3 className="font-bold text-blue-700 text-lg mb-2 flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        SPP Lancar
                                    </h3>
                                    <p className="text-gray-700 text-sm">Terima kasih telah menunaikan kewajiban SPP bulan ini tepat waktu.</p>
                                </div>
                            )}
                        </div>

                        {/* C. RINGKASAN AKADEMIK (API) */}
                        {progressHafalan && attendanceStats ? (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
                                    <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2"><span>🎯</span> Progress Hafalan</h3>
                                    <div className="flex items-end gap-2 mb-2">
                                        <span className="text-4xl font-bold text-green-600">{progressHafalan.selesai}</span>
                                        <span className="text-gray-400 text-sm mb-1">/ 30 Juz</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                                        <div className="bg-green-500 h-3 rounded-full transition-all duration-1000" style={{ width: `${progressHafalan.persen}%` }}></div>
                                    </div>
                                    <p className="text-sm text-gray-500">Saat ini menghafal: <span className="font-bold text-gray-800">Juz {progressHafalan.sedang_hafal}</span></p>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2"><span>📖</span> Setoran Terakhir</h3>
                                    {setoranTerakhir ? (
                                        <div>
                                            <div className="text-xs text-gray-400 mb-1 font-mono uppercase">{formatDate(setoranTerakhir.tanggal)}</div>
                                            <div className="text-lg font-bold text-gray-800 flex items-center gap-2">Juz {setoranTerakhir.juz}</div>
                                            <div className="text-gray-600 text-sm font-medium">{setoranTerakhir.surah}</div>
                                            <div className="mt-3 inline-block bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full border border-blue-100 font-bold">Ayat {setoranTerakhir.ayat_awal} - {setoranTerakhir.ayat_akhir}</div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-4"><p className="text-gray-400 italic text-sm">Belum ada data setoran.</p></div>
                                    )}
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2"><span>📊</span> Total Kehadiran</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-green-50 p-3 rounded-lg text-center border border-green-100"><div className="font-bold text-green-700 text-xl">{waliStats.Hadir}</div><div className="text-[10px] uppercase text-green-600 font-bold tracking-wider">Hadir</div></div>
                                        <div className="bg-yellow-50 p-3 rounded-lg text-center border border-yellow-100"><div className="font-bold text-yellow-700 text-xl">{waliStats.Sakit}</div><div className="text-[10px] uppercase text-yellow-600 font-bold tracking-wider">Sakit</div></div>
                                        <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-100"><div className="font-bold text-blue-700 text-xl">{waliStats.Izin}</div><div className="text-[10px] uppercase text-blue-600 font-bold tracking-wider">Izin</div></div>
                                        <div className="bg-red-50 p-3 rounded-lg text-center border border-red-100"><div className="font-bold text-red-700 text-xl">{waliStats.Alpha}</div><div className="text-[10px] uppercase text-red-600 font-bold tracking-wider">Alpha</div></div>
                                    </div>
                                    <div className="mt-4 text-center"><Link href={route('wali.status.anak')} className="text-xs text-blue-600 hover:text-blue-800 hover:underline">Lihat Riwayat Lengkap &rarr;</Link></div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500 text-sm border border-dashed border-gray-300">
                                <span className="block mb-1">⏳ Sedang mengambil data akademik...</span>
                                <span className="text-xs text-gray-400">Pastikan server API (Port 8080) aktif.</span>
                            </div>
                        )}

                        <Modal show={showUangMasukModal} onClose={() => setShowUangMasukModal(false)}>
                            <div className="p-6 text-center">
                                <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-100 mb-5"><svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></div>
                                <h2 className="text-xl font-bold text-gray-900 mb-2">Tagihan Uang Masuk</h2>
                                <p className="text-sm text-gray-600 mb-8 px-4">Sistem mendeteksi bahwa Anda masih memiliki tagihan <strong>Uang Masuk</strong> yang belum diselesaikan.</p>
                                <div className="flex justify-center gap-3"><button onClick={() => setShowUangMasukModal(false)} className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm">Nanti Saja</button><Link href={route('wali.uang-masuk.index')} className="px-5 py-2.5 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition text-sm shadow-lg shadow-red-200">Lihat Tagihan</Link></div>
                            </div>
                        </Modal>
                        <Modal show={showSppModal} onClose={() => setShowSppModal(false)}>
                            <div className="p-6 text-center">
                                <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-orange-100 mb-5"><svg className="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                                <h2 className="text-xl font-bold text-gray-900 mb-2">Pemberitahuan SPP</h2>
                                <p className="text-sm text-gray-600 mb-8 px-4">Halo, tercatat ada <strong>{tunggakanSpp} bulan</strong> tagihan SPP yang belum dibayar.</p>
                                <div className="flex justify-center gap-3"><button onClick={() => setShowSppModal(false)} className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm">Mengerti</button><Link href={route('spp.index')} className="px-5 py-2.5 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition text-sm shadow-lg shadow-orange-200">Bayar SPP Sekarang</Link></div>
                            </div>
                        </Modal>
                    </div>
                </div>
            ) : user.role === 'keuangan' ? (
                // ==========================================
                // 2. VIEW ADMIN KEUANGAN
                // ==========================================
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                            <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Formulir Pendaftaran</h3>
                            <div className="mt-3 flex justify-between items-end">
                                <div><span className="text-3xl font-bold text-blue-600">{stats.formulir?.sudah || 0}</span><span className="text-xs text-gray-500 ml-1 font-medium">Lunas</span></div>
                                <div className="text-right"><span className="text-xl font-bold text-red-500">{stats.formulir?.belum || 0}</span><span className="text-xs text-gray-400 ml-1 block">Belum</span></div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                            <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Uang Masuk (Pangkal)</h3>
                            <div className="mt-3 flex justify-between items-end">
                                <div><span className="text-3xl font-bold text-green-600">{stats.uang_masuk?.sudah || 0}</span><span className="text-xs text-gray-500 ml-1 font-medium">Lunas</span></div>
                                <div className="text-right"><span className="text-xl font-bold text-red-500">{stats.uang_masuk?.belum || 0}</span><span className="text-xs text-gray-400 ml-1 block">Belum</span></div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-500">
                            <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Transaksi SPP (Lunas)</h3>
                            <div className="mt-3 flex items-end gap-2"><span className="text-4xl font-bold text-orange-600">{stats.spp_transaksi || 0}</span><span className="text-sm text-gray-400 mb-1">Kali Transaksi Masuk</span></div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800 text-lg">Monitoring Pembayaran Per Cabang</h3>
                            
                            {/* --- LEGENDA WARNA --- */}
                            <div className="flex gap-4 text-xs">
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 bg-gray-200 rounded-sm"></div>
                                    <span className="text-gray-500 font-medium">Total Siswa</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 bg-emerald-500 rounded-sm"></div>
                                    <span className="text-gray-500 font-medium">Lunas Uang Masuk</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 bg-orange-500 rounded-sm"></div>
                                    <span className="text-gray-500 font-medium">Bayar SPP Bulan Ini</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            {chart_data.length > 0 ? (
                                <div className="flex items-end justify-around space-x-2 md:space-x-8 h-64 border-b border-gray-200 pb-0">
                                    {chart_data.map((data, idx) => (
                                        <div key={idx} className="flex flex-col items-center group w-full h-full justify-end">
                                            <div className="flex gap-1 md:gap-2 items-end justify-center w-full h-full pb-2">
                                                
                                                {/* BATANG TOTAL SISWA & UANG MASUK */}
                                                <div className="relative w-8 md:w-16 bg-gray-200 rounded-t-sm overflow-hidden flex flex-col justify-end transition-all duration-500 group-hover:bg-gray-300" style={{ height: `${(data.total_siswa / maxChartVal) * 100}%` }}>
                                                    
                                                    {/* Tooltip Detail */}
                                                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-20 pointer-events-none shadow-lg">
                                                        <div className="font-bold border-b border-gray-600 pb-1 mb-1 text-center text-xs">{data.cabang}</div>
                                                        <div>Total Siswa: <span className="font-bold text-white">{data.total_siswa}</span></div>
                                                        <div className="text-emerald-300">Lunas Uang Masuk: <span className="font-bold">{data.uang_masuk_lunas}</span></div>
                                                        <div className="text-red-300">Belum Lunas: <span className="font-bold">{data.uang_masuk_belum}</span></div>
                                                    </div>

                                                    {/* Hijau (Lunas) */}
                                                    <div className="bg-emerald-500 w-full relative transition-all" style={{ height: `${data.total_siswa > 0 ? (data.uang_masuk_lunas / data.total_siswa) * 100 : 0}%` }}>
                                                        {data.uang_masuk_lunas > 0 && (data.uang_masuk_lunas / data.total_siswa) > 0.2 && (
                                                            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] text-white font-bold">{data.uang_masuk_lunas}</span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* BATANG SPP */}
                                                <div className="relative w-8 md:w-16 bg-orange-100 rounded-t-sm flex flex-col justify-end transition-all duration-500" style={{ height: `${(data.spp_count / maxChartVal) * 100}%` }}>
                                                    <div className="bg-orange-500 w-full hover:bg-orange-600 transition-all h-full"></div>
                                                    
                                                    {/* Angka SPP selalu di atas */}
                                                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-orange-600 font-bold bg-white px-1.5 py-0.5 rounded shadow-sm border border-orange-100">
                                                        {data.spp_count}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="mt-2 text-[10px] md:text-xs font-bold text-gray-600 text-center truncate w-20 md:w-24 border-t border-transparent pt-1 group-hover:border-gray-300">{data.cabang}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-400 italic py-10">Belum ada data cabang untuk ditampilkan.</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center"><h3 className="font-bold text-gray-800">Transaksi Masuk Terakhir</h3></div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50"><tr><th className="px-6 py-3">Tanggal</th><th className="px-6 py-3">Santri</th><th className="px-6 py-3">Jenis</th><th className="px-6 py-3 text-right">Nominal</th><th className="px-6 py-3 text-center">Status</th></tr></thead>
                                <tbody>
                                    {terbaru.length > 0 ? terbaru.map((item, idx) => (
                                        <tr key={idx} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-3">{formatDate(item.created_at)}</td>
                                            <td className="px-6 py-3 font-medium text-gray-800">{item.nama}</td>
                                            <td className="px-6 py-3">{item.jenis}</td>
                                            <td className="px-6 py-3 text-right font-bold text-gray-700">{formatRupiah(item.nominal || 0)}</td>
                                            <td className="px-6 py-3 text-center"><span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold">{item.status}</span></td>
                                        </tr>
                                    )) : <tr><td colSpan="5" className="text-center py-6 text-gray-400">Belum ada transaksi.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                // ==========================================
                // 3. VIEW ADMIN PSB (DEFAULT)
                // ==========================================
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-600">
                            <p className="text-sm text-gray-500 font-medium">Total Pendaftar</p><h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.total_pendaftar}</h3><p className="text-xs text-blue-600 mt-2 font-semibold">+{stats.hari_ini} Hari ini</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                            <p className="text-sm text-gray-500 font-medium">Lulus / Santri Aktif</p><h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.total_lulus}</h3><p className="text-xs text-green-600 mt-2 font-semibold">{getPercent(stats.total_lulus).toFixed(1)}% Konversi</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
                            <p className="text-sm text-gray-500 font-medium">Demografi</p>
                            <div className="flex items-end justify-between mt-2">
                                <div className="text-center"><span className="text-2xl font-bold text-blue-700">{gender.ikhwan}</span><p className="text-[10px] uppercase text-gray-400 font-bold">Ikhwan</p></div>
                                <div className="text-gray-300 mb-2">VS</div>
                                <div className="text-center"><span className="text-2xl font-bold text-pink-600">{gender.akhwat}</span><p className="text-[10px] uppercase text-gray-400 font-bold">Akhwat</p></div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-500">
                            <p className="text-sm text-gray-500 font-medium">Total Pendapatan</p><h3 className="text-xl font-bold text-gray-800 mt-2">{formatRupiah(stats.total_pendapatan)}</h3><p className="text-xs text-gray-400 mt-1">Dari pembayaran lunas</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50"><h3 className="font-bold text-gray-700">Distribusi Cabang</h3><span className="text-xs bg-white border px-2 py-1 rounded text-gray-500">{per_cabang.length} Cabang</span></div>
                            <div className="p-6 space-y-4 max-h-80 overflow-y-auto custom-scrollbar">
                                {per_cabang.map((cabang, idx) => (
                                    <div key={idx}><div className="flex justify-between text-sm mb-1"><span className="font-medium text-gray-700">{cabang.cabang}</span><span className="font-bold text-gray-900">{cabang.total}</span></div><div className="w-full bg-gray-100 rounded-full h-2.5"><div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${getPercent(cabang.total)}%` }}></div></div></div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50"><h3 className="font-bold text-gray-700">Minat Program</h3><span className="text-xs bg-white border px-2 py-1 rounded text-gray-500">{per_program.length} Program</span></div>
                            <div className="p-6 space-y-4 max-h-80 overflow-y-auto custom-scrollbar">
                                {per_program.map((prog, idx) => (
                                    <div key={idx}><div className="flex justify-between text-sm mb-1"><span className="font-medium text-gray-700">{prog.program_nama}</span><span className="font-bold text-gray-900">{prog.total}</span></div><div className="w-full bg-gray-100 rounded-full h-2.5"><div className="bg-orange-500 h-2.5 rounded-full" style={{ width: `${getPercent(prog.total)}%` }}></div></div></div>
                                ))}
                                {per_program.length === 0 && <p className="text-center text-gray-400 text-sm">Belum ada data program.</p>}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-fit">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50"><h3 className="font-bold text-gray-700">Rincian Status</h3></div>
                            <div className="p-4">
                                <div className="grid grid-cols-1 gap-3">
                                    {per_status.map((stat, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition">
                                            <div className="flex items-center gap-3"><div className={`w-3 h-3 rounded-full ${stat.status === 'Lulus' ? 'bg-green-500' : 'bg-blue-500'}`}></div><span className="text-sm text-gray-600">{stat.status}</span></div>
                                            <span className="text-sm font-bold text-gray-800 bg-white border px-2 py-0.5 rounded shadow-sm">{stat.total}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50"><h3 className="font-bold text-gray-700">Pendaftar Terbaru</h3><Link href={route('psb.pendaftaran.index')} className="text-xs font-bold text-blue-600 hover:underline">Lihat Semua</Link></div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50"><tr><th className="px-6 py-3">Nama</th><th className="px-6 py-3">Program/Cabang</th><th className="px-6 py-3 text-center">JK</th><th className="px-6 py-3 text-center">Status</th></tr></thead>
                                    <tbody>
                                        {terbaru.length > 0 ? terbaru.map((item) => (
                                            <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                                                <td className="px-6 py-3"><div className="font-bold text-gray-800">{item.nama}</div><div className="text-xs text-gray-400">{formatDate(item.created_at)}</div></td>
                                                <td className="px-6 py-3"><div className="text-gray-700">{item.program_nama}</div><div className="text-xs text-gray-400">{item.cabang}</div></td>
                                                <td className="px-6 py-3 text-center"><span className={`px-2 py-0.5 text-[10px] font-bold rounded ${item.jenis_kelamin === 'Laki-laki' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>{item.jenis_kelamin === 'Laki-laki' ? 'L' : 'P'}</span></td>
                                                <td className="px-6 py-3 text-center"><span className={`px-2 py-1 text-xs rounded-full font-bold ${item.status === 'Lulus' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{item.status}</span></td>
                                            </tr>
                                        )) : <tr><td colSpan="4" className="text-center py-6 text-gray-400">Belum ada data.</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}