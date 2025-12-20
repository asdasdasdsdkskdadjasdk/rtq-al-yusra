import { Link, usePage } from '@inertiajs/react'; // 1. Tambahkan usePage

// === Kumpulan Ikon untuk Sidebar (TETAP SAMA) ===
const DashboardIcon = () => <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const PendaftaranIcon = () => <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>;
const StatusLulusIcon = () => <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const PengaturanJadwalIcon = () => <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const KeuanganIcon = () => <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>;
const BeritaIcon = () => <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3h4m-4 16v4m-4-16v4" /></svg>;
const TestimoniIcon = () => <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>;
// --- TAMBAHAN IKON PROGRAM ---
const ProgramIcon = () => <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
// ... ikon lainnya ...
const SppIcon = () => <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const MoneyIcon = () => <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

// === Komponen NavLink (TETAP SAMA) ===
const NavLink = ({ href, active, children }) => (
    <Link
        href={href}
        className={`flex items-center px-4 py-3 my-1 rounded-lg transition-colors duration-200 ${ active ? 'bg-alyusra-orange text-white' : 'text-gray-600 hover:bg-gray-200' }`}
    >
        {children}
    </Link>
);

// === DATASTRUKTUR MENU (TETAP SAMA) ===
const navigationMenu = {
    PSB: [ 
        { name: 'Dashboard', href: route('dashboard'), icon: DashboardIcon, current: 'dashboard' }, // Typo 'Dasboard' diperbaiki jadi 'Dashboard'
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
        { name: 'Laporan Keuangan', href: route('admin.keuangan.index'), icon: KeuanganIcon, current: 'admin.keuangan.*' },
    ],
    
    wali_santri: [
        { name: 'Dashboard', href: route('dashboard'), icon: DashboardIcon, current: 'dashboard' },
        { name: 'Lihat Status Anak', href: '#', icon: StatusLulusIcon, current: 'status' },
        // --- TAMBAHAN MENU SPP ---
        { name: 'Pembayaran SPP', href: route('spp.index'), icon: SppIcon, current: 'spp.*' },
    ],
};

// === COMPONENT UTAMA (PERBAIKAN LOGIC PENGAMBILAN DATA) ===
// Kita hapus 'auth' dari props, biar layout ngambil sendiri dari usePage
export default function Authenticated({ children }) {
    
    // 2. AMBIL DATA GLOBAL PAKE USEPAGE (SOLUSI FIX)
    const { auth } = usePage().props;
    
    // Safety check: jika auth.user kosong (misal logout), pakai object kosong biar gak crash
    const user = auth?.user || { name: 'Guest', role: 'wali_santri' };
    const userRole = user.role ?? 'wali_santri';
    
    const navLinks = navigationMenu[userRole] || [];

    return (
        <div className="min-h-screen flex bg-gray-100">
            <aside className="w-64 bg-white shadow-lg flex flex-col">
                <div className="flex flex-col items-center p-6 border-b">
                    <img src="/images/logo.png" alt="Logo" className="w-24 h-24 mb-4" />
                    {/* Menggunakan variabel 'user' lokal */}
                    <h4 className="font-bold text-lg text-alyusra-dark-blue">{user.name}</h4>
                    <p className="text-sm text-gray-500 capitalize">{userRole.replace('_', ' ')}</p>
                </div>

                <nav className="flex-grow px-4 py-6">
                    {navLinks.map((item) => (
                        <NavLink key={item.name} href={item.href} active={route().current(item.current)}>
                            <item.icon />
                            <span>{item.name}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t">
                    <Link
                        href={route('logout')}
                        method="post"  
                        as="button"    
                        className="w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors duration-200"
                    >
                        <span>Logout</span>
                    </Link>
                </div>
            </aside>
            
            <div className="flex-1 flex flex-col">
                <main className="flex-1 p-6 lg:p-10">{children}</main>
                <footer className="text-center py-4 text-sm text-gray-500">
                    Powered by RTQ Al-Yusra &copy; {new Date().getFullYear()} 1KANASEM
                </footer>
            </div>
        </div>
    );
}