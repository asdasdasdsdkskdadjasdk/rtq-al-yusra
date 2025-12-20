import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function KeuanganIndex({ auth, pendaftaran, spp, total_pendaftaran, total_spp }) {
    const [activeTab, setActiveTab] = useState('pendaftaran');

    // Helper format uang
    const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num || 0);
    // Helper format tanggal
    const formatDate = (date) => new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    // Komponen Tabel Pendaftaran
    const TabelPendaftaran = () => (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th className="px-6 py-3">No. Daftar</th>
                        <th className="px-6 py-3">Nama Santri</th>
                        <th className="px-6 py-3">Program</th>
                        <th className="px-6 py-3">Tanggal</th>
                        <th className="px-6 py-3 text-right">Nominal</th>
                    </tr>
                </thead>
                <tbody>
                    {pendaftaran.map((item) => (
                        <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">{item.no_pendaftaran}</td>
                            <td className="px-6 py-4">{item.nama}</td>
                            <td className="px-6 py-4">{item.program_nama}</td>
                            <td className="px-6 py-4">{formatDate(item.created_at)}</td>
                            <td className="px-6 py-4 text-right font-bold text-green-600">{formatRupiah(item.nominal_pembayaran)}</td>
                        </tr>
                    ))}
                    {pendaftaran.length === 0 && <tr><td colSpan="5" className="p-4 text-center">Data kosong.</td></tr>}
                </tbody>
            </table>
        </div>
    );

    // Komponen Tabel SPP (Dengan Tombol Aksi)
    const TabelSpp = () => {
        const { post, processing } = useForm();
        
        const handleVerify = (id, status) => {
            if (confirm(`Apakah Anda yakin ingin mengubah status menjadi ${status}?`)) {
                post(route('admin.keuangan.verify', id), {
                    data: { status, catatan: status === 'Ditolak' ? 'Bukti tidak valid' : 'Pembayaran diterima' },
                    preserveScroll: true
                });
            }
        };

        return (
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Wali Santri</th>
                            <th className="px-6 py-3">Periode</th>
                            <th className="px-6 py-3 text-right">Jumlah</th>
                            <th className="px-6 py-3 text-center">Bukti</th>
                            <th className="px-6 py-3 text-center">Status</th>
                            <th className="px-6 py-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {spp.map((item) => (
                            <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-gray-900">{item.user?.name || 'User Hapus'}</div>
                                    <div className="text-xs text-gray-400">{formatDate(item.created_at)}</div>
                                </td>
                                <td className="px-6 py-4">{item.bulan} {item.tahun}</td>
                                <td className="px-6 py-4 text-right font-bold text-blue-600">{formatRupiah(item.jumlah)}</td>
                                <td className="px-6 py-4 text-center">
                                    <a href={`/storage/${item.bukti_transfer}`} target="_blank" className="text-blue-600 underline text-xs">Lihat</a>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                        item.status === 'Diterima' ? 'bg-green-100 text-green-700' :
                                        item.status === 'Ditolak' ? 'bg-red-100 text-red-700' :
                                        'bg-yellow-100 text-yellow-700'
                                    }`}>{item.status}</span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {item.status === 'Menunggu Konfirmasi' && (
                                        <div className="flex justify-center gap-2">
                                            <button 
                                                onClick={() => handleVerify(item.id, 'Diterima')}
                                                disabled={processing}
                                                className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                                            >
                                                Terima
                                            </button>
                                            <button 
                                                onClick={() => handleVerify(item.id, 'Ditolak')}
                                                disabled={processing}
                                                className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                                            >
                                                Tolak
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {spp.length === 0 && <tr><td colSpan="6" className="p-4 text-center">Belum ada data SPP.</td></tr>}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Laporan Keuangan" />

            <div className="space-y-6">
                
                {/* --- RINGKASAN KARTU --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                        <p className="text-gray-500 text-sm">Total Pemasukan Pendaftaran</p>
                        <h3 className="text-2xl font-bold text-gray-800">{formatRupiah(total_pendaftaran)}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                        <p className="text-gray-500 text-sm">Total Pemasukan SPP (Diterima)</p>
                        <h3 className="text-2xl font-bold text-gray-800">{formatRupiah(total_spp)}</h3>
                    </div>
                </div>

                {/* --- KONTEN UTAMA DENGAN TAB --- */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    
                    {/* Header Tab */}
                    <div className="flex border-b border-gray-200">
                        <button
                            className={`flex-1 py-4 text-center font-medium text-sm transition ${activeTab === 'pendaftaran' ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('pendaftaran')}
                        >
                            Uang Pendaftaran
                        </button>
                        <button
                            className={`flex-1 py-4 text-center font-medium text-sm transition ${activeTab === 'spp' ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('spp')}
                        >
                            Pembayaran SPP
                        </button>
                    </div>

                    {/* Isi Tab */}
                    <div className="p-0">
                        {activeTab === 'pendaftaran' ? <TabelPendaftaran /> : <TabelSpp /> }
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}