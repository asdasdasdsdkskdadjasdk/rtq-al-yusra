<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User; // <-- Pastikan ini ada
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules; // <-- Pastikan ini ada

class RegisteredUserController extends Controller
{
    /**
     * Menampilkan halaman registrasi.
     */
    public function create()
    {
        return inertia('Auth/Register');
    }

    /**
     * Menangani permintaan registrasi yang masuk.
     */
    public function store(Request $request): RedirectResponse
    {
        // Logika validasi dan pembuatan user ada di sini
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            // 'password' => Hash::make($request->password),
            'password' => $request->password, // <-- Kirim password mentah, biarkan Model yang meng-hash
            'role' => 'calon_santri',
        ]);

        event(new Registered($user));

        Auth::login($user);

        // Redirect setelah registrasi
        if ($user->role === 'calon_santri' || $user->role === 'wali_santri') {
            return redirect(route('home'));
        }

        return redirect(RouteServiceProvider::HOME);
    }
}