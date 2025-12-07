<?php

namespace App\Http\Controllers;

use App\Models\Pendaftar;
use App\Models\Program;
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

    // 1. Cek apakah user punya pendaftaran aktif
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

    // 2. Konversi "23 Februari 2025" ke "2025-02-23" (Format Database)
    private function convertTanggalIndo($stringDate)
    {
        $bulanIndo = [
            'Januari' => '01', 'Februari' => '02', 'Maret' => '03', 'April' => '04',
            'Mei' => '05', 'Juni' => '06', 'Juli' => '07', 'Agustus' => '08',
            'September' => '09', 'Oktober' => '10', 'November' => '11', 'Desember' => '12'
        ];

        $parts = explode(' ', $stringDate); // ["23", "Februari", "2025"]

        if (count($parts) === 3) {
            $tgl = str_pad($parts[0], 2, '0', STR_PAD_LEFT);
            $bulan = isset($bulanIndo[$parts[1]]) ? $bulanIndo[$parts[1]] : '01';
            $tahun = $parts[2];
            return "$tahun-$bulan-$tgl";
        }

        return now()->addDays(3)->toDateString(); // Fallback default
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
    
    // --- LOGIKA UTAMA: CEK STATUS & AUTO JADWAL ---
    
    
    public function checkStatus()
    {
        $user = auth()->user();
        
        // 1. Ambil list awal untuk dicek
        $pendaftarList = Pendaftar::where('user_id', $user->id)->get();

        if ($pendaftarList->isEmpty()) {
            return redirect()->route('formulir.index')->with('error', 'Anda belum mendaftar.');
        }

        // 2. Lakukan Update Logic
        foreach ($pendaftarList as $pendaftar) {
            
            // HANYA PROSES JIKA SUDAH LUNAS
            if ($pendaftar->status_pembayaran == 'Lunas') {
                $updates = [];

                // A. Auto Verifikasi Status (Jika masih menunggu)
                if ($pendaftar->status == 'Menunggu Verifikasi') {
                    $updates['status'] = 'Sudah Diverifikasi';
                }

                // B. Auto Isi Jadwal (Force Update jika null)
                if (is_null($pendaftar->tanggal_ujian)) {
                    
                    // Cari program berdasarkan nama
                    $program = Program::where('nama', $pendaftar->program_nama)->first();
                    
                    // Fallback default tanggal (hari ini + 3 hari)
                    $tanggalPilihan = now()->addDays(3)->toDateString(); 

                    if ($program && $program->jadwal) {
                        // DETEKSI FORMAT JSON
                        $jadwalData = $program->jadwal;
                        
                        // Jika masih berupa string, decode dulu
                        if (is_string($jadwalData)) {
                            $decoded = json_decode($jadwalData, true);
                            // Cek double decode (kasus umum jika copy paste di db)
                            if (is_string($decoded)) {
                                $jadwalData = json_decode($decoded, true);
                            } else {
                                $jadwalData = $decoded;
                            }
                        }

                        // LOOPING MENCARI "Tes Masuk"
                        if (is_array($jadwalData)) {
                            foreach ($jadwalData as $item) {
                                // Cek Case Insensitive (Huruf besar/kecil tidak masalah)
                                if (isset($item['title']) && stripos($item['title'], 'Tes Masuk') !== false) {
                                    $rawDate = $item['date']; // "23 Februari 2025"
                                    
                                    // Panggil Helper Convert
                                    $hasilConvert = $this->convertTanggalIndo($rawDate);
                                    
                                    // Pastikan hasil convert valid, jika tidak pakai fallback
                                    $tanggalPilihan = $hasilConvert ?: $tanggalPilihan;
                                    
                                    break; // Ketemu? Stop looping.
                                }
                            }
                        }
                    }

                    $updates['tanggal_ujian'] = $tanggalPilihan;
                    $updates['waktu_ujian'] = '08:00'; 
                    $updates['lokasi_ujian'] = 'Gedung Utama RTQ Al-Yusra';
                }

                // Eksekusi Update ke Database
                if (!empty($updates)) {
                    Pendaftar::where('id', $pendaftar->id)->update($updates);
                }
            }
        }

        // 3. PENTING: Query Ulang Database Agar Data Fresh
        // Kita ambil ulang data dari database supaya perubahan di atas langsung terbaca frontend
        $pendaftarListFresh = Pendaftar::where('user_id', $user->id)
                                  ->orderBy('created_at', 'desc')
                                  ->get();

        // 4. Attach Materi Ujian ke data fresh
        foreach ($pendaftarListFresh as $pendaftar) {
            $programData = Program::where('nama', $pendaftar->program_nama)->first();
            $pendaftar->materi_ujian_program = $programData ? $programData->materi_ujian : null;
        }

        return Inertia::render('StatusPendaftaran', [
            'pendaftarList' => $pendaftarListFresh,
        ]);
    }

}