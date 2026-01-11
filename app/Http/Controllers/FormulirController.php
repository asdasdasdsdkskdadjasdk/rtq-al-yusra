<?php

namespace App\Http\Controllers;

use App\Models\Pendaftar;
use App\Models\Program;
use App\Models\Jadwal;
use App\Models\Cabang; 
use App\Models\UangMasuk;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Midtrans\Config;
use Midtrans\Snap;
use Barryvdh\DomPDF\Facade\Pdf; 

class FormulirController extends Controller
{
    // --- HELPER METHODS ---

    private function cekPendaftaranAktif($userId)
    {
        return Pendaftar::where('user_id', $userId)
            ->where(function ($query) {
                $query->where('status_pembayaran', 'Belum Bayar')
                      ->orWhere(function ($q) {
                          $q->where('status_pembayaran', 'Lunas')
                            ->where('status', '!=', 'Tidak Lulus'); 
                      });
            })
            ->first();
    }

    private function convertTanggalIndo($stringDate)
    {
        $bulanIndo = [
            'Januari' => '01', 'Februari' => '02', 'Maret' => '03', 'April' => '04',
            'Mei' => '05', 'Juni' => '06', 'Juli' => '07', 'Agustus' => '08',
            'September' => '09', 'Oktober' => '10', 'November' => '11', 'Desember' => '12'
        ];

        $cleanString = preg_replace('/[^a-zA-Z0-9\s]/', '', $stringDate); 
        $parts = explode(' ', trim($cleanString)); 

        if (count($parts) >= 3) {
            $tahun = array_pop($parts);
            $bulanNama = array_pop($parts);
            $tanggal = array_pop($parts);
            
            $bulan = isset($bulanIndo[$bulanNama]) ? $bulanIndo[$bulanNama] : '01';
            $tgl = str_pad($tanggal, 2, '0', STR_PAD_LEFT);

            return "$tahun-$bulan-$tgl";
        }
        return null;
    }

    // --- MAIN METHODS ---

    public function create($program_slug)
    {
        $pendaftaranAktif = $this->cekPendaftaranAktif(Auth::id());

        if ($pendaftaranAktif) {
            if ($pendaftaranAktif->status === 'Lulus') {
                return redirect()->route('status.cek');
            }
            return redirect()->route('status.cek')
                ->with('error', 'Formulir Anda sedang berjalan. Harap selesaikan proses pendaftaran sebelumnya.');
        }

        $program = Program::where('slug', $program_slug)->first();
        if (!$program) abort(404);

        $cabangs = Cabang::all(); // Ambil Data Cabang

        return Inertia::render('Formulir', [
            'program' => $program,
            'cabangs' => $cabangs
        ]);
    }

