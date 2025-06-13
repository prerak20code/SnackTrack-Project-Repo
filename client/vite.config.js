import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import dotenv from 'dotenv';

dotenv.config({ path: './src/Config/.env' });

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd() + '/src/Config', '');

    return {
        plugins: [react(), tailwindcss()],
        server: {
            host: '0.0.0.0', 
            port: 5173, 
            allowedHosts: ['snacktrack.me', 'www.snacktrack.me'], 
            proxy: {
                '/api': {
                    target: env.VITE_BACKEND_URL,
                    changeOrigin: true,
                    secure: false,
                },
            },
        },
    };
});