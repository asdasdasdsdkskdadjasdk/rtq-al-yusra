<?php

namespace App\Http\Controllers;

use App\Models\Jadwal;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminJadwalController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Jadwal/Index', [
            'jadwalList' => Jadwal::all()
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Jadwal/Form');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'gelombang' => 'required|string|max:255',
            'tahapan' => 'required|array',
            'tahapan.*.title' => 'required|string',
            'tahapan.*.date' => 'required|string',
            'tahapan.*.color' => 'required|in:white,orange', // Validasi warna
        ]);

        Jadwal::create($validated);

        return redirect()->route('admin.jadwal.index')->with('success', 'Jadwal berhasil ditambahkan.');
    }

    public function edit(Jadwal $jadwal)
    {
        return Inertia::render('Admin/Jadwal/Form', [
            'jadwal' => $jadwal
        ]);
    }

    public function update(Request $request, Jadwal $jadwal)
    {
        $validated = $request->validate([
            'gelombang' => 'required|string|max:255',
            'tahapan' => 'required|array',
            'tahapan.*.title' => 'required|string',
            'tahapan.*.date' => 'required|string',
            'tahapan.*.color' => 'required|in:white,orange',
        ]);

        $jadwal->update($validated);

        return redirect()->route('admin.jadwal.index')->with('success', 'Jadwal berhasil diperbarui.');
    }

    public function destroy(Jadwal $jadwal)
    {
        $jadwal->delete();
        return redirect()->back()->with('success', 'Jadwal berhasil dihapus.');
    }
}