import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal'; // Pastikan Anda punya komponen Modal

export default function AdminUangMasuk({ auth, data }) {
    const [selectedUser, setSelectedUser] = useState(null);
    const { data: formData, setData, post, processing, reset, errors } = useForm({
        jumlah_bayar: '',
        keterangan: ''
    });

    const handleOpenModal = (item) => {
        setSelectedUser(item);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.uang_masuk.pay', selectedUser.id), {
            onSuccess: () => setSelectedUser(null)
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Kelola Uang Masuk" />
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-700">
                        <tr>
                            <th className="p-3">Nama Wali</th>
                            <th className="p-3">Total Tagihan</th>
                            <th className="p-3">Sudah Dibayar</th>
                            <th className="p-3">Sisa</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(item => {
                            const sisa = item.total_tagihan - item.sudah_dibayar;
                            return (
                                <tr key={item.id} className="border-b">
                                    <td className="p-3 font-bold">{item.user.name}</td>
                                    <td className="p-3">Rp {parseInt(item.total_tagihan).toLocaleString()}</td>
                                    <td className="p-3 text-green-600">Rp {parseInt(item.sudah_dibayar).toLocaleString()}</td>
                                    <td className="p-3 text-red-600">Rp {sisa.toLocaleString()}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${item.status === 'Lunas' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        {item.status !== 'Lunas' && (
                                            <button 
                                                onClick={() => handleOpenModal(item)}
                                                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs"
                                            >
                                                + Bayar
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Modal Input Pembayaran */}
            <Modal show={!!selectedUser} onClose={() => setSelectedUser(null)}>
                <div className="p-6">
                    <h3 className="text-lg font-bold mb-4">Input Pembayaran: {selectedUser?.user.name}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm">Jumlah Bayar</label>
                            <input 
                                type="number" 
                                className="w-full border rounded p-2"
                                value={formData.jumlah_bayar}
                                onChange={e => setData('jumlah_bayar', e.target.value)}
                            />
                            {errors.jumlah_bayar && <p className="text-red-500 text-xs">{errors.jumlah_bayar}</p>}
                        </div>
                        <div>
                            <label className="block text-sm">Keterangan (Opsional)</label>
                            <input 
                                type="text" 
                                className="w-full border rounded p-2"
                                placeholder="Contoh: Cicilan 1"
                                value={formData.keterangan}
                                onChange={e => setData('keterangan', e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setSelectedUser(null)} className="bg-gray-300 px-4 py-2 rounded">Batal</button>
                            <button type="submit" disabled={processing} className="bg-blue-600 text-white px-4 py-2 rounded">Simpan</button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}