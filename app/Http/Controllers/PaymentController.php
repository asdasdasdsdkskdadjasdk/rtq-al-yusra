<?php

namespace App\Http\Controllers;

use App\Models\Pendaftar;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Midtrans\Config;
use Midtrans\Snap;

class PaymentController extends Controller
{
    public function show($id)
    {
        $pendaftar = Pendaftar::findOrFail($id);
if ($pendaftar->user_id !== \Illuminate\Support\Facades\Auth::id()) {
        abort(403);
    }
    
        // Konfigurasi Midtrans
        Config::$serverKey = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized = config('midtrans.is_sanitized');
        Config::$is3ds = config('midtrans.is_3ds');

        // Jika belum ada snap_token atau status masih belum bayar, buat token baru
        if (empty($pendaftar->snap_token) && $pendaftar->status_pembayaran == 'Belum Bayar') {
            
            $params = [
                'transaction_details' => [
                    'order_id' => $pendaftar->no_pendaftaran . '-' . rand(100,999), // Order ID harus unik
                    'gross_amount' => (int) $pendaftar->nominal_pembayaran,
                ],
                'customer_details' => [
                    'first_name' => $pendaftar->nama,
                    'email' => $pendaftar->email,
                    'phone' => $pendaftar->no_hp,
                ],
            ];

            $snapToken = Snap::getSnapToken($params);
            
            $pendaftar->update(['snap_token' => $snapToken]);
        }

        return Inertia::render('Pembayaran', [
            'pendaftar' => $pendaftar,
            'clientKey' => config('midtrans.client_key'), // Kirim Client Key ke Frontend
        ]);
    }

    // Webhook untuk menerima notifikasi dari Midtrans (Otomatis update status)
    public function notification(Request $request)
    {
        $serverKey = config('midtrans.server_key');
        $hashed = hash("sha512", $request->order_id . $request->status_code . $request->gross_amount . $serverKey);

        if ($hashed == $request->signature_key) {
            // Cari pendaftar berdasarkan sebagian no_pendaftaran (karena kita tambah rand tadi)
            // Atau lebih aman simpan order_id di DB. Untuk simpel, kita explode string.
            $orderIdParts = explode('-', $request->order_id);
            // Gabungkan kembali kecuali bagian random terakhir jika formatnya RTQ-YYYY-ID-RAND
            // Cara paling aman: Simpan 'order_id' Midtrans di tabel pendaftar saat generate token.
            // TAPI, untuk sekarang kita cari berdasarkan snap_token atau logika sederhana:
            
            // Asumsi: order_id formatnya "NO_PENDAFTARAN-RANDOM"
            // Kita cari user yang punya order_id ini (jika disimpan) atau kita cari manual.
            // Agar mudah, kita cari user yang nominal & email-nya cocok (alternatif).
            
            // SOLUSI TERBAIK: Kita pakai no_pendaftaran asli sebagai order_id (jika yakin unik)
            // Atau kita cari manual stringnya.
            $noPendaftaranAsli = implode('-', array_slice($orderIdParts, 0, -1)); // Hapus part random terakhir
            
            $pendaftar = Pendaftar::where('no_pendaftaran', $noPendaftaranAsli)->first();

            if ($pendaftar) {
                if ($request->transaction_status == 'capture' || $request->transaction_status == 'settlement') {
                    $pendaftar->update([
                        'status_pembayaran' => 'Lunas',
                        'status' => 'Pendaftaran Diterima'
                    ]);
                } elseif ($request->transaction_status == 'expire' || $request->transaction_status == 'cancel') {
                    $pendaftar->update(['status_pembayaran' => 'Gagal']);
                }
            }
        }
    }
}