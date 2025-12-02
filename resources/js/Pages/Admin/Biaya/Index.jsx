import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Index({ auth, biayaList }) {
    const { delete: destroy } = useForm();

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus data biaya ini?')) {
            destroy(route('admin.biaya.destroy', id));
        }
    };

    return (
        // PERBAIKAN DI SINI: Gunakan auth={auth}
        <AuthenticatedLayout auth={auth}>
            <Head title="Admin Biaya" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">Manajemen Biaya PSB</h2>
                            <Link
                                href={route('admin.biaya.create')}
                                className="bg-alyusra-orange hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded"
                            >
                                + Tambah Paket Biaya
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program / Paket</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Warna Kartu</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {biayaList.length > 0 ? biayaList.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-gray-900">{item.nama}</div>
                                                {item.featured && <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Featured</span>}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{item.jenis}</td>
                                            <td className="px-6 py-4 text-center">
                                                <div 
                                                    className="w-8 h-8 rounded-full mx-auto border border-gray-200 shadow-sm"
                                                    style={{ backgroundColor: item.color }}
                                                    title={item.color}
                                                ></div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Link
                                                    href={route('admin.biaya.edit', item.id)}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                >
                                                    Edit
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(item.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                                Belum ada data biaya.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}