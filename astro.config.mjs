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
            key: './cert/cert.key',
            cert: './cert/cert.crt'
          }
        }
    },
});
