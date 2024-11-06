import { defineConfig } from 'astro/config';
import basicSsl from '@vitejs/plugin-basic-ssl';

// https://astro.build/config
export default defineConfig({
    vite: {
        plugins: [basicSsl()],
        server: {
          https: {
            key: './certs/cert.key',
            cert: './certs/cert.crt'
          }
        }
    },
});
