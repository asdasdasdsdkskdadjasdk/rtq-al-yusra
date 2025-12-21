<?php

namespace App\Http\Controllers;

use App\Models\Pendaftar;
use App\Models\UangMasuk;
use App\Models\RiwayatUangMasuk;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Midtrans\Config;
use Midtrans\Snap;

class WaliUangMasukController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // 1. GET USER'S PROGRAM DATA
        $pendaftar = Pendaftar::where('user_id', $user->id)
            ->with('program')
            ->where('status', 'Lulus')
            ->latest()
            ->first();

        if (!$pendaftar) {
            $pendaftar = Pendaftar::where('user_id', $user->id)
                ->with('program')
                ->latest()
                ->first();
        }

        // 2. DETERMINE FEE
        $program = $pendaftar ? $pendaftar->program : null;
        $namaProgram = $program ? $program->nama : 'Program Belum Dipilih';
        
        $nominalTagihan = $program ? (int)$program->nominal_uang_masuk : 5000000;
        
        $isBeasiswa = false;
        if ($program && stripos($program->nama, 'Beasiswa') !== false) {
            $isBeasiswa = true;
            $nominalTagihan = 0;
        }

        // 3. GET OR CREATE RECORD
        $uangMasuk = UangMasuk::firstOrCreate(
            ['user_id' => $user->id],
            [
                'total_tagihan' => $nominalTagihan,
                'sudah_dibayar' => 0,
                'status' => $isBeasiswa ? 'Lunas' : 'Belum Lunas'
            ]
        );

        // 4. SYNC DATA
        if ($uangMasuk->status !== 'Lunas') {
            if ($uangMasuk->total_tagihan !== $nominalTagihan) {
                $uangMasuk->total_tagihan = $nominalTagihan;
                $uangMasuk->save();
            }
            if ($uangMasuk->sudah_dibayar >= $nominalTagihan) {
                $uangMasuk->status = 'Lunas';
                $uangMasuk->save();
            }
        }

        $sisaTagihan = $isBeasiswa ? 0 : max(0, $uangMasuk->total_tagihan - $uangMasuk->sudah_dibayar);

        // Get History
        $riwayatList = $uangMasuk->riwayat()->latest()->get();

        // 6. PREPARE DATA FOR VIEW
        $dataView = [
            'id' => $uangMasuk->id,
            'total_tagihan' => $uangMasuk->total_tagihan,
            'sudah_dibayar' => (int)$uangMasuk->sudah_dibayar,
            'sisa' => $sisaTagihan,
            'status_text' => $uangMasuk->status,
            'program_nama' => $namaProgram,
            'is_beasiswa' => $isBeasiswa,
            'riwayat' => $riwayatList // <--- ADDED THIS HERE
        ];

        return Inertia::render('Wali/UangMasuk/Index', [
            'tagihan' => $dataView,
            'user' => $user,
            'midtrans_client_key' => config('midtrans.client_key')
        ]);
    }

    // ... rest of the methods (createToken, storeUpload) remain the same
    public function createToken(Request $request)
    {
        $request->validate(['jumlah_bayar' => 'required|numeric|min:10000']);
        $user = Auth::user();
        $uangMasuk = UangMasuk::where('user_id', $user->id)->firstOrFail();

        if ($uangMasuk->status === 'Lunas') {
            return response()->json(['error' => 'Tagihan sudah lunas.'], 400);
        }

        Config::$serverKey = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized = config('midtrans.is_sanitized');
        Config::$is3ds = config('midtrans.is_3ds');

        $orderId = 'UM-' . $uangMasuk->id . '-' . time();

        $params = [
            'transaction_details' => [
                'order_id' => $orderId,
                'gross_amount' => (int) $request->jumlah_bayar,
            ],
            'customer_details' => [
                'first_name' => $user->name,
                'email' => $user->email,
                'phone' => $user->no_hp ?? '08123456789',
            ],
            'item_details' => [[
                'id' => 'UM-CICILAN',
                'price' => (int) $request->jumlah_bayar,
                'quantity' => 1,
                'name' => 'Cicilan Uang Masuk'
            ]]
        ];

        try {
            $snapToken = Snap::getSnapToken($params);
            return response()->json(['token' => $snapToken]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function storeUpload(Request $request)
    {
        $request->validate([
            'jumlah_bayar' => 'required|numeric|min:10000',
            'bukti_bayar'  => 'required|image|max:2048',
            'keterangan'   => 'nullable|string'
        ]);

        $uangMasuk = UangMasuk::where('user_id', Auth::id())->firstOrFail();
        
        if ($uangMasuk->status === 'Lunas') {
            return back()->with('error', 'Tagihan sudah lunas, tidak perlu upload bukti lagi.');
        }

        $path = $request->file('bukti_bayar')->store('bukti_transfer', 'public');

        RiwayatUangMasuk::create([
            'uang_masuk_id' => $uangMasuk->id,
            'jumlah_bayar'  => $request->jumlah_bayar,
            'tanggal_bayar' => now(),
            'keterangan'    => $request->keterangan ?? 'Upload Bukti Transfer',
            'pencatat_id'   => Auth::id(),
            'bukti_bayar'   => $path,
            'status'        => 'pending' 
        ]);

        return back()->with('success', 'Bukti pembayaran berhasil diupload. Menunggu verifikasi admin.');
    }
}