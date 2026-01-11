import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react'; // Tambah useForm

export default function KeuanganFormulirShow({ auth, pendaftar }) {
    
    // --- SETUP FORM UNTUK EDIT ---
    const { data, setData, put, processing, errors } = useForm({
        status_pembayaran: pendaftar.status_pembayaran || 'Belum Bayar',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Kirim request PUT ke controller update
        put(route('admin.keuangan.formulir.update', pendaftar.id), {
            preserveScroll: true,
            onSuccess: () => alert('Status berhasil diperbarui!'),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user} // Perbaikan props user
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Detail Keuangan Formulir</h2>}
        >
            <Head title={`Detail ${pendaftar.nama}`} />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                            <h3 className="text-lg font-bold">Informasi Pendaftar</h3>
                            <Link href={route('admin.keuangan.formulir.index')} className="text-sm text-gray-500 hover:text-gray-700">
                                &larr; Kembali
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase">Nama Lengkap</label>
                                <p className="text-gray-900 font-medium text-lg">{pendaftar.nama}</p>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase">No Pendaftaran</label>
                                <p className="text-gray-900 font-medium">{pendaftar.no_pendaftaran}</p>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase">Program</label>
                                <p className="text-gray-900 font-medium">{pendaftar.program?.nama}</p>
                            </div>
                            
                            {/* --- BAGIAN EDIT STATUS --- */}
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                                    Update Status Pembayaran
                                </label>
                                
                                <form onSubmit={handleSubmit} className="flex gap-2">
                                    <select
                                        value={data.status_pembayaran}
                                        onChange={(e) => setData('status_pembayaran', e.target.value)}
                                        className="text-sm border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm w-full"
                                    >
                                        <option value="Belum Bayar">Belum Bayar</option>
                                        <option value="Lunas">Lunas</option>
                                        <option value="Gagal">Gagal</option>
                                    </select>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                                    >
                                        {processing ? 'Simpan...' : 'Simpan'}
                                    </button>
                                </form>
                                {errors.status_pembayaran && <div className="text-red-500 text-xs mt-1">{errors.status_pembayaran}</div>}
                                
                                <div className="mt-2 text-xs text-gray-500">
                                    Status saat ini: <span className="font-bold">{pendaftar.status_pembayaran}</span>
                                </div>
                            </div>
                        </div>

                        {/* BUKTI BAYAR FORMULIR (Jika Ada) */}
                        <div className="mt-8 pt-6 border-t">
                            <h4 className="font-bold text-gray-800 mb-4">Bukti Pembayaran (Manual)</h4>
                            {pendaftar.bukti_bayar ? (
                                <div className="border rounded-lg p-2 inline-block">
                                    <img 
                                        src={`/storage/${pendaftar.bukti_bayar}`} 
                                        alt="Bukti Bayar" 
                                        className="max-h-64 rounded"
                                    />
                                    <div className="mt-2 text-center">
                                        <a 
                                            href={`/storage/${pendaftar.bukti_bayar}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-blue-600 text-sm hover:underline"
                                        >
                                            Lihat Ukuran Penuh
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-yellow-50 text-yellow-800 p-3 rounded text-sm">
                                    Tidak ada bukti bayar manual yang diupload. Pembayaran mungkin dilakukan via Gateway Otomatis (Midtrans) atau Tunai.
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}