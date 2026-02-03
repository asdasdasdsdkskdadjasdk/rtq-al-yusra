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
use Carbon\Carbon;

class DashboardController extends Controller
{
    // --- KONFIGURASI API (Untuk Wali Santri) ---
    // private $baseUrl = ... (Moved to config/services.php)
    // private $apiKey  = ...

    public function index()
    {
        $user = Auth::user();
        $currentYear = now()->year;
        $currentMonth = now()->month;
        
        $statusLulus = ['Lulus', 'Sudah Daftar Ulang', 'LULUS'];

        // =================================================================
        // 1. DATA DASHBOARD ADMIN PSB (Tetap Filter TAHUN INI)
        // =================================================================
        
        $gender = [
            'ikhwan' => DB::table('pendaftar')
                ->whereYear('created_at', $currentYear)
                ->where('jenis_kelamin', 'Laki-laki')
                ->count(),
            'akhwat' => DB::table('pendaftar')
                ->whereYear('created_at', $currentYear)
                ->where('jenis_kelamin', 'Perempuan')
                ->count(),
        ];

        // Minat Program (Include All Programs)
        try {
            $per_program = DB::table('programs')
                ->select('programs.nama as program_nama', DB::raw('count(pendaftar.id) as total'))
                ->leftJoin('pendaftar', function($join) use ($currentYear) {
                    $join->on('programs.id', '=', 'pendaftar.program_id')
                         ->whereYear('pendaftar.created_at', '=', $currentYear);
                })
                ->groupBy('programs.id', 'programs.nama')
                ->orderByDesc('total')
                ->get();
        } catch (\Exception $e) {
            $per_program = [];
        }

        $per_status = DB::table('pendaftar')
            ->select('status', DB::raw('count(*) as total'))
            ->whereYear('created_at', $currentYear)
            ->groupBy('status')
            ->orderByDesc('total')
            ->get();
        
        // --- NEW: Beasiswa vs Reguler (PSB) for This Year ---
        $count_beasiswa = 0;
        $count_reguler = 0;

        try {
            // Join dengan programs untuk cek jenis
            $pendaftar_jenis = DB::table('pendaftar')
                ->join('programs', 'pendaftar.program_id', '=', 'programs.id')
                ->select('programs.jenis', DB::raw('count(*) as total'))
                ->whereYear('pendaftar.created_at', $currentYear)
                ->groupBy('programs.jenis')
                ->get();

            foreach ($pendaftar_jenis as $item) {
                if (stripos($item->jenis, 'Beasiswa') !== false) {
                    $count_beasiswa += $item->total;
                } else {
                    $count_reguler += $item->total;
                }
            }
        } catch (\Exception $e) {
            // Fallback if error
        }
        $per_beasiswa = [
            'beasiswa' => $count_beasiswa,
            'reguler' => $count_reguler
        ];
        
        $per_cabang = [];
        if (Schema::hasTable('cabangs')) {
            $per_cabang = DB::table('cabangs')
                ->select('cabangs.nama as cabang', DB::raw('count(pendaftar.id) as total'))
                ->leftJoin('pendaftar', function($join) use ($currentYear) {
                    $join->on('cabangs.nama', '=', 'pendaftar.cabang')
                         ->whereYear('pendaftar.created_at', '=', $currentYear);
                })
                ->groupBy('cabangs.id', 'cabangs.nama')
                ->orderByDesc('total')
                ->get();
        } else {
            // Fallback jika tabel cabangs belum ada (pake distinct)
            $per_cabang = DB::table('pendaftar')
                ->select('cabang', DB::raw('count(*) as total'))
                ->whereYear('created_at', $currentYear)
                ->groupBy('cabang')
                ->orderByDesc('total')
                ->get()
                ->map(function($item) {
                    if (empty($item->cabang)) $item->cabang = 'Tanpa Cabang';
                    return $item;
                });
        }


        // =================================================================
        // 2. DATA DASHBOARD KEUANGAN
        // =================================================================
        
        // Total Lulus (Tahun Ini)
        $total_lulus = DB::table('pendaftar')
            ->whereIn('status', $statusLulus)
            ->whereYear('created_at', $currentYear)
            ->count();
        
        // Khusus Formulir (Tahun Ini)
        $total_siswa_curr = DB::table('pendaftar')->whereYear('created_at', $currentYear)->count();
        
        $formulir_lunas = 0;
        $um_lunas = 0;
        $spp_transaksi = 0;
        
        // Variables for Finance Role
        $pendapatan_bulan_ini = 0;
        $pendapatan_tahun_ini = 0;
        $spp_tunggakan_per_cabang = [];

        try {
            // --- A. Hitung Global / Spesifik ---
            
            // 1. Formulir (Tahun Ini Saja)
            $formulir_lunas = DB::table('pendaftar')
                ->whereIn('status_pembayaran', ['Lunas', 'settlement'])
                ->whereYear('created_at', $currentYear)
                ->count();
            
            // 2. Uang Masuk (Global - Akumulasi santri yg sudah lunas)
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
                
                // Pendapatan Uang Masuk (Bulan Ini & Tahun Ini)
                if (Schema::hasTable('riwayat_uang_masuks')) {
                    $pendapatan_bulan_ini += DB::table('riwayat_uang_masuks')
                        ->whereIn('status', ['approved', 'Diterima'])
                        ->whereMonth('tanggal_bayar', $currentMonth)
                        ->whereYear('tanggal_bayar', $currentYear)
                        ->sum('jumlah_bayar');

                    $pendapatan_tahun_ini += DB::table('riwayat_uang_masuks')
                        ->whereIn('status', ['approved', 'Diterima']) 
                        ->whereYear('tanggal_bayar', $currentYear)
                        ->sum('jumlah_bayar'); 
                }
            }

            // 3. SPP (Transaksi Lunas - BULAN INI)
            if (Schema::hasTable('spp_transactions')) {
                // Count hanya bulan ini
                $spp_transaksi = DB::table('spp_transactions')
                    ->where('status', 'approved') 
                    ->whereMonth('created_at', $currentMonth)
                    ->whereYear('created_at', $currentYear)
                    ->count();
                
                // Pendapatan SPP (Bulan Ini & Tahun Ini)
                $pendapatan_bulan_ini += DB::table('spp_transactions')
                    ->where('status', 'approved')
                    ->whereMonth('created_at', $currentMonth)
                    ->whereYear('created_at', $currentYear)
                    ->sum('jumlah_bayar');

                $pendapatan_tahun_ini += DB::table('spp_transactions')
                    ->where('status', 'approved')
                    ->whereYear('created_at', $currentYear)
                    ->sum('jumlah_bayar');
            }

            // --- NEW: Monthly Payment Chart Data (Jan - Dec) ---
            $monthly_chart_data = [];
            for ($m = 1; $m <= 12; $m++) {
                // 1. Total Active Students (Cumulative up to this month)
                // Filter: Created at <= Last Date of Month $m, Status IN $statusLulus
                // This represents "Potential Payers" for that month.
                $lastDayOfMonth = Carbon::createFromDate($currentYear, $m)->endOfMonth();
                
                // Don't calculate future months if needed? Or just show 0?
                // Let's show data for all months to see progression.
                
                $active_count_month = DB::table('pendaftar')
                    ->whereIn('status', $statusLulus)
                    // ->where('created_at', '<=', $lastDayOfMonth) // Logic: Accumulate
                    // User Request: "ingat dia tahun ini". 
                    // To be simple and accurate to "Monitoring Tahun Ini":
                    ->whereYear('created_at', $currentYear) // Only students from THIS YEAR or ALL?
                    // "chart perbulan jumlah santri": usually means total student body.
                    // But if Dashboard is "Tahun Ini" scoped (PSB), maybe Finance is too?
                    // EXISTING FINANCE LOGIC used $statusLulus without Year Filter for Tunggakan.
                    // BUT for this chart, let's follow the "Yearly" trend.
                    // Let's count ALL active students up to that month.
                    ->whereDate('created_at', '<=', $lastDayOfMonth)
                    ->count();

                // 2. Paid Count (Approved SPP Transactions in Month $m Year $currentYear)
                $paid_count_month = 0;
                if (Schema::hasTable('spp_transactions')) {
                    $paid_count_month = DB::table('spp_transactions')
                        ->where('status', 'approved')
                        ->where('bulan', $m)
                        ->where('tahun', $currentYear)
                        ->count();
                }

                $monthly_chart_data[] = [
                    'bulan' => Carbon::create()->month($m)->locale('id')->isoFormat('MMM'), // Jan, Feb...
                    'total_siswa' => $active_count_month,
                    'paid_count' => $paid_count_month
                ];
            }

            // --- B. Data Per Cabang (Visualisasi & Tunggakan) ---
            
            // Generate List Cabang (Include All)
            $list_cabang = collect([]);
            if (Schema::hasTable('cabangs')) {
                $list_cabang = DB::table('cabangs')->pluck('nama');
            } else {
                $list_cabang = DB::table('pendaftar')->select('cabang')->distinct()->pluck('cabang');
            }

            if ($list_cabang->isEmpty()) {
                $list_cabang = collect(['']); // Handle empty
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

                // Siswa Aktif (Lulus/Sudah Daftar Ulang) - Filter Tahun Ini ?
                // User Request: "untuk semua aktor saya mau dia data tahun ini saja"
                // Logic Tunggakan: "check user dengan status wali yang tidak beasiswa, check beasiswa check di formulir status daftar ulang yang dengan id user apa beasiswa apa tidak, jika tidak check apa bulan ini ada user ini bayar spp atau tidak nya jika tidak masukkan ke sini"
                
                // 1. Ambil pendaftar aktif di cabang ini (SEMUA ANGKATAN)
                $activeStudents = DB::table('pendaftar')
                    ->select('pendaftar.id', 'pendaftar.user_id', 'pendaftar.program_id', 'pendaftar.nama', 'programs.nama as program_nama', 'programs.jenis as program_jenis')
                    ->leftJoin('programs', 'pendaftar.program_id', '=', 'programs.id')
                    ->where($filterCabangPendaftar)
                    ->whereIn('pendaftar.status', $statusLulus)
                    // ->whereYear('pendaftar.created_at', $currentYear) // REMOVED: Include all active students regardless of year
                    ->get();

                // Hitung Uang Masuk Lunas untuk Cabang Ini (Logic Hilang Previously)
                $um_cabang = 0;
                if (Schema::hasTable('uang_masuks')) {
                    $um_cabang = DB::table('uang_masuks')
                        ->join('users', 'uang_masuks.user_id', '=', 'users.id')
                        ->join('pendaftar', 'users.id', '=', 'pendaftar.user_id')
                        ->leftJoin('programs', 'pendaftar.program_id', '=', 'programs.id')
                        ->where($filterCabang)
                        ->whereIn('pendaftar.status', $statusLulus)
                        ->whereYear('pendaftar.created_at', $currentYear) // Filter Tahun Ini
                        ->where(function($q) {
                            $q->where('uang_masuks.status', 'Lunas')
                              ->orWhere('programs.jenis', 'LIKE', '%Beasiswa%') // Fix: Check Jenis
                              ->orWhereRaw('uang_masuks.sudah_dibayar >= COALESCE(programs.nominal_uang_masuk, 5000000)');
                        })
                        ->distinct('uang_masuks.id')
                        ->count('uang_masuks.id');
                }

                $total_lulus_cabang = $activeStudents->count();
                $spp_sudah_bayar_count = 0;
                $belum_bayar_count = 0;
                $list_penunggak = []; // List nama santri

                foreach ($activeStudents as $student) {
                    // 2. Cek Beasiswa (Logic: Jenis Program mengandung 'Beasiswa')
                    $is_beasiswa = false;
                    // Optimized: Use program_jenis from main query
                    if (!empty($student->program_jenis) && stripos($student->program_jenis, 'Beasiswa') !== false) {
                        $is_beasiswa = true;
                    }

                    // Jika BUKAN beasiswa, cek pembayaran SPP bulan ini
                    if (!$is_beasiswa) {
                        $has_paid = DB::table('spp_transactions')
                            ->where('user_id', $student->user_id)
                            ->where('status', 'approved')
                            ->where('bulan', $currentMonth)  // Fix: Check target month
                            ->where('tahun', $currentYear)   // Fix: Check target year
                            ->exists();
                        
                        if ($has_paid) {
                            $spp_sudah_bayar_count++;
                        } else {
                            $belum_bayar_count++;
                            $list_penunggak[] = [
                                'nama' => $student->nama,
                                'id' => $student->id
                            ];
                        }
                    } else {
                        // Jika Beasiswa, dianggap tidak menunggak
                    }
                }

                // Masukkan ke List Tunggakan Per Cabang (Always include branch if extracted from Cabang Table, even if total 0?)
                // User logic: "monitoring keuangan percabang". If 0 students, just show 0.
                
                $persen = ($total_lulus_cabang > 0) ? ($belum_bayar_count / $total_lulus_cabang) * 100 : 0;

                $spp_tunggakan_per_cabang[] = [
                    'cabang' => $cabang_label,
                    'total_siswa' => $total_lulus_cabang,
                    'sudah_bayar' => $spp_sudah_bayar_count,
                    'belum_bayar' => $belum_bayar_count,
                    'persen_tunggakan' => $persen,
                    'list_siswa' => $list_penunggak
                ];

                // Simplify Chart: Just Total Siswa vs SPP vs Uang Masuk
                $chart_data[] = [
                    'cabang' => $cabang_label,
                    'total_siswa' => $total_lulus_cabang, 
                    'uang_masuk_lunas' => $um_cabang,
                    'spp_count' => $spp_sudah_bayar_count 
                ];
            }

        } catch (\Exception $e) {
            Log::error("Dashboard Finance Error: " . $e->getMessage());
        }

