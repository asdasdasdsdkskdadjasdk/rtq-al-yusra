<?php

namespace App\Http\Controllers;

use App\Models\Program;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class AdminProgramController extends Controller
{
    /**
     * Menampilkan daftar program.
     */
    public function index()
    {
        $programs = Program::latest()->get();
        return Inertia::render('Admin/Program/Index', [
            'programs' => $programs
        ]);
    }

    /**
     * Menampilkan form tambah program.
     */
    public function create()
    {
        return Inertia::render('Admin/Program/Create');
    }

    /**
     * Menyimpan program baru.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'jenis' => 'required|string|max:255',
            'nama' => 'required|string|max:255',
            // slug kita generate otomatis jika kosong
            'batas_pendaftaran' => 'required|string|max:255',
            'tes' => 'required|string|max:255',
            'biaya' => 'required|string|max:255',
            'color' => 'required|string|max:50', // Hex color
            'featured' => 'boolean',
            'details' => 'required|array|min:1', // Harus array
            'details.*' => 'required|string', // Isi array harus text
        ]);

        // Buat slug otomatis dari nama
        $validated['slug'] = Str::slug($validated['nama']);

        Program::create($validated);

        return redirect()->route('admin.program.index')->with('success', 'Program berhasil ditambahkan');
    }

    /**
     * Menampilkan form edit program.
     */
    public function edit(Program $program)
    {
        return Inertia::render('Admin/Program/Edit', [
            'program' => $program
        ]);
    }

    /**
     * Memperbarui data program.
     */
    public function update(Request $request, Program $program)
    {
        $validated = $request->validate([
            'jenis' => 'required|string|max:255',
            'nama' => 'required|string|max:255',
            'batas_pendaftaran' => 'required|string|max:255',
            'tes' => 'required|string|max:255',
            'biaya' => 'required|string|max:255',
            'color' => 'required|string|max:50',
            'featured' => 'boolean',
            'details' => 'required|array|min:1',
            'details.*' => 'required|string',
        ]);

        // Update slug jika nama berubah (opsional, tapi disarankan)
        $validated['slug'] = Str::slug($validated['nama']);

        $program->update($validated);

        return redirect()->route('admin.program.index')->with('success', 'Program berhasil diperbarui');
    }

    /**
     * Menghapus program.
     */
    public function destroy(Program $program)
    {
        $program->delete();
        return redirect()->back()->with('success', 'Program berhasil dihapus');
    }
}