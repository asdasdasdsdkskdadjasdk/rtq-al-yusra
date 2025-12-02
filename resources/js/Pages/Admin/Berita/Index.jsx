import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function BeritaIndex({ auth, berita, flash ={}}){
    const { delete: destroy } = useForm();

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
            destroy(route('admin.berita.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Manajemen Berita" />

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-alyusra-dark-blue">Manajemen Berita</h1>
                <Link
                    href={route('admin.berita.create')}
                    className="bg-alyusra-orange text-white px-4 py-2 rounded-md hover:bg-opacity-90"
                >
                    + Tambah Berita
                </Link>
            </div>

            {flash.success && (
                <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg border border-green-400">
                    {flash.success}
                </div>
            )}

            <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Judul</th>
                            <th className="px-6 py-3">Penulis</th>
                            <th className="px-6 py-3">Tanggal</th>
                            <th className="px-6 py-3">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {berita.data.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-center">Belum ada berita.</td>
                            </tr>
                        ) : (
                            berita.data.map((item) => (
                                <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{item.judul}</td>
                                    <td className="px-6 py-4">{item.penulis}</td>
                                    <td className="px-6 py-4">{new Date(item.created_at).toLocaleDateString('id-ID')}</td>
                                    <td className="px-6 py-4">
                                        <button 
                                            onClick={() => handleDelete(item.id)}
                                            className="text-red-600 hover:underline ml-4"
                                        >
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </AuthenticatedLayout>
    );
}