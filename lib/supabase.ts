/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

// Access via import.meta.env (Vite standard) with process.env fallback for compatibility
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || (process.env.VITE_SUPABASE_URL as string);
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || (process.env.VITE_SUPABASE_ANON_KEY as string);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("⚠️ ERREUR CONFIGURATION : VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY manquant.");
}

// Create a client with the provided keys, or placeholder to prevent crash on init.
// Valid URL format is required to avoid immediate URL parsing errors in the client.
const validUrl = supabaseUrl && supabaseUrl.startsWith('http') ? supabaseUrl : 'https://placeholder.supabase.co';
const validKey = supabaseAnonKey || 'placeholder';

export const supabase = createClient(validUrl, validKey);
