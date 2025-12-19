<!DOCTYPE html>
<html>
<head>
    <title>Surat Pernyataan Santri</title>
    <style>
        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12pt;
            line-height: 1.5;
            margin: 0;
            padding: 0;
        }
        .container {
            margin: 0 auto;
            width: 100%;
        }
        .header {
            text-align: center;
            border-bottom: 3px double #000;
            margin-bottom: 20px;
            padding-bottom: 10px;
        }
        .header img {
            width: 80px;
            height: auto;
            position: absolute;
            left: 0;
            top: 0;
        }
        .header h1 {
            font-size: 16pt;
            font-weight: bold;
            margin: 0;
            text-transform: uppercase;
        }
        .header h2 {
            font-size: 14pt;
            font-weight: bold;
            margin: 5px 0;
        }
        .header p {
            font-size: 10pt;
            margin: 0;
            font-style: italic;
        }
        .content {
            padding: 0 20px;
        }
        .title {
            text-align: center;
            font-weight: bold;
            text-decoration: underline;
            margin: 20px 0;
            font-size: 14pt;
        }
        .table-data {
            width: 100%;
            margin-bottom: 10px;
        }
        .table-data td {
            vertical-align: top;
            padding: 3px 0;
        }
        .table-data td:first-child {
            width: 180px;
        }
        .table-data td:nth-child(2) {
            width: 20px;
            text-align: center;
        }
        .footer {
            margin-top: 50px;
            width: 100%;
        }
        .signature-box {
            width: 40%;
            text-align: center;
            float: right;
        }
        .signature-box-left {
            width: 40%;
            text-align: center;
            float: left;
        }
        .sign-space {
            height: 80px;
        }
        .materai {
            border: 1px dashed #999;
            width: 80px;
            height: 50px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 9pt;
            color: #999;
            padding-top: 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="{{ public_path('images/logo.png') }}" alt="Logo RTQ">
            <h1>RUMAH TAHFIZH QUR'AN AL-YUSRA</h1>
            <h2>PENERIMAAN SANTRI BARU</h2>
            <p>Jalan Kamboja Indah, Tangkerang Timur, Tenayan Raya, Pekanbaru, Riau 28289</p>
        </div>

        <div class="content">
            <div class="title">SURAT PERNYATAAN</div>

            <p>Saya yang bertanda tangan di bawah ini:</p>

            <table class="table-data">
                <tr>
                    <td>Nama Orang Tua/Wali</td>
                    <td>:</td>
                    <td><strong>{{ strtoupper($pendaftar->nama_orang_tua) }}</strong></td>
                </tr>
                <tr>
                    <td>Alamat</td>
                    <td>:</td>
                    <td>{{ $pendaftar->alamat }}</td>
                </tr>
                <tr>
                    <td>No. Handphone</td>
                    <td>:</td>
                    <td>{{ $pendaftar->no_hp }}</td>
                </tr>
                <tr>
                    <td>Hubungan dengan Santri</td>
                    <td>:</td>
                    <td>Orang Tua Kandung / Wali</td>
                </tr>
            </table>

            <p>Selaku orang tua/wali dari calon santri:</p>

            <table class="table-data">
                <tr>
                    <td>Nama Santri</td>
                    <td>:</td>
                    <td><strong>{{ strtoupper($pendaftar->nama) }}</strong></td>
                </tr>
                <tr>
                    <td>No. Pendaftaran</td>
                    <td>:</td>
                    <td>{{ $pendaftar->no_pendaftaran }}</td>
                </tr>
                <tr>
                    <td>Program Pilihan</td>
                    <td>:</td>
                    <td>{{ $pendaftar->program_nama }} ({{ $pendaftar->program_jenis }})</td>
                </tr>
                <tr>
                    <td>Tempat, Tanggal Lahir</td>
                    <td>:</td>
                    <td>{{ $pendaftar->tempat_lahir }}, {{ \Carbon\Carbon::parse($pendaftar->tanggal_lahir)->translatedFormat('d F Y') }}</td>
                </tr>
            </table>

            <p style="text-align: justify; margin-top: 15px;">
                Dengan ini menyatakan dengan sesungguhnya bahwa:
            </p>

            <ol style="text-align: justify;">
                <li>Saya menyerahkan anak saya sepenuhnya kepada pihak RTQ Al-Yusra untuk dididik dan dibina sesuai dengan kurikulum dan peraturan yang berlaku.</li>
                <li>Bersedia mematuhi segala peraturan dan tata tertib yang ditetapkan oleh RTQ Al-Yusra, baik untuk santri maupun wali santri.</li>
                <li>Bersedia memenuhi kewajiban administrasi (SPP dan biaya lainnya) tepat pada waktunya sesuai ketentuan yang berlaku.</li>
                <li>Bersedia bekerja sama dengan pihak RTQ Al-Yusra dalam mengawasi perkembangan pendidikan dan akhlak anak saya.</li>
                <li>Apabila di kemudian hari saya atau anak saya melanggar ketentuan yang telah ditetapkan, saya bersedia menerima sanksi sesuai kebijakan RTQ Al-Yusra.</li>
            </ol>

            <p style="text-align: justify;">
                Demikian surat pernyataan ini saya buat dengan sadar dan tanpa paksaan dari pihak manapun, untuk dapat dipergunakan sebagaimana mestinya.
            </p>
        </div>

        <div class="footer">
            <div class="signature-box-left">
                <br>
                Mengetahui,<br>
                Calon Santri
                <div class="sign-space"></div>
                <strong>({{ strtoupper($pendaftar->nama) }})</strong>
            </div>

            <div class="signature-box">
                Pekanbaru, {{ $tanggal_cetak }}<br>
                Yang Membuat Pernyataan,
                <div class="sign-space">
                    <div class="materai">Materai 10.000</div>
                </div>
                <strong>({{ strtoupper($pendaftar->nama_orang_tua) }})</strong><br>
                (Orang Tua / Wali)
            </div>
            <div style="clear: both;"></div>
        </div>
    </div>
</body>
</html>