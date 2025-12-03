// resources/js/Pages/PanduanPendaftaran.jsx

import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

// PENTING: Import semua ikon satu per satu
import PanduanCard, {
    BuatAkunIcon, 
    VerifikasiAkunIcon, 
    PilihFormulirIcon, 
    MelunasiTagihanIcon,
    MelengkapiDataIcon, 
    MengunggahBerkasIcon, 
    ProsesSeleksiIcon, 
    MenungguPengumumanIcon, 
    RegistrasiUlangIcon
} from '@/Components/Page/Panduan/PanduanCard';

// PERBAIKAN URUTAN DATA:
// Melunasi Tagihan dipindah ke posisi setelah Mengunggah Berkas
const langkahData = [
    { nomor: 1, judul: 'Buat Akun', deskripsi: 'Untuk mendaftar sebagai calon Santri baru...', color: 'white', icon: BuatAkunIcon },
    { nomor: 2, judul: 'Verifikasi Akun', deskripsi: 'Saat proses pembuatan akun...', color: 'orange', icon: VerifikasiAkunIcon },
    { nomor: 3, judul: 'Pilih Formulir', deskripsi: 'Setelah memiliki akun...', color: 'white', icon: PilihFormulirIcon },
    
    // Geser Melengkapi Data & Berkas ke atas
    { nomor: 4, judul: 'Melengkapi Data Yang Dibutuhkan', deskripsi: 'Pendaftar akan diminta...', color: 'white', icon: MelengkapiDataIcon },
    { nomor: 5, judul: 'Mengunggah Berkas Persyaratan', deskripsi: 'Jika proses pendaftaran...', color: 'orange', icon: MengunggahBerkasIcon },
    
    // Tagihan dipindah ke sini (Nomor 6)
    { nomor: 6, judul: 'Melunasi Tagihan Formulir', deskripsi: 'Setelah memilih formulir...', color: 'white', icon: MelunasiTagihanIcon },
    
    { nomor: 7, judul: 'Proses Seleksi', deskripsi: 'Setelah pendaftar melengkapi...', color: 'white', icon: ProsesSeleksiIcon },
    { nomor: 8, judul: 'Menunggu Pengumuman', deskripsi: 'Hasil seleksi akan diumumkan...', color: 'orange', icon: MenungguPengumumanIcon },
    { nomor: 9, judul: 'Registrasi Ulang', deskripsi: 'Pendaftar yang dinyatakan lulus...', color: 'white', icon: RegistrasiUlangIcon },
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