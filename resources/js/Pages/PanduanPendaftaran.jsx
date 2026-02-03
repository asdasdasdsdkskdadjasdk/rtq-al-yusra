// resources/js/Pages/PanduanPendaftaran.jsx

import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

// PENTING: Import semua ikon satu per satu
import PanduanCard, {
    BuatAkunIcon,
    LoginIcon,
    PilihFormulirIcon,
    MelunasiTagihanIcon,
    MelengkapiDataIcon,
    MengunggahBerkasIcon,
    CetakKartuIcon,
    MenungguPengumumanIcon,
    RegistrasiUlangIcon
} from '@/Components/Page/Panduan/PanduanCard';

// PERBAIKAN URUTAN DATA:
// Melunasi Tagihan dipindah ke posisi setelah Mengunggah Berkas
const langkahData = [
    {
        nomor: 1,
        judul: 'Buat Akun',
        deskripsi: 'Calon santri atau wali santri wajib membuat akun terlebih dahulu melalui menu Login > Register. Isi Nama Lengkap, Email aktif, dan Password dengan benar untuk akses ke sistem pendaftaran.',
        color: 'white',
        icon: BuatAkunIcon
    },
    {
        nomor: 2,
        judul: 'Login',
        deskripsi: 'Setelah berhasil mendaftar, silakan Login menggunakan Email dan Password akun yang telah dibuat untuk masuk ke Dashboard Pendaftaran.',
        color: 'orange',
        icon: LoginIcon
    },
    {
        nomor: 3,
        judul: 'Pilih Program',
        deskripsi: 'Di Dashboard, klik menu "Pendaftaran Baru". Pilih Program Pendidikan yang tersedia (Misal: Tahfidz Anak/Dewasa, Reguler, Beasiswa) sesuai dengan keinginan.',
        color: 'white',
        icon: PilihFormulirIcon
    },

    // Detail Formulir
    {
        nomor: 4,
        judul: 'Isi Formulir Pendaftaran',
        deskripsi: 'Isi data pendaftaran: 1. Data Santri (NIK, Nama, dll), 2. Alamat Domisili & Pilihan Cabang, 3. Data Orang Tua/Wali, 4. Upload Berkas Wajib (KK, Ijazah, Pas Foto, Surat Kesehatan).',
        color: 'white',
        icon: MelengkapiDataIcon
    },
    {
        nomor: 5,
        judul: 'Upload Berkas',
        deskripsi: 'Pastikan dokumen dalam format digital (JPG/PDF, Maks 2MB): Kartu Keluarga, Ijazah Terakhir, Pas Foto, dan Surat Keterangan (Sehat/Baik) sudah siap diunggah.',
        color: 'orange',
        icon: MengunggahBerkasIcon
    },

    {
        nomor: 6,
        judul: 'Pembayaran Formulir',
        deskripsi: 'Lakukan pembayaran biaya pendaftaran melalui sistem otomatis (Virtual Account/QRIS) yang muncul setelah pengisian formulir. Status akan lunas otomatis.',
        color: 'white',
        icon: MelunasiTagihanIcon
    },

    {
        nomor: 7,
        judul: 'Cetak Kartu Ujian',
        deskripsi: 'Setelah pembayaran lunas, menu "Kartu Ujian" akan terbuka. Download dan Cetak Kartu Ujian untuk dibawa saat pelaksanaan tes seleksi.',
        color: 'white',
        icon: CetakKartuIcon
    },
    {
        nomor: 8,
        judul: 'Tes Seleksi & Pengumuman',
        deskripsi: 'Ikuti tes sesuai jadwal. Hasil kelulusan dapat dipantau langsung melalui menu "Status Pendaftaran" di Dashboard akun Anda.',
        color: 'orange',
        icon: MenungguPengumumanIcon
    },
    {
        nomor: 9,
        judul: 'Daftar Ulang',
        deskripsi: 'Santri yang Lulus wajib melakukan Daftar Ulang dengan melunasi Biaya Masuk & SPP bulan pertama agar resmi diterima sebagai santri baru.',
        color: 'white',
        icon: RegistrasiUlangIcon
    },
];

export default function PanduanPendaftaran({ auth }) {
    return (
        // 1. Tambahkan heroTheme="dark" agar teks navbar awal berwarna putih
        <AppLayout auth={auth} heroTheme="dark">
            <Head title="Panduan Pendaftaran" />

            {/* 2. PERBAIKAN CSS LAYOUT:
                - mt-[-80px]: Menarik background ke atas agar berada di belakang Navbar
                - pb-20: Padding bawah
                - overflow-hidden: Mencegah scrollbar horizontal yang tidak perlu
            */}
            <div
                className="relative bg-gray-800 pb-20 mt-[-80px] overflow-hidden"
                style={{
                    backgroundImage: "url('/images/rtq.jpg')",
                    backgroundSize: 'cover',
                    backgroundAttachment: 'fixed',
                    backgroundPosition: 'center'
                }}
            >
                {/* Overlay Gelap */}
                <div className="absolute inset-0 bg-black/70"></div>

                {/* 3. Tambahkan pt-32 agar Judul tidak tertutup Navbar */}
                <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-32">
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-white text-center mb-16">
                        Panduan Pendaftaran
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                        {langkahData.map((langkah, index) => (
                            <div key={index} className="h-full">
                                <PanduanCard langkah={langkah} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="pb-10"></div> {/* Spacer tambahan untuk footer */}
        </AppLayout>
    );
}