import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function KeuanganFormulirIndex({ auth, pendaftar, filters }) {
    const [search, setSearch] = useState(filters?.search || '');

    // --- SAFETY CHECK (PENTING) ---
    // Pastikan pendaftar dan pendaftar.data ada. Jika tidak, gunakan array kosong.
    const listPendaftar = pendaftar?.data || [];
    const listLinks = pendaftar?.links || [];

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.keuangan.formulir.index'), { search }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Data Formulir Masuk</h2>}
        >
            <Head title="Data Formulir" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* --- HEADER & SEARCH --- */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-700">Daftar Calon Santri</h3>
                            <p className="text-sm text-gray-500">Memantau pembayaran biaya pendaftaran awal.</p>
                        </div>
                        
                        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
                            <input 
                                type="text" 
                                className="border-gray-300 rounded-lg text-sm w-full md:w-64" 
                                placeholder="Cari Nama / No Daftar..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700">
                                Cari
                            </button>
                        </form>
                    </div>

                    {/* --- TABEL DATA --- */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-4">No Pendaftaran</th>
                                        <th className="px-6 py-4">Nama Lengkap</th>
                                        <th className="px-6 py-4">Program</th>
                                        <th className="px-6 py-4">Tanggal Daftar</th>
                                        <th className="px-6 py-4 text-center">Status Pembayaran</th>
                                        <th className="px-6 py-4 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* MENGGUNAKAN listPendaftar YANG SUDAH DIAMANKAN */}
                                    {listPendaftar.length > 0 ? (
                                        listPendaftar.map((item) => (
                                            <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                                                <td className="px-6 py-4 font-bold text-gray-900">
                                                    {item.no_pendaftaran}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-800">{item.nama}</div>
                                                    <div className="text-xs text-gray-400">{item.jenis_kelamin}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                        {item.program?.nama || '-'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {new Date(item.created_at).toLocaleDateString('id-ID')}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                        item.status_pembayaran === 'Lunas' 
                                                            ? 'bg-green-100 text-green-700' 
                                                            : 'bg-red-100 text-red-700'
                                                    }`}>
                                                        {item.status_pembayaran}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <Link 
                                                        href={route('admin.keuangan.formulir.show', item.id)}
                                                        className="text-blue-600 hover:underline font-bold text-xs"
                                                    >
                                                        Lihat Detail
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-8 text-center text-gray-400 italic">
                                                Tidak ada data pendaftar ditemukan.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* PAGINATION AMAN */}
                        <div className="p-4 border-t bg-gray-50 flex justify-end">
                            {listLinks.length > 0 && listLinks.map((link, k) => (
                                <Link
                                    key={k}
                                    href={link.url || '#'}
                                    className={`px-3 py-1 mx-1 border rounded text-xs ${
                                        link.active ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                                    } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}