import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    proxy: {
      '/api/customers': {
        target: 'https://jsm-challenges.s3.amazonaws.com',
        changeOrigin: true,
        rewrite: () => '/frontend-challenge.json',
        proxyTimeout: 10000,
      },
    },
  },
  test: { environment: 'jsdom', setupFiles: './src/test-setup.js' },
});
