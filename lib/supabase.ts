import { createClient } from '@supabase/supabase-js';

/**
 * Client Supabase - Connexion Directe Production
 * Projet : qwsivjyohprhwacjgimc
 */
const env = (import.meta as any).env || {};

const supabaseUrl = 'https://qwsivjyohprhwacjgimc.supabase.co';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3c2l2anlvaHByaHdhY2pnaW1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNDA0MTEsImV4cCI6MjA4NTgxNjQxMX0.HFya9ucwIZTymdmPRVVFXvI__GGi0R_3islhLr1y_84';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});