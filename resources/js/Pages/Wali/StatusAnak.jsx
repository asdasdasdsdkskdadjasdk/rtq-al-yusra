import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

export default function StatusAnak({ auth, santri, kehadiran, hafalan, statsBulanIni, currentJuz, filters, error }) {
    
    const [activeTab, setActiveTab] = useState('kehadiran'); // 'kehadiran' or 'hafalan'
    
    // State Filter
    const [bulan, setBulan] = useState(filters.bulan);
    const [tahun, setTahun] = useState(filters.tahun);

    // List Bulan & Tahun
    const months = [
        {v: '01', n: 'Januari'}, {v: '02', n: 'Februari'}, {v: '03', n: 'Maret'}, 
        {v: '04', n: 'April'}, {v: '05', n: 'Mei'}, {v: '06', n: 'Juni'},
        {v: '07', n: 'Juli'}, {v: '08', n: 'Agustus'}, {v: '09', n: 'September'}, 
        {v: '10', n: 'Oktober'}, {v: '11', n: 'November'}, {v: '12', n: 'Desember'}
    ];
    const currentYear = new Date().getFullYear();
    const years = Array.from({length: 5}, (_, i) => currentYear - i);

    // Fungsi Ganti Filter
    const handleFilter = () => {
        router.get(route('wali.status.anak'), { bulan, tahun }, { 
            preserveState: true, 
            preserveScroll: true 
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Lihat Status Anak" />

            <div className="py-8 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    
                    {error && <div className="bg-red-100 p-4 rounded text-red-700">{error}</div>}

                    {/* --- FILTER BAR --- */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="font-bold text-gray-700 text-lg">
                            History & Status : <span className="text-blue-600">{months.find(m=>m.v == bulan)?.n} {tahun}</span>
                        </div>
                        <div className="flex gap-2">
                            <select value={bulan} onChange={(e) => setBulan(e.target.value)} className="border-gray-300 rounded-lg text-sm focus:ring-blue-500">
                                {months.map(m => <option key={m.v} value={m.v}>{m.n}</option>)}
                            </select>
                            <select value={tahun} onChange={(e) => setTahun(e.target.value)} className="border-gray-300 rounded-lg text-sm focus:ring-blue-500">
                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                            <button onClick={handleFilter} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700">
                                Tampilkan
                            </button>
                        </div>
                    </div>

                    {/* --- TABS NAVIGATION --- */}
                    <div className="flex space-x-1 bg-gray-200 p-1 rounded-xl w-fit">
                        <button 
                            onClick={() => setActiveTab('kehadiran')}
                            className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'kehadiran' ? 'bg-white text-blue-600 shadow' : 'text-gray-600 hover:bg-gray-300'}`}
                        >
                            📅 Kehadiran
                        </button>
                        <button 
                            onClick={() => setActiveTab('hafalan')}
                            className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'hafalan' ? 'bg-white text-blue-600 shadow' : 'text-gray-600 hover:bg-gray-300'}`}
                        >
                            📖 Hafalan
                        </button>
                    </div>

                    {/* --- KONTEN TAB KEHADIRAN --- */}
                    {activeTab === 'kehadiran' && (
                        <div className="space-y-6 animate-fade-in">
                            {/* Statistik Absensi Bulan Ini */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-green-100 p-4 rounded-xl border border-green-200 flex flex-col items-center">
                                    <span className="text-3xl font-bold text-green-700">{statsBulanIni.Hadir}</span>
                                    <span className="text-xs font-bold text-green-800 uppercase">Hadir</span>
                                </div>
                                <div className="bg-yellow-100 p-4 rounded-xl border border-yellow-200 flex flex-col items-center">
                                    <span className="text-3xl font-bold text-yellow-700">{statsBulanIni.Sakit}</span>
                                    <span className="text-xs font-bold text-yellow-800 uppercase">Sakit</span>
                                </div>
                                <div className="bg-blue-100 p-4 rounded-xl border border-blue-200 flex flex-col items-center">
                                    <span className="text-3xl font-bold text-blue-700">{statsBulanIni.Izin}</span>
                                    <span className="text-xs font-bold text-blue-800 uppercase">Izin</span>
                                </div>
                                <div className="bg-red-100 p-4 rounded-xl border border-red-200 flex flex-col items-center">
                                    <span className="text-3xl font-bold text-red-700">{statsBulanIni.Alpha}</span>
                                    <span className="text-xs font-bold text-red-800 uppercase">Alpha</span>
                                </div>
                            </div>

                            {/* Tabel Detail Absensi */}
                            <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-6 py-3">Tanggal</th>
                                            <th className="px-6 py-3">Jam Input</th>
                                            <th className="px-6 py-3 text-center">Status</th>
                                            <th className="px-6 py-3">Keterangan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {kehadiran.length > 0 ? kehadiran.map((item, idx) => (
                                            <tr key={idx} className="bg-white hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium text-gray-900">
                                                    {new Date(item.created_at).toLocaleDateString('id-ID', {weekday:'long', day:'numeric', month:'long'})}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {new Date(item.created_at).toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {/* Menggunakan kolom status_kehadiran */}
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                        item.status_kehadiran === 'Hadir' ? 'bg-green-100 text-green-700' :
                                                        item.status_kehadiran === 'Sakit' ? 'bg-yellow-100 text-yellow-700' :
                                                        item.status_kehadiran === 'Izin'  ? 'bg-blue-100 text-blue-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>
                                                        {item.status_kehadiran}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-xs italic">{item.keterangan || '-'}</td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-400">Tidak ada data kehadiran di bulan ini.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* --- KONTEN TAB HAFALAN --- */}
                    {activeTab === 'hafalan' && (
                        <div className="space-y-6 animate-fade-in">
                            {/* Info Juz Saat Ini */}
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded shadow-sm flex justify-between items-center">
                                <div>
                                    <p className="text-blue-800 font-bold text-lg">Posisi Hafalan Saat Ini:</p>
                                    <p className="text-sm text-blue-600">Berdasarkan data input terakhir.</p>
                                </div>
                                <div className="text-4xl font-bold text-blue-700">Juz {currentJuz}</div>
                            </div>

                            {/* Tabel Detail Hafalan */}
                            <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-6 py-3">Tanggal</th>
                                            <th className="px-6 py-3">Juz</th>
                                            <th className="px-6 py-3">Surah</th>
                                            <th className="px-6 py-3">Ayat</th>
                                            <th className="px-6 py-3">Nilai</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {hafalan.length > 0 ? hafalan.map((item, idx) => (
                                            <tr key={idx} className="bg-white hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium text-gray-900">
                                                    {new Date(item.tanggal).toLocaleDateString('id-ID', {weekday:'short', day:'numeric', month:'short'})}
                                                </td>
                                                <td className="px-6 py-4 font-bold text-blue-600">{item.juz}</td>
                                                <td className="px-6 py-4">{item.surah}</td>
                                                <td className="px-6 py-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs border">{item.ayat_awal} - {item.ayat_akhir}</span></td>
                                                <td className="px-6 py-4 font-bold">{item.nilai || '-'}</td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-400">Tidak ada setoran hafalan di bulan ini.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}