    public function store(Request $request)
    {
        // 1. Validasi Input
        $validatedData = $request->validate([
            'nik' => 'required|string|max:16', 
            'nama' => 'required|string|max:255',
            'no_hp' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'tempat_lahir' => 'required|string|max:255',
            'tanggal_lahir' => 'required|date',
            'umur' => 'required|integer|min:0',
            'jenis_kelamin' => 'required|string',
            'alamat' => 'required|string',
            'cabang' => 'required|string|max:255',
            'nama_orang_tua' => 'required|string|max:255',
            
            // Program (Penting)
            'program_nama' => 'required|string',
            'program_jenis' => 'required|string',
            // Kita terima ID Program juga (hidden input atau dicari manual)
            'program_id' => 'nullable|exists:programs,id', 

            'ijazah_terakhir' => 'nullable|file|mimes:pdf,jpg,png,jpeg|max:2048',
            'kartu_keluarga' => 'nullable|file|mimes:pdf,jpg,png,jpeg|max:2048',
            'pas_foto' => 'nullable|file|mimes:jpg,png,jpeg|max:2048',
            'skbb' => 'nullable|file|mimes:pdf,jpg,png,jpeg|max:2048',
            'sks' => 'nullable|file|mimes:pdf,jpg,png,jpeg|max:2048',
        ]);

        // 2. Cek Pendaftaran Aktif
        $existingPendaftar = $this->cekPendaftaranAktif(Auth::id());

        if ($existingPendaftar && $existingPendaftar->status === 'Lulus') {
            return redirect()->route('status.cek');
        }

        if ($existingPendaftar && $existingPendaftar->nik !== $request->nik) {
             return redirect()->route('status.cek')->with('error', 'Anda masih memiliki pendaftaran aktif dengan NIK lain.');
        }

        if (!$existingPendaftar) {
            $nikExists = Pendaftar::where('nik', $request->nik)
                ->where('status', '!=', 'Tidak Lulus')
                ->where('user_id', '!=', Auth::id())
                ->exists();
            if ($nikExists) {
                return redirect()->back()->withErrors(['nik' => 'NIK ini sudah terdaftar aktif.']);
            }
        }

        $dataToSave = $validatedData;

        // 3. [PENTING] Set Program ID (Jika belum ada di request)
        if (empty($dataToSave['program_id'])) {
            $program = Program::where('nama', $request->program_nama)->first();
            if ($program) {
                $dataToSave['program_id'] = $program->id;
            }
        } else {
            $program = Program::find($dataToSave['program_id']);
        }

        // 4. Handle File Upload
        $filesToUpload = ['ijazah_terakhir', 'kartu_keluarga', 'pas_foto', 'skbb', 'sks'];
        foreach ($filesToUpload as $file) {
            if ($request->hasFile($file)) {
                $dataToSave[$file] = $request->file($file)->store('berkas_pendaftaran', 'public');
            } else {
                if ($existingPendaftar && $existingPendaftar->$file) {
                    $dataToSave[$file] = $existingPendaftar->$file;
                } else {
                    $dataToSave[$file] = null;
                }
            }
        }
        
        // 5. Hitung Biaya Pendaftaran
        // Ambil dari kolom 'biaya' di tabel programs (biasanya format text: "Rp 300.000")
        // Kita bersihkan jadi angka murni
        $biayaString = $program ? $program->biaya : '300000'; 
        $biayaClean = preg_replace('/[^0-9]/', '', $biayaString);
        $nominal = (int) $biayaClean;
        
        $dataToSave['nominal_pembayaran'] = $nominal;

        // 6. Logika Gratis / Berbayar
        if ($nominal <= 0) {
            $dataToSave['status_pembayaran'] = 'Lunas';
        } else {
            if (!$existingPendaftar) {
                $dataToSave['status_pembayaran'] = 'Belum Bayar';
            }
        }

        // 7. Simpan Database
        if ($existingPendaftar) {
            $existingPendaftar->update($dataToSave);
            $pendaftar = $existingPendaftar;
        } else {
            $dataToSave['no_pendaftaran'] = 'RTQ-' . now()->format('Ymd') . '-' . strtoupper(substr(uniqid(), -4));
            $dataToSave['user_id'] = Auth::id(); 
            $dataToSave['status'] = 'Menunggu Verifikasi'; 
            $pendaftar = Pendaftar::create($dataToSave);
        }

        // 8. Midtrans (Jika Berbayar)
        if ($nominal > 0) {
            Config::$serverKey = config('midtrans.server_key');
            Config::$isProduction = config('midtrans.is_production');
            Config::$isSanitized = config('midtrans.is_sanitized');
            Config::$is3ds = config('midtrans.is_3ds');

            if (empty($pendaftar->snap_token)) {
                 $params = [
                    'transaction_details' => [
                        'order_id' => $pendaftar->no_pendaftaran . '-' . time(), 
                        'gross_amount' => (int) $pendaftar->nominal_pembayaran,
                    ],
                    'customer_details' => [
                        'first_name' => $pendaftar->nama,
                        'email' => $pendaftar->email,
                        'phone' => $pendaftar->no_hp,
                    ],
                ];
                try {
                    $snapToken = Snap::getSnapToken($params);
                    $pendaftar->update(['snap_token' => $snapToken]);
                } catch (\Exception $e) {
                    Log::error('Midtrans Error: ' . $e->getMessage());
                }
            }
            return redirect()->route('pembayaran.show', ['id' => $pendaftar->id]);
        } 
        
        // 9. Jika Gratis -> Selesai
        else {
            return redirect()->route('status.cek')->with('success', 'Pendaftaran berhasil dikirim (Gratis).');
        }
    }
    
