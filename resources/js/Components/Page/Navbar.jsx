// resources/js/Components/Page/Navbar.jsx

import { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

// --- Komponen Dropdown (Versi Hover dengan Delay) ---
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
            
            {/* Dropdown (Sudah benar, link di dalam selalu gelap) */}
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
// --- Akhir Komponen Dropdown ---


export default function Navbar({ auth, heroTheme}) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false); 
    const { scrollY } = useScroll();

    // Tentukan warna teks awal berdasarkan heroTheme
    const initialTextColor = heroTheme === 'light' ? 'text-gray-700' : 'text-white';
    
    // Tentukan logo awal berdasarkan heroTheme
    const initialLogo = heroTheme === 'light' ? '/images/logo6.png' : '/images/logo6.png'; // Ganti path logo Anda
    // Logo saat di-scroll (selalu gelap)
    const scrolledLogo = '/images/logo6.png'; // Ganti path logo Anda

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0; 
        if (latest > 10) { setIsScrolled(true); } 
        else { setIsScrolled(false); }
        if (latest > previous && latest > 100) { setHidden(true); } 
        else if (latest < previous) { setHidden(false); }
    });

    // Struktur Navigasi
    const navLinks = [
        { href: route('home'), text: 'Beranda' },
        { text: 'Pendaftaran', submenu: [ { href: route('pendaftaran'), text: 'Formulir' }, { href: route('jadwal'), text: 'Jadwal' }, { href: route('biaya.pendidikan'), text: 'Biaya' }, ] },
        { href: route('berita.index'), text: 'Berita' },
        { href: route('kelulusan.index'), text: 'Cek Kelulusan', authOnly: true },
        { href: route('kontak'), text: 'Kontak kami' },
    ];

    return (
        <motion.header
            variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
            animate={hidden ? "hidden" : "visible"} 
            transition={{ duration: 0.35, ease: "easeInOut" }} 

            className={`sticky top-0 z-50 transition-colors duration-300 ${
                isScrolled 
                ? 'bg-white/80 backdrop-blur-sm shadow-md' 
                : 'bg-transparent shadow-none' 
            }`} 
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">

                    {/* Logo dinamis */}
                    <div className="flex-shrink-0 ">
                        <Link href="/">
                            <div className=" w-32 h-128 flex items-center justify-center"> 
                                <img 
className="h-10 w-auto bg-white rounded-lg" // Class diatur untuk logo
                                    src={isScrolled ? scrolledLogo : initialLogo} 
                                    alt="Logo RTQ Al-Yusra" 
                                />
                            </div>
                        </Link>
                    </div>

                    {/* Navigation Links (Desktop) */}
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
                                        isScrolled ? 'text-gray-700' : initialTextColor 
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
    {auth && auth.user ? (
        <>
            {/* 1. NAMA USER */}
            <span className={`font-semibold transition ${
                isScrolled ? 'text-gray-700' : initialTextColor 
            }`}>{auth.user.name}</span>

            

            {/* 3. LOGOUT BUTTON */}
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
        <>
           

            {/* 2. LOGIN BUTTON */}
            <Link 
                href={route('login')} 
                className="bg-alyusra-orange text-white px-6 py-2 rounded-md font-semibold hover:bg-opacity-90 transition"
            >
                Login
            </Link>
        </>
    )}
</div>


                    <div className="md:hidden">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`transition hover:text-alyusra-orange ${
                            isScrolled ? 'text-gray-700' : initialTextColor
                        }`}>
                            {isMobileMenuOpen ? (
                                // Ikon "X" (tutup)
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            ) : (
                                // Ikon "Hamburger" (buka)
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                            )}
                        </button>
                    </div>

                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden border-t ${isScrolled ? 'border-gray-200' : 'border-transparent'}`}> 
                {/* Tentukan background mobile menu berdasarkan 'isScrolled' */}
                <div className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 ${isScrolled ? 'bg-white/95 backdrop-blur-sm' : 'bg-alyusra-dark-blue/90 backdrop-blur-sm'}`}>
                    {navLinks.map((link) => (
                        (!link.authOnly || (link.authOnly && auth?.user)) && (
                            <Link
                                key={link.text}
                                href={link.href || '#'} 
                                className={`block px-3 py-2 rounded-md text-base font-medium hover:text-alyusra-orange transition ${
                                    isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10' 
                                }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.text}
                            </Link>
                        )
                    ))}
               </div>


{/* Tombol Auth Mobile */}
<div className={`pt-4 pb-3 border-t ${isScrolled ? 'border-gray-200' : 'border-white/20'} px-5 ${isScrolled ? 'bg-white/95 backdrop-blur-sm' : 'bg-alyusra-dark-blue/90 backdrop-blur-sm'}`}>
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
        <>
            {/* Login Button Mobile */}
            <Link 
                href={route('login')} 
                className="bg-alyusra-orange text-white px-6 py-2 rounded-md font-semibold hover:bg-opacity-90 transition block w-full text-center"
            >
                Login
            </Link>
            
        </>
    )}
</div>

            </div>
        </motion.header> 
    );
}