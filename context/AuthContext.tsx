
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useNotification } from './NotificationContext';
import { useLoading } from './LoadingContext';
import { supabase } from '../lib/supabase';
import { APP_VERSION } from '../constants';

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
      // 1. Essayer de récupérer le profil
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn("Profil non trouvé ou erreur RLS, tentative de création par défaut...");
      }

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

      // 2. Si aucun profil n'existe, on en crée un automatiquement (Ghost User protection)
      const newProfile = {
        id: userId,
        email: email,
        first_name: email.split('@')[0],
        last_name: '',
        role: 'MEMBRE',
        status: 'active'
      };

      const { data: createdData, error: createError } = await supabase
        .from('profiles')
        .insert([newProfile])
        .select()
        .single();

      if (createError) {
        console.error("Erreur critique lors de la création du profil:", createError);
        // Fallback local pour ne pas bloquer l'utilisateur
        return {
          id: userId,
          email,
          firstName: newProfile.first_name,
          lastName: '',
          role: 'NEW_USER'
        };
      }

      return {
        id: createdData.id,
        email: email,
        firstName: createdData.first_name,
        lastName: createdData.last_name,
        role: createdData.role,
        status: createdData.status
      } as any;

    } catch (e) {
      console.error("Erreur fatale dans fetchProfile:", e);
      return null;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const profile = await fetchProfile(session.user.id, session.user.email!);
          setUser(profile);
        }
      } catch (err) {
        console.error("Auth init error:", err);
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
        const name = profile?.firstName || email.split('@')[0];
        addNotification(`Heureux de vous revoir, ${name}`, 'success');
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
