import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    server: {
        host: '0.0.0.0', // Mengizinkan akses dari IP eksternal (penting untuk Ngrok)
        cors: true,      // Mengizinkan Cross-Origin Requests
        hmr: {
            host: 'localhost', // Memaksa browser mencari update HMR ke localhost
        },
    },
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
});