<?php

namespace App\Http\Controllers;

use App\Models\UangMasuk;
use App\Models\RiwayatUangMasuk;
use App\Models\Pendaftar; // <--- PASTIKAN IMPORT MODEL INI
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class AdminUangMasukController extends Controller
{
    public function index()
    {
        // 1. Data History
        $history = RiwayatUangMasuk::with(['uangMasuk.user', 'pencatat'])
            ->where('status', 'approved')
            ->orderBy('tanggal_bayar', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        // 2. Data Pending
        $pending = RiwayatUangMasuk::with(['uangMasuk.user'])
            ->where('status', 'pending')
            ->latest()
            ->get();

        // 3. Data Siswa
        // Hapus 'user.pendaftar.program' dari eager loading bawaan agar kita bisa custom query di bawah
        $siswa = UangMasuk::with(['user', 'riwayat']) 
            ->latest()
            ->get()
            ->map(function($item) {
                
                // --- [LOGIKA PERBAIKAN: CARI FORMULIR YANG BENAR] ---
                // Kita cari formulir milik user ini, yang statusnya LULUS, dan ambil yang TERBARU.
                $pendaftar = Pendaftar::where('user_id', $item->user_id)
                    ->with('program') // Load programnya sekalian
                    ->where('status', 'Sudah Daftar Ulang') // <--- FILTER PENTING: Hanya yang Lulus
                    ->latest() // Ambil yang paling baru (jika ada duplikat lulus)
                    ->first();

                // Jika tidak ada yang "Lulus", coba ambil yang terbaru saja (fallback)
                if (!$pendaftar) {
                    $pendaftar = Pendaftar::where('user_id', $item->user_id)
                        ->with('program')
                        ->latest()
                        ->first();
                }

                $program = $pendaftar ? $pendaftar->program : null;
                
                // --- AMBIL DATA PROGRAM & HARGA ---
                $namaProgram = $program ? $program->nama : 'Umum/Reguler';
                
                // Ambil harga dari tabel Program. Jika null, pakai 5jt default
                $tagihanProgram = $program ? (int)$program->nominal_uang_masuk : 5000000;

                // --- CEK BEASISWA ---
                $isBeasiswa = false;
                if ($program && stripos($namaProgram, 'Beasiswa') !== false) {
                    $isBeasiswa = true;
                    $tagihanProgram = 0; // Gratis
                }

                // --- TENTUKAN STATUS (PRIORITAS DATABASE) ---
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
                    'status_pendaftaran' => $pendaftar ? $pendaftar->status : 'Belum Daftar', // Info tambahan buat debug
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
            'siswa' => $siswa
        ]);
    }

    // --- INPUT PEMBAYARAN MANUAL ---
    public function storePayment(Request $request, $id)
    {
        $request->validate(['jumlah_bayar' => 'required|numeric', 'tanggal_bayar' => 'required|date']);
        
        DB::transaction(function () use ($request, $id) {
            $uangMasuk = UangMasuk::findOrFail($id);
            
            // --- CARI PROGRAM YANG VALID (Sama seperti index) ---
            $pendaftar = Pendaftar::where('user_id', $uangMasuk->user_id)
                ->with('program')
                ->where('status', 'Lulus') 
                ->latest()
                ->first();
            
            // Fallback jika belum di-set lulus
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

    // ... (UpdateStatus, Approve, Reject SAMA PERSIS DENGAN SEBELUMNYA) ...
    // Pastikan copy method updateStatus, approve, reject dari jawaban sebelumnya
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
                $pendaftar = Pendaftar::where('user_id', $uangMasuk->user_id)->where('status', 'Lulus')->latest()->with('program')->first();
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
}