<?php

namespace App\Exports;

use App\Models\Pendaftar;
use App\Models\SppTransaction;
use App\Models\RiwayatUangMasuk;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Carbon\Carbon;

class LaporanExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    protected $kategori;
    protected $start;
    protected $end;
    private $no = 0;

    public function __construct($kategori, $start, $end)
    {
        $this->kategori = $kategori;
        $this->start = $start;
        $this->end = $end;
    }

    public function query()
    {
        // 1. QUERY SPP
        if ($this->kategori === 'spp') {
            return SppTransaction::query()
                ->with('user')
                ->whereBetween('updated_at', [$this->start, $this->end])
                ->where('status', 'approved')
                ->orderBy('updated_at', 'desc');
        }

        // 2. QUERY UANG MASUK
        if ($this->kategori === 'uang_masuk') {
            return RiwayatUangMasuk::query()
                ->with(['uangMasuk.user', 'pencatat'])
                ->whereBetween('tanggal_bayar', [$this->start, $this->end])
                ->orderBy('tanggal_bayar', 'desc');
        }

        // 3. QUERY FORMULIR
        if ($this->kategori === 'formulir') {
            return Pendaftar::query()
                ->with('program')
                ->whereBetween('created_at', [$this->start, $this->end])
                ->orderBy('created_at', 'desc');
        }
    }

    // Mapping Data (Mengatur isi per baris)
    public function map($row): array
    {
        $this->no++;

        // A. MAP SPP
        if ($this->kategori === 'spp') {
            return [
                $this->no,
                Carbon::parse($row->updated_at)->format('d-m-Y H:i'),
                $row->user->name ?? 'User Terhapus',
                $this->getBulanNama($row->bulan),
                $row->tahun,
                "Rp " . number_format($row->jumlah_bayar, 0, ',', '.'),
                ucwords(str_replace('_', ' ', $row->tipe_pembayaran)),
                'LUNAS',
                $row->keterangan
            ];
        }

        // B. MAP UANG MASUK
        if ($this->kategori === 'uang_masuk') {
            return [
                $this->no,
                Carbon::parse($row->tanggal_bayar)->format('d-m-Y H:i'),
                $row->uangMasuk->user->name ?? '-',
                "Rp " . number_format($row->jumlah_bayar, 0, ',', '.'),
                $row->pencatat->name ?? 'Sistem (Midtrans)',
                $row->keterangan
            ];
        }

        // C. MAP FORMULIR
        if ($this->kategori === 'formulir') {
            return [
                $this->no,
                Carbon::parse($row->created_at)->format('d-m-Y'),
                $row->no_pendaftaran,
                $row->nama,
                $row->program->nama ?? '-',
                $row->status_pembayaran,
                $row->status
            ];
        }

        return [];
    }

    // Header Kolom Excel
    public function headings(): array
    {
        if ($this->kategori === 'spp') {
            return ['No', 'Tanggal Bayar', 'Nama Wali', 'Bulan Tagihan', 'Tahun', 'Nominal', 'Metode', 'Status', 'Keterangan'];
        }
        if ($this->kategori === 'uang_masuk') {
            return ['No', 'Tanggal Bayar', 'Nama Wali', 'Nominal Bayar', 'Pencatat', 'Keterangan'];
        }
        return ['No', 'Tanggal Daftar', 'No Pendaftaran', 'Nama Santri', 'Program', 'Status Bayar', 'Status Seleksi'];
    }

    // Styling Header (Bold)
    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }

    // Helper Bulan
    private function getBulanNama($angka)
    {
        $bulan = [
            1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
            5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
            9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember'
        ];
        return $bulan[$angka] ?? '-';
    }
}