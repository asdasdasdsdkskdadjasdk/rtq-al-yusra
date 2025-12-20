<?php

namespace App\Http\Controllers;

use App\Models\Pendaftar;
use App\Models\PembayaranSpp;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminKeuanganController extends Controller
{
    public function index()
    {
        // 1. Data Pemasukan Pendaftaran (Hanya yang Lunas / Gratis)
        $pendaftaran = Pendaftar::whereIn('status_pembayaran', ['Lunas', 'Gratis'])
            ->select('id', 'no_pendaftaran', 'nama', 'program_nama', 'nominal_pembayaran', 'created_at', 'status_pembayaran')
            ->latest()
            ->get();

        // 2. Data SPP (Semua status)
        // Pastikan Anda sudah membuat relasi 'user' di model PembayaranSpp
        $spp = PembayaranSpp::with('user') 
            ->latest()
            ->get();

        // 3. Hitung Total
        $totalPendaftaran = $pendaftaran->sum('nominal_pembayaran');
        $totalSpp = $spp->where('status', 'Diterima')->sum('jumlah');

        return Inertia::render('Admin/Keuangan/Index', [
            'pendaftaran' => $pendaftaran,
            'spp' => $spp,
            'total_pendaftaran' => $totalPendaftaran,
            'total_spp' => $totalSpp
        ]);
    }

    // Fitur Konfirmasi SPP
    public function verifySpp(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:Diterima,Ditolak',
            'catatan' => 'nullable|string'
        ]);

        $spp = PembayaranSpp::findOrFail($id);
        $spp->update([
            'status' => $request->status,
            'catatan_admin' => $request->catatan
        ]);

        return redirect()->back()->with('success', 'Status pembayaran SPP berhasil diperbarui.');
    }
}