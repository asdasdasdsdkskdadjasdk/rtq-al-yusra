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
     * Menampilkan Halaman Dashboard SPP
     */
    public function index(Request $request)
    {
        // 1. Ambil Parameter Filter dari URL
        $search = $request->input('search');
        $filterBulan = $request->input('bulan');

        // 2. Ambil Data PENDING (Untuk Tab Approval Cepat)
        // Data ini tetap diambil terpisah agar admin fokus ke yang butuh aksi
        $pending = SppTransaction::with('user')
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->get();

        // 3. Ambil Data TRANSAKSI UTAMA (History)
        // Ini yang support Search, Filter Bulan, dan Pagination
        $query = SppTransaction::with(['user', 'pencatat']);

        // Logika Search Nama
        if ($search) {
            $query->whereHas('user', function($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%");
            });
        }

        // Logika Filter Bulan
        if ($filterBulan) {
            $query->where('bulan', $filterBulan);
        }

        // Urutkan & Paginate (10 data per halaman)
        $transactions = $query->orderBy('tahun', 'desc')
            ->orderBy('bulan', 'desc')
            ->latest()
            ->paginate(10) 
            ->withQueryString(); // Agar search tidak hilang saat klik page 2

        // 4. List Siswa (Untuk Dropdown Input Manual)
        $students = User::where('role', 'wali_santri')
            ->orderBy('name')
            ->select('id', 'name')
            ->get();

        return Inertia::render('Admin/Spp/Index', [
            'pending' => $pending,
            'transactions' => $transactions, 
            'students' => $students,
            
            // --- PENTING: Kirim ini agar tidak error di frontend ---
            'filters' => $request->only(['search', 'bulan']), 
        ]);
    }

    /**
     * UPDATE SPP (EDIT DATA & STATUS)
     */
    public function update(Request $request, $id)
    {
        $trx = SppTransaction::findOrFail($id);

        $request->validate([
            'nominal' => 'required|numeric|min:0',
            'status' => 'required|in:pending,approved,rejected',
            'keterangan' => 'nullable|string',
        ]);

        $trx->update([
            'nominal' => $request->nominal,
            'status' => $request->status,
            'keterangan' => $request->keterangan,
            // Jika diubah jadi approved, update pencatatnya
            'pencatat_id' => ($request->status == 'approved') ? Auth::id() : $trx->pencatat_id,
        ]);

        return back()->with('success', 'Data SPP berhasil diperbarui.');
    }

    /**
     * APPROVE
     */
    public function approve($id)
    {
        $trx = SppTransaction::findOrFail($id);
        $trx->update([
            'status' => 'approved',
            'pencatat_id' => Auth::id(),
            'keterangan' => $trx->keterangan . ' [ACC Admin]'
        ]);
        return back()->with('success', 'Pembayaran diterima.');
    }

    /**
     * REJECT
     */
    public function reject($id)
    {
        $trx = SppTransaction::findOrFail($id);
        
        // Hapus file fisik jika ada
        if ($trx->bukti_bayar) {
            Storage::disk('public')->delete($trx->bukti_bayar);
        }

        // Hapus data dari database (atau ubah status jadi rejected jika mau soft delete)
        $trx->delete(); 
        
        return back()->with('success', 'Pembayaran ditolak/dihapus.');
    }

    /**
     * INPUT MANUAL
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

        // Cek duplikat tagihan di bulan yang sama untuk user yang sama (Opsional)
        /*
        $exists = SppTransaction::where('user_id', $request->user_id)
            ->where('bulan', $request->bulan)
            ->where('tahun', $request->tahun)
            ->where('status', '!=', 'rejected')
            ->exists();
        
        if ($exists) {
            return back()->with('error', 'SPP untuk periode tersebut sudah ada.');
        }
        */

        SppTransaction::create([
            'user_id' => $request->user_id,
            'bulan' => $request->bulan,
            'tahun' => $request->tahun,
            'nominal' => $request->jumlah_bayar, // Frontend kirim 'jumlah_bayar', DB kolom 'nominal'
            'tipe_pembayaran' => 'admin_input',
            'status' => 'approved', // Input admin otomatis Lunas
            'keterangan' => $request->keterangan ?? 'Pembayaran Tunai',
            'pencatat_id' => Auth::id()
        ]);

        return back()->with('success', 'Pembayaran Tunai berhasil dicatat.');
    }
}