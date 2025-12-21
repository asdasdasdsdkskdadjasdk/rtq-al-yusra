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
        biaya: '', // Ini untuk Teks Tampilan di Kartu (misal: "Gratis" atau "300rb")
        
        // --- DATA BARU (WAJIB ADA) ---
        nominal_uang_masuk: '', // Untuk Logika Pembayaran
        nominal_spp: '',        // Untuk Logika Pembayaran
        // -----------------------------

        color: '#E85B25',
        featured: false,
        details: [''],
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
                            
                            {/* Baris 1: Info Dasar */}
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

                            {/* Baris 2: Waktu & Tes */}
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

                            {/* Baris 3: SISTEM HARGA (PENTING) */}
                            <div className="p-5 bg-blue-50 border border-blue-100 rounded-lg">
                                <h3 className="font-bold text-blue-800 mb-4 text-sm uppercase tracking-wide">Pengaturan Harga Sistem</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="nominal_uang_masuk" value="Nominal Uang Masuk (Rp)" />
                                        <TextInput 
                                            type="number" 
                                            id="nominal_uang_masuk" 
                                            name="nominal_uang_masuk" 
                                            value={data.nominal_uang_masuk} 
                                            onChange={handleChange} 
                                            className="mt-1 block w-full border-blue-300 focus:border-blue-500 focus:ring-blue-500" 
                                            placeholder="5000000" 
                                            required 
                                        />
                                        <InputError message={errors.nominal_uang_masuk} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="nominal_spp" value="Nominal SPP Bulanan (Rp)" />
                                        <TextInput 
                                            type="number" 
                                            id="nominal_spp" 
                                            name="nominal_spp" 
                                            value={data.nominal_spp} 
                                            onChange={handleChange} 
                                            className="mt-1 block w-full border-blue-300 focus:border-blue-500 focus:ring-blue-500" 
                                            placeholder="300000" 
                                            required 
                                        />
                                        <InputError message={errors.nominal_spp} className="mt-2" />
                                    </div>
                                </div>
                                <p className="text-xs text-blue-600 mt-2 italic">* Masukkan angka 0 jika program ini GRATIS (Beasiswa).</p>
                            </div>

                            {/* Baris 4: Tampilan Kartu */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="biaya" value="Label Biaya (Teks Tampilan)" />
                                    <TextInput id="biaya" name="biaya" value={data.biaya} onChange={handleChange} className="mt-1 block w-full" placeholder="Contoh: Rp 300rb / Gratis" required />
                                    <InputError message={errors.biaya} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="color" value="Warna Kartu (Hex Code)" />
                                    <div className="flex items-center gap-2 mt-1">
                                        <input type="color" name="color" value={data.color} onChange={handleChange} className="h-10 w-10 border bg-white cursor-pointer rounded shadow-sm" />
                                        <TextInput id="color" name="color" value={data.color} onChange={handleChange} className="block w-full" placeholder="#E85B25" required />
                                    </div>
                                    <InputError message={errors.color} className="mt-2" />
                                </div>
                            </div>

                            {/* Featured Checkbox */}
                            <div className="block bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <label className="flex items-center cursor-pointer">
                                    <Checkbox name="featured" checked={data.featured} onChange={handleChange} />
                                    <span className="ms-2 text-sm font-medium text-gray-700">Jadikan Program Unggulan (Tampil Lebih Besar)</span>
                                </label>
                            </div>

                            {/* Detail Persyaratan (Dinamis) */}
                            <div>
                                <InputLabel value="Detail Persyaratan / Ketentuan" className="mb-2" />
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
                                                className="bg-red-100 text-red-600 px-3 rounded hover:bg-red-200 transition"
                                                title="Hapus poin ini"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}
                                
                                <button type="button" onClick={addDetail} className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                    Tambah Poin Persyaratan
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