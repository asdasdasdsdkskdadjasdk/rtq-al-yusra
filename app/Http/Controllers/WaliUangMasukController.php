<?php

namespace App\Http\Controllers;

use App\Models\UangMasuk;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class WaliUangMasukController extends Controller
{
    public function index()
    {
        $data = UangMasuk::with('riwayat')
            ->where('user_id', Auth::id())
            ->first();

        // Jika sudah lunas, redirect ke dashboard (sesuai request menu hilang)
        if (!$data || $data->status === 'Lunas') {
            return redirect()->route('dashboard')->with('message', 'Tidak ada tagihan uang masuk.');
        }

        return Inertia::render('Wali/UangMasuk/Index', ['tagihan' => $data]);
    }
}