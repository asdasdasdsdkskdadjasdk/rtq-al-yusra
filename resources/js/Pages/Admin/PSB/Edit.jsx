import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';

export default function Edit({ auth, pendaftar }) {
    
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT', // Trick agar bisa upload file di mode Update
        status: pendaftar.status || '',
        
        // Data Diri
        nama: pendaftar.nama || '',
        nik: pendaftar.nik || '',
        no_hp: pendaftar.no_hp || '',
        email: pendaftar.email || '',
        tempat_lahir: pendaftar.tempat_lahir || '',
        tanggal_lahir: pendaftar.tanggal_lahir || '',
        jenis_kelamin: pendaftar.jenis_kelamin || '',
        alamat: pendaftar.alamat || '',
        
        // Data Orang Tua & Program
        nama_orang_tua: pendaftar.nama_orang_tua || '',
        cabang: pendaftar.cabang || '',
        program_nama: pendaftar.program_nama || '',
        program_jenis: pendaftar.program_jenis || '',

        // File (Biarkan null awalnya, hanya diisi jika user upload baru)
        ijazah_terakhir: null,
        kartu_keluarga: null,
        pas_foto: null,
        skbb: null,
        sks: null,
    });

    const submit = (e) => {
        e.preventDefault();
        // Gunakan post karena ada file upload, tapi method spoofing PUT sudah ada di data._method
        post(route('psb.pendaftaran.update', pendaftar.id));
    };

    // Helper input file
    const FileInput = ({ label, fieldName, currentFile }) => (
        <div className="border p-4 rounded-lg bg-gray-50">
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            
            {/* Tampilkan file saat ini jika ada */}
            {currentFile && (
                <div className="mb-3 text-xs">
                    <span className="text-gray-500">File Saat Ini: </span>
                    <a href={`/storage/${currentFile}`} target="_blank" className="text-blue-600 hover:underline break-all">
                        {currentFile.split('/').pop()}
                    </a>
                </div>
            )}

            <input
                type="file"
                onChange={(e) => setData(fieldName, e.target.files[0])}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
            />
            {errors[fieldName] && <div className="text-red-500 text-sm mt-1">{errors[fieldName]}</div>}
        </div>
    );

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Edit Formulir Pendaftaran" />

            <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg my-8">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Edit Lengkap Pendaftaran</h2>
                    <Link href={route('psb.pendaftaran.index')} className="text-gray-500 hover:text-gray-700">Kembali</Link>
                </div>

                <form onSubmit={submit} className="space-y-8">
                    
                    {/* SECTION 1: STATUS UTAMA */}
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                        <label className="block text-lg font-bold text-blue-900 mb-2">Status Pendaftaran</label>
                        <select
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            className="w-full border-blue-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3"
                        >
                            <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                            <option value="Sudah Diverifikasi">Sudah Diverifikasi</option>
                            <option value="Menunggu Hasil Pendaftaran">Menunggu Hasil Pendaftaran</option>
                            <option value="Lulus">Lulus</option>
                            <option value="Tidak Lulus">Tidak Lulus</option>
                        </select>
                        {errors.status && <div className="text-red-500 text-sm mt-1">{errors.status}</div>}
                    </div>

                    {/* SECTION 2: BIODATA */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4 border-l-4 border-orange-500 pl-3">Biodata Santri</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                                <input type="text" value={data.nama} onChange={(e) => setData('nama', e.target.value)} className="mt-1 w-full border-gray-300 rounded-lg shadow-sm" />
                                {errors.nama && <div className="text-red-500 text-sm mt-1">{errors.nama}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">NIK</label>
                                <input type="text" value={data.nik} onChange={(e) => setData('nik', e.target.value)} className="mt-1 w-full border-gray-300 rounded-lg shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tempat Lahir</label>
                                <input type="text" value={data.tempat_lahir} onChange={(e) => setData('tempat_lahir', e.target.value)} className="mt-1 w-full border-gray-300 rounded-lg shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tanggal Lahir</label>
                                <input type="date" value={data.tanggal_lahir} onChange={(e) => setData('tanggal_lahir', e.target.value)} className="mt-1 w-full border-gray-300 rounded-lg shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Jenis Kelamin</label>
                                <select value={data.jenis_kelamin} onChange={(e) => setData('jenis_kelamin', e.target.value)} className="mt-1 w-full border-gray-300 rounded-lg shadow-sm">
                                    <option value="">Pilih</option>
                                    <option value="Laki-laki">Laki-laki</option>
                                    <option value="Perempuan">Perempuan</option>
                                </select>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">No HP</label>
                                <input type="text" value={data.no_hp} onChange={(e) => setData('no_hp', e.target.value)} className="mt-1 w-full border-gray-300 rounded-lg shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className="mt-1 w-full border-gray-300 rounded-lg shadow-sm" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Alamat Lengkap</label>
                                <textarea value={data.alamat} onChange={(e) => setData('alamat', e.target.value)} className="mt-1 w-full border-gray-300 rounded-lg shadow-sm" rows="3" />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: PROGRAM & ORTU */}
                    <div>
                         <h3 className="text-lg font-bold text-gray-800 mb-4 border-l-4 border-orange-500 pl-3">Program & Orang Tua</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Program</label>
                                <input type="text" value={data.program_nama} onChange={(e) => setData('program_nama', e.target.value)} className="mt-1 w-full border-gray-300 rounded-lg shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Jenis Program (Reguler/Mukim)</label>
                                <select value={data.program_jenis} onChange={(e) => setData('program_jenis', e.target.value)} className="mt-1 w-full border-gray-300 rounded-lg shadow-sm">
                                    <option value="Reguler">Reguler</option>
                                    <option value="Mukim">Mukim</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nama Orang Tua</label>
                                <input type="text" value={data.nama_orang_tua} onChange={(e) => setData('nama_orang_tua', e.target.value)} className="mt-1 w-full border-gray-300 rounded-lg shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Cabang Pilihan</label>
                                <input type="text" value={data.cabang} onChange={(e) => setData('cabang', e.target.value)} className="mt-1 w-full border-gray-300 rounded-lg shadow-sm" />
                            </div>
                         </div>
                    </div>

                    {/* SECTION 4: BERKAS (FILE UPLOAD) */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4 border-l-4 border-orange-500 pl-3">Update Berkas (Upload untuk mengganti)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <FileInput label="Pas Foto" fieldName="pas_foto" currentFile={pendaftar.pas_foto} />
                            <FileInput label="Kartu Keluarga" fieldName="kartu_keluarga" currentFile={pendaftar.kartu_keluarga} />
                            <FileInput label="Ijazah Terakhir" fieldName="ijazah_terakhir" currentFile={pendaftar.ijazah_terakhir} />
                            <FileInput label="SKBB (Kelakuan Baik)" fieldName="skbb" currentFile={pendaftar.skbb} />
                            <FileInput label="Surat Keterangan Sehat" fieldName="sks" currentFile={pendaftar.sks} />
                        </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex justify-end gap-3 pt-6 border-t mt-6">
                        <Link
                            href={route('psb.pendaftaran.index')}
                            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-bold"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition shadow-lg"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Semua Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}