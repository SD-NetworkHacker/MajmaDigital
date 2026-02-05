
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Charge les variables d'environnement
  // Utilisation de process.cwd() avec cast pour éviter l'erreur de type sur 'cwd'
  const root = (process as any).cwd();
  const env = loadEnv(mode, root, '');
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(root, './src'),
      },
    },
    define: {
      // Injection sécurisée des clés
      'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || ''),
      'process.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL || ''),
      'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY || ''),
      'process.env': {} 
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
