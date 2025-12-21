<?php

namespace App\Http\Controllers;

use App\Models\Pendaftar;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema; // Untuk keamanan cek tabel
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // =================================================================
        // 1. DATA DASHBOARD ADMIN PSB (Agar Tampilan PSB Tidak Rusak)
        // =================================================================
        
        // A. Demografi Gender
        $gender = [
            'ikhwan' => Pendaftar::where('jenis_kelamin', 'Laki-laki')->count(),
            'akhwat' => Pendaftar::where('jenis_kelamin', 'Perempuan')->count(),
        ];

        // B. Distribusi Program (Pakai Try-Catch biar aman)
        try {
            $per_program = DB::table('pendaftars')
                ->join('programs', 'pendaftars.program_id', '=', 'programs.id')
                ->select('programs.nama as program_nama', DB::raw('count(*) as total'))
                ->groupBy('programs.nama')
                ->orderByDesc('total')
                ->get();
        } catch (\Exception $e) {
            $per_program = [];
        }

        // C. Distribusi Status
        $per_status = Pendaftar::select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->orderByDesc('total')
            ->get();
        
        // D. Data Cabang (Basic untuk PSB)
        $per_cabang = Pendaftar::select('cabang', DB::raw('count(*) as total'))
            ->whereNotNull('cabang')
            ->groupBy('cabang')
            ->orderByDesc('total')
            ->get();


        // =================================================================
        // 2. DATA DASHBOARD KEUANGAN (LOGIKA BARU - VISUALISASI)
        // =================================================================
        
        // Inisialisasi variabel agar tidak error jika tabel belum ada
        $total_siswa = Pendaftar::count();
        $formulir_lunas = 0;
        $um_lunas = 0;
        $spp_transaksi = 0;
        $total_pendapatan = 0;
        $chart_data = [];

        try {
            // A. Hitung Ringkasan Global
            // 1. Formulir (Asumsi kolom 'status_pembayaran' ada di pendaftar)
            $formulir_lunas = Pendaftar::where('status_pembayaran', 'Lunas')->count();
            
            // 2. Uang Masuk (Join Tabel Pembayaran)
            if (Schema::hasTable('pembayarans')) {
                $um_lunas = DB::table('pendaftars')
                    ->join('pembayarans', 'pendaftars.user_id', '=', 'pembayarans.user_id')
                    ->whereIn('pembayarans.status', ['Lunas', 'LUNAS', 'settlement'])
                    ->distinct('pendaftars.id')
                    ->count('pendaftars.id');
                
                $total_pendapatan += DB::table('pembayarans')
                    ->whereIn('status', ['Lunas', 'LUNAS', 'settlement'])
                    ->sum('nominal');
            }

            // 3. SPP (Tabel Pembayaran SPP)
            if (Schema::hasTable('pembayaran_spps')) {
                $spp_transaksi = DB::table('pembayaran_spps')
                    ->whereIn('status_pembayaran', ['Lunas', 'LUNAS', 'settlement'])
                    ->count();
                
                $total_pendapatan += DB::table('pembayaran_spps')
                    ->whereIn('status_pembayaran', ['Lunas', 'LUNAS', 'settlement'])
                    ->sum('jumlah_bayar');
            }

            // B. Hitung Data Per Cabang (Untuk Diagram/Boxplot)
            // Ambil list cabang unik
            $list_cabang = Pendaftar::select('cabang')
                ->whereNotNull('cabang')
                ->distinct()
                ->pluck('cabang');

            foreach ($list_cabang as $cabang_nama) {
                // 1. Total Siswa di Cabang Ini
                $total_di_cabang = Pendaftar::where('cabang', $cabang_nama)->count();

                // 2. Uang Masuk Lunas di Cabang Ini
                $um_cabang = 0;
                if (Schema::hasTable('pembayarans')) {
                    $um_cabang = DB::table('pendaftars')
                        ->join('pembayarans', 'pendaftars.user_id', '=', 'pembayarans.user_id')
                        ->where('pendaftars.cabang', $cabang_nama)
                        ->whereIn('pembayarans.status', ['Lunas', 'LUNAS', 'settlement'])
                        ->count();
                }

                // 3. Transaksi SPP di Cabang Ini
                $spp_cabang = 0;
                if (Schema::hasTable('pembayaran_spps')) {
                    $spp_cabang = DB::table('pembayaran_spps')
                        ->join('pendaftars', 'pembayaran_spps.pendaftar_id', '=', 'pendaftars.id')
                        ->where('pendaftars.cabang', $cabang_nama)
                        ->whereIn('pembayaran_spps.status_pembayaran', ['Lunas', 'LUNAS', 'settlement'])
                        ->count();
                }

                $chart_data[] = [
                    'cabang' => $cabang_nama,
                    'total_siswa' => $total_di_cabang,
                    'uang_masuk_lunas' => $um_cabang,
                    'uang_masuk_belum' => ($total_di_cabang - $um_cabang) < 0 ? 0 : ($total_di_cabang - $um_cabang),
                    'spp_count' => $spp_cabang
                ];
            }

        } catch (\Exception $e) {
            Log::error("Dashboard Finance Error: " . $e->getMessage());
        }

        // =================================================================
        // 3. MENYATUKAN VARIABEL STATS (GABUNGAN PSB & KEUANGAN)
        // =================================================================
        $stats = [
            // Data untuk Admin PSB
            'total_pendaftar' => $total_siswa,
            'total_lulus' => Pendaftar::whereIn('status', ['Lulus', 'Sudah Daftar Ulang', 'LULUS'])->count(),
            'hari_ini' => Pendaftar::whereDate('created_at', now())->count(),
            'total_pendapatan' => $total_pendapatan,
            
            // Data untuk Admin Keuangan (Format Baru)
            'formulir' => [
                'sudah' => $formulir_lunas,
                'belum' => $total_siswa - $formulir_lunas
            ],
            'uang_masuk' => [
                'sudah' => $um_lunas,
                'belum' => $total_siswa - $um_lunas
            ],
            'spp_transaksi' => $spp_transaksi
        ];


        // =================================================================
        // 4. DATA TERBARU (DYNAMIC BERDASARKAN ROLE)
        // =================================================================
        $terbaru = [];

        // Jika Role Keuangan -> Tampilkan Transaksi Terakhir
        if ($user->role === 'keuangan') {
            try {
                $q_spp = DB::table('pembayaran_spps')
                    ->join('users', 'pembayaran_spps.user_id', '=', 'users.id')
                    ->select('pembayaran_spps.created_at', 'users.name as nama', DB::raw("'SPP' as jenis"), 'pembayaran_spps.jumlah_bayar as nominal', 'pembayaran_spps.status_pembayaran as status');
                
                $q_um = DB::table('pembayarans')
                    ->join('users', 'pembayarans.user_id', '=', 'users.id')
                    ->select('pembayarans.created_at', 'users.name as nama', DB::raw("'Uang Masuk' as jenis"), 'pembayarans.nominal as nominal', 'pembayarans.status as status');

                if (Schema::hasTable('pembayaran_spps') && Schema::hasTable('pembayarans')) {
                    $terbaru = $q_spp->union($q_um)->orderBy('created_at', 'desc')->limit(5)->get();
                }
            } catch (\Exception $e) {}
        } 
        
        // Jika Data Keuangan Kosong atau Bukan Orang Keuangan -> Tampilkan Pendaftar Terbaru
        if (empty($terbaru)) {
            $terbaru = Pendaftar::latest()->limit(5)->get();
        }

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'gender' => $gender,
            'per_cabang' => $per_cabang,   // Untuk Admin PSB
            'per_program' => $per_program, // Untuk Admin PSB
            'per_status' => $per_status,   // Untuk Admin PSB
            'terbaru' => $terbaru,         // Dinamis (Transaksi/Pendaftar)
            'chart_data' => $chart_data,   // KHUSUS KEUANGAN (Diagram)
            'role' => $user->role
        ]);
    }
}