<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Biaya; // Import Model Biaya
use App\Models\Jadwal; // <-- Jangan lupa import ini


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
    
}