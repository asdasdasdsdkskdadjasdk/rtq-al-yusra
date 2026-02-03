// resources/js/Pages/Admin/PSB/Detail.jsx

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Detail({ auth, pendaftar }) {

    // Helper untuk menampilkan file (Gambar atau Link Download)
    const renderFile = (label, filePath) => {
        if (!filePath) return <span className="text-gray-400 italic">Tidak ada file</span>;

        const isImage = filePath.match(/\.(jpeg|jpg|png)$/i);
        const fileUrl = `/storage/${filePath}`;

        return (
            <div className="mt-2">
                <p className="text-xs font-semibold text-gray-500 mb-1">{label}</p>
                {isImage ? (
                    <div className="border p-1 rounded-lg w-fit">
                        <img src={fileUrl} alt={label} className="h-32 w-auto object-cover rounded" />
                        <a href={fileUrl} target="_blank" className="text-xs text-orange-600 hover:underline mt-1 block">Lihat Full</a>
                    </div>
                ) : (
                    <a
                        href={fileUrl}
                        target="_blank"
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-orange-600 hover:bg-gray-200 transition"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        Download / Lihat {label}
                    </a>
                )}
            </div>
        );
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title={`Detail - ${pendaftar.nama}`} />

            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Detail Pendaftar</h1>
                    <Link href={route('psb.pendaftaran.index')} className="text-gray-600 hover:text-gray-900">
                        &larr; Kembali
                    </Link>
                </div>

                <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                    {/* Header Profile */}
                    <div className="bg-gray-50 p-6 border-b flex justify-between items-start">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800">{pendaftar.nama}</h2>
                            <p className="text-gray-500 font-mono text-sm mt-1">{pendaftar.no_pendaftaran}</p>
                            <span className={`mt-3 inline-block px-3 py-1 text-xs font-bold rounded-full ${pendaftar.status === 'Lulus' ? 'bg-green-100 text-green-700' :
                                pendaftar.status === 'Tidak Lulus' ? 'bg-red-100 text-red-700' :
                                    'bg-yellow-100 text-yellow-700'
                                }`}>
                                {pendaftar.status}
                            </span>
                        </div>
                        <Link
                            href={route('psb.pendaftaran.edit', pendaftar.id)}
                            className="px-4 py-2 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition shadow"
                        >
                            Edit Formulir
                        </Link>
                    </div>

                    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* KOLOM KIRI: BIODATA */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Biodata Santri</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div><label className="text-gray-500 text-xs uppercase">NIK</label><p className="font-semibold">{pendaftar.nik}</p></div>
                                <div><label className="text-gray-500 text-xs uppercase">No HP</label><p className="font-semibold">{pendaftar.no_hp}</p></div>
                                <div><label className="text-gray-500 text-xs uppercase">Tempat, Tgl Lahir</label><p className="font-semibold">{pendaftar.tempat_lahir}, {pendaftar.tanggal_lahir}</p></div>
                                <div><label className="text-gray-500 text-xs uppercase">Jenis Kelamin</label><p className="font-semibold">{pendaftar.jenis_kelamin}</p></div>
                                <div><label className="text-gray-500 text-xs uppercase">Program</label><p className="font-semibold">{pendaftar.program_nama} ({pendaftar.program_jenis})</p></div>
                                <div><label className="text-gray-500 text-xs uppercase">Email</label><p className="font-semibold">{pendaftar.email}</p></div>
                                <div className="col-span-2"><label className="text-gray-500 text-xs uppercase">Alamat</label><p className="font-semibold">{pendaftar.alamat}</p></div>
                                <div className="col-span-2"><label className="text-gray-500 text-xs uppercase">Nama Orang Tua</label><p className="font-semibold">{pendaftar.nama_orang_tua}</p></div>
                            </div>
                        </div>

                        {/* KOLOM KANAN: BERKAS */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Berkas Upload</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {renderFile("Pas Foto", pendaftar.pas_foto)}
                                {renderFile("Kartu Keluarga", pendaftar.kartu_keluarga)}
                                {renderFile("Ijazah Terakhir", pendaftar.ijazah_terakhir)}
                                {renderFile("SKBB", pendaftar.skbb)}
                                {renderFile("SKS", pendaftar.sks)}
                                {renderFile("Surat Pernyataan", pendaftar.surat_pernyataan)}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}