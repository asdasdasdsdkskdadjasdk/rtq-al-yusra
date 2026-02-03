import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// === KOLEKSI IKON (TETAP SAMA) ===
const LocationIcon = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const EmailIcon = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 00-2-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const PhoneIcon = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;
const FacebookIcon = ({ className }) => <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>;
const InstagramIcon = ({ className }) => <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.85s.012-3.584.07-4.85c.148-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.059 1.689.073 4.948.073s3.667-.014 4.947-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759 6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.44-.645 1.44-1.44-.645-1.44-1.44-1.44z" /></svg>;
const YouTubeIcon = ({ className }) => <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg>;
const WhatsAppIcon = ({ className }) => <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.5 1.32 5l-1.41 5.12 5.24-1.38c1.44.79 3.04 1.21 4.76 1.21h.01c5.46 0 9.91-4.45 9.91-9.91s-4.45-9.91-9.91-9.91zM17.18 14.8c-.28-.14-1.65-.81-1.9-1.02-.26-.11-.45-.14-.64.14-.19.28-.72.9-.88 1.08-.16.19-.32.21-.59.07-.28-.14-1.16-.43-2.2-1.36-.81-.72-1.36-1.61-1.52-1.88-.16-.28-.02-.43.12-.57.12-.12.28-.32.41-.47.14-.16.19-.28.28-.47.09-.19.04-.35-.02-.5-.07-.14-.64-1.53-.88-2.1-.23-.55-.48-.48-.64-.48-.16 0-.35-.03-.54-.03-.19 0-.5.21-.64.42-.14.21-.54.66-.54 1.61 0 .95.54 1.86.61 2 .07.14 1.08 1.73 2.62 2.42.36.16.6.21.8.28.3.07.54.04.74-.04.22-.09.65-.26.88-.51.23-.25.23-.46.16-.51z" /></svg>;

