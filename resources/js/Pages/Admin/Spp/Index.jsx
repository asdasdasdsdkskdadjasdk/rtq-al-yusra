import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';

export default function AdminSppIndex({ auth, pending, history, users }) {
    const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'history', 'manual'

    // --- FORM INPUT MANUAL (ADMIN) ---
    const { data, setData, post, processing, reset, errors } = useForm({
        user_id: '',
        bulan: new Date().getMonth() + 1, // Default bulan ini
        tahun: new Date().getFullYear(),
        jumlah_bayar: '',
        keterangan: ''
    });

    // Handle Submit Manual
    const handleSubmitManual = (e) => {
        e.preventDefault();
        post(route('admin.spp.manual'), {
            onSuccess: () => {
                reset();
                alert('Pembayaran berhasil dicatat!');
                setActiveTab('history'); // Pindah ke tab history setelah sukses
            }
        });
    };

    // Handle Approve
    const handleApprove = (id) => {
        if (confirm('Yakin ingin menerima pembayaran ini?')) {
            router.post(route('admin.spp.approve', id));
        }
    };

    // Handle Reject
    const handleReject = (id) => {
        if (confirm('Yakin ingin menolak pembayaran ini? Data akan ditandai ditolak.')) {
            router.post(route('admin.spp.reject', id));
        }
    };

    // Helper: Format Rupiah
    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(angka);
    };

    // Helper: Nama Bulan
    const getBulanNama = (angka) => {
        const date = new Date();
        date.setMonth(angka - 1);
        return date.toLocaleString('id-ID', { month: 'long' });
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={<h2 className="font-semibold text-xl text-gray-800">Manajemen SPP Bulanan</h2>}
        >
            <Head title="Manajemen SPP" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* --- TABS NAVIGASI --- */}
                    <div className="flex space-x-2 bg-gray-200 p-1 rounded-xl w-fit mb-6 mx-auto md:mx-0">
                        <button 
                            onClick={() => setActiveTab('pending')} 
                            className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${
                                activeTab === 'pending' 
                                ? 'bg-white text-blue-600 shadow-md' 
                                : 'text-gray-600 hover:bg-gray-300'
                            }`}
                        >
                            Butuh Approval 
                            {pending.length > 0 && (
                                <span className="ml-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse">
                                    {pending.length}
                                </span>
                            )}
                        </button>
                        <button 
                            onClick={() => setActiveTab('history')} 
                            className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${
                                activeTab === 'history' 
                                ? 'bg-white text-blue-600 shadow-md' 
                                : 'text-gray-600 hover:bg-gray-300'
                            }`}
                        >
                            Riwayat Lunas
                        </button>
                        <button 
                            onClick={() => setActiveTab('manual')} 
                            className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${
                                activeTab === 'manual' 
                                ? 'bg-white text-blue-600 shadow-md' 
                                : 'text-gray-600 hover:bg-gray-300'
                            }`}
                        >
                            + Input Manual
                        </button>
                    </div>

                    {/* --- KONTEN TAB 1: PENDING APPROVAL --- */}
                    {activeTab === 'pending' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-4 bg-yellow-50 border-b border-yellow-100 flex items-center gap-2 text-yellow-800 text-sm">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                <strong>Perhatian:</strong> Pastikan bukti transfer valid atau dana sudah masuk sebelum menyetujui.
                            </div>
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-700 uppercase font-bold border-b">
                                    <tr>
                                        <th className="p-4">Tanggal</th>
                                        <th className="p-4">Wali Santri</th>
                                        <th className="p-4">Bulan SPP</th>
                                        <th className="p-4">Nominal</th>
                                        <th className="p-4">Metode</th>
                                        <th className="p-4">Bukti / Ket</th>
                                        <th className="p-4 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {pending.length > 0 ? pending.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition">
                                            <td className="p-4 text-gray-500">{new Date(item.created_at).toLocaleDateString('id-ID')}</td>
                                            <td className="p-4">
                                                <div className="font-bold text-gray-800">{item.user?.name}</div>
                                                <div className="text-xs text-gray-500">{item.user?.email}</div>
                                            </td>
                                            <td className="p-4">
                                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">
                                                    {getBulanNama(item.bulan)} {item.tahun}
                                                </span>
                                            </td>
                                            <td className="p-4 font-bold text-gray-800">{formatRupiah(item.jumlah_bayar)}</td>
                                            <td className="p-4">
                                                <span className="text-xs uppercase font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                    {item.tipe_pembayaran === 'midtrans_manual' ? 'Midtrans (Custom)' : 'Upload Manual'}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                {item.bukti_bayar ? (
                                                    <a href={`/storage/${item.bukti_bayar}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline text-xs font-bold flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                        Lihat Foto
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-400 text-xs italic">{item.keterangan || '-'}</span>
                                                )}
                                            </td>
                                            <td className="p-4 flex justify-center gap-2">
                                                <button onClick={() => handleApprove(item.id)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow transition flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                    Terima
                                                </button>
                                                <button onClick={() => handleReject(item.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow transition flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                                    Tolak
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="7" className="p-12 text-center text-gray-400 italic bg-gray-50">
                                                Tidak ada pembayaran yang menunggu persetujuan.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* --- KONTEN TAB 2: RIWAYAT LUNAS --- */}
                    {activeTab === 'history' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-700 uppercase font-bold border-b">
                                    <tr>
                                        <th className="p-4">Tanggal Bayar</th>
                                        <th className="p-4">Wali Santri</th>
                                        <th className="p-4">Bulan SPP</th>
                                        <th className="p-4">Nominal</th>
                                        <th className="p-4">Metode</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Pencatat</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {history.length > 0 ? history.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition">
                                            <td className="p-4 text-gray-500">{new Date(item.updated_at).toLocaleDateString('id-ID')}</td>
                                            <td className="p-4 font-bold text-gray-800">{item.user?.name}</td>
                                            <td className="p-4">
                                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">
                                                    {getBulanNama(item.bulan)} {item.tahun}
                                                </span>
                                            </td>
                                            <td className="p-4 font-bold text-gray-800">{formatRupiah(item.jumlah_bayar)}</td>
                                            <td className="p-4 text-xs uppercase text-gray-500">
                                                {item.tipe_pembayaran === 'admin_input' ? 'Tunai (Admin)' : item.tipe_pembayaran.replace('_', ' ')}
                                            </td>
                                            <td className="p-4">
                                                <span className="text-green-600 font-bold text-xs uppercase">LUNAS</span>
                                            </td>
                                            <td className="p-4 text-xs text-gray-500 italic">
                                                {item.pencatat ? item.pencatat.name : 'Sistem (Midtrans)'}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="7" className="p-12 text-center text-gray-400 italic bg-gray-50">
                                                Belum ada riwayat pembayaran lunas.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* --- KONTEN TAB 3: INPUT MANUAL --- */}
                    {activeTab === 'manual' && (
                        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200 mt-4">
                            <div className="flex items-center gap-3 mb-6 border-b pb-4">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 3.666A5.002 5.002 0 0112 21a5.002 5.002 0 01-5.5-5.5m0 0H9m1.5-1.5H9m1.5-1.5H9m1.5-1.5H9m4-1a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">Catat Pembayaran Tunai</h3>
                                    <p className="text-xs text-gray-500">Gunakan fitur ini jika Wali Santri membayar cash di sekolah.</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmitManual} className="space-y-6">
                                
                                {/* Pilih Siswa */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Pilih Wali Santri <span className="text-red-500">*</span></label>
                                    <select 
                                        className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                                        value={data.user_id}
                                        onChange={e => setData('user_id', e.target.value)}
                                        required
                                    >
                                        <option value="">-- Pilih Nama --</option>
                                        {users.map(u => (
                                            <option key={u.id} value={u.id}>{u.name}</option>
                                        ))}
                                    </select>
                                    {errors.user_id && <p className="text-red-500 text-xs mt-1">{errors.user_id}</p>}
                                </div>

                                {/* Pilih Bulan & Tahun */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Bulan SPP <span className="text-red-500">*</span></label>
                                        <select 
                                            className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                                            value={data.bulan}
                                            onChange={e => setData('bulan', e.target.value)}
                                            required
                                        >
                                            {[...Array(12)].map((_, i) => (
                                                <option key={i+1} value={i+1}>{getBulanNama(i+1)}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Tahun <span className="text-red-500">*</span></label>
                                        <input 
                                            type="number" 
                                            className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                                            value={data.tahun}
                                            onChange={e => setData('tahun', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Nominal & Keterangan */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Nominal (Rp) <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 font-bold">Rp</span>
                                        <input 
                                            type="number" 
                                            className="w-full pl-10 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm font-bold text-gray-800"
                                            value={data.jumlah_bayar}
                                            onChange={e => setData('jumlah_bayar', e.target.value)}
                                            placeholder="Contoh: 300000"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Keterangan (Opsional)</label>
                                    <textarea 
                                        className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                                        value={data.keterangan}
                                        onChange={e => setData('keterangan', e.target.value)}
                                        placeholder="Catatan tambahan (misal: Diserahkan oleh Ibu Budi)"
                                        rows="3"
                                    ></textarea>
                                </div>

                                <div className="flex justify-end pt-4 border-t">
                                    <button 
                                        type="submit" 
                                        disabled={processing}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {processing ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                Menyimpan...
                                            </>
                                        ) : 'Simpan Pembayaran'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}