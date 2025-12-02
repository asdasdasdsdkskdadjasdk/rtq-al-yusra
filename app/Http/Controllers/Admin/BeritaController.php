<?php

namespace App\Http\Controllers\Admin;

use App\Models\Berita; // <-- Pastikan Model di-import
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class BeritaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
{
    // Ambil berita yang statusnya published, urutkan terbaru
    $berita = Berita::where('is_published', true)->latest()->get();

    return Inertia::render('Berita', [
        'berita' => $berita // Kirim data ke React
    ]);
}

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    $request->validate([
        'judul' => 'required|string|max:255',
        'konten' => 'required',
        'gambar' => 'nullable|image|max:2048',
    ]);

    $path = null;
    if ($request->hasFile('gambar')) {
        $path = $request->file('gambar')->store('berita_images', 'public');
    }

    Berita::create([
        'judul' => $request->judul,
        'slug' => Str::slug($request->judul),
        'konten' => $request->konten,
        'gambar' => $path,
        'penulis' => Auth::user()->name,
    ]);

    return redirect()->route('admin.berita.index')->with('success', 'Berita berhasil dibuat!');
}

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
