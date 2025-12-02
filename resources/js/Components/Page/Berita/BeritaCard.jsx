// resources/js/Components/Page/Berita/BeritaCard.jsx

import { Link } from '@inertiajs/react';

// Tambahkan prop 'index' untuk menentukan posisi kartu
export default function BeritaCard({ post, index, className = '', style = {} }) {
    
    // --- LOGIKA TAMBAHAN UNTUK WARNA & UKURAN ---
    // Cek apakah kartu ini adalah kartu tengah (urutan ke-2, 5, 8, dst.)
    // Kita gunakan modulo 3 karena layout grid kita maksimal 3 kolom.
    const isMiddleCard = index % 3 === 1;

    // Tentukan warna berdasarkan posisi: Kartu tengah jadi Oranye, sisanya Putih.
    // (Menggantikan logika 'post.featured' yang lama)
    const isOrange = isMiddleCard; 

    // Tentukan kelas CSS untuk warna dan teks
    const cardColor = isOrange ? 'bg-alyusra-orange text-white' : 'bg-white text-gray-800';
    const textColor = isOrange ? 'text-gray-100' : 'text-gray-600'; // Warna teks deskripsi
    const metaColor = isOrange ? 'text-white/80' : 'text-gray-500'; // Warna teks kecil (tanggal/penulis)
    const buttonColor = isOrange ? 'bg-white text-alyusra-orange hover:bg-gray-100' : 'bg-alyusra-orange text-white hover:bg-opacity-90';
    const borderColor = isOrange ? 'border-white/20' : 'border-gray-200'; // Warna garis pemisah

    // Tentukan kelas untuk efek perbesaran (hanya di layar besar 'lg:')
    const scaleClass = isMiddleCard ? 'lg:scale-110 lg:-translate-y-2 z-10' : 'lg:scale-100 z-0';

    // Helper untuk memformat tanggal (jika data tanggal dari DB belum diformat)
    const formattedDate = post.created_at 
        ? new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        : post.date; // Fallback ke data dummy jika ada

    // Helper untuk gambar
    const imageUrl = post.gambar 
        ? (post.gambar.startsWith('http') ? post.gambar : `/storage/${post.gambar}`)
        : '/images/rtq.jpg';

    return (
        <div 
            className={`rounded-xl shadow-lg overflow-hidden flex flex-col h-full transition-all duration-300 ${cardColor} ${scaleClass} ${className}`}
            style={style} 
        >
            {/* Gambar Artikel */}
            <div className="relative h-48 w-full overflow-hidden">
                           <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />

            </div>

            {/* Konten Teks */}
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-2 line-clamp-2">
                    {post.judul || post.title}
                </h3>
                
                <p className={`text-sm flex-grow mb-4 line-clamp-3 ${textColor}`}>
                    {post.konten || post.excerpt}
                </p>

                {/* Footer Kartu */}
                <div className={`border-t pt-4 mt-auto ${borderColor}`}>
                    <div className="flex justify-between items-center">
                        <div className={`text-xs ${metaColor}`}>
                            <p>{post.penulis || post.author} | {formattedDate}</p>
                        </div>
                        
                        <Link 
                            href={route('berita.show', post.id)} 
                            className={`px-4 py-2 rounded-md font-bold text-xs uppercase tracking-wide transition shadow-sm ${buttonColor}`}
                        >
                            Selengkapnya
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}