<?php

namespace App\Http\Controllers;

use App\Models\Pendaftar;
use App\Models\Program;
use App\Models\Jadwal; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; 
use Inertia\Inertia;
use Midtrans\Config;
use Midtrans\Snap;
use Illuminate\Support\Facades\Log;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

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
                            ->whereNotIn('status', ['Lulus', 'Tidak Lulus']);
                      });
            })
            ->first();
    }

    // Helper: Ubah "s.d 22 Februari 2025" -> "2025-02-22"
    private function convertTanggalIndo($stringDate)
    {
        $bulanIndo = [
            'Januari' => '01', 'Februari' => '02', 'Maret' => '03', 'April' => '04',
            'Mei' => '05', 'Juni' => '06', 'Juli' => '07', 'Agustus' => '08',
            'September' => '09', 'Oktober' => '10', 'November' => '11', 'Desember' => '12'
        ];

        // 1. Bersihkan kata-kata seperti "s.d", "sampai", dll.
        // Hanya sisakan angka dan huruf.
        $cleanString = preg_replace('/[^a-zA-Z0-9\s]/', '', $stringDate); 
        $parts = explode(' ', trim($cleanString)); 

        // 2. Ambil 3 bagian TERAKHIR (Tanggal, Bulan, Tahun)
        // Ini untuk mengantisipasi format "s d 22 Februari 2025" (5 kata) -> kita cuma butuh 3 terakhir
        if (count($parts) >= 3) {
            $tahun = array_pop($parts);      // 2025
            $bulanNama = array_pop($parts);  // Februari
            $tanggal = array_pop($parts);    // 22
            
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
            return redirect()->route('status.cek')
                ->with('error', 'Formulir Anda sedang berjalan. Harap selesaikan proses pendaftaran sebelumnya.');
        }

        $program = Program::where('slug', $program_slug)->first();
        if (!$program) abort(404);

        return Inertia::render('Formulir', ['program' => $program]);
    }

    public function store(Request $request)
    {
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
            'program_nama' => 'required|string',
            'program_jenis' => 'required|string',
            'ijazah_terakhir' => 'nullable|file|mimes:pdf,jpg,png,jpeg|max:2048',
            'kartu_keluarga' => 'nullable|file|mimes:pdf,jpg,png,jpeg|max:2048',
            'pas_foto' => 'nullable|file|mimes:jpg,png,jpeg|max:2048',
            'skbb' => 'nullable|file|mimes:pdf,jpg,png,jpeg|max:2048',
            'sks' => 'nullable|file|mimes:pdf,jpg,png,jpeg|max:2048',
        ]);

        $existingPendaftar = $this->cekPendaftaranAktif(Auth::id());

        if ($existingPendaftar && $existingPendaftar->nik !== $request->nik) {
             return redirect()->route('status.cek')->with('error', 'Anda masih memiliki pendaftaran aktif dengan NIK lain.');
        }

        if (!$existingPendaftar) {
            $nikExists = Pendaftar::where('nik', $request->nik)->exists();
            if ($nikExists) {
                return redirect()->back()->withErrors(['nik' => 'NIK ini sudah terdaftar sebelumnya.']);
            }
        }

        $dataToSave = $validatedData;

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
        
        $program = Program::where('nama', $request->program_nama)->first();
        $biayaClean = $program ? preg_replace('/[^0-9]/', '', $program->biaya) : 300000;
        $dataToSave['nominal_pembayaran'] = (int) $biayaClean; 

        if ($existingPendaftar) {
            $existingPendaftar->update($dataToSave);
            $pendaftar = $existingPendaftar;
        } else {
            $dataToSave['no_pendaftaran'] = 'RTQ-' . now()->format('Ymd') . '-' . strtoupper(substr(uniqid(), -4));
            $dataToSave['user_id'] = Auth::id(); 
            $dataToSave['status'] = 'Menunggu Verifikasi'; 
            $dataToSave['status_pembayaran'] = 'Belum Bayar';
            $pendaftar = Pendaftar::create($dataToSave);
        }

        // --- MIDTRANS ---
        Config::$serverKey = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized = config('midtrans.is_sanitized');
        Config::$is3ds = config('midtrans.is_3ds');

        if (empty($pendaftar->snap_token) || $pendaftar->nominal_pembayaran != $existingPendaftar?->nominal_pembayaran) {
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
    
    // --- LOGIKA UTAMA: CEK STATUS & AUTO JADWAL CERDAS ---
    public function checkStatus()
    {
        $user = auth()->user();
        
        $pendaftarList = Pendaftar::where('user_id', $user->id)->get();

        if ($pendaftarList->isEmpty()) {
            return redirect()->route('formulir.index')->with('error', 'Anda belum mendaftar.');
        }

        foreach ($pendaftarList as $pendaftar) {
            
            // 1. Cek Apakah Status Lunas?
            if ($pendaftar->status_pembayaran == 'Lunas') {
                $updates = [];

                // Auto Verifikasi
                if ($pendaftar->status == 'Menunggu Verifikasi') {
                    $updates['status'] = 'Sudah Diverifikasi';
                }

                // 2. Cek Apakah Jadwal Masih Kosong? (Gunakan empty agar string kosong "" juga terdeteksi)
                if (empty($pendaftar->tanggal_ujian)) {
                    
                    // --- LOGIKA CARI JADWAL ---
                    $semuaJadwal = Jadwal::all();
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

                        // Jika hari ini <= batas pendaftaran, pilih jadwal ini
                        if ($batasPendaftaran && $tglTesMasuk && now()->toDateString() <= $batasPendaftaran) {
                            $tanggalDipilih = $tglTesMasuk;
                            break; 
                        }
                    }

                    // Fallback default
                    $updates['tanggal_ujian'] = $tanggalDipilih ?: now()->addDays(3)->toDateString();
                    $updates['waktu_ujian'] = '08:00'; 
                    $updates['lokasi_ujian'] = 'Gedung Utama RTQ Al-Yusra';
                    
                    // --- DEBUGGING SEMENTARA (HAPUS NANTI) ---
                    // Kode ini akan mematikan aplikasi dan menampilkan data yang mau disimpan.
                    // Jika layar Anda putih tulisan hitam berisi array, berarti logika BERJALAN.
                    // Jika tidak muncul apa-apa (langsung masuk web), berarti logika ini DILEWATI.
                     //dd('LOGIKA BERJALAN', $updates); 
                }

                // Eksekusi Update
                if (!empty($updates)) {
                    Pendaftar::where('id', $pendaftar->id)->update($updates);
                }
            }
        }

        // Ambil data fresh untuk ditampilkan
        $pendaftarListFresh = Pendaftar::where('user_id', $user->id)
                                  ->orderBy('created_at', 'desc')
                                  ->get();

        foreach ($pendaftarListFresh as $pendaftar) {
            $programData = Program::where('nama', $pendaftar->program_nama)->first();
            $pendaftar->materi_ujian_program = $programData ? $programData->materi_ujian : null;
        }

        return Inertia::render('StatusPendaftaran', [
            'pendaftarList' => $pendaftarListFresh,
        ]);
    }
}