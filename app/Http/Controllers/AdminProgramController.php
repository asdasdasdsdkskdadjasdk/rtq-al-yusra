<?php

namespace App\Http\Controllers;

use App\Models\Program;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class AdminProgramController extends Controller
{
    public function index()
    {
        $programs = Program::latest()->get();
        return Inertia::render('Admin/Program/Index', [
            'programs' => $programs
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Program/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'jenis' => 'required|string|max:255',
            'nama' => 'required|string|max:255',
            'batas_pendaftaran' => 'required|string|max:255',
            'tes' => 'required|string|max:255',
            'biaya' => 'required|string|max:255', // Ini Text (Display)
            
            // --- INPUT BARU (NUMERIC) ---
            'nominal_uang_masuk' => 'required|numeric|min:0',
            'nominal_spp' => 'required|numeric|min:0',
            // ----------------------------

            'color' => 'required|string|max:50',
            'featured' => 'boolean',
            'details' => 'required|array|min:1',
            'details.*' => 'required|string',
        ]);

        $validated['slug'] = Str::slug($validated['nama']);

        Program::create($validated);

        return redirect()->route('admin.program.index')->with('success', 'Program berhasil ditambahkan');
    }

    public function edit(Program $program)
    {
        return Inertia::render('Admin/Program/Edit', [
            'program' => $program
        ]);
    }

    public function update(Request $request, Program $program)
    {
        $validated = $request->validate([
            'jenis' => 'required|string|max:255',
            'nama' => 'required|string|max:255',
            'batas_pendaftaran' => 'required|string|max:255',
            'tes' => 'required|string|max:255',
            'biaya' => 'required|string|max:255',
            
            // --- INPUT BARU (NUMERIC) ---
            'nominal_uang_masuk' => 'required|numeric|min:0',
            'nominal_spp' => 'required|numeric|min:0',
            // ----------------------------

            'color' => 'required|string|max:50',
            'featured' => 'boolean',
            'details' => 'required|array|min:1',
            'details.*' => 'required|string',
        ]);

        $validated['slug'] = Str::slug($validated['nama']);

        $program->update($validated);

        return redirect()->route('admin.program.index')->with('success', 'Program berhasil diperbarui');
    }

    public function destroy(Program $program)
    {
        $program->delete();
        return redirect()->back()->with('success', 'Program berhasil dihapus');
    }
}