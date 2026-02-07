
import { createClient } from '@supabase/supabase-js';

const getEnv = (key: string): string => {
  const viteVar = (import.meta as any).env?.[key];
  const processVar = typeof process !== 'undefined' ? (process as any).env?.[key] : undefined;
  return viteVar || processVar || '';
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ ALERTE : Supabase n'est pas configuré. L'application fonctionnera en mode dégradé.");
}

// Utilisation d'une URL valide par défaut pour éviter que le client Supabase ne crash immédiatement
const finalUrl = supabaseUrl && supabaseUrl.startsWith('http') ? supabaseUrl : 'https://qwsivjyohprhwacjgimc.supabase.co';
const finalKey = supabaseAnonKey || 'no-key-provided';

export const supabase = createClient(finalUrl, finalKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'majma-auth-token'
  }
});
