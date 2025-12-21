<?php

namespace App\Http\Controllers;

use App\Models\SppTransaction;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class AdminSppController extends Controller
{
    /**
     * Menampilkan Halaman Dashboard SPP untuk Admin Keuangan
     */
    public function index()
    {
        // 1. Ambil Data PENDING (Yang butuh persetujuan)
        // Yaitu: Transfer Manual (Upload Bukti) & Midtrans Manual (Custom Nominal)
        $pending = SppTransaction::with('user')
            ->where('status', 'pending')
            ->whereIn('tipe_pembayaran', ['midtrans_manual', 'transfer_manual']) 
            ->latest()
            ->get();

        // 2. Ambil Data HISTORY (Yang sudah Lunas/Selesai)
        $history = SppTransaction::with(['user', 'pencatat'])
            ->where('status', 'approved')
            ->latest()
            ->get();

        // 3. List Wali Santri (Untuk keperluan Input Manual Tunai)
        $users = User::where('role', 'wali_santri')->select('id', 'name', 'email')->get();

        return Inertia::render('Admin/Spp/Index', [
            'pending' => $pending,
            'history' => $history,
            'users' => $users
        ]);
    }

    /**
     * LOGIKA APPROVE (TERIMA PEMBAYARAN)
     * Dipanggil saat Admin klik tombol "Terima"
     */
    public function approve($id)
    {
        $trx = SppTransaction::findOrFail($id);
        
        // Update status jadi Lunas & Catat siapa admin yang menyetujui
        $trx->update([
            'status' => 'approved',
            'pencatat_id' => Auth::id(), // ID Admin yang login
            'keterangan' => $trx->keterangan . ' [Disetujui Admin]'
        ]);

        return back()->with('success', 'Pembayaran berhasil diterima & status menjadi Lunas.');
    }

    /**
     * LOGIKA REJECT (TOLAK PEMBAYARAN)
     * Dipanggil saat Admin klik tombol "Tolak"
     */
    public function reject($id)
    {
        $trx = SppTransaction::findOrFail($id);
        
        // Hapus file bukti bayar dari server agar hemat storage
        if ($trx->bukti_bayar) {
            Storage::disk('public')->delete($trx->bukti_bayar);
        }

        // Update status jadi Rejected
        $trx->update([
            'status' => 'rejected',
            'pencatat_id' => Auth::id(),
            'keterangan' => $trx->keterangan . ' [Ditolak Admin: Bukti tidak valid/Dana belum masuk]'
        ]);

        return back()->with('success', 'Pembayaran ditolak.');
    }

    /**
     * LOGIKA INPUT MANUAL (TUNAI)
     * Dipanggil saat Admin mengisi form input manual
     */
    public function storeManual(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'bulan' => 'required|integer|min:1|max:12',
            'tahun' => 'required|integer',
            'jumlah_bayar' => 'required|numeric|min:1000',
            'keterangan' => 'nullable|string'
        ]);

        SppTransaction::create([
            'user_id' => $request->user_id,
            'bulan' => $request->bulan,
            'tahun' => $request->tahun,
            'jumlah_bayar' => $request->jumlah_bayar,
            'tipe_pembayaran' => 'admin_input',
            'status' => 'approved', // Kalau input manual Admin, otomatis Lunas
            'keterangan' => $request->keterangan ?? 'Pembayaran Tunai di Kantor',
            'pencatat_id' => Auth::id()
        ]);

        return back()->with('success', 'Pembayaran Tunai berhasil dicatat.');
    }
}