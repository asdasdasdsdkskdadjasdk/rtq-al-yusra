import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function CreateBerita({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        judul: '',
        konten: '',
        gambar: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.berita.store'));
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Tambah Berita" />

            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-alyusra-dark-blue mb-8">Tambah Berita Baru</h1>

                <div className="bg-white p-8 rounded-xl shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Judul */}
                        <div>
                            <InputLabel htmlFor="judul" value="Judul Berita" />
                            <TextInput
                                id="judul"
                                value={data.judul}
                                onChange={(e) => setData('judul', e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                            <InputError message={errors.judul} className="mt-2" />
                        </div>

                        {/* Konten */}
                        <div>
                            <InputLabel htmlFor="konten" value="Isi Berita" />
                            <textarea
                                id="konten"
                                value={data.konten}
                                onChange={(e) => setData('konten', e.target.value)}
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                rows="10"
                                required
                            ></textarea>
                            <InputError message={errors.konten} className="mt-2" />
                        </div>

                        {/* Gambar */}
                        <div>
                            <InputLabel htmlFor="gambar" value="Gambar Utama (Opsional)" />
                            <input
                                id="gambar"
                                type="file"
                                onChange={(e) => setData('gambar', e.target.files[0])}
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-alyusra-orange file:text-white hover:file:bg-opacity-90"
                            />
                            <InputError message={errors.gambar} className="mt-2" />
                        </div>

                        <div className="flex justify-end space-x-4">
                            <Link href={route('admin.berita.index')} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                                Batal
                            </Link>
                            <PrimaryButton disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Simpan Berita'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}