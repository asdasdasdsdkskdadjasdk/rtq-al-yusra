// tailwind.config.js
import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx', // Pastikan baris ini ada
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            // TAMBAHKAN BLOK INI
            colors: {
                'alyusra-orange': '#E85B25',
                'alyusra-green': '#34A853', // Warna hijau dari logo
                'alyusra-dark-blue': '#242A42',
            },
            // AKHIR BLOK TAMBAHAN
            keyframes: {
                // Fade
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'fade-out': {
                    '0%': { opacity: '1' },
                    '100%': { opacity: '0' },
                },
                // Slide Up
                'slide-in-up': {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'slide-out-up': {
                    '0%': { opacity: '1', transform: 'translateY(0)' },
                    '100%': { opacity: '0', transform: 'translateY(-20px)' },
                },
                // Slide Down
                'slide-in-down': {
                    '0%': { opacity: '0', transform: 'translateY(-20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                 'slide-out-down': {
                    '0%': { opacity: '1', transform: 'translateY(0)' },
                    '100%': { opacity: '0', transform: 'translateY(20px)' },
                },
                // Slide Left
                'slide-in-left': {
                    '0%': { opacity: '0', transform: 'translateX(-20px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                 'slide-out-left': {
                    '0%': { opacity: '1', transform: 'translateX(0)' },
                    '100%': { opacity: '0', transform: 'translateX(-20px)' },
                },
                // Slide Right
                'slide-in-right': {
                    '0%': { opacity: '0', transform: 'translateX(20px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                 'slide-out-right': {
                    '0%': { opacity: '1', transform: 'translateX(0)' },
                    '100%': { opacity: '0', transform: 'translateX(20px)' },
                },
                // Zoom
                'zoom-in': {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                'zoom-out': {
                    '0%': { opacity: '1', transform: 'scale(1)' },
                    '100%': { opacity: '0', transform: 'scale(0.95)' },
                },
            },
            animation: {
                // Nama kelasnya akan menjadi: animate-{nama di sini}
                'fade-in':        'fade-in 0.5s ease-out forwards',
                'fade-out':       'fade-out 0.5s ease-in forwards',
                'slide-in-up':    'slide-in-up 0.5s ease-out forwards',
                'slide-out-up':   'slide-out-up 0.5s ease-in forwards',
                'slide-in-down':  'slide-in-down 0.5s ease-out forwards',
                'slide-out-down': 'slide-out-down 0.5s ease-in forwards',
                'slide-in-left':  'slide-in-left 0.5s ease-out forwards',
                'slide-out-left': 'slide-out-left 0.5s ease-in forwards',
                'slide-in-right': 'slide-in-right 0.5s ease-out forwards',
                'slide-out-right':'slide-out-right 0.5s ease-in forwards',
                'zoom-in':        'zoom-in 0.5s ease-out forwards',
                'zoom-out':       'zoom-out 0.5s ease-in forwards',
            },

            backgroundImage: {
                'dots-pattern': "radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)", // Warna titik (abu-abu muda transparan), ukuran 1px

            },
            backgroundSize: {
                'dots-size': '12px 12px', // Jarak antar titik (12px horizontal & vertikal)
            }
        },
    },

    plugins: [forms],
};