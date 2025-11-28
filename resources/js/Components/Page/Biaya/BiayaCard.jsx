// resources/js/Components/Page/Biaya/BiayaCard.jsx

import { Link } from '@inertiajs/react'; // Tambahkan Link jika digunakan di dalam Card
import { motion } from 'framer-motion'; // <<< IMPORT FRAMER MOTION

// Asumsi BiayaCard menerima props 'program'
// PERUBAHAN: Menerima prop 'style' untuk animationDelay
export default function BiayaCard({ program, style = {} }) { 
    const isFeatured = program.featured;
    
    // Kelas Dasar Card
    const cardBaseClasses = "rounded-2xl shadow-lg p-8 text-white flex flex-col transition-all duration-300 h-full";
    const featuredClasses = isFeatured ? "transform lg:scale-110 z-20" : "z-10";
    
    // Gabungkan warna background kustom dengan prop style
    const cardStyle = {
        backgroundColor: program.color,
        ...style // Menerapkan animationDelay dari luar
    };

    return (
        // Ganti div menjadi motion.div
        <motion.div 
            className={`${cardBaseClasses} ${featuredClasses}`}
            style={cardStyle}
            
            // Animasi Staggered: Slide Up dan Fade In
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }}  
            transition={{ duration: 0.6, ease: "easeOut" }} 
        >
            <div className="flex-grow">
                <p className="font-semibold">{program.jenis}</p>
                <h3 className="text-3xl font-extrabold mt-1 mb-4">{program.nama}</h3>
                
                <div className="border-t border-white/20 my-6"></div>
                
                <h4 className="font-bold text-xl mb-4">Rincian Biaya</h4>

                <ul className="space-y-4">
                    {program.items.map((item, index) => (
                        <li key={index} className="pb-3 border-b border-white/10">
                            <div className="flex justify-between items-center text-lg font-medium">
                                <span>{item.label}</span>
                                <span>{item.value}</span>
                            </div>
                            {item.note && (
                                <p className="text-xs opacity-70 mt-1">{item.note}</p>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            
            {/* Tombol pendaftaran/informasi (Asumsi Link Inertia jika ada) */}
            <div className="mt-8">
                 {/* Jika Anda memiliki tombol atau link, taruh di sini */}
            </div>
        </motion.div>
    );
}