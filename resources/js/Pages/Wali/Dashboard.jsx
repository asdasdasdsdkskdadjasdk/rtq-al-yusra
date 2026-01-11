import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth, santri, stats, progressHafalan, setoranTerakhir, error }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard Wali Santri" />

            <div className="py-8 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    
                    {error && <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>}

                    {santri && (
                        <>
                            {/* HEADER PROFIL SINGKAT */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                                    {santri.nama_santri.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Ahlan Wa Sahlan, Ayah Bunda {santri.nama_santri}</h2>
                                    <p className="text-gray-500 text-sm">Berikut adalah ringkasan perkembangan Ananda.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                
                                {/* 1. PROGRESS HAFALAN */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-green-100 rounded-full -mr-10 -mt-10 opacity-50 blur-xl"></div>
                                    <h3 className="font-bold text-gray-700 mb-2">🎯 Progress Hafalan</h3>
                                    <div className="flex items-end gap-2 mb-2">
                                        <span className="text-4xl font-bold text-green-600">{progressHafalan.selesai}</span>
                                        <span className="text-gray-400 text-sm mb-1">/ 30 Juz</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                                        <div className="bg-green-500 h-3 rounded-full transition-all" style={{ width: `${progressHafalan.persen}%` }}></div>
                                    </div>
                                    <p className="text-sm text-gray-500">Saat ini sedang menghafal <span className="font-bold text-gray-800">Juz {progressHafalan.sedang_hafal}</span></p>
                                </div>

                                {/* 2. SETORAN TERAKHIR */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <h3 className="font-bold text-gray-700 mb-4">📖 Setoran Terakhir</h3>
                                    {setoranTerakhir ? (
                                        <div>
                                            <div className="text-sm text-gray-400 mb-1">{new Date(setoranTerakhir.tanggal).toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'})}</div>
                                            <div className="text-lg font-bold text-gray-800">Juz {setoranTerakhir.juz}</div>
                                            <div className="text-gray-600 text-sm">Surah {setoranTerakhir.surah}</div>
                                            <div className="mt-2 inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded font-bold">
                                                Ayat {setoranTerakhir.ayat_awal} - {setoranTerakhir.ayat_akhir}
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-gray-400 italic">Belum ada data.</p>
                                    )}
                                </div>

                                {/* 3. STATISTIK KEHADIRAN TOTAL */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <h3 className="font-bold text-gray-700 mb-4">📊 Statistik Total Kehadiran</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-green-50 p-2 rounded text-center border border-green-100">
                                            <div className="font-bold text-green-700 text-xl">{stats.Hadir}</div>
                                            <div className="text-[10px] uppercase text-green-600">Hadir</div>
                                        </div>
                                        <div className="bg-yellow-50 p-2 rounded text-center border border-yellow-100">
                                            <div className="font-bold text-yellow-700 text-xl">{stats.Sakit}</div>
                                            <div className="text-[10px] uppercase text-yellow-600">Sakit</div>
                                        </div>
                                        <div className="bg-blue-50 p-2 rounded text-center border border-blue-100">
                                            <div className="font-bold text-blue-700 text-xl">{stats.Izin}</div>
                                            <div className="text-[10px] uppercase text-blue-600">Izin</div>
                                        </div>
                                        <div className="bg-red-50 p-2 rounded text-center border border-red-100">
                                            <div className="font-bold text-red-700 text-xl">{stats.Alpha}</div>
                                            <div className="text-[10px] uppercase text-red-600">Alpha</div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}