        // =================================================================
        // 3. LOGIKA WALI SANTRI (Filter Kehadiran Bulan Ini)
        // =================================================================
        $waliData = [];
        if ($user->role === 'wali_santri') {
            try {
                $baseUrl = config('services.santri_api.base_url');
                $apiKey  = config('services.santri_api.api_key');

                // WARNING: using withoutVerifying() to bypass SSL Hostname Mismatch on monitorrtq.my.id
                $response = Http::withoutVerifying()->withHeaders(['X-API-KEY' => $apiKey])->get($baseUrl);
                if ($response->successful()) {
                    $allSantri = $response->json();
                    $santri = collect($allSantri)->first(function ($s) use ($user) {
                        return strtolower($s['nama_santri']) === strtolower($user->name);
                    });

                    if ($santri) {
                        $id = $santri['id'];
                        $resHafalan = Http::withoutVerifying()->withHeaders(['X-API-KEY' => $apiKey])->get("{$baseUrl}/{$id}/hafalan");
                        $resAbsensi = Http::withoutVerifying()->withHeaders(['X-API-KEY' => $apiKey])->get("{$baseUrl}/{$id}/kehadiran");
                        
                        $hafalanData = $resHafalan->json() ?? [];
                        $absensiData = $resAbsensi->json() ?? [];

                        // Filter Absensi Bulan Ini Saja
                        $absensiBulanIni = collect($absensiData)->filter(function($item) {
                            if (!isset($item['tanggal'])) return false;
                            $date = Carbon::parse($item['tanggal']);
                            return $date->isCurrentMonth() && $date->isCurrentYear();
                        });

                        $waliData = [
                            'santri' => $santri,
                            'attendanceStats' => [
                                'Hadir' => $absensiBulanIni->where('status_kehadiran', 'Hadir')->count(),
                                'Sakit' => $absensiBulanIni->where('status_kehadiran', 'Sakit')->count(),
                                'Izin'  => $absensiBulanIni->where('status_kehadiran', 'Izin')->count(),
                                'Alpha' => $absensiBulanIni->where('status_kehadiran', 'Alpha')->count(),
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
        // --- FINANCE: DATA 3 STATUS (BULAN INI) ---
        
        // 1. SPP Bulan Ini
        $spp_month_count = 0;
        $spp_month_total = 0;
        if (Schema::hasTable('spp_transactions')) {
            $spp_month_count = DB::table('spp_transactions')
                ->where('status', 'approved')
                ->whereMonth('created_at', $currentMonth)
                ->whereYear('created_at', $currentYear)
                ->count();
            
            $spp_month_total = DB::table('spp_transactions')
                ->where('status', 'approved')
                ->whereMonth('created_at', $currentMonth)
                ->whereYear('created_at', $currentYear)
                ->sum('jumlah_bayar');
        }

        // 2. Uang Masuk Bulan Ini (Dari Riwayat Pembayaran)
        $um_month_count = 0;
        $um_month_total = 0;
        if (Schema::hasTable('riwayat_uang_masuks')) {
            $um_month_count = DB::table('riwayat_uang_masuks')
                ->whereIn('status', ['approved', 'Diterima'])
                ->whereMonth('tanggal_bayar', $currentMonth)
                ->whereYear('tanggal_bayar', $currentYear)
                ->count(); // Count transaksinya

            $um_month_total = DB::table('riwayat_uang_masuks')
                ->whereIn('status', ['approved', 'Diterima'])
                ->whereMonth('tanggal_bayar', $currentMonth)
                ->whereYear('tanggal_bayar', $currentYear)
                ->sum('jumlah_bayar');
        }

        // 3. Uang Pendaftaran (Formulir) Bulan Ini
        // Asumsi: dibayar saat mendaftar (Created At)
        $formulir_month_count = DB::table('pendaftar')
            ->whereIn('status_pembayaran', ['Lunas', 'settlement'])
            ->whereMonth('created_at', $currentMonth)
            ->whereYear('created_at', $currentYear)
            ->count();
        
        $formulir_month_total = DB::table('pendaftar')
            ->whereIn('status_pembayaran', ['Lunas', 'settlement'])
            ->whereMonth('created_at', $currentMonth)
            ->whereYear('created_at', $currentYear)
            ->sum('nominal_pembayaran'); // Pastikan kolom ini ada (dari FormulirController logic)

        $stats = [
            'total_pendaftar' => $total_siswa_curr, 
            'total_lulus' => $total_lulus,          
            'hari_ini' => DB::table('pendaftar')->whereDate('created_at', now())->count(),
            'pendapatan_bulan_ini' => $pendapatan_bulan_ini, 
            'pendapatan_tahun_ini' => $pendapatan_tahun_ini,
            'formulir' => [
                'sudah' => $formulir_lunas, 
                'belum' => $total_siswa_curr - $formulir_lunas 
            ],
            'uang_masuk' => [
                'sudah' => $um_lunas, 
                'belum' => $total_lulus - $um_lunas 
            ],
            'spp_transaksi' => $spp_transaksi,
            // NEW: 3 STATUS DATA
            'finance_monthly' => [
                'spp' => ['count' => $spp_month_count, 'total' => $spp_month_total],
                'uang_masuk' => ['count' => $um_month_count, 'total' => $um_month_total],
                'formulir' => ['count' => $formulir_month_count, 'total' => $formulir_month_total],
            ]
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
            $terbaru = DB::table('pendaftar')
                ->whereYear('created_at', $currentYear) // Filter Tahun Ini untuk Latest Data
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get();
        }

        return Inertia::render('Dashboard', array_merge([
            'stats' => $stats,
            'gender' => $gender,
            'per_cabang' => $per_cabang,
            'per_program' => $per_program,
            'per_status' => $per_status,
            'terbaru' => $terbaru,
            'chart_data' => $chart_data,
            'monthly_chart_data' => $monthly_chart_data, // NEW
            'per_beasiswa' => $per_beasiswa, // NEW
            'spp_tunggakan_per_cabang' => $spp_tunggakan_per_cabang, // Data Baru
            'role' => $user->role
        ], $waliData));
    }
}