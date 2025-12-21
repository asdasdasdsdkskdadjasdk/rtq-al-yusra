<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Pendaftar;
use App\Models\SppTransaction;
use App\Exports\LaporanExport; // <--- Import Class Export Tadi
use Maatwebsite\Excel\Facades\Excel; // <--- Import Facade Excel
use App\Models\RiwayatUangMasuk;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Carbon\Carbon;

class LaporanController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Laporan/Index');
    }

    public function export(Request $request)
    {
        $request->validate([
            'kategori' => 'required|in:spp,uang_masuk,formulir',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $kategori = $request->kategori;
        // Gunakan startOfDay dan endOfDay agar data hari terakhir terbawa
        $start = Carbon::parse($request->start_date)->startOfDay(); 
        $end = Carbon::parse($request->end_date)->endOfDay();

        $fileName = 'Laporan_' . strtoupper($kategori) . '_' . date('d-m-Y') . '.xlsx'; // Ekstensi .xlsx

        // Download Excel
        return Excel::download(new LaporanExport($kategori, $start, $end), $fileName);
    }
    private function getBulanNama($angka)
    {
        $bulan = [
            1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
            5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
            9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember'
        ];
        return $bulan[$angka] ?? '-';
    }
}