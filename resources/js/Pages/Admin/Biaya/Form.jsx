import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import Checkbox from '@/Components/Checkbox'; 

export default function Form({ auth, biaya }) {
    const isEdit = !!biaya;

    const { data, setData, post, put, processing, errors } = useForm({
        jenis: biaya?.jenis || '',
        nama: biaya?.nama || '',
        color: biaya?.color || '#E85B25',
        featured: biaya?.featured ? true : false,
        items: biaya?.items || [
            { label: '', value: '', note: '' }
        ],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('admin.biaya.update', biaya.id));
        } else {
            post(route('admin.biaya.store'));
        }
    };

    const addItem = () => {
        setData('items', [...data.items, { label: '', value: '', note: '' }]);
    };

    const removeItem = (index) => {
        const newItems = data.items.filter((_, i) => i !== index);
        setData('items', newItems);
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...data.items];
        newItems[index][field] = value;
        setData('items', newItems);
    };

    return (
        // PERBAIKAN DI SINI: Gunakan auth={auth}
        <AuthenticatedLayout auth={auth}>
            <Head title={isEdit ? 'Edit Biaya' : 'Tambah Biaya'} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">{isEdit ? 'Edit Biaya' : 'Tambah Biaya Baru'}</h2>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {/* Jenis (Reguler/Beasiswa) */}
                                <div>
                                    <InputLabel htmlFor="jenis" value="Jenis Program" />
                                    <TextInput
                                        id="jenis"
                                        value={data.jenis}
                                        onChange={(e) => setData('jenis', e.target.value)}
                                        className="mt-1 block w-full"
                                        placeholder="Contoh: Reguler"
                                        required
                                    />
                                    <InputError message={errors.jenis} className="mt-2" />
                                </div>

                                {/* Nama Program */}
                                <div>
                                    <InputLabel htmlFor="nama" value="Nama Program" />
                                    <TextInput
                                        id="nama"
                                        value={data.nama}
                                        onChange={(e) => setData('nama', e.target.value)}
                                        className="mt-1 block w-full"
                                        placeholder="Contoh: Tahfiz Quran"
                                        required
                                    />
                                    <InputError message={errors.nama} className="mt-2" />
                                </div>

                                {/* Warna Kartu */}
                                <div>
                                    <InputLabel htmlFor="color" value="Warna Tema Kartu (Hex)" />
                                    <div className="flex items-center gap-2 mt-1">
                                        <TextInput
                                            id="color"
                                            type="color"
                                            value={data.color}
                                            onChange={(e) => setData('color', e.target.value)}
                                            className="h-10 w-20 p-1 cursor-pointer"
                                        />
                                        <TextInput
                                            type="text"
                                            value={data.color}
                                            onChange={(e) => setData('color', e.target.value)}
                                            className="block w-full uppercase"
                                            placeholder="#E85B25"
                                        />
                                    </div>
                                    <InputError message={errors.color} className="mt-2" />
                                </div>

                                {/* Featured Checkbox */}
                                <div className="flex items-center pt-8">
                                    <label className="flex items-center">
                                        <Checkbox
                                            name="featured"
                                            checked={data.featured}
                                            onChange={(e) => setData('featured', e.target.checked)}
                                        />
                                        <span className="ml-2 text-sm text-gray-600">Jadikan Unggulan (Tengah)</span>
                                    </label>
                                </div>
                            </div>

                            {/* --- AREA DINAMIS: RINCIAN BIAYA --- */}
                            <div className="border-t pt-6 mb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Rincian Biaya</h3>
                                
                                {data.items.map((item, index) => (
                                    <div key={index} className="flex flex-col md:flex-row gap-4 mb-4 bg-gray-50 p-4 rounded-lg items-start">
                                        <div className="flex-1">
                                            <InputLabel value="Label Biaya" />
                                            <TextInput
                                                value={item.label}
                                                onChange={(e) => handleItemChange(index, 'label', e.target.value)}
                                                className="mt-1 block w-full"
                                                placeholder="Contoh: SPP Bulanan"
                                                required
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <InputLabel value="Nominal / Nilai" />
                                            <TextInput
                                                value={item.value}
                                                onChange={(e) => handleItemChange(index, 'value', e.target.value)}
                                                className="mt-1 block w-full"
                                                placeholder="Contoh: Rp. 300.000"
                                                required
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <InputLabel value="Catatan (Opsional)" />
                                            <TextInput
                                                value={item.note || ''}
                                                onChange={(e) => handleItemChange(index, 'note', e.target.value)}
                                                className="mt-1 block w-full text-sm"
                                                placeholder="*Dibayar diawal"
                                            />
                                        </div>
                                        <div className="pt-7">
                                            <button
                                                type="button"
                                                onClick={() => removeItem(index)}
                                                className="text-red-500 hover:text-red-700 font-bold px-2"
                                                title="Hapus Baris Ini"
                                                disabled={data.items.length === 1} 
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="mt-2 text-sm text-alyusra-orange font-bold hover:underline flex items-center gap-1"
                                >
                                    <span>+ Tambah Baris Biaya Lain</span>
                                </button>
                                <InputError message={errors.items} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-end border-t pt-4">
                                <PrimaryButton disabled={processing} className="bg-alyusra-dark-blue">
                                    {isEdit ? 'Simpan Perubahan' : 'Buat Biaya Baru'}
                                </PrimaryButton>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}