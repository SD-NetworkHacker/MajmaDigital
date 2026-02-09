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
  originalRole?: string; // Pour la simulation
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
    firstName: profileData?.first_name || authUser.user_metadata?.first_name || 'Membre',
    lastName: profileData?.last_name || authUser.user_metadata?.last_name || '',
    role: profileData?.role || 'MEMBRE',
    matricule: profileData?.matricule,
    category: profileData?.category || authUser.user_metadata?.category,
    gender: profileData?.gender || authUser.user_metadata?.gender,
    joinDate: profileData?.join_date || authUser.user_metadata?.join_date,
    birthDate: profileData?.birth_date || authUser.user_metadata?.birth_date,
    avatarUrl: profileData?.avatar_url,
    bio: profileData?.bio,
    emailConfirmed: !!authUser.email_confirmed_at
  });

  const refreshProfile = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
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
    } catch (err) {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      await refreshProfile();
      setLoading(false);
    };
    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
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
    });

    return () => subscription.unsubscribe();
  }, [refreshProfile]);

  const login = async (email: string, password: string, rememberMe: boolean) => {
    showLoading();
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      addNotification("Connexion réussie", "success");
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
            category: userData.category,
            gender: userData.gender,
            birth_date: userData.birthDate,
            join_date: userData.joinDate
          },
          emailRedirectTo: window.location.origin
        }
      });
      
      if (error) throw error;
      const needsVerification = !data.session;
      return { success: true, needsVerification };
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
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          bio: data.bio,
          avatar_url: data.avatarUrl
        })
        .eq('id', user.id);
      
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
    addNotification(`Incarner ${member.firstName} (Simulation)`, "info");
    setUser(prev => prev ? { 
        ...prev, 
        ...member, 
        id: member.id, 
        originalRole: prev.role 
    } : null);
  };

  const resendConfirmation = async (email: string) => {
    showLoading();
    try {
      const { error } = await supabase.auth.resend({ type: 'signup', email });
      if (error) throw error;
      addNotification("Lien renvoyé !", "success");
    } catch (error: any) {
      addNotification(error.message, "error");
    } finally {
      hideLoading();
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.assign('/');
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