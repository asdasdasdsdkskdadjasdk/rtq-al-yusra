<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use App\Models\Cabang;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminSettingController extends Controller
{
    public function index()
    {
        // Ambil semua setting dan ubah jadi format Key-Value
        // Contoh: ['nama_sekolah' => 'RTQ...', 'no_hp' => '...']
        $settings = Setting::all()->pluck('value', 'key');
        
        // Ambil data cabang
        $cabangs = Cabang::all();

        return Inertia::render('Admin/Setting/Index', [
            'settings' => $settings,
            'cabangs' => $cabangs
        ]);
    }

    // Update Data Sekolah & Sosmed
    public function update(Request $request)
    {
        $data = $request->except(['cabang_baru']); // Jangan simpan input cabang disini

        foreach ($data as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        return redirect()->back()->with('success', 'Pengaturan berhasil disimpan.');
    }

    // Tambah Cabang Baru
    public function storeCabang(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'alamat' => 'nullable|string'
        ]);

        Cabang::create([
            'nama' => $request->nama,
            'alamat' => $request->alamat
        ]);

        return redirect()->back()->with('success', 'Cabang baru berhasil ditambahkan.');
    }

    // Hapus Cabang
    public function destroyCabang($id)
    {
        $cabang = Cabang::findOrFail($id);
        $cabang->delete();

        return redirect()->back()->with('success', 'Data cabang dihapus.');
    }
}