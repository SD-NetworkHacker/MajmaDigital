import { createClient } from '@supabase/supabase-js';

/**
 * Initialisation sécurisée du client Supabase.
 * On vérifie l'existence de import.meta.env pour éviter les crashs TypeError.
 */
const env = (import.meta as any).env || {};

const supabaseUrl = env.VITE_SUPABASE_URL || 'https://qwsivjyohprhwacjgimc.supabase.co';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3c2l2anlvaHByaHdhY2pnaW1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNDA0MTEsImV4cCI6MjA4NTgxNjQxMX0.HFya9ucwIZTymdmPRVVFXvI__GGi0R_3islhLr1y_84';

if (!env.VITE_SUPABASE_ANON_KEY && (!supabaseAnonKey || supabaseAnonKey === 'undefined')) {
  console.error("⚠️ Erreur Critique : La clé Supabase est manquante !");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});