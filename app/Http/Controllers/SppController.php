<?php

namespace App\Http\Controllers;

use App\Models\PembayaranSpp;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class SppController extends Controller
{
    public function index()
    {
        // Ambil data history pembayaran milik user yang sedang login
        $history = PembayaranSpp::where('user_id', Auth::id())
            ->latest()
            ->get();

        return Inertia::render('Wali/Spp/Index', [
            'history' => $history
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'bulan' => 'required|string',
            'tahun' => 'required|numeric',
            'jumlah' => 'required|numeric|min:1000',
            'bukti_transfer' => 'required|image|mimes:jpg,jpeg,png|max:2048', // Maks 2MB
        ]);

        // Upload Gambar
        $path = $request->file('bukti_transfer')->store('bukti_spp', 'public');

        // Simpan ke Database
        PembayaranSpp::create([
            'user_id' => Auth::id(),
            'bulan' => $request->bulan,
            'tahun' => $request->tahun,
            'jumlah' => $request->jumlah,
            'bukti_transfer' => $path,
            'status' => 'Menunggu Konfirmasi'
        ]);

        return redirect()->back()->with('success', 'Bukti pembayaran berhasil diupload.');
    }
}