<?php

namespace App\Http\Controllers;

use App\Models\UangMasuk;
use App\Models\RiwayatUangMasuk;
use App\Models\Pendaftar;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class AdminUangMasukController extends Controller
{
    public function index(Request $request)
    {
        // Ambil parameter pencarian dari URL
        $search = $request->input('search');

        // 1. Data History (Dengan Filter Search)
        $historyQuery = RiwayatUangMasuk::with(['uangMasuk.user', 'pencatat'])
            ->where('status', 'approved');

        // Jika ada pencarian, filter berdasarkan nama user
        if ($search) {
            $historyQuery->whereHas('uangMasuk.user', function($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%");
            });
        }

        $history = $historyQuery->orderBy('tanggal_bayar', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        // 2. Data Pending (Menunggu Konfirmasi)
        $pending = RiwayatUangMasuk::with(['uangMasuk.user'])
            ->where('status', 'pending')
            ->latest()
            ->get();

        // 3. Data Siswa (Dengan Filter Search & Logika Program)
        $siswaQuery = UangMasuk::with(['user', 'riwayat']);

        // Jika ada pencarian, filter berdasarkan nama user
        if ($search) {
            $siswaQuery->whereHas('user', function($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%");
            });
        }

        $siswa = $siswaQuery->latest()
            ->get()
            ->map(function($item) {
                
                // --- LOGIKA MENCARI PROGRAM & HARGA ---
                // 1. Cari pendaftar LULUS & SUDAH DAFTAR ULANG (Prioritas Utama)
                $pendaftar = Pendaftar::where('user_id', $item->user_id)
                    ->with('program')
                    ->where('status', 'Sudah Daftar Ulang')
                    ->latest()
                    ->first();

                // 2. Fallback: Jika belum daftar ulang, cari yang LULUS saja
                if (!$pendaftar) {
                    $pendaftar = Pendaftar::where('user_id', $item->user_id)
                        ->with('program')
                        ->where('status', 'Lulus')
                        ->latest()
                        ->first();
                }

                // 3. Fallback Terakhir: Ambil data terbaru apapun statusnya
                if (!$pendaftar) {
                    $pendaftar = Pendaftar::where('user_id', $item->user_id)
                        ->with('program')
                        ->latest()
                        ->first();
                }

                $program = $pendaftar ? $pendaftar->program : null;
                
                $namaProgram = $program ? $program->nama : 'Umum/Reguler';
                
                // Ambil harga dari tabel Program. Jika null, pakai 5jt default
                $tagihanProgram = $program ? (int)$program->nominal_uang_masuk : 5000000;

                // --- CEK BEASISWA ---
                $isBeasiswa = false;
                if ($program && stripos($namaProgram, 'Beasiswa') !== false) {
                    $isBeasiswa = true;
                    $tagihanProgram = 0; // Gratis
                }

                // --- TENTUKAN STATUS FINAL ---
                $statusFinal = $item->status; 

                if ($statusFinal === 'Belum Lunas') {
                    if ($isBeasiswa) {
                        $statusFinal = 'Lunas'; 
                    } elseif ($tagihanProgram > 0 && $item->sudah_dibayar >= $tagihanProgram) {
                        $statusFinal = 'Lunas'; 
                    }
                }

                return [
                    'id' => $item->id,
                    'user' => $item->user,
                    'nama_program' => $namaProgram, 
                    'status_pendaftaran' => $pendaftar ? $pendaftar->status : 'Belum Daftar',
                    'is_beasiswa' => $isBeasiswa,
                    'sudah_dibayar' => $item->sudah_dibayar,
                    'total_tagihan' => $tagihanProgram,
                    'sisa' => max(0, $tagihanProgram - $item->sudah_dibayar),
                    'status_kalkulasi' => $statusFinal,
                    'riwayat' => $item->riwayat 
                ];
            });

        return Inertia::render('Admin/UangMasuk/Index', [
            'history' => $history,
            'pending' => $pending,
            'siswa' => $siswa,
            'filters' => $request->only(['search']), // Kirim filter kembali ke frontend
        ]);
    }

    // --- INPUT PEMBAYARAN MANUAL ---
    public function storePayment(Request $request, $id)
    {
        $request->validate(['jumlah_bayar' => 'required|numeric', 'tanggal_bayar' => 'required|date']);
        
        DB::transaction(function () use ($request, $id) {
            $uangMasuk = UangMasuk::findOrFail($id);
            
            // --- CARI PROGRAM UNTUK AUTO-LUNAS ---
            $pendaftar = Pendaftar::where('user_id', $uangMasuk->user_id)
                ->with('program')
                ->where('status', 'Sudah Daftar Ulang') 
                ->latest()
                ->first();
            
            if(!$pendaftar) {
                 $pendaftar = Pendaftar::where('user_id', $uangMasuk->user_id)->with('program')->latest()->first();
            }

            $program = $pendaftar ? $pendaftar->program : null;

            // 1. Simpan Riwayat
            RiwayatUangMasuk::create([
                'uang_masuk_id' => $uangMasuk->id,
                'jumlah_bayar' => $request->jumlah_bayar,
                'tanggal_bayar' => $request->tanggal_bayar,
                'keterangan' => $request->keterangan,
                'pencatat_id' => Auth::id(),
                'status' => 'approved',
                'created_at' => $request->tanggal_bayar . ' ' . now()->format('H:i:s')
            ]);

            $uangMasuk->sudah_dibayar += $request->jumlah_bayar;

            // 2. AUTO LOCK STATUS
            if ($program) {
                if (stripos($program->nama, 'Beasiswa') !== false) {
                    $uangMasuk->status = 'Lunas';
                } else {
                    $target = (int)$program->nominal_uang_masuk;
                    if ($uangMasuk->sudah_dibayar >= $target) {
                        $uangMasuk->status = 'Lunas';
                    }
                }
            }

            $uangMasuk->save();
        });

        return back()->with('success', 'Transaksi berhasil.');
    }

    public function updateStatus(Request $request, $id) {
        $request->validate(['status' => 'required|in:Lunas,Belum Lunas']);
        $uangMasuk = UangMasuk::findOrFail($id);
        $uangMasuk->status = $request->status;
        $uangMasuk->save();
        return back()->with('success', 'Status berhasil diubah.');
    }

    public function approve($id) {
        DB::transaction(function () use ($id) {
            $riwayat = RiwayatUangMasuk::findOrFail($id);
            if ($riwayat->status !== 'pending') return;
            $riwayat->update(['status' => 'approved']);
            
            $uangMasuk = UangMasuk::find($riwayat->uang_masuk_id);
            if ($uangMasuk) {
                $uangMasuk->sudah_dibayar += $riwayat->jumlah_bayar;
                
                // Cari Program untuk Auto Lock
                $pendaftar = Pendaftar::where('user_id', $uangMasuk->user_id)->where('status', 'Sudah Daftar Ulang')->latest()->with('program')->first();
                if (!$pendaftar) $pendaftar = Pendaftar::where('user_id', $uangMasuk->user_id)->latest()->with('program')->first();

                $program = $pendaftar ? $pendaftar->program : null;

                if ($program) {
                    $target = (int)$program->nominal_uang_masuk;
                    $isBeasiswa = stripos($program->nama, 'Beasiswa') !== false;
                    if ($isBeasiswa || $uangMasuk->sudah_dibayar >= $target) {
                        $uangMasuk->status = 'Lunas';
                    }
                }
                $uangMasuk->save();
            }
        });
        return back()->with('success', 'Pembayaran disetujui.');
    }

    public function reject($id) {
        $riwayat = RiwayatUangMasuk::findOrFail($id);
        if ($riwayat->bukti_bayar) Storage::disk('public')->delete($riwayat->bukti_bayar);
        $riwayat->delete(); 
        return back()->with('success', 'Ditolak.');
    }

    /**
     * Update Riwayat Pembayaran per Transaksi (FITUR BARU)
     */
    public function updateHistory(Request $request, $id)
    {
        // 1. Ambil data riwayat
        $riwayat = RiwayatUangMasuk::findOrFail($id);
        
        // 2. Validasi Input
        $request->validate([
            'jumlah_bayar' => 'required|numeric|min:0',
            'tanggal_bayar' => 'required|date',
            'keterangan' => 'nullable|string',
        ]);

        // 3. Update Data Riwayat
        $riwayat->update([
            'jumlah_bayar' => $request->jumlah_bayar,
            'tanggal_bayar' => $request->tanggal_bayar,
            'keterangan' => $request->keterangan,
        ]);

        // 4. Hitung Ulang Total Tagihan Induk
        $uangMasuk = $riwayat->uangMasuk; // Ambil parentnya
        
        // Hitung sum dari semua riwayat yang statusnya 'approved'
        $totalBayarBaru = $uangMasuk->riwayat()
            ->where('status', 'approved')
            ->sum('jumlah_bayar');

        $uangMasuk->sudah_dibayar = $totalBayarBaru;

        // Cek Status Lunas/Belum Otomatis
        if ($totalBayarBaru >= $uangMasuk->total_tagihan) {
            $uangMasuk->status = 'Lunas';
        } else {
            // Jika diedit jadi lebih kecil, status bisa kembali jadi Belum Lunas
            $uangMasuk->status = 'Belum Lunas';
        }
        
        $uangMasuk->save();

        return back()->with('success', 'Riwayat pembayaran berhasil diperbarui.');
    }

    public function deleteHistory($id)
    {
        // 1. Ambil data riwayat
        $riwayat = RiwayatUangMasuk::findOrFail($id);
        $uangMasuk = $riwayat->uangMasuk;

        // 2. Hapus riwayat
        $riwayat->delete();

        // 3. Hitung Ulang Total Tagihan Induk
        $totalBayarBaru = $uangMasuk->riwayat()
            ->where('status', 'approved')
            ->sum('jumlah_bayar');

        $uangMasuk->sudah_dibayar = $totalBayarBaru;

        // Cek Status Lunas/Belum Otomatis
        if ($totalBayarBaru >= $uangMasuk->total_tagihan) {
            $uangMasuk->status = 'Lunas';
        } else {
            $uangMasuk->status = 'Belum Lunas';
        }
        
        $uangMasuk->save();

        return back()->with('success', 'Riwayat pembayaran berhasil dihapus.');
    }
}