<?php

namespace App\Http\Controllers;

use App\Models\Pendaftar;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KelulusanController extends Controller
{
    /**
     * Menampilkan halaman Cek Kelulusan dan hasil pencarian.
     */
    public function index(Request $request)
    {
        $pendaftar = null;
        $message = null;

        // Cek apakah ada input 'no_pendaftaran' di URL (Query String)
        if ($request->filled('no_pendaftaran')) {
            // Cari data pendaftar berdasarkan nomor pendaftaran
            $pendaftar = Pendaftar::where('no_pendaftaran', $request->no_pendaftaran)
                ->select(
                    'no_pendaftaran', 
                    'nama', 
                    'program_nama', 
                    'status', 
                    'program_jenis', 
                    'tanggal_ujian'
                )
                ->first();

            // Jika data tidak ditemukan, siapkan pesan error
            if (!$pendaftar) {
                $message = 'Nomor pendaftaran tidak ditemukan. Mohon periksa kembali.';
            }
        }

        // PENTING: Render harus sesuai nama file React Anda ('CekKelulusan.jsx')
        // Jangan gunakan 'Kelulusan/Index' jika file Anda bernama 'CekKelulusan.jsx'
        return Inertia::render('CekKelulusan', [
            'pendaftar' => $pendaftar,
            'filters' => $request->only('no_pendaftaran'),
            'message' => $message,
        ]);
    }
}