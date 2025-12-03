import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react'; // <-- Import router
import PrimaryButton from '@/Components/PrimaryButton';

export default function Index({ auth, programs, flash = {} }) {
    
    // Fungsi Delete yang diperbaiki
    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus program ini?')) {
            router.delete(route('admin.program.destroy', id), {
                preserveScroll: true,
                onSuccess: () => {
                    // Opsional: Log jika berhasil
                    console.log('Berhasil dihapus');
                },
                onError: (errors) => {
                    console.error('Gagal menghapus:', errors);
                    alert('Gagal menghapus data.');
                }
            });
        }
    };

    return (
        <AuthenticatedLayout
            auth={auth} 
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen Program Pendaftaran</h2>}
        >
            <Head title="Admin Program" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Flash Message */}
                    {flash.success && (
                        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded relative">
                            {flash.success}
                        </div>
                    )}
                    
                    {/* Error Message (jika ada) */}
                    {flash.error && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded relative">
                            {flash.error}
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-medium">Daftar Program</h3>
                            <Link href={route('admin.program.create')}>
                                <PrimaryButton>+ Tambah Program</PrimaryButton>
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Program</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Biaya</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warna</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {programs.map((program) => (
                                        <tr key={program.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{program.nama}</div>
                                                {program.featured ? <span className="text-xs text-green-600 font-bold bg-green-100 px-2 py-0.5 rounded">Featured</span> : ''}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{program.jenis}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{program.biaya}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="w-6 h-6 rounded-full border border-gray-300" style={{ backgroundColor: program.color }}></div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                                                <Link 
                                                    href={route('admin.program.edit', program.id)}
                                                    className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1 rounded-md"
                                                >
                                                    Edit
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(program.id)}
                                                    className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-md ml-2 border border-red-200 hover:bg-red-100 transition"
                                                >
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {programs.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center text-gray-500">Belum ada data program.</td>
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