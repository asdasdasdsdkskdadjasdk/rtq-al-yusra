import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';

export default function AdminUangMasuk({ auth, history, siswa, pending }) {
    const [activeTab, setActiveTab] = useState(pending.length > 0 ? 'pending' : 'siswa');
    const [detailUser, setDetailUser] = useState(null);    
    const [showManualModal, setShowManualModal] = useState(false);

    // --- FORMS ---
    // 1. Input Transaksi Manual
    const { data: manualData, setData: setManualData, post: postManual, processing: procManual, reset: resetManual } = useForm({
        uang_masuk_id: '', jumlah_bayar: '', keterangan: '', tanggal_bayar: new Date().toISOString().split('T')[0]
    });

    // 2. Bayar Cepat
    const { data: payData, setData: setPayData, post: postPay, processing: procPay, reset: resetPay } = useForm({
        jumlah_bayar: '', keterangan: '', tanggal_bayar: new Date().toISOString().split('T')[0]
    });

    // --- HANDLERS ---
    const handleManualTransaction = (e) => {
        e.preventDefault();
        if(!manualData.uang_masuk_id) return alert("Pilih santri dulu.");
        postManual(route('admin.uang_masuk.pay', manualData.uang_masuk_id), {
            onSuccess: () => { resetManual(); setShowManualModal(false); }
        });
    };

    const handleBayarDetail = (e) => {
        e.preventDefault();
        postPay(route('admin.uang_masuk.pay', detailUser.id), {
            onSuccess: () => { resetPay(); setDetailUser(null); }
        });
    };

    const handleUpdateStatus = (newStatus) => {
        if(!confirm(`Ubah status jadi ${newStatus}?`)) return;
        router.post(route('admin.uang_masuk.update_status', detailUser.id), { status: newStatus }, {
            onSuccess: () => setDetailUser(prev => ({...prev, status_kalkulasi: newStatus})),
            preserveScroll: true
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Keuangan Uang Masuk" />

            <div className="space-y-6">
                
                {/* HEADER INFO */}
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-600">
                    <h2 className="text-xl font-bold text-gray-800">Tagihan Uang Masuk (Per Program)</h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Nominal tagihan otomatis mengikuti <strong>Program Studi</strong> masing-masing santri. 
                        Program dengan nama <strong>"Beasiswa"</strong> otomatis Gratis/Lunas.
                    </p>
                </div>

                {/* TABS */}
                <div className="flex space-x-1 rounded-xl bg-gray-200 p-1 w-fit">
                    <button onClick={() => setActiveTab('pending')} className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex gap-2 ${activeTab === 'pending' ? 'bg-white shadow text-red-600 font-bold' : 'text-gray-600'}`}>Approve {pending.length > 0 && <span className="bg-red-600 text-white text-xs px-2 rounded-full">{pending.length}</span>}</button>
                    <button onClick={() => setActiveTab('siswa')} className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'siswa' ? 'bg-white shadow text-blue-700' : 'text-gray-600'}`}>Daftar Siswa</button>
                    <button onClick={() => setActiveTab('history')} className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'history' ? 'bg-white shadow text-blue-700' : 'text-gray-600'}`}>History</button>
                </div>

                {/* TAB 1: PENDING */}
                {activeTab === 'pending' && (
                    <div className="bg-white p-6 rounded-xl shadow-sm overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-700 uppercase"><tr><th className="p-3">Wali</th><th className="p-3">Jml</th><th className="p-3">Bukti</th><th className="p-3">Aksi</th></tr></thead>
                            <tbody>
                                {pending.map((item) => (
                                    <tr key={item.id} className="border-b"><td className="p-3 font-bold">{item.uang_masuk?.user?.name}</td><td className="p-3 text-green-600">Rp {parseInt(item.jumlah_bayar).toLocaleString()}</td><td className="p-3">{item.bukti_bayar ? <a href={`/storage/${item.bukti_bayar}`} target="_blank" className="text-blue-500 underline">Lihat</a> : '-'}</td><td className="p-3 flex gap-2"><Link href={route('admin.uang_masuk.approve', item.id)} method="post" as="button" className="bg-green-500 text-white px-2 py-1 rounded text-xs">Terima</Link><Link href={route('admin.uang_masuk.reject', item.id)} method="post" as="button" className="bg-red-500 text-white px-2 py-1 rounded text-xs" onSuccess={() => confirm('Tolak?')}>Tolak</Link></td></tr>
                                ))}
                                {pending.length === 0 && <tr><td colSpan="4" className="p-6 text-center text-gray-400">Kosong.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* TAB 2: DAFTAR SISWA (MAIN) */}
                {activeTab === 'siswa' && (
                    <div className="bg-white p-6 rounded-xl shadow-sm overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-700 uppercase"><tr><th className="p-3">Wali & Program</th><th className="p-3">Tagihan</th><th className="p-3">Dibayar</th><th className="p-3">Sisa</th><th className="p-3">Status</th><th className="p-3 text-center">Aksi</th></tr></thead>
                            <tbody>
                                {siswa.map((item) => (
                                    <tr key={item.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => setDetailUser(item)}>
                                        <td className="p-3">
                                            <div className="font-bold text-blue-600 hover:underline">{item.user.name}</div>
                                            <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200">{item.nama_program}</span>
                                        </td>
                                        <td className="p-3 font-medium">
                                            {item.is_beasiswa ? <span className="text-purple-600 font-bold">Beasiswa (Rp 0)</span> : `Rp ${item.total_tagihan.toLocaleString()}`}
                                        </td>
                                        <td className="p-3 text-green-600 font-bold">Rp {parseInt(item.sudah_dibayar).toLocaleString()}</td>
                                        <td className="p-3 text-red-600">{item.is_beasiswa ? '-' : `Rp ${item.sisa.toLocaleString()}`}</td>
                                        <td className="p-3"><span className={`px-2 py-1 rounded text-xs font-bold ${item.status_kalkulasi === 'Lunas' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{item.status_kalkulasi}</span></td>
                                        <td className="p-3 text-center"><button className="text-xs bg-gray-100 px-3 py-1 rounded">Detail</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* TAB 3: HISTORY */}
                {activeTab === 'history' && (
                    <div className="bg-white p-6 rounded-xl shadow-sm overflow-x-auto">
                        <div className="flex justify-between mb-4"><h3 className="font-bold">History</h3><button onClick={() => setShowManualModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded text-xs font-bold">+ Manual</button></div>
                        <table className="w-full text-sm text-left"><thead className="bg-gray-50 text-gray-700 uppercase"><tr><th className="p-3">Tgl</th><th className="p-3">Nama</th><th className="p-3">Jml</th><th className="p-3">Ket</th><th className="p-3">Oleh</th></tr></thead><tbody>{history.map((item) => (<tr key={item.id} className="border-b hover:bg-gray-50"><td className="p-3 text-gray-500">{new Date(item.tanggal_bayar).toLocaleDateString()}</td><td className="p-3 font-medium">{item.uang_masuk?.user?.name}</td><td className="p-3 text-green-600 font-bold">+ {parseInt(item.jumlah_bayar).toLocaleString()}</td><td className="p-3 text-gray-500 italic">{item.keterangan}</td><td className="p-3 text-xs">{item.pencatat?.name ?? 'Sistem'}</td></tr>))}</tbody></table>
                    </div>
                )}
            </div>

            {/* MODAL 1: INPUT MANUAL */}
            <Modal show={showManualModal} onClose={() => setShowManualModal(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-bold mb-4">Input Manual</h2>
                    <form onSubmit={handleManualTransaction} className="space-y-4">
                        <select className="w-full border rounded p-2" value={manualData.uang_masuk_id} onChange={e => setManualData('uang_masuk_id', e.target.value)} required><option value="">-- Pilih Santri --</option>{siswa.map(s => <option key={s.id} value={s.id}>{s.user.name}</option>)}</select>
                        <div className="grid grid-cols-2 gap-2"><input type="date" className="w-full border rounded p-2" value={manualData.tanggal_bayar} onChange={e => setManualData('tanggal_bayar', e.target.value)} required /><input type="number" className="w-full border rounded p-2" value={manualData.jumlah_bayar} onChange={e => setManualData('jumlah_bayar', e.target.value)} placeholder="Rp" required /></div>
                        <textarea className="w-full border rounded p-2" value={manualData.keterangan} onChange={e => setManualData('keterangan', e.target.value)} placeholder="Keterangan" required></textarea>
                        <div className="flex justify-end gap-2"><button type="button" onClick={() => setShowManualModal(false)} className="px-4 py-2 bg-gray-200 rounded">Batal</button><button disabled={procManual} className="px-4 py-2 bg-blue-600 text-white rounded">Simpan</button></div>
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
                                <div className="text-sm font-medium text-blue-600">{detailUser.nama_program}</div>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-xs font-bold text-gray-500 uppercase">Status:</span>
                                    <select className={`text-xs font-bold border-gray-300 rounded py-1 pl-2 pr-8 cursor-pointer shadow-sm focus:ring-blue-500 ${detailUser.status_kalkulasi === 'Lunas' ? 'text-green-700 bg-green-50' : 'text-yellow-700 bg-yellow-50'}`} value={detailUser.status_kalkulasi} onChange={(e) => handleUpdateStatus(e.target.value)}>
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
                                <div className="grid grid-cols-3 gap-2 mb-2"><input type="date" className="col-span-1 w-full border rounded p-1.5 text-xs" value={payData.tanggal_bayar} onChange={e => setPayData('tanggal_bayar', e.target.value)} /><input type="number" placeholder="Nominal" className="col-span-2 w-full border rounded p-1.5 text-xs" value={payData.jumlah_bayar} onChange={e => setPayData('jumlah_bayar', e.target.value)} /></div>
                                <div className="flex gap-2"><input type="text" placeholder="Keterangan" className="flex-1 border rounded p-1.5 text-xs" value={payData.keterangan} onChange={e => setPayData('keterangan', e.target.value)} /><button disabled={procPay} className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold">+ Simpan</button></div>
                            </form>
                        )}

                        <div className="max-h-60 overflow-y-auto border rounded-lg">
                            <table className="w-full text-sm text-left"><thead className="bg-gray-100 sticky top-0"><tr><th className="p-2">Tgl</th><th className="p-2">Jml</th><th className="p-2">Ket</th></tr></thead><tbody>{detailUser.riwayat.map(r => (<tr key={r.id} className="border-b"><td className="p-2 text-xs">{new Date(r.tanggal_bayar).toLocaleDateString()}</td><td className="p-2 font-bold text-green-600">{parseInt(r.jumlah_bayar).toLocaleString()}</td><td className="p-2 text-xs">{r.keterangan}</td></tr>))}</tbody></table>
                        </div>
                        <div className="mt-4 text-right"><button onClick={() => setDetailUser(null)} className="text-gray-500 hover:text-gray-800 text-sm">Tutup</button></div>
                    </div>
                )}
            </Modal>
        </AuthenticatedLayout>
    );
}