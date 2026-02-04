<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class WaliMuridController extends Controller
{
    // --- KONFIGURASI API (Refactored to Config) ---
    private $baseUrl;
    private $apiKey;

    public function __construct()
    {
        $this->baseUrl = config('services.santri_api.base_url');
        $this->apiKey  = config('services.santri_api.api_key');
    }

    // Helper untuk ambil data mentah dari API
    private function fetchData() {
        $user = Auth::user();
        $namaDicari = $user->name;

        // 1. Ambil List Santri
        // WARNING: using withoutVerifying() to bypass SSL Hostname Mismatch on monitorrtq.my.id
        $response = Http::withoutVerifying()->withHeaders(['X-API-KEY' => $this->apiKey])->get($this->baseUrl);
        
        if ($response->failed()) return ['error' => 'Gagal koneksi ke server API (Port 8080).'];

        $allSantri = $response->json();
        $santri = collect($allSantri)->first(function ($s) use ($namaDicari) {
            return strtolower($s['nama_santri']) === strtolower($namaDicari);
        });

        if (!$santri) return ['error' => "Data santri '{$namaDicari}' tidak ditemukan."];

        // 2. Ambil Detail
        $id = $santri['id'];
        $resHafalan = Http::withoutVerifying()->withHeaders(['X-API-KEY' => $this->apiKey])->get("{$this->baseUrl}/{$id}/hafalan");
        $resAbsensi = Http::withoutVerifying()->withHeaders(['X-API-KEY' => $this->apiKey])->get("{$this->baseUrl}/{$id}/kehadiran");

        return [
            'santri' => $santri,
            'hafalan' => $resHafalan->json() ?? [],
            'kehadiran' => $resAbsensi->json() ?? []
        ];
    }

    /**
     * HALAMAN 1: DASHBOARD (Ringkasan Widget)
     */
    public function dashboard()
    {
        $data = $this->fetchData();
        if (isset($data['error'])) return Inertia::render('Wali/Dashboard', ['error' => $data['error']]);

        $hafalanData = $data['hafalan'];
        $absensiData = $data['kehadiran'];

        // Logic Statistik Kehadiran (Total Sejak Awal)
        // Perhatikan penggunaan kolom 'status_kehadiran'
        $stats = [
            'Hadir' => collect($absensiData)->where('status_kehadiran', 'Hadir')->count(),
            'Sakit' => collect($absensiData)->where('status_kehadiran', 'Sakit')->count(),
            'Izin'  => collect($absensiData)->where('status_kehadiran', 'Izin')->count(),
            'Alpha' => collect($absensiData)->filter(function($i) { return in_array($i['status_kehadiran'], ['Alpha', 'Alfa']); })->count(),
        ];

        // Logic Progress Hafalan
        $juzSelesai = collect($hafalanData)->pluck('juz')->unique()->count();
        $juzTerakhir = collect($hafalanData)->sortByDesc('tanggal')->first(); // Ambil inputan terakhir berdasarkan tanggal

        return Inertia::render('Wali/Dashboard', [
            'santri' => $data['santri'],
            'stats'  => $stats,
            'setoranTerakhir' => $juzTerakhir, // Kirim object setoran terakhir
            'progressHafalan' => [
                'selesai' => $juzSelesai,
                'persen'  => ($juzSelesai / 30) * 100,
                'sedang_hafal' => $juzTerakhir['juz'] ?? '-' 
            ]
        ]);
    }

    /**
     * HALAMAN 2: STATUS ANAK (Detail History & Filter)
     */
    public function statusAnak(Request $request)
    {
        $data = $this->fetchData();
        if (isset($data['error'])) return Inertia::render('Wali/StatusAnak', ['error' => $data['error']]);

        // Filter Bulan & Tahun (Default: Bulan Sekarang)
        $bulanFilter = $request->input('bulan', date('m'));
        $tahunFilter = $request->input('tahun', date('Y'));

        // 1. Filter Kehadiran
        $kehadiranFiltered = collect($data['kehadiran'])->filter(function ($item) use ($bulanFilter, $tahunFilter) {
            $tgl = Carbon::parse($item['created_at']);
            return $tgl->month == $bulanFilter && $tgl->year == $tahunFilter;
        })->values();

        // Hitung Statistik KHUSUS Bulan Terpilih
        $statsBulanIni = [
            'Hadir' => $kehadiranFiltered->where('status_kehadiran', 'Hadir')->count(),
            'Sakit' => $kehadiranFiltered->where('status_kehadiran', 'Sakit')->count(),
            'Izin'  => $kehadiranFiltered->where('status_kehadiran', 'Izin')->count(),
            'Alpha' => $kehadiranFiltered->filter(function($i) { return in_array($i['status_kehadiran'], ['Alpha', 'Alfa']); })->count(),
        ];

        // 2. Filter Hafalan
        $hafalanFiltered = collect($data['hafalan'])->filter(function ($item) use ($bulanFilter, $tahunFilter) {
            $tgl = Carbon::parse($item['tanggal']); // Asumsi kolom di API 'tanggal'
            return $tgl->month == $bulanFilter && $tgl->year == $tahunFilter;
        })->values();

        // Info "Sedang Menghafal Juz Apa" (Ambil data paling baru secara global, bukan filter)
        $lastHafalanGlobal = collect($data['hafalan'])->sortByDesc('tanggal')->first();

        return Inertia::render('Wali/StatusAnak', [
            'santri' => $data['santri'],
            'kehadiran' => $kehadiranFiltered, // Data list tabel
            'hafalan' => $hafalanFiltered,     // Data list tabel
            'statsBulanIni' => $statsBulanIni, // Kotak angka di tab kehadiran
            'currentJuz' => $lastHafalanGlobal['juz'] ?? '-',
            'filters' => [
                'bulan' => $bulanFilter,
                'tahun' => $tahunFilter
            ]
        ]);
    }
}