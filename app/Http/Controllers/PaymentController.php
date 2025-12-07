<?php

namespace App\Http\Controllers;

use App\Models\Pendaftar;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Midtrans\Config;
use Midtrans\Snap;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    public function show($id)
    {
        // Cari pendaftar berdasarkan NIK
        // Jika data sudah dihapus (karena expire), ini akan otomatis return 404 (Not Found)
$pendaftar = Pendaftar::findOrFail($id);
        if ($pendaftar->user_id !== \Illuminate\Support\Facades\Auth::id()) {
            abort(403);
        }

        if ($pendaftar->status_pembayaran == 'Lunas') {
        return redirect()->route('status.cek');
    }
    
        // Konfigurasi Midtrans
        Config::$serverKey = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized = config('midtrans.is_sanitized');
        Config::$is3ds = config('midtrans.is_3ds');

        // Generate Token baru jika belum ada
        if (empty($pendaftar->snap_token) && $pendaftar->status_pembayaran == 'Belum Bayar' && $pendaftar->nominal_pembayaran > 0) {
            
            $params = [
                'transaction_details' => [
                    'order_id' => $pendaftar->no_pendaftaran . '-' . time(), // Order ID unik
                    'gross_amount' => (int) $pendaftar->nominal_pembayaran,
                ],
                'customer_details' => [
                    'first_name' => $pendaftar->nama,
                    'email' => $pendaftar->email,
                    'phone' => $pendaftar->no_hp,
                ],
                // --- PENTING: SETTING WAKTU KADALUWARSA ---
                // Di sini kita atur agar Midtrans otomatis menganggap expire setelah waktu tertentu
                'expiry' => [
                    'start_time' => date("Y-m-d H:i:s O"),
                    'unit' => 'minutes', 
                    'duration' => 1 // Data dihapus jika tidak dibayar dalam 60 menit
                ],
            ];

            try {
                $snapToken = Snap::getSnapToken($params);
                $pendaftar->update(['snap_token' => $snapToken]);
            } catch (\Exception $e) {
                Log::error('Midtrans Error: ' . $e->getMessage());
            }
        }

        // Render halaman
        return Inertia::render('Pembayaran', [
            'pendaftar' => $pendaftar,
            'clientKey' => config('midtrans.client_key'),
            // 'qrCode' => ... (kode qr statis Anda jika ada)
        ]);
    }

    // --- LOGIKA UTAMA: WEBHOOK NOTIFICATION ---
    // Method ini yang dipanggil otomatis oleh Midtrans di background
    public function notification(Request $request)
    {

        Log::info('Midtrans Notification Masuk!');
        Log::info('Data:', $request->all());
        $serverKey = config('midtrans.server_key');
        
        // Validasi Signature
        $hashed = hash("sha512", $request->order_id . $request->status_code . $request->gross_amount . $serverKey);
        
        if ($hashed == $request->signature_key) {
            
            // Parsing Order ID untuk mendapatkan No Pendaftaran asli
            $orderIdParts = explode('-', $request->order_id);
            array_pop($orderIdParts); // Buang timestamp di belakang
            $noPendaftaranAsli = implode('-', $orderIdParts);

            $pendaftar = Pendaftar::where('no_pendaftaran', $noPendaftaranAsli)->first();

            if ($pendaftar) {
                // SKENARIO 1: PEMBAYARAN BERHASIL
                if ($request->transaction_status == 'capture' || $request->transaction_status == 'settlement') {
                    $pendaftar->update([
                        'status_pembayaran' => 'Lunas',
                        'status' => 'Pendaftaran Diterima'
                    ]);
                } 
                // SKENARIO 2: WAKTU HABIS (EXPIRE) -> HAPUS DATA
                elseif ($request->transaction_status == 'expire') {
                    // Hapus data formulir agar user harus daftar ulang
                    $pendaftar->delete();
                }
                // SKENARIO 3: DIBATALKAN (CANCEL/DENY) -> HAPUS DATA
                elseif ($request->transaction_status == 'cancel' || $request->transaction_status == 'deny') {
                    $pendaftar->delete();
                }
            }
        }
    }
}