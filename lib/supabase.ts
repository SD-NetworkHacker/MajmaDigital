
import { createClient } from '@supabase/supabase-js';

// Access via process.env which is polyfilled in vite.config.ts
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("⚠️ VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY manquant dans le fichier .env");
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
