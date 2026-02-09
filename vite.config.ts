
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Charge les variables du fichier .env
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // On expose uniquement les variables nécessaires au client via process.env
      // Les variables VITE_ sont gérées nativement par Vite via import.meta.env
      'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY)
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: false
    },
    server: {
      port: 5173
    }
  };
});
