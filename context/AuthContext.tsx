
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useNotification } from './NotificationContext';
import { useLoading } from './LoadingContext';
import { supabase } from '../lib/supabase';
import { APP_VERSION, SUPABASE_PROJECT_ID } from '../constants';

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

  const fetchProfile = async (userId: string, email: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); // maybeSingle évite une erreur si le profil n'existe pas

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }

      if (!data) {
        // L'utilisateur est authentifié mais n'a pas encore de ligne dans la table 'profiles'
        return {
          id: userId,
          email: email,
          firstName: 'Nouvel',
          lastName: 'Utilisateur',
          role: 'NEW_USER' // Rôle spécial pour forcer la complétion du profil
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
      console.error("Fatal error in fetchProfile:", e);
      return null;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      // 1. GESTION VERSION
      const storedVersion = localStorage.getItem('MAJMA_VERSION');
      if (storedVersion !== APP_VERSION) {
        localStorage.setItem('MAJMA_VERSION', APP_VERSION);
      }

      // 2. RÉCUPÉRATION SESSION
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (session?.user) {
          const profile = await fetchProfile(session.user.id, session.user.email!);
          setUser(profile);
        }
      } catch (err) {
        console.error("Auth initialization failed:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id, session.user.email!);
        setUser(profile);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      showLoading();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;

      if (data.user) {
        const profile = await fetchProfile(data.user.id, data.user.email!);
        setUser(profile);
        addNotification(`Heureux de vous revoir, ${profile?.firstName}`, 'success');
      }
    } catch (error: any) {
      addNotification(error.message || "Échec de la connexion", 'error');
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
