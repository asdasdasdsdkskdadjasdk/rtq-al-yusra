import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Checkbox from '@/Components/Checkbox';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        jenis: '',
        nama: '',
        batas_pendaftaran: '',
        tes: '',
        biaya: '',
        color: '#E85B25', // Default orange
        featured: false,
        details: [''], // Mulai dengan satu input kosong
    });

    // Handle perubahan text biasa
    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setData(e.target.name, value);
    };

    // Handle perubahan input dinamis (details)
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
        post(route('admin.program.store'));
    };

    return (
        <AuthenticatedLayout 
        auth={auth}
        header={<h2 className="font-semibold text-xl text-gray-800">Tambah Program Baru</h2>}>
            <Head title="Tambah Program" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        
                        <form onSubmit={submit} className="space-y-6">
                            
                            {/* Baris 1 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="jenis" value="Jenis Program" />
                                    <TextInput id="jenis" name="jenis" value={data.jenis} onChange={handleChange} className="mt-1 block w-full" placeholder="Contoh: Reguler" isFocused required />
                                    <InputError message={errors.jenis} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="nama" value="Nama Program" />
                                    <TextInput id="nama" name="nama" value={data.nama} onChange={handleChange} className="mt-1 block w-full" placeholder="Contoh: Taman Quran Tabarak" required />
                                    <InputError message={errors.nama} className="mt-2" />
                                </div>
                            </div>

                            {/* Baris 2 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="batas_pendaftaran" value="Batas Pendaftaran" />
                                    <TextInput id="batas_pendaftaran" name="batas_pendaftaran" value={data.batas_pendaftaran} onChange={handleChange} className="mt-1 block w-full" placeholder="Contoh: 20 Juli 2025" required />
                                    <InputError message={errors.batas_pendaftaran} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="tes" value="Info Tes" />
                                    <TextInput id="tes" name="tes" value={data.tes} onChange={handleChange} className="mt-1 block w-full" placeholder="Contoh: Tes di Tempat" required />
                                    <InputError message={errors.tes} className="mt-2" />
                                </div>
                            </div>

                             {/* Baris 3 */}
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="biaya" value="Biaya Pendaftaran" />
                                    <TextInput id="biaya" name="biaya" value={data.biaya} onChange={handleChange} className="mt-1 block w-full" placeholder="Contoh: Rp.300,000" required />
                                    <InputError message={errors.biaya} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="color" value="Warna Kartu (Hex Code)" />
                                    <div className="flex items-center gap-2 mt-1">
                                        <input type="color" name="color" value={data.color} onChange={handleChange} className="h-10 w-10 border bg-white cursor-pointer rounded" />
                                        <TextInput id="color" name="color" value={data.color} onChange={handleChange} className="block w-full" placeholder="#E85B25" required />
                                    </div>
                                    <InputError message={errors.color} className="mt-2" />
                                </div>
                            </div>

                            {/* Featured Checkbox */}
                            <div className="block">
                                <label className="flex items-center">
                                    <Checkbox name="featured" checked={data.featured} onChange={handleChange} />
                                    <span className="ms-2 text-sm text-gray-600">Jadikan Program Unggulan (Tampil Lebih Besar di Tengah)</span>
                                </label>
                            </div>

                            {/* Detail Persyaratan (Dinamis) */}
                            <div>
                                <InputLabel value="Detail Persyaratan / Ketentuan" />
                                <p className="text-xs text-gray-500 mb-2">Tambahkan poin-poin persyaratan satu per satu.</p>
                                
                                {data.details.map((detail, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <TextInput 
                                            value={detail} 
                                            onChange={(e) => handleDetailChange(index, e.target.value)} 
                                            className="block w-full" 
                                            placeholder={`Poin persyaratan ke-${index + 1}`}
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
                                    + Tambah Poin Persyaratan
                                </button>
                                <InputError message={errors.details} className="mt-2" />
                            </div>

                            {/* Tombol Submit */}
                            <div className="flex items-center justify-end mt-4 pt-4 border-t">
                                <Link href={route('admin.program.index')}>
                                    <SecondaryButton className="mr-3">Batal</SecondaryButton>
                                </Link>
                                <PrimaryButton disabled={processing}>Simpan Program</PrimaryButton>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}