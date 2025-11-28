// resources/js/Pages/KontakKami.jsx

import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { motion } from 'framer-motion';

// Ikon Telepon
const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-3.987a1 1 0 01-.994-.959A15.01 15.01 0 003.11 9.987a1 1 0 01-.959-.994V5z" />
    </svg>
);
// Ikon Email
const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);
// Ikon Lokasi
const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

// resources/js/Pages/KontakKami.jsx (Tambahan Ikon Sosial Media)

// Ikon Facebook
const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-1.25.5-1.75s1.25-.75 2-.75h1.5V5h-2c-2.4 0-4 .5-4 3v2.5H9V13.5h2V21h4v-7.5z"/></svg>
);
// Ikon Instagram
const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M7.5 10c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5-2.5-1.12-2.5-2.5zm10-5c-.7 0-1.3.3-1.8.8-.5.5-.8 1.1-.8 1.9 0 1.25.7 2.25 1.8 2.5.7.1 1.4-.2 1.9-.8.5-.5.8-1.2.8-2 0-.8-.3-1.4-.8-1.9-.5-.5-1.1-.8-1.9-.8zm-6.2 5c0 1.9-1.5 3.5-3.5 3.5s-3.5-1.6-3.5-3.5 1.5-3.5 3.5-3.5 3.5 1.6 3.5 3.5zm7.3 11c0 .28-.22.5-.5.5H3.5c-.28 0-.5-.22-.5-.5V8.5c0-.28.22-.5.5-.5h17c.28 0 .5.22.5.5v12z"/></svg>
);
// Ikon WhatsApp
const WhatsappIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12.03 2.001c-5.46 0-9.927 4.467-9.927 9.927 0 1.77.474 3.44 1.36 4.908l-.946 3.65 3.738-.98c1.42.77 3.03 1.178 4.815 1.178 5.46 0 9.927-4.467 9.927-9.927s-4.467-9.927-9.927-9.927zm3.565 12.392c-.065.105-.23.14-.385.197-.15.056-.9.336-1.16.368-.26.03-.42.046-.735-.156-.305-.195-1.17-.468-2.225-1.353-.83-.678-1.38-1.527-1.545-1.815-.16-.28-.01-.43-.16-.6-.16-.16-.31-.38-.475-.575-.16-.205-.335-.17-.49-.17-.15-.01-.325.04-.5.23-.15.195-.58.74-.58.985 0 .245.59.845.67.95.08.105.74 1.125 1.78 1.54.49.195.89.325 1.19.41.3.09.4.085.58.07.2-.015 1.485-.6 1.83-.875.33-.26.54-.42.74-.525.19-.09.325-.09.465-.05.15.035.93.455 1.05.71.12.255.125.465.085.61z" /></svg>
);
// Ikon YouTube (Anda sudah memilikinya, tapi kita pakai yang simple)
const YouTubeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.3 12.8L12 11.7l-3.3 3.1V9.2h6.6v5.6z"/></svg>
);
// ... (Ikon lainnya seperti PhoneIcon, MailIcon, LocationIcon sudah didefinisikan sebelumnya)


