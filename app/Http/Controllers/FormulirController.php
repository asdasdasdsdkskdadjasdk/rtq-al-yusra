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
use SimpleSoftwareIO\QrCode\Facades\QrCode; // Import QrCode

class FormulirController extends Controller
{
    public function create($program_slug)
    {
        $program = Program::where('slug', $program_slug)->first();
        if (!$program) abort(404);

        return Inertia::render('Formulir', ['program' => $program]);
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
            'program_nama' => 'required|string',
            'program_jenis' => 'required|string',
            'ijazah_terakhir' => 'nullable|file|mimes:pdf,jpg,png,jpeg|max:2048',
            'kartu_keluarga' => 'nullable|file|mimes:pdf,jpg,png,jpeg|max:2048',
            'pas_foto' => 'nullable|file|mimes:jpg,png,jpeg|max:2048',
            'skbb' => 'nullable|file|mimes:pdf,jpg,png,jpeg|max:2048',
            'sks' => 'nullable|file|mimes:pdf,jpg,png,jpeg|max:2048',
        ]);

        // Cek data existing (sama seperti sebelumnya)
        $existingPendaftar = Pendaftar::where('user_id', Auth::id())
                                      ->where('status_pembayaran', '!=', 'Lunas')
                                      ->first();

        if (!$existingPendaftar) {
            $nikExists = Pendaftar::where('nik', $request->nik)->exists();
            if ($nikExists) {
                return redirect()->back()->withErrors(['nik' => 'NIK ini sudah terdaftar sebelumnya.']);
            }
        }

        $dataToSave = $validatedData;

        // 2. Proses Upload File
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
        
        // Ambil nominal biaya
        $program = Program::where('nama', $request->program_nama)->first();
        $biayaClean = $program ? preg_replace('/[^0-9]/', '', $program->biaya) : 300000;
        
        $dataToSave['nominal_pembayaran'] = (int) $biayaClean; 

        // LOGIKA CREATE ATAU UPDATE
        if ($existingPendaftar) {
            $existingPendaftar->update($dataToSave);
            $pendaftar = $existingPendaftar;
        } else {
            $dataToSave['no_pendaftaran'] = 'RTQ-' . now()->format('Ymd') . '-' . strtoupper(substr(uniqid(), -4));
            $dataToSave['user_id'] = Auth::id(); 
            $dataToSave['status'] = 'Menunggu Pembayaran'; 
            $dataToSave['status_pembayaran'] = 'Belum Bayar';
            $pendaftar = Pendaftar::create($dataToSave);
        }

        // --- MIDTRANS (Generate Token) ---
        Config::$serverKey = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized = config('midtrans.is_sanitized');
        Config::$is3ds = config('midtrans.is_3ds');

        $orderId = $pendaftar->no_pendaftaran . '-' . time();

        $params = [
            'transaction_details' => [
                'order_id' => $orderId, 
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

            // Redirect ke halaman pembayaran
            return redirect()->route('pembayaran.show', ['id' => $pendaftar->id]);

        } catch (\Exception $e) {
            Log::error('Midtrans Error: ' . $e->getMessage());
            return redirect()->route('pembayaran.show', ['id' => $pendaftar->id])
                             ->with('error', 'Gagal memproses token pembayaran. Silakan refresh halaman.');
        }
    }

    // Method untuk menampilkan halaman pembayaran QR Code
    public function showPayment($id)
    {
        $pendaftar = Pendaftar::findOrFail($id);

        // Pastikan hanya pemilik data yang bisa melihat
        if ($pendaftar->user_id !== Auth::id()) {
            abort(403);
        }

        // Generate QR Code berisi link pembayaran (atau data lain sesuai kebutuhan Midtrans QRIS)
        // Di sini saya contohkan QR Code yang berisi link ke halaman pembayaran ini sendiri 
        // atau bisa juga berisi string pembayaran jika pakai metode manual.
        // Untuk Midtrans QRIS, biasanya QR Code muncul di dalam popup Snap.
        // Tapi jika Anda ingin menampilkan QR Code statis untuk transfer manual, bisa di-generate di sini.
        
        // Contoh: QR Code berisi link untuk membayar via Snap (Link khusus jika ada, atau sekedar ID)
        $qrCode = QrCode::size(200)->generate($pendaftar->no_pendaftaran); 

        return Inertia::render('Pembayaran', [
            'pendaftar' => $pendaftar,
            'clientKey' => config('midtrans.client_key'),
            'qrCode' => $qrCode, // Kirim QR Code ke frontend (opsional jika mau ditampilkan)
        ]);
    }
}