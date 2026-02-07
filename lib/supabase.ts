
import { createClient } from '@supabase/supabase-js';

// Accès universel aux variables (Vite + fallback process.env pour compatibilité)
const getEnv = (key: string): string => {
  const viteVar = (import.meta as any).env?.[key];
  const processVar = typeof process !== 'undefined' ? process.env?.[key] : undefined;
  return viteVar || processVar || '';
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("⚠️ CONFIGURATION MANQUANTE : Les clés Supabase ne sont pas définies dans l'environnement.");
}

// Validation de l'URL pour éviter un crash au démarrage
const finalUrl = supabaseUrl.startsWith('http') ? supabaseUrl : 'https://placeholder.supabase.co';
const finalKey = supabaseAnonKey || 'placeholder';

export const supabase = createClient(finalUrl, finalKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
