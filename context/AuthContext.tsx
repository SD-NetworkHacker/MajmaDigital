
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
  bio?: string;
  emailConfirmed?: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  register: (data: any) => Promise<void>;
  resendConfirmation: (email: string) => Promise<void>;
  logout: (reason?: string) => void;
  updateUser: (data: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();
  const { showLoading, hideLoading } = useLoading();

  const mapProfile = (data: any, authUser: any): UserProfile => ({
    id: authUser.id,
    email: authUser.email || '',
    firstName: data?.first_name || authUser.user_metadata?.first_name || 'Membre',
    lastName: data?.last_name || authUser.user_metadata?.last_name || '',
    role: data?.role || 'MEMBRE',
    matricule: data?.matricule,
    category: data?.category || authUser.user_metadata?.category,
    avatarUrl: data?.avatar_url,
    bio: data?.bio,
    emailConfirmed: !!authUser.email_confirmed_at
  });

  const fetchProfile = async (authUser: any) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', authUser.id).maybeSingle();
    return mapProfile(data, authUser);
  };

  useEffect(() => {
    let mounted = true;
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (mounted && session?.user) {
        const profile = await fetchProfile(session.user);
        setUser(profile);
      }
      setLoading(false);
    };
    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        if (session?.user) {
          const profile = await fetchProfile(session.user);
          setUser(profile);
        } else {
          setUser(null);
        }
      }
    });

    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean) => {
    showLoading();
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      // Supabase gère la persistance via localStorage par défaut. 
      // Si rememberMe est faux, on pourrait techniquement configurer le client différemment, 
      // mais ici nous utilisons la gestion native de session de Supabase.
      
      if (error) throw error;
      addNotification("Connexion réussie", "success");
    } catch (error: any) {
      addNotification(error.message, "error");
      throw error;
    } finally {
      hideLoading();
    }
  };

  const register = async (userData: any) => {
    showLoading();
    try {
      const { error } = await supabase.auth.signUp({
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
    } catch (error: any) {
      addNotification(error.message, "error");
      throw error;
    } finally {
      hideLoading();
    }
  };

  const resendConfirmation = async (email: string) => {
    showLoading();
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      if (error) throw error;
      addNotification("Email de confirmation renvoyé !", "success");
    } catch (error: any) {
      addNotification(error.message, "error");
    } finally {
      hideLoading();
    }
  };

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const updateUser = (data: Partial<UserProfile>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, register, resendConfirmation, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
