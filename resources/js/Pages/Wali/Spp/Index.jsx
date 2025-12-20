import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function SppIndex({ auth, history }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        bulan: '',
        tahun: new Date().getFullYear(),
        jumlah: '',
        bukti_transfer: null,
    });

    const bulanList = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('spp.store'), {
            onSuccess: () => reset('bukti_transfer', 'jumlah'),
        });
    };

    // Helper format uang
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
    };

    // Helper warna status
    const getStatusColor = (status) => {
        switch(status) {
            case 'Diterima': return 'bg-green-100 text-green-800';
            case 'Ditolak': return 'bg-red-100 text-red-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Pembayaran SPP" />

            <div className="space-y-6">
                
                {/* --- FORM UPLOAD --- */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Upload Bukti SPP</h3>
                    
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Pilih Bulan */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bulan Pembayaran</label>
                            <select 
                                value={data.bulan}
                                onChange={e => setData('bulan', e.target.value)}
                                className="w-full rounded-lg border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                                required
                            >
                                <option value="">-- Pilih Bulan --</option>
                                {bulanList.map(bln => (
                                    <option key={bln} value={bln}>{bln}</option>
                                ))}
                            </select>
                            {errors.bulan && <p className="text-red-500 text-xs mt-1">{errors.bulan}</p>}
                        </div>

                        {/* Pilih Tahun */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
                            <input 
                                type="number" 
                                value={data.tahun}
                                onChange={e => setData('tahun', e.target.value)}
                                className="w-full rounded-lg border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                                required
                            />
                            {errors.tahun && <p className="text-red-500 text-xs mt-1">{errors.tahun}</p>}
                        </div>

                        {/* Nominal */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Transfer (Rp)</label>
                            <input 
                                type="number" 
                                value={data.jumlah}
                                onChange={e => setData('jumlah', e.target.value)}
                                className="w-full rounded-lg border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                                placeholder="Contoh: 150000"
                                required
                            />
                            {errors.jumlah && <p className="text-red-500 text-xs mt-1">{errors.jumlah}</p>}
                        </div>

                        {/* File Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bukti Foto / Screenshot</label>
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={e => setData('bukti_transfer', e.target.files[0])}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                                required
                            />
                            {errors.bukti_transfer && <p className="text-red-500 text-xs mt-1">{errors.bukti_transfer}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <button 
                                type="submit" 
                                disabled={processing}
                                className="px-6 py-2 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition w-full md:w-auto shadow-md"
                            >
                                {processing ? 'Mengupload...' : 'Kirim Bukti Pembayaran'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* --- RIWAYAT PEMBAYARAN --- */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Riwayat Pembayaran</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3">Tanggal Upload</th>
                                    <th className="px-4 py-3">Periode</th>
                                    <th className="px-4 py-3">Jumlah</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Bukti</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.length > 0 ? (
                                    history.map((item) => (
                                        <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-4 py-3">{new Date(item.created_at).toLocaleDateString('id-ID')}</td>
                                            <td className="px-4 py-3 font-medium text-gray-900">{item.bulan} {item.tahun}</td>
                                            <td className="px-4 py-3">{formatRupiah(item.jumlah)}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(item.status)}`}>
                                                    {item.status}
                                                </span>
                                                {item.catatan_admin && (
                                                    <p className="text-xs text-red-500 mt-1 italic">Note: {item.catatan_admin}</p>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <a href={`/storage/${item.bukti_transfer}`} target="_blank" className="text-blue-600 hover:underline text-xs">
                                                    Lihat Foto
                                                </a>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-6 text-center text-gray-400">Belum ada riwayat pembayaran.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}