<?php

namespace App\Http\Controllers;

use App\Models\UangMasuk;
use App\Models\RiwayatUangMasuk;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AdminUangMasukController extends Controller
{
    public function index()
    {
        // Ambil data uang masuk beserta usernya
        $data = UangMasuk::with('user')->latest()->get();
        return Inertia::render('Admin/UangMasuk/Index', ['data' => $data]);
    }

    // Mencatat Cicilan Baru
    public function storePayment(Request $request, $id)
    {
        $request->validate([
            'jumlah_bayar' => 'required|numeric|min:1',
            'keterangan' => 'nullable|string',
        ]);

        $uangMasuk = UangMasuk::findOrFail($id);

        // 1. Simpan Riwayat
        RiwayatUangMasuk::create([
            'uang_masuk_id' => $uangMasuk->id,
            'jumlah_bayar' => $request->jumlah_bayar,
            'tanggal_bayar' => now(),
            'keterangan' => $request->keterangan,
            'pencatat_id' => Auth::id(),
        ]);

        // 2. Update Total Dibayar & Status
        $uangMasuk->sudah_dibayar += $request->jumlah_bayar;
        
        if ($uangMasuk->sudah_dibayar >= $uangMasuk->total_tagihan) {
            $uangMasuk->status = 'Lunas';
        }

        $uangMasuk->save();

        return redirect()->back()->with('success', 'Pembayaran berhasil dicatat.');
    }
    
    // Fitur Opsional: Generate Tagihan untuk user baru (bisa dipanggil saat daftar ulang)
    public function generateTagihan($userId, $nominal) {
        UangMasuk::firstOrCreate(
            ['user_id' => $userId],
            ['total_tagihan' => $nominal, 'sudah_dibayar' => 0, 'status' => 'Belum Lunas']
        );
    }
}