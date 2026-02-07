
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useNotification } from './NotificationContext';
import { useLoading } from './LoadingContext';
import { Member } from '../types';
import { supabase } from '../lib/supabase';
import { APP_VERSION, SUPABASE_PROJECT_ID } from '../constants';

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

  // Helper pour récupérer le profil
  const fetchProfile = async (userId: string, email: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) return null;

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

  // --- INITIALISATION & ROUTINES DE SANTÉ ---
  useEffect(() => {
    let mounted = true;

    const performSystemHealthCheck = async () => {
        // 1. VÉRIFICATION DE VERSION (Nuclear Flush si mismatch)
        const storedVersion = localStorage.getItem('MAJMA_VERSION');
        if (storedVersion !== APP_VERSION) {
            console.warn(`🔄 Mise à jour système : v${storedVersion} -> v${APP_VERSION}. Nettoyage...`);
            localStorage.clear();
            localStorage.setItem('MAJMA_VERSION', APP_VERSION);
            // On continue pour forcer un état neuf
        }

        // 2. SUPPRESSION DES SESSIONS "GHOSTS" (Autres projets Supabase)
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('sb-') && !key.includes(SUPABASE_PROJECT_ID)) {
                console.warn(`👻 Ghost session detected and removed: ${key}`);
                localStorage.removeItem(key);
            }
        });

        // 3. RÉCUPÉRATION SESSION & GESTION ERREURS
        try {
            const { data: { session: currentSession }, error } = await supabase.auth.getSession();

            if (error) {
                console.error("💥 Auth Session Error:", error);
                await supabase.auth.signOut();
                if (mounted) {
                    setUser(null);
                    setLoading(false);
                }
                return;
            }

            if (currentSession?.user) {
                setSession(currentSession);
                const profile = await fetchProfile(currentSession.user.id, currentSession.user.email!);
                if (mounted) setUser(profile);
            } else {
                if (mounted) setUser(null);
            }
        } catch (err) {
            console.error("💥 Critical Auth Failure:", err);
            await supabase.auth.signOut();
            if (mounted) setUser(null);
        } finally {
            if (mounted) setLoading(false);
        }
    };

    performSystemHealthCheck();

    // Écouteur de changements d'état (Login/Logout/Token Refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;
      
      setSession(newSession);

      if (newSession?.user) {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
           const profile = await fetchProfile(newSession.user.id, newSession.user.email!);
           setUser(profile);
        }
      } else {
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
      
      if (data.user) {
         const profile = await fetchProfile(data.user.id, data.user.email!);
         setUser(profile);
         addNotification(`Dalal ak Diam, ${profile?.firstName || 'Membre'}`, 'success');
      }

    } catch (error: any) {
      addNotification(error.message || "Erreur de connexion", 'error');
      throw error;
    } finally {
      hideLoading();
    }
  };

  const register = async (formData: any) => {
    try {
      showLoading();
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            category: formData.category,
          }
        }
      });

      if (authError) throw authError;

      if (!authData.session) {
         addNotification("Vérifiez vos emails pour confirmer l'inscription.", "warning");
      } else {
         const fullProfile = await fetchProfile(authData.user!.id, authData.user!.email!);
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
        setUser({
          id: member.id,
          email: member.email,
          firstName: member.firstName,
          lastName: member.lastName,
          role: member.role,
          matricule: member.matricule,
          category: member.category,
          originalRole: member.role 
        });
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

  const getRedirectPath = useCallback(() => '/app', []);
  const refreshProfile = async () => {
      if(user) {
          const p = await fetchProfile(user.id, user.email);
          if(p) setUser(p);
      }
  };
  const loginAsGuest = () => addNotification("Mode invité activé.", "info");

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