    // --- STATUS CHECK ---
    public function checkStatus()
    {
        $user = auth()->user();
        $pendaftarList = Pendaftar::where('user_id', $user->id)->get();

        if ($pendaftarList->isEmpty()) {
            return redirect()->route('formulir.index')->with('error', 'Anda belum mendaftar.');
        }

        $semuaJadwal = Jadwal::all();

        // Logika Auto Schedule (Jadwal Ujian)
        foreach ($pendaftarList as $pendaftar) {
            if ($pendaftar->status_pembayaran == 'Lunas') {
                $updates = [];
                if (empty($pendaftar->tanggal_ujian)) {
                    $tanggalDipilih = null;
                    foreach ($semuaJadwal as $jadwal) {
                        $tahapan = is_string($jadwal->tahapan) ? json_decode($jadwal->tahapan, true) : $jadwal->tahapan;
                        $batasPendaftaran = null;
                        $tglTesMasuk = null;

                        if (is_array($tahapan)) {
                            foreach ($tahapan as $item) {
                                if (isset($item['title'])) {
                                    if (stripos($item['title'], 'Pendaftaran') !== false) {
                                        $batasPendaftaran = $this->convertTanggalIndo($item['date']);
                                    }
                                    if (stripos($item['title'], 'Tes Masuk') !== false) {
                                        $tglTesMasuk = $this->convertTanggalIndo($item['date']);
                                    }
                                }
                            }
                        }
                        if ($batasPendaftaran && $tglTesMasuk && now()->toDateString() <= $batasPendaftaran) {
                            $tanggalDipilih = $tglTesMasuk;
                            break; 
                        }
                    }
                    $updates['tanggal_ujian'] = $tanggalDipilih ?: now()->addDays(3)->toDateString();
                    $updates['waktu_ujian'] = '08:00'; 
                    $updates['lokasi_ujian'] = 'Gedung Utama RTQ Al-Yusra';
                }
                if (!empty($updates)) {
                    Pendaftar::where('id', $pendaftar->id)->update($updates);
                }
            }
        }

        $pendaftarListFresh = Pendaftar::where('user_id', $user->id)
                                         ->orderBy('created_at', 'desc')
                                         ->get();

        foreach ($pendaftarListFresh as $pendaftar) {
            $programData = Program::where('nama', $pendaftar->program_nama)->first();
            $pendaftar->materi_ujian_program = $programData ? $programData->materi_ujian : null;

            // Cari Jadwal Pengumuman
            $tanggalPengumumanFound = null;
            if ($pendaftar->tanggal_ujian) {
                foreach ($semuaJadwal as $jadwal) {
                    $tahapan = is_string($jadwal->tahapan) ? json_decode($jadwal->tahapan, true) : $jadwal->tahapan;
                    $tglTesDiJadwal = null;
                    $tglPengumumanDiJadwal = null;

                    if (is_array($tahapan)) {
                        foreach ($tahapan as $item) {
                            if (isset($item['title'])) {
                                if (stripos($item['title'], 'Tes Masuk') !== false) {
                                    $tglTesDiJadwal = $this->convertTanggalIndo($item['date']);
                                }
                                if (stripos($item['title'], 'Pengumuman') !== false) {
                                    $tglPengumumanDiJadwal = $item['date'];
                                }
                            }
                        }
                    }
                    if ($tglTesDiJadwal && $tglTesDiJadwal == $pendaftar->tanggal_ujian) {
                        $tanggalPengumumanFound = $tglPengumumanDiJadwal;
                        break; 
                    }
                }
            }
            $pendaftar->tanggal_pengumuman_display = $tanggalPengumumanFound ?: 'Jadwal Menyusul';
        }

        return Inertia::render('StatusPendaftaran', [
            'pendaftarList' => $pendaftarListFresh,
        ]);
    }

    // --- DAFTAR ULANG ---

    public function daftarUlangShow()
    {
        $user = Auth::user();
        $pendaftar = Pendaftar::where('user_id', $user->id)->latest()->first();

        if (!$pendaftar || $pendaftar->status !== 'Lulus') {
            return redirect()->route('status.cek');
        }

        $jadwal = Jadwal::all();
        $batasDaftarUlangDisplay = 'Segera';
        $isExpired = false;

        foreach ($jadwal as $j) {
            $tahapan = is_string($j->tahapan) ? json_decode($j->tahapan, true) : $j->tahapan;
            $isGelombangUser = false;
            $tanggalDaftarUlangItem = null;

            if (is_array($tahapan)) {
                foreach ($tahapan as $item) {
                    if (isset($item['title']) && stripos($item['title'], 'Tes Masuk') !== false) {
                        $tglTes = $this->convertTanggalIndo($item['date']);
                        if ($tglTes == $pendaftar->tanggal_ujian) {
                            $isGelombangUser = true;
                        }
                    }
                    if (isset($item['title']) && stripos($item['title'], 'Daftar Ulang') !== false) {
                        $tanggalDaftarUlangItem = $item['date'];
                    }
                }
            }
            if ($isGelombangUser && $tanggalDaftarUlangItem) {
                $batasDaftarUlangDisplay = $tanggalDaftarUlangItem;
                $batasDate = $this->convertTanggalIndo($tanggalDaftarUlangItem);
                if ($batasDate && now()->toDateString() > $batasDate) {
                    $isExpired = true;
                }
                break;
            }
        }

        return Inertia::render('DaftarUlang', [
            'pendaftar' => $pendaftar,
            'batasDaftarUlang' => $batasDaftarUlangDisplay,
            'isExpired' => $isExpired
        ]);
    }

