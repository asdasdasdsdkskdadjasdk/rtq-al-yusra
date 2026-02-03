<?php

namespace App\Http\Controllers;

use App\Models\DaftarUlang;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class WaliDaftarUlangController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $currentYear = Carbon::now()->year;

        // Ambil riwayat tagihan
        $history = DaftarUlang::where('user_id', $user->id)
            ->orderBy('tahun', 'desc')
            ->get();
            
        // Cek apakah ada tagihan tahun ini yang belum dibuat?
        // Logic: Jika belum ada di DB, berarti admin belum setting.
        
        return Inertia::render('Wali/DaftarUlang/Index', [
            'history' => $history,
            'currentYear' => $currentYear,
            'midtrans_client_key' => config('services.midtrans.client_key')
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:daftar_ulangs,id',
            'bukti_bayar' => 'required|image|max:2048',
            'keterangan' => 'nullable|string'
        ]);

        $tagihan = DaftarUlang::where('id', $request->id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $path = $request->file('bukti_bayar')->store('bukti_daftar_ulang', 'public');

        $tagihan->update([
            'bukti_bayar' => $path,
            'keterangan' => $request->keterangan,
            'status' => 'pending' // Reset to pending if re-uploading or first time
        ]);
        
        // Notifikasi ke Admin / Keuangan
        $admins = \App\Models\User::whereIn('role', ['admin', 'keuangan'])->get();
        $notifMessage = "Bukti pembayaran Daftar Ulang baru dari " . Auth::user()->name;
        // Gunakan URL yang valid untuk admin finance
        $notifUrl = '/admin/daftar-ulang'; 
        
        foreach ($admins as $admin) {
            $admin->notify(new \App\Notifications\GeneralNotification($notifMessage, $notifUrl, 'info'));
        }

        return back()->with('success', 'Bukti pembayaran berhasil diupload.');
    }

    public function pay(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:daftar_ulangs,id'
        ]);

        $tagihan = DaftarUlang::where('id', $request->id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        // Konfigurasi Midtrans
        \Midtrans\Config::$serverKey = config('services.midtrans.server_key');
        \Midtrans\Config::$isProduction = config('services.midtrans.is_production');
        \Midtrans\Config::$isSanitized = true;
        \Midtrans\Config::$is3ds = true;

        $orderId = 'DU-' . $tagihan->id . '-' . time();

        $params = [
            'transaction_details' => [
                'order_id' => $orderId,
                'gross_amount' => (int) $tagihan->nominal_tagihan,
            ],
            'customer_details' => [
                'first_name' => Auth::user()->name,
                'email' => Auth::user()->email,
            ],
            // Custom field untuk callback nanti
            'custom_field1' => 'daftar_ulang',
            'custom_field2' => $tagihan->id
        ];

        try {
            $snapToken = \Midtrans\Snap::getSnapToken($params);
            
            // Simpan order_id sementara (opsional, tapi bagus untuk tracking)
            // $tagihan->update(['midtrans_order_id' => $orderId]); 

            return response()->json(['snap_token' => $snapToken]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
