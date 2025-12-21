<?php

namespace App\Http\Controllers;

use App\Models\Pendaftar;
use App\Models\SppTransaction;
use App\Models\Program;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Midtrans\Config;
use Midtrans\Snap;
use Carbon\Carbon;

class WaliSppController extends Controller
{
    /**
     * Menampilkan Halaman Utama SPP Wali Santri
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        // 1. AMBIL DATA PENDAFTAR
        $pendaftar = Pendaftar::where('user_id', $user->id)
            ->with('program')
            ->where('status', 'Lulus') 
            ->latest()
            ->first();
        
        if (!$pendaftar) {
            $pendaftar = Pendaftar::where('user_id', $user->id)->with('program')->latest()->first();
        }

        // --- LOGIKA TANGGAL MULAI (DEFAULT SEPTEMBER) ---
        // Jika Admin sudah set tanggal, pakai itu.
        // Jika BELUM (Null), kita set default ke 1 September tahun pendaftaran.
        if ($pendaftar && $pendaftar->tanggal_mulai_spp) {
            $tglMulai = Carbon::parse($pendaftar->tanggal_mulai_spp);
        } else {
            // Fallback Default: 1 September tahun dia mendaftar
            $tahunDaftar = $pendaftar ? $pendaftar->created_at->year : Carbon::now()->year;
            $tglMulai = Carbon::create($tahunDaftar, 9, 1);
        }

        // 2. SETUP RANGE TANGGAL
        $tglSekarang = Carbon::now(); // Hari ini

        // Buat List Tahun untuk Dropdown Filter
        $tahunList = range($tglMulai->year, $tglSekarang->year);
        
        // Ambil filter tahun, default tahun sekarang
        $tahunDipilih = (int) $request->input('tahun', $tglSekarang->year);
        
        // Validasi tahun
        if (!in_array($tahunDipilih, $tahunList)) {
            $tahunDipilih = $tglSekarang->year;
        }

        // 3. INFO BIAYA & PROGRAM
        $program = $pendaftar ? $pendaftar->program : null;
        $isBeasiswa = $program && stripos($program->nama, 'Beasiswa') !== false;
        $nominalSpp = ($program && !$isBeasiswa) ? (int)$program->nominal_spp : 0;

        // 4. GENERATE LIST BULAN
        $listBulan = [];

        // Loop bulan 1 - 12
        for ($bulan = 1; $bulan <= 12; $bulan++) {
            
            $cekTanggal = Carbon::create($tahunDipilih, $bulan, 1)->endOfMonth();

            // A. Skip bulan SEBELUM Tanggal Masuk
            if ($cekTanggal->lt($tglMulai->startOfMonth())) {
                continue; 
            }

            // B. Skip bulan MASA DEPAN
            if ($cekTanggal->gt($tglSekarang->endOfMonth())) {
                continue; 
            }

            // --- CEK STATUS DATABASE ---
            $transaksi = SppTransaction::where('user_id', $user->id)
                ->where('bulan', $bulan)
                ->where('tahun', $tahunDipilih)
                ->where('status', 'approved')
                ->first();

            $pending = SppTransaction::where('user_id', $user->id)
                ->where('bulan', $bulan)
                ->where('tahun', $tahunDipilih)
                ->where('status', 'pending')
                ->latest()
                ->first();

            $status = 'Belum Lunas';
            $bisaBayar = true;

            if ($isBeasiswa) {
                $status = 'Gratis (Beasiswa)';
                $bisaBayar = false;
            } elseif ($transaksi) {
                $status = 'Lunas';
                $bisaBayar = false;
            } elseif ($pending) {
                $status = 'Menunggu Konfirmasi';
                $bisaBayar = false;
            }

            $listBulan[] = [
                'bulan_angka' => $bulan,
                'bulan_nama' => $cekTanggal->translatedFormat('F'),
                'tahun' => $tahunDipilih,
                'tagihan' => $isBeasiswa ? 0 : $nominalSpp,
                'status' => $status,
                'bisa_bayar' => $bisaBayar, 
                'riwayat_terakhir' => $transaksi ?? $pending 
            ];
        }
        
        $listBulan = array_reverse($listBulan); 

        // Kita kirim 'spp_aktif' => true karena sekarang sudah ada default-nya
        return Inertia::render('Wali/Spp/Index', [
            'spp_aktif' => true, 
            'listBulan' => $listBulan,
            'nominalSpp' => $nominalSpp,
            'isBeasiswa' => $isBeasiswa,
            'midtrans_client_key' => config('midtrans.client_key'),
            'tahunDipilih' => $tahunDipilih,
            'tahunList' => $tahunList
        ]);
    }

    // --- METHOD PEMBAYARAN TETAP SAMA ---
    
    public function payStandard(Request $request)
    {
        $request->validate(['bulan' => 'required', 'tahun' => 'required']);
        return $this->processMidtrans($request, 'midtrans_auto', false);
    }

    public function payCustom(Request $request)
    {
        $request->validate([
            'bulan' => 'required', 'tahun' => 'required',
            'jumlah_bayar' => 'required|numeric|min:10000',
            'keterangan' => 'nullable|string'
        ]);
        return $this->processMidtrans($request, 'midtrans_manual', true);
    }

    private function processMidtrans($request, $tipe, $isCustom)
    {
        $user = Auth::user();
        if ($isCustom) {
            $nominal = $request->jumlah_bayar;
        } else {
            $pendaftar = Pendaftar::where('user_id', $user->id)->with('program')->latest()->first();
            $nominal = $pendaftar->program->nominal_spp;
        }

        $trx = SppTransaction::create([
            'user_id' => $user->id,
            'bulan' => $request->bulan,
            'tahun' => $request->tahun,
            'jumlah_bayar' => $nominal,
            'tipe_pembayaran' => $tipe,
            'status' => 'pending', 
            'keterangan' => $request->keterangan ?? ($isCustom ? 'SPP Custom/Infak' : 'SPP Reguler'),
        ]);

        Config::$serverKey = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized = config('midtrans.is_sanitized');
        Config::$is3ds = config('midtrans.is_3ds');

        $params = [
            'transaction_details' => [
                'order_id' => 'SPP-' . $trx->id . '-' . time(),
                'gross_amount' => (int)$nominal,
            ],
            'customer_details' => [
                'first_name' => $user->name,
                'email' => $user->email,
            ],
            'item_details' => [[
                'id' => 'SPP-BLN-'.$request->bulan,
                'price' => (int)$nominal,
                'quantity' => 1,
                'name' => 'SPP Bulan ' . $request->bulan
            ]]
        ];

        try {
            $snapToken = Snap::getSnapToken($params);
            $trx->update(['snap_token' => $snapToken]);
            return response()->json(['token' => $snapToken]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function storeUpload(Request $request)
    {
        $request->validate([
            'bulan' => 'required', 'tahun' => 'required',
            'jumlah_bayar' => 'required|numeric',
            'bukti_bayar' => 'required|image|max:2048',
            'keterangan' => 'nullable|string'
        ]);

        $path = $request->file('bukti_bayar')->store('bukti_spp', 'public');

        SppTransaction::create([
            'user_id' => Auth::id(),
            'bulan' => $request->bulan,
            'tahun' => $request->tahun,
            'jumlah_bayar' => $request->jumlah_bayar,
            'tipe_pembayaran' => 'transfer_manual',
            'status' => 'pending',
            'bukti_bayar' => $path,
            'keterangan' => $request->keterangan,
        ]);

        return back()->with('success', 'Bukti berhasil diupload. Tunggu verifikasi.');
    }
}