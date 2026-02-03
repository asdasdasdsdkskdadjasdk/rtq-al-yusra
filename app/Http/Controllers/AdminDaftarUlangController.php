<?php

namespace App\Http\Controllers;

use App\Models\DaftarUlang;
use App\Models\Pendaftar;
use App\Models\Cabang;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminDaftarUlangController extends Controller
{
    public function index(Request $request)
    {
        $tahun = $request->input('tahun', Carbon::now()->year);
        $cabang = $request->input('cabang');
        $status = $request->input('status'); // Sudah Ditagih, Belum Ditagih, Lunas, Pending
        $search = $request->input('search');

        // Logic: Ambil semua siswa aktif('Lulus')
        // Gunakan status aktif yang konsisten dengan Dashboard
        $statusAktif = ['Lulus', 'Sudah Daftar Ulang', 'LULUS', 'lulus', 'Aktif', 'aktif'];
        
        $query = Pendaftar::query()
            ->select(
                'pendaftar.id as pendaftar_id',
                'pendaftar.user_id',
                'pendaftar.nama',
                'pendaftar.cabang',
                'pendaftar.no_hp',
                'daftar_ulangs.id as tagihan_id',
                'daftar_ulangs.nominal_tagihan',
                'daftar_ulangs.status as status_bayar',
                'daftar_ulangs.bukti_bayar'
            )
            ->leftJoin('daftar_ulangs', function($join) use ($tahun) {
                $join->on('pendaftar.user_id', '=', 'daftar_ulangs.user_id')
                     ->where('daftar_ulangs.tahun', '=', $tahun);
            })
            ->whereIn('pendaftar.status', $statusAktif);

        // Filter Cabang
        if ($cabang) {
            $query->where('pendaftar.cabang', $cabang);
        }

        // Filter Search
        if ($search) {
            $query->where('pendaftar.nama', 'like', "%{$search}%");
        }

        // Filter Status Tagihan
        if ($status) {
            if ($status === 'Belum Ditagih') {
                $query->whereNull('daftar_ulangs.id');
            } elseif ($status === 'Sudah Ditagih') {
                $query->whereNotNull('daftar_ulangs.id');
            } else {
                $query->where('daftar_ulangs.status', $status);
            }
        }

        $students = $query->orderBy('pendaftar.user_id', 'desc')->paginate(20)->appends($request->all());
        $cabangs = Cabang::all();

        return Inertia::render('Admin/DaftarUlang/Index', [
            'students' => $students,
            'cabangs' => $cabangs,
            'filters' => [
                'tahun' => $tahun,
                'cabang' => $cabang,
                'status' => $status,
                'search' => $search
            ],
            'tahunList' => range(2024, Carbon::now()->addYear()->year)
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'tahun' => 'required|integer',
            'nominal_tagihan' => 'required|numeric|min:0'
        ]);

        DaftarUlang::updateOrCreate(
            ['user_id' => $request->user_id, 'tahun' => $request->tahun],
            [
                'nominal_tagihan' => $request->nominal_tagihan,
                // Jangan reset status jika sudah ada, kecuali user minta reset (nanti refinement)
            ]
        );

        return back()->with('success', 'Tagihan Daftar Ulang berhasil disimpan.');
    }

    public function verify(Request $request, $id)
    {
        $tagihan = DaftarUlang::findOrFail($id);
        
        $request->validate([
            'status' => 'required|in:lunas,rejected'
        ]);

        $tagihan->update([
            'status' => $request->status == 'lunas' ? 'lunas' : 'rejected',
            'verified_by' => auth()->id()
        ]);
        
        return back()->with('success', 'Status pembayaran berhasil diperbarui.');
    }

    // --- FITUR BARU: GENERATE MASSAL ---
    public function storeBulk(Request $request)
    {
        $request->validate([
            'tahun' => 'required|integer',
            'nominal_tagihan' => 'required|numeric|min:0'
        ]);

        $tahun = $request->tahun;
        $nominal = $request->nominal_tagihan;

        // Ambil semua siswa aktif
        $statusAktif = ['Lulus', 'Sudah Daftar Ulang', 'LULUS', 'lulus', 'Aktif', 'aktif'];
        $activeStudents = Pendaftar::whereIn('status', $statusAktif)->get();
        $count = 0;

        DB::beginTransaction();
        try {
            foreach ($activeStudents as $student) {
                // Cek apakah sudah ada tagihan
                $exists = DaftarUlang::where('user_id', $student->user_id)
                    ->where('tahun', $tahun)
                    ->exists();
                
                if (!$exists) {
                    DaftarUlang::create([
                        'user_id' => $student->user_id,
                        'tahun' => $tahun,
                        'nominal_tagihan' => $nominal,
                        'status' => 'pending'
                    ]);
                    $count++;
                }
            }
            DB::commit();
            return back()->with('success', "Berhasil membuat tagihan untuk {$count} santri aktif.");

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal generate tagihan: ' . $e->getMessage());
        }
    }

    // --- FITUR BARU: UPDATE STATUS NON-AKTIF (MANTAN SANTRI) ---
    public function updateStatusNonAktif(Request $request)
    {
        $request->validate([
            'tahun' => 'required|integer'
        ]);
        
        $tahun = $request->tahun;

        // Cari siswa yang status Lulus TAPI (Tidak punya tagihan ATAU Tagihan belum lunas) di tahun ini
        $statusAktif = ['Lulus', 'Sudah Daftar Ulang', 'LULUS', 'lulus', 'Aktif', 'aktif'];
        
        $count = 0;
        
        $students = Pendaftar::whereIn('status', $statusAktif)->get();

        DB::beginTransaction();
        try {
            foreach ($students as $student) {
                $tagihan = DaftarUlang::where('user_id', $student->user_id)
                    ->where('tahun', $tahun)
                    ->first();
                
                // Kriteria Non-Aktif: Tagihan Tidak Ada ATAU Status != lunas
                if (!$tagihan || $tagihan->status !== 'lunas') {
                    $student->update(['status' => 'Mantan Santri']);
                    $count++;
                }
            }
            DB::commit();
            return back()->with('success', "Berhasil mengubah status {$count} santri menjadi Mantan Santri.");
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal update status: ' . $e->getMessage());
        }
    }
}
