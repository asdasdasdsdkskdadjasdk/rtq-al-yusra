import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import NotificationDropdown from '@/Components/NotificationDropdown'; // Import Notifikasi

export default function Dashboard({
    stats = {},
    gender = { ikhwan: 0, akhwat: 0 },
    per_cabang = [],
    per_program = [],
    per_status = [],
    terbaru = [],
    chart_data = [],
    monthly_chart_data = [], // NEW
    per_beasiswa = { beasiswa: 0, reguler: 0 }, // NEW
    spp_tunggakan_per_cabang = [],
    // --- Props Khusus Wali Santri ---
    progressHafalan = null,
    attendanceStats = null,
    setoranTerakhir = null
}) {
    const { auth } = usePage().props;
    const user = auth.user;
    const isLunas = auth.is_uang_masuk_lunas;
    const tunggakanSpp = auth.spp_tunggakan || 0;
    const isDaftarUlangPending = auth.belum_lunas_daftar_ulang; // NEW

    // Ambil Data Notifikasi
    const { notifications, unreadCount } = auth;

    // State Modal Wali Santri
    const [showUangMasukModal, setShowUangMasukModal] = useState(false);
    const [showSppModal, setShowSppModal] = useState(false);
    const [showDaftarUlangModal, setShowDaftarUlangModal] = useState(false); // NEW

    // State Modal Detail Tunggakan (Keuangan)
    const [tunggakanDetail, setTunggakanDetail] = useState(null);
    const [showTunggakanModal, setShowTunggakanModal] = useState(false);

    // Effect Modal Wali Santri
    useEffect(() => {
        if (user.role && user.role.toLowerCase() === 'wali_santri') {
            if (!isLunas) {
                setShowUangMasukModal(true);
            } else if (isDaftarUlangPending) { // Priority 2
                setShowDaftarUlangModal(true);
            } else if (tunggakanSpp > 0) {
                setShowSppModal(true);
            }
        }
    }, [user.role, isLunas, tunggakanSpp, isDaftarUlangPending]);

    // ... (rest of helper functions)

    // ... (inside return)



    // Helper Helper
    const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num || 0);
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    const getPercent = (val) => stats.total_pendaftar > 0 ? (val / stats.total_pendaftar) * 100 : 0;

    // Helper Untuk Chart Admin
    const getMaxChartVal = () => {
        if (!monthly_chart_data || monthly_chart_data.length === 0) return 10;
        return Math.max(...monthly_chart_data.map(c => Math.max(c.total_siswa, c.paid_count)));
    };
    const maxChartVal = getMaxChartVal();

    // Fallback logic untuk Wali
    const waliStats = attendanceStats || { Hadir: 0, Sakit: 0, Izin: 0, Alpha: 0 };

    const safeRole = user.role ? user.role.toLowerCase() : 'guest';

    return (
        <AuthenticatedLayout user={user}>
            <Head title="Dashboard" />

            {safeRole === 'wali_santri' ? (
                // =========================================================
                // 1. VIEW WALI SANTRI (UPDATED - ORANGE/GREEN THEME)
                // =========================================================
                <div className="py-6">
                    <div className="max-w-7xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8">
                        {/* HEADER DASHBOARD DENGAN NOTIFIKASI */}
                        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow mb-6">
                            <h2 className="text-lg font-semibold text-gray-800">Dashboard Overview</h2>

                            {/* Komponen Lonceng Muncul Disini */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500 mr-2 hidden sm:inline">Pemberitahuan:</span>
                                <NotificationDropdown notifications={notifications} count={unreadCount} />
                            </div>
                        </div>

                        {/* A. Welcome Card */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-xl">
                            <div className="p-6 text-gray-900 flex items-center gap-4">
                                <div className="bg-orange-100 p-3 rounded-full">
                                    <svg className="w-8 h-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold">Assalamu'alaikum, {user.name}!</h2>
                                    <p className="text-sm text-gray-500">Selamat datang di Sistem Informasi RTQ Al-Yusra.</p>
                                </div>
                            </div>
                        </div>

                        {/* B. Status Keuangan (UPDATED: 3 COLUMNS) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* 1. Uang Masuk */}
                            {!isLunas ? (
                                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-xl shadow-sm relative overflow-hidden">
                                    <div className="relative z-10">
                                        <h3 className="font-bold text-red-700 text-lg mb-2 flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                            Uang Masuk
                                        </h3>
                                        <p className="text-gray-700 text-sm mb-4">Belum Lunas. Segera selesaikan pembayaran.</p>
                                        <Link href={route('wali.uang-masuk.index')} className="text-sm font-bold text-red-700 hover:underline">
                                            Bayar Sekarang &rarr;
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-xl shadow-sm relative overflow-hidden">
                                    <div className="relative z-10">
                                        <h3 className="font-bold text-green-700 text-lg mb-2 flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            Uang Masuk
                                        </h3>
                                        <p className="text-gray-700 text-sm">Alhamdulillah, Lunas.</p>
                                    </div>
                                </div>
                            )}

                            {/* 2. SPP */}
                            {tunggakanSpp > 0 ? (
                                <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-xl shadow-sm relative overflow-hidden">
                                    <div className="relative z-10">
                                        <h3 className="font-bold text-orange-800 text-lg mb-2 flex items-center gap-2">
                                            <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            SPP ({tunggakanSpp} Bulan)
                                        </h3>
                                        <p className="text-gray-700 text-sm mb-4">Ada tunggakan SPP yang belum dibayar.</p>
                                        <Link href={route('wali.spp.index')} className="text-sm font-bold text-orange-700 hover:underline">
                                            Bayar SPP &rarr;
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-xl shadow-sm">
                                    <h3 className="font-bold text-green-700 text-lg mb-2 flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        SPP Lancar
                                    </h3>
                                    <p className="text-gray-700 text-sm">Terima kasih, pembayaran SPP lancar.</p>
                                </div>
                            )}

                            {/* 3. Daftar Ulang (Tahun Ajaran Baru) */}
                            {isDaftarUlangPending ? (
                                <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-xl shadow-sm relative overflow-hidden">
                                    <div className="relative z-10">
                                        <h3 className="font-bold text-orange-800 text-lg mb-2 flex items-center gap-2">
                                            <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            Daftar Ulang
                                        </h3>
                                        <p className="text-gray-700 text-sm mb-4">Tagihan Daftar Ulang belum diselesaikan.</p>
                                        <Link href={route('wali.daftar-ulang.index')} className="text-sm font-bold text-orange-700 hover:underline">
                                            Bayar Sekarang &rarr;
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-xl shadow-sm">
                                    <h3 className="font-bold text-green-700 text-lg mb-2 flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        Daftar Ulang
                                    </h3>
                                    <p className="text-gray-700 text-sm">Aktif / Tidak ada tagihan.</p>
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
                                            <div className="mt-3 inline-block bg-orange-50 text-orange-700 text-xs px-3 py-1 rounded-full border border-orange-100 font-bold">Ayat {setoranTerakhir.ayat_awal} - {setoranTerakhir.ayat_akhir}</div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-4"><p className="text-gray-400 italic text-sm">Belum ada data setoran.</p></div>
                                    )}
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2"><span>📊</span> Total Kehadiran</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 rounded-lg text-center border border-gray-100 hover:bg-green-50 transition">
                                            <div className="font-bold text-green-600 text-3xl">{waliStats.Hadir}</div>
                                            <div className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Hadir</div>
                                        </div>
                                        <div className="p-3 rounded-lg text-center border border-gray-100 hover:bg-yellow-50 transition">
                                            <div className="font-bold text-yellow-600 text-3xl">{waliStats.Sakit}</div>
                                            <div className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Sakit</div>
                                        </div>
                                        <div className="p-3 rounded-lg text-center border border-gray-100 hover:bg-blue-50 transition">
                                            <div className="font-bold text-blue-600 text-3xl">{waliStats.Izin}</div>
                                            <div className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Izin</div>
                                        </div>
                                        <div className="p-3 rounded-lg text-center border border-gray-100 hover:bg-red-50 transition">
                                            <div className="font-bold text-red-600 text-3xl">{waliStats.Alpha}</div>
                                            <div className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Alpha</div>
                                        </div>
                                    </div>
                                    <div className="mt-4 text-center"><Link href={route('wali.status.anak')} className="text-xs text-orange-600 hover:text-orange-800 hover:underline">Lihat Riwayat Lengkap &rarr;</Link></div>
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
                                <div className="flex justify-center gap-3"><button onClick={() => setShowSppModal(false)} className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm">Mengerti</button><Link href={route('wali.spp.index')} className="px-5 py-2.5 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition text-sm shadow-lg shadow-orange-200">Bayar SPP Sekarang</Link></div>
                            </div>
                        </Modal>
                    </div>
                </div >
            ) : safeRole === 'keuangan' ? (
                // ==========================================
                // 2. VIEW ADMIN KEUANGAN (UPDATED - ORANGE/GREEN THEME)
                // ==========================================
                <div className="py-6 px-4 sm:px-6 lg:px-8 space-y-6 max-w-7xl mx-auto">

                    {/* Header Notifikasi Admin */}
                    <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow mb-6">
                        <h2 className="text-lg font-semibold text-gray-800">Dashboard Keuangan</h2>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500 mr-2">Tugas / Verifikasi:</span>
                            <NotificationDropdown notifications={notifications} count={unreadCount} />
                        </div>
                    </div>

                    {/* NEW: REVENUE CARDS (RESTORED) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                            <p className="text-sm text-gray-500 font-medium font-bold uppercase tracking-wider">Pendapatan Bulan Ini</p>
                            <h3 className="text-2xl font-bold text-gray-800 mt-2">{formatRupiah(stats.pendapatan_bulan_ini)}</h3>
                            <p className="text-xs text-green-600 mt-1">SPP + Uang Masuk</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-500">
                            <p className="text-sm text-gray-500 font-medium font-bold uppercase tracking-wider">Pendapatan Tahun Ini</p>
                            <h3 className="text-2xl font-bold text-gray-800 mt-2">{formatRupiah(stats.pendapatan_tahun_ini)}</h3>
                            <p className="text-xs text-orange-600 mt-1">Akumulasi Tahun Berjalan</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-400">
                            <p className="text-sm text-gray-500 font-medium font-bold uppercase tracking-wider">Transaksi SPP (Bulan Ini)</p>
                            <h3 className="text-2xl font-bold text-gray-800 mt-2">{stats.spp_transaksi || 0} <span className="text-sm font-normal text-gray-500">Transaksi</span></h3>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-400">
                            <p className="text-sm text-gray-500 font-medium font-bold uppercase tracking-wider">Uang Masuk (Lunas)</p>
                            <div className="flex items-end gap-2 mt-2">
                                <span className="text-2xl font-bold text-gray-800">{stats.uang_masuk?.sudah || 0}</span>
                                <span className="text-xs text-gray-400 mb-1">Santri</span>
                            </div>
                        </div>
                    </div>

                    {/* CHART SECTION: RE-ARRANGED AS PER REQUEST */}

                    {/* 1. MONITORING PER CABANG (FULL WIDTH - ATAS) */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800 text-lg">Monitoring Keuangan Per Cabang</h3>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-6 mb-4 justify-center text-xs font-bold text-gray-500">
                                <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-gray-200 rounded-sm"></div> Total Siswa</div>
                                <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-green-500 rounded-sm"></div> SPP Lunas</div>
                            </div>
                            {chart_data.length > 0 ? (
                                <div className="flex items-end justify-around space-x-2 md:space-x-8 h-64 border-b border-gray-200 pb-0">
                                    {chart_data.map((data, idx) => (
                                        <div key={idx} className="flex flex-col items-center group w-full h-full justify-end">
                                            <div className="flex gap-1 md:gap-4 items-end justify-center w-full h-full pb-2">
                                                {/* Bar 1: Total Siswa */}
                                                <div className="relative w-6 md:w-12 bg-gray-200 rounded-t-sm flex flex-col justify-end group-hover:bg-gray-300 transition-all" style={{ height: `${(data.total_siswa / maxChartVal) * 100}%` }}>
                                                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 font-bold opacity-0 group-hover:opacity-100 transition">{data.total_siswa}</span>
                                                </div>
                                                {/* Bar 2: SPP Lunas */}
                                                <div className="relative w-6 md:w-12 bg-green-100 rounded-t-sm flex flex-col justify-end transition-all" style={{ height: `${(data.spp_count / maxChartVal) * 100}%` }}>
                                                    <div className="bg-green-500 w-full rounded-t-sm hover:bg-green-600 transition-all h-full"></div>
                                                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-green-600 font-bold opacity-0 group-hover:opacity-100 transition">{data.spp_count}</span>
                                                </div>
                                            </div>
                                            <p className="mt-2 text-[10px] md:text-xs font-bold text-gray-600 text-center truncate w-20 md:w-24 border-t border-transparent pt-1 group-hover:border-gray-300">{data.cabang}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-400 italic py-10">Belum ada data cabang.</p>
                            )}
                        </div>
                    </div>

                    {/* 2. GRID BAWAH: BULANAN & TUNGGAKAN */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* LEFT: MONITORING PEMBAYARAN BULANAN */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                <h3 className="font-bold text-gray-800 text-lg">Monitoring Pembayaran Bulanan</h3>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-6 mb-4 justify-center text-xs font-bold text-gray-500">
                                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-gray-200 rounded-sm"></div> Total Siswa</div>
                                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-orange-500 rounded-sm"></div> Sudah Bayar</div>
                                </div>
                                {monthly_chart_data.length > 0 ? (
                                    <div className="flex items-end justify-around space-x-2 md:space-x-4 h-64 border-b border-gray-200 pb-0">
                                        {monthly_chart_data.map((data, idx) => (
                                            <div key={idx} className="flex flex-col items-center group w-full h-full justify-end">
                                                <div className="flex gap-0.5 md:gap-1 items-end justify-center w-full h-full pb-2 relative">

                                                    {/* Bar 1: Total Siswa */}
                                                    <div className="w-2 md:w-6 bg-gray-200 rounded-t-sm flex flex-col justify-end group-hover:bg-gray-300 transition-all cursor-pointer" style={{ height: `${(data.total_siswa / maxChartVal) * 100}%` }}>
                                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">{data.total_siswa} Ssw</div>
                                                    </div>

                                                    {/* Bar 2: SPP Lunas */}
                                                    <div className="w-2 md:w-6 bg-orange-100 rounded-t-sm flex flex-col justify-end transition-all cursor-pointer" style={{ height: `${(data.paid_count / maxChartVal) * 100}%` }}>
                                                        <div className="bg-orange-500 w-full rounded-t-sm hover:bg-orange-600 transition-all h-full"></div>
                                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-orange-600 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10 bottom-0 mb-8">{data.paid_count} Byr</div>
                                                    </div>
                                                </div>
                                                <p className="mt-2 text-[10px] md:text-xs font-bold text-gray-600 text-center truncate w-full border-t border-transparent pt-1 group-hover:border-gray-300">{data.bulan}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-400 italic py-10">Belum ada data bulanan.</p>
                                )}
                            </div>
                        </div>

                        {/* RIGHT: TUNGGAKAN SPP PER CABANG */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                                <h3 className="font-bold text-gray-800 text-lg">Tunggakan SPP Bulan Ini (Per Cabang)</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3">Cabang</th>
                                            <th className="px-6 py-3 text-center">Siswa Aktif</th>
                                            <th className="px-6 py-3 text-center">Belum Bayar</th>
                                            <th className="px-6 py-3 text-center">% Tunggakan</th>
                                            <th className="px-6 py-3 text-center">Detail</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Perlu prop spp_tunggakan_per_cabang dari controller */}
                                        {spp_tunggakan_per_cabang && spp_tunggakan_per_cabang.length > 0 ? (
                                            spp_tunggakan_per_cabang.map((item, idx) => (
                                                <tr key={idx} className="bg-white border-b hover:bg-gray-50">
                                                    <td className="px-6 py-3 font-medium text-gray-900">{item.cabang}</td>
                                                    <td className="px-6 py-3 text-center">{item.total_siswa}</td>
                                                    <td className="px-6 py-3 text-center font-bold text-red-600">{item.belum_bayar}</td>
                                                    <td className="px-6 py-3 text-center">
                                                        <span className={`px-2 py-1 rounded text-xs font-bold ${item.persen_tunggakan > 50 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                                                            {item.persen_tunggakan.toFixed(1)}%
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-3 text-center">
                                                        {item.belum_bayar > 0 ? (
                                                            <button onClick={() => { setTunggakanDetail(item); setShowTunggakanModal(true); }} className="text-orange-600 hover:text-orange-800 underline text-xs font-bold">
                                                                Lihat Detail
                                                            </button>
                                                        ) : <span className="text-gray-300 text-xs">-</span>}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan="5" className="text-center py-6 text-gray-400">Data tidak tersedia atau semua lunas.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>

                    {/* TRANSAKSI TERAKHIR */}
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
                                            <td className="px-6 py-3 text-center"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">{item.status}</span></td>
                                        </tr>
                                    )) : <tr><td colSpan="5" className="text-center py-6 text-gray-400">Belum ada transaksi.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                // ==========================================
                // 3. VIEW ADMIN PSB (DEFAULT) - FULL ORANGE THEME
                // ==========================================
                <div className="py-6 px-4 sm:px-6 lg:px-8 space-y-6 max-w-7xl mx-auto">

                    {/* Header Notifikasi Admin PSB */}
                    <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow mb-6">
                        <h2 className="text-lg font-semibold text-gray-800">Dashboard PSB (Tahun Ini)</h2>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500 mr-2">Pendaftar Baru:</span>
                            <NotificationDropdown notifications={notifications} count={unreadCount} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-600">
                            <p className="text-sm text-gray-500 font-medium font-bold uppercase tracking-wider">Total Pendaftar</p><h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.total_pendaftar}</h3><p className="text-xs text-orange-600 mt-2 font-semibold">+{stats.hari_ini} Hari ini</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-500">
                            <p className="text-sm text-gray-500 font-medium font-bold uppercase tracking-wider">Lulus / Santri Aktif</p><h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.total_lulus}</h3><p className="text-xs text-orange-600 mt-2 font-semibold">{getPercent(stats.total_lulus).toFixed(1)}% Konversi</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-400">
                            <p className="text-sm text-gray-500 font-medium font-bold uppercase tracking-wider">Demografi</p>
                            <div className="flex items-end justify-between mt-2">
                                <div className="text-center"><span className="text-2xl font-bold text-orange-700">{gender.ikhwan}</span><p className="text-[10px] uppercase text-gray-400 font-bold">Ikhwan</p></div>
                                <div className="text-gray-300 mb-2">VS</div>
                                <div className="text-center"><span className="text-2xl font-bold text-orange-500">{gender.akhwat}</span><p className="text-[10px] uppercase text-gray-400 font-bold">Akhwat</p></div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-300">
                            <p className="text-sm text-gray-500 font-medium font-bold uppercase tracking-wider">Beasiswa vs Reguler</p>
                            <div className="flex items-end justify-between mt-2">
                                <div className="text-center"><span className="text-2xl font-bold text-orange-600">{per_beasiswa.beasiswa}</span><p className="text-[10px] uppercase text-gray-400 font-bold">Beasiswa</p></div>
                                <div className="text-gray-300 mb-2">VS</div>
                                <div className="text-center"><span className="text-2xl font-bold text-orange-800">{per_beasiswa.reguler}</span><p className="text-[10px] uppercase text-gray-400 font-bold">Reguler</p></div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50"><h3 className="font-bold text-gray-700">Distribusi Cabang</h3><span className="text-xs bg-white border px-2 py-1 rounded text-gray-500">{per_cabang.length} Cabang</span></div>
                            <div className="p-6 space-y-4 max-h-80 overflow-y-auto custom-scrollbar">
                                {per_cabang.map((cabang, idx) => (
                                    <div key={idx}><div className="flex justify-between text-sm mb-1"><span className="font-medium text-gray-700">{cabang.cabang}</span><span className="font-bold text-gray-900">{cabang.total}</span></div><div className="w-full bg-gray-100 rounded-full h-2.5"><div className="bg-orange-500 h-2.5 rounded-full" style={{ width: `${getPercent(cabang.total)}%` }}></div></div></div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50"><h3 className="font-bold text-gray-700">Minat Program</h3><span className="text-xs bg-white border px-2 py-1 rounded text-gray-500">{per_program.length} Program</span></div>
                            <div className="p-6 space-y-4 max-h-80 overflow-y-auto custom-scrollbar">
                                {per_program.map((prog, idx) => (
                                    <div key={idx}><div className="flex justify-between text-sm mb-1"><span className="font-medium text-gray-700">{prog.program_nama}</span><span className="font-bold text-gray-900">{prog.total}</span></div><div className="w-full bg-gray-100 rounded-full h-2.5"><div className="bg-orange-300 h-2.5 rounded-full" style={{ width: `${getPercent(prog.total)}%` }}></div></div></div>
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
                                    {per_status.length > 0 ? per_status.map((stat, idx) => {
                                        // Custom Color Logic for Status (Orange Theme with Green for Success)
                                        let dotColor = 'bg-gray-400';
                                        if (stat.status === 'Lulus' || stat.status === 'LULUS' || stat.status === 'Diterima') dotColor = 'bg-green-500';
                                        else if (stat.status === 'Menunggu' || stat.status === 'Baru') dotColor = 'bg-orange-500';
                                        else if (stat.status === 'Ditolak' || stat.status === 'Gagal') dotColor = 'bg-orange-800'; // Make error unified or dark orange? User said "status tidak apa beda". But dashboard "full orange". 
                                        // Let's keep status semantics but use Orange-ish where possible or standard Red for Failure
                                        else dotColor = 'bg-orange-300';

                                        return (
                                            <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition">
                                                <div className="flex items-center gap-3"><div className={`w-3 h-3 rounded-full ${dotColor}`}></div><span className="text-sm text-gray-600">{stat.status}</span></div>
                                                <span className="text-sm font-bold text-gray-800 bg-white border px-2 py-0.5 rounded shadow-sm">{stat.total}</span>
                                            </div>
                                        )
                                    }) : <p className="text-center text-gray-400 italic text-sm">Belum ada data status.</p>}
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50"><h3 className="font-bold text-gray-700">Pendaftar Terbaru (Tahun Ini)</h3><Link href={route('psb.pendaftaran.index')} className="text-xs font-bold text-orange-600 hover:underline">Lihat Semua</Link></div>
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
                                        )) : <tr><td colSpan="4" className="text-center py-6 text-gray-400">Belum ada data pendaftar baru tahun ini.</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Detail Tunggakan */}
            <Modal show={showTunggakanModal} onClose={() => setShowTunggakanModal(false)}>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-900">
                            Detail Tunggakan - {tunggakanDetail?.cabang}
                        </h3>
                        <button onClick={() => setShowTunggakanModal(false)} className="text-gray-400 hover:text-gray-500">
                            <span className="sr-only">Close</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <div className="overflow-y-auto max-h-96">
                        {tunggakanDetail?.list_siswa && tunggakanDetail.list_siswa.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50"><tr><th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Santri</th></tr></thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {tunggakanDetail.list_siswa.map((siswa, idx) => (
                                        <tr key={idx}><td className="px-4 py-2 text-sm text-gray-900">{siswa.nama}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-center text-gray-500 italic py-4">Tidak ada data nama.</p>
                        )}
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button onClick={() => setShowTunggakanModal(false)} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200">Tutup</button>
                    </div>
                </div>
            </Modal>

            <Modal show={showUangMasukModal} onClose={() => setShowUangMasukModal(false)}>
                <div className="p-6 text-center">
                    <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-100 mb-5"><svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Tagihan Uang Masuk</h2>
                    <p className="text-sm text-gray-600 mb-8 px-4">Sistem mendeteksi bahwa Anda masih memiliki tagihan <strong>Uang Masuk</strong> yang belum diselesaikan.</p>
                    <div className="flex justify-center gap-3"><button onClick={() => setShowUangMasukModal(false)} className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm">Nanti Saja</button><Link href={route('wali.uang-masuk.index')} className="px-5 py-2.5 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition text-sm shadow-lg shadow-red-200">Lihat Tagihan</Link></div>
                </div>
            </Modal>

            <Modal show={showDaftarUlangModal} onClose={() => setShowDaftarUlangModal(false)}>
                <div className="p-6 text-center">
                    <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-orange-100 mb-5"><svg className="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Tagihan Daftar Ulang Tahunan</h2>
                    <p className="text-sm text-gray-600 mb-8 px-4">Halo, Anda memiliki tagihan <strong>Daftar Ulang</strong> tahun ini yang belum diselesaikan. Silakan lakukan pembayaran agar status santri tetap aktif.</p>
                    <div className="flex justify-center gap-3"><button onClick={() => setShowDaftarUlangModal(false)} className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm">Mengerti</button><Link href={route('wali.daftar-ulang.index')} className="px-5 py-2.5 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition text-sm shadow-lg shadow-orange-200">Bayar Sekarang</Link></div>
                </div>
            </Modal>

            <Modal show={showSppModal} onClose={() => setShowSppModal(false)}>
                <div className="p-6 text-center">
                    <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-orange-100 mb-5"><svg className="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Pemberitahuan SPP</h2>
                    <p className="text-sm text-gray-600 mb-8 px-4">Halo, tercatat ada <strong>{tunggakanSpp} bulan</strong> tagihan SPP yang belum dibayar.</p>
                    <div className="flex justify-center gap-3"><button onClick={() => setShowSppModal(false)} className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm">Mengerti</button><Link href={route('wali.spp.index')} className="px-5 py-2.5 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition text-sm shadow-lg shadow-orange-200">Bayar SPP Sekarang</Link></div>
                </div>
            </Modal>
        </AuthenticatedLayout >
    );
}