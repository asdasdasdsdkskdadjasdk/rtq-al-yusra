import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        role: '',
        quote: '',
        type: 'orange', // Default
        avatar: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.testimonial.store'));
    };

    return (
        <AuthenticatedLayout auth={auth} header={<h2 className="font-semibold text-xl text-gray-800">Tambah Testimoni</h2>}>
            <Head title="Tambah Testimoni" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        
                        <form onSubmit={submit} encType="multipart/form-data" className="space-y-6">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="name" value="Nama Tokoh" />
                                    <TextInput id="name" value={data.name} onChange={e => setData('name', e.target.value)} className="mt-1 block w-full" placeholder="Misal: Ust. Abdul Somad" required />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="role" value="Peran / Jabatan" />
                                    <TextInput id="role" value={data.role} onChange={e => setData('role', e.target.value)} className="mt-1 block w-full" placeholder="Misal: Ulama Indonesia" required />
                                    <InputError message={errors.role} className="mt-2" />
                                </div>
                            </div>

                            <div>
                                <InputLabel htmlFor="quote" value="Kutipan / Testimoni" />
                                <textarea 
                                    id="quote" 
                                    value={data.quote} 
                                    onChange={e => setData('quote', e.target.value)} 
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm" 
                                    rows="4"
                                    placeholder="Masukkan kata-kata testimoni..."
                                    required
                                ></textarea>
                                <InputError message={errors.quote} className="mt-2" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="type" value="Warna Kartu" />
                                    <select 
                                        id="type" 
                                        value={data.type} 
                                        onChange={e => setData('type', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    >
                                        <option value="orange">Orange (Teks Putih)</option>
                                        <option value="white">Putih (Teks Gelap)</option>
                                    </select>
                                    <InputError message={errors.type} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="avatar" value="Foto Profil (Opsional)" />
                                    <input 
                                        id="avatar" 
                                        type="file" 
                                        onChange={e => setData('avatar', e.target.files[0])} 
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                    />
                                    <InputError message={errors.avatar} className="mt-2" />
                                </div>
                            </div>

                            <div className="flex items-center justify-end mt-4 pt-4 border-t">
                                <Link href={route('admin.testimonial.index')}>
                                    <SecondaryButton className="mr-3">Batal</SecondaryButton>
                                </Link>
                                <PrimaryButton disabled={processing}>Simpan Testimoni</PrimaryButton>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}