import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ 
    stats = {}, 
    gender = { ikhwan: 0, akhwat: 0 }, 
    per_cabang = [], 
    per_program = [], 
    per_status = [],
    terbaru = [] 
}) {
    
    // Helper Format Uang
    const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num || 0);
    
    // Helper Format Tanggal
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

    // Helper Progress Bar Width
    const calculatePercent = (val) => stats.total_pendaftar > 0 ? (val / stats.total_pendaftar) * 100 : 0;

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard Admin" />

            <div className="space-y-6">
                
                {/* --- 1. HEADER STATISTIK UTAMA --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Total Pendaftar */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-600">
                        <p className="text-sm text-gray-500 font-medium">Total Pendaftar</p>
                        <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.total_pendaftar}</h3>
                        <p className="text-xs text-blue-600 mt-2 font-semibold">+{stats.hari_ini} Hari ini</p>
                    </div>

                    {/* Total Lulus/Santri */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                        <p className="text-sm text-gray-500 font-medium">Lulus / Santri Aktif</p>
                        <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.total_lulus}</h3>
                        <p className="text-xs text-green-600 mt-2 font-semibold">
                            {calculatePercent(stats.total_lulus).toFixed(1)}% Konversi
                        </p>
                    </div>

                    {/* Ikhwan vs Akhwat (Mini) */}
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

                    {/* Keuangan */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-500">
                        <p className="text-sm text-gray-500 font-medium">Total Pendapatan</p>
                        <h3 className="text-xl font-bold text-gray-800 mt-2">{formatRupiah(stats.total_pendapatan)}</h3>
                        <p className="text-xs text-gray-400 mt-1">Dari pembayaran lunas</p>
                    </div>
                </div>

                {/* --- 2. GRID DISTRIBUSI (PROGRAM & CABANG) --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* DISTRIBUSI CABANG */}
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
                                        <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${calculatePercent(cabang.total)}%` }}></div>
                                    </div>
                                </div>
                            ))}
                            {per_cabang.length === 0 && <p className="text-center text-gray-400 text-sm">Belum ada data cabang.</p>}
                        </div>
                    </div>

                    {/* DISTRIBUSI PROGRAM */}
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
                                        <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: `${calculatePercent(prog.total)}%` }}></div>
                                    </div>
                                </div>
                            ))}
                            {per_program.length === 0 && <p className="text-center text-gray-400 text-sm">Belum ada data program.</p>}
                        </div>
                    </div>

                </div>

                {/* --- 3. GRID STATUS & TABEL TERBARU --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* RINCIAN STATUS */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-fit">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-bold text-gray-700">Rincian Status</h3>
                        </div>
                        <div className="p-4">
                            <div className="grid grid-cols-1 gap-3">
                                {per_status.map((stat, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full ${
                                                stat.status === 'Lulus' ? 'bg-green-500' :
                                                stat.status === 'Tidak Lulus' ? 'bg-red-500' :
                                                stat.status === 'Menunggu Verifikasi' ? 'bg-yellow-500' :
                                                'bg-blue-500'
                                            }`}></div>
                                            <span className="text-sm text-gray-600">{stat.status}</span>
                                        </div>
                                        <span className="text-sm font-bold text-gray-800 bg-white border px-2 py-0.5 rounded shadow-sm">
                                            {stat.total}
                                        </span>
                                    </div>
                                ))}
                                {per_status.length === 0 && <p className="text-center text-gray-400 text-sm py-4">Belum ada data status.</p>}
                            </div>
                        </div>
                    </div>

                    {/* TABEL TERBARU */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-gray-700">Pendaftar Masuk Terbaru</h3>
                            <Link href={route('psb.pendaftaran.index')} className="text-xs font-bold text-blue-600 hover:underline">
                                Lihat Semua
                            </Link>
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
                                                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                                                        item.jenis_kelamin === 'Laki-laki' 
                                                        ? 'bg-blue-100 text-blue-700' 
                                                        : 'bg-pink-100 text-pink-700'
                                                    }`}>
                                                        {item.jenis_kelamin === 'Laki-laki' ? 'L' : 'P'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3 text-center">
                                                    <span className={`px-2 py-1 text-xs rounded-full font-bold ${
                                                        item.status === 'Lulus' ? 'bg-green-100 text-green-700' :
                                                        item.status === 'Menunggu Verifikasi' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-gray-100 text-gray-600'
                                                    }`}>
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
        </AuthenticatedLayout>
    );
}