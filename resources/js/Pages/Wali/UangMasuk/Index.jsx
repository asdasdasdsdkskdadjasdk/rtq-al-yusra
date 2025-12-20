import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function UangMasukWali({ auth, tagihan }) {
    const sisa = tagihan.total_tagihan - tagihan.sudah_dibayar;
    const persentase = (tagihan.sudah_dibayar / tagihan.total_tagihan) * 100;

    return (
        <AuthenticatedLayout>
            <Head title="Tagihan Uang Masuk" />
            
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-500">
                    <h3 className="text-lg font-bold text-gray-800">Status Pembayaran Uang Masuk</h3>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500">Total Tagihan</p>
                            <p className="text-xl font-bold">Rp {tagihan.total_tagihan.toLocaleString('id-ID')}</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500">Sudah Dibayar</p>
                            <p className="text-xl font-bold text-green-600">Rp {tagihan.sudah_dibayar.toLocaleString('id-ID')}</p>
                        </div>
                        <div className="bg-red-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500">Sisa Tagihan</p>
                            <p className="text-xl font-bold text-red-600">Rp {sisa.toLocaleString('id-ID')}</p>
                        </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-6 w-full bg-gray-200 rounded-full h-4">
                        <div className="bg-orange-500 h-4 rounded-full transition-all duration-500" style={{ width: `${persentase}%` }}></div>
                    </div>
                    <p className="text-xs text-right mt-1 text-gray-500">{persentase.toFixed(1)}% Lunas</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h4 className="font-bold mb-4">Riwayat Pembayaran</h4>
                    <ul className="space-y-3">
                        {tagihan.riwayat.map((history) => (
                            <li key={history.id} className="flex justify-between border-b pb-2">
                                <div>
                                    <p className="font-bold text-gray-800">Rp {parseInt(history.jumlah_bayar).toLocaleString('id-ID')}</p>
                                    <p className="text-xs text-gray-500">{new Date(history.tanggal_bayar).toLocaleDateString('id-ID')}</p>
                                </div>
                                <span className="text-sm text-gray-600">{history.keterangan || '-'}</span>
                            </li>
                        ))}
                        {tagihan.riwayat.length === 0 && <p className="text-gray-400 text-sm">Belum ada pembayaran.</p>}
                    </ul>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}