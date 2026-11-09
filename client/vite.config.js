import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // ローカル開発時は API を Express（:3000）へ転送
    proxy: { '/api': 'http://localhost:3000' },
  },
});
