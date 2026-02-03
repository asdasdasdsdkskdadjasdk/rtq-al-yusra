import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';

export default function PendaftaranIndex({ auth, pendaftar, cabangs, filters, currentStatus }) {

    // State Filter Cabang
    const [selectedCabang, setSelectedCabang] = useState(filters.cabang || '');

    // State Search (BARU)
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    // State Modal Status Confirmation
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [statusData, setStatusData] = useState(null);

    const tabs = [
        { label: 'Semua', value: 'Semua' },
        { label: 'Menunggu Verifikasi', value: 'Menunggu Verifikasi' },
        { label: 'Sudah Diverifikasi', value: 'Sudah Diverifikasi' },
        { label: 'Menunggu Hasil', value: 'Menunggu Hasil Pendaftaran' },
        { label: 'Lulus', value: 'Lulus' },
        { label: 'Tidak Lulus', value: 'Tidak Lulus' },
        { label: 'Sudah Daftar Ulang', value: 'Sudah Daftar Ulang' },
    ];

    // --- EFFECT: AUTO SEARCH (DEBOUNCE) ---
    // Hanya untuk Search
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm !== (filters.search || '')) {
                router.get(
                    route('psb.pendaftaran.index'),
                    {
                        status: currentStatus,
                        cabang: selectedCabang,
                        search: searchTerm
                    },
                    { preserveState: true, preserveScroll: true, replace: true }
                );
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]); // Only run on searchTerm change

    // Fungsi saat Dropdown Cabang Berubah (Langsung Trigger)
    const handleFilterChange = (e) => {
        const cabang = e.target.value;
        setSelectedCabang(cabang);

        router.get(
            route('psb.pendaftaran.index'),
            {
                status: currentStatus,
                cabang: cabang,
                search: searchTerm
            },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus data pendaftaran ini?')) {
            router.delete(route('psb.pendaftaran.destroy', id));
        }
    };

    const handleStatusChange = (item, newStatus) => {
        // Buka Modal Konfirmasi
        setStatusData({
            id: item.id,
            nama: item.nama,
            oldStatus: item.status,
            newStatus: newStatus
        });
        setShowStatusModal(true);
    };

    const confirmUpdateStatus = () => {
        if (!statusData) return;

        router.put(route('psb.pendaftaran.update', statusData.id), {
            status: statusData.newStatus
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setShowStatusModal(false);
                setStatusData(null);
            }
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Lulus': return 'border-green-500 text-green-700 bg-green-50';
            case 'Tidak Lulus': return 'border-red-500 text-red-700 bg-red-50';
            case 'Menunggu Hasil Pendaftaran': return 'border-orange-500 text-orange-700 bg-orange-50';
            case 'Sudah Diverifikasi': return 'border-orange-500 text-orange-700 bg-orange-50';
            case 'Sudah Daftar Ulang': return 'border-green-600 text-green-800 bg-green-100';
            default: return 'border-yellow-500 text-yellow-700 bg-yellow-50';
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Manajemen Pendaftaran" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* HEADER & FILTER AREA */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Manajemen Pendaftaran
                    </h1>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">

                        {/* --- 1. INPUT SEARCH (BARU) --- */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Cari Nama Santri..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-lg shadow-sm text-sm w-full sm:w-64"
                            />
                        </div>

                        {/* --- 2. FILTER CABANG --- */}
                        <div className="flex items-center gap-2">
                            <select
                                id="filterCabang"
                                value={selectedCabang}
                                onChange={handleFilterChange}
                                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-lg shadow-sm text-sm w-full"
                            >
                                <option value="">Semua Cabang</option>
                                {cabangs.map((c) => (
                                    <option key={c.id} value={c.nama}>
                                        {c.nama}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* TABS NAVIGATION */}
                <div className="mb-6 border-b border-gray-200 bg-white rounded-t-lg px-4 pt-4 overflow-x-auto">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <Link
                                key={tab.value}
                                href={route('psb.pendaftaran.index', {
                                    status: tab.value,
                                    cabang: selectedCabang, // Jaga filter cabang saat ganti tab
                                    search: searchTerm      // Jaga search saat ganti tab
                                })}
                                preserveState
                                preserveScroll
                                className={`
                                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                                    ${currentStatus === tab.value
                                        ? 'border-alyusra-orange text-alyusra-orange'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }
                                `}
                            >
                                {tab.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* TABEL DATA */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                <tr>
                                    <th scope="col" className="px-6 py-3">No Pendaftaran</th>
                                    <th scope="col" className="px-6 py-3">Nama</th>
                                    <th scope="col" className="px-6 py-3">Cabang</th>
                                    <th scope="col" className="px-6 py-3">Program</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                    <th scope="col" className="px-6 py-3 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendaftar.data.length > 0 ? (
                                    pendaftar.data.map((item) => (
                                        <tr key={item.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                                            <th scope="row" className="px-6 py-4 font-mono font-medium text-gray-900 whitespace-nowrap">
                                                {item.no_pendaftaran}
                                            </th>
                                            <td className="px-6 py-4 font-medium text-gray-800">
                                                {item.nama}
                                                <div className="text-xs text-gray-500 mt-1">{item.no_hp}</div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className="text-gray-600 font-medium">
                                                    {item.cabang || '-'}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded border border-gray-400">
                                                    {item.program_nama}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                {item.status_pembayaran === 'Belum Bayar' ? (
                                                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-red-100 text-red-700 border border-red-200 inline-flex items-center gap-1">
                                                        Belum Bayar
                                                    </span>
                                                ) : (
                                                    <select
                                                        value={item.status}
                                                        onChange={(e) => handleStatusChange(item, e.target.value)}
                                                        className={`text-xs font-bold rounded-lg cursor-pointer focus:ring-2 focus:ring-offset-1 focus:ring-orange-500 block w-full p-2 border ${getStatusColor(item.status)}`}
                                                    >
                                                        <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                                                        <option value="Sudah Diverifikasi">Sudah Diverifikasi</option>
                                                        <option value="Menunggu Hasil Pendaftaran">Menunggu Hasil Pendaftaran</option>
                                                        <option value="Lulus">Lulus</option>
                                                        <option value="Tidak Lulus">Tidak Lulus</option>
                                                        <option value="Sudah Daftar Ulang">Sudah Daftar Ulang</option>
                                                    </select>
                                                )}
                                            </td>

                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center items-center space-x-2">
                                                    <Link
                                                        href={route('psb.pendaftaran.show', item.id)}
                                                        className="text-orange-600 hover:text-orange-800 font-bold text-xs bg-orange-50 px-3 py-1 rounded hover:bg-orange-100 transition"
                                                    >
                                                        Detail
                                                    </Link>
                                                    <Link
                                                        href={route('psb.pendaftaran.edit', item.id)}
                                                        className="text-orange-600 hover:text-orange-800 font-bold text-xs bg-orange-50 px-3 py-1 rounded hover:bg-orange-100 transition"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="text-red-600 hover:text-red-800 font-bold text-xs bg-red-50 px-3 py-1 rounded hover:bg-red-100 transition"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                            {searchTerm ? (
                                                <p>Tidak ditemukan pendaftar dengan nama "<strong>{searchTerm}</strong>".</p>
                                            ) : (
                                                <p>Tidak ada data pendaftar untuk kriteria ini.</p>
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pendaftar.links && (
                        <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
                            <p className="text-xs text-gray-500">
                                Menampilkan {pendaftar.from || 0} - {pendaftar.to || 0} dari {pendaftar.total || 0} data
                            </p>
                            <div className="flex gap-1">
                                {pendaftar.links.map((link, key) => (
                                    link.url ? (
                                        <Link
                                            key={key}
                                            href={link.url}
                                            // Tambahkan parameter search/filter ke link pagination
                                            data={{ search: searchTerm, status: currentStatus, cabang: selectedCabang }}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={`px-3 py-1 text-xs rounded ${link.active ? 'bg-orange-500 text-white' : 'bg-white border text-gray-600 hover:bg-gray-100'}`}
                                        />
                                    ) : (
                                        <span
                                            key={key}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className="px-3 py-1 text-xs rounded bg-gray-100 text-gray-400 border"
                                        />
                                    )
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL UPDATE STATUS */}
            <Modal show={showStatusModal} onClose={() => setShowStatusModal(false)}>
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-900 border-b pb-2">
                        Konfirmasi Update Status
                    </h2>

                    <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-6">
                        <p className="text-gray-700">
                            Apakah Anda yakin ingin mengubah status pendaftar:
                        </p>
                        <ul className="mt-2 text-sm space-y-1 font-medium text-gray-800">
                            <li>Nama: <span className="font-bold">{statusData?.nama}</span></li>
                            <li>Status Saat Ini: <span className="text-gray-500">{statusData?.oldStatus}</span></li>
                            <li>Akan Diubah Menjadi: <span className="text-orange-600 font-bold text-lg">{statusData?.newStatus}</span></li>
                        </ul>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setShowStatusModal(false)}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-bold transition"
                        >
                            Batal
                        </button>
                        <button
                            onClick={confirmUpdateStatus}
                            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-bold transition shadow"
                        >
                            Ya, Update Status
                        </button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}