import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function LaporanIndex({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        kategori: 'spp',
        start_date: new Date().toISOString().split('T')[0], // Hari ini
        end_date: new Date().toISOString().split('T')[0],   // Hari ini
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Gunakan window.open untuk mendownload file agar tidak mengganggu state Inertia
        // Kita buat form manual submit via browser standard action untuk download file
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = route('admin.laporan.export');
        
        // CSRF Token
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = '_token';
        csrfInput.value = csrfToken;
        form.appendChild(csrfInput);

        // Data Inputs
        ['kategori', 'start_date', 'end_date'].forEach(key => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = data[key];
            form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Laporan Keuangan</h2>}
        >
            <Head title="Export Laporan" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-8">
                            
                            <div className="mb-6 border-b pb-4">
                                <h3 className="text-lg font-bold text-gray-900">Export Data Laporan</h3>
                                <p className="text-sm text-gray-500">Pilih kategori dan rentang tanggal untuk mengunduh laporan dalam format Excel (CSV).</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                
                                {/* KATEGORI SELECTION */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Jenis Laporan</label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        
                                        {/* Card SPP */}
                                        <label className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center transition-all ${data.kategori === 'spp' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                                            <input type="radio" name="kategori" value="spp" className="hidden" checked={data.kategori === 'spp'} onChange={e => setData('kategori', e.target.value)} />
                                            <span className="text-3xl mb-2">📅</span>
                                            <span className={`font-bold ${data.kategori === 'spp' ? 'text-blue-700' : 'text-gray-600'}`}>Laporan SPP</span>
                                        </label>

                                        {/* Card Uang Masuk */}
                                        <label className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center transition-all ${data.kategori === 'uang_masuk' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}>
                                            <input type="radio" name="kategori" value="uang_masuk" className="hidden" checked={data.kategori === 'uang_masuk'} onChange={e => setData('kategori', e.target.value)} />
                                            <span className="text-3xl mb-2">💰</span>
                                            <span className={`font-bold ${data.kategori === 'uang_masuk' ? 'text-green-700' : 'text-gray-600'}`}>Uang Masuk</span>
                                        </label>

                                        {/* Card Formulir */}
                                        <label className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center transition-all ${data.kategori === 'formulir' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'}`}>
                                            <input type="radio" name="kategori" value="formulir" className="hidden" checked={data.kategori === 'formulir'} onChange={e => setData('kategori', e.target.value)} />
                                            <span className="text-3xl mb-2">📝</span>
                                            <span className={`font-bold ${data.kategori === 'formulir' ? 'text-purple-700' : 'text-gray-600'}`}>Data Formulir</span>
                                        </label>
                                    </div>
                                </div>

                                {/* DATE RANGE */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Dari Tanggal</label>
                                        <input 
                                            type="date" 
                                            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            value={data.start_date}
                                            onChange={e => setData('start_date', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Sampai Tanggal</label>
                                        <input 
                                            type="date" 
                                            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            value={data.end_date}
                                            onChange={e => setData('end_date', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* SUBMIT BUTTON */}
                                <div className="pt-4 flex justify-end border-t">
                                    <button 
    type="submit" 
    className="inline-flex items-center px-6 py-3 bg-green-700 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-800 active:bg-green-900 focus:outline-none focus:border-green-900 focus:ring ring-green-300 disabled:opacity-25 transition ease-in-out duration-150 gap-2"
>
    {/* Ganti ikon excel jika mau */}
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
    Download Excel (.XLSX)
</button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}