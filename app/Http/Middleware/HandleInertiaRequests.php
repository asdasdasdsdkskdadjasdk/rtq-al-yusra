<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Setting;
use App\Models\UangMasuk;
use App\Models\SppTransaction;
use Carbon\Carbon;
use Tighten\Ziggy\Ziggy;
// --- TAMBAHAN IMPORT PENTING ---
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use App\Models\DaftarUlang;

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

        // =================================================================
        // 1. LOGIKA WALI SANTRI (Cek Lunas Uang Masuk & Tunggakan SPP & Daftar Ulang)
        // =================================================================
        $isUangMasukLunas = false;
        $totalTunggakanSpp = 0;
        $belumLunasDaftarUlang = false; // Flag Daftar Ulang

        if ($user && $user->role === 'wali_santri') {
            // A. Cek Uang Masuk
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

            // B. Cek SPP (Jika bukan beasiswa & Santri Aktif)
            if (!$user->isBeasiswa()) {
                $pendaftar = $user->pendaftar()->with('program')->latest()->first();
                
                // PENTING: Hanya hitung tunggakan jika status Lulus / Sudah Daftar Ulang
                $isActive = $pendaftar && in_array($pendaftar->status, ['Lulus', 'Sudah Daftar Ulang']);

                if ($isActive) {
                    // Tentukan Tanggal Mulai
                    if ($pendaftar->tanggal_mulai_spp) {
                        $start = Carbon::parse($pendaftar->tanggal_mulai_spp)->startOfMonth();
                    } else {
                        $tahunDaftar = $pendaftar->created_at->year;
                        // Default Start: Bulan Juli (7) sesuai ajaran baru, bukan September (9)
                        $start = Carbon::create($tahunDaftar, 7, 1)->startOfMonth();
                    }
                    $end = Carbon::now()->startOfMonth();

                    // Hitung Tunggakan
                    while ($start->lte($end)) {
                        $sudahBayar = SppTransaction::where('user_id', $user->id)
                            ->where('bulan', $start->month)
                            ->where('tahun', $start->year)
                            ->whereIn('status', ['approved', 'pending'])
                            ->exists();

                        if (!$sudahBayar) {
                            $totalTunggakanSpp++;
                        }
                        $start->addMonth();
                    }
                }
            }

            // C. Cek Daftar Ulang (Tahunan)
            // Cek apakah ada tagihan tahun ini DAN status != lunas
            $currentYear = Carbon::now()->year;
            if (Schema::hasTable('daftar_ulangs')) {
                $tagihanDU = DB::table('daftar_ulangs')
                    ->where('user_id', $user->id)
                    ->where('tahun', $currentYear)
                    ->first();
                
                if ($tagihanDU && $tagihanDU->status !== 'lunas') {
                    $belumLunasDaftarUlang = true;
                }
            }
        }

        // =================================================================
        // 2. LOGIKA NOTIFIKASI (ADMIN & WALI) - BAGIAN INI YANG HILANG
        // =================================================================
        $notifications = [];
        $unreadCount = 0;

        if ($user) {
            
            // --- A. ROLE PSB: Hibrida (Counter Dinamis + Notif DB) ---
            // Gunakan strtolower untuk antisipasi 'PSB' vs 'psb'
            if (strtolower($user->role) === 'psb') {
                // 1. Ambil Notif DB (Misal: Daftar Ulang)
                $dbNotifications = $user->unreadNotifications;
                $unreadCount += $dbNotifications->count();
                
                foreach ($dbNotifications as $notif) {
                    $notifications[] = [
                        'id' => $notif->id,
                        'data' => $notif->data,
                        'created_at' => $notif->created_at,
                        'read_at' => null 
                    ];
                }

                // 2. Tambah Counter Dinamis (Pendaftar Baru)
                // Cek status yg mengandung 'Menunggu Verifikasi'
                $pendingPendaftar = DB::table('pendaftar')
                    ->where('status', 'LIKE', '%Menunggu Verifikasi%') 
                    ->count();

                if ($pendingPendaftar > 0) {
                    $unreadCount += $pendingPendaftar;
                    // Unshift agar selalu di paling atas
                    array_unshift($notifications, [
                        'id' => 'psb-pending-counter', 
                        'data' => [
                            'message' => "Ada {$pendingPendaftar} Pendaftar Baru Menunggu Verifikasi.",
                            'url' => route('psb.pendaftaran.index', ['status' => 'Menunggu Verifikasi']), 
                            'type' => 'info'
                        ],
                        'created_at' => now(),
                        'read_at' => null
                    ]);
                }
            }

            // --- B. ROLE KEUANGAN: Hibrida (Counter Pending + Notif DB) ---
            elseif (strtolower($user->role) === 'keuangan') {
                // 1. Ambil Notif DB
                $dbNotifications = $user->unreadNotifications;
                $unreadCount += $dbNotifications->count();
                foreach ($dbNotifications as $notif) {
                    $notifications[] = [
                        'id' => $notif->id,
                        'data' => $notif->data,
                        'created_at' => $notif->created_at,
                        'read_at' => null 
                    ];
                }

                // 2. Hitung Counter "Menunggu Verifikasi"
                // a. SPP Pending
                $pendingSpp = 0;
                if (Schema::hasTable('spp_transactions')) {
                    $pendingSpp = DB::table('spp_transactions')->where('status', 'pending')->count();
                }

                // b. Uang Masuk Pending
                $pendingUm = 0;
                if (Schema::hasTable('riwayat_uang_masuks')) {
                    $pendingUm = DB::table('riwayat_uang_masuks')->where('status', 'pending')->count();
                }

                // c. Daftar Ulang Pending (NEW)
                $pendingDU = 0;
                if (Schema::hasTable('daftar_ulangs')) {
                    $pendingDU = DB::table('daftar_ulangs')->where('status', 'pending')->whereNotNull('bukti_bayar')->count();
                }

                // 3. Tambahkan Counter ke List Notifikasi
                if ($pendingDU > 0) {
                     $unreadCount += $pendingDU;
                     array_unshift($notifications, [
                        'id' => 'keuangan-pending-du',
                        'data' => [
                            'message' => "Ada {$pendingDU} Pembayaran Daftar Ulang Menunggu Verifikasi.",
                            'url' => '/admin/daftar-ulang',
                            'type' => 'warning'
                        ],
                        'created_at' => now(),
                        'read_at' => null
                    ]);
                }

                if ($pendingUm > 0) {
                     $unreadCount += $pendingUm;
                     array_unshift($notifications, [
                        'id' => 'keuangan-pending-um',
                        'data' => [
                            'message' => "Ada {$pendingUm} Pembayaran Uang Masuk Menunggu Verifikasi.",
                            'url' => route('admin.uang_masuk.index'),
                            'type' => 'warning'
                        ],
                        'created_at' => now(),
                        'read_at' => null
                    ]);
                }

                if ($pendingSpp > 0) {
                     $unreadCount += $pendingSpp;
                     array_unshift($notifications, [
                        'id' => 'keuangan-pending-spp',
                        'data' => [
                            'message' => "Ada {$pendingSpp} Pembayaran SPP Menunggu Verifikasi.",
                            'url' => route('admin.spp.index'),
                            'type' => 'warning'
                        ],
                        'created_at' => now(),
                        'read_at' => null
                    ]);
                }
            }

            // --- C. WALI SANTRI (Default) ---
            else {
                // Jangan overwrite $notifications, tapi merge!
                $userNotifs = $user->notifications()->latest()->take(5)->get();
                foreach ($userNotifs as $n) {
                    $notifications[] = $n;
                }
                $unreadCount = $user->unreadNotifications->count();
            }
        }

        // =================================================================
        // 3. RETURN DATA
        // =================================================================
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
                'spp_tunggakan' => $totalTunggakanSpp,
                'belum_lunas_daftar_ulang' => $belumLunasDaftarUlang, // NEW PROP
                
                // --- DATA NOTIFIKASI DIKIRIM KE SINI ---
                'notifications' => $notifications,
                'unreadCount' => $unreadCount,
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

    // Helper function
    private function makeNotif($msg, $url, $type) {
        return [
            'id' => 'sys-' . rand(1000,9999),
            'data' => [
                'message' => $msg,
                'url' => $url,
                'type' => $type
            ],
            'read_at' => null, 
            'created_at' => now(),
        ];
    }
}