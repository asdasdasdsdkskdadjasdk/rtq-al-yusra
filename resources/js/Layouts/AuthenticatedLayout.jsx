import React from 'react';
import { Link, usePage } from '@inertiajs/react';

// === KUMPULAN IKON ===
const DashboardIcon = () => <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const PendaftaranIcon = () => <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>;
const StatusLulusIcon = () => <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const PengaturanJadwalIcon = () => <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const KeuanganIcon = () => <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>;
const BeritaIcon = () => <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3h4m-4 16v4m-4-16v4" /></svg>;
const TestimoniIcon = () => <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>;
const ProgramIcon = () => <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const SppIcon = () => <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const MoneyIcon = () => <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const FormulirIcon = () => (
    <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);
// === KOMPONEN NAVLINK ===
const NavLink = ({ href, active, children }) => (
    <Link
        href={href}
        className={`flex items-center px-4 py-3 my-1 rounded-lg transition-colors duration-200 ${ active ? 'bg-alyusra-orange text-white' : 'text-gray-600 hover:bg-gray-200' }`}
    >
        {children}
    </Link>
);

// === DATA MENU NAVIGASI ===
const navigationMenu = {
    PSB: [ 
        { name: 'Dashboard', href: route('dashboard'), icon: DashboardIcon, current: 'dashboard' },
        { name: 'Data Pendaftar', href: route('psb.pendaftaran.index'), icon: PendaftaranIcon, current: 'psb.pendaftaran.index' },
        { name: 'Manajemen Program', href: route('admin.program.index'), icon: ProgramIcon, current: 'admin.program.*' },
        { name: 'Pengaturan Jadwal', href: route('admin.jadwal.index'), icon: PengaturanJadwalIcon, current: 'admin.jadwal.*' },
        { name: 'Biaya Pendidikan', href: route('admin.biaya.index'), icon: KeuanganIcon, current: 'admin.biaya.*' },
        { name: 'Berita & Info', href: route('admin.berita.index'), icon: BeritaIcon, current: 'admin.berita.*' },
        { name: 'Testimoni', href: route('admin.testimonial.index'), icon: TestimoniIcon, current: 'admin.testimonial.*' },
        { name: 'Setting', href: route('admin.settings.index'), icon: TestimoniIcon, current: 'admin.settings.*' },
    ],
    keuangan: [
        { name: 'Dashboard', href: route('dashboard'), icon: DashboardIcon, current: 'dashboard' },
        { name: 'Laporan Keuangan', href: route('admin.laporan.index'), icon: KeuanganIcon, current: 'admin.laporan.*' },
        { name: 'Uang Masuk Santri', href: route('admin.uang_masuk.index'), icon: MoneyIcon, current: 'admin.uang_masuk.*' },
        { name: 'SPP', href: route('admin.spp.index'), icon: SppIcon, current: 'admin.spp.*' },
        { name: 'Formulir', href: route('admin.keuangan.formulir.index'), icon: FormulirIcon, current: 'admin.keuangan.formulir.*' },
        
    ],
    // Hapus 'Pembayaran SPP' dari default list wali_santri
    // Kita akan tambahkan manual di bawah dengan pengecekan
    wali_santri: [
        { name: 'Dashboard', href: route('dashboard'), icon: DashboardIcon, current: 'dashboard' },
        { name: 'Lihat Status Anak', href: '#', icon: StatusLulusIcon, current: 'status' },
    ],
};

// === COMPONENT UTAMA ===
export default function Authenticated({ user, header, children }) {
    // 1. Ambil Props Auth dari usePage
    const { auth } = usePage().props;
    
    // 2. Safety Check User (Fallback jika props user tidak langsung dikirim)
    const currentUser = user || auth?.user || { name: 'Guest', role: 'wali_santri' };
    const userRole = currentUser.role ?? 'wali_santri';
    
    // 3. Ambil Status Lunas & Beasiswa dari Middleware
    const isLunas = auth?.is_uang_masuk_lunas; 
    const isBeasiswa = auth?.user?.is_beasiswa; // <--- INI PENTING

    // 4. Logic Menu Dinamis
    // Copy array menu agar tidak memodifikasi original object secara permanen
    let navLinks = navigationMenu[userRole] ? [...navigationMenu[userRole]] : [];

    // [LOGIC 1: MENU SPP]
    // Tampilkan menu SPP hanya jika BUKAN Beasiswa
    if (userRole === 'wali_santri' && !isBeasiswa) {
        navLinks.push({
            name: 'Pembayaran SPP', 
            href: route('spp.index'), 
            icon: SppIcon, 
            current: 'spp.*' 
        });
    }

    // [LOGIC 2: TAGIHAN UANG MASUK]
    // Tampilkan menu ini jika BELUM LUNAS
    if (userRole === 'wali_santri' && !isLunas) {
        navLinks.push({
            name: 'Tagihan Uang Masuk', 
            href: route('wali.uang-masuk.index'), 
            icon: MoneyIcon,
            current: 'wali.uang-masuk.*'
        });
    }

    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* --- SIDEBAR --- */}
            <aside className="w-64 bg-white shadow-lg flex flex-col hidden md:flex">
                <div className="flex flex-col items-center p-6 border-b">
                    {/* Ganti src dengan path logo Anda */}
                    <img src="/images/logo3.png" alt="Logo" className="w-20 h-20 mb-4 object-contain" />
                    <h4 className="font-bold text-lg text-center text-gray-800 leading-tight">{currentUser.name}</h4>
                    <div className="flex gap-1 mt-1">
                        <span className="px-3 py-1 text-xs text-white bg-green-600 rounded-full capitalize">
                            {userRole.replace('_', ' ')}
                        </span>
                        {/* Label Beasiswa (Opsional, agar terlihat keren) */}
                        {isBeasiswa && (
                            <span className="px-3 py-1 text-xs text-white bg-blue-500 rounded-full capitalize">
                                Beasiswa
                            </span>
                        )}
                    </div>
                </div>

                <nav className="flex-grow px-4 py-6 overflow-y-auto">
                    {navLinks.map((item) => (
                        <NavLink key={item.name} href={item.href} active={route().current(item.current)}>
                            <item.icon />
                            <span>{item.name}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t bg-gray-50">
                    <Link
                        href={route('logout')}
                        method="post"  
                        as="button"     
                        className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors duration-200 text-sm shadow"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Logout
                    </Link>
                </div>
            </aside>
            
            {/* --- MAIN CONTENT AREA --- */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                
                {/* Header Mobile & Desktop */}
                <header className="bg-white shadow px-6 py-4 flex justify-between items-center md:hidden">
                    <div className="font-bold text-lg">RTQ Al-Yusra</div>
                    <Link href={route('logout')} method="post" as="button" className="text-red-600 font-bold text-sm">Logout</Link>
                </header>

                {/* Page Header (Jika ada props header) */}
                {header && (
                    <header className="bg-white shadow border-b border-gray-200">
                        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6 lg:p-8">
                    {children}
                </main>

                <footer className="text-center py-4 text-sm text-gray-500 bg-white border-t">
                    &copy; {new Date().getFullYear()} RTQ Al-Yusra. All rights reserved.
                </footer>
            </div>
        </div>
    );
}