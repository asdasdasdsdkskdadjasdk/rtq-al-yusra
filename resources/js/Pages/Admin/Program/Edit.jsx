import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Checkbox from '@/Components/Checkbox';

export default function Edit({ auth, program }) {
    // Inisialisasi data dari props 'program'
    const { data, setData, put, processing, errors } = useForm({
        jenis: program.jenis,
        nama: program.nama,
        batas_pendaftaran: program.batas_pendaftaran,
        tes: program.tes,
        biaya: program.biaya,
        color: program.color,
        featured: Boolean(program.featured),
        details: program.details || [''], // Pastikan ada array
    });

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setData(e.target.name, value);
    };

    const handleDetailChange = (index, value) => {
        const newDetails = [...data.details];
        newDetails[index] = value;
        setData('details', newDetails);
    };

    const addDetail = () => {
        setData('details', [...data.details, '']);
    };

    const removeDetail = (index) => {
        const newDetails = data.details.filter((_, i) => i !== index);
        setData('details', newDetails);
    };

    const submit = (e) => {
        e.preventDefault();
        // Menggunakan method PUT untuk update
        put(route('admin.program.update', program.id));
    };

    return (
        <AuthenticatedLayout 
        auth={auth}
        header={<h2 className="font-semibold text-xl text-gray-800">Edit Program</h2>}>
            <Head title="Edit Program" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        
                        <form onSubmit={submit} className="space-y-6">
                            
                            {/* Form Input sama persis dengan Create */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="jenis" value="Jenis Program" />
                                    <TextInput id="jenis" name="jenis" value={data.jenis} onChange={handleChange} className="mt-1 block w-full" required />
                                    <InputError message={errors.jenis} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="nama" value="Nama Program" />
                                    <TextInput id="nama" name="nama" value={data.nama} onChange={handleChange} className="mt-1 block w-full" required />
                                    <InputError message={errors.nama} className="mt-2" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="batas_pendaftaran" value="Batas Pendaftaran" />
                                    <TextInput id="batas_pendaftaran" name="batas_pendaftaran" value={data.batas_pendaftaran} onChange={handleChange} className="mt-1 block w-full" required />
                                    <InputError message={errors.batas_pendaftaran} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="tes" value="Info Tes" />
                                    <TextInput id="tes" name="tes" value={data.tes} onChange={handleChange} className="mt-1 block w-full" required />
                                    <InputError message={errors.tes} className="mt-2" />
                                </div>
                            </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="biaya" value="Biaya Pendaftaran" />
                                    <TextInput id="biaya" name="biaya" value={data.biaya} onChange={handleChange} className="mt-1 block w-full" required />
                                    <InputError message={errors.biaya} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="color" value="Warna Kartu" />
                                    <div className="flex items-center gap-2 mt-1">
                                        <input type="color" name="color" value={data.color} onChange={handleChange} className="h-10 w-10 border bg-white cursor-pointer rounded" />
                                        <TextInput id="color" name="color" value={data.color} onChange={handleChange} className="block w-full" required />
                                    </div>
                                    <InputError message={errors.color} className="mt-2" />
                                </div>
                            </div>

                            <div className="block">
                                <label className="flex items-center">
                                    <Checkbox name="featured" checked={data.featured} onChange={handleChange} />
                                    <span className="ms-2 text-sm text-gray-600">Jadikan Program Unggulan</span>
                                </label>
                            </div>

                            <div>
                                <InputLabel value="Detail Persyaratan / Ketentuan" />
                                {data.details.map((detail, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <TextInput 
                                            value={detail} 
                                            onChange={(e) => handleDetailChange(index, e.target.value)} 
                                            className="block w-full" 
                                            required 
                                        />
                                        {data.details.length > 1 && (
                                            <button 
                                                type="button" 
                                                onClick={() => removeDetail(index)} 
                                                className="bg-red-100 text-red-600 px-3 rounded hover:bg-red-200"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={addDetail} className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                                    + Tambah Poin
                                </button>
                                <InputError message={errors.details} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-end mt-4 pt-4 border-t">
                                <Link href={route('admin.program.index')}>
                                    <SecondaryButton className="mr-3">Batal</SecondaryButton>
                                </Link>
                                <PrimaryButton disabled={processing}>Update Program</PrimaryButton>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}