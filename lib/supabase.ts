
import { createClient } from '@supabase/supabase-js';

// Fonction helper pour récupérer les variables d'environnement de manière sûre
const getEnvVar = (key: string) => {
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // @ts-ignore
    return import.meta.env[key];
  }
  // @ts-ignore
  if (typeof process !== 'undefined' && process.env) {
    // @ts-ignore
    return process.env[key];
  }
  return '';
};

// Récupération des clés
const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

// Création du client unique
// Initialisation conditionnelle pour éviter le crash si les clés sont absentes
export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey)
  : null as any;

// Vérification simple de la connexion
export const checkConnection = async () => {
  try {
    if (!supabaseUrl || !supabaseKey || !supabase) return false;
    // Test simple : compter les membres (léger)
    const { count, error } = await supabase.from('members').select('*', { count: 'exact', head: true });
    if (error) throw error;
    return true;
  } catch (e) {
    console.warn("Mode Hors Ligne / Démo : Base de données non connectée ou inaccessible.", e);
    return false;
  }
};
