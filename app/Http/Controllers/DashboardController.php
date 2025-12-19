<?php

namespace App\Http\Controllers;

use App\Models\Pendaftar;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. STATISTIK UTAMA (Angka Besar)
        $stats = [
            'total_pendaftar' => Pendaftar::count(),
            'total_lulus' => Pendaftar::where('status', 'Lulus')->orWhere('status', 'Sudah Daftar Ulang')->count(),
            'total_pendapatan' => Pendaftar::where('status_pembayaran', 'Lunas')->sum('nominal_pembayaran'),
            'hari_ini' => Pendaftar::whereDate('created_at', today())->count(),
        ];

        // 2. DISTRIBUSI GENDER (IKHWAN / AKHWAT)
        $gender_stats = Pendaftar::select('jenis_kelamin', DB::raw('count(*) as total'))
            ->groupBy('jenis_kelamin')
            ->get()
            ->mapWithKeys(function ($item) {
                // Mapping agar key-nya mudah dipanggil (ikhwan/akhwat)
                $key = (strtolower($item->jenis_kelamin) == 'laki-laki') ? 'ikhwan' : 'akhwat';
                return [$key => $item->total];
            });

        // Pastikan nilai default 0 jika tidak ada data
        $gender = [
            'ikhwan' => $gender_stats['ikhwan'] ?? 0,
            'akhwat' => $gender_stats['akhwat'] ?? 0,
        ];

        // 3. DISTRIBUSI CABANG
        $per_cabang = Pendaftar::select('cabang', DB::raw('count(*) as total'))
            ->whereNotNull('cabang')
            ->groupBy('cabang')
            ->orderByDesc('total')
            ->get();

        // 4. DISTRIBUSI PROGRAM
        $per_program = Pendaftar::select('program_nama', DB::raw('count(*) as total'))
            ->groupBy('program_nama')
            ->orderByDesc('total')
            ->get();

        // 5. RINCIAN STATUS (Jumlah per status)
        $per_status = Pendaftar::select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->orderByDesc('total')
            ->get();

        // 6. PENDAFTAR TERBARU
        $terbaru = Pendaftar::latest()->take(5)->get();

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'gender' => $gender,
            'per_cabang' => $per_cabang,
            'per_program' => $per_program,
            'per_status' => $per_status,
            'terbaru' => $terbaru,
        ]);
    }
}