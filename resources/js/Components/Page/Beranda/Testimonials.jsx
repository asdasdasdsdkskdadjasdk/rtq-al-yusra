// resources/js/Components/Page/Beranda/Testimonials.jsx

import { motion } from 'framer-motion'; // <-- 1. Import motion
import { useInView } from 'react-intersection-observer'; // <-- 2. Import useInView

// Ikon kutip (tidak perlu diubah)
const QuoteIcon = () => (
    <svg className="w-16 h-16 text-alyusra-orange opacity-20 mb-4" fill="currentColor" viewBox="0 0 32 32">
        <path d="M9.19,21.34c0-2.3,0.3-4.32,0.89-6.07c0.6-1.75,1.53-3.19,2.79-4.32C14.12,9.82,15.8,9.19,17.78,9.19 c-0.12,1.63-0.18,2.88-0.18,3.75c0,1.75,0.3,3.31,0.89,4.69c-1.5,1.25-3.06,2.69-4.69,4.32C12.44,23.19,10.94,24.38,9.19,25.56V21.34z M20.38,21.34c0-2.3,0.3-4.32,0.89-6.07c0.6-1.75,1.53-3.19,2.79-4.32c1.25-1.12,2.94-1.75,4.94-1.75c-0.12,1.63-0.18,2.88-0.18,3.75c0,1.75,0.3,3.31,0.89,4.69c-1.5,1.25-3.06,2.69-4.69,4.32 C23.62,23.19,22.12,24.38,20.38,25.56V21.34z"></path>
    </svg>
);


// KOMPONEN KARTU TESTIMONI (Tidak perlu diubah, animasi diterapkan di parent)
const TestimonialCard = ({ testimonial }) => {
    const isWhite = testimonial.type === 'white';
    const cardBg = isWhite ? 'bg-white' : 'bg-alyusra-orange';
    const textColor = isWhite ? 'text-gray-600' : 'text-gray-200';
    const nameColor = isWhite ? 'text-alyusra-dark-blue' : 'text-white';
    const lineColor = isWhite ? 'border-gray-200' : 'border-white/30';

    return (
        <div className={`rounded-xl shadow-lg p-8 flex flex-col ${cardBg}`}>
            <QuoteIcon />
            <p className={`italic text-lg flex-grow mb-6 ${textColor}`}>
                {testimonial.quote}
            </p>
            <hr className={`border-t my-4 ${lineColor}`} />
            <div className="flex items-center">
                <img src={testimonial.avatar} alt={testimonial.name} className="w-14 h-14 rounded-full mr-4 object-cover bg-white" />
                <div>
                    <h4 className={`font-bold text-xl ${nameColor}`}>{testimonial.name}</h4>
                    <p className={`text-sm opacity-90 ${textColor}`}>{testimonial.role}</p>
                </div>
            </div>
        </div>
    );
};


// KOMPONEN UTAMA TESTIMONIALS
export default function Testimonials() {
    // Data testimoni (tidak perlu diubah)
    //
    const testimonials = [
        { type: 'white', name: 'Ust Abdul Somad', role: 'Ulama Indonesia', quote: 'Mendirikan Rumah Tahfidz adalah investasi terbaik untuk akhirat. Di tempat seperti Al-Yusra inilah, bibit-bibit generasi Qur\'ani yang akan memimpin umat di masa depan ditanam dan dirawat.', avatar: 'https://th.bing.com/th/id/OIP.F8uHI6ZA7rDTVKlg4lWCcgHaHa?w=166&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3' },
        { type: 'orange', name: 'Muzammil Hasballah', role: 'Qori Internasional', quote: 'Keindahan Al-Quran tidak hanya terletak pada hafalannya, tetapi juga pada cara melantunkannya. Saya gembira melihat Al-Yusra fokus pada pembinaan tahsin dan tajwid untuk menyempurnakan bacaan para santri.', avatar: 'https://th.bing.com/th/id/OIP.M_K8D8WUG8KBB9C5pwiBbQHaHa?w=164&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3' },
        { type: 'orange', name: 'Ust Hanan Attaki', role: 'Pendakwah', quote: 'Untuk anak-anak muda, mendekat kepada Al-Quran adalah cara terbaik menemukan ketenangan dan \'healing\' yang sesungguhnya. Semoga Al-Yusra menjadi rumah yang nyaman bagi hati-hati yang rindu pada petunjuk-Nya.', avatar: 'https://th.bing.com/th/id/OIP.5zQyOiUoFpmx-PDQ39rT8QHaEK?w=277&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3' }
    ];

    // 3. Setup useInView untuk section
    const { ref: sectionRef, inView: sectionInView } = useInView({
        triggerOnce: true,
        threshold: 0.1, // Animasikan saat 10% section terlihat
    });

    // 4. Varian animasi untuk judul
    const titleVariants = {
        hidden: { opacity: 0, y: -30 },
        visible: { opacity: 1, y: 0 },
    };

    // 5. Varian animasi untuk container grid kartu (untuk efek stagger)
    const gridContainerVariants = {
        hidden: { opacity: 1 }, // Container awalnya terlihat
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2 // Beri jeda 0.2 detik antar animasi kartu
            }
        }
    };

     // 6. Varian animasi untuk setiap kartu
    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
    };


    return (
        // Tambahkan ref ke section
        <section ref={sectionRef} className="py-20 bg-dots-pattern bg-dots-size bg-repeat bg-gray-50 overflow-hidden"> {/* Tambah overflow-hidden */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* 7. Animasikan Judul */}
                <motion.h2 
                    initial="hidden"
                    animate={sectionInView ? "visible" : "hidden"}
                    variants={titleVariants}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-4xl lg:text-5xl font-extrabold text-alyusra-dark-blue text-center leading-tight"
                >
                    Kata Mereka Tentang <br />
                    <span className="relative inline-block whitespace-nowrap">
                        <span className="relative z-10">Al-Yusra</span>
                        <span className="absolute bottom-1 left-0 w-full h-3 bg-alyusra-orange transform -skew-x-12"></span>
                    </span>
                </motion.h2>
                
                {/* 8. Animasikan Container Grid Kartu */}
                <motion.div 
                    initial="hidden"
                    animate={sectionInView ? "visible" : "hidden"}
                    variants={gridContainerVariants} // Gunakan varian container
                    className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {testimonials.map((testi, index) => (
                        // 9. Animasikan setiap Kartu di dalam container
                        <motion.div 
                            key={index}
                            variants={cardVariants} // Gunakan varian kartu
                            transition={{ duration: 0.5, ease: "easeOut" }}
                         >
                            <TestimonialCard testimonial={testi} />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}