import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useNotification } from './NotificationContext';
import { useLoading } from './LoadingContext';
import { supabase } from '../lib/supabase';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatarUrl?: string;
  matricule?: string;
  category?: string;
  gender?: 'M' | 'F';
  joinDate?: string;
  birthDate?: string;
  emailConfirmed?: boolean;
  bio?: string;
  originalRole?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  register: (data: any) => Promise<{ success: boolean; needsVerification: boolean }>;
  resendConfirmation: (email: string) => Promise<void>;
  logout: (reason?: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateUser: (data: any) => Promise<void>;
  impersonate: (member: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();
  const { showLoading, hideLoading } = useLoading();

  const mapProfile = (profileData: any, authUser: any): UserProfile => ({
    id: authUser.id,
    email: authUser.email || '',
    firstName: profileData?.first_name || authUser.user_metadata?.first_name || 'Utilisateur',
    lastName: profileData?.last_name || authUser.user_metadata?.last_name || 'Temporaire',
    role: profileData?.role || 'SYMPATHISANT',
    matricule: profileData?.matricule || 'MAJ-GUEST',
    category: profileData?.category || authUser.user_metadata?.category || 'Étudiant',
    gender: profileData?.gender || authUser.user_metadata?.gender,
    joinDate: profileData?.join_date || authUser.user_metadata?.join_date || authUser.created_at,
    birthDate: profileData?.birth_date || authUser.user_metadata?.birth_date,
    avatarUrl: profileData?.avatar_url,
    bio: profileData?.bio,
    emailConfirmed: !!authUser.email_confirmed_at
  });

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setLoading(false);
    if (window.location.pathname !== '/') {
        window.location.assign('/');
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("AuthContext: Erreur session Supabase:", sessionError);
        setUser(null);
        setLoading(false);
        return;
      }

      if (session?.user) {
        console.log("AuthContext: Session active pour", session.user.email);
        
        // Tentative de récupération du profil DB
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();
        
        if (profileError) {
          console.error("AuthContext: Erreur Critique Table 'profiles' :", profileError.message, profileError.details);
          // On ne bloque pas l'utilisateur, on lui donne un profil par défaut basé sur l'auth
          setUser(mapProfile(null, session.user));
        } else if (!profile) {
          console.warn("AuthContext: Aucun profil trouvé en DB. Utilisation du mode SYMPATHISANT.");
          setUser(mapProfile(null, session.user));
        } else {
          setUser(mapProfile(profile, session.user));
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("AuthContext: Erreur système critique:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      // Safety Timeout 4s pour forcer Loading à false
      const safetyTimer = setTimeout(() => {
        if (loading) {
          console.warn("AuthContext: Timeout sécurité 4s atteint. Forçage init.");
          setLoading(false);
        }
      }, 4000);

      await refreshProfile();
      clearTimeout(safetyTimer);
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`AuthContext Event: ${event}`);
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();
        setUser(mapProfile(profile, session.user));
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [refreshProfile]);

  const login = async (email: string, password: string, rememberMe: boolean) => {
    showLoading();
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error: any) {
      addNotification(error.message || "Erreur de connexion", "error");
      throw error;
    } finally {
      hideLoading();
    }
  };

  const register = async (userData: any) => {
    showLoading();
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
            category: userData.category
          }
        }
      });
      if (error) throw error;
      return { success: true, needsVerification: !data.session };
    } catch (error: any) {
      addNotification(error.message, "error");
      throw error;
    } finally {
      hideLoading();
    }
  };

  const updateUser = async (data: any) => {
    if (!user) return;
    showLoading();
    try {
      const { error } = await supabase.from('profiles').update({
          first_name: data.firstName,
          last_name: data.lastName,
          bio: data.bio,
          avatar_url: data.avatarUrl
        }).eq('id', user.id);
      if (error) throw error;
      await refreshProfile();
      addNotification("Profil mis à jour", "success");
    } catch (error: any) {
      addNotification(error.message, "error");
    } finally {
      hideLoading();
    }
  };

  const impersonate = async (member: any) => {
    addNotification(`Simulation : Incarner ${member.firstName}`, "info");
    setUser(prev => prev ? { ...prev, ...member, id: member.id, originalRole: prev.role } : null);
  };

  const resendConfirmation = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({ type: 'signup', email });
      if (error) throw error;
      addNotification("Lien renvoyé", "success");
    } catch (error: any) {
      addNotification(error.message, "error");
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, isAuthenticated: !!user, loading, login, register, 
      resendConfirmation, logout, refreshProfile, updateUser, impersonate 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};