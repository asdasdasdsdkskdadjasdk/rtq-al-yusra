<!DOCTYPE html>
<html>
<head>
    <title>Surat Keterangan Daftar Ulang</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <style>
        /* Menggunakan Margin Standar Surat Resmi (2.54 cm / 1 inch) */
        @page { margin: 2.54cm; }
        
        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12pt;
            line-height: 1.15;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
        }
        /* HEADER / KOP SURAT */
        .header-table {
            width: 100%;
            border-bottom: 3px double #000;
            margin-bottom: 20px;
            padding-bottom: 5px;
        }
        .header-logo {
            width: 15%;
            vertical-align: top;
        }
        .header-logo img {
            width: 80px;
            height: auto;
        }
        .header-text {
            width: 85%;
            text-align: center;
            vertical-align: middle;
        }
        .header-text h1 {
            font-size: 16pt;
            font-weight: bold;
            margin: 0;
            color: #2E8B57; /* Hijau sesuai logo */
            text-transform: uppercase;
        }
        .header-text h2 {
            font-size: 14pt;
            font-weight: bold;
            margin: 0;
            color: #2E8B57;
            text-transform: uppercase;
        }
        .header-text p {
            font-size: 9pt;
            margin: 2px 0 0 0;
            font-style: italic;
            color: #000;
        }

        /* JUDUL SURAT */
        .judul {
            text-align: center;
            margin-bottom: 20px;
        }
        .judul h3 {
            font-size: 14pt;
            font-weight: bold;
            text-decoration: underline;
            margin: 0;
            text-transform: uppercase;
        }
        .judul p {
            margin: 2px 0 0 0;
            font-size: 12pt;
        }

        /* ISI SURAT */
        .content {
            text-align: justify;
        }
        
        /* TABLE BIODATA */
        .table-biodata {
            width: 100%;
            margin-bottom: 10px;
        }
        .table-biodata td {
            vertical-align: top;
            padding: 2px 0;
        }
        .table-biodata td:first-child {
            width: 180px; /* Lebar label */
        }
        .table-biodata td:nth-child(2) {
            width: 20px;
            text-align: center;
        }
        .table-biodata td:nth-child(3) {
            font-weight: bold; 
        }

        /* POIN KETENTUAN */
        .syarat-list {
            margin-left: 0px; 
            padding-left: 20px; /* Indentasi Bullet Numbering */
        }
        .syarat-list li {
            margin-bottom: 6px;
            text-align: justify;
            padding-left: 5px;
        }

        /* FOOTER TANDA TANGAN */
        .footer {
            margin-top: 20px;
            width: 100%;
        }
        .signature-table {
            width: 100%;
        }
        .signature-table td {
            vertical-align: top;
            width: 50%;
            padding-top: 10px;
        }
        /* Rata Kiri di Blok Kiri (Santri) */
        .sign-left {
            text-align: left; 
        }
        /* Rata Kiri di Blok Kanan (Pimpinan) dengan Padding agar visual di kanan */
        .sign-right {
            text-align: left;
            padding-left: 60px; /* Geser blok teks agar terlihat di kanan */
        }
        .sign-space {
            height: 70px;
        }
    </style>
