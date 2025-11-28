// resources/js/Pages/Auth/Login.jsx

import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <>
            <Head title="Log in" />

            <div 
                className="min-h-screen bg-gray-100 bg-cover bg-center flex flex-col justify-center items-center p-4" 
                style={{ backgroundImage: "url('/images/rtq-gedung.jpg')" }}
            >
                
                {/* 1. PENAMBAHAN OVERLAY GELAP */}
                <div className="absolute inset-0 bg-black/60 z-0"></div>

                {/* 2. KONTEN DIBUAT RELATIVE AGAR BERADA DI ATAS OVERLAY */}
                <div className="relative z-10 w-full flex flex-col justify-center items-center">
                    
                    {/* Logo tidak lagi di sini, sudah dipindahkan ke dalam form */}

                    {/* Kotak Login Kustom */}
                    <form 
                        onSubmit={handleSubmit} 
                        className="w-full max-w-md bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl"
                    >
                        {/* 3. LOGO DIPINDAHKAN KE DALAM FORM */}
                        <div className="flex justify-center mb-6">
                            <Link href="/">
                                <img src="/images/logo3.png" alt="Logo RTQ Al Yusra" className="w-24 h-24" />
                            </Link>
                        </div>
                        
                        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
                            LOGIN
                        </h1>

                        {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}
                        
                        <div>
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full border-none rounded-lg py-3 px-4 text-lg"
                                placeholder="Masukkan Email"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full border-none rounded-lg py-3 px-4 text-lg"
                                placeholder="Masukkan Password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="mt-8">
                            <PrimaryButton className="w-full justify-center py-3 bg-alyusra-green hover:bg-alyusra-green/90 text-lg" disabled={processing}>
                                Login
                            </PrimaryButton>
                        </div>

                        <div className="text-center mt-6">
                            <p className="text-sm text-gray-600">
                                Belum punya akun?{' '}
                                <Link
                                    href={route('register')}
                                    className="font-semibold text-alyusra-orange hover:underline"
                                >
                                    Daftar di sini
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