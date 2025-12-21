<?php

namespace App\Http\Controllers;

use App\Models\Pendaftar;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use App\Models\Cabang; // <--- Import Model Cabang
class PsbController extends Controller
{
    public function index(Request $request)
    {
        // 1. Query Dasar
        $query = Pendaftar::query();

        // 2. Filter Berdasarkan Cabang (Jika ada di request)
        if ($request->has('cabang') && $request->cabang != '') {
            $query->where('cabang', $request->cabang);
        }

        // 3. Ambil data dengan Pagination & Pertahankan Query String (untuk page 2, dst)
        $pendaftar = $query->latest()
                           ->paginate(10)
                           ->withQueryString();

        // 4. Ambil semua data cabang untuk opsi dropdown
        $cabangs = Cabang::all();

        return Inertia::render('Admin/PSB/Index', [
            'pendaftar' => $pendaftar,
            'cabangs' => $cabangs, // <--- Kirim data cabang
            'filters' => $request->only(['cabang']), // <--- Kirim status filter saat ini
        ]);
    }

    public function show($id)
    {
        $pendaftar = Pendaftar::findOrFail($id);
        return Inertia::render('Admin/PSB/Detail', ['pendaftar' => $pendaftar]);
    }

    public function edit($id)
    {
        $pendaftar = Pendaftar::findOrFail($id);
        
        // 2. Ambil Data Master untuk Dropdown
        $cabangs = Cabang::all();
        $programs = Program::all();

        return Inertia::render('Admin/PSB/Edit', [
            'pendaftar' => $pendaftar,
            'cabangs' => $cabangs,   // <--- Kirim ke Frontend
            'programs' => $programs, // <--- Kirim ke Frontend
        ]);
    }

    // --- LOGIKA UPDATE UTAMA ---
    // --- LOGIKA UPDATE UTAMA (DIPERBAIKI) ---
    public function update(Request $request, $id)
    {
        $pendaftar = Pendaftar::findOrFail($id);

        // 1. Validasi
        // PENTING: Semua field yang hendak diupdate MESTI ada di sini.
        // Jika tidak ada dalam array ini, Laravel akan membuangnya dari $validatedData.
        $rules = [
            'status' => 'required|string',
            
            // Data Diri
            'nama' => 'sometimes|required|string|max:255',
            'nik' => 'nullable|string|max:20', // Ubah max jika perlu
            'no_hp' => 'sometimes|required|string',
            'email' => 'sometimes|required|email',
            'tempat_lahir' => 'nullable|string',
            'tanggal_lahir' => 'nullable|date',
            'jenis_kelamin' => 'nullable|string',
            'alamat' => 'nullable|string',

            // Data Orang Tua & Program
            'nama_orang_tua' => 'nullable|string',
            'cabang' => 'nullable|string',
            'program_nama' => 'nullable|string',
            'program_jenis' => 'nullable|string',

            // File validasi (nullable kerana user mungkin tidak ganti file)
            'ijazah_terakhir' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
            'kartu_keluarga' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
            'pas_foto' => 'nullable|file|mimes:jpg,jpeg,png|max:2048',
            'skbb' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
            'sks' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ];

        $validatedData = $request->validate($rules);

        // 2. Handle File Upload (Hanya jika ada file baru)
        $fileFields = ['ijazah_terakhir', 'kartu_keluarga', 'pas_foto', 'skbb', 'sks'];
        
        foreach ($fileFields as $field) {
            if ($request->hasFile($field)) {
                // Hapus file lama jika ada
                if ($pendaftar->$field) {
                    Storage::disk('public')->delete($pendaftar->$field);
                }
                // Simpan file baru
                $validatedData[$field] = $request->file($field)->store('berkas_pendaftaran', 'public');
            }
        }

        // 3. Update Database
        $pendaftar->update($validatedData);

        return redirect()->back()->with('success', 'Data pendaftaran berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $pendaftar = Pendaftar::findOrFail($id);
        
        // Hapus semua file terkait
        $files = ['ijazah_terakhir', 'kartu_keluarga', 'pas_foto', 'skbb', 'sks'];
        foreach ($files as $file) {
            if ($pendaftar->$file) {
                Storage::disk('public')->delete($pendaftar->$file);
            }
        }

        $pendaftar->delete();

        return redirect()->route('psb.pendaftaran.index')->with('success', 'Data berhasil dihapus.');
    }
}