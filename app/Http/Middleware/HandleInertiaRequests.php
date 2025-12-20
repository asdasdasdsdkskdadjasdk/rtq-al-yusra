<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Setting;
use App\Models\UangMasuk;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        // 1. Ambil Pengaturan Sekolah (Global)
        // Menggunakan try-catch agar jika tabel belum ada (saat migrate awal) tidak error
        try {
            $settings = Setting::all()->pluck('value', 'key')->toArray();
        } catch (\Exception $e) {
            $settings = [];
        }

        // 2. Logika Menu Uang Masuk (Wali Santri)
        $showUangMasukMenu = false;
        
        if ($request->user() && $request->user()->role === 'wali_santri') {
            $uangMasuk = UangMasuk::where('user_id', $request->user()->id)->first();
            
            // Tampilkan menu HANYA JIKA data tagihan ada DAN statusnya 'Belum Lunas'
            // Jika sudah 'Lunas' atau data tidak ada, menu akan hilang (false)
            if ($uangMasuk && $uangMasuk->status === 'Belum Lunas') {
                $showUangMasukMenu = true;
            }
        }

        return [
            ...parent::share($request),
            
            // Data Auth User
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'role' => $request->user()->role,
                    // Pastikan relasi 'pendaftar' ada di Model User jika ingin menggunakan ini
                    'pendaftar' => $request->user()->pendaftar, 
                ] : null,
                
                // Variable ini dikirim ke Layout untuk mengatur visibilitas menu
                'showUangMasukMenu' => $showUangMasukMenu,
            ],

            // Data Pengaturan Sekolah (Logo, Nama, dll)
            'sekolah' => $settings,

            // Ziggy (Routing di React)
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],

            // Flash Messages (Untuk Notifikasi Sukses/Gagal dari Controller)
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'message' => fn () => $request->session()->get('message'),
            ],
        ];
    }
}