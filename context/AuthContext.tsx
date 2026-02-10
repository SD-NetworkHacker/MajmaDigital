import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useNotification } from './NotificationContext';
import { useLoading } from './LoadingContext';
import { supabase } from '../lib/supabase';
import { CommissionAssignment } from '../types';

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
  bio?: string;
  originalRole?: string;
  commissions: CommissionAssignment[];
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  register: (data: any) => Promise<{ success: boolean; needsVerification: boolean }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateUser: (data: any) => Promise<void>;
  impersonate: (member: any) => Promise<void>;
}

const CACHE_KEY = 'majmadigital_auth_cache';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : null;
    }
    return null;
  });
  
  const [loading, setLoading] = useState(!user);
  const { addNotification } = useNotification();
  const { showLoading, hideLoading } = useLoading();

  const mapProfile = (authUser: any, dbProfile?: any): UserProfile => {
    const metadata = authUser.user_metadata || {};
    return {
      id: authUser.id,
      email: authUser.email || '',
      firstName: dbProfile?.first_name || metadata.first_name || 'Utilisateur',
      lastName: dbProfile?.last_name || metadata.last_name || '...',
      role: dbProfile?.role || 'MEMBRE',
      matricule: dbProfile?.matricule || metadata.matricule || 'MAJ-PENDING',
      category: dbProfile?.category || metadata.category || 'Étudiant',
      avatarUrl: dbProfile?.avatar_url || metadata.avatar_url,
      joinDate: dbProfile?.created_at || authUser.created_at,
      bio: dbProfile?.bio || '',
      commissions: dbProfile?.commissions || user?.commissions || []
    };
  };

  const saveToCache = (profile: UserProfile | null) => {
    if (profile) {
      localStorage.setItem(CACHE_KEY, JSON.stringify(profile));
    } else {
      localStorage.removeItem(CACHE_KEY);
    }
  };

  const refreshProfile = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const instantUser = mapProfile(session.user);
        setUser(instantUser);
        setLoading(false);

        const { data: dbProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();
        
        if (dbProfile) {
          const fullUser = mapProfile(session.user, dbProfile);
          setUser(fullUser);
          saveToCache(fullUser);
        }
      } else {
        setUser(null);
        saveToCache(null);
        setLoading(false);
      }
    } catch (err) {
      console.error("Auth Error:", err);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          const fastUser = mapProfile(session.user);
          setUser(fastUser);
          setLoading(false);
          
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
            
          if (profile) {
            const finalUser = mapProfile(session.user, profile);
            setUser(finalUser);
            saveToCache(finalUser);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        saveToCache(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [refreshProfile]);

  const login = async (email: string, password: string) => {
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

  const logout = useCallback(async () => {
    showLoading();
    try {
      // 1. Appel Supabase
      await supabase.auth.signOut();
    } catch (err) {
      console.warn("SignOut Supabase error:", err);
    } finally {
      // 2. Nettoyage Forcé quoi qu'il arrive
      setUser(null);
      localStorage.clear();
      saveToCache(null);
      hideLoading();
      
      // 3. Redirection propre à la racine
      window.location.href = window.location.origin;
    }
  }, [showLoading, hideLoading]);

  const updateUser = async (data: any) => {
    if (!user) return;
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
    }
  };

  const impersonate = async (member: any) => {
    addNotification(`Mode simulation : ${member.firstName}`, "info");
    setUser(prev => prev ? { ...prev, ...member, id: member.id, originalRole: prev.role } : null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, isAuthenticated: !!user, loading, login, register, 
      logout, refreshProfile, updateUser, impersonate 
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