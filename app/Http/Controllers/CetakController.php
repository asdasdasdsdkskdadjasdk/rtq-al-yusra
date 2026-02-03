<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pendaftar;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;

class CetakController extends Controller
{
    /**
     * Cetak Kartu Ujian (PDF)
     */
    public function kartuUjian(Request $request)
    {
        $user = Auth::user();

        // Ambil data pendaftar terbaru milik user
        // Bisa ditambahkan logika jika user ingin mencetak pendaftar tertentu berdasarkan ID di query param
        $pendaftarId = $request->query('id');

        if ($pendaftarId) {
            $pendaftar = $user->pendaftar()->where('id', $pendaftarId)->firstOrFail();
        } else {
            $pendaftar = $user->pendaftar()->latest()->firstOrFail();
        }

        // Pastikan status pembayaran lunas (optional, tergantung requirement, tapi biasanya kartu ujian hanya untuk yang lunas)
        // Jika requirement membolehkan cetak meski belum lunas, baris ini bisa di-skip. 
        // Namun di frontend tombol cetak hanya muncul jika "Lunas" atau "Siap Ujian".
        if ($pendaftar->status_pembayaran !== 'Lunas') {
             return redirect()->back()->with('error', 'Mohon selesaikan pembayaran terlebih dahulu.');
        }

        // Load View PDF
        $pdf = Pdf::loadView('pdf.kartu_ujian', [
            'pendaftar' => $pendaftar
        ]);

        // Set paper size A4
        $pdf->setPaper('a4', 'portrait');

        // Stream (tampil di browser) atau Download
        return $pdf->stream('Kartu-Ujian-' . $pendaftar->no_pendaftaran . '.pdf');
    }
}
