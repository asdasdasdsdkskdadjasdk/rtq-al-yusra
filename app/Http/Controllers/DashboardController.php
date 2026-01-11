<?php

namespace App\Http\Controllers;

use App\Models\Pendaftar;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class DashboardController extends Controller
{
    // --- KONFIGURASI API (Untuk Wali Santri) ---
    private $baseUrl = 'http://127.0.0.1:8080/api/v1/santri';
    private $apiKey  = 'RTQALYUSRA-RAHASIA-2025-YANG-SULIT-DITEBAK';

    public function index()
    {
        $user = Auth::user();
        
        $statusLulus = ['Lulus', 'Sudah Daftar Ulang', 'LULUS'];

        // =================================================================
        // 1. DATA DASHBOARD ADMIN PSB
        // =================================================================
        
        $gender = [
            'ikhwan' => DB::table('pendaftar')->where('jenis_kelamin', 'Laki-laki')->count(),
            'akhwat' => DB::table('pendaftar')->where('jenis_kelamin', 'Perempuan')->count(),
        ];

        // Minat Program (Robust)
        try {
            $rawProgramStats = DB::table('pendaftar') 
                ->select('program_id', DB::raw('count(*) as total'))
                ->whereNotNull('program_id')
                ->groupBy('program_id')
                ->get();

            $per_program = $rawProgramStats->map(function($item) {
                $prog = DB::table('programs')->where('id', $item->program_id)->first();
                return [
                    'program_nama' => $prog ? $prog->nama : 'Program ID ' . $item->program_id,
                    'total' => $item->total
                ];
            })->sortByDesc('total')->values();
        } catch (\Exception $e) {
            $per_program = [];
        }

        $per_status = DB::table('pendaftar')
            ->select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->orderByDesc('total')
            ->get();
        
        $per_cabang = DB::table('pendaftar')
            ->select('cabang', DB::raw('count(*) as total'))
            ->groupBy('cabang')
            ->orderByDesc('total')
            ->get()
            ->map(function($item) {
                if (empty($item->cabang)) $item->cabang = 'Tanpa Cabang';
                return $item;
            });


        // =================================================================
        // 2. DATA DASHBOARD KEUANGAN (LOGIKA: MONITORING REALISASI)
        // =================================================================
        
        $total_siswa = DB::table('pendaftar')->count();
        $total_lulus = DB::table('pendaftar')->whereIn('status', $statusLulus)->count();
        
        $formulir_lunas = 0;
        $um_lunas = 0;
        $spp_transaksi = 0;
        $total_pendapatan = 0;
        $chart_data = [];

        try {
            // --- A. Hitung Global ---
            $formulir_lunas = DB::table('pendaftar')
                ->whereIn('status_pembayaran', ['Lunas', 'settlement'])
                ->count();
            
            // Uang Masuk Global (Smart Logic)
            if (Schema::hasTable('uang_masuks')) {
                $um_lunas = DB::table('uang_masuks')
                    ->join('users', 'uang_masuks.user_id', '=', 'users.id')
                    ->join('pendaftar', 'users.id', '=', 'pendaftar.user_id')
                    ->leftJoin('programs', 'pendaftar.program_id', '=', 'programs.id')
                    ->whereIn('pendaftar.status', $statusLulus)
                    ->where(function($q) {
                        $q->where('uang_masuks.status', 'Lunas')
                          ->orWhere('programs.nama', 'LIKE', '%Beasiswa%')
                          ->orWhereRaw('uang_masuks.sudah_dibayar >= COALESCE(programs.nominal_uang_masuk, 5000000)');
                    })
                    ->distinct('uang_masuks.id')
                    ->count('uang_masuks.id');
                
                if (Schema::hasTable('riwayat_uang_masuks')) {
                    $total_pendapatan += DB::table('riwayat_uang_masuks')
                        ->whereIn('status', ['approved', 'Diterima']) 
                        ->sum('jumlah_bayar'); 
                }
            }

            // SPP Global (Transaksi bulan ini + Total Uang)
            if (Schema::hasTable('spp_transactions')) {
                $spp_transaksi = DB::table('spp_transactions')
                    ->where('status', 'approved') 
                    ->count();
                
                $total_pendapatan += DB::table('spp_transactions')
                    ->where('status', 'approved')
                    ->sum('jumlah_bayar');
            }

            // --- B. Data Per Cabang (Visualisasi) ---
            
            $list_cabang = DB::table('pendaftar')
                ->select('cabang')
                ->distinct()
                ->pluck('cabang');

            if ($list_cabang->isEmpty() && $total_siswa > 0) {
                $list_cabang = collect([null]); 
            }

            foreach ($list_cabang as $cabang_db) {
                $cabang_label = $cabang_db ? $cabang_db : 'Tanpa Cabang';

                $filterCabang = function($query) use ($cabang_db) {
                    if ($cabang_db) {
                        $query->where('pendaftar.cabang', $cabang_db);
                    } else {
                        $query->where(function($q) { $q->whereNull('pendaftar.cabang')->orWhere('pendaftar.cabang', ''); });
                    }
                };
                
                $filterCabangPendaftar = function($query) use ($cabang_db) {
                    if ($cabang_db) {
                        $query->where('cabang', $cabang_db);
                    } else {
                        $query->where(function($q) { $q->whereNull('cabang')->orWhere('cabang', ''); });
                    }
                };

                // 1. Total Siswa LULUS (Target Tagihan)
                $total_lulus_cabang = DB::table('pendaftar')
                    ->where($filterCabangPendaftar)
                    ->whereIn('status', $statusLulus)
                    ->count();

                // 2. Uang Masuk Lunas
                $um_cabang = 0;
                if (Schema::hasTable('uang_masuks')) {
                    $um_cabang = DB::table('uang_masuks')
                        ->join('users', 'uang_masuks.user_id', '=', 'users.id')
                        ->join('pendaftar', 'users.id', '=', 'pendaftar.user_id')
                        ->leftJoin('programs', 'pendaftar.program_id', '=', 'programs.id')
                        ->where($filterCabang)
                        ->whereIn('pendaftar.status', $statusLulus)
                        ->where(function($q) {
                            $q->where('uang_masuks.status', 'Lunas')
                              ->orWhere('programs.nama', 'LIKE', '%Beasiswa%')
                              ->orWhereRaw('uang_masuks.sudah_dibayar >= COALESCE(programs.nominal_uang_masuk, 5000000)');
                        })
                        ->distinct('uang_masuks.id')
                        ->count('uang_masuks.id');
                }

                // 3. SPP (LOGIKA BARU: Siswa yg bayar bulan ini)
                $spp_cabang = 0;
                if (Schema::hasTable('spp_transactions')) {
                    $spp_cabang = DB::table('spp_transactions')
                        ->join('pendaftar', 'spp_transactions.user_id', '=', 'pendaftar.user_id')
                        ->where($filterCabang)
                        ->where('spp_transactions.status', 'approved')
                        // Tambahan: Filter Bulan Ini & Tahun Ini
                        ->whereMonth('spp_transactions.created_at', now()->month)
                        ->whereYear('spp_transactions.created_at', now()->year)
                        // Hitung jumlah siswanya (bukan transaksinya)
                        ->distinct('pendaftar.id')
                        ->count('pendaftar.id');
                }

                // Masukkan ke chart (Tampilkan Total Lulus sebagai "Total Siswa" di chart keuangan agar relevan)
                if ($total_lulus_cabang > 0) {
                    $chart_data[] = [
                        'cabang' => $cabang_label,
                        'total_siswa' => $total_lulus_cabang, 
                        'uang_masuk_lunas' => $um_cabang,
                        'uang_masuk_belum' => max(0, $total_lulus_cabang - $um_cabang), 
                        'spp_count' => $spp_cabang // Sekarang artinya: "Jumlah Siswa Bayar SPP Bulan Ini"
                    ];
                }
            }

        } catch (\Exception $e) {
            Log::error("Dashboard Finance Error: " . $e->getMessage());
        }

        // =================================================================
        // 3. LOGIKA WALI SANTRI
        // =================================================================
        $waliData = [];
        if ($user->role === 'wali_santri') {
            try {
                $response = Http::withHeaders(['X-API-KEY' => $this->apiKey])->get($this->baseUrl);
                if ($response->successful()) {
                    $allSantri = $response->json();
                    $santri = collect($allSantri)->first(function ($s) use ($user) {
                        return strtolower($s['nama_santri']) === strtolower($user->name);
                    });

                    if ($santri) {
                        $id = $santri['id'];
                        $resHafalan = Http::withHeaders(['X-API-KEY' => $this->apiKey])->get("{$this->baseUrl}/{$id}/hafalan");
                        $resAbsensi = Http::withHeaders(['X-API-KEY' => $this->apiKey])->get("{$this->baseUrl}/{$id}/kehadiran");
                        
                        $hafalanData = $resHafalan->json() ?? [];
                        $absensiData = $resAbsensi->json() ?? [];

                        $waliData = [
                            'santri' => $santri,
                            'attendanceStats' => [
                                'Hadir' => collect($absensiData)->where('status_kehadiran', 'Hadir')->count(),
                                'Sakit' => collect($absensiData)->where('status_kehadiran', 'Sakit')->count(),
                                'Izin'  => collect($absensiData)->where('status_kehadiran', 'Izin')->count(),
                                'Alpha' => collect($absensiData)->where('status_kehadiran', 'Alpha')->count(),
                            ],
                            'setoranTerakhir' => collect($hafalanData)->sortByDesc('tanggal')->first(),
                            'progressHafalan' => [
                                'selesai' => collect($hafalanData)->pluck('juz')->unique()->count(),
                                'persen'  => (collect($hafalanData)->pluck('juz')->unique()->count() / 30) * 100,
                                'sedang_hafal' => collect($hafalanData)->sortByDesc('tanggal')->first()['juz'] ?? '-' 
                            ]
                        ];
                    }
                }
            } catch (\Exception $e) {}
        }

        // =================================================================
        // 4. RETURN DATA
        // =================================================================
        $stats = [
            'total_pendaftar' => $total_siswa,
            'total_lulus' => $total_lulus,
            'hari_ini' => DB::table('pendaftar')->whereDate('created_at', now())->count(),
            'total_pendapatan' => $total_pendapatan,
            'formulir' => [
                'sudah' => $formulir_lunas,
                'belum' => $total_siswa - $formulir_lunas
            ],
            'uang_masuk' => [
                'sudah' => $um_lunas,
                'belum' => $total_lulus - $um_lunas 
            ],
            'spp_transaksi' => $spp_transaksi
        ];

        $terbaru = [];
        if ($user->role === 'keuangan') {
            try {
                if (Schema::hasTable('spp_transactions')) {
                    $terbaru = DB::table('spp_transactions')
                        ->join('users', 'spp_transactions.user_id', '=', 'users.id')
                        ->select('spp_transactions.created_at', 'users.name as nama', DB::raw("'SPP Online' as jenis"), 'spp_transactions.jumlah_bayar as nominal', 'spp_transactions.status as status')
                        ->where('spp_transactions.status', 'approved')
                        ->orderBy('created_at', 'desc')
                        ->limit(5)
                        ->get();
                }
            } catch (\Exception $e) {}
        } else {
            $terbaru = DB::table('pendaftar')->orderBy('created_at', 'desc')->limit(5)->get();
        }

        return Inertia::render('Dashboard', array_merge([
            'stats' => $stats,
            'gender' => $gender,
            'per_cabang' => $per_cabang,
            'per_program' => $per_program,
            'per_status' => $per_status,
            'terbaru' => $terbaru,
            'chart_data' => $chart_data,
            'role' => $user->role
        ], $waliData));
    }
}