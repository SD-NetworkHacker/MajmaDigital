
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
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: (reason?: string) => void;
  updateUser: (data: Partial<UserProfile>) => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();
  const { showLoading, hideLoading } = useLoading();

  const mapProfile = (data: any, email: string): UserProfile => ({
    id: data.id,
    email: email,
    firstName: data.first_name || email.split('@')[0],
    lastName: data.last_name || '',
    role: data.role || 'MEMBRE',
    matricule: data.matricule,
    category: data.category,
    avatarUrl: data.avatar_url,
    bio: data.bio
  });

  const refreshProfile = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setUser(null);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (data) {
        setUser(mapProfile(data, session.user.email!));
      }
    } catch (err) {
      console.error("Erreur de rafraîchissement profil:", err);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          if (session?.user) {
            const { data } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();
            
            if (data) setUser(mapProfile(data, session.user.email!));
          }
          setLoading(false);
        }
      } catch (err) {
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        if (session?.user) {
          // On attend un court instant pour laisser le trigger SQL créer le profil si c'est un nouvel user
          if (event === 'SIGNED_IN') {
             await new Promise(r => setTimeout(r, 500));
          }
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
          
          if (data) setUser(mapProfile(data, session.user.email!));
        } else {
          setUser(null);
        }
        setLoading(false);
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
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      if (data.user) {
        addNotification(`Authentification réussie`, 'success');
      }
    } catch (error: any) {
      addNotification(error.message || "Erreur de connexion", 'error');
      throw error;
    } finally {
      hideLoading();
    }
  };

  const logout = useCallback(async (reason?: string) => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('majma-auth-token');
    if (reason) addNotification(reason, "info");
  }, [addNotification]);

  const updateUser = (data: Partial<UserProfile>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      loading, 
      login, 
      logout, 
      updateUser, 
      refreshProfile 
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
