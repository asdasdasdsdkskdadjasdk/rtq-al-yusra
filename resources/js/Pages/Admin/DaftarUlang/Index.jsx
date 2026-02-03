import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';

export default function AdminDaftarUlangIndex({ auth, students, cabangs, filters, tahunList }) {

    // --- STATE ---
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [filterCabang, setFilterCabang] = useState(filters.cabang || '');
    const [filterStatus, setFilterStatus] = useState(filters.status || '');
    const [filterTahun, setFilterTahun] = useState(filters.tahun || new Date().getFullYear());

    // --- STATE MODAL ---
    const [showTagihanModal, setShowTagihanModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [bulkNominal, setBulkNominal] = useState('');

    // --- FORM BUAT TAGIHAN ---
    const { data, setData, post, processing, reset, errors, transform } = useForm({
        user_id: '',
        tahun: filterTahun,
        nominal_tagihan: ''
    });

    // --- HELPER FORMAT CURRENCY INPUT ---
    const formatCurrencyInput = (value) => {
        return value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    // --- EFFECT: DEBOUNCE SEARCH ---
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            router.get(
                route('admin.daftar-ulang.index'),
                {
                    search: searchTerm,
                    cabang: filterCabang,
                    status: filterStatus,
                    tahun: filterTahun
                },
                { preserveState: true, preserveScroll: true, replace: true }
            );
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, filterCabang, filterStatus, filterTahun]);

    // --- HANDLERS ---
    const openTagihanModal = (student) => {
        setSelectedStudent(student);
        setData({
            user_id: student.user_id,
            tahun: filterTahun,
            nominal_tagihan: student.nominal_tagihan ? formatCurrencyInput(student.nominal_tagihan.toString()) : '' // Pre-fill if exists
        });
        setShowTagihanModal(true);
    };

    const submitTagihan = (e) => {
        e.preventDefault();
        transform((data) => ({
            ...data,
            nominal_tagihan: data.nominal_tagihan.toString().replace(/\./g, '')
        }));
        post(route('admin.daftar-ulang.store'), {
            onSuccess: () => {
                setShowTagihanModal(false);
                reset();
                setSelectedStudent(null);
            }
        });
    };

    const handleBulkSubmit = (e) => {
        e.preventDefault();
        router.post(route('admin.daftar-ulang.store_bulk'), {
            tahun: filterTahun,
            nominal_tagihan: bulkNominal.replace(/\./g, '')
        }, {
            onSuccess: () => {
                setShowBulkModal(false);
                setBulkNominal('');
            }
        });
    };

    const handleUpdateStatus = () => {
        if (confirm(`PERINGATAN KERAS!\n\nAnda akan mengubah status santri yang TIDAK MEMBAYAR daftar ulang pada tahun ${filterTahun} ini menjadi 'Mantan Santri'.\n\nSantri tersebut tidak akan dianggap aktif lagi di Dashboard.\n\nLanjutkan?`)) {
            router.post(route('admin.daftar-ulang.update_status_nonaktif'), {
                tahun: filterTahun
            });
        }
    };

    const handleVerify = (id, status) => {
        if (confirm(`Yakin ingin mengubah status menjadi ${status}?`)) {
            router.post(route('admin.daftar-ulang.verify', id), { status });
        }
    };

    const formatRupiah = (angka) => {
        const value = Number(angka);
        return isNaN(value) ? 'Rp 0' : new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800">Daftar Ulang Tahunan</h2>}
        >
            <Head title="Manajemen Daftar Ulang" />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* TOP ACTION BAR */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                        <div className="bg-orange-50 text-orange-800 px-4 py-3 rounded-xl border border-orange-200 text-sm flex items-center gap-3">
                            <div className="bg-white p-1.5 rounded-full shadow-sm text-alyusra-orange">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <span>Pastikan memilih <b>Tahun</b> yang benar sebelum melakukan aksi massal.</span>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                            <button
                                onClick={() => setShowBulkModal(true)}
                                className="bg-alyusra-orange hover:bg-orange-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-orange-200 flex items-center gap-2 transition transform hover:-translate-y-0.5"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                Generate Tagihan Massal
                            </button>
                            <button
                                onClick={handleUpdateStatus}
                                className="bg-white border border-red-200 text-red-600 hover:bg-red-50 px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm flex items-center gap-2 transition"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                Bersih-bersih Santri
                            </button>
                        </div>
                    </div>

                    {/* FILTER BAR */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex gap-3 w-full md:w-auto flex-wrap">
                            <select value={filterTahun} onChange={(e) => setFilterTahun(e.target.value)} className="border-gray-200 bg-gray-50 rounded-lg text-sm focus:ring-alyusra-orange focus:border-alyusra-orange font-bold text-gray-700">
                                {tahunList.map(t => <option key={t} value={t}>Tahun Ajaran {t}</option>)}
                            </select>
                            <select value={filterCabang} onChange={(e) => setFilterCabang(e.target.value)} className="border-gray-200 bg-gray-50 rounded-lg text-sm focus:ring-alyusra-orange focus:border-alyusra-orange">
                                <option value="">Semua Cabang</option>
                                {cabangs.map(c => <option key={c.id} value={c.nama}>{c.nama}</option>)}
                            </select>
                            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border-gray-200 bg-gray-50 rounded-lg text-sm focus:ring-alyusra-orange focus:border-alyusra-orange">
                                <option value="">Semua Status</option>
                                <option value="Belum Ditagih">Belum Ditagih</option>
                                <option value="Sudah Ditagih">Sudah Ditagih</option>
                                <option value="pending">Menunggu Verifikasi</option>
                                <option value="lunas">Lunas</option>
                            </select>
                        </div>
                        <div className="relative w-full md:w-64">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Cari Nama Santri..."
                                className="pl-10 border-gray-200 bg-gray-50 rounded-lg text-sm w-full focus:ring-alyusra-orange focus:border-alyusra-orange"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border border-gray-100">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">Nama Santri</th>
                                        <th className="px-6 py-4 font-semibold">Cabang</th>
                                        <th className="px-6 py-4 font-semibold">Tagihan</th>
                                        <th className="px-6 py-4 font-semibold">Status</th>
                                        <th className="px-6 py-4 font-semibold">Bukti</th>
                                        <th className="px-6 py-4 font-semibold text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {students.data.length > 0 ? students.data.map((item) => (
                                        <tr key={item.pendaftar_id} className="bg-white hover:bg-gray-50 transition duration-150">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-800">{item.nama}</div>
                                                <div className="text-xs text-gray-400 mt-0.5">{item.no_hp}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">{item.cabang}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.tagihan_id ? (
                                                    <span className="font-bold text-gray-900 bg-green-50 px-2 py-1 rounded border border-green-100">{formatRupiah(item.nominal_tagihan)}</span>
                                                ) : (
                                                    <span className="text-gray-400 italic font-light text-xs">Belum diset</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {!item.tagihan_id ? (
                                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-500">Belum Ditagih</span>
                                                ) : item.status_bayar === 'lunas' ? (
                                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 flex items-center gap-1 w-fit">
                                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                                        LUNAS
                                                    </span>
                                                ) : item.status_bayar === 'pending' ? (
                                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 flex items-center gap-1 w-fit animate-pulse">
                                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                        Menunggu
                                                    </span>
                                                ) : (
                                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">{item.status_bayar.toUpperCase()}</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.bukti_bayar ? (
                                                    <a href={`/storage/${item.bukti_bayar}`} target="_blank" className="text-blue-600 hover:text-blue-800 hover:underline text-xs font-bold flex items-center gap-1">
                                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                        Lihat
                                                    </a>
                                                ) : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <button onClick={() => openTagihanModal(item)} className="text-gray-500 hover:text-alyusra-orange p-1 rounded transition hover:bg-orange-50">
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                    </button>

                                                    {item.status_bayar === 'pending' && (
                                                        <>
                                                            <button onClick={() => handleVerify(item.tagihan_id, 'lunas')} className="text-green-500 hover:text-green-700 p-1 rounded transition hover:bg-green-50" title="Terima">
                                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                            </button>
                                                            <button onClick={() => handleVerify(item.tagihan_id, 'rejected')} className="text-red-500 hover:text-red-700 p-1 rounded transition hover:bg-red-50" title="Tolak">
                                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-400 italic">Data siswa tidak ditemukan untuk filter ini.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* PAGINATION */}
                        {students.links && (
                            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-center gap-2">
                                {students.links.map((link, k) => (
                                    link.url ? (
                                        <Link key={k} href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} className={`px-4 py-2 text-xs border rounded-lg transition font-bold ${link.active ? 'bg-alyusra-orange text-white border-alyusra-orange shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'}`} />
                                    ) : (
                                        <span key={k} dangerouslySetInnerHTML={{ __html: link.label }} className="px-4 py-2 text-xs border rounded-lg bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50" />
                                    )
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* MODAL SET TAGIHAN */}
            <Modal show={showTagihanModal} onClose={() => setShowTagihanModal(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-bold mb-6 text-gray-800 border-b pb-3">
                        {selectedStudent?.tagihan_id ? 'Edit Tagihan' : 'Buat Tagihan Baru'}
                    </h2>
                    <div className="bg-orange-50 p-4 rounded-xl mb-6 text-sm border-l-4 border-alyusra-orange">
                        <div className="flex justify-between mb-1">
                            <span className="text-gray-500">Nama Santri</span>
                            <span className="font-bold text-gray-800">{selectedStudent?.nama}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Tahun Ajaran</span>
                            <span className="font-bold text-alyusra-orange text-lg">{filterTahun}</span>
                        </div>
                    </div>

                    <form onSubmit={submitTagihan} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Nominal Tagihan (Rp)</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 font-bold">Rp</span>
                                <input
                                    type="text"
                                    className="w-full pl-10 border-gray-300 rounded-xl focus:ring-alyusra-orange focus:border-alyusra-orange font-bold text-xl py-3 text-gray-800"
                                    value={data.nominal_tagihan}
                                    onChange={(e) => setData('nominal_tagihan', formatCurrencyInput(e.target.value))}
                                    placeholder="0"
                                    required
                                />
                            </div>
                            {errors.nominal_tagihan && <div className="text-red-500 text-sm mt-1">{errors.nominal_tagihan}</div>}
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button type="button" onClick={() => setShowTagihanModal(false)} className="px-5 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition">Batal</button>
                            <button type="submit" disabled={processing} className="px-5 py-2.5 bg-alyusra-orange text-white rounded-xl font-bold hover:bg-orange-600 shadow-lg shadow-orange-200 transition disabled:opacity-50">
                                {processing ? 'Menyimpan...' : 'Simpan Tagihan'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* MODAL BULK TAGIHAN */}
            <Modal show={showBulkModal} onClose={() => setShowBulkModal(false)}>
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                        <span className="bg-alyusra-orange text-white p-1 rounded">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                        </span>
                        Generate Tagihan Massal
                    </h2>

                    <div className="bg-blue-50 p-5 rounded-xl mb-6 text-sm text-blue-800 border border-blue-100">
                        <div className="font-bold flex items-center gap-2 mb-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Informasi Penting:
                        </div>
                        <ul className="list-disc list-inside space-y-1 ml-1 opacity-90">
                            <li>Tagihan akan dibuat untuk <b>SEMUA Santri Aktif (Status: Lulus)</b>.</li>
                            <li>Tahun Ajaran Terpilih: <b>{filterTahun}</b>.</li>
                            <li>Santri yang sudah punya tagihan di tahun ini <b>tidak akan diduplikasi</b>.</li>
                        </ul>
                    </div>

                    <form onSubmit={handleBulkSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Nominal Tagihan (Seragam)</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 font-bold">Rp</span>
                                <input
                                    type="text"
                                    className="w-full pl-10 border-gray-300 rounded-xl focus:ring-alyusra-orange focus:border-alyusra-orange font-bold text-xl py-3 text-gray-800"
                                    value={bulkNominal}
                                    onChange={(e) => setBulkNominal(formatCurrencyInput(e.target.value))}
                                    placeholder="Contoh: 1.500.000"
                                    required
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Semua santri aktif akan memiliki tagihan sebesar ini.</p>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button type="button" onClick={() => setShowBulkModal(false)} className="px-5 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition">Batal</button>
                            <button type="submit" disabled={processing} className="px-5 py-2.5 bg-alyusra-orange text-white rounded-xl font-bold hover:bg-orange-600 shadow-lg shadow-orange-200 transition disabled:opacity-50 flex items-center gap-2">
                                {processing ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Sedang Memproses...
                                    </>
                                ) : 'Generate Sekarang'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
