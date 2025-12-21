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
    chart_data = [] // Data visualisasi untuk Keuangan
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
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    const getPercent = (val) => stats.total_pendaftar > 0 ? (val / stats.total_pendaftar) * 100 : 0; 

    // Helper Untuk Chart (Mencari nilai tertinggi agar bar tidak mentok)
    const getMaxChartVal = () => {
        if (!chart_data || chart_data.length === 0) return 10;
        return Math.max(...chart_data.map(c => Math.max(c.total_siswa, c.spp_count)));
    };
    const maxChartVal = getMaxChartVal();

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            {/* ==================================================================================
                LOGIC TAMPILAN BERDASARKAN ROLE
                1. Wali Santri
                2. Keuangan (BARU - DENGAN VISUALISASI)
                3. Admin/PSB (Default)
               ================================================================================== */}
            
            {user.role === 'wali_santri' ? (
                // --- 1. VIEW WALI SANTRI (TIDAK DIUBAH) ---
                <div className="py-6">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {/* Welcome Card */}
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

                        {/* Status Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Status Uang Masuk */}
                            {!isLunas ? (
                                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-xl shadow-sm relative overflow-hidden">
                                    <div className="relative z-10">
                                        <h3 className="font-bold text-red-700 text-lg mb-2 flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                            Tanggungan Uang Masuk
                                        </h3>
                                        <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                                            Mohon maaf, terdeteksi bahwa Anda belum melunasi tagihan Uang Masuk. 
                                        </p>
                                        <Link href={route('wali.uang-masuk.index')} className="inline-flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-red-700 transition shadow-lg shadow-red-200">
                                            Bayar Sekarang <span aria-hidden="true">&rarr;</span>
                                        </Link>
                                    </div>
                                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-red-200 rounded-full opacity-50 blur-2xl"></div>
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
                                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-green-200 rounded-full opacity-50 blur-2xl"></div>
                                </div>
                            )}

                            {/* Status SPP */}
                            {tunggakanSpp > 0 ? (
                                <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-xl shadow-sm relative overflow-hidden">
                                    <div className="relative z-10">
                                        <h3 className="font-bold text-orange-800 text-lg mb-2 flex items-center gap-2">
                                            <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            Tunggakan SPP ({tunggakanSpp} Bulan)
                                        </h3>
                                        <p className="text-gray-700 text-sm mb-4 leading-relaxed">Ada <strong>{tunggakanSpp} bulan</strong> tagihan SPP yang belum diselesaikan.</p>
                                        <Link href={route('spp.index')} className="inline-flex items-center gap-2 bg-orange-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-orange-700 transition shadow-lg shadow-orange-200">
                                            Cek & Bayar SPP <span aria-hidden="true">&rarr;</span>
                                        </Link>
                                    </div>
                                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-orange-200 rounded-full opacity-50 blur-2xl"></div>
                                </div>
                            ) : (
                                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-xl shadow-sm">
                                    <h3 className="font-bold text-blue-700 text-lg mb-2 flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        Informasi Akademik
                                    </h3>
                                    <p className="text-gray-700 text-sm leading-relaxed">SPP Anda lancar. Silakan akses menu sidebar untuk informasi akademik lainnya.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Modals Wali Santri */}
                    <Modal show={showUangMasukModal} onClose={() => setShowUangMasukModal(false)}>
                        <div className="p-6 text-center">
                            <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-100 mb-5">
                                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Tagihan Uang Masuk</h2>
                            <p className="text-sm text-gray-600 mb-8 px-4">Sistem mendeteksi bahwa Anda masih memiliki tagihan <strong>Uang Masuk</strong> yang belum diselesaikan.</p>
                            <div className="flex justify-center gap-3">
                                <button onClick={() => setShowUangMasukModal(false)} className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm">Nanti Saja</button>
                                <Link href={route('wali.uang-masuk.index')} className="px-5 py-2.5 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition text-sm shadow-lg shadow-red-200">Lihat Tagihan</Link>
                            </div>
                        </div>
                    </Modal>

                    <Modal show={showSppModal} onClose={() => setShowSppModal(false)}>
                        <div className="p-6 text-center">
                            <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-orange-100 mb-5">
                                <svg className="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Pemberitahuan SPP</h2>
                            <p className="text-sm text-gray-600 mb-8 px-4">Halo, tercatat ada <strong>{tunggakanSpp} bulan</strong> tagihan SPP yang belum dibayar.</p>
                            <div className="flex justify-center gap-3">
                                <button onClick={() => setShowSppModal(false)} className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm">Mengerti</button>
                                <Link href={route('spp.index')} className="px-5 py-2.5 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition text-sm shadow-lg shadow-orange-200">Bayar SPP Sekarang</Link>
                            </div>
                        </div>
                    </Modal>
                </div>
            ) : user.role === 'keuangan' ? (
                // ==========================================
                // --- 2. VIEW KHUSUS ADMIN KEUANGAN (BARU) ---
                // ==========================================
                <div className="space-y-6">
                    
                    {/* A. Header Ringkasan Keuangan (Cards) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Formulir */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                            <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Formulir Pendaftaran</h3>
                            <div className="mt-3 flex justify-between items-end">
                                <div>
                                    <span className="text-3xl font-bold text-blue-600">{stats.formulir?.sudah || 0}</span>
                                    <span className="text-xs text-gray-500 ml-1 font-medium">Lunas</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xl font-bold text-red-500">{stats.formulir?.belum || 0}</span>
                                    <span className="text-xs text-gray-400 ml-1 block">Belum</span>
                                </div>
                            </div>
                        </div>

                        {/* Uang Masuk */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                            <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Uang Masuk (Pangkal)</h3>
                            <div className="mt-3 flex justify-between items-end">
                                <div>
                                    <span className="text-3xl font-bold text-green-600">{stats.uang_masuk?.sudah || 0}</span>
                                    <span className="text-xs text-gray-500 ml-1 font-medium">Lunas</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xl font-bold text-red-500">{stats.uang_masuk?.belum || 0}</span>
                                    <span className="text-xs text-gray-400 ml-1 block">Belum</span>
                                </div>
                            </div>
                        </div>

                        {/* SPP */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-500">
                            <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Transaksi SPP (Lunas)</h3>
                            <div className="mt-3 flex items-end gap-2">
                                <span className="text-4xl font-bold text-orange-600">{stats.spp_transaksi || 0}</span>
                                <span className="text-sm text-gray-400 mb-1">Kali Transaksi Masuk</span>
                            </div>
                        </div>
                    </div>

                    {/* B. VISUALISASI DIAGRAM PER CABANG (Simple CSS Bar Chart) */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800 text-lg">Monitoring Pembayaran Per Cabang</h3>
                            <span className="text-xs bg-white border px-3 py-1 rounded-full text-gray-500 font-medium">Visualisasi</span>
                        </div>
                        
                        <div className="p-6">
                            {chart_data.length > 0 ? (
                                <div className="flex items-end justify-around space-x-2 md:space-x-8 h-64 border-b border-gray-200 pb-0">
                                    {chart_data.map((data, idx) => (
                                        <div key={idx} className="flex flex-col items-center group w-full h-full justify-end">
                                            
                                            {/* Bar Container */}
                                            <div className="flex gap-1 md:gap-2 items-end justify-center w-full h-full pb-2">
                                                
                                                {/* Bar 1: Total Siswa (Abu) vs Lunas (Hijau) */}
                                                <div className="relative w-8 md:w-14 bg-gray-100 rounded-t-sm overflow-hidden flex flex-col justify-end transition-all duration-500" 
                                                     style={{ height: `${(data.total_siswa / maxChartVal) * 100}%` }}>
                                                    {/* Tooltip */}
                                                    <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 text-[10px] bg-black text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
                                                        Siswa: {data.total_siswa}
                                                    </div>
                                                    
                                                    {/* Fill Hijau (Lunas Uang Masuk) */}
                                                    <div className="bg-emerald-500 w-full hover:bg-emerald-600 transition-all" 
                                                         style={{ height: `${data.total_siswa > 0 ? (data.uang_masuk_lunas / data.total_siswa) * 100 : 0}%` }}>
                                                    </div>
                                                </div>

                                                {/* Bar 2: SPP Transactions (Oranye) */}
                                                <div className="relative w-8 md:w-14 bg-orange-100 rounded-t-sm flex flex-col justify-end transition-all duration-500"
                                                     style={{ height: `${(data.spp_count / maxChartVal) * 100}%` }}>
                                                     
                                                     <div className="bg-orange-500 w-full hover:bg-orange-600 transition-all h-full"></div>
                                                     
                                                     {/* Angka di atas bar */}
                                                     {data.spp_count > 0 && (
                                                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-orange-600 font-bold">
                                                            {data.spp_count}
                                                        </span>
                                                     )}
                                                </div>
                                            </div>

                                            {/* Label Cabang */}
                                            <p className="mt-2 text-[10px] md:text-xs font-bold text-gray-600 text-center truncate w-20 md:w-24 border-t border-transparent pt-1 group-hover:border-gray-300">
                                                {data.cabang}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-400 italic py-10">Belum ada data cabang untuk ditampilkan.</p>
                            )}

                            {/* Legenda Chart */}
                            <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-6 pt-4 border-t border-dashed border-gray-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-emerald-500 rounded-sm"></div>
                                    <span className="text-xs text-gray-600">Lunas Uang Masuk</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-gray-200 rounded-sm border border-gray-300"></div>
                                    <span className="text-xs text-gray-600">Total Siswa (Belum Lunas)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-orange-500 rounded-sm"></div>
                                    <span className="text-xs text-gray-600">Transaksi SPP (Kali Bayar)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* C. Tabel Rincian Angka (Data Mentah) */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                             <h3 className="font-bold text-gray-700">Rincian Angka Per Cabang</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3">Nama Cabang</th>
                                        <th className="px-6 py-3 text-center">Total Santri</th>
                                        <th className="px-6 py-3 text-center text-emerald-600">Lunas Pangkal</th>
                                        <th className="px-6 py-3 text-center text-red-500">Belum Lunas</th>
                                        <th className="px-6 py-3 text-center text-orange-600">Transaksi SPP</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {chart_data.length > 0 ? (
                                        chart_data.map((row, idx) => (
                                            <tr key={idx} className="bg-white border-b hover:bg-gray-50">
                                                <td className="px-6 py-3 font-bold text-gray-800">{row.cabang}</td>
                                                <td className="px-6 py-3 text-center font-bold">{row.total_siswa}</td>
                                                <td className="px-6 py-3 text-center bg-emerald-50 text-emerald-700 font-medium">{row.uang_masuk_lunas}</td>
                                                <td className="px-6 py-3 text-center bg-red-50 text-red-700">{row.uang_masuk_belum}</td>
                                                <td className="px-6 py-3 text-center font-bold text-orange-600">{row.spp_count}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-6 text-gray-400">Belum ada data.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* D. Transaksi Terakhir */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                             <h3 className="font-bold text-gray-800">Transaksi Masuk Terakhir</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3">Tanggal</th>
                                        <th className="px-6 py-3">Santri</th>
                                        <th className="px-6 py-3">Jenis Pembayaran</th>
                                        <th className="px-6 py-3 text-right">Nominal</th>
                                        <th className="px-6 py-3 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {terbaru.length > 0 ? (
                                        terbaru.map((item, idx) => (
                                            <tr key={idx} className="bg-white border-b hover:bg-gray-50">
                                                <td className="px-6 py-3">{formatDate(item.created_at)}</td>
                                                <td className="px-6 py-3 font-medium text-gray-800">{item.nama}</td>
                                                <td className="px-6 py-3">{item.jenis || item.jenis_pembayaran || 'Pembayaran'}</td>
                                                <td className="px-6 py-3 text-right font-bold text-gray-700">{formatRupiah(item.nominal || 0)}</td>
                                                <td className="px-6 py-3 text-center">
                                                    <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold">Berhasil</span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-6 text-gray-400">Belum ada transaksi terbaru.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            ) : (
                // ==========================================
                // --- 3. VIEW ADMIN PSB (DEFAULT) ---
                // ==========================================
                <div className="space-y-6">
                    {/* Header Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-600">
                            <p className="text-sm text-gray-500 font-medium">Total Pendaftar</p>
                            <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.total_pendaftar}</h3>
                            <p className="text-xs text-blue-600 mt-2 font-semibold">+{stats.hari_ini} Hari ini</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                            <p className="text-sm text-gray-500 font-medium">Lulus / Santri Aktif</p>
                            <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.total_lulus}</h3>
                            <p className="text-xs text-green-600 mt-2 font-semibold">{getPercent(stats.total_lulus).toFixed(1)}% Konversi</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
                            <p className="text-sm text-gray-500 font-medium">Demografi</p>
                            <div className="flex items-end justify-between mt-2">
                                <div className="text-center">
                                    <span className="text-2xl font-bold text-blue-700">{gender.ikhwan}</span>
                                    <p className="text-[10px] uppercase text-gray-400 font-bold">Ikhwan</p>
                                </div>
                                <div className="text-gray-300 mb-2">VS</div>
                                <div className="text-center">
                                    <span className="text-2xl font-bold text-pink-600">{gender.akhwat}</span>
                                    <p className="text-[10px] uppercase text-gray-400 font-bold">Akhwat</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-500">
                            <p className="text-sm text-gray-500 font-medium">Total Pendapatan</p>
                            <h3 className="text-xl font-bold text-gray-800 mt-2">{formatRupiah(stats.total_pendapatan)}</h3>
                            <p className="text-xs text-gray-400 mt-1">Dari pembayaran lunas</p>
                        </div>
                    </div>

                    {/* Grid Distribusi */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Distribusi Cabang */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <h3 className="font-bold text-gray-700">Distribusi Cabang</h3>
                                <span className="text-xs bg-white border px-2 py-1 rounded text-gray-500">{per_cabang.length} Cabang</span>
                            </div>
                            <div className="p-6 space-y-4 max-h-80 overflow-y-auto custom-scrollbar">
                                {per_cabang.map((cabang, idx) => (
                                    <div key={idx}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium text-gray-700">{cabang.cabang}</span>
                                            <span className="font-bold text-gray-900">{cabang.total}</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                                            <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${getPercent(cabang.total)}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                                {per_cabang.length === 0 && <p className="text-center text-gray-400 text-sm">Belum ada data cabang.</p>}
                            </div>
                        </div>

                        {/* Minat Program */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <h3 className="font-bold text-gray-700">Minat Program</h3>
                                <span className="text-xs bg-white border px-2 py-1 rounded text-gray-500">{per_program.length} Program</span>
                            </div>
                            <div className="p-6 space-y-4 max-h-80 overflow-y-auto custom-scrollbar">
                                {per_program.map((prog, idx) => (
                                    <div key={idx}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium text-gray-700">{prog.program_nama}</span>
                                            <span className="font-bold text-gray-900">{prog.total}</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                                            <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: `${getPercent(prog.total)}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                                {per_program.length === 0 && <p className="text-center text-gray-400 text-sm">Belum ada data program.</p>}
                            </div>
                        </div>
                    </div>

                    {/* Tabel & Status */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Rincian Status */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-fit">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                                <h3 className="font-bold text-gray-700">Rincian Status</h3>
                            </div>
                            <div className="p-4">
                                <div className="grid grid-cols-1 gap-3">
                                    {per_status.map((stat, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-3 h-3 rounded-full ${stat.status === 'Lulus' ? 'bg-green-500' : stat.status === 'Tidak Lulus' ? 'bg-red-500' : stat.status === 'Menunggu Verifikasi' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                                                <span className="text-sm text-gray-600">{stat.status}</span>
                                            </div>
                                            <span className="text-sm font-bold text-gray-800 bg-white border px-2 py-0.5 rounded shadow-sm">{stat.total}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Tabel Terbaru */}
                        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <h3 className="font-bold text-gray-700">Pendaftar Masuk Terbaru</h3>
                                <Link href={route('psb.pendaftaran.index')} className="text-xs font-bold text-blue-600 hover:underline">Lihat Semua</Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3">Nama</th>
                                            <th className="px-6 py-3">Program/Cabang</th>
                                            <th className="px-6 py-3 text-center">JK</th>
                                            <th className="px-6 py-3 text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {terbaru.length > 0 ? (
                                            terbaru.map((item) => (
                                                <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                                                    <td className="px-6 py-3">
                                                        <div className="font-bold text-gray-800">{item.nama}</div>
                                                        <div className="text-xs text-gray-400">{formatDate(item.created_at)}</div>
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        <div className="text-gray-700">{item.program_nama}</div>
                                                        <div className="text-xs text-gray-400">{item.cabang}</div>
                                                    </td>
                                                    <td className="px-6 py-3 text-center">
                                                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${item.jenis_kelamin === 'Laki-laki' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                                                            {item.jenis_kelamin === 'Laki-laki' ? 'L' : 'P'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-3 text-center">
                                                        <span className={`px-2 py-1 text-xs rounded-full font-bold ${item.status === 'Lulus' ? 'bg-green-100 text-green-700' : item.status === 'Menunggu Verifikasi' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan="4" className="text-center py-6 text-gray-400">Belum ada data.</td></tr>
                                        )}
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