import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY)
    },
    server: {
      port: 5173,
      // Suppression totale de tout proxy vers /api
      // L'application parle directement aux domaines Supabase et Google
    },
    build: {
      outDir: 'dist',
      sourcemap: false
    }
  };
});