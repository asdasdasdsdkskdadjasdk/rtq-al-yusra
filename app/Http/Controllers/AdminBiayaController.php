<?php

namespace App\Http\Controllers;

use App\Models\Biaya;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminBiayaController extends Controller
{
    /**
     * Menampilkan daftar biaya
     */
    public function index()
    {
        return Inertia::render('Admin/Biaya/Index', [
            'biayaList' => Biaya::all()
        ]);
    }

    /**
     * Menampilkan form tambah
     */
    public function create()
    {
        return Inertia::render('Admin/Biaya/Form');
    }

    /**
     * Menyimpan data baru
     */
    public function store(Request $request)
    {
        // Validasi input
        $validated = $request->validate([
            'jenis' => 'required|string|max:255',
            'nama' => 'required|string|max:255',
            'color' => 'required|string|max:7', // Format Hex code (e.g. #FFFFFF)
            'featured' => 'boolean',
            'items' => 'required|array',       // Array item biaya
            'items.*.label' => 'required|string',
            'items.*.value' => 'required|string',
            'items.*.note' => 'nullable|string',
        ]);

        Biaya::create($validated);

        return redirect()->route('admin.biaya.index')->with('success', 'Data biaya berhasil ditambahkan.');
    }

    /**
     * Menampilkan form edit
     */
    public function edit(Biaya $biaya)
    {
        return Inertia::render('Admin/Biaya/Form', [
            'biaya' => $biaya // Kirim data yang mau diedit
        ]);
    }

    /**
     * Update data
     */
    public function update(Request $request, Biaya $biaya)
    {
        $validated = $request->validate([
            'jenis' => 'required|string|max:255',
            'nama' => 'required|string|max:255',
            'color' => 'required|string|max:7',
            'featured' => 'boolean',
            'items' => 'required|array',
            'items.*.label' => 'required|string',
            'items.*.value' => 'required|string',
            'items.*.note' => 'nullable|string',
        ]);

        $biaya->update($validated);

        return redirect()->route('admin.biaya.index')->with('success', 'Data biaya berhasil diperbarui.');
    }

    /**
     * Hapus data
     */
    public function destroy(Biaya $biaya)
    {
        $biaya->delete();
        return redirect()->back()->with('success', 'Data biaya berhasil dihapus.');
    }
}