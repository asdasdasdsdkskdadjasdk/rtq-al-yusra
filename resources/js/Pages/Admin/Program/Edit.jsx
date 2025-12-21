import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Checkbox from '@/Components/Checkbox';

export default function Edit({ auth, program }) {
    const { data, setData, put, processing, errors } = useForm({
        jenis: program.jenis,
        nama: program.nama,
        batas_pendaftaran: program.batas_pendaftaran,
        tes: program.tes,
        biaya: program.biaya,
        
        // --- DATA BARU (Load dari DB) ---
        nominal_uang_masuk: program.nominal_uang_masuk || '',
        nominal_spp: program.nominal_spp || '',
        // --------------------------------

        color: program.color,
        featured: Boolean(program.featured),
        details: program.details || [''], 
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

    const addDetail = () => setData('details', [...data.details, '']);
    const removeDetail = (index) => setData('details', data.details.filter((_, i) => i !== index));

    const submit = (e) => {
        e.preventDefault();
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
                            
                            {/* Baris 1 */}
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

                            {/* Baris 2 */}
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

                            {/* Baris 3: INPUT HARGA (PENTING) */}
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <h3 className="font-bold text-blue-800 mb-3">Pengaturan Harga (Sistem Pembayaran)</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="nominal_uang_masuk" value="Nominal Uang Masuk (Rp)" />
                                        <TextInput type="number" id="nominal_uang_masuk" name="nominal_uang_masuk" value={data.nominal_uang_masuk} onChange={handleChange} className="mt-1 block w-full" required />
                                        <InputError message={errors.nominal_uang_masuk} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="nominal_spp" value="Nominal SPP Bulanan (Rp)" />
                                        <TextInput type="number" id="nominal_spp" name="nominal_spp" value={data.nominal_spp} onChange={handleChange} className="mt-1 block w-full" required />
                                        <InputError message={errors.nominal_spp} className="mt-2" />
                                    </div>
                                </div>
                                <p className="text-xs text-blue-600 mt-2">* Isi dengan angka 0 jika program ini GRATIS (Beasiswa).</p>
                            </div>

                            {/* Baris 4: Tampilan Kartu */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="biaya" value="Label Biaya (Teks)" />
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
                                        <TextInput value={detail} onChange={(e) => handleDetailChange(index, e.target.value)} className="block w-full" required />
                                        {data.details.length > 1 && (
                                            <button type="button" onClick={() => removeDetail(index)} className="bg-red-100 text-red-600 px-3 rounded hover:bg-red-200">✕</button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={addDetail} className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium">+ Tambah Poin</button>
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