// resources/js/Components/Page/Navbar.jsx

import { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

// --- Komponen Dropdown (Versi Hover dengan Delay) ---
const NavItemWithDropdown = ({ item, auth, isScrolled }) => { 
    const [isOpen, setIsOpen] = useState(false);
    const timeoutRef = useRef(null); // Ref untuk menyimpan ID timeout

    // Fungsi untuk membuka dropdown
    const handleMouseEnter = () => {
        clearTimeout(timeoutRef.current); // Batalkan penutupan jika ada
        setIsOpen(true);
    };

    // Fungsi untuk menutup dropdown dengan delay
    const handleMouseLeave = () => {
        // Set timeout untuk menutup setelah 200ms
        timeoutRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 200); // Anda bisa sesuaikan delay ini (dalam milidetik)
    };

    const visibleSubmenus = item.submenu?.filter(sub => !sub.authOnly || (sub.authOnly && auth?.user)) || [];

    if (visibleSubmenus.length === 0 && item.authOnly && !auth?.user && item.submenu) { return null; }

    return (
        // Terapkan handler ke div terluar
        <div 
            className="relative" 
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave} 
        >
            {/* Tombol (tidak perlu event handler hover lagi di sini) */}
            <button 
                className={`font-medium transition hover:text-alyusra-orange inline-flex items-center ${item.href ? '' : 'cursor-default'} ${
                    isScrolled ? 'text-gray-700' : 'text-white' 
                }`}
                // Cegah aksi default jika tidak ada link
                onClick={(e) => { if (!item.href) e.preventDefault(); }} 
            >
                {item.text}
                {/* Ikon panah */}
                {visibleSubmenus.length > 0 && ( <svg className={`w-4 h-4 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''} ${isScrolled ? 'text-gray-700' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg> )}
            </button>
            
            {/* Dropdown menu */}
            {/* Pastikan dropdown menu juga membatalkan penutupan saat di-hover */}
            {isOpen && visibleSubmenus.length > 0 && (
                <div 
                    className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-[60] ring-1 ring-black ring-opacity-5"
                    onMouseEnter={handleMouseEnter} // Batalkan penutupan saat hover di dropdown
                    onMouseLeave={handleMouseLeave} // Mulai timer tutup saat keluar dropdown
                >
                    <div className="py-1">
                        {visibleSubmenus.map((subItem) => (
                            <Link 
                                key={subItem.text} 
                                href={subItem.href} 
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-alyusra-orange" 
                                // onClick={() => setIsOpen(false)} // Opsional: tutup saat item diklik
                            >
                                {subItem.text}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
// --- Akhir Komponen Dropdown ---
// --- Akhir Komponen Dropdown ---


export default function Navbar({ auth }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // --- LOGIKA SCROLL (Tetap Sama) ---
    const [hidden, setHidden] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false); 
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0; 
        
        if (latest > 10) {
            setIsScrolled(true);
        } else {
            setIsScrolled(false);
        }

        if (latest > previous && latest > 100) { 
            setHidden(true); 
        } 
        else if (latest < previous) {
            setHidden(false);
        }
    });
    // --- AKHIR LOGIKA SCROLL ---

    // Struktur Navigasi (Tetap Sama)
    const navLinks = [
        { href: route('home'), text: 'Beranda' },
        { text: 'Profil', submenu: [ { href: '#', text: 'Sejarah' }, { href: '#', text: 'Visi Misi' }, { href: '#', text: 'Struktur Organisasi' }, ] },
        { text: 'Pendaftaran', submenu: [ { href: route('pendaftaran'), text: 'Alur Pendaftaran' }, { href: route('jadwal'), text: 'Jadwal' }, { href: route('biaya.pendidikan'), text: 'Biaya' }, ] },
        { href: route('berita.index'), text: 'Berita' },
        { href: route('kelulusan.index'), text: 'Cek Kelulusan', authOnly: true },
    ];

    return (
        <motion.header
            variants={{
                visible: { y: 0 },   
                hidden: { y: "-100%" } 
            }}
            animate={hidden ? "hidden" : "visible"} 
            transition={{ duration: 0.35, ease: "easeInOut" }} 

            // Styling Kondisional (Tetap Sama)
            className={`sticky top-0 z-50 transition-colors duration-300 ${
                isScrolled 
                ? 'bg-white/80 backdrop-blur-sm shadow-md' 
                : 'bg-transparent shadow-none' 
            }`} 
        >
            {/* Konten header */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">

 <div className="flex-shrink-0">
     <Link href="/">
         <div className=" w-32 h-128 flex items-center justify-center"> 
             {/* Gambar logo diperbesar */}
             <img className="h-14 w-auto" src="/images/logo6.png" alt="Logo RTQ Al-Yusra" />
         </div>
     </Link>
 </div>

                    {/* Navigation Links (Desktop) */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            link.submenu ? (
                                // 3. PASTIKAN isScrolled DIKIRIM KE SINI
                                <NavItemWithDropdown 
                                    key={link.text} 
                                    item={link} 
                                    auth={auth} 
                                    isScrolled={isScrolled} // <-- Prop dikirim
                                />
                            ) : (
                                (!link.authOnly || (link.authOnly && auth?.user)) && (
                                 <Link 
                                    key={link.text} 
                                    href={link.href} 
                                    // Warna link biasa (sudah benar)
                                    className={`font-medium transition hover:text-alyusra-orange ${
                                        isScrolled ? 'text-gray-700' : 'text-white' 
                                    }`}
                                >
                                    {link.text}
                                </Link>
                                )
                            )
                        ))}
                    </nav>

                    {/* Auth Buttons & Kontak (Desktop) */}
                    <div className="hidden md:flex items-center space-x-4">

                        <Link href="#" className="bg-alyusra-green text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-opacity-90 transition">
                            Kontak Kami
                        </Link>
                         {/* Nama User (perlu warna kondisional juga) */}
                        {auth && auth.user ? (
                            <>
                                <span className={`font-semibold transition ${
                                    isScrolled ? 'text-gray-700' : 'text-white' 
                                }`}>{auth.user.name}</span>
                                <Link href={route('logout')} method="post" as="button" className="bg-red-600 text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-red-700 transition">Logout</Link>
                            </>
                        ) : (
                            <Link href={route('login')} className="bg-alyusra-orange text-white px-6 py-2 rounded-md font-semibold hover:bg-opacity-90 transition">Login</Link>
                        )}
                        
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        {/* Tombol hamburger juga perlu warna kondisional */}
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`transition hover:text-alyusra-orange ${isScrolled ? 'text-gray-700' : 'text-white'}`}>
                            {isMobileMenuOpen ? (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            ) : (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown (Tambahkan warna kondisional pada link di dalamnya) */}
            <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden border-t ${isScrolled ? 'border-gray-200' : 'border-transparent'}`}> 
               <div className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 ${isScrolled ? 'bg-white/95 backdrop-blur-sm' : 'bg-alyusra-dark-blue/90 backdrop-blur-sm'}`}> {/* Background berbeda */}
                    {navLinks.map((link) => (
                         (!link.authOnly || (link.authOnly && auth?.user)) && (
                            <Link
                                key={link.text}
                                href={link.href || '#'} 
                                className={`block px-3 py-2 rounded-md text-base font-medium hover:text-alyusra-orange transition ${
                                    isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10' 
                                }`}
                                onClick={() => setIsMobileMenuOpen(false)} // Tutup menu saat link diklik
                            >
                                {link.text}
                                {/* Jika punya submenu, bisa tambahkan ikon atau logic accordion di sini */}
                            </Link>
                         )
                    ))}
               </div>
               {/* Tombol Auth Mobile */}
               <div className={`pt-4 pb-3 border-t ${isScrolled ? 'border-gray-200' : 'border-white/20'} px-5 ${isScrolled ? 'bg-white/95 backdrop-blur-sm' : 'bg-alyusra-dark-blue/90 backdrop-blur-sm'}`}>
                   {auth && auth.user ? (
                        <div className="flex items-center justify-between">
                            <span className={`font-semibold ${isScrolled ? 'text-gray-700' : 'text-white'}`}>{auth.user.name}</span>
                            <Link href={route('logout')} method="post" as="button" className="bg-red-600 text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-red-700 transition">Logout</Link>
                        </div>
                    ) : (
                        <Link href={route('login')} className="block w-full text-center bg-alyusra-orange text-white px-6 py-2 rounded-md font-semibold hover:bg-opacity-90 transition">Login</Link>
                    )}
                     <Link href="#" className="block w-full text-center mt-3 bg-alyusra-green text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-opacity-90 transition">
                        Kontak Kami
                    </Link>
               </div>
            </div>
            
        </motion.header> 
    );
}