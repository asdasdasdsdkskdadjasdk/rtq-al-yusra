import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import Modal from '@/Components/Modal';

// Terima props baru: spp_aktif, pesan
export default function SppIndex({ spp_aktif, pesan, listBulan, nominalSpp, isBeasiswa, tahunDipilih, tahunList }) {
    // Ambil Config dari Global Props (Backend)
    const { midtrans } = usePage().props;

    // --- KONDISI: SPP BELUM AKTIF ---
    if (!spp_aktif) {
        return (
            <AuthenticatedLayout>
                <Head title="Pembayaran SPP" />
                <div className="py-12 max-w-7xl mx-auto px-4 text-center">
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">SPP Belum Tersedia</h2>
                        <p className="text-gray-500">{pesan}</p>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    // --- KONDISI: SPP AKTIF ---
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [modalType, setModalType] = useState(null);

    // Helper Format Currency
    const formatCurrencyInput = (value) => {
        return value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const { data, setData, post, processing, reset, transform } = useForm({
        bulan: '', tahun: '', jumlah_bayar: '', keterangan: '', bukti_bayar: null
    });

    const handleYearChange = (e) => {
        router.get(route('wali.spp.index'), { tahun: e.target.value }, { preserveState: true });
    };

    // ... (useEffect Midtrans sama) ...
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
        return () => { if (document.body.contains(script)) document.body.removeChild(script); };
    }, [midtrans]);

    const openPaymentModal = (bulanItem) => {
        setSelectedMonth(bulanItem);
        setData({
            bulan: bulanItem.bulan_angka,
            tahun: bulanItem.tahun,
            // Format awal agar tampil dengan titik
            jumlah_bayar: nominalSpp ? nominalSpp.toString().replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ".") : '',
            keterangan: ''
        });
        if (isBeasiswa) return;
        setModalType('selection');
    };

    // ... (Handler Pay Standard) ...
    const handlePayStandard = async () => {
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            // PERBAIKAN ROUTE 2: wali.spp.pay_standard
            const res = await fetch(route('wali.spp.pay_standard'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-TOKEN': csrfToken },
                body: JSON.stringify({ bulan: data.bulan, tahun: data.tahun })
            });
            const result = await res.json();
            if (result.token) {
                window.snap.pay(result.token, {
                    onSuccess: () => { setModalType(null); window.location.reload(); },
                    onPending: () => { setModalType(null); alert("Menunggu Pembayaran"); },
                    onError: () => alert("Gagal")
                });
            }
        } catch (e) { alert("Error"); }
    };

    // ... (Handler Pay Custom) ...
    const handlePayCustom = async (e) => {
        e.preventDefault();
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            // Clean amount
            const cleanAmount = data.jumlah_bayar.toString().replace(/\./g, '');

            const res = await fetch(route('wali.spp.pay_custom'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-TOKEN': csrfToken },
                body: JSON.stringify({
                    bulan: data.bulan,
                    tahun: data.tahun,
                    jumlah_bayar: cleanAmount,
                    keterangan: data.keterangan
                })
            });
            const result = await res.json();
            if (result.token) {
                window.snap.pay(result.token, {
                    onSuccess: () => { setModalType(null); window.location.reload(); },
                    onPending: () => { setModalType(null); alert("Menunggu Approval Admin"); },
                    onError: () => alert("Gagal")
                });
            }
        } catch (e) { alert("Error"); }
    };

    // ... (Handler Upload) ...
    const handleUpload = (e) => {
        e.preventDefault();
        transform((data) => ({
            ...data,
            jumlah_bayar: data.jumlah_bayar.toString().replace(/\./g, '')
        }));
        post(route('wali.spp.upload'), {
            onSuccess: () => { setModalType(null); reset(); alert("Bukti terupload."); }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Pembayaran SPP" />
            <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header & Filter Tahun */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Tagihan SPP Bulanan</h2>
                        <p className="text-gray-500 text-sm">Menampilkan tagihan aktif.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-600">Tahun:</span>
                        <select value={tahunDipilih} onChange={handleYearChange} className="border-gray-300 rounded-lg shadow-sm font-bold text-gray-700 focus:ring-green-500">
                            {tahunList.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                </div>

                {listBulan.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500 font-medium">Tidak ada tagihan untuk periode ini.</p>
                        <p className="text-xs text-gray-400 mt-1">Tagihan hanya muncul mulai dari Tanggal Masuk sampai bulan sekarang.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {listBulan.map((bulan) => (
                            <div key={bulan.bulan_angka} className={`relative p-5 rounded-xl border shadow-sm transition hover:shadow-md bg-white ${bulan.status === 'Lunas' || isBeasiswa ? 'border-green-500 ring-1 ring-green-100' :
                                bulan.status === 'Menunggu Konfirmasi' ? 'border-orange-500 ring-1 ring-orange-100' : 'border-red-200'
                                }`}>
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-bold text-lg text-gray-800">{bulan.bulan_nama}</h3>
                                    <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wide ${bulan.status === 'Lunas' || isBeasiswa ? 'bg-green-100 text-green-700' :
                                        bulan.status === 'Menunggu Konfirmasi' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                                        }`}>{bulan.status}</span>
                                </div>

                                <div className="text-sm text-gray-600 mb-4">
                                    <p>Tagihan: <span className="font-bold">{isBeasiswa ? 'Gratis' : `Rp ${nominalSpp.toLocaleString()}`}</span></p>
                                    {bulan.riwayat_terakhir && <p className="text-xs text-gray-400 mt-1 italic">{bulan.riwayat_terakhir.keterangan}</p>}
                                </div>

                                {bulan.status === 'Belum Lunas' && !isBeasiswa && (
                                    <button onClick={() => openPaymentModal(bulan)} className="w-full bg-orange-600 text-white text-sm font-bold py-2.5 rounded-lg hover:bg-orange-700 transition">Bayar Sekarang</button>
                                )}

                                {(bulan.status === 'Lunas' || bulan.status === 'Menunggu Konfirmasi') && (
                                    <button disabled className="w-full bg-gray-100 text-gray-400 text-sm font-bold py-2.5 rounded-lg cursor-not-allowed">
                                        {bulan.status === 'Lunas' ? 'Sudah Dibayar' : 'Sedang Proses'}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* --- MODAL SELECTION, CUSTOM, UPLOAD (Sama seperti sebelumnya) --- */}
                <Modal show={modalType === 'selection'} onClose={() => setModalType(null)}>
                    <div className="p-6">
                        <h3 className="font-bold text-lg mb-4">Pilih Metode ({selectedMonth?.bulan_nama})</h3>
                        <div className="space-y-3">
                            <button onClick={handlePayStandard} className="w-full p-4 border rounded-xl hover:bg-green-50 text-left">
                                <span className="font-bold block">Bayar Sesuai Tagihan</span>
                                <span className="text-xs text-green-600">Otomatis Lunas</span>
                            </button>
                            <button onClick={() => setModalType('custom')} className="w-full p-4 border rounded-xl hover:bg-orange-50 text-left">
                                <span className="font-bold block">Input Nominal Lain (Infak)</span>
                                <span className="text-xs text-orange-600">Menunggu Verifikasi Admin</span>
                            </button>
                            <button onClick={() => setModalType('upload')} className="w-full p-4 border rounded-xl hover:bg-gray-50 text-left">
                                <span className="font-bold block">Upload Bukti Transfer</span>
                                <span className="text-xs text-orange-600">Menunggu Verifikasi Admin</span>
                            </button>
                        </div>
                    </div>
                </Modal>

                {/* MODAL INPUT CUSTOM */}
                <Modal show={modalType === 'custom'} onClose={() => setModalType(null)}>
                    <div className="p-6">
                        <h3 className="font-bold mb-4">Input Nominal</h3>
                        <form onSubmit={handlePayCustom} className="space-y-4">
                            <input
                                type="text"
                                name="jumlah_bayar"
                                id="custom_jumlah_bayar"
                                className="w-full border rounded p-2 focus:ring-orange-500 font-bold"
                                value={data.jumlah_bayar}
                                onChange={e => setData('jumlah_bayar', formatCurrencyInput(e.target.value))}
                                required
                                placeholder="Nominal (Rp)"
                            />
                            <input type="text" name="keterangan" id="custom_keterangan" className="w-full border rounded p-2 focus:ring-orange-500" value={data.keterangan} onChange={e => setData('keterangan', e.target.value)} placeholder="Keterangan" />
                            <button disabled={processing} className="w-full bg-orange-600 text-white py-2 rounded font-bold disabled:opacity-50 disabled:cursor-not-allowed">
                                {processing ? 'Memproses...' : 'Bayar'}
                            </button>
                        </form>
                    </div>
                </Modal>

                {/* MODAL UPLOAD */}
                <Modal show={modalType === 'upload'} onClose={() => setModalType(null)}>
                    <div className="p-6">
                        <h3 className="font-bold mb-4">Upload Bukti</h3>
                        <form onSubmit={handleUpload} className="space-y-4">
                            <input
                                type="text"
                                name="jumlah_bayar"
                                id="upload_jumlah_bayar"
                                className="w-full border rounded p-2 focus:ring-green-500 font-bold"
                                value={data.jumlah_bayar}
                                onChange={e => setData('jumlah_bayar', formatCurrencyInput(e.target.value))}
                                required
                                placeholder="Nominal (Rp)"
                            />
                            <input type="file" name="bukti_bayar" id="upload_bukti_bayar" className="w-full border rounded p-2 focus:ring-green-500" onChange={e => setData('bukti_bayar', e.target.files[0])} required />
                            <input type="text" name="keterangan" id="upload_keterangan" className="w-full border rounded p-2 focus:ring-green-500" value={data.keterangan} onChange={e => setData('keterangan', e.target.value)} placeholder="Keterangan" />
                            <button disabled={processing} className="w-full bg-green-600 text-white py-2 rounded font-bold disabled:opacity-50 disabled:cursor-not-allowed">
                                {processing ? 'Mengirim...' : 'Kirim'}
                            </button>
                        </form>
                    </div>
                </Modal>

            </div>
        </AuthenticatedLayout>
    );
}