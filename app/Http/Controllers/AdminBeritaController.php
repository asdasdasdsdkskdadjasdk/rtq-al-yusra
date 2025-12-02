<?php

namespace App\Http\Controllers;

use App\Models\Berita;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class AdminBeritaController extends Controller
{
    /**
     * Menampilkan daftar berita.
     */
    public function index()
    {
        $berita = Berita::latest()->paginate(10);
        return Inertia::render('Admin/Berita/Index', [
            'berita' => $berita
        ]);
    }

    /**
     * Menampilkan form tambah berita.
     */
    public function create()
    {
        return Inertia::render('Admin/Berita/Create');
    }

    /**
     * Menyimpan berita baru.
     */
    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'konten' => 'required',
            'gambar' => 'nullable|image|max:2048', // Maks 2MB
        ]);

        $path = null;
        if ($request->hasFile('gambar')) {
            $path = $request->file('gambar')->store('berita_images', 'public');
        }

        Berita::create([
            'judul' => $request->judul,
            'slug' => Str::slug($request->judul) . '-' . Str::random(4),
            'konten' => $request->konten,
            'gambar' => $path,
            'penulis' => Auth::user()->name,
            'is_published' => true,
        ]);

        return redirect()->route('admin.berita.index')->with('success', 'Berita berhasil ditambahkan!');
    }
    
    /**
     * Menghapus berita.
     */
    public function destroy(Berita $berita)
    {
        if ($berita->gambar) {
            Storage::disk('public')->delete($berita->gambar);
        }
        $berita->delete();
        
        return redirect()->back()->with('success', 'Berita berhasil dihapus.');
    }
}