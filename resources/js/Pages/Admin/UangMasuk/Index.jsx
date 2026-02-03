import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';

export default function AdminUangMasuk({ auth, history, siswa, pending, filters }) {

    // --- STATE ---
    const [activeTab, setActiveTab] = useState(pending.length > 0 ? 'pending' : 'siswa');
    const [detailUser, setDetailUser] = useState(null);
    const [showManualModal, setShowManualModal] = useState(false);
    const [editingRiwayat, setEditingRiwayat] = useState(null);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    // --- FORMS ---

    // 1. Form Input Transaksi Manual
    const {
        data: manualData, setData: setManualData,
        post: postManual, processing: procManual, reset: resetManual, transform: transformManual
    } = useForm({
        uang_masuk_id: '',
        jumlah_bayar: '',
        keterangan: '',
        tanggal_bayar: new Date().toISOString().split('T')[0]
    });

    // 2. Form Bayar Cepat (Di dalam Modal Detail)
    const {
        data: payData, setData: setPayData,
        post: postPay, processing: procPay, reset: resetPay, transform: transformPay
    } = useForm({
        jumlah_bayar: '',
        keterangan: '',
        tanggal_bayar: new Date().toISOString().split('T')[0]
    });

    // 3. Form Edit Riwayat
    const {
        data: editData, setData: setEditData,
        put: putEdit, processing: procEdit,
        reset: resetEdit, errors: errorsEdit, transform: transformEdit
    } = useForm({
        jumlah_bayar: '',
        tanggal_bayar: '',
        keterangan: ''
    });

    // --- HELPER FORMAT CURRENCY INPUT ---
    const formatCurrencyInput = (value) => {
        return value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    // --- EFFECTS ---

    // 1. Search Debounce
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm !== (filters.search || '')) {
                router.get(
                    route('admin.uang_masuk.index'),
                    { search: searchTerm },
                    { preserveState: true, preserveScroll: true, replace: true }
                );
            }
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    // 2. Real-time Update Modal Detail
    useEffect(() => {
        if (detailUser) {
            const updatedUser = siswa.find(s => s.id === detailUser.id);
            if (updatedUser) {
                setDetailUser(updatedUser);
            }
        }
    }, [siswa]);

    // --- HANDLERS ---

    const handleManualTransaction = (e) => {
        e.preventDefault();
        if (!manualData.uang_masuk_id) return alert("Pilih santri dulu.");
        transformManual((data) => ({
            ...data,
            jumlah_bayar: data.jumlah_bayar.toString().replace(/\./g, '')
        }));
        postManual(route('admin.uang_masuk.pay', manualData.uang_masuk_id), {
            onSuccess: () => { resetManual(); setShowManualModal(false); }
        });
    };

    const handleBayarDetail = (e) => {
        e.preventDefault();
        transformPay((data) => ({
            ...data,
            jumlah_bayar: data.jumlah_bayar.toString().replace(/\./g, '')
        }));
        postPay(route('admin.uang_masuk.pay', detailUser.id), {
            onSuccess: () => resetPay()
        });
    };

    const handleUpdateStatus = (newStatus) => {
        if (!confirm(`Ubah status jadi ${newStatus}?`)) return;
        router.post(route('admin.uang_masuk.update_status', detailUser.id), { status: newStatus }, {
            preserveScroll: true
        });
    };

    const openEditRiwayat = (item) => {
        setEditingRiwayat(item);
        setEditData({
            jumlah_bayar: formatCurrencyInput(item.jumlah_bayar.toString()), // FORMAT AWAL
            tanggal_bayar: item.tanggal_bayar ? item.tanggal_bayar.split(' ')[0] : '',
            keterangan: item.keterangan || ''
        });
    };

    const handleUpdateRiwayat = (e) => {
        e.preventDefault();
        if (!editingRiwayat) return;

        transformEdit((data) => ({
            ...data,
            jumlah_bayar: data.jumlah_bayar.toString().replace(/\./g, '')
        }));
        putEdit(route('admin.uang_masuk.riwayat.update', editingRiwayat.id), {
            onSuccess: () => { setEditingRiwayat(null); resetEdit(); }
        });
    };

    // --- FIX: FUNGSI DELETE ---
    const handleDeleteRiwayat = (id) => {
        if (confirm('YAKIN INGIN MENGHAPUS? Data tagihan siswa akan dihitung ulang secara otomatis.')) {
            router.delete(route('admin.uang_masuk.riwayat.destroy', id), {
                preserveScroll: true,
                onSuccess: () => {
                    // Data otomatis refresh via Inertia props
                }
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Keuangan Uang Masuk" />

            <div className="space-y-6">

                {/* HEADER INFO */}
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-600">
                    <h2 className="text-xl font-bold text-gray-800">Tagihan Uang Masuk (Per Program)</h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Nominal tagihan otomatis mengikuti <strong>Program Studi</strong> masing-masing santri.
                        Program dengan nama <strong>"Beasiswa"</strong> otomatis Gratis/Lunas.
                    </p>
                </div>

                {/* CONTROLS */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex space-x-1 rounded-xl bg-gray-200 p-1 w-fit">
                        <button onClick={() => setActiveTab('pending')} className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex gap-2 ${activeTab === 'pending' ? 'bg-white shadow text-red-600 font-bold' : 'text-gray-600'}`}>
                            Approve {pending.length > 0 && <span className="bg-red-600 text-white text-xs px-2 rounded-full">{pending.length}</span>}
                        </button>
                        <button onClick={() => setActiveTab('siswa')} className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'siswa' ? 'bg-white shadow text-orange-700' : 'text-gray-600'}`}>
                            Daftar Siswa
                        </button>
                        <button onClick={() => setActiveTab('history')} className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'history' ? 'bg-white shadow text-orange-700' : 'text-gray-600'}`}>
                            History
                        </button>
                    </div>
                    <div className="w-full sm:w-64">
                        <input type="text" placeholder="Cari Nama Siswa..." className="w-full border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-lg shadow-sm text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                </div>

                {/* TAB 1: PENDING */}
                {activeTab === 'pending' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3">Wali</th>
                                    <th className="px-6 py-3">Jml</th>
                                    <th className="px-6 py-3">Bukti</th>
                                    <th className="px-6 py-3 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {pending.length > 0 ? pending.map((item) => (
                                    <tr key={item.id} className="bg-white hover:bg-gray-50 border-b">
                                        <td className="px-6 py-4 font-bold text-gray-900">{item.uang_masuk?.user?.name}</td>
                                        <td className="px-6 py-4 text-green-600 font-bold">Rp {parseInt(item.jumlah_bayar).toLocaleString()}</td>
                                        <td className="px-6 py-4">{item.bukti_bayar ? <a href={`/storage/${item.bukti_bayar}`} target="_blank" className="text-orange-600 hover:underline text-xs">Lihat Bukti</a> : <span className="text-gray-400 italic">-</span>}</td>
                                        <td className="px-6 py-4 flex justify-center gap-2">
                                            <Link href={route('admin.uang_masuk.approve', item.id)} method="post" as="button" className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-bold shadow">Terima</Link>
                                            <Link href={route('admin.uang_masuk.reject', item.id)} method="post" as="button" className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-bold shadow" onSuccess={() => confirm('Tolak?')}>Tolak</Link>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500 italic">Tidak ada pembayaran menunggu konfirmasi.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* TAB 2: DAFTAR SISWA */}
                {activeTab === 'siswa' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3">Wali & Program</th>
                                    <th className="px-6 py-3">Tagihan</th>
                                    <th className="px-6 py-3">Dibayar</th>
                                    <th className="px-6 py-3">Sisa</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {siswa.length > 0 ? siswa.map((item) => (
                                    <tr key={item.id} className="bg-white hover:bg-gray-50 cursor-pointer" onClick={() => setDetailUser(item)}>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-orange-600 hover:underline">{item.user.name}</div>
                                            <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200">{item.nama_program}</span>
                                        </td>
                                        <td className="px-6 py-4 font-medium">{item.is_beasiswa ? <span className="text-purple-600 font-bold">Beasiswa (Rp 0)</span> : `Rp ${item.total_tagihan.toLocaleString()}`}</td>
                                        <td className="px-6 py-4 text-green-600 font-bold">Rp {parseInt(item.sudah_dibayar).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-red-600 font-bold">{item.is_beasiswa ? '-' : `Rp ${item.sisa.toLocaleString()}`}</td>
                                        <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-bold ${item.status_kalkulasi === 'Lunas' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{item.status_kalkulasi}</span></td>
                                        <td className="px-6 py-4 text-center"><button className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded font-bold shadow-sm">Detail</button></td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500 italic">Data siswa tidak ditemukan.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* TAB 3: HISTORY */}
                {activeTab === 'history' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                            <h3 className="font-bold text-gray-700">History Pembayaran</h3>
                            <button onClick={() => setShowManualModal(true)} className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow transition">+ Input Manual</button>
                        </div>
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3">Tgl</th>
                                    <th className="px-6 py-3">Nama</th>
                                    <th className="px-6 py-3">Jml</th>
                                    <th className="px-6 py-3">Ket</th>
                                    <th className="px-6 py-3">Oleh</th>
                                    <th className="px-6 py-3 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {history.length > 0 ? history.map((item) => (
                                    <tr key={item.id} className="bg-white hover:bg-gray-50 border-b">
                                        <td className="px-6 py-4">{new Date(item.tanggal_bayar).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 font-bold text-gray-900">{item.uang_masuk?.user?.name}</td>
                                        <td className="px-6 py-4 text-green-600 font-bold">+ {parseInt(item.jumlah_bayar).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-gray-500 italic max-w-xs truncate">{item.keterangan}</td>
                                        <td className="px-6 py-4 text-xs">{item.pencatat?.name ?? 'Sistem'}</td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => openEditRiwayat(item)} className="bg-orange-50 text-orange-700 hover:bg-orange-100 px-3 py-1 rounded font-bold text-xs transition">Edit</button>
                                                {/* FIX: Gunakan handleDeleteRiwayat, bukan deleteHistory */}
                                                <button onClick={() => handleDeleteRiwayat(item.id)} className="bg-red-50 text-red-700 hover:bg-red-100 px-3 py-1 rounded font-bold text-xs transition">Hapus</button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500 italic">Belum ada riwayat pembayaran yang cocok.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* MODAL 1: INPUT MANUAL */}
            <Modal show={showManualModal} onClose={() => setShowManualModal(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-bold mb-4">Input Pembayaran Manual</h2>
                    <form onSubmit={handleManualTransaction} className="space-y-4">
                        <select className="w-full border rounded p-2" value={manualData.uang_masuk_id} onChange={e => setManualData('uang_masuk_id', e.target.value)} required>
                            <option value="">-- Pilih Santri --</option>
                            {siswa.map(s => <option key={s.id} value={s.id}>{s.user.name}</option>)}
                        </select>
                        <div className="grid grid-cols-2 gap-2">
                            <input type="date" className="w-full border rounded p-2" value={manualData.tanggal_bayar} onChange={e => setManualData('tanggal_bayar', e.target.value)} required />
                            <input
                                type="text"
                                className="w-full border rounded p-2"
                                value={manualData.jumlah_bayar}
                                onChange={e => setManualData('jumlah_bayar', formatCurrencyInput(e.target.value))}
                                placeholder="Nominal (Rp)"
                                required
                            />
                        </div>
                        <textarea className="w-full border rounded p-2" value={manualData.keterangan} onChange={e => setManualData('keterangan', e.target.value)} placeholder="Keterangan (Opsional)" required></textarea>
                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setShowManualModal(false)} className="px-4 py-2 bg-gray-200 rounded">Batal</button>
                            <button disabled={procManual} className="px-4 py-2 bg-orange-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed">{procManual ? 'Menyimpan...' : 'Simpan'}</button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* MODAL 2: DETAIL USER */}
            <Modal show={!!detailUser} onClose={() => setDetailUser(null)}>
                {detailUser && (
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{detailUser.user.name}</h3>
                                <div className="text-sm font-medium text-orange-600">{detailUser.nama_program}</div>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-xs font-bold text-gray-500 uppercase">Status:</span>
                                    <select className={`text-xs font-bold border-gray-300 rounded py-1 pl-2 pr-8 cursor-pointer shadow-sm focus:ring-orange-500 ${detailUser.status_kalkulasi === 'Lunas' ? 'text-green-700 bg-green-50' : 'text-yellow-700 bg-yellow-50'}`} value={detailUser.status_kalkulasi} onChange={(e) => handleUpdateStatus(e.target.value)}>
                                        <option value="Belum Lunas">Belum Lunas</option>
                                        <option value="Lunas">Lunas</option>
                                    </select>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500">Tagihan {detailUser.nama_program}</p>
                                <p className="font-bold text-xl">{detailUser.is_beasiswa ? 'Gratis' : `Rp ${detailUser.total_tagihan.toLocaleString()}`}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-green-50 p-3 rounded-lg"><p className="text-xs text-green-700">Sudah Masuk</p><p className="text-lg font-bold text-green-700">Rp {detailUser.sudah_dibayar.toLocaleString()}</p></div>
                            <div className="bg-red-50 p-3 rounded-lg"><p className="text-xs text-red-700">Sisa Tagihan</p><p className="text-lg font-bold text-red-700">{detailUser.is_beasiswa ? '-' : `Rp ${detailUser.sisa.toLocaleString()}`}</p></div>
                        </div>

                        {!detailUser.is_beasiswa && (
                            <form onSubmit={handleBayarDetail} className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                                <h4 className="font-bold text-sm mb-2 text-gray-700">Input Bayar Cepat</h4>
                                <div className="grid grid-cols-3 gap-2 mb-2">
                                    <input type="date" className="col-span-1 w-full border rounded p-1.5 text-xs" value={payData.tanggal_bayar} onChange={e => setPayData('tanggal_bayar', e.target.value)} />
                                    <input
                                        type="text"
                                        placeholder="Nominal"
                                        className="col-span-2 w-full border rounded p-1.5 text-xs"
                                        value={payData.jumlah_bayar}
                                        onChange={e => setPayData('jumlah_bayar', formatCurrencyInput(e.target.value))}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <input type="text" placeholder="Keterangan" className="flex-1 border rounded p-1.5 text-xs" value={payData.keterangan} onChange={e => setPayData('keterangan', e.target.value)} />
                                    <button disabled={procPay} className="bg-orange-600 text-white px-3 py-1 rounded text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed">{procPay ? 'Proses...' : '+ Simpan'}</button>
                                </div>
                            </form>
                        )}

                        <div className="max-h-60 overflow-y-auto border rounded-lg">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-100 sticky top-0"><tr><th className="p-2">Tgl</th><th className="p-2">Jml</th><th className="p-2">Ket</th><th className="p-2 text-center">Aksi</th></tr></thead>
                                <tbody>
                                    {detailUser.riwayat.map(r => (
                                        <tr key={r.id} className="border-b">
                                            <td className="p-2 text-xs">{new Date(r.tanggal_bayar).toLocaleDateString()}</td>
                                            <td className="p-2 font-bold text-green-600">{parseInt(r.jumlah_bayar).toLocaleString()}</td>
                                            <td className="p-2 text-xs">{r.keterangan}</td>
                                            <td className="p-2 text-center flex justify-center gap-2">
                                                <button onClick={() => openEditRiwayat(r)} className="text-orange-600 hover:text-orange-800 text-xs font-bold underline">Edit</button>
                                                {/* FIX: Gunakan handleDeleteRiwayat, bukan deleteHistory */}
                                                <button onClick={() => handleDeleteRiwayat(r.id)} className="text-red-600 hover:text-red-800 text-xs font-bold underline">Hapus</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-4 text-right"><button onClick={() => setDetailUser(null)} className="text-gray-500 hover:text-gray-800 text-sm">Tutup</button></div>
                    </div>
                )}
            </Modal>

            {/* MODAL 3: EDIT RIWAYAT */}
            <Modal show={!!editingRiwayat} onClose={() => setEditingRiwayat(null)}>
                <div className="p-6">
                    <h2 className="text-lg font-bold mb-4">Edit Riwayat Pembayaran</h2>
                    <form onSubmit={handleUpdateRiwayat} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tanggal Bayar</label>
                            <input type="date" className="w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500" value={editData.tanggal_bayar} onChange={(e) => setEditData('tanggal_bayar', e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nominal Bayar (Rp)</label>
                            <input
                                type="text"
                                className="w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                value={editData.jumlah_bayar}
                                onChange={(e) => setEditData('jumlah_bayar', formatCurrencyInput(e.target.value))}
                                required
                            />
                            {errorsEdit.jumlah_bayar && <div className="text-red-500 text-xs mt-1">{errorsEdit.jumlah_bayar}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Keterangan</label>
                            <input type="text" className="w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500" value={editData.keterangan} onChange={(e) => setEditData('keterangan', e.target.value)} placeholder="Contoh: Transfer via BCA..." />
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button type="button" onClick={() => setEditingRiwayat(null)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-300 transition">Batal</button>
                            <button type="submit" disabled={procEdit} className="px-4 py-2 bg-orange-600 text-white rounded-md font-medium hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed">{procEdit ? 'Menyimpan...' : 'Simpan Perubahan'}</button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}