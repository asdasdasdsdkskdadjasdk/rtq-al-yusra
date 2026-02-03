import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, router, usePage } from '@inertiajs/react';

export default function WaliDaftarUlangIndex({ auth, history, currentYear }) {
    // Ambil Config dari Global Props (Backend)
    const { midtrans } = usePage().props;

    // Cari tagihan tahun ini
    const currentBill = history.find(h => h.tahun === currentYear);
    const [snapToken, setSnapToken] = useState(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        id: currentBill ? currentBill.id : '',
        bukti_bayar: null,
        keterangan: ''
    });

    const [showUploadForm, setShowUploadForm] = useState(false);

    // --- MIDTRANS SCRIPT LOADER ---
    useEffect(() => {
        // Tentukan URL berdasarkan Environment Backend (Production vs Sandbox)
        const isProduction = midtrans.is_production === true || midtrans.is_production === 'true' || midtrans.is_production === 1;
        const snapUrl = isProduction
            ? "https://app.midtrans.com/snap/snap.js"
            : "https://app.sandbox.midtrans.com/snap/snap.js";

        const script = document.createElement('script');
        script.src = snapUrl;
        script.setAttribute('data-client-key', midtrans.client_key);
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [midtrans]);

    const submitUpload = (e) => {
        e.preventDefault();
        post(route('wali.daftar-ulang.store'), {
            onSuccess: () => {
                setShowUploadForm(false);
                reset();
                alert('Bukti pembayaran berhasil diupload.');
            }
        });
    };

    const handlePay = async () => {
        if (!currentBill) return;

        try {
            // Request Snap Token from Backend
            const response = await axios.post(route('wali.daftar-ulang.pay'), {
                id: currentBill.id
            });

            const token = response.data.snap_token;
            setSnapToken(token);

            // Open Snap Popup
            window.snap.pay(token, {
                onSuccess: function (result) {
                    // Update status di frontend (atau reload page)
                    alert("Pembayaran Berhasil!");
                    router.reload();
                },
                onPending: function (result) {
                    alert("Menunggu pembayaran...");
                    router.reload();
                },
                onError: function (result) {
                    alert("Pembayaran gagal!");
                },
                onClose: function () {
                    alert('Anda menutup popup tanpa menyelesaikan pembayaran');
                }
            });

        } catch (error) {
            console.error(error);
            alert('Gagal memproses pembayaran. Silakan coba lagi.');
        }
    };

    const formatRupiah = (angka) => {
        const value = Number(angka);
        return isNaN(value) ? 'Rp 0' : new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Daftar Ulang Tahunan" />

            <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                {/* HEADLINE */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Daftar Ulang Tahunan</h2>
                    <p className="text-gray-500 text-sm">Informasi tagihan daftar ulang dan status pembayaran.</p>
                </div>

                {/* --- CURRENT BILL CARD --- */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-orange-500 p-6 text-white">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold opacity-90">Tagihan Tahun Ajaran</h3>
                                <div className="text-4xl font-bold mt-1">{currentYear}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm opacity-80 mb-1">Status Pembayaran</div>
                                {currentBill ? (
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${currentBill.status === 'lunas' ? 'bg-green-500 text-white' :
                                        currentBill.status === 'pending' ? 'bg-yellow-400 text-yellow-900' : 'bg-red-500 text-white'
                                        }`}>
                                        {currentBill.status}
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-400 text-gray-900">BELUM DITAGIH</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="p-8 text-center sm:text-left">
                        {currentBill ? (
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                                <div>
                                    <p className="text-gray-500 text-sm mb-1">Total Tagihan</p>
                                    <div className="text-3xl font-bold text-gray-900">{formatRupiah(currentBill.nominal_tagihan)}</div>
                                    <p className="text-sm text-gray-400 mt-2">
                                        {currentBill.status === 'lunas' ? 'Terima kasih, pembayaran Anda sudah lunas.' : 'Silakan lakukan pembayaran online atau upload bukti transfer.'}
                                    </p>
                                </div>

                                {currentBill.status !== 'lunas' && (
                                    <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">

                                        {!showUploadForm && (
                                            <>
                                                <button
                                                    onClick={handlePay}
                                                    className="w-full sm:w-auto px-6 py-3 bg-alyusra-orange hover:bg-orange-700 text-white font-bold rounded-xl transition shadow-lg shadow-orange-200 flex items-center justify-center gap-2"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                                    Bayar Sekarang (Online)
                                                </button>

                                                <button
                                                    onClick={() => setShowUploadForm(true)}
                                                    className="w-full sm:w-auto px-6 py-3 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold rounded-xl transition"
                                                >
                                                    Upload Bukti Manual
                                                </button>
                                            </>
                                        )}

                                        {showUploadForm && (
                                            <div className="w-full max-w-sm ml-auto bg-gray-50 p-4 rounded-xl border border-gray-200 text-left">
                                                <h4 className="font-bold text-gray-800 mb-2">Form Upload Manual</h4>
                                                <form onSubmit={submitUpload} className="space-y-3">
                                                    <input
                                                        type="file"
                                                        onChange={e => setData('bukti_bayar', e.target.files[0])}
                                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                                                        required
                                                    />
                                                    <textarea
                                                        placeholder="Catatan tambahan..."
                                                        value={data.keterangan}
                                                        onChange={e => setData('keterangan', e.target.value)}
                                                        className="w-full border-gray-300 rounded-lg text-sm focus:ring-orange-500"
                                                        rows="2"
                                                    ></textarea>
                                                    <div className="flex gap-2">
                                                        <button type="button" onClick={() => setShowUploadForm(false)} className="flex-1 py-2 bg-gray-200 rounded-lg text-sm font-bold text-gray-600">Batal</button>
                                                        <button type="submit" disabled={processing} className="flex-1 py-2 bg-green-600 rounded-lg text-sm font-bold text-white hover:bg-green-700 disabled:opacity-50">
                                                            {processing ? '...' : 'Kirim'}
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500 font-medium">Belum ada tagihan daftar ulang untuk tahun {currentYear}.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- HISTORY TABLE --- */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="font-bold text-gray-800">Riwayat Pembayaran</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3">Tahun</th>
                                    <th className="px-6 py-3">Tagihan</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Bukti</th>
                                    <th className="px-6 py-3">Tanggal Verifikasi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {history.length > 0 ? history.map((item) => (
                                    <tr key={item.id} className="bg-white hover:bg-gray-50">
                                        <td className="px-6 py-4 font-bold">{item.tahun}</td>
                                        <td className="px-6 py-4">{formatRupiah(item.nominal_tagihan)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${item.status === 'lunas' ? 'bg-green-100 text-green-700' :
                                                item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.bukti_bayar ? <a href={`/storage/${item.bukti_bayar}`} target="_blank" className="text-orange-600 hover:underline">Lihat</a> : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-xs">{item.updated_at ? new Date(item.updated_at).toLocaleDateString() : '-'}</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-400 italic">Belum ada riwayat pembayaran.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
