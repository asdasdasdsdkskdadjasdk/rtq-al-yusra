<?php

namespace App\Http\Controllers;

use App\Models\Pendaftar;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Notifications\GeneralNotification; // Import ini

class KeuanganFormulirController extends Controller
{
    public function index(Request $request)
    {
        // Ambil data pendaftar dengan pencarian
        $query = Pendaftar::with('program');

        if ($request->search) {
            $query->where('nama', 'like', '%' . $request->search . '%')
                  ->orWhere('no_pendaftaran', 'like', '%' . $request->search . '%');
        }

        // Urutkan dari yang terbaru
        $pendaftar = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/Keuangan/Formulir/Index', [
            'pendaftar' => $pendaftar,
            'filters' => $request->only(['search']),
        ]);
    }

    
    public function show($id)
    {
        // Detail pendaftar (jika ingin lihat detail bukti bayar formulir)
        $pendaftar = Pendaftar::with('program')->findOrFail($id);

        return Inertia::render('Admin/Keuangan/Formulir/Show', [
            'pendaftar' => $pendaftar
        ]);
    }

    public function update(Request $request, $id)
    {
        $pendaftar = Pendaftar::findOrFail($id);

        $request->validate([
            'status_pembayaran' => 'required|string|in:Belum Bayar,Lunas,Gagal',
        ]);

        $pendaftar->update([
            'status_pembayaran' => $request->status_pembayaran
        ]);

        $waliUser = \App\Models\User::find($pendaftar->user_id);

    if ($waliUser && $request->status_pembayaran != 'Belum Bayar') {
        $pesan = "";
        $type = "info";

        if ($request->status_pembayaran == 'Lunas') {
            $pesan = "Pembayaran Formulir untuk {$pendaftar->nama} telah DIKONFIRMASI.";
            $type = "success";
        } elseif ($request->status_pembayaran == 'Gagal') {
            $pesan = "Pembayaran Formulir ditolak/gagal. Silakan hubungi admin.";
            $type = "error";
        }

        // Kirim Notif
        if ($pesan) {
            $waliUser->notify(new GeneralNotification($pesan, route('dashboard'), $type));
        }
    }
    
        return redirect()->back()->with('success', 'Status pembayaran berhasil diperbarui.');
    }
}