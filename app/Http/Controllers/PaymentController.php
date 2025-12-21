<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pendaftar;
use App\Models\UangMasuk;
use App\Models\RiwayatUangMasuk;
use App\Models\SppTransaction; // <--- Add SPP Model
use Midtrans\Config;
use Midtrans\Notification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PaymentController extends Controller
{
    /**
     * Halaman Pembayaran (Khusus Pendaftaran Awal)
     */
    public function show($id)
    {
        $pendaftar = Pendaftar::findOrFail($id);
        
        // Setup Config agar Client Key di frontend sesuai
        Config::$serverKey = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');
        
        return Inertia::render('Pembayaran', [
            'pendaftar' => $pendaftar,
            'clientKey' => config('midtrans.client_key'),
        ]);
    }

    /**
     * Webhook Notification Handler (Dipanggil oleh Midtrans)
     */
    public function notification(Request $request)
    {
        // 1. Konfigurasi Midtrans
        Config::$serverKey = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized = config('midtrans.is_sanitized');
        Config::$is3ds = config('midtrans.is_3ds');

        try {
            $notif = new Notification();
        } catch (\Exception $e) {
            Log::error('Midtrans Notification Error: ' . $e->getMessage());
            return response()->json(['message' => 'Invalid notification data'], 400);
        }

        $transaction = $notif->transaction_status;
        $type = $notif->payment_type;
        $orderId = $notif->order_id;
        $fraud = $notif->fraud_status;

        // Log masuknya notifikasi untuk debugging
        Log::info("Midtrans Notification received for Order ID: $orderId ($transaction)");

        // 2. Tentukan Status Transaksi
        $transactionStatus = null;
        if ($transaction == 'capture') {
            if ($type == 'credit_card') {
                $transactionStatus = ($fraud == 'challenge') ? 'challenge' : 'success';
            }
        } elseif ($transaction == 'settlement') {
            $transactionStatus = 'success';
        } elseif ($transaction == 'pending') {
            $transactionStatus = 'pending';
        } elseif ($transaction == 'deny' || $transaction == 'expire' || $transaction == 'cancel') {
            $transactionStatus = 'failure';
        }

        // 3. Proses Berdasarkan Tipe Order ID
        
        // --- KASUS A: Pembayaran Pendaftaran (RTQ-...) ---
        if (str_starts_with($orderId, 'RTQ-')) {
            $parts = explode('-', $orderId);
            array_pop($parts); // Buang timestamp
            $realNoPendaftaran = implode('-', $parts);

            $pendaftar = Pendaftar::where('no_pendaftaran', $realNoPendaftaran)
                            ->orWhere('snap_token', $orderId)
                            ->first();
            
            if ($pendaftar) {
                if ($transactionStatus == 'success') {
                    $pendaftar->update([
                        'status_pembayaran' => 'Lunas',
                        'status' => 'Menunggu Verifikasi'
                    ]);
                    Log::info("Pendaftaran Lunas: $realNoPendaftaran");
                } elseif ($transactionStatus == 'failure') {
                    $pendaftar->update(['status_pembayaran' => 'Gagal']);
                }
            }
        }

        // --- KASUS B: Pembayaran Uang Masuk (UM-...) ---
        elseif (str_starts_with($orderId, 'UM-')) {
            $parts = explode('-', $orderId);
            
            if (count($parts) >= 2) {
                $uangMasukId = $parts[1]; // ID ada di tengah
                $uangMasuk = UangMasuk::find($uangMasukId);

                if ($uangMasuk && $transactionStatus == 'success') {
                    DB::transaction(function () use ($uangMasuk, $notif, $orderId) {
                        // Cek Idempotency (Mencegah double input)
                        $cekDouble = RiwayatUangMasuk::where('keterangan', 'LIKE', "%$orderId%")->exists();

                        if (!$cekDouble) {
                            // Simpan Riwayat
                            RiwayatUangMasuk::create([
                                'uang_masuk_id' => $uangMasuk->id,
                                'jumlah_bayar'  => $notif->gross_amount,
                                'tanggal_bayar' => now(),
                                'keterangan'    => 'Midtrans Order: ' . $orderId,
                                'pencatat_id'   => $uangMasuk->user_id,
                                'status'        => 'approved' // Auto approved krn Midtrans
                            ]);

                            // Update Saldo
                            $uangMasuk->sudah_dibayar += $notif->gross_amount;
                            
                            // Auto Lunas jika cukup
                            if ($uangMasuk->sudah_dibayar >= $uangMasuk->total_tagihan) {
                                $uangMasuk->status = 'Lunas';
                            }
                            
                            $uangMasuk->save();
                            
                            Log::info("Cicilan Uang Masuk Berhasil: Rp " . $notif->gross_amount);
                        }
                    });
                }
            }
        }

        // --- KASUS C: Pembayaran SPP (SPP-...) [BARU] ---
        elseif (str_starts_with($orderId, 'SPP-')) {
            // Format: SPP-{ID_Transaksi}-{Timestamp}
            $parts = explode('-', $orderId);
            $trxId = $parts[1];
            
            $sppTrx = SppTransaction::find($trxId);

            if ($sppTrx) {
                if ($transactionStatus == 'success') {
                    
                    // 1. Jika Tipe 'midtrans_auto' -> Langsung APPROVED (Lunas)
                    if ($sppTrx->tipe_pembayaran == 'midtrans_auto') {
                        $sppTrx->update([
                            'status' => 'approved',
                            'keterangan' => $sppTrx->keterangan . ' [Lunas via Midtrans]'
                        ]);
                        Log::info("SPP Auto Lunas: ID $trxId");
                    }
                    
                    // 2. Jika Tipe 'midtrans_manual' (Custom Nominal) -> Tetap PENDING tapi update info
                    // Menunggu Admin Keuangan klik "Terima" di dashboard
                    else if ($sppTrx->tipe_pembayaran == 'midtrans_manual') {
                        $sppTrx->update([
                            'keterangan' => $sppTrx->keterangan . ' [Uang Masuk Midtrans - Menunggu Verifikasi Admin]'
                        ]);
                        Log::info("SPP Custom Masuk (Pending Verif): ID $trxId");
                    }

                } elseif ($transactionStatus == 'failure') {
                    $sppTrx->update(['status' => 'rejected']);
                }
            }
        }

        return response()->json(['status' => 'OK']);
    }
}