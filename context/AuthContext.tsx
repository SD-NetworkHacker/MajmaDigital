
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useNotification } from './NotificationContext';
import { useLoading } from './LoadingContext';
import { Member } from '../types';
import { supabase } from '../lib/supabase';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatarUrl?: string;
  originalRole?: string;
  matricule?: string;
  category?: string;
  bio?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isImpersonating: boolean;
  isSwitching: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: (reason?: string) => void;
  updateUser: (data: Partial<UserProfile>) => void;
  impersonate: (member: Member) => void;
  stopImpersonation: () => void;
  getRedirectPath: () => string;
  refreshProfile: () => Promise<void>;
  loginAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [originalAdminSession, setOriginalAdminSession] = useState<UserProfile | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);

  const { addNotification } = useNotification();
  const { showLoading, hideLoading } = useLoading();

  // Helper pour récupérer le profil avec tentatives multiples si nécessaire
  const fetchProfile = async (userId: string, email: string, retries = 3): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) {
        if (retries > 0) {
          console.log(`Profil non trouvé, nouvelle tentative dans 1s... (${retries} restantes)`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          return fetchProfile(userId, email, retries - 1);
        }
        
        console.warn('Profil introuvable après tentatives. Création objet minimal.');
        return null;
      }

      return {
        id: data.id,
        email: email,
        firstName: data.first_name || 'Membre',
        lastName: data.last_name || '',
        role: data.role || 'MEMBRE', 
        matricule: data.matricule,
        category: data.category,
        avatarUrl: data.avatar_url,
        bio: data.bio
      };
    } catch (e) {
      console.error("Erreur fetchProfile:", e);
      return null;
    }
  };

  // Initialisation au démarrage
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // On récupère la session courante
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (currentSession?.user) {
          setSession(currentSession);
          // On cherche le profil
          const profile = await fetchProfile(currentSession.user.id, currentSession.user.email!);
          
          if (mounted) {
            if (profile) {
              setUser(profile);
            } else {
              // Cas rare : Auth existe mais pas de profil -> On déconnecte pour éviter l'état instable
              await supabase.auth.signOut();
              setUser(null);
            }
          }
        } else {
          if (mounted) setUser(null);
        }
      } catch (error) {
        console.warn("Erreur init auth:", error);
        if (mounted) setUser(null);
      } finally {
        // C'est le SEUL endroit où on coupe le chargement initial
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    // Écouteur de changements (Login, Logout, Auto-refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;
      
      console.log(`Auth Event: ${event}`);
      setSession(newSession);

      if (newSession?.user) {
        // Si on vient de s'inscrire ou de se connecter, on veut s'assurer d'avoir le profil
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
           const profile = await fetchProfile(newSession.user.id, newSession.user.email!);
           setUser(profile);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setOriginalAdminSession(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      showLoading();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // La mise à jour de l'état se fera via le listener onAuthStateChange
      // Mais on peut forcer un fetch ici pour l'UX immédiate
      if (data.user) {
         const profile = await fetchProfile(data.user.id, data.user.email!);
         setUser(profile);
         addNotification(`Dalal ak Diam, ${profile?.firstName || 'Membre'}`, 'success');
      }

    } catch (error: any) {
      console.error("Login Error:", error);
      addNotification(error.message || "Erreur de connexion", 'error');
      throw error;
    } finally {
      hideLoading();
    }
  };

  const register = async (formData: any) => {
    try {
      showLoading();
      addNotification("Création de votre espace en cours...", "info");
      
      // 1. Inscription Auth avec Métadonnées (Important pour le Trigger SQL)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            category: formData.category,
            // On peut passer d'autres champs ici pour que le trigger les utilise
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Erreur création utilisateur");

      // 2. Pause stratégique pour laisser le temps au Trigger SQL ou à l'insert manuel
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 3. Fallback Manuel : Si le trigger SQL n'est pas en place, on insère manuellement
      // On vérifie d'abord si le profil existe déjà (créé par trigger)
      const { data: existingProfile } = await supabase.from('profiles').select('id').eq('id', authData.user.id).single();

      if (!existingProfile) {
        console.log("Trigger lent ou absent, insertion manuelle du profil...");
        const year = new Date().getFullYear();
        const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const matricule = `MAJ-${year}-${randomSuffix}`;

        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{
            id: authData.user.id,
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            role: 'MEMBRE',
            category: formData.category,
            matricule: matricule,
            created_at: new Date().toISOString()
          }]);

        if (profileError) {
           console.error("Erreur insertion profil manuelle:", profileError);
           // On ne throw pas ici car l'user Auth est créé, on essaie de le connecter quand même
        }
      }

      // 4. Connexion explicite et récupération du profil final
      // Si l'inscription ne connecte pas automatiquement (dépend de la config Supabase "Confirm Email")
      if (!authData.session) {
         // Si confirmation email requise
         addNotification("Veuillez vérifier vos emails pour confirmer l'inscription.", "warning");
      } else {
         // Session active, on récupère le profil complet pour l'app
         const fullProfile = await fetchProfile(authData.user.id, authData.user.email!);
         setUser(fullProfile);
         addNotification("Compte créé avec succès !", "success");
      }
      
    } catch (error: any) {
      addNotification(error.message, 'error');
      throw error;
    } finally {
        hideLoading();
    }
  };

  const logout = useCallback(async (reason?: string) => {
    try {
        await supabase.auth.signOut();
    } catch (e) {
        console.warn("Erreur signout", e);
    }
    // Le listener se chargera de mettre user à null
    if (reason) addNotification(reason, 'info');
  }, [addNotification]);

  const updateUser = async (data: Partial<UserProfile>) => {
    if (!user) return;
    setUser({ ...user, ...data });

    try {
        const { error } = await supabase
            .from('profiles')
            .update({
                first_name: data.firstName,
                last_name: data.lastName,
                bio: data.bio
            })
            .eq('id', user.id);
            
        if (error) throw error;
        addNotification("Profil mis à jour", "success");
    } catch (e: any) {
        addNotification("Erreur sauvegarde profil", "error");
    }
  };

  const impersonate = (member: Member) => {
    if (!user) return;
    setIsSwitching(true);
    setTimeout(() => {
        if (!originalAdminSession) setOriginalAdminSession(user);
        const simulatedUser: UserProfile = {
          id: member.id,
          email: member.email,
          firstName: member.firstName,
          lastName: member.lastName,
          role: member.role,
          matricule: member.matricule,
          category: member.category,
          originalRole: member.role 
        };
        setUser(simulatedUser);
        setIsSwitching(false);
        addNotification(`Vue: ${member.firstName} (${member.role})`, 'info');
    }, 500); 
  };

  const stopImpersonation = () => {
    if (!originalAdminSession) return;
    setIsSwitching(true);
    setTimeout(() => {
        setUser(originalAdminSession);
        setOriginalAdminSession(null);
        setIsSwitching(false);
        addNotification("Retour vue Admin", 'success');
    }, 500);
  };

  const getRedirectPath = useCallback(() => {
    return '/app';
  }, []);

  const refreshProfile = async () => {
      if(user) {
          const p = await fetchProfile(user.id, user.email);
          if(p) setUser(p);
      }
  };
  
  const loginAsGuest = () => {
      addNotification("Mode invité activé.", "info");
      // Logique locale si besoin, mais généralement géré par l'absence de user
  };

  return (
    <AuthContext.Provider 
      value={{ user, token: session?.access_token, isAuthenticated: !!user, loading, isImpersonating: !!originalAdminSession, isSwitching, login, register, logout, updateUser, impersonate, stopImpersonation, getRedirectPath, refreshProfile, loginAsGuest }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
