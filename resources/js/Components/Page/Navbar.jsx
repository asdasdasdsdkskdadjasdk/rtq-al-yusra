import { useState, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react'; // Tambahkan usePage
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

// --- 1. KOMPONEN DROPDOWN (TETAP SAMA) ---
const NavItemWithDropdown = ({ item, auth, isScrolled, initialTextColor }) => { 
    const [isOpen, setIsOpen] = useState(false);
    const timeoutRef = useRef(null); 

    const handleMouseEnter = () => {
        clearTimeout(timeoutRef.current); 
        setIsOpen(true);
    };
    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 200); 
    };

    const visibleSubmenus = item.submenu?.filter(sub => !sub.authOnly || (sub.authOnly && auth?.user)) || [];
    if (visibleSubmenus.length === 0 && item.authOnly && !auth?.user && item.submenu) { return null; }

    return (
        <div 
            className="relative" 
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave} 
        >
            <button 
                className={`font-medium transition hover:text-alyusra-orange inline-flex items-center ${item.href ? '' : 'cursor-default'} ${
                    isScrolled ? 'text-gray-700' : initialTextColor 
                }`}
                onClick={(e) => { if (!item.href) e.preventDefault(); }} 
            >
                {item.text}
                {visibleSubmenus.length > 0 && ( 
                    <svg className={`w-4 h-4 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''} ${
                        isScrolled ? 'text-gray-700' : initialTextColor
                    }`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg> 
                )}
            </button>
            
            {/* Dropdown Menu */}
            {isOpen && visibleSubmenus.length > 0 && (
                <div 
                    className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-[60] ring-1 ring-black ring-opacity-5"
                    onMouseEnter={handleMouseEnter} 
                    onMouseLeave={handleMouseLeave} 
                >
                    <div className="py-1">
                        {visibleSubmenus.map((subItem) => (
                            <Link 
                                key={subItem.text} 
                                href={subItem.href} 
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-alyusra-orange" 
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

// --- 2. KOMPONEN UTAMA NAVBAR ---
export default function Navbar({ heroTheme }) { // Hapus 'auth' dari props sini, kita ambil dari usePage
    
    // 1. AMBIL DATA DARI GLOBAL PROPS (Agar konsisten di semua halaman)
    const { auth } = usePage().props; 
    
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false); 
    const { scrollY } = useScroll();

    // Setup Tampilan
    const initialTextColor = heroTheme === 'light' ? 'text-gray-700' : 'text-white';
    const initialLogo = '/images/logo6.png'; // Sesuaikan path logo Anda
    const scrolledLogo = '/images/logo6.png'; 

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0; 
        if (latest > 10) { setIsScrolled(true); } 
        else { setIsScrolled(false); }
        if (latest > previous && latest > 100) { setHidden(true); } 
        else if (latest < previous) { setHidden(false); }
    });

    // ==========================================
    // LOGIKA PENAMBAHAN MENU
    // ==========================================
    
    // Cek apakah data pendaftar tersedia di user object
    const pendaftar = auth?.user?.pendaftar;
    
    // 1. Menu Dasar (Selalu Ada)
    const baseLinks = [
        { href: route('home'), text: 'Beranda' },
        { 
            text: 'Pendaftaran', 
            submenu: [ 
                { href: route('pendaftaran'), text: 'Formulir' }, 
                { href: route('jadwal'), text: 'Jadwal' }, 
                { href: route('biaya.pendidikan'), text: 'Biaya' }, 
            ] 
        },
    ];

    // 2. Menu Tambahan (Jika User Login)
    let statusLink = null;
    
    if (auth?.user) {
        if (pendaftar) {
            // Jika data pendaftar ada, cek status pembayaran
            if (pendaftar.status_pembayaran !== 'Lunas') {
                statusLink = { 
                    href: route('pembayaran.show', pendaftar.id), 
                    text: 'Bayar Tagihan',
                    customColor: 'text-yellow-400 font-bold hover:text-yellow-300' // Opsional: Beri highlight
                };
            } else {
                statusLink = { 
                    href: route('status.cek'), 
                    text: 'Status Saya',
                };
            }
        } else {
            // FALLBACK PENTING:
            // Jika user login TAPI data pendaftar tidak terbawa (misal di halaman Kontak),
            // Default arahkan ke "Status Saya". Biar sistem di halaman itu yang redirect kalau belum daftar.
            // Atau tampilkan menu "Daftar Baru" jika Anda mau. Di sini saya default ke Status.
            statusLink = {
                href: route('status.cek'),
                text: 'Status Saya'
            };
        }
    }

    // 3. Gabungkan Semua Menu
    const navLinks = [
        ...baseLinks, 
        ...(statusLink ? [statusLink] : []), 
        { href: route('berita.index'), text: 'Berita' },
        // Menu Cek Kelulusan hanya muncul jika BELUM login (karena kalau login bisa lihat di Status Saya)
        // Atau biarkan saja jika memang ingin selalu ada.
        { href: route('kelulusan.index'), text: 'Cek Kelulusan', authOnly: false }, 
        { href: route('kontak'), text: 'Kontak Kami' },
    ];

    return (
        <motion.header
            variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
            animate={hidden ? "hidden" : "visible"} 
            transition={{ duration: 0.35, ease: "easeInOut" }} 
            className={`sticky top-0 z-50 transition-colors duration-300 ${
                isScrolled 
                ? 'bg-white/95 backdrop-blur-sm shadow-md' 
                : 'bg-transparent shadow-none' 
            }`} 
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">

                    {/* Logo */}
                    <div className="flex-shrink-0 ">
                        <Link href="/">
                            <div className="w-32 h-128 flex items-center justify-center"> 
                                <img 
                                    className="h-10 w-auto bg-white rounded-lg p-1" 
                                    src={isScrolled ? scrolledLogo : initialLogo} 
                                    alt="Logo RTQ Al-Yusra" 
                                />
                            </div>
                        </Link>
                    </div>

                    {/* --- NAVIGATION LINKS (DESKTOP) --- */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            link.submenu ? (
                                <NavItemWithDropdown 
                                    key={link.text} 
                                    item={link} 
                                    auth={auth} 
                                    isScrolled={isScrolled}
                                    initialTextColor={initialTextColor} 
                                />
                            ) : (
                                (!link.authOnly || (link.authOnly && auth?.user)) && (
                                <Link 
                                    key={link.text} 
                                    href={link.href} 
                                    className={`font-medium transition hover:text-alyusra-orange ${
                                        link.customColor 
                                            ? link.customColor 
                                            : (isScrolled ? 'text-gray-700' : initialTextColor)
                                    }`}
                                >
                                    {link.text}
                                </Link>
                                )
                            )
                        ))}
                    </nav>

                    {/* Auth Buttons (Desktop) */}
                    <div className="hidden md:flex items-center space-x-4">
                        {auth && auth.user ? (
                            <>
                                <span className={`font-semibold transition ${
                                    isScrolled ? 'text-gray-700' : initialTextColor 
                                }`}>{auth.user.name.split(' ')[0]}</span> {/* Ambil nama depan saja biar rapi */}

                                <Link 
                                    href={route('logout')} 
                                    method="post" 
                                    as="button" 
                                    className="bg-red-600 text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-red-700 transition"
                                >
                                    Logout
                                </Link>
                            </>
                        ) : (
                            <Link 
                                href={route('login')} 
                                className="bg-alyusra-orange text-white px-6 py-2 rounded-md font-semibold hover:bg-opacity-90 transition"
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`transition hover:text-alyusra-orange ${
                            isScrolled ? 'text-gray-700' : initialTextColor
                        }`}>
                            {isMobileMenuOpen ? (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            ) : (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                            )}
                        </button>
                    </div>

                </div>
            </div>

            {/* --- MOBILE MENU DROPDOWN --- */}
            <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden border-t ${isScrolled ? 'border-gray-200' : 'border-transparent'}`}> 
                <div className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 ${isScrolled ? 'bg-white/95 backdrop-blur-sm' : 'bg-gray-800/95 backdrop-blur-sm'}`}>
                    {navLinks.map((link) => (
                        (!link.authOnly || (link.authOnly && auth?.user)) && (
                            link.submenu ? (
                                // Render Submenu Mobile
                                <div key={link.text}>
                                    <span className={`block px-3 py-2 rounded-md text-base font-bold ${isScrolled ? 'text-gray-400' : 'text-gray-300'}`}>
                                        {link.text}
                                    </span>
                                    {link.submenu.map((sub) => (
                                        <Link
                                            key={sub.text}
                                            href={sub.href}
                                            className={`block pl-6 px-3 py-2 rounded-md text-base font-medium hover:text-alyusra-orange transition ${
                                                isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
                                            }`}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {sub.text}
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                // Render Link Biasa Mobile
                                <Link
                                    key={link.text}
                                    href={link.href || '#'} 
                                    className={`block px-3 py-2 rounded-md text-base font-medium hover:text-alyusra-orange transition ${
                                        link.customColor
                                            ? link.customColor
                                            : (isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10')
                                    }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.text}
                                </Link>
                            )
                        )
                    ))}
               </div>

                {/* Tombol Auth Mobile */}
                <div className={`pt-4 pb-3 border-t ${isScrolled ? 'border-gray-200' : 'border-white/20'} px-5 ${isScrolled ? 'bg-white/95 backdrop-blur-sm' : 'bg-gray-800/95 backdrop-blur-sm'}`}>
                    {auth && auth.user ? (
                        <div className="flex items-center justify-between">
                            <span className={`font-semibold ${isScrolled ? 'text-gray-700' : 'text-white'}`}>{auth.user.name}</span>
                            <Link 
                                href={route('logout')} 
                                method="post" 
                                as="button" 
                                className="bg-red-600 text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-red-700 transition"
                            >
                                Logout
                            </Link>
                        </div>
                    ) : (
                        <Link 
                            href={route('login')} 
                            className="bg-alyusra-orange text-white px-6 py-2 rounded-md font-semibold hover:bg-opacity-90 transition block w-full text-center"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </motion.header> 
    );
}