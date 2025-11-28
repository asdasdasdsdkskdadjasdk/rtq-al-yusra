// resources/js/Pages/Auth/Register.jsx

import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function Register() {
    // useForm diinisialisasi dengan field tambahan untuk registrasi
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    // Membersihkan error password saat komponen di-unmount
    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    // Fungsi yang dijalankan saat tombol Register ditekan
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <>
            <Head title="Register" />

            {/* Kontainer Utama dengan Background Penuh */}
            <div 
                className="min-h-screen bg-gray-100 bg-cover bg-center flex flex-col justify-center items-center p-4" 
                style={{ backgroundImage: "url('/images/rtq-gedung.jpg')" }}
            >
                
                <div className="absolute inset-0 bg-black/60 z-0"></div>

                <div className="relative z-10 w-full flex flex-col justify-center items-center">

                    {/* Kotak Register Kustom */}
                    <form 
                        onSubmit={handleSubmit} 
                        className="w-full max-w-md bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl"
                    >
                        {/* Logo di Dalam Form */}
                        <div className="flex justify-center mb-6">
                            <Link href="/">
                                <img src="/images/logo3.png" alt="Logo RTQ Al Yusra" className="w-24 h-24" />
                            </Link>
                        </div>
                        
                        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
                            REGISTER
                        </h1>

                        {/* Input untuk Nama */}
                        <div>
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="mt-1 block w-full border-none rounded-lg py-3 px-4 text-lg"
                                placeholder="Masukkan Nama Lengkap"
                                isFocused={true}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        {/* Input untuk Email */}
                        <div className="mt-4">
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full border-none rounded-lg py-3 px-4 text-lg"
                                placeholder="Masukkan Email"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        {/* Input untuk Password */}
                        <div className="mt-4">
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full border-none rounded-lg py-3 px-4 text-lg"
                                placeholder="Masukkan Password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        {/* Input untuk Konfirmasi Password */}
                        <div className="mt-4">
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-1 block w-full border-none rounded-lg py-3 px-4 text-lg"
                                placeholder="Konfirmasi Password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                            />
                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>

                        {/* Tombol Register */}
                        <div className="mt-8">
                            <PrimaryButton className="w-full justify-center py-3 bg-alyusra-green hover:bg-alyusra-green/90 text-lg" disabled={processing}>
                                Register
                            </PrimaryButton>
                        </div>

                        {/* Link untuk Halaman Login */}
                        <div className="text-center mt-6">
                            <p className="text-sm text-gray-600">
                                Sudah punya akun?{' '}
                                <Link
                                    href={route('login')}
                                    className="font-semibold text-alyusra-orange hover:underline"
                                >
                                    Login di sini
                                </Link>
                            </p>
                        </div>
                    </form>

                    {/* Footer di Bawah Halaman */}
                    <footer className="text-center text-white text-sm mt-8 drop-shadow-md">
                        <p>Powered by RTQ Al-Yusra</p>
                        <p>&copy; {new Date().getFullYear()} 1KANASEM</p>
                    </footer>
                </div>
            </div>
        </>
    );
}