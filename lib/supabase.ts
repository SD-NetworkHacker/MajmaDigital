
import { createClient } from '@supabase/supabase-js';

// DIAGNOSTIC VERCEL
console.log('Supabase URL:', (import.meta as any).env?.VITE_SUPABASE_URL ? 'Défini' : 'Indéfini');

// Access environment variables using Vite's import.meta.env
// process.env fallback is handled via vite.config.ts define for broader compatibility
// Cast to any to bypass TypeScript error "Property 'env' does not exist on type 'ImportMeta'"
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || (process.env.VITE_SUPABASE_URL as string);
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || (process.env.VITE_SUPABASE_ANON_KEY as string);

// Log discret en développement pour le diagnostic
if ((import.meta as any).env?.DEV) {
  console.log("Checking Supabase Config:", {
    urlDefined: !!supabaseUrl,
    keyDefined: !!supabaseAnonKey
  });
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("⚠️ ERREUR CONFIGURATION : VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY manquant.");
  console.error("Vérifiez la présence du fichier .env à la racine du projet ou les variables d'environnement Vercel.");
}

// Fallback to placeholder to prevent immediate crash, but log error.
// The app will fail to fetch data if keys are missing (Failed to fetch), which is expected.
const validUrl = (supabaseUrl && supabaseUrl.startsWith('http')) ? supabaseUrl : 'https://placeholder.supabase.co';
const validKey = supabaseAnonKey || 'placeholder';

export const supabase = createClient(validUrl, validKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
