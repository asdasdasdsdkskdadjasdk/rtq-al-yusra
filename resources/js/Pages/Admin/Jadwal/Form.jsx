import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';

export default function Form({ auth, jadwal }) {
    const isEdit = !!jadwal;
    const { data, setData, post, put, processing, errors } = useForm({
        gelombang: jadwal?.gelombang || '',
        tahapan: jadwal?.tahapan || [
            { title: 'Pendaftaran', date: '', color: 'white' },
            { title: 'Tes Masuk', date: '', color: 'orange' },
            { title: 'Pengumuman', date: '', color: 'white' },
            { title: 'Daftar Ulang', date: '', color: 'orange' },
        ],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        isEdit ? put(route('admin.jadwal.update', jadwal.id)) : post(route('admin.jadwal.store'));
    };

    const handleTahapanChange = (index, field, value) => {
        const newTahapan = [...data.tahapan];
        newTahapan[index][field] = value;
        setData('tahapan', newTahapan);
    };

    const addTahapan = () => setData('tahapan', [...data.tahapan, { title: '', date: '', color: 'white' }]);
    const removeTahapan = (index) => setData('tahapan', data.tahapan.filter((_, i) => i !== index));

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title={isEdit ? 'Edit Jadwal' : 'Tambah Jadwal'} />
            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-6">{isEdit ? 'Edit Gelombang' : 'Tambah Gelombang Baru'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <InputLabel value="Nama Gelombang" />
                                <TextInput 
                                    value={data.gelombang} 
                                    onChange={e => setData('gelombang', e.target.value)} 
                                    className="w-full mt-1" 
                                    placeholder="Contoh: Gelombang I"
                                    required
                                />
                                <InputError message={errors.gelombang} />
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="font-medium mb-3">Rincian Kegiatan & Tanggal</h3>
                                {data.tahapan.map((item, index) => (
                                    <div key={index} className="flex flex-col md:flex-row gap-4 mb-4 bg-gray-50 p-4 rounded-lg">
                                        <div className="flex-1">
                                            <InputLabel value="Nama Kegiatan" />
                                            <TextInput 
                                                value={item.title} 
                                                onChange={e => handleTahapanChange(index, 'title', e.target.value)} 
                                                className="w-full mt-1"
                                                placeholder="Misal: Tes Masuk"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <InputLabel value="Tanggal / Keterangan Waktu" />
                                            <TextInput 
                                                value={item.date} 
                                                onChange={e => handleTahapanChange(index, 'date', e.target.value)} 
                                                className="w-full mt-1"
                                                placeholder="Misal: s.d 22 Mei 2025"
                                            />
                                        </div>
                                        <div className="w-32">
                                            <InputLabel value="Warna Card" />
                                            <select 
                                                value={item.color} 
                                                onChange={e => handleTahapanChange(index, 'color', e.target.value)}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            >
                                                <option value="white">Putih</option>
                                                <option value="orange">Orange</option>
                                            </select>
                                        </div>
                                        <div className="pt-7">
                                            <button type="button" onClick={() => removeTahapan(index)} className="text-red-500 font-bold hover:text-red-700">✕</button>
                                        </div>
                                    </div>
                                ))}
                                <button type="button" onClick={addTahapan} className="text-sm text-alyusra-orange font-bold hover:underline">+ Tambah Kegiatan Lain</button>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <PrimaryButton disabled={processing} className="bg-alyusra-dark-blue">Simpan Jadwal</PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}