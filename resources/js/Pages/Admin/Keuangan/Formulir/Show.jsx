import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function KeuanganFormulirShow({ auth, pendaftar }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Detail Formulir</h2>}
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

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase">Nama Lengkap</label>
                                <p className="text-gray-900 font-medium">{pendaftar.nama}</p>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase">No Pendaftaran</label>
                                <p className="text-gray-900 font-medium">{pendaftar.no_pendaftaran}</p>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase">Program</label>
                                <p className="text-gray-900 font-medium">{pendaftar.program?.nama}</p>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase">Status Pembayaran</label>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                    pendaftar.status_pembayaran === 'Lunas' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                    {pendaftar.status_pembayaran}
                                </span>
                            </div>
                        </div>

                        {/* BUKTI BAYAR FORMULIR (Jika Ada) */}
                        <div className="mt-8 pt-6 border-t">
                            <h4 className="font-bold text-gray-800 mb-4">Bukti Pembayaran Formulir</h4>
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
                                            className="text-blue-600 text-sm hover:underline"
                                        >
                                            Lihat Ukuran Penuh
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500 italic text-sm">Tidak ada bukti bayar manual (Mungkin via Midtrans otomatis).</p>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}