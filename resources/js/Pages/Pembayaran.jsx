import React, { useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Pembayaran({ auth, pendaftar, clientKey, qrCode }) {

    // Load Midtrans Snap Script
    useEffect(() => {
        // Cek jika script sudah ada agar tidak double load
        if (document.getElementById('midtrans-script')) return;

        const script = document.createElement('script');
        script.src = "https://app.sandbox.midtrans.com/snap/snap.js"; 
        script.id = 'midtrans-script';
        script.setAttribute('data-client-key', clientKey);
        document.body.appendChild(script);

        return () => {
            // Cleanup jika komponen di-unmount (opsional)
            const scriptTag = document.getElementById('midtrans-script');
            if (scriptTag) document.body.removeChild(scriptTag);
        };
    }, [clientKey]);

    const handlePayment = () => {
        if (window.snap) {
            window.snap.pay(pendaftar.snap_token, {
                onSuccess: function(result){
                    alert("Pembayaran Berhasil!");
                    window.location.reload();
                },
                onPending: function(result){
                    alert("Menunggu Pembayaran...");
                    window.location.reload();
                },
                onError: function(result){
                    alert("Pembayaran Gagal!");
                },
                onClose: function(){
                    alert('Anda menutup popup tanpa menyelesaikan pembayaran');
                }
            });
        } else {
            alert("Sistem pembayaran belum siap. Silakan refresh halaman.");
        }
    };

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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        {/* Detail Pendaftar */}
                        <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-100">
                            <h3 className="font-bold text-gray-800 text-lg border-b pb-2 mb-4">Detail Calon Santri</h3>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase">Nama Lengkap</label>
                                <p className="text-base font-semibold text-gray-900">{pendaftar.nama}</p>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase">Program Pilihan</label>
                                <p className="text-base font-semibold text-gray-900">{pendaftar.program_nama}</p>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase">Total Tagihan</label>
                                <p className="text-2xl font-bold text-alyusra-orange">
                                    {formatRupiah(pendaftar.nominal_pembayaran)}
                                </p>
                            </div>
                        </div>

                        {/* Bagian Pembayaran / QR Code */}
                        <div className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-gray-200">
                            {pendaftar.status_pembayaran === 'Lunas' ? (
                                <div className="text-center w-full">
                                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-green-700">Pembayaran Berhasil!</h3>
                                    <p className="text-gray-600 mt-2 text-sm">Pendaftaran Anda sedang diproses oleh admin.</p>
                                    <Link href={route('dashboard')}>
                                        <PrimaryButton className="mt-6 w-full justify-center">
                                            Ke Dashboard Saya
                                        </PrimaryButton>
                                    </Link>
                                </div>
                            ) : (
                                <div className="text-center w-full">
                                    <h3 className="text-lg font-bold text-gray-800 mb-2">QR Code Pendaftaran</h3>
                                    <p className="text-xs text-gray-500 mb-6">Scan untuk menyimpan ID pendaftaran (Bukan QRIS)</p>
                                    
                                    {/* Menampilkan QR Code ID Pendaftaran dari Controller */}
                                    {qrCode && (
                                        <div className="mb-6 flex justify-center bg-white p-2 rounded-lg shadow-sm border inline-block">
                                            <div dangerouslySetInnerHTML={{ __html: qrCode }} />
                                        </div>
                                    )}

                                    <div className="border-t border-gray-200 w-full my-4"></div>

                                    <p className="text-sm text-gray-600 mb-4 font-medium">
                                        Untuk menyelesaikan pendaftaran, silakan bayar melalui tombol di bawah:
                                    </p>

                                    <PrimaryButton 
                                        onClick={handlePayment} 
                                        className="w-full justify-center py-3 text-lg bg-alyusra-orange hover:bg-orange-600 shadow-md transition transform hover:-translate-y-1"
                                    >
                                        Bayar Sekarang (QRIS/Transfer)
                                    </PrimaryButton>
                                    
                                    <p className="text-[10px] text-gray-400 mt-3">
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

// ... import dan kode lainnya ...

const handlePayment = () => {
    if (window.snap) {
        window.snap.pay(pendaftar.snap_token, {
            onSuccess: function(result){
                alert("Pembayaran Berhasil! Mengalihkan...");
                // Reload halaman. 
                // Karena di controller sudah kita pasang redirect, 
                // reload ini akan otomatis membawa user ke halaman 'status.cek'
                window.location.reload(); 
            },
            onPending: function(result){
                alert("Menunggu Pembayaran...");
                window.location.reload();
            },
            onError: function(result){
                alert("Pembayaran Gagal!");
            },
            onClose: function(){
                // Opsional
            }
        });
    } else {
        alert("Sistem belum siap. Refresh halaman.");
    }
};

// ... return JSX ...