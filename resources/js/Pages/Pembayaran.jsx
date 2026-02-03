import React, { useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Pembayaran({ auth, pendaftar, qrCode }) {
    // Ambil configurasi Global
    const { midtrans } = usePage().props;

    // Load Midtrans Snap Script & Embed (Fresh Load Strategy - Strict Cleanup)
    useEffect(() => {
        const scriptId = 'midtrans-script';

        // 1. Fungsi Cleanup: Hapus Script & Global Object
        const cleanupSnap = () => {
            const existingScript = document.getElementById(scriptId);
            if (existingScript) existingScript.remove();

            // Hapus global object snap agar tidak ada state 'stale'
            if (window.snap) {
                try { delete window.snap; } catch (e) { window.snap = undefined; }
            }
        };

        // Bersihkan state lama sebelum memulai (Penting untuk SPA Navigation)
        cleanupSnap();

        // 2. Buat Script Baru
        // Tentukan URL berdasarkan Environment Backend (Production vs Sandbox)
        const isProduction = midtrans.is_production === true || midtrans.is_production === 'true' || midtrans.is_production === 1;
        const snapUrl = isProduction
            ? "https://app.midtrans.com/snap/snap.js"
            : "https://app.sandbox.midtrans.com/snap/snap.js";

        const script = document.createElement('script');
        script.src = snapUrl;
        script.id = scriptId;
        script.setAttribute('data-client-key', midtrans.client_key);

        // 3. Fungsi Embed
        const embedSnap = () => {
            // Pastikan snap sudah load & token ada
            if (window.snap && pendaftar.snap_token) {
                const snapContainer = document.getElementById('snap-container');
                if (snapContainer) {
                    snapContainer.innerHTML = ""; // Clear content
                    try {
                        window.snap.embed(pendaftar.snap_token, {
                            embedId: 'snap-container',
                            onSuccess: function (result) {
                                alert("Pembayaran Berhasil!");
                                window.location.reload();
                            },
                            onPending: function (result) {
                                alert("Menunggu Pembayaran...");
                                window.location.reload();
                            },
                            onError: function (result) {
                                console.error("Snap Error:", result);
                                alert("Pembayaran Gagal!");
                            },
                            onClose: function () { }
                        });
                    } catch (error) {
                        console.error("Snap Embed Error:", error);
                    }
                }
            }
        };

        // 4. Trigger saat Load
        script.onload = () => {
            embedSnap();
        };

        document.body.appendChild(script);

        // 5. Cleanup saat Unmount
        return () => {
            cleanupSnap();
        };

    }, [midtrans, pendaftar.snap_token]);

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(angka);
    };

    return (
        <AppLayout auth={auth} heroTheme="dark">
            <Head title="Pembayaran Formulir" />

            {/* Hero Section (Mirip Formulir) */}
            <div
                className="relative bg-gray-800 pb-20 mt-[-80px] overflow-hidden"
                style={{
                    backgroundImage: "url('/images/rtq.jpg')",
                    backgroundSize: 'cover',
                    backgroundAttachment: 'fixed',
                    backgroundPosition: 'center'
                }}
            >
                <div className="absolute inset-0 bg-black/70"></div>
                <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-32">
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-white text-center mb-6">
                        Pembayaran Pendaftaran
                    </h1>
                </div>
            </div>

            {/* Konten Pembayaran */}
            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 -mt-16 z-20 pb-20">
                <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-lg">

                    <div className="text-center mb-8 border-b pb-6">
                        <p className="font-semibold text-alyusra-orange">Nomor Pendaftaran</p>
                        <h2 className="text-3xl font-bold text-alyusra-dark-blue">{pendaftar.no_pendaftaran}</h2>

                        <div className="mt-4 flex justify-center">
                            {/* Menampilkan Status Pembayaran */}
                            {pendaftar.status_pembayaran === 'Lunas' ? (
                                <span className="inline-block px-4 py-1 bg-green-100 text-green-700 font-bold rounded-full text-sm">
                                    LUNAS
                                </span>
                            ) : (
                                <span className="inline-block px-4 py-1 bg-red-100 text-red-700 font-bold rounded-full text-sm">
                                    BELUM DIBAYAR
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Layout Baru: Vertical Stack & Centered */}
                    <div className="max-w-2xl mx-auto flex flex-col gap-8">

                        {/* Detail Pendaftar */}
                        <div className="space-y-4 bg-gray-50 p-8 rounded-xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-gray-800 text-xl border-b pb-4 mb-4 text-center">Detail Calon Santri</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center sm:text-left">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Nama Lengkap</label>
                                    <p className="text-lg font-semibold text-gray-900">{pendaftar.nama}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Program Pilihan</label>
                                    <p className="text-lg font-semibold text-gray-900">{pendaftar.program_nama}</p>
                                </div>
                            </div>
                            <div className="pt-4 border-t mt-4 text-center">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Tagihan</label>
                                <p className="text-4xl font-extrabold text-alyusra-orange">
                                    {formatRupiah(pendaftar.nominal_pembayaran)}
                                </p>
                            </div>
                        </div>

                        {/* Bagian Pembayaran / QR Code */}
                        <div className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-gray-300 bg-white">
                            {pendaftar.status_pembayaran === 'Lunas' ? (
                                <div className="text-center w-full py-8">
                                    <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                                        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-green-700 mb-2">Pembayaran Berhasil!</h3>
                                    <p className="text-gray-600 text-base">Terima kasih, pendaftaran Anda sedang diproses oleh admin.</p>
                                </div>
                            ) : (
                                <div className="text-center w-full">


                                    <div className="border-t border-gray-200 w-full my-6 relative">
                                        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-gray-400 text-sm font-medium">
                                            Pembayaran
                                        </span>
                                    </div>

                                    <p className="text-base text-gray-700 mb-6 font-medium">
                                        Silakan selesaikan pembayaran di bawah ini:
                                    </p>

                                    {/* KONTAINER UNTUK SNAP EMBED */}
                                    <div id="snap-container" className="w-full min-h-[500px] border rounded-lg overflow-hidden shadow-sm"></div>

                                    <p className="text-[10px] text-gray-400 mt-4 flex items-center justify-center gap-1">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                        Pembayaran aman & verifikasi otomatis didukung oleh Midtrans
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 border-t pt-6 text-center">
                        <Link href={route('status.cek')}>  {/* GANTI KE ROUTE BARU */}
                            <PrimaryButton className="mt-6 w-full justify-center">
                                Lihat Jadwal Ujian & Status
                            </PrimaryButton>
                        </Link>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}