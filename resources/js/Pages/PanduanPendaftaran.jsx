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

const langkahData = [
    { nomor: 1, judul: 'Buat Akun', deskripsi: 'Untuk mendaftar sebagai calon Santri baru...', color: 'white', icon: BuatAkunIcon },
    { nomor: 2, judul: 'Verifikasi Akun', deskripsi: 'Saat proses pembuatan akun...', color: 'orange', icon: VerifikasiAkunIcon },
    { nomor: 3, judul: 'Pilih Formulir', deskripsi: 'Setelah memiliki akun...', color: 'white', icon: PilihFormulirIcon },
    { nomor: 4, judul: 'Melunasi Tagihan Formulir', deskripsi: 'Setelah memilih formulir...', color: 'white', icon: MelunasiTagihanIcon },
    { nomor: 5, judul: 'Melengkapi Data Yang Dibutuhkan', deskripsi: 'Pendaftar akan diminta...', color: 'orange', icon: MelengkapiDataIcon },
    { nomor: 6, judul: 'Mengunggah Berkas Persyaratan', deskripsi: 'Jika proses pendaftaran...', color: 'white', icon: MengunggahBerkasIcon },
    { nomor: 7, judul: 'Proses Seleksi', deskripsi: 'Setelah pendaftar melengkapi...', color: 'white', icon: ProsesSeleksiIcon },
    { nomor: 8, judul: 'Menunggu Pengumuman', deskripsi: 'Hasil seleksi akan diumumkan...', color: 'orange', icon: MenungguPengumumanIcon },
    { nomor: 9, judul: 'Registrasi Ulang', deskripsi: 'Pendaftar yang dinyatakan lulus...', color: 'white', icon: RegistrasiUlangIcon },
];

export default function PanduanPendaftaran({ auth }) {
    return (
        <AppLayout auth={auth}>
            <Head title="Panduan Pendaftaran" />

            <div className="relative bg-gray-800 py-20" style={{ backgroundImage: "url('/images/rtq.jpg')", backgroundSize: 'cover', backgroundAttachment: 'fixed', backgroundPosition: 'center' }}>
                <div className="absolute inset-0 bg-black/70"></div>
                
                <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
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
        </AppLayout>
    );
}