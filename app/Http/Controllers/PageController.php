<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route; // <--- INI YANG MENYEBABKAN ERROR ANDA
use Illuminate\Foundation\Application; // <--- TAMBAHKAN INI
use App\Models\Biaya; // Import Model Biaya
use App\Models\Jadwal; // <-- Jangan lupa import ini
use App\Models\Program; // <-- Jangan lupa import Model Program
use App\Models\Testimonial; // <--- Import Model Testimonial

class PageController extends Controller
{
    /**
     * Menampilkan halaman Kontak Kami.
     */
    public function kontak()
    {
        return Inertia::render('KontakKami', [
            'auth' => [
                'user' => Auth::user() ? Auth::user()->only('id', 'name', 'email') : null,
            ],
            // Anda juga bisa menambahkan flash messages jika ada
        ]);
    }
    public function biaya()
    {
        // Ambil semua data biaya dari database
        $biayaData = Biaya::all();

        return Inertia::render('BiayaPendidikan', [
            'biayaList' => $biayaData // Kirim data dengan nama 'biayaList'
        ]);
    }

    // Jangan lupa import: use App\Models\Jadwal;

public function jadwal()
{
    $jadwalList = Jadwal::all();
    return Inertia::render('Jadwal', [
        'jadwalList' => $jadwalList
    ]);
}
    
public function pendaftaran()
    {
        // Ambil data program dari database
        $programs = Program::all();

        return Inertia::render('Pendaftaran', [
            'programs' => $programs // Kirim ke React
        ]);
    }

    public function beranda()
    {
        $testimonials = Testimonial::all();

        return Inertia::render('Beranda', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
            'testimonials' => $testimonials, // <--- Kirim data ke React
        ]);
    }
}