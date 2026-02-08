
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
  register: (data: any) => Promise<void>;
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

  const mapProfile = (data: any, authUser: any): UserProfile => {
    // On priorise les données de la table profiles, puis les metadata de Auth, puis des valeurs par défaut
    const meta = authUser?.user_metadata || {};
    return {
      id: data?.id || authUser?.id,
      email: authUser?.email || data?.email || '',
      firstName: data?.first_name || meta?.first_name || 'Membre',
      lastName: data?.last_name || meta?.last_name || '',
      role: data?.role || 'MEMBRE',
      matricule: data?.matricule,
      category: data?.category || meta?.category,
      avatarUrl: data?.avatar_url || meta?.avatar_url,
      bio: data?.bio
    };
  };

  const fetchProfileWithRetry = async (userId: string, authUser: any, retries = 3): Promise<UserProfile | null> => {
    for (let i = 0; i < retries; i++) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (data) return mapProfile(data, authUser);
      
      // Si c'est un nouvel utilisateur, le trigger SQL peut mettre 100-200ms
      if (i < retries - 1) await new Promise(res => setTimeout(res, 300));
    }
    // Fallback sur les metadata de Auth si la table profiles est inaccessible
    return mapProfile(null, authUser);
  };

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted && session?.user) {
          const profile = await fetchProfileWithRetry(session.user.id, session.user);
          setUser(profile);
        }
      } catch (err) {
        console.error("Auth Init Error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        if (session?.user) {
          const profile = await fetchProfileWithRetry(session.user.id, session.user);
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
    showLoading();
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      addNotification(`Content de vous revoir !`, 'success');
    } catch (error: any) {
      addNotification(error.message || "Erreur de connexion", 'error');
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

      if (data.user) {
        addNotification("Inscription réussie ! Un email de confirmation a pu vous être envoyé.", "success");
      }
    } catch (error: any) {
      addNotification(error.message || "Erreur lors de l'inscription", "error");
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
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const p = await fetchProfileWithRetry(session.user.id, session.user);
      if (p) setUser(p);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      loading, 
      login, 
      register,
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
