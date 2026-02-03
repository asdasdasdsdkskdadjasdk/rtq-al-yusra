<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;
use App\Models\Pendaftar;

Route::get('/debug-api-sync', function () {
    // 1. Cek User & Pendaftar
    $user = Auth::user();
    if (!$user) return "Login dulu sebagai Wali Santri (Kevin).";

    $pendaftar = Pendaftar::where('user_id', $user->id)->latest()->first();
    if (!$pendaftar) return "Data pendaftar tidak ditemukan untuk user ini.";

    // 2. Siapkan Config
    $apiKey  = config('services.santri_api.api_key');
    $baseUrl = config('services.santri_api.base_url');
    
    // 3. Siapkan Payload (Sama persis dengan FormulirController)
    $jkMap = ($pendaftar->jenis_kelamin === 'Laki-laki') ? 'L' : 'P';
    $payload = [
        'nama_santri'   => $pendaftar->nama,
        'tempat_lahir'  => $pendaftar->tempat_lahir ?? '-',
        'tanggal_lahir' => $pendaftar->tanggal_lahir, 
        'jenis_kelamin' => $jkMap,
        'email'         => $pendaftar->email ?? '-',
        'NoHP_ortu'     => $pendaftar->no_hp ?? '-',
        'nama_ortu'     => $pendaftar->nama_orang_tua ?? '-',
        'cabang'        => $pendaftar->cabang ?? '-',
        'jenis_kelas'   => $pendaftar->program_jenis ?? 'Reguler',
        'kat_masuk'     => 'Baru',
        'alamat'        => $pendaftar->alamat ?? '-',
        'nis'            => date('Y') . sprintf('%04d', $pendaftar->id),
        'GolDar'         => $pendaftar->gol_darah ?? '-',
        'MK'             => $pendaftar->anak_ke ?? '1',
        'asal_sekolah'   => $pendaftar->asal_sekolah ?? '-',
        'pekerjaan_ortu' => $pendaftar->pekerjaan_orang_tua ?? 'Lainnya',
        'asal'           => $pendaftar->kabupaten ?? 'Pusat',
        'kelas'          => '1',
        'periode_id'     => 1, 
    ];

    // 4. Eksekusi Request (Tanpa Verify SSL)
    try {
        $response = Http::withoutVerifying()->withHeaders(['X-API-KEY' => $apiKey])->post($baseUrl, $payload);
    } catch (\Exception $e) {
        return "EXCEPTION: " . $e->getMessage();
    }

    // 5. Tampilkan Hasil
    echo "<h1>Debug API Sync</h1>";
    echo "<b>Target URL:</b> " . $baseUrl . "<br>";
    echo "<b>API Key:</b> " . $apiKey . "<br>";
    echo "<b>Status Code:</b> " . $response->status() . "<br>";
    echo "<hr>";
    echo "<h3>Response Body:</h3>";
    dump($response->json() ?? $response->body());
    echo "<hr>";
    echo "<h3>Payload yang dikirim:</h3>";
    dump($payload);
});