    // --- SIMPAN DAFTAR ULANG & GENERATE TAGIHAN ---
    public function daftarUlangStore(Request $request)
    {
        $request->validate([
            'surat_pernyataan' => 'required|file|mimes:pdf|max:2048', 
            'check_pemeriksaan' => 'accepted'
        ], [
            'surat_pernyataan.mimes' => 'Format file harus berupa PDF.',
            'check_pemeriksaan.accepted' => 'Anda harus menyetujui hasil pemeriksaan berkas.'
        ]);

        $user = Auth::user();
        
        // Ambil pendaftar + data programnya
        $pendaftar = Pendaftar::with('program')->where('user_id', $user->id)->latest()->firstOrFail();

        if ($request->hasFile('surat_pernyataan')) {
            if ($pendaftar->surat_pernyataan) {
                Storage::disk('public')->delete($pendaftar->surat_pernyataan);
            }
            
            $path = $request->file('surat_pernyataan')->store('berkas_daftar_ulang', 'public');
            
            $pendaftar->update([
                'surat_pernyataan' => $path,
                'status' => 'Sudah Daftar Ulang'
            ]);

            // --- [FITUR BARU] TAGIHAN UANG MASUK (DINAMIS) ---
            $program = $pendaftar->program;
            $nominalTagihan = 5000000; // Default Safety
            $statusLunas = 'Belum Lunas';

            if ($program) {
                // 1. Cek Beasiswa (Gratis)
                if (stripos($program->nama, 'Beasiswa') !== false) {
                    $nominalTagihan = 0;
                    $statusLunas = 'Lunas';
                } else {
                    // 2. Ambil harga dari database
                    $nominalTagihan = (int)$program->nominal_uang_masuk;
                }
            }

            UangMasuk::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'total_tagihan' => $nominalTagihan,
                    'sudah_dibayar' => 0, 
                    'status' => $statusLunas
                ]
            );

            // Ubah Role User Jadi Wali Santri
            $user->update(['role' => 'wali_santri']); 
        }

        return redirect()->route('status.cek')->with('success', 'Alhamdulillah, proses daftar ulang berhasil! Menu pembayaran Uang Masuk kini tersedia.');
    }

    public function downloadTemplate()
{
    $user = Auth::user();
    // Load relasi program
    $pendaftar = Pendaftar::with('program')->where('user_id', $user->id)->latest()->first();

    if (!$pendaftar) {
        return redirect()->back()->with('error', 'Data pendaftaran tidak ditemukan.');
    }

    // --- TAMBAHAN KODE FIX ---
    // Jika relasi program kosong, tapi nama program ada
    if (!$pendaftar->program && $pendaftar->program_nama) {
        // Cari program asli di database berdasarkan nama
        $programAsli = Program::where('nama', $pendaftar->program_nama)->first();
        
        if ($programAsli) {
            // Update data pendaftar agar punya ID program
            $pendaftar->program_id = $programAsli->id;
            $pendaftar->save();
            
            // Refresh data agar relasi terbaca
            $pendaftar->refresh(); 
            $pendaftar->load('program'); 
        }
    }
    // -------------------------

    $pdf = Pdf::loadView('pdf.surat_pernyataan', [
        'pendaftar' => $pendaftar,
        'tanggal_cetak' => now()->translatedFormat('d F Y')
    ]);

    $pdf->setPaper('a4', 'portrait');

    return $pdf->download('Surat_Pernyataan_' . str_replace(' ', '_', $pendaftar->nama) . '.pdf');
}
}