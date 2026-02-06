
import { createClient } from '@supabase/supabase-js';

// Access via process.env which is polyfilled in vite.config.ts
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("⚠️ ERREUR CONFIGURATION : VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY manquant.");
}

// Create a client with the provided keys, or empty strings to prevent crash on init (calls will fail gracefully or show network error)
export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder');