</head>
<body>
    <div class="container">
        <table class="header-table">
            <tr>
                <td class="header-logo">
                    <img src="{{ public_path('images/logo.png') }}" alt="Logo">
                </td>
                <td class="header-text">
                    <h1>RUMAH TAHFIDZ AL QURAN</h1>
                    <h2>RTQ AL YUSRA PEKANBARU</h2>
                    <p>Sekretariat : Jl. Wijaya Gg. Keluarga No. 69 RT. 02 RW. 02 Kedung Sari Sukajadi Pekanbaru</p>
                    <p>CP : 085218669128 Email : rtqalyusrapekanbaru@gmail.com</p>
                </td>
            </tr>
        </table>

        <div class="content">
            <div class="judul">
                <h3>SURAT KETERANGAN DAFTAR ULANG</h3>
                <p>Nomor : SKDU/RTQ/VI/{{ date('Y') }}</p>
            </div>

            <p>Yang bertanda tangan dibawah ini</p>

            <table class="table-biodata">
                <tr>
                    <td>Nama</td>
                    <td>:</td>
                    <td>{{ strtoupper($pendaftar->nama) }}</td>
                </tr>
                <tr>
                    <td>Tempat Tanggal Lahir</td>
                    <td>:</td>
                    <td>{{ $pendaftar->tempat_lahir }}, {{ \Carbon\Carbon::parse($pendaftar->tanggal_lahir)->translatedFormat('d F Y') }}</td>
                </tr>
                <tr>
                    <td>Nama Ayah</td>
                    <td>:</td>
                    <td>{{ strtoupper($pendaftar->nama_ayah ?? $pendaftar->nama_orang_tua) }}</td>
                </tr>
                <tr>
                    <td>Alamat</td>
                    <td>:</td>
                    <td>{{ $pendaftar->alamat }}</td>
                </tr>
                <tr>
                    <td>Program</td> <td>:</td>
                    <td>{{ $pendaftar->program->nama ?? $pendaftar->program_nama }}</td>
                </tr>
            </table>

            <p>
                Dengan ini kami selaku santri di RTQ Al Yusra Pekanbaru menyatakan bahwa akan 
                ( <span style="font-weight:bold">melanjutkan</span> / <span style="text-decoration:line-through">tidak melanjutkan</span> ) 
                pendidikan di RTQ Al Yusra Pekanbaru. Dengan mengikuti ketentuan-ketentuan dibawah ini:
            </p>

            <ol class="syarat-list">
                <li>
                    Bagi santri yang melanjutkan pendidikan di RTQ Al Yusra Pekanbaru untuk kembali ke asrama sesuai jadwal yang sudah ditentukan. Dan mengikuti segala peraturan dan tata tertib yang berlaku.
                </li>
                <li>
                    Bagi santri yang melanjutkan pendidikan di RTQ Al Yusra Pekanbaru untuk melakukan pembayaran pendaftaran ulang senilai <strong>Rp 1.000.000</strong>
                </li>
                <li>
                    Apabila santri tidak melanjutkan pendidikan di RTQ Al Yusra Pekanbaru, agar membawa seluruh pakaian dan perlengkapan pribadi masing-masing dan meninggalkan semua fasilitas dari Asrama seperti kasur, lemari, ranjang dll.
                </li>
                <li>
                    Apabila santri sudah menyatakan keluar dan memutuskan hendak pindah lalu dikemudian hari ingin kembali melanjutkan pendidikan di RTQ Al Yusra Pekanbaru maka harus mengikuti prosedur pendaftaran siswa baru dengan sistem berbayar sesuai dengan ketentuan yang berlaku.
                </li>
                <li>
                    {{-- Uang Operasional (Poin 5) Dinamis dari SPP Program --}}
                    {{-- Menggunakan optional() agar TIDAK ERROR 500 jika data program hilang --}}
                    Apabila santri berhenti di masa pendidikan dengan tidak menyelesaikan jenjang pendidikannya maka akan dikenakan pengganti uang operasional sebesar <strong>{{ "Rp " . number_format(optional($pendaftar->program)->nominal_spp ?? 0, 0, ',', '.') }},-</strong> untuk setiap bulannya yang telah dilalui dan sisa bulan yang akan dilalui di RTQ Al Yusra Pekanbaru.
                </li>
            </ol>
        </div>

        <div class="footer">
            <table class="signature-table">
                <tr>
                    <td class="sign-left">
                        <br><br> Santri
                        <div class="sign-space"></div>
                        <strong>{{ strtoupper($pendaftar->nama) }}</strong>
                    </td>

                    <td class="sign-right">
                        Pekanbaru, {{ $tanggal_cetak }}<br>
                        Menyetujui,<br>
                        Pimpinan RTQ Al Yusra Pekanbaru
                        <div class="sign-space"></div>
                        <strong>Jul Prima Mutia, ST. M.Pd</strong>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</body>
</html>