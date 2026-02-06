
import { createClient } from '@supabase/supabase-js';

// Retrieve env vars with fallback
// Using process.env which is polyfilled in vite.config.ts to avoid type errors with import.meta.env
const rawUrl = process.env.VITE_SUPABASE_URL;
const rawKey = process.env.VITE_SUPABASE_ANON_KEY;

// Validate and clean URL
const supabaseUrl = rawUrl ? rawUrl.trim().replace(/\/$/, '') : '';
const supabaseAnonKey = rawKey ? rawKey.trim() : '';

// Fallback to placeholder to prevent crash during initialization if env vars are missing
// The requests will fail gracefully with 404/Connection Error instead of crashing the app
const validUrl = supabaseUrl && supabaseUrl.startsWith('http') ? supabaseUrl : 'https://placeholder.supabase.co';
const validKey = supabaseAnonKey || 'placeholder';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("⚠️ ERREUR CONFIGURATION : VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY manquant.");
}

export const supabase = createClient(validUrl, validKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});
