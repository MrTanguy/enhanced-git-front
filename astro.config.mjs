import { defineConfig } from 'astro/config';
import basicSsl from '@vitejs/plugin-basic-ssl';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
    integrations: [react()],
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
