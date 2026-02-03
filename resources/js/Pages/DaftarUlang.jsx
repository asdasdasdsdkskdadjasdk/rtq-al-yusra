import React, { useState, useRef } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function DaftarUlang({ auth, pendaftar, batasDaftarUlang, isExpired }) {

    // 1. AMBIL DATA SEKOLAH DARI DATABASE (Global Props)
    const { sekolah } = usePage().props;

    // 2. LOGIKA GENERATE LINK WHATSAPP (PERBAIKAN FORMAT NOMOR)
    let nomorWA = '';
    if (sekolah.no_hp) {
        // Hapus semua karakter selain angka (spasi, strip, dll)
        let cleanHp = sekolah.no_hp.replace(/[^0-9]/g, '');

        // Jika dimulai dengan '0', ganti dengan '62' (Kode Negara Indonesia)
        if (cleanHp.startsWith('0')) {
            nomorWA = '62' + cleanHp.slice(1);
        } else {
            nomorWA = cleanHp;
        }
    }

    const pesanWA = `Assalamu'alaikum, saya santri dengan No Pendaftaran ${pendaftar.no_pendaftaran}. Saya terkendala waktu daftar ulang yang sudah habis. Mohon arahannya.`;
    const linkWA = `https://wa.me/${nomorWA}?text=${encodeURIComponent(pesanWA)}`;

    const { data, setData, post, processing, errors } = useForm({
        surat_pernyataan: null,
        check_pemeriksaan: false,
    });

    // State untuk efek visual Drag & Drop
    const [isDragActive, setIsDragActive] = useState(false);

    // Ref untuk input file
    const fileInputRef = useRef(null);

    const submit = (e) => {
        e.preventDefault();
        post(route('daftar.ulang.store'));
    };

    // --- LOGIKA DRAG & DROP ---
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragActive(true);
        } else if (e.type === "dragleave") {
            setIsDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type === "application/pdf") {
                setData('surat_pernyataan', droppedFile);
            } else {
                alert("Maaf, hanya file PDF yang diperbolehkan.");
            }
        }
    };

    const handleFileInputChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type === "application/pdf") {
                setData('surat_pernyataan', selectedFile);
            } else {
                alert("Maaf, hanya file PDF yang diperbolehkan.");
                e.target.value = null;
            }
        }
    };

    const onBoxClick = () => {
        fileInputRef.current.click();
    };

    return (
        <AppLayout auth={auth} heroTheme="dark">
            <Head title="Daftar Ulang Santri Baru" />

            {/* HERO SECTION */}
            <div
                className="relative bg-gray-800 pb-32 mt-[-80px] overflow-hidden"
                style={{
                    backgroundImage: "url('/images/rtq.jpg')",
                    backgroundSize: 'cover',
                    backgroundAttachment: 'fixed',
                    backgroundPosition: 'center'
                }}
            >
                <div className="absolute inset-0 bg-black/70"></div>
                <div className="relative container mx-auto px-4 pt-32 text-center text-white">
                    <h1 className="text-3xl md:text-4xl font-extrabold mb-4">Registrasi Ulang Santri Baru</h1>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                        Langkah terakhir untuk meresmikan status santri. Silakan lengkapi berkas persyaratan di bawah ini.
                    </p>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="relative container mx-auto px-4 -mt-20 pb-20 z-10">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">

                    {/* Header Card */}
                    <div className="border-b border-gray-100 p-8 bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Formulir Daftar Ulang</h2>
                            <p className="text-gray-500 text-sm mt-1">
                                No. Pendaftaran: <span className="font-mono font-bold text-orange-600">{pendaftar.no_pendaftaran}</span>
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500 uppercase font-semibold">Batas Waktu</p>
                            <p className={`text-lg font-bold ${isExpired ? 'text-red-600' : 'text-gray-800'}`}>
                                {batasDaftarUlang}
                            </p>
                        </div>
                    </div>

                    <div className="p-8">

                        {/* KONDISI 1: JIKA WAKTU HABIS (EXPIRED) */}
                        {isExpired ? (
                            <div className="text-center py-10">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6 animate-pulse">
                                    <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">Waktu Daftar Ulang Telah Habis</h3>
                                <p className="text-gray-600 max-w-lg mx-auto mb-8">
                                    Mohon maaf, batas waktu daftar ulang untuk gelombang Anda telah berakhir.
                                    Silakan hubungi bagian Penerimaan Mahasiswa Baru (PMB) atau Admin untuk bantuan lebih lanjut.
                                </p>

                                {/* TOMBOL WA DINAMIS DENGAN FORMAT NOMOR YG BENAR */}
                                <a
                                    href={linkWA}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full transition shadow-lg hover:scale-105"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                    </svg>
                                    Hubungi Admin / PMB
                                </a>
                            </div>
                        ) : (
                            /* KONDISI 2: FORM AKTIF (BELUM EXPIRED) */
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                                {/* KOLOM KIRI */}
                                <div className="space-y-6">
                                    <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-lg">
                                        <h3 className="font-bold text-blue-800 mb-2">Instruksi</h3>
                                        <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
                                            <li>Unduh template surat.</li>
                                            <li>Cetak & isi data lengkap.</li>
                                            <li>Tanda tangan Wali di atas materai.</li>
                                            <li>Scan/Foto format PDF.</li>
                                            <li>Upload file PDF.</li>
                                        </ol>
                                    </div>

                                    <div className="bg-white border rounded-xl p-6 shadow-sm text-center">
                                        <h4 className="font-bold text-gray-800 mb-2">Template Dokumen</h4>
                                        <a href={route('daftar.ulang.template')} className="block w-full py-2 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition text-sm">
                                            Download PDF Template
                                        </a>
                                    </div>
                                </div>

                                {/* KOLOM KANAN: FORMULIR */}
                                <div className="lg:col-span-2">
                                    <form onSubmit={submit} className="space-y-6">

                                        {/* DRAG & DROP AREA */}
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                Upload Surat Pernyataan (Wajib PDF)
                                            </label>

                                            <div
                                                onClick={onBoxClick}
                                                onDragEnter={handleDrag}
                                                onDragLeave={handleDrag}
                                                onDragOver={handleDrag}
                                                onDrop={handleDrop}
                                                className={`mt-1 flex justify-center px-6 pt-10 pb-10 border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-200 ${isDragActive
                                                        ? 'border-orange-500 bg-orange-50'
                                                        : 'border-gray-300 bg-white hover:bg-gray-50'
                                                    }`}
                                            >
                                                <div className="space-y-2 text-center">
                                                    {/* Tampilkan Nama File Jika Sudah Dipilih */}
                                                    {data.surat_pernyataan ? (
                                                        <div className="flex flex-col items-center">
                                                            <svg className="w-12 h-12 text-red-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                            </svg>
                                                            <p className="text-sm font-bold text-gray-800 break-all">
                                                                {data.surat_pernyataan.name}
                                                            </p>
                                                            <p className="text-xs text-green-600 mt-1">Siap diupload</p>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation(); // Mencegah klik parent
                                                                    setData('surat_pernyataan', null);
                                                                }}
                                                                className="mt-2 text-xs text-red-500 hover:underline"
                                                            >
                                                                Hapus / Ganti File
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        /* Tampilan Belum Ada File */
                                                        <>
                                                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                            <div className="text-sm text-gray-600">
                                                                <span className="font-medium text-orange-600 hover:text-orange-500">Klik untuk upload</span>
                                                                <span className="pl-1">atau drag PDF ke sini</span>
                                                            </div>
                                                            <p className="text-xs text-gray-500">Hanya file PDF (Maks. 2MB)</p>
                                                        </>
                                                    )}

                                                    {/* Input File Hidden */}
                                                    <input
                                                        ref={fileInputRef}
                                                        id="file-upload"
                                                        name="file-upload"
                                                        type="file"
                                                        accept="application/pdf"
                                                        className="hidden"
                                                        onChange={handleFileInputChange}
                                                    />
                                                </div>
                                            </div>
                                            {errors.surat_pernyataan && <p className="text-red-500 text-sm mt-1">{errors.surat_pernyataan}</p>}
                                        </div>

                                        {/* Checkbox Konfirmasi */}
                                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                            <label className="flex items-start gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={data.check_pemeriksaan}
                                                    onChange={(e) => setData('check_pemeriksaan', e.target.checked)}
                                                    className="mt-1 w-5 h-5 text-orange-600 rounded border-gray-300 focus:ring-orange-500"
                                                />
                                                <div className="text-sm text-gray-700 leading-relaxed">
                                                    <strong>Konfirmasi Kebenaran Data:</strong>
                                                    <br />
                                                    Saya menyatakan bahwa dokumen yang diunggah adalah asli, bertanda tangan basah, dan formatnya PDF.
                                                </div>
                                            </label>
                                            {errors.check_pemeriksaan && <p className="text-red-500 text-sm mt-2 font-bold">{errors.check_pemeriksaan}</p>}
                                        </div>

                                        <div className="pt-4">
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="w-full py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {processing ? 'Memproses...' : 'Kirim & Selesaikan'}
                                            </button>
                                        </div>

                                    </form>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </AppLayout>
    );
}