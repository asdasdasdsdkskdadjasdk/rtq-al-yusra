<?php

namespace App\Http\Controllers;

use App\Models\SppTransaction;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Notifications\GeneralNotification;

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

        // Logika Filter Tahun
        $filterTahun = $request->input('tahun');
        if ($filterTahun) {
            $query->where('tahun', $filterTahun);
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
            'filters' => $request->only(['search', 'bulan', 'tahun']), 
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

        if ($request->status !== 'pending') {
        $msg = $request->status == 'approved' 
            ? "Pembayaran SPP Bulan ini Diterima." 
            : "Pembayaran SPP Ditolak. Mohon cek bukti transfer.";
            
        $type = $request->status == 'approved' ? 'success' : 'error';

        $trx->user->notify(new GeneralNotification($msg, route('wali.spp.index'), $type));
    }

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
        
        // Notify User
        if($trx->user) {
             $trx->user->notify(new GeneralNotification(
                "Pembayaran SPP Bulan {$trx->bulan} Diterima.",
                route('wali.spp.index'),
                'success'
            ));
        }

        return back()->with('success', 'Pembayaran diterima.');
    }

    /**
     * REJECT
     */
    public function reject($id)
    {
        $trx = SppTransaction::with('user')->findOrFail($id);
        $user = $trx->user; // Simpan referensi user sebelum delete
        
        // Notify User BEFORE deleting (or change logic to update status 'rejected')
        // Disini kita ubah status jadi 'rejected' agar history tidak hilang
        // Atau jika policy-nya delete, kirim notif dulu.
        // Opsi User: "jika status sudah di ubah maka di wali santri akan ada notif"
        
        // Kita ubah jadi UPDATE status rejected, BUKAN DELETE, agar history ada.
        if ($trx->bukti_bayar) {
            Storage::disk('public')->delete($trx->bukti_bayar);
        }

        $trx->update([
            'status' => 'rejected',
            'bukti_bayar' => null, // Hapus referensi file
            'keterangan' => $trx->keterangan . ' [Ditolak Admin]'
        ]);

        if($user) {
             $user->notify(new GeneralNotification(
                "Pembayaran SPP Bulan {$trx->bulan} Ditolak. Silakan upload ulang.",
                route('wali.spp.index'),
                'error'
            ));
        }
        
        return back()->with('success', 'Pembayaran ditolak.');
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