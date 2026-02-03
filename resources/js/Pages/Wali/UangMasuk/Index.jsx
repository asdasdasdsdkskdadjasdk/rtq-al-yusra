import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';

export default function UangMasukWali({ auth, tagihan, midtrans_client_key }) {
    // Helper Variables
    const sisa = tagihan.total_tagihan - tagihan.sudah_dibayar;
    const persentase = tagihan.total_tagihan > 0
        ? Math.min((tagihan.sudah_dibayar / tagihan.total_tagihan) * 100, 100)
        : (tagihan.is_beasiswa ? 100 : 0);

    // Helper Format Currency
    const formatCurrencyInput = (value) => {
        return value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    // --- STATE MIDTRANS (ONLINE) ---
    const [showPayModal, setShowPayModal] = useState(false);
    const [nominal, setNominal] = useState('');
    const [loading, setLoading] = useState(false);

    // --- STATE UPLOAD MANUAL ---
    const [showUploadModal, setShowUploadModal] = useState(false);
    const {
        data: uploadData,
        setData: setUploadData,
        post: postUpload,
        processing: procUpload,
        reset: resetUpload,
        errors: errUpload,
        transform: transformUpload
    } = useForm({
        jumlah_bayar: '',
        keterangan: '',
        bukti_bayar: null
    });

    // 1. Load Midtrans Snap JS Script
    useEffect(() => {
        const script = document.createElement('script');
        // Gunakan URL Sandbox untuk Development. Ganti ke Production URL saat live.
        script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
        script.setAttribute('data-client-key', midtrans_client_key);
        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, [midtrans_client_key]);

    // 2. Handler Bayar Online (Midtrans)
    const handlePay = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Ambil CSRF Token
        const csrfTokenMeta = document.querySelector('meta[name="csrf-token"]');
        const csrfToken = csrfTokenMeta ? csrfTokenMeta.getAttribute('content') : '';

        if (!csrfToken) {
            alert("Security Token hilang. Silakan refresh halaman.");
            setLoading(false);
            return;
        }

        try {
            const cleanNominal = nominal.toString().replace(/\./g, '');
            const response = await fetch(route('wali.uang-masuk.pay'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                },
                body: JSON.stringify({ jumlah_bayar: cleanNominal })
            });

            if (!response.ok) {
                if (response.status === 419) {
                    alert("Sesi Anda telah berakhir. Halaman akan dimuat ulang.");
                    window.location.reload();
                    return;
                }
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.token) {
                window.snap.pay(data.token, {
                    onSuccess: function (result) {
                        setShowPayModal(false);
                        setNominal('');
                        // Reload halaman agar data terupdate
                        window.location.reload();
                    },
                    onPending: function (result) {
                        alert("Menunggu pembayaran Anda!");
                        setShowPayModal(false);
                    },
                    onError: function (result) {
                        alert("Pembayaran gagal!");
                        setLoading(false);
                    },
                    onClose: function () {
                        setLoading(false);
                    }
                });
            } else {
                alert('Gagal mendapatkan token pembayaran.');
                setLoading(false);
            }

        } catch (error) {
            console.error(error);
            alert(error.message || 'Terjadi kesalahan koneksi.');
            setLoading(false);
        }
    };

    // 3. Handler Upload Bukti Manual
    const handleUpload = (e) => {
        e.preventDefault();
        transformUpload((data) => ({
            ...data,
            jumlah_bayar: data.jumlah_bayar.toString().replace(/\./g, '')
        }));
        postUpload(route('wali.uang-masuk.upload'), {
            onSuccess: () => {
                setShowUploadModal(false);
                resetUpload();
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Tagihan Uang Masuk" />

            <div className="max-w-8xl mx-auto space-y-6 py-6 px-4 sm:px-6 lg:px-8">

                {/* --- CARD STATUS UTAMA --- */}
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-600 relative overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4 relative z-10">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800">Uang Masuk</h3>
                            <p className="text-gray-500 text-sm mt-1">Program: <span className="font-semibold text-orange-600">{tagihan.program_nama}</span></p>

                            <div className="mt-3">
                                {tagihan.status_text === 'Lunas' ? (
                                    <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm inline-flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                        LUNAS
                                    </span>
                                ) : (
                                    <span className="bg-red-100 text-red-700 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm animate-pulse">
                                        BELUM LUNAS
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* TOMBOL AKSI (Hanya tampil jika belum lunas) */}
                        {tagihan.status_text !== 'Lunas' && (
                            <div className="flex gap-3 w-full md:w-auto">
                                <button
                                    onClick={() => setShowPayModal(true)}
                                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-lg font-bold shadow-md transition text-sm flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                    Bayar Online
                                </button>

                                <button
                                    onClick={() => setShowUploadModal(true)}
                                    className="flex-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-5 py-2.5 rounded-lg font-bold shadow-sm transition text-sm flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                    Upload Bukti
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Info Nominal */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center relative z-10">
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Total Tagihan</p>
                            <p className="text-xl font-bold text-gray-800 mt-1">
                                {tagihan.is_beasiswa ? 'Gratis' : `Rp ${tagihan.total_tagihan.toLocaleString('id-ID')}`}
                            </p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                            <p className="text-xs text-green-600 uppercase font-semibold tracking-wide">Sudah Dibayar</p>
                            <p className="text-xl font-bold text-green-700 mt-1">Rp {tagihan.sudah_dibayar.toLocaleString('id-ID')}</p>
                        </div>
                        <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                            <p className="text-xs text-red-600 uppercase font-semibold tracking-wide">Sisa Tagihan</p>
                            <p className="text-xl font-bold text-red-700 mt-1">
                                {tagihan.is_beasiswa ? '-' : `Rp ${(sisa > 0 ? sisa : 0).toLocaleString('id-ID')}`}
                            </p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-8 relative z-10">
                        <div className="flex justify-between text-xs font-semibold mb-2">
                            <span className="text-orange-600">Progres Pembayaran</span>
                            <span className="text-gray-600">{persentase.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                            <div className="bg-orange-600 h-2.5 rounded-full transition-all duration-1000 ease-out" style={{ width: `${persentase}%` }}></div>
                        </div>
                    </div>

                    {/* Dekorasi Background */}
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-orange-100 rounded-full opacity-50 blur-3xl"></div>
                </div>

                {/* --- CARD RIWAYAT --- */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h4 className="font-bold text-lg text-gray-800 mb-4 border-b pb-2">Riwayat Transaksi</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                                <tr>
                                    <th className="px-4 py-3 rounded-l-lg">Tanggal</th>
                                    <th className="px-4 py-3">Nominal</th>
                                    <th className="px-4 py-3">Keterangan</th>
                                    <th className="px-4 py-3 rounded-r-lg text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {tagihan.riwayat.length > 0 ? (
                                    tagihan.riwayat.map((history) => (
                                        <tr key={history.id} className="hover:bg-gray-50 transition">
                                            <td className="px-4 py-3 text-gray-500">
                                                {new Date(history.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                <div className="text-[10px] text-gray-400">{new Date(history.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</div>
                                            </td>
                                            <td className="px-4 py-3 font-bold text-gray-800">
                                                Rp {parseInt(history.jumlah_bayar).toLocaleString('id-ID')}
                                            </td>
                                            <td className="px-4 py-3 text-gray-500 italic text-xs">
                                                {history.keterangan || '-'}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {history.status === 'approved' && <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide">Berhasil</span>}
                                                {history.status === 'pending' && <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide">Menunggu</span>}
                                                {history.status === 'rejected' && <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide">Ditolak</span>}
                                                {!history.status && <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide">-</span>}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-4 py-8 text-center text-gray-400">
                                            Belum ada riwayat pembayaran.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* --- MODAL 1: BAYAR ONLINE --- */}
            <Modal show={showPayModal} onClose={() => setShowPayModal(false)}>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-900">Pembayaran Online</h2>
                        <button onClick={() => setShowPayModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                    </div>

                    <form onSubmit={handlePay}>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nominal Pembayaran (Rp)</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">Rp</span>
                                <input
                                    type="text"
                                    name="nominal"
                                    id="pay_nominal"
                                    className="w-full pl-10 border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 shadow-sm font-bold"
                                    placeholder="Contoh: 1.000.000"
                                    value={nominal}
                                    onChange={(e) => setNominal(formatCurrencyInput(e.target.value))}
                                    required
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                <svg className="w-3 h-3 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                                Minimal pembayaran Rp 10.000
                            </p>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <button type="button" onClick={() => setShowPayModal(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition">Batal</button>
                            <button type="submit" disabled={loading} className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-bold hover:bg-orange-700 shadow-lg shadow-orange-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Memproses...
                                    </>
                                ) : 'Lanjut Bayar'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* --- MODAL 2: UPLOAD BUKTI --- */}
            <Modal show={showUploadModal} onClose={() => setShowUploadModal(false)}>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-900">Konfirmasi Transfer Manual</h2>
                        <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                    </div>

                    <form onSubmit={handleUpload} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nominal yang Ditransfer (Rp)</label>
                            <input
                                type="text"
                                name="jumlah_bayar"
                                id="upload_jumlah_bayar"
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 font-bold"
                                value={uploadData.jumlah_bayar}
                                onChange={e => setUploadData('jumlah_bayar', formatCurrencyInput(e.target.value))}
                                placeholder="Masukkan jumlah uang"
                                required
                            />
                            {errUpload.jumlah_bayar && <p className="text-red-500 text-xs mt-1">{errUpload.jumlah_bayar}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Foto Bukti Transfer</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition cursor-pointer relative">
                                <input
                                    type="file"
                                    name="bukti_bayar"
                                    id="upload_bukti_bayar"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={e => setUploadData('bukti_bayar', e.target.files[0])}
                                    accept="image/*"
                                    required
                                />
                                <div className="space-y-1 text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    <div className="flex text-sm text-gray-600">
                                        <span className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500">
                                            {uploadData.bukti_bayar ? uploadData.bukti_bayar.name : 'Upload file gambar'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 2MB</p>
                                </div>
                            </div>
                            {errUpload.bukti_bayar && <p className="text-red-500 text-xs mt-1">{errUpload.bukti_bayar}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan (Opsional)</label>
                            <input
                                type="text"
                                name="keterangan"
                                id="upload_keterangan"
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500"
                                value={uploadData.keterangan}
                                onChange={e => setUploadData('keterangan', e.target.value)}
                                placeholder="Misal: Transfer dari BCA a.n Budi"
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <button type="button" onClick={() => setShowUploadModal(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition">Batal</button>
                            <button type="submit" disabled={procUpload} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 shadow-lg shadow-green-200 transition disabled:opacity-50 flex items-center gap-2">
                                {procUpload ? 'Mengirim...' : 'Kirim Bukti'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

        </AuthenticatedLayout>
    );
}