
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
  
  const [originalAdminSession, setOriginalAdminSession] = useState<UserProfile | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);

  const { addNotification } = useNotification();
  const { showLoading, hideLoading } = useLoading();

  // Fonction pour récupérer le profil étendu depuis la table 'profiles'
  const fetchProfile = async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Erreur chargement profil Supabase:', error);
        // Fallback minimal pour éviter le blocage
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
      console.error(e);
      return null;
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email!).then(profile => {
          if (profile) setUser(profile);
        });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
         const profile = await fetchProfile(session.user.id, session.user.email!);
         setUser(profile);
      } else {
         setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      showLoading();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

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

      // Génération du matricule : MAJ-AAAA-XXXX
      const year = new Date().getFullYear();
      const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      const matricule = `MAJ-${year}-${randomSuffix}`;

      // Création immédiate du profil dans la table publique
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: authData.user.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          role: 'MEMBRE', // Rôle par défaut
          category: formData.category,
          matricule: matricule,
          created_at: new Date().toISOString()
        }]);

      if (profileError) {
         console.error("Erreur création profil DB:", profileError);
         // On ne bloque pas, l'utilisateur est créé dans Auth
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
    await supabase.auth.signOut();
    setUser(null);
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
      value={{ user, token: session?.access_token, isAuthenticated: !!user, isImpersonating: !!originalAdminSession, isSwitching, login, register, logout, updateUser, impersonate, stopImpersonation, getRedirectPath, refreshProfile, loginAsGuest }}
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