export default function Footer() {
    // 1. AMBIL DATA DINAMIS DARI PROPS
    const { sekolah } = usePage().props;

    // 2. SETUP VARIABEL DINAMIS (Menggantikan Hardcoded)
    const alamat = sekolah.alamat_pusat || 'Jalan Wijaya No 69, Sukajadi, Pekanbaru, Riau 28123, Indonesia.';
    const email = sekolah.email || 'info@alyusra.com';
    const telepon = sekolah.no_hp || '0852-1866-9128';

    // 3. LOGIKA FORMAT NOMOR WA (08xx -> 628xx)
    let whatsappLink = '#';
    if (sekolah.no_hp) {
        let clean = sekolah.no_hp.replace(/[^0-9]/g, ''); // Hapus non-angka
        if (clean.startsWith('0')) {
            clean = '62' + clean.slice(1); // Ubah 0 jadi 62
        }
        whatsappLink = `https://wa.me/${clean}`;
    }

    // 4. SETUP NAV LINK
    const navLinks = [
        { href: route('pendaftaran'), text: 'Formulir Pendaftaran' },
        { href: route('jadwal'), text: 'Jadwal Pendaftaran' },
        { href: route('biaya.pendidikan'), text: 'Biaya Pendidikan' },
        { href: route('berita.index'), text: 'Informasi & Berita' },
    ];

    // 5. SETUP SOCIAL MEDIA DINAMIS
    const socialLinks = [];
    if (sekolah.facebook) socialLinks.push({ name: 'Facebook', href: sekolah.facebook, icon: FacebookIcon });
    if (sekolah.instagram) socialLinks.push({ name: 'Instagram', href: sekolah.instagram, icon: InstagramIcon });
    if (sekolah.youtube) socialLinks.push({ name: 'YouTube', href: sekolah.youtube, icon: YouTubeIcon });

    // Gunakan Link WA yang sudah diformat
    if (sekolah.no_hp) socialLinks.push({
        name: 'WhatsApp',
        href: whatsappLink,
        icon: WhatsAppIcon
    });

    const googleMapsEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.65086910485!2d101.43044257496473!3d0.5249364994699299!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d5ab6bbb930ac3%3A0xf98043ac3549b8ef!2sRTQ%20AL%20YUSRA%20(%20Rumah%20Tahfidz%20Quran)!5e0!3m2!1sid!2sid!4v1764551694201!5m2!1sid!2sid";

    // --- Setup Animasi ---
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const footerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <footer className="bg-gray-50 bg-dots-pattern bg-dots-size bg-repeat overflow-hidden ">

            <div className="container mx-auto px-4">

                <motion.div
                    ref={ref}
                    initial="hidden"
                    animate={inView ? 'visible' : 'hidden'}
                    variants={footerVariants}
                    transition={{ duration: 0.8, ease: "easeOut" }}

                    className="relative bg-cover bg-center text-white rounded-2xl overflow-hidden shadow-lg"
                    style={{ backgroundImage: "url('/images/rtq.jpg')" }}
                >
                    <div className="absolute inset-0 bg-black/60"></div>

                    <div className="relative p-8 md:p-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">

                            {/* Kolom 1: Logo, Alamat, Kontak */}
                            <div className="space-y-4 ">
                                <img src="/images/logo3.png" alt="Logo RTQ Al-Yusra" className="h-20 md:h-24 mb-4 bg-white/10 p-4 rounded-lg" />
                                <div className="flex items-start text-gray-300 text-sm">
                                    <LocationIcon className="w-4 h-4 mt-1 mr-3 flex-shrink-0 text-alyusra-orange" />
                                    <p>{alamat}</p>
                                </div>
                                <div className="flex items-center text-gray-300 text-sm">
                                    <EmailIcon className="w-4 h-4 mr-3 flex-shrink-0 text-alyusra-orange" />
                                    <a href={`mailto:${email}`} className="hover:text-white">{email}</a>
                                </div>
                                <div className="flex items-center text-gray-300 text-sm">
                                    <PhoneIcon className="w-4 h-4 mr-3 flex-shrink-0 text-alyusra-orange" />
                                    {/* Gunakan link WA di sini juga jika diklik */}
                                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                                        {telepon}
                                    </a>
                                </div>
                            </div>

                            {/* Kolom 2: Tautan Navigasi */}
                            <div>
                                <h4 className="font-bold text-lg mb-6 text-white">Tautan Navigasi</h4>
                                <ul className="space-y-3">
                                    {navLinks.map((link) => (
                                        <li key={link.text}>
                                            <Link href={link.href} className="text-gray-300 hover:text-white transition text-sm">
                                                {link.text}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Kolom 3: Sosial Media */}
                            <div>
                                <h4 className="font-bold text-lg mb-6 text-white">Sosial Media</h4>
                                <div className="flex flex-wrap gap-4">
                                    {socialLinks.length > 0 ? (
                                        socialLinks.map((social) => (
                                            <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition">
                                                <span className="sr-only">{social.name}</span>
                                                <social.icon className="w-6 h-6" />
                                            </a>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 text-sm">Belum ada sosial media.</p>
                                    )}
                                </div>
                            </div>

                            {/* Kolom 4: Google Map Kecil */}
                            <div>
                                <h4 className="font-bold text-lg mb-6 text-white">Lokasi Kami</h4>
                                <div className="w-full h-40 bg-gray-700 rounded-lg overflow-hidden shadow-md border border-gray-600">
                                    <iframe
                                        src={googleMapsEmbedUrl}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Lokasi RTQ Al-Yusra"
                                    ></iframe>
                                </div>
                            </div>

                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="bg-gray-50 py-4">
                <div className="container mx-auto text-center text-gray-500 text-xs">
                    © {new Date().getFullYear()} {sekolah.nama_sekolah || 'RTQ Al-Yusra'}. Dikembangkan oleh 1KANASEM
                </div>
            </div>
        </footer>
    );
}