export default function KontakKami({ auth, errors: inertiaErrors }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        nama: '',
        email: '',
        subjek: '',
        pesan: '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        // Ganti dengan route store formulir kontak Anda
        post(route('kontak.store'), {
            onSuccess: () => {
                alert('Pesan berhasil dikirim!'); 
                reset();
            }
        });
    }

    // Embed URL untuk Google Maps (menggunakan koordinat dan format embed umum)
    // Koordinat: 0.525162, 101.432878
    const mapEmbedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.65860269382!2d101.43030307525384!3d0.5251629995138167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d515a44369e469%3A0x1d46f9037c35e38d!2sGg.%20Keluarga%2066!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid`; // Ganti angka 17... dengan timestamp saat ini

    return (
        <AppLayout auth={auth} heroTheme="dark">
            <Head title="Kontak Kami" />

            {/* HERO CONTAINER UTAMA (Sejajar Navbar) */}
            <div className="relative bg-gray-800 pb-16 pt-32 mt-[-80px] overflow-hidden" 
                 style={{ 
                     backgroundImage: "url('/images/rtq.jpg')", 
                     backgroundSize: 'cover', 
                     backgroundAttachment: 'fixed', 
                     backgroundPosition: 'center' 
                 }}>
                <div className="absolute inset-0 bg-black/70"></div>
                
                <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 z-20">
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-white text-center mb-6 animate-fade-in animate-slide-in-up">
                        Hubungi Kami
                    </h1>
                </div>
            </div>

            {/* KONTEN UTAMA & FORMULIR */}
            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 -mt-16 z-20">
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* KOLOM KIRI (INFORMASI KONTAK - ORANGE) */}
                    <motion.div 
                        className="lg:col-span-1 p-8 rounded-2xl shadow-lg bg-alyusra-orange text-white h-full"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h2 className="text-2xl font-bold mb-6 border-b pb-3 border-white/40">Detail Kontak</h2>
                        
                        <div className="space-y-6">
                            <div className="flex items-start">
                                <LocationIcon /> {/* Ikon sekarang putih */}
                                <div>
                                    <p className="font-semibold">Alamat Kami</p>
                                    <p className="text-sm opacity-90">Gg. Keluarga 66, Kedungsari, Kec. Sukajadi, Kota Pekanbaru, Riau 28156</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center">
                                <MailIcon /> {/* Ikon sekarang putih */}
                                <div>
                                    <p className="font-semibold">Email</p>
                                    <p className="text-sm opacity-90">info@alyusra.com</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center">
                                <PhoneIcon /> {/* Ikon sekarang putih */}
                                <div>
                                    <p className="font-semibold">Telepon/WA</p>
                                    <p className="text-sm opacity-90">0852-1866-9128</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* === BLOK BARU: SOSIAL MEDIA === */}
                        <div className="mt-8 pt-6 border-t border-white/40">
                            <p className="font-semibold text-lg mb-3">Sosial Media Kami</p>
                            <div className="flex space-x-4">
                                {/* Link Facebook */}
                                <a href="LINK_FACEBOOK" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-200 transition">
                                    <FacebookIcon />
                                </a>
                                {/* Link Instagram */}
                                <a href="LINK_INSTAGRAM" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-200 transition">
                                    <InstagramIcon />
                                </a>
                                {/* Link YouTube */}
                                <a href="LINK_YOUTUBE" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-200 transition">
                                    <YouTubeIcon />
                                </a>
                                {/* Link WhatsApp */}
                                <a href="https://wa.me/6285218669128" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-200 transition">
                                    <WhatsappIcon />
                                </a>
                            </div>
                        </div>
                        {/* === AKHIR BLOK SOSIAL MEDIA === */}
                        
                    </motion.div>

                    {/* KOLOM KANAN (FORMULIR KONTAK) */}
                    <motion.div 
                        className="lg:col-span-2 p-8 rounded-2xl shadow-2xl bg-white"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    >
                        <h2 className="text-2xl font-bold text-alyusra-dark-blue mb-6 border-b pb-3">Kirim Pesan Kepada Kami</h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            
                            {/* Nama & Email */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="nama" value="Nama Lengkap" />
                                    <TextInput id="nama" type="text" value={data.nama} onChange={e => setData('nama', e.target.value)} className="mt-1 block w-full" required />
                                    <InputError message={errors.nama} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="email" value="Email Anda" />
                                    <TextInput id="email" type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="mt-1 block w-full" required />
                                    <InputError message={errors.email} className="mt-2" />
                                </div>
                            </div>

                            {/* Subjek */}
                            <div>
                                <InputLabel htmlFor="subjek" value="Subjek Pesan" />
                                <TextInput id="subjek" type="text" value={data.subjek} onChange={e => setData('subjek', e.target.value)} className="mt-1 block w-full" required />
                                <InputError message={errors.subjek} className="mt-2" />
                            </div>

                            {/* Pesan */}
                            <div>
                                <InputLabel htmlFor="pesan" value="Pesan" />
                                <textarea id="pesan" value={data.pesan} onChange={e => setData('pesan', e.target.value)} className="mt-1 block w-full border-gray-300 focus:border-alyusra-orange focus:ring-alyusra-orange rounded-md shadow-sm" rows="4" required></textarea>
                                <InputError message={errors.pesan} className="mt-2" />
                            </div>

                            <div className="flex justify-end pt-2">
                                <PrimaryButton disabled={processing}>
                                    {processing ? 'Mengirim...' : 'Kirim Pesan'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </motion.div>
                </div>
                
                {/* Embed Map - Menggunakan data koordinat yang diberikan */}
                <div className="mt-12 mb-16 p-8 bg-white rounded-2xl shadow-lg">
                    <h2 className="text-2xl font-bold text-alyusra-dark-blue mb-4">Lokasi Kami</h2>
                    <div className="h-96 w-full rounded-xl overflow-hidden">
                        <iframe 
                            src={mapEmbedUrl} 
                            width="100%" 
                            height="100%" 
                            style={{ border: 0 }} 
                            allowFullScreen="" 
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Lokasi RTQ Al Yusra"
                        ></iframe>
                    </div>
                </div>

            </div>
            
        </AppLayout>
    );
}