// resources/js/Components/Page/Pendaftaran/ProgramCard.jsx

import { Link } from '@inertiajs/react';
// Import motion dari Framer Motion
import { motion } from 'framer-motion';

// SVG Icon untuk checkmark (tetap sama)
const CheckIcon = () => (
    <svg className="w-5 h-5 text-white flex-shrink-0 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

// PERBAIKAN UTAMA: HANYA menerima props 'auth', 'onRegisterClick', dan 'style'
export default function ProgramCard({ program, auth, onRegisterClick, style = {} }) {
    const isFeatured = program.featured;
    const cardBaseClasses = "rounded-2xl shadow-lg p-8 text-white flex flex-col transition-all duration-300";
    const featuredClasses = isFeatured ? "transform lg:scale-110 z-20" : "z-10";

    // Pastikan warna kartu diaplikasikan di sini
    const cardStyle = {
        backgroundColor: program.color,
        ...style // Menggabungkan style (yaitu animationDelay)
    };

    return (
        // motion.div sekarang TIDAK menerima prop className dari luar, hanya style
        <motion.div 
            className={`${cardBaseClasses} ${featuredClasses}`} 
            style={cardStyle} // Menggunakan objek style gabungan
            
            // Definisikan animasi Framer Motion
            initial={{ opacity: 0, y: 30 }} // Posisi awal (lebih kecil dari 50 untuk lebih halus)
            animate={{ opacity: 1, y: 0 }}  // Posisi akhir
            transition={{ duration: 0.6, ease: "easeOut" }} // Durasi sedikit diperpanjang
        >
            <div className="flex-grow">
                <p className="font-semibold">{program.jenis}</p>
                <h3 className="text-3xl font-extrabold mt-1 mb-4">{program.nama}</h3>
                <p className="text-sm opacity-90">Batas Pendaftaran : {program.batas_pendaftaran}</p>
                <p className="text-sm opacity-90">{program.tes}</p>
                <div className="border-t border-white/20 my-6"></div>
                <h4 className="font-bold mb-3">Detail Formulir</h4>
                <ul className="space-y-3 text-sm">
                    {program.details.map((detail, index) => (
                        <li key={index} className="flex items-start">
                            <CheckIcon />
                            <span>{detail}</span>
                        </li>
                    ))}
                </ul>
            </div>
            
            <div className="mt-8">
                <p className="font-bold text-lg">Biaya : {program.biaya}</p>
                
                <Link
                    href={auth?.user ? route('formulir.create', { program_slug: program.slug }) : '#'}
                    onClick={(e) => {
                        if (!auth?.user) {
                            e.preventDefault(); 
                            onRegisterClick();  
                        }
                    }}
                    className="mt-4 block w-full text-center bg-white text-alyusra-dark-blue font-bold py-3 rounded-lg hover:bg-gray-200 transition"
                >
                    Daftar
                </Link>
            </div>
        </motion.div>
    );
}