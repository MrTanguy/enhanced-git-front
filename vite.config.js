import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl()],
  server: {
    host: '0.0.0.0', // Pour permettre l'accès externe
  },
  test: {
    environment: 'jsdom', 
    globals: true,  
    setupFiles: './setupTests.js',
    exclude: [
      'node_modules',
      '**/node_modules/@testing-library/jest-dom/types/__tests__/**',
    ],
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'tests/', 'src/main.jsx', 'eslint.config.js', 'vite.config.js', 'src/pages'],
    },
  },
})
