import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';

export default function SettingIndex({ auth, settings, cabangs }) {

    // 1. TAMBAHKAN 'link_grup_wa' DALAM STATE FORM
    const { data, setData, post, processing } = useForm({
        nama_sekolah: settings.nama_sekolah || '',
        alamat_pusat: settings.alamat_pusat || '',
        email: settings.email || '',
        no_hp: settings.no_hp || '',
        facebook: settings.facebook || '',
        instagram: settings.instagram || '',
        youtube: settings.youtube || '',
        link_grup_wa: settings.link_grup_wa || '', // <--- FIELD BARU
    });

    const [cabangData, setCabangData] = React.useState({ nama: '', alamat: '' });

    const submitSettings = (e) => {
        e.preventDefault();
        post(route('admin.settings.update'), {
            preserveScroll: true,
        });
    };

    const submitCabang = (e) => {
        e.preventDefault();
        router.post(route('admin.cabang.store'), cabangData, {
            preserveScroll: true,
            onSuccess: () => setCabangData({ nama: '', alamat: '' })
        });
    };

    const deleteCabang = (id) => {
        if (confirm('Yakin ingin menghapus cabang ini?')) {
            router.delete(route('admin.cabang.destroy', id), { preserveScroll: true });
        }
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Pengaturan Website" />

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Pengaturan Website</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* KOLOM KIRI: IDENTITAS & SOSMED */}
                    <div className="space-y-8">
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                Identitas & Kontak
                            </h2>
                            <form onSubmit={submitSettings} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nama Sekolah / Yayasan</label>
                                    <input
                                        type="text"
                                        value={data.nama_sekolah}
                                        onChange={e => setData('nama_sekolah', e.target.value)}
                                        className="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Alamat Pusat</label>
                                    <textarea
                                        value={data.alamat_pusat}
                                        onChange={e => setData('alamat_pusat', e.target.value)}
                                        rows="3"
                                        className="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500"
                                    ></textarea>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email Resmi</label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            className="mt-1 w-full border-gray-300 rounded-lg shadow-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">No HP / WhatsApp</label>
                                        <input
                                            type="text"
                                            value={data.no_hp}
                                            onChange={e => setData('no_hp', e.target.value)}
                                            className="mt-1 w-full border-gray-300 rounded-lg shadow-sm"
                                        />
                                    </div>
                                </div>

                                {/* --- INPUT BARU: LINK GRUP WA --- */}
                                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                                    <label className="block text-sm font-bold text-orange-800 mb-1">
                                        Link Grup WhatsApp (Santri Baru)
                                    </label>
                                    <input
                                        type="url"
                                        value={data.link_grup_wa}
                                        onChange={e => setData('link_grup_wa', e.target.value)}
                                        placeholder="https://chat.whatsapp.com/..."
                                        className="mt-1 w-full border-orange-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 text-sm"
                                    />
                                    <p className="text-xs text-orange-600 mt-1">
                                        *Link ini akan muncul di halaman status santri yang sudah Lulus & Daftar Ulang.
                                    </p>
                                </div>

                                <hr className="my-4 border-gray-100" />

                                <h3 className="font-bold text-gray-700 mb-2">Sosial Media</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <span className="w-24 text-sm text-gray-500">Facebook</span>
                                        <input type="url" value={data.facebook} onChange={e => setData('facebook', e.target.value)} className="w-full text-sm border-gray-300 rounded-md" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-24 text-sm text-gray-500">Instagram</span>
                                        <input type="url" value={data.instagram} onChange={e => setData('instagram', e.target.value)} className="w-full text-sm border-gray-300 rounded-md" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-24 text-sm text-gray-500">YouTube</span>
                                        <input type="url" value={data.youtube} onChange={e => setData('youtube', e.target.value)} className="w-full text-sm border-gray-300 rounded-md" />
                                    </div>
                                </div>

                                <div className="pt-4 text-right">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-lg transition shadow-md"
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* KOLOM KANAN: MANAJEMEN CABANG */}
                    <div>
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 h-full">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                Manajemen Cabang
                            </h2>

                            <form onSubmit={submitCabang} className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                                <h3 className="text-sm font-bold text-gray-700 mb-3">Tambah Cabang Baru</h3>
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Nama Cabang (Cth: Cabang Panam)"
                                        value={cabangData.nama}
                                        onChange={e => setCabangData({ ...cabangData, nama: e.target.value })}
                                        className="w-full border-gray-300 rounded-md text-sm"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Alamat Singkat (Opsional)"
                                        value={cabangData.alamat}
                                        onChange={e => setCabangData({ ...cabangData, alamat: e.target.value })}
                                        className="w-full border-gray-300 rounded-md text-sm"
                                    />
                                    <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold py-2 rounded-md transition">
                                        + Tambah Cabang
                                    </button>
                                </div>
                            </form>

                            <h3 className="text-sm font-bold text-gray-700 mb-3">Daftar Cabang Aktif:</h3>
                            <div className="space-y-2 max-h-[400px] overflow-y-auto">
                                {cabangs.map((cabang) => (
                                    <div key={cabang.id} className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                                        <div>
                                            <p className="font-bold text-gray-800 text-sm">{cabang.nama}</p>
                                            <p className="text-xs text-gray-500">{cabang.alamat || '-'}</p>
                                        </div>
                                        <button
                                            onClick={() => deleteCabang(cabang.id)}
                                            className="text-red-500 hover:text-red-700 p-2"
                                            title="Hapus"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}