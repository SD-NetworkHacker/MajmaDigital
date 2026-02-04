import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { cwd } from 'process';

export default defineConfig(({ mode }) => {
  // Charge les variables d'environnement
  const env = loadEnv(mode, cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Injection sécurisée des clés (Gemini + Supabase si nécessaire dans le code global)
      'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || ''),
      'process.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL || ''),
      'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY || ''),
      // On s'assure que process.env ne crash pas
      'process.env': {} 
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: false
    },
    // Suppression du proxy server car on attaque Supabase directement
    server: {
      port: 5173
    }
  };
});