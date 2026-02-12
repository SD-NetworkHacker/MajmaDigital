import { createClient } from '@supabase/supabase-js';

// Fallbacks de sécurité pour éviter l'erreur "Cannot read properties of undefined"
const supabaseUrl = 'https://qwsivjyohprhwacjgimc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3c2l2anlvaHByhwhwa2pnaW1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNDA0MTEsImV4cCI6MjA4NTgxNjQxMX0.HFya9ucwIZTymdmPRVVFXvI__GGi0R_3islhLr1y_84';

// Détection dynamique de l'environnement ou fallback statique
const finalUrl = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL) || supabaseUrl;
const finalKey = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY) || supabaseAnonKey;

export const supabase = createClient(finalUrl, finalKey);