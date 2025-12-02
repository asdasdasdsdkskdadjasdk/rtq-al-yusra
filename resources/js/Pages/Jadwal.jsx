import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import JadwalCard from '@/Components/Page/Jadwal/JadwalCard';
import { motion } from 'framer-motion'; 

export default function Jadwal({ auth, jadwalList }) { 
    
    // Gunakan data dari database, fallback ke array kosong
    const dataJadwal = jadwalList || [];

    return (
        <AppLayout auth={auth} heroTheme="dark"> 
            <Head title="Jadwal Pendaftaran" />

            {/* HERO CONTAINER UTAMA */}
            <div 
                className="relative bg-gray-800 mt-[-80px] overflow-hidden" 
                style={{ 
                    backgroundImage: "url('/images/rtq.jpg')", 
                    backgroundSize: 'cover', 
                    backgroundAttachment: 'fixed', 
                    backgroundPosition: 'center',
                }}
            >
                {/* OVERLAY HITAM SOLID */}
                <div className="absolute inset-0 bg-black/70 z-10"></div>
                
                {/* KONTEN JUDUL */}
                <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-32 z-20">
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-white text-center mb-10 animate-fade-in animate-slide-in-up">
                        Jadwal Pendaftaran
                    </h1>
                </div>

                {/* KONTEN GELOMBANG */}
                <div className="relative space-y-16 mt-16 z-20"> 
                    {dataJadwal.map((data, gelombangIndex) => {
                        const isEvenGelombang = gelombangIndex % 2 !== 0; 
                        
                        const textColor = isEvenGelombang ? 'text-alyusra-dark-blue' : 'text-white';
                        const borderColor = isEvenGelombang ? 'border-alyusra-orange' : 'border-white/50';

                        return (
                            <div 
                                key={data.id || gelombangIndex} 
                                className={`${isEvenGelombang ? 'bg-gray-50 shadow-xl bg-dots-pattern bg-dots-size bg-repeat' : ''} py-10`}
                            >
                                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                                    <motion.div 
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.2 }}
                                        viewport={{ once: true }}
                                    >
                                        <h2 className={`text-3xl font-bold pb-2 border-b-2 ${textColor} ${borderColor} mb-6`}>
                                            {data.gelombang}
                                        </h2>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                            {/* Data tahapan disimpan sebagai JSON di database */}
                                            {data.tahapan && data.tahapan.map((tahap, idx) => (
                                                <JadwalCard 
                                                    key={idx} 
                                                    tahapan={tahap} 
                                                    isFullWhiteBg={isEvenGelombang} 
                                                />
                                            ))}
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        );
                    })}

                    {dataJadwal.length === 0 && (
                        <div className="text-center text-white pb-20">
                            <p className="text-xl opacity-80">Jadwal pendaftaran belum tersedia.</p>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="pb-16"></div> 
        </AppLayout>
    );
}