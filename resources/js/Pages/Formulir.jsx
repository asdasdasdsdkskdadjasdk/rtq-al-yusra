import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

// Komponen reusable untuk input file (Diperbarui dengan required & accept)
function FileInput({ label, name, onchange, error, required = false }) {
    return (
        <div className="md:col-span-2">
            <InputLabel htmlFor={name} value={label} />
            <input
                id={name}
                name={name}
                type="file"
                // Menerima PDF dan Gambar (sesuai validasi backend)
                accept=".pdf,.jpg,.jpeg,.png"
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"
                onChange={onchange}
                required={required} // <--- Atribut Required ditambahkan
            />
            <p className="text-xs text-gray-500 mt-1">*JPG / PNG (Maks. 2MB)</p>
            <InputError message={error} className="mt-2" />
        </div>
    );
}

export default function Formulir({ auth, program, cabangs }) {
    const { data, setData, post, processing, errors, progress } = useForm({
        // Data program (hidden)
        program_nama: program.nama,
        program_jenis: program.jenis,
        // Data Diri
        nik: '',
        nama: '',
        no_hp: '',
        email: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        umur: '',
        jenis_kelamin: '',
        alamat: '',
        cabang: '',
        // Data Wali
        nama_orang_tua: '',
        // Berkas
        ijazah_terakhir: null,
        kartu_keluarga: null,
        pas_foto: null,
        skbb: null,
        sks: null,
    });

    // Check Validity
    const isFormValid =
        data.nik.length === 16 &&
        data.nama.trim() !== '' &&
        data.no_hp.startsWith('08') && data.no_hp.length >= 10 &&
        data.email.trim() !== '' &&
        data.tempat_lahir.trim() !== '' &&
        data.tanggal_lahir !== '' &&
        data.umur !== '' &&
        data.jenis_kelamin !== '' &&
        data.alamat.trim() !== '' &&
        data.cabang !== '' &&
        data.nama_orang_tua.trim() !== '' &&
        data.ijazah_terakhir !== null &&
        data.kartu_keluarga !== null &&
        data.pas_foto !== null &&
        data.skbb !== null &&
        data.sks !== null;

    function handleSubmit(e) {
        e.preventDefault();
        post(route('formulir.store'));
    }

    return (
        <AppLayout auth={auth} heroTheme="dark">
            <Head title={`Formulir ${program.nama}`} />

            {/* Hero Section */}
            <div
                className="relative bg-gray-800 pb-20 mt-[-80px] overflow-hidden"
                style={{
                    backgroundImage: "url('/images/rtq.jpg')",
                    backgroundSize: 'cover',
                    backgroundAttachment: 'fixed',
                    backgroundPosition: 'center'
                }}
            >
                <div className="absolute inset-0 bg-black/70"></div>

                <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-32">
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-white text-center mb-6">Formulir Pendaftaran</h1>
                </div>
            </div>

            {/* Form Section */}
            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 -mt-16 z-20">
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-lg">
                    <div className="text-center mb-8 border-b pb-6">
                        <p className="font-semibold text-orange-500">{program.jenis}</p>
                        <h2 className="text-3xl font-bold text-gray-800">{program.nama}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* NIK */}
                        <div>
                            <InputLabel htmlFor="nik" value="NIK" />
                            <TextInput
                                id="nik"
                                value={data.nik}
                                onChange={e => {
                                    const val = e.target.value.replace(/\D/g, ''); // Hanya angka
                                    if (val.length <= 16) setData('nik', val);
                                }}
                                className={`mt-1 block w-full ${data.nik.length > 0 && data.nik.length !== 16 ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                                required
                                placeholder="16 Digit Angka"
                            />
                            {data.nik.length > 0 && data.nik.length !== 16 && (
                                <p className="text-xs text-red-500 mt-1">NIK harus 16 digit (Saat ini: {data.nik.length})</p>
                            )}
                            <p className="text-xs text-gray-400 mt-1">* Wajib 16 digit angka sesuai KK/KTP</p>
                            <InputError message={errors.nik} className="mt-2" />
                        </div>
                        {/* Nama */}
                        <div>
                            <InputLabel htmlFor="nama" value="Nama Lengkap" />
                            <TextInput id="nama" value={data.nama} onChange={e => setData('nama', e.target.value)} className="mt-1 block w-full" required />
                            <InputError message={errors.nama} className="mt-2" />
                        </div>
                        {/* No HP */}
                        <div>
                            <InputLabel htmlFor="no_hp" value="No. Handphone" />
                            <TextInput
                                id="no_hp"
                                type="tel"
                                value={data.no_hp}
                                onChange={e => {
                                    const val = e.target.value.replace(/\D/g, ''); // Hanya angka
                                    if (val.length <= 15) setData('no_hp', val);
                                }}
                                className={`mt-1 block w-full ${data.no_hp.length > 0 && !data.no_hp.startsWith('08') ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                                required
                                placeholder="Contoh: 08123456789"
                            />
                            {data.no_hp.length > 0 && !data.no_hp.startsWith('08') && (
                                <p className="text-xs text-red-500 mt-1">Nomor HP harus diawali '08'</p>
                            )}
                            <p className="text-xs text-gray-400 mt-1">* Wajib diawali 08, Min 10 - Max 15 digit</p>
                            <InputError message={errors.no_hp} className="mt-2" />
                        </div>
                        {/* Email */}
                        <div>
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput id="email" type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="mt-1 block w-full" required />
                            <InputError message={errors.email} className="mt-2" />
                        </div>
                        {/* Tempat Lahir */}
                        <div>
                            <InputLabel htmlFor="tempat_lahir" value="Tempat Lahir" />
                            <TextInput id="tempat_lahir" value={data.tempat_lahir} onChange={e => setData('tempat_lahir', e.target.value)} className="mt-1 block w-full" required />
                            <InputError message={errors.tempat_lahir} className="mt-2" />
                        </div>
                        {/* Tanggal Lahir */}
                        <div>
                            <InputLabel htmlFor="tanggal_lahir" value="Tanggal Lahir" />
                            <TextInput id="tanggal_lahir" type="date" value={data.tanggal_lahir} onChange={e => setData('tanggal_lahir', e.target.value)} className="mt-1 block w-full" required />
                            <InputError message={errors.tanggal_lahir} className="mt-2" />
                        </div>
                        {/* Umur */}
                        <div>
                            <InputLabel htmlFor="umur" value="Umur (Tahun)" />
                            <TextInput id="umur" type="number" min="1" max="100" value={data.umur} onChange={e => setData('umur', e.target.value)} className="mt-1 block w-full" required />
                            <InputError message={errors.umur} className="mt-2" />
                        </div>
                        {/* Jenis Kelamin */}
                        <div>
                            <InputLabel htmlFor="jenis_kelamin" value="Jenis Kelamin" />
                            <select id="jenis_kelamin" value={data.jenis_kelamin} onChange={e => setData('jenis_kelamin', e.target.value)} className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm" required>
                                <option value="">Pilih Jenis Kelamin</option>
                                <option value="Laki-laki">Laki-laki</option>
                                <option value="Perempuan">Perempuan</option>
                            </select>
                            <InputError message={errors.jenis_kelamin} className="mt-2" />
                        </div>

                        {/* Alamat */}
                        <div className="md:col-span-2">
                            <InputLabel htmlFor="alamat" value="Alamat Lengkap" />
                            <textarea id="alamat" value={data.alamat} onChange={e => setData('alamat', e.target.value)} className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm" rows="3" required></textarea>
                            <InputError message={errors.alamat} className="mt-2" />
                        </div>

                        {/* Pilihan Cabang */}
                        <div>
                            <InputLabel htmlFor="cabang" value="Pilih Cabang" />
                            <select
                                id="cabang"
                                value={data.cabang}
                                onChange={(e) => setData('cabang', e.target.value)}
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                required
                            >
                                <option value="">-- Pilih Lokasi Cabang --</option>
                                {cabangs && cabangs.length > 0 ? (
                                    cabangs.map((c) => (
                                        <option key={c.id} value={c.nama}>
                                            {c.nama}
                                        </option>
                                    ))
                                ) : (
                                    <option value="Pusat">Pusat (Default)</option>
                                )}
                            </select>
                            <InputError message={errors.cabang} className="mt-2" />
                        </div>

                        {/* Nama Orang Tua */}
                        <div>
                            <InputLabel htmlFor="nama_orang_tua" value="Nama Orang Tua / Wali" />
                            <TextInput id="nama_orang_tua" value={data.nama_orang_tua} onChange={e => setData('nama_orang_tua', e.target.value)} className="mt-1 block w-full" required />
                            <InputError message={errors.nama_orang_tua} className="mt-2" />
                        </div>

                        {/* Berkas Section */}
                        <div className="md:col-span-2 mt-4">
                            <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Berkas Pendukung (Wajib)</h3>
                        </div>

                        {/* SEMUA FILE DIBAWAH INI DIBERI PROPS 'required' */}
                        <FileInput
                            label="Upload Ijazah Terakhir"
                            name="ijazah_terakhir"
                            error={errors.ijazah_terakhir}
                            onchange={e => setData('ijazah_terakhir', e.target.files[0])}
                            required
                        />
                        <FileInput
                            label="Upload Kartu Keluarga"
                            name="kartu_keluarga"
                            error={errors.kartu_keluarga}
                            onchange={e => setData('kartu_keluarga', e.target.files[0])}
                            required
                        />
                        <FileInput
                            label="Upload Pas Foto"
                            name="pas_foto"
                            error={errors.pas_foto}
                            onchange={e => setData('pas_foto', e.target.files[0])}
                            required
                        />
                        <FileInput
                            label="Upload Surat Keterangan Berkelakuan Baik (Sekolah)"
                            name="skbb"
                            error={errors.skbb}
                            onchange={e => setData('skbb', e.target.files[0])}
                            required
                        />
                        <FileInput
                            label="Upload Surat Keterangan Sehat (Rumah Sakit)"
                            name="sks"
                            error={errors.sks}
                            onchange={e => setData('sks', e.target.files[0])}
                            required
                        />
                    </div>

                    {progress && (
                        <div className="w-full bg-gray-200 rounded-full mt-6">
                            <div className="bg-green-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: `${progress.percentage}%` }}>
                                {progress.percentage}%
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end mt-8">
                        <PrimaryButton
                            className={`bg-orange-600 hover:bg-orange-700 ${!isFormValid || processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={!isFormValid || processing}
                        >
                            {processing ? 'Mengirim...' : 'Kirim Formulir'}
                        </PrimaryButton>
                    </div>
                </form>
            </div>

            <div className="pb-16"></div>
        </AppLayout>
    );
}