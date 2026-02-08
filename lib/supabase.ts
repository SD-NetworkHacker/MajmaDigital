
import { createClient } from '@supabase/supabase-js';

const getEnv = (key: string): string => {
  // @ts-ignore
  const viteVar = import.meta.env ? import.meta.env[key] : undefined;
  const processVar = typeof process !== 'undefined' && process.env ? process.env[key] : undefined;
  return viteVar || processVar || '';
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ ALERTE CONFIGURATION : Supabase n'est pas correctement configuré (Variables manquantes).");
}

export const supabase = createClient(
  supabaseUrl || 'https://qwsivjyohprhwacjgimc.supabase.co',
  supabaseAnonKey || 'no-key-provided',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'majma-auth-token'
    }
  }
);
