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
        // 1. Mulai Query
        $query = Pendaftar::with(['user', 'program'])->latest();

        // 2. Logika Filter Status
        if ($request->has('status') && $request->status !== 'Semua') {
            $query->where('status', $request->status);
        }

        // 3. Logika Filter Cabang (TAMBAHAN PENTING)
        // Kita cek jika ada request 'cabang' dan tidak kosong
        if ($request->filled('cabang')) {
            $query->where('cabang', $request->cabang);
        }

        // 4. Logika SEARCH NAMA (BARU)
        if ($request->filled('search')) {
            $query->where('nama', 'like', '%' . $request->search . '%');
        }
        
        // 4. Eksekusi Pagination
        $pendaftar = $query->paginate(10)->appends($request->query());

        // 5. Ambil Data Cabang untuk Dropdown Filter
        $cabangs = Cabang::all(); 

        return Inertia::render('Admin/PSB/Index', [
            'pendaftar' => $pendaftar,
            'currentStatus' => $request->status ?? 'Semua',
            
            // --- KIRIM DATA INI AGAR TIDAK ERROR ---
            'cabangs' => $cabangs, 
            'filters' => $request->only(['status', 'cabang']), // Kirim filter yang sedang aktif
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