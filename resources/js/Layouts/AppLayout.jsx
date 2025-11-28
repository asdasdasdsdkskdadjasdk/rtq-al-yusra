// resources/js/Layouts/AppLayout.jsx

import Navbar from "@/Components/Page/Navbar";
import Footer from "@/Components/Page/Footer";

// 1. Terima 'heroTheme', beri default 'light'. Ini sudah benar.
export default function AppLayout({ auth, children, heroTheme = 'light' }) {
    return (
        <div className="bg-gray-50 text-gray-800 bg-dots-pattern bg-dots-size bg-repeat">
            
            {/* 2. PERBAIKAN:
              Hapus 'className="absolute top-0 left-0 right-0 z-50"'
              Biarkan Navbar (yang 'sticky') mengatur posisinya sendiri.
            */}
            <Navbar 
                auth={auth} 
                heroTheme={heroTheme  = 'dark'} // Teruskan prop ini ke Navbar
            />

            {/* 3. 'children' di sini sudah benar. */}
            {children}
            
            <Footer />
        </div>
    );
}