
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

  // Fonction utilitaire pour ajouter un timeout à une promesse
  const withTimeout = <T,>(promise: Promise<T>, ms: number, timeoutValue: T): Promise<T> => {
    return Promise.race([
      promise,
      new Promise<T>((resolve) => setTimeout(() => resolve(timeoutValue), ms))
    ]);
  };

  const fetchProfile = async (userId: string, email: string): Promise<UserProfile | null> => {
    try {
      // Timeout de 3 secondes pour la récupération du profil
      const { data, error } = await withTimeout(
        supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
        3000,
        { data: null, error: null } as any
      );

      if (data) {
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
      }

      // Auto-création si manquant
      const newProfile = {
        id: userId,
        email: email,
        first_name: email.split('@')[0],
        last_name: '',
        role: 'MEMBRE',
        status: 'active'
      };

      const { data: createdData } = await withTimeout(
        supabase.from('profiles').insert([newProfile]).select().single(),
        3000,
        { data: null } as any
      );

      if (createdData) {
        return {
          id: createdData.id,
          email,
          firstName: createdData.first_name,
          lastName: createdData.last_name,
          role: createdData.role,
        };
      }

      return { id: userId, email, firstName: 'Utilisateur', lastName: '', role: 'NEW_USER' };
    } catch (e) {
      console.error("Profile fetch fatal error:", e);
      return { id: userId, email, firstName: 'Utilisateur', lastName: '', role: 'NEW_USER' };
    }
  };

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        // Timeout global d'initialisation de 5 secondes
        const sessionPromise = supabase.auth.getSession();
        const { data: { session } } = await withTimeout(sessionPromise, 5000, { data: { session: null } } as any);
        
        if (mounted && session?.user) {
          const profile = await fetchProfile(session.user.id, session.user.email!);
          setUser(profile);
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        if (session?.user) {
          const profile = await fetchProfile(session.user.id, session.user.email!);
          setUser(profile);
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
        const profile = await fetchProfile(data.user.id, data.user.email!);
        setUser(profile);
        addNotification(`Bienvenue, ${profile?.firstName}`, 'success');
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
    if (reason) addNotification(reason, "info");
  }, [addNotification]);

  const updateUser = (data: Partial<UserProfile>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
  };

  const refreshProfile = async () => {
    if (user) {
      const p = await fetchProfile(user.id, user.email);
      if (p) setUser(p);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout, updateUser, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
