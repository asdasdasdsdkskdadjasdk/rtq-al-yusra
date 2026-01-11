<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Setting;
use App\Models\UangMasuk;
use App\Models\SppTransaction; // <--- JANGAN LUPA IMPORT
use Carbon\Carbon; // <--- JANGAN LUPA IMPORT
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $settings = [];
        try {
            $settings = Setting::all()->pluck('value', 'key')->toArray();
        } catch (\Exception $e) {}

        $user = $request->user();
        
        if ($user) {
            $user->load('pendaftar');
        }
        // --- 1. LOGIKA CEK LUNAS UANG MASUK (KODE LAMA) ---
        $isUangMasukLunas = false;
        if ($user && $user->role === 'wali_santri') {
            $biayaGlobal = isset($settings['biaya_uang_masuk']) ? (int)$settings['biaya_uang_masuk'] : 5000000;
            $uangMasuk = UangMasuk::where('user_id', $user->id)->first();
            
            if ($uangMasuk) {
                if ($uangMasuk->status === 'Lunas') {
                    $isUangMasukLunas = true;
                } else {
                    $sudahDibayar = (int)$uangMasuk->sudah_dibayar;
                    $tagihanUser = $uangMasuk->total_tagihan > 0 ? $uangMasuk->total_tagihan : $biayaGlobal;
                    if ($sudahDibayar >= $tagihanUser) $isUangMasukLunas = true;
                }
            }
        }

        // --- 2. LOGIKA CEK TUNGGAKAN SPP (BARU) ---
        $totalTunggakanSpp = 0;
        
        // Hanya cek jika Wali Santri & BUKAN Beasiswa
        if ($user && $user->role === 'wali_santri' && !$user->isBeasiswa()) {
            
            // Ambil data pendaftar untuk tahu kapan mulai masuk
            $pendaftar = $user->pendaftar()->with('program')->latest()->first();

            // Tentukan Tanggal Mulai (Sama seperti logic di Controller)
            if ($pendaftar && $pendaftar->tanggal_mulai_spp) {
                $start = Carbon::parse($pendaftar->tanggal_mulai_spp)->startOfMonth();
            } else {
                // Default: 1 September tahun daftar (Fallback)
                $tahunDaftar = $pendaftar ? $pendaftar->created_at->year : Carbon::now()->year;
                $start = Carbon::create($tahunDaftar, 9, 1)->startOfMonth();
            }

            $end = Carbon::now()->startOfMonth(); // Sampai bulan ini

            // Loop dari bulan mulai sampai bulan ini
            while ($start->lte($end)) {
                // Cek apakah bulan ini sudah LUNAS atau SEDANG PROSES (Pending)
                // Kita anggap 'pending' sebagai 'sudah usaha bayar', jadi jangan di-alert merah dulu
                $sudahBayar = SppTransaction::where('user_id', $user->id)
                    ->where('bulan', $start->month)
                    ->where('tahun', $start->year)
                    ->whereIn('status', ['approved', 'pending']) // Pending tidak dihitung tunggakan
                    ->exists();

                if (!$sudahBayar) {
                    $totalTunggakanSpp++;
                }

                $start->addMonth(); // Lanjut ke bulan berikutnya
            }
        }

        return [
            ...parent::share($request),
            
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'is_beasiswa' => $user->isBeasiswa(),
                    'pendaftar' => $user->pendaftar,
                ] : null,
                
                'is_uang_masuk_lunas' => $isUangMasukLunas,
                
                // Kirim variable tunggakan ke Frontend
                'spp_tunggakan' => $totalTunggakanSpp, 
            ],

            'sekolah' => $settings,
            'ziggy' => fn () => [ ...(new Ziggy)->toArray(), 'location' => $request->url() ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'message' => fn () => $request->session()->get('message'),
            ],
        ];
    }
}