// resources/js/Components/Page/Berita/BeritaCard.jsx

import { Link } from '@inertiajs/react';

// 1. Tambahkan className dan style ke props, dengan nilai default
export default function BeritaCard({ post, className = '', style = {} }) {
    const isFeatured = post.featured;

    // Tentukan warna berdasarkan status 'featured'
    const cardColor = isFeatured ? 'bg-alyusra-orange text-white' : 'bg-white text-gray-800';
    const textColor = isFeatured ? 'text-gray-200' : 'text-gray-600';
    const buttonColor = isFeatured ? 'bg-white text-alyusra-orange' : 'bg-alyusra-orange text-white';

    return (
        // 2. Terapkan className dan style ke elemen root div.
        // Penataan jarak prop diperbaiki untuk menghindari error Babel.
        <div 
            className={`rounded-xl shadow-lg overflow-hidden flex flex-col ${cardColor} ${isFeatured ? 'transform lg:scale-105' : ''} ${className}`}
            style={style} 
        >
            {/* Gambar Artikel */}
            <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />

            {/* Konten Teks */}
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                <p className={`text-sm flex-grow mb-4 ${textColor} line-clamp-4`}>
                    {post.excerpt}
                </p>

                {/* Footer Kartu */}
                <div className="border-t pt-4 mt-auto" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
                    <div className="flex justify-between items-center">
                        <div className="text-xs opacity-80">
                            <p>{post.author} | {post.date}</p>
                        </div>
                          <Link 
                            href={route('berita.show', post.id)} 
                            className={`px-4 py-2 rounded-md font-semibold text-sm ${buttonColor} hover:bg-opacity-90`}
                        >
                            Selengkapnya
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}