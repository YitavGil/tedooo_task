import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  base: '/tedooo_task/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000, 
    proxy: {
      '/hw': {
        target: 'https://backend.tedooo.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      }
    }
  }
});