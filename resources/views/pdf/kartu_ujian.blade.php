<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Kartu Ujian - {{ $pendaftar->nama }}</title>
    <style>
        body {
            font-family: serif;
            font-size: 12pt;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            padding: 20px;
        }
        .header {
            border-bottom: 3px double #000;
            padding-bottom: 20px;
            margin-bottom: 30px;
            text-align: center;
        }
        .logo {
            width: 80px;
            height: auto;
            position: absolute;
            left: 20px;
            top: 20px;
        }
        .header h1 {
            font-size: 24pt;
            font-weight: bold;
            text-transform: uppercase;
            margin: 0;
            letter-spacing: 2px;
        }
        .header p {
            margin: 2px 0;
            font-size: 10pt;
        }
        .title {
            text-align: center;
            margin-bottom: 30px;
        }
        .title h2 {
            font-size: 18pt;
            text-decoration: underline;
            margin-bottom: 5px;
        }
        .reg-no-box {
            display: inline-block;
            border: 1px solid #000;
            background-color: #f8f9fa;
            padding: 5px 15px;
            font-family: monospace;
            font-size: 14pt;
            border-radius: 4px;
        }
        .content {
            display: table;
            width: 100%;
            margin-bottom: 30px;
        }
        .photo-box {
            display: table-cell;
            width: 30%;
            vertical-align: top;
            text-align: center;
        }
        .photo-frame {
            width: 3cm;
            height: 4cm;
            border: 1px solid #000;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #f1f1f1;
        }
        .photo-frame img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .photo-placeholder {
            margin-top: 40px;
            color: #888;
            font-size: 10pt;
        }
        .data-box {
            display: table-cell;
            width: 70%;
            vertical-align: top;
            padding-left: 20px;
        }
        table.data-table {
            width: 100%;
            border-collapse: collapse;
        }
        table.data-table td {
            padding: 5px 0;
            vertical-align: top;
        }
        table.data-table td.label {
            width: 140px;
            font-weight: bold;
        }
        table.data-table td.colon {
            width: 10px;
        }
        .schedule-box {
            border: 2px solid #000;
            border-radius: 8px;
            margin-bottom: 30px;
            overflow: hidden;
        }
        .schedule-header {
            background-color: #e9ecef;
            border-bottom: 2px solid #000;
            text-align: center;
            padding: 10px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .schedule-content {
            display: table;
            width: 100%;
        }
        .schedule-item {
            display: table-cell;
            width: 33.33%;
            text-align: center;
            padding: 15px 5px;
            border-right: 2px solid #000;
        }
        .schedule-item:last-child {
            border-right: none;
        }
        .schedule-label {
            font-size: 9pt;
            font-weight: bold;
            text-transform: uppercase;
            color: #666;
            margin-bottom: 5px;
            display: block;
        }
        .schedule-value {
            font-size: 13pt;
            font-weight: bold;
            display: block;
        }
        .materials {
            margin-bottom: 50px;
        }
        .materials h4 {
            border-bottom: 1px solid #000;
            display: inline-block;
            margin-bottom: 10px;
        }
        .footer {
            width: 100%;
            margin-top: 30px;
            border-top: 1px solid #ccc;
            padding-top: 30px;
        }
        .signature-box {
            display: table;
            width: 100%;
        }
        .signature-col {
            display: table-cell;
            width: 50%;
            text-align: center;
        }
        .signature-space {
            height: 80px;
        }
        .signature-line {
            border-bottom: 1px solid #000;
            display: inline-block;
            min-width: 200px;
            font-weight: bold;
        }
        .footer-note {
            margin-top: 40px;
            text-align: center;
            font-size: 8pt;
            font-style: italic;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Logo (Absolute Position) -->
        <img src="{{ public_path('images/logo6.png') }}" class="logo" alt="Logo">

        <!-- Header -->
        <div class="header">
            <h1>RTQ Al-Yusra</h1>
            <p>Jl. Pembangunan No. 123, Kota Tangsel, Banten</p>
            <p>Website: www.rtq-alyusra.com | Email: info@rtq-alyusra.com</p>
        </div>

        <!-- Title -->
        <div class="title">
            <h2>KARTU PESERTA UJIAN</h2>
            <div class="reg-no-box">
                {{ $pendaftar->no_pendaftaran }}
            </div>
        </div>

        <!-- Content (Photo & Data) -->
        <div class="content">
            <!-- Photo -->
            <div class="photo-box">
                <div class="photo-frame">
                    @if($pendaftar->pas_foto)
                        <img src="{{ public_path('storage/' . $pendaftar->pas_foto) }}" alt="Pas Foto">
                    @else
                        <div class="photo-placeholder">
                            Pas Foto<br>3 x 4
                        </div>
                    @endif
                </div>
            </div>

            <!-- Data -->
            <div class="data-box">
                <table class="data-table">
                    <tr>
                        <td class="label">Nama Lengkap</td>
                        <td class="colon">:</td>
                        <td><strong>{{ strtoupper($pendaftar->nama) }}</strong></td>
                    </tr>
                    <tr>
                        <td class="label">Program Pilihan</td>
                        <td class="colon">:</td>
                        <td>{{ strtoupper($pendaftar->program->nama ?? '-') }}</td>
                    </tr>
                    <tr>
                        <td class="label">Jenis Kelamin</td>
                        <td class="colon">:</td>
                        <td>{{ $pendaftar->jenis_kelamin }}</td>
                    </tr>
                    <tr>
                        <td class="label">Tempat, Tgl Lahir</td>
                        <td class="colon">:</td>
                        <td>{{ $pendaftar->tempat_lahir }}, {{ \Carbon\Carbon::parse($pendaftar->tanggal_lahir)->translatedFormat('d F Y') }}</td>
                    </tr>
                </table>
            </div>
        </div>

        <!-- Schedule -->
        <div class="schedule-box">
            <div class="schedule-header">
                Jadwal & Lokasi Ujian
            </div>
            <div class="schedule-content">
                <div class="schedule-item">
                    <span class="schedule-label">Hari / Tanggal</span>
                    <span class="schedule-value">
                        {{ $pendaftar->tanggal_ujian ? \Carbon\Carbon::parse($pendaftar->tanggal_ujian)->translatedFormat('l, d F Y') : '-' }}
                    </span>
                </div>
                <div class="schedule-item">
                    <span class="schedule-label">Waktu</span>
                    <span class="schedule-value">
                        {{ $pendaftar->waktu_ujian ? $pendaftar->waktu_ujian . ' WIB' : '-' }}
                    </span>
                </div>
                <div class="schedule-item">
                    <span class="schedule-label">Lokasi</span>
                    <span class="schedule-value">
                        {{ $pendaftar->lokasi_ujian ?? 'Gedung Utama RTQ' }}
                    </span>
                </div>
            </div>
        </div>

        <!-- Materials -->
        <div class="materials">
            <h4>Materi yang Diujikan:</h4>
            <ol>
                @if(($materi = $pendaftar->program->materi_ujian ?? []) && count($materi) > 0)
                    @foreach($materi as $item)
                        <li>{{ $item }}</li>
                    @endforeach
                @else
                    <li>Membaca Al-Qur'an (Tahsin / Tahfidz)</li>
                    <li>Wawancara Calon Santri</li>
                    <li>Wawancara Wali Santri</li>
                @endif
            </ol>
        </div>

        <!-- Signature -->
        <div class="footer">
            <!-- Signature removed as per request -->
            <div class="signature-box" style="display: none;"></div>
            
            <div class="footer-note">
                *Harap membawa kartu ini dan alat tulis saat mengikuti ujian.<br>
                Dicetak otomatis oleh Sistem RTQ Al-Yusra pada: {{ \Carbon\Carbon::now()->translatedFormat('l, d F Y H:i') }} WIB
            </div>
        </div>
    </div>
</body>
</html>
