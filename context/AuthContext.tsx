
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
  loading: boolean; // Nouvel état pour gérer l'initialisation
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
  const [loading, setLoading] = useState(true); // Initialisation à true
  
  const [originalAdminSession, setOriginalAdminSession] = useState<UserProfile | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);

  const { addNotification } = useNotification();
  const { showLoading, hideLoading } = useLoading();

  // Fonction pour récupérer le profil étendu depuis la table 'profiles'
  const fetchProfile = async (userId: string, email: string) => {
    try {
      // Timeout pour la récupération du profil aussi (éviter le blocage infini)
      const profilePromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile Fetch Timeout')), 5000)
      );

      const { data, error } = await Promise.race([profilePromise, timeoutPromise]) as any;

      if (error) {
        console.warn('Profil introuvable ou erreur Supabase, utilisation du profil par défaut:', error.message);
        // Fallback minimal pour ne pas bloquer l'app
        return {
           id: userId,
           email: email,
           firstName: 'Membre',
           lastName: '',
           role: 'MEMBRE'
        };
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
      console.error("Erreur critique fetchProfile:", e);
      // Retourner un profil par défaut en cas d'erreur critique pour ne pas bloquer
      return {
         id: userId,
         email: email,
         firstName: 'Membre',
         lastName: '(Erreur)',
         role: 'MEMBRE'
      };
    }
  };

  useEffect(() => {
    let mounted = true;

    // Safety Valve: Force la fin du chargement après 4 secondes quoi qu'il arrive
    const safetyTimer = setTimeout(() => {
      if (mounted && loading) {
        console.warn("⚠️ Safety Timer triggered: Forcing loading to false.");
        setLoading(false);
      }
    }, 4000);

    const initializeAuth = async () => {
      try {
        // Timeout strict de 3 secondes pour Vercel/Netlify
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Auth Timeout')), 3000)
        );

        // Race : Le premier qui répond gagne
        const result = await Promise.race([sessionPromise, timeoutPromise]) as any;
        
        const { data: { session }, error } = result;

        if (error) throw error;
        
        if (mounted) {
          setSession(session);
          
          if (session?.user) {
            const profile = await fetchProfile(session.user.id, session.user.email!);
            if (mounted && profile) setUser(profile);
          }
        }
      } catch (error) {
        console.warn("Initialisation Auth échouée ou trop longue (Mode Invité activé):", error);
        if (mounted) {
          setSession(null);
          setUser(null);
          addNotification("Délai de connexion dépassé. Mode invité activé.", "info");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    // Listener pour les changements d'état (Login/Logout dynamiques)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      
      setSession(session);
      
      if (session?.user) {
         // Si une session arrive (ex: après un login réussi), on charge le profil
         // On ne bloque pas loading ici car l'interface est déjà interactive souvent
         const profile = await fetchProfile(session.user.id, session.user.email!);
         if (mounted) setUser(profile);
      } else {
         if (mounted) setUser(null);
      }
      
      // On s'assure que le loading est coupé si l'événement auth arrive
      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
      clearTimeout(safetyTimer);
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

      // On attend explicitement le profil ici pour une meilleure UX
      const profile = await fetchProfile(data.user.id, data.user.email!);
      setUser(profile);
      addNotification(`Dalal ak Diam, ${profile?.firstName}`, 'success');

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
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Erreur création utilisateur");

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
         console.error("Erreur création profil DB:", profileError);
         // Note: L'utilisateur Auth est créé, mais le profil a échoué.
         // Idéalement, il faudrait gérer ce cas, mais pour l'instant on notifie.
      }

      addNotification("Compte créé ! Veuillez vous connecter.", "success");
      
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
        console.warn("Erreur lors du signout Supabase", e);
    }
    setUser(null);
    setSession(null);
    setOriginalAdminSession(null);
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
      addNotification("Veuillez créer un compte pour accéder.", "info");
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
