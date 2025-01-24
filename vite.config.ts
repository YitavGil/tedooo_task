import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000, // מגדיר את הפורט ל-3000
    proxy: {
      // מגדיר proxy לכל הבקשות שמתחילות ב-/hw
      '/hw': {
        target: 'https://backend.tedooo.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      }
    }
  }
});
