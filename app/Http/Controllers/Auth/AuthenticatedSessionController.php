<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
// Kita tidak lagi butuh RouteServiceProvider di sini
// use App\Providers\RouteServiceProvider; 
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Menampilkan halaman login.
     */
    public function create(): Response
    {
        // Simpan URL sebelumnya ke session 'url.intended' jika belum ada
        // Ini berguna jika user klik tombol "Login" manual, bukan redirection middleware
        if (!session()->has('url.intended')) {
            $prev = url()->previous();
            if ($prev !== route('login') && $prev !== url()->current()) {
                session(['url.intended' => $prev]);
            }
        }

        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Menangani permintaan otentikasi yang masuk.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = $request->user();

        // --- LOGIKA REDIRECT FINAL ---
        
        // Daftar peran yang harus diarahkan ke Beranda
        $guestRoles = ['calon_santri'];

        if (in_array($user->role, $guestRoles)) {
            // Jika peran pengguna ada di dalam daftar $guestRoles, arahkan ke Beranda (intended dulu)
            return redirect()->intended(route('home'));
        }

        // Untuk semua peran lainnya (psb, keuangan, admin, dll.),
        // Langsung arahkan ke Dashboard (abaikan halaman sebelumnya/intended)
        return redirect()->route('dashboard');
    }

    /**
     * Menghancurkan sesi otentikasi (logout).
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}