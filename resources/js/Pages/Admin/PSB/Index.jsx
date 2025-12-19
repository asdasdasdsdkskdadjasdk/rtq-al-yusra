import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

// Terima props 'cabangs' dan 'filters' dari Controller
export default function PendaftaranIndex({ auth, pendaftar, cabangs, filters }) {
    
    // State untuk menyimpan pilihan filter saat ini
    const [selectedCabang, setSelectedCabang] = useState(filters.cabang || '');

    // Fungsi saat Dropdown Berubah
    const handleFilterChange = (e) => {
        const cabang = e.target.value;
        setSelectedCabang(cabang);

        // Reload halaman dengan parameter cabang (GET request)
        router.get(route('psb.pendaftaran.index'), 
            { cabang: cabang }, // Kirim param
            { 
                preserveState: true, // Jangan reset scroll/state lain
                replace: true,       // Ganti history browser
                preserveScroll: true 
            }
        );
    };

    // Fungsi Hapus Data
    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus data pendaftaran ini?')) {
            router.delete(route('psb.pendaftaran.destroy', id));
        }
    };

    // Fungsi Ganti Status Langsung
    const handleStatusChange = (id, newStatus) => {
        router.put(route('psb.pendaftaran.update', id), {
            status: newStatus
        }, { preserveScroll: true });
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'Lulus': return 'border-green-500 text-green-700 bg-green-50';
            case 'Tidak Lulus': return 'border-red-500 text-red-700 bg-red-50';
            case 'Menunggu Hasil Pendaftaran': return 'border-blue-500 text-blue-700 bg-blue-50';
            case 'Sudah Diverifikasi': return 'border-purple-500 text-purple-700 bg-purple-50';
            case 'Sudah Daftar Ulang': return 'border-green-600 text-green-800 bg-green-100';
            default: return 'border-yellow-500 text-yellow-700 bg-yellow-50';
        }
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Manajemen Pendaftaran" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* HEADER & FILTER AREA */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Manajemen Pendaftaran
                    </h1>

                    {/* --- FILTER CABANG (BARU) --- */}
                    <div className="flex items-center gap-2">
                        <label htmlFor="filterCabang" className="text-sm font-medium text-gray-700">
                            Filter Cabang:
                        </label>
                        <select
                            id="filterCabang"
                            value={selectedCabang}
                            onChange={handleFilterChange}
                            className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-lg shadow-sm text-sm"
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

                <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                <tr>
                                    <th scope="col" className="px-6 py-4">No Pendaftaran</th>
                                    <th scope="col" className="px-6 py-4">Nama</th>
                                    <th scope="col" className="px-6 py-4">Cabang</th> {/* Kolom Cabang Ditampilkan */}
                                    <th scope="col" className="px-6 py-4">Program</th>
                                    <th scope="col" className="px-6 py-4">Status</th>
                                    <th scope="col" className="px-6 py-4 text-center">Aksi</th>
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
                                            
                                            {/* Data Cabang */}
                                            <td className="px-6 py-4">
                                                <span className="text-gray-600 font-medium">
                                                    {item.cabang || '-'}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
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
                                                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
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
                                                <div className="flex justify-center items-center space-x-3">
                                                    <Link 
                                                        href={route('psb.pendaftaran.show', item.id)}
                                                        className="text-blue-600 hover:text-blue-900 font-medium text-xs bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition"
                                                    >
                                                        Detail
                                                    </Link>
                                                    <Link 
                                                        href={route('psb.pendaftaran.edit', item.id)} 
                                                        className="text-green-600 hover:text-green-900 font-medium text-xs bg-green-50 px-2 py-1 rounded hover:bg-green-100 transition"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="text-red-600 hover:text-red-900 font-medium text-xs bg-red-50 px-2 py-1 rounded hover:bg-red-100 transition"
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
                                            <p>Tidak ada data pendaftar untuk cabang ini.</p>
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
        </AuthenticatedLayout>
    );
}