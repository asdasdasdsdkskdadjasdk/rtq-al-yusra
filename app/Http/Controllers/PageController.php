<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

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
    
}