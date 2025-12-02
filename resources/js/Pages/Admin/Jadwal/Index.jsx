import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Index({ auth, jadwalList }) {
    const { delete: destroy } = useForm();

    const handleDelete = (id) => {
        if (confirm('Hapus jadwal gelombang ini?')) {
            destroy(route('admin.jadwal.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Admin Jadwal" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">Atur Jadwal Gelombang</h2>
                            <Link href={route('admin.jadwal.create')} className="bg-alyusra-orange hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded">
                                + Tambah Gelombang
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {jadwalList.map((item) => (
                                <div key={item.id} className="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50">
                                    <div>
                                        <h3 className="text-lg font-bold text-alyusra-dark-blue">{item.gelombang}</h3>
                                        <p className="text-sm text-gray-500">{item.tahapan.length} Tahapan Kegiatan</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <Link href={route('admin.jadwal.edit', item.id)} className="text-indigo-600 font-medium hover:underline">Edit</Link>
                                        <button onClick={() => handleDelete(item.id)} className="text-red-600 font-medium hover:underline">Hapus</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}