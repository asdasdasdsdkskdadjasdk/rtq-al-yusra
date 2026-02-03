<?php

namespace App\Http\Controllers;

use App\Models\Berita;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str; // <-- Tambahkan ini untuk memotong teks (excerpt)

class BeritaController extends Controller
{
    public function index()
    {
        // Ambil semua berita terbaru
        // Kita gunakan map() untuk mengubah format data agar sesuai dengan BeritaCard.jsx
        $berita = Berita::latest()
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'title' => $item->judul, // Ubah 'judul' jadi 'title'
                    // Buat kutipan pendek dari konten
                    'excerpt' => Str::limit(strip_tags($item->konten), 100), 
                    // Cek apakah ada gambar
                    // FIX: Jika gambar diawali 'images/', berarti itu asset public, jangan tambah storage.
                    'image' => ($item->gambar && str_starts_with($item->gambar, 'images/')) 
                        ? '/' . $item->gambar 
                        : ($item->gambar ? '/storage/' . $item->gambar : '/images/rtq.jpg'), 
                    'author' => $item->penulis, // Ubah 'penulis' jadi 'author' jika perlu
                    'date' => $item->created_at->translatedFormat('d F Y'), // Format tanggal cantik
                    'link' => route('berita.show', $item->id), // Link ke detail
                    'featured' => false, // Default false
                ];
            });

        return Inertia::render('Berita', [
            'berita' => $berita
        ]);
    }

    public function show($id)
    {
        $berita = Berita::findOrFail($id);

        // Kita format juga data untuk halaman detail
        $post = [
            'id' => $berita->id,
            'title' => $berita->judul,
            'content' => $berita->konten,
            // FIX: Sama seperti index, cek prefix images/
            'image' => ($berita->gambar && str_starts_with($berita->gambar, 'images/')) 
                        ? '/' . $berita->gambar 
                        : ($berita->gambar ? '/storage/' . $berita->gambar : '/images/rtq.jpg'),
            'author' => $berita->penulis,
            'date' => $berita->created_at->translatedFormat('d F Y, H:i'),
        ];

        return Inertia::render('DetailBerita', [
            'post' => $post
        ]);
    }
}