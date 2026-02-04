
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Charge les variables d'environnement
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Remplacement direct de la chaîne process.env.API_KEY pour compatibilité navigateur
      'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || ''),
      // Fallback de sécurité pour d'autres usages de process.env (évite le crash)
      'process.env': {} 
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: false
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        }
      }
    }
  };
});
