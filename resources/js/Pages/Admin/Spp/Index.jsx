import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';

export default function AdminSppIndex({ auth, transactions, pending, students, filters }) {
    
    // --- STATE ---
    const [activeTab, setActiveTab] = useState('pending'); // Default ke tab Approval
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [filterBulan, setFilterBulan] = useState(filters.bulan || '');

    // --- STATE MODAL ---
    const [showManualModal, setShowManualModal] = useState(false);
    const [editingTrx, setEditingTrx] = useState(null); 

    // --- FORM 1: INPUT MANUAL ---
    const { 
        data: manualData, setData: setManualData, 
        post: postManual, processing: procManual, reset: resetManual 
    } = useForm({
        user_id: '', 
        bulan: new Date().getMonth() + 1, 
        tahun: new Date().getFullYear(), 
        jumlah_bayar: '', 
        keterangan: ''
    });

    // --- FORM 2: EDIT TRANSAKSI ---
    const { 
        data: editData, setData: setEditData, 
        put: putEdit, processing: procEdit, reset: resetEdit 
    } = useForm({
        nominal: '', 
        status: '', 
        keterangan: ''
    });

    // --- EFFECT: DEBOUNCE SEARCH (Hanya jalan di Tab History) ---
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm !== (filters.search || '') || filterBulan !== (filters.bulan || '')) {
                router.get(
                    route('admin.spp.index'),
                    { search: searchTerm, bulan: filterBulan },
                    { preserveState: true, preserveScroll: true, replace: true }
                );
            }
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, filterBulan]);

    // --- HANDLERS ---

    const handleManualSubmit = (e) => {
        e.preventDefault();
        postManual(route('admin.spp.manual'), {
            onSuccess: () => { 
                setShowManualModal(false); 
                resetManual(); 
                alert('Pembayaran berhasil dicatat!'); 
                setActiveTab('history');
            }
        });
    };

    const openEditModal = (item) => {
        setEditingTrx(item);
        setEditData({
            nominal: item.jumlah_bayar, // Pastikan ini sesuai kolom DB (jumlah_bayar/nominal)
            status: item.status,
            keterangan: item.keterangan || ''
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (!editingTrx) return;
        putEdit(route('admin.spp.update', editingTrx.id), {
            onSuccess: () => { setEditingTrx(null); resetEdit(); }
        });
    };

    const handleApprove = (id) => {
        if (confirm('Yakin ingin menerima pembayaran ini?')) {
            router.post(route('admin.spp.approve', id));
        }
    };

    const handleReject = (id) => {
        if (confirm('Yakin ingin menolak pembayaran ini?')) {
            router.post(route('admin.spp.reject', id));
        }
    };

    // Helper
    const formatRupiah = (angka) => {
        const value = Number(angka);
        return isNaN(value) ? 'Rp 0' : new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
    };
    
    const getNamaBulan = (angka) => {
        const date = new Date();
        date.setMonth(angka - 1);
        return date.toLocaleString('id-ID', { month: 'long' });
    };

    const listBulan = Array.from({length: 12}, (_, i) => i + 1);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800">Manajemen SPP</h2>}
        >
            <Head title="Manajemen SPP" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* --- TABS NAVIGATION --- */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex space-x-1 bg-gray-200 p-1 rounded-xl w-fit">
                            <button onClick={() => setActiveTab('pending')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'pending' ? 'bg-white text-blue-600 shadow' : 'text-gray-600 hover:bg-gray-300'}`}>
                                Butuh Approval 
                                {pending.length > 0 && <span className="ml-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse">{pending.length}</span>}
                            </button>
                            <button onClick={() => setActiveTab('history')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'history' ? 'bg-white text-blue-600 shadow' : 'text-gray-600 hover:bg-gray-300'}`}>
                                Daftar Transaksi
                            </button>
                            <button onClick={() => setActiveTab('manual')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'manual' ? 'bg-white text-blue-600 shadow' : 'text-gray-600 hover:bg-gray-300'}`}>
                                + Input Manual
                            </button>
                        </div>
                    </div>

                    {/* --- TAB 1: PENDING APPROVAL --- */}
                    {activeTab === 'pending' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-4 bg-yellow-50 border-b border-yellow-100 flex items-center gap-2 text-yellow-800 text-sm">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                <strong>Perhatian:</strong> Cek bukti transfer sebelum menyetujui.
                            </div>
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-3">Tanggal</th>
                                        <th className="px-6 py-3">Santri</th>
                                        <th className="px-6 py-3">Periode</th>
                                        <th className="px-6 py-3">Nominal</th>
                                        <th className="px-6 py-3">Bukti</th>
                                        <th className="px-6 py-3 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pending.length > 0 ? pending.map((item) => (
                                        <tr key={item.id} className="bg-white hover:bg-gray-50 border-b">
                                            <td className="px-6 py-4">{new Date(item.created_at).toLocaleDateString('id-ID')}</td>
                                            <td className="px-6 py-4 font-bold text-gray-900">{item.user?.name}</td>
                                            <td className="px-6 py-4"><span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">{getNamaBulan(item.bulan)} {item.tahun}</span></td>
                                            <td className="px-6 py-4 text-green-600 font-bold">{formatRupiah(item.jumlah_bayar)}</td>
                                            <td className="px-6 py-4">
                                                {item.bukti_bayar ? <a href={`/storage/${item.bukti_bayar}`} target="_blank" className="text-blue-600 hover:underline text-xs">Lihat Bukti</a> : <span className="text-gray-400 text-xs italic">-</span>}
                                            </td>
                                            <td className="px-6 py-4 flex justify-center gap-2">
                                                <button onClick={() => handleApprove(item.id)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-bold shadow">Terima</button>
                                                <button onClick={() => handleReject(item.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-bold shadow">Tolak</button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500 italic">Tidak ada pembayaran menunggu approval.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* --- TAB 2: DAFTAR TRANSAKSI (SEARCH & FILTER) --- */}
                    {activeTab === 'history' && (
                        <div className="space-y-4">
                            {/* Filter Bar */}
                            <div className="flex flex-col md:flex-row gap-2 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                <select value={filterBulan} onChange={(e) => setFilterBulan(e.target.value)} className="border-gray-300 rounded-lg text-sm focus:ring-blue-500">
                                    <option value="">Semua Bulan</option>
                                    {listBulan.map(b => <option key={b} value={b}>{getNamaBulan(b)}</option>)}
                                </select>
                                <input type="text" placeholder="Cari Nama Santri..." className="border-gray-300 rounded-lg text-sm w-full md:w-64 focus:ring-blue-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            </div>

                            {/* Table */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left text-gray-500">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                            <tr>
                                                <th className="px-6 py-3">Tanggal</th>
                                                <th className="px-6 py-3">Santri</th>
                                                <th className="px-6 py-3">Periode</th>
                                                <th className="px-6 py-3">Nominal</th>
                                                <th className="px-6 py-3">Status</th>
                                                <th className="px-6 py-3">Ket</th>
                                                <th className="px-6 py-3 text-center">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {transactions.data.length > 0 ? transactions.data.map((item) => (
                                                <tr key={item.id} className="bg-white hover:bg-gray-50">
                                                    <td className="px-6 py-4">{new Date(item.created_at).toLocaleDateString('id-ID')}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-gray-900">{item.user?.name}</div>
                                                        <div className="text-xs text-gray-400">{item.user?.email}</div>
                                                    </td>
                                                    <td className="px-6 py-4"><span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded border">{getNamaBulan(item.bulan)} {item.tahun}</span></td>
                                                    <td className="px-6 py-4 text-green-600 font-bold">{formatRupiah(item.jumlah_bayar)}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.status === 'approved' ? 'bg-green-100 text-green-700' : item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{item.status.toUpperCase()}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-xs italic max-w-xs truncate">{item.keterangan || '-'}</td>
                                                    <td className="px-6 py-4 text-center">
                                                        <button onClick={() => openEditModal(item)} className="text-blue-600 hover:text-blue-900 font-medium text-xs underline">Edit</button>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-500 italic">Data tidak ditemukan.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                {/* Pagination */}
                                {transactions.links && (
                                    <div className="p-4 border-t bg-gray-50 flex justify-center gap-1">
                                        {transactions.links.map((link, k) => (
                                            link.url ? (
                                                <Link key={k} href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} className={`px-3 py-1 text-xs border rounded transition ${link.active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 hover:bg-gray-100'}`} />
                                            ) : (
                                                <span key={k} dangerouslySetInnerHTML={{ __html: link.label }} className="px-3 py-1 text-xs border rounded bg-gray-100 text-gray-400 cursor-not-allowed" />
                                            )
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* --- TAB 3: INPUT MANUAL --- */}
                    {activeTab === 'manual' && (
                        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200 mt-4">
                            <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-4">Catat Pembayaran Tunai</h3>
                            <form onSubmit={handleManualSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Pilih Santri</label>
                                    <select className="w-full mt-1 border-gray-300 rounded-md" value={manualData.user_id} onChange={e => setManualData('user_id', e.target.value)} required>
                                        <option value="">-- Pilih Santri --</option>
                                        {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Bulan</label>
                                        <select className="w-full mt-1 border-gray-300 rounded-md" value={manualData.bulan} onChange={e => setManualData('bulan', e.target.value)}>{listBulan.map(b => <option key={b} value={b}>{getNamaBulan(b)}</option>)}</select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Tahun</label>
                                        <input type="number" className="w-full mt-1 border-gray-300 rounded-md" value={manualData.tahun} onChange={e => setManualData('tahun', e.target.value)} required />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nominal (Rp)</label>
                                    <input type="number" className="w-full mt-1 border-gray-300 rounded-md font-bold" value={manualData.jumlah_bayar} onChange={e => setManualData('jumlah_bayar', e.target.value)} placeholder="Contoh: 300000" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Keterangan</label>
                                    <textarea className="w-full mt-1 border-gray-300 rounded-md" value={manualData.keterangan} onChange={e => setManualData('keterangan', e.target.value)} rows="2"></textarea>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button disabled={procManual} className="px-4 py-2 bg-blue-600 text-white rounded-md font-bold hover:bg-blue-700">{procManual ? 'Menyimpan...' : 'Simpan Pembayaran'}</button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            {/* --- MODAL EDIT TRANSAKSI --- */}
            <Modal show={!!editingTrx} onClose={() => setEditingTrx(null)}>
                <div className="p-6">
                    <h2 className="text-lg font-bold mb-4 text-gray-900">Edit Data Transaksi</h2>
                    {editingTrx && <div className="bg-blue-50 p-3 rounded-lg mb-4 text-sm text-blue-800"><p><strong>Santri:</strong> {editingTrx.user?.name}</p><p><strong>Periode:</strong> {getNamaBulan(editingTrx.bulan)} {editingTrx.tahun}</p></div>}
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Status Pembayaran</label>
                            <select className="w-full mt-1 border-gray-300 rounded-md" value={editData.status} onChange={e => setEditData('status', e.target.value)}>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved (Lunas)</option>
                                <option value="rejected">Rejected (Ditolak)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nominal (Rp)</label>
                            <input type="number" className="w-full mt-1 border-gray-300 rounded-md font-bold" value={editData.nominal} onChange={e => setEditData('nominal', e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Keterangan</label>
                            <textarea className="w-full mt-1 border-gray-300 rounded-md" value={editData.keterangan} onChange={e => setEditData('keterangan', e.target.value)} rows="3"></textarea>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button type="button" onClick={() => setEditingTrx(null)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-300">Batal</button>
                            <button type="submit" disabled={procEdit} className="px-4 py-2 bg-blue-600 text-white rounded-md font-bold hover:bg-blue-700">{procEdit ? 'Menyimpan...' : 'Simpan Perubahan'}</button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}