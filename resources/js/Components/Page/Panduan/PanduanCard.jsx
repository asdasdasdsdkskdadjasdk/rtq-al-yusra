// resources/js/Components/Page/Panduan/PanduanCard.jsx

// --- KOLEKSI IKON (SVG) ---
// Kita definisikan ikon langsung di sini agar pasti ada
const DefaultIcon = ({ className }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

export const BuatAkunIcon = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" /></svg>;
export const VerifikasiAkunIcon = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.602-3.751m-11.25-4.439a9 9 0 0111.25 0l-5.625 5.625a3.75 3.75 0 01-5.304 0l-5.625-5.625z" /></svg>;
export const PilihFormulirIcon = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12" /></svg>;
export const MelunasiTagihanIcon = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75v10.5A2.25 2.25 0 004.5 19.5z" /></svg>;
export const MelengkapiDataIcon = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>;
export const MengunggahBerkasIcon = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>;
export const ProsesSeleksiIcon = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0118 21h-2.25a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
export const MenungguPengumumanIcon = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>;
export const RegistrasiUlangIcon = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;


// --- KOMPONEN KARTU UTAMA ---
export default function PanduanCard({ langkah }) {
    // Jika tidak ada data 'langkah', kita berikan objek kosong agar tidak error
    const data = langkah || {};
    
    // Ambil data, berikan nilai default jika kosong
    const judul = data.judul || 'Judul Tidak Tersedia';
    const deskripsi = data.deskripsi || 'Deskripsi tidak tersedia.';
    const color = data.color || 'white';
    
    // Tentukan komponen ikon. Jika tidak ada, pakai DefaultIcon agar tidak error/kosong
    const IconComponent = data.icon || DefaultIcon;

    // Styling berdasarkan warna
    const isWhite = color === 'white';
    const cardBg = isWhite ? 'bg-white' : 'bg-alyusra-orange';
    const titleColor = isWhite ? 'text-alyusra-dark-blue' : 'text-white';
    const textColor = isWhite ? 'text-gray-600' : 'text-white';
    const iconContainerBg = isWhite ? 'bg-orange-100' : 'bg-white/25';
    const iconColor = isWhite ? 'text-alyusra-orange' : 'text-white';

    return (
        <div className={`rounded-xl shadow-lg p-8 h-full flex flex-col items-center text-center ${cardBg}`}>
            
            {/* Bagian Ikon dalam Lingkaran */}
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 flex-shrink-0 ${iconContainerBg}`}>
                <IconComponent className={`w-10 h-10 ${iconColor}`} />
            </div>

            {/* Bagian Teks */}
            <div className="flex flex-col flex-grow w-full">
                <h3 className={`font-bold text-xl mb-3 ${titleColor}`}>
                    {judul}
                </h3>
                <p className={`text-sm leading-relaxed flex-grow ${textColor}`}>
                    {deskripsi}
                </p>
            </div>
        </div>
    );
}