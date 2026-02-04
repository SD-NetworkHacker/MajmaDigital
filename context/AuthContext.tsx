
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useNotification } from './NotificationContext';
import { useLoading } from './LoadingContext';
import { Member } from '../types';
import { API_URL } from '../constants';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatarUrl?: string;
  originalRole?: string;
  matricule?: string;
  bio?: string;
  category?: string;
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
  const [token, setToken] = useState<string | null>(localStorage.getItem('jwt_token'));
  
  const [originalAdminSession, setOriginalAdminSession] = useState<{user: UserProfile, token: string} | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);

  const { addNotification } = useNotification();
  const { showLoading, hideLoading } = useLoading();

  // Tentative de reconnexion au chargement si token existe
  useEffect(() => {
    const initAuth = async () => {
      if (token && !user) {
        try {
          const response = await fetch(`${API_URL}/api/members/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
            const data = await response.json();
             // Adaptation des données API vers UserProfile
            setUser({ 
                id: data._id, 
                ...data 
            });
          } else {
            // Token invalide
            logout();
          }
        } catch (e) {
          console.error("Erreur validation session", e);
        }
      }
    };
    initAuth();
  }, [token]);

  const logout = useCallback((reason?: string) => {
    localStorage.removeItem('jwt_token');
    setUser(null);
    setToken(null);
    setOriginalAdminSession(null);
    if (reason) addNotification(reason, 'info');
  }, [addNotification]);

  const login = async (email: string, password: string) => {
    try {
      showLoading();
      
      const response = await fetch(`${API_URL}/api/members/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Échec de la connexion');
      }
      
      const userProfile = { 
          id: data._id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          role: data.role,
          matricule: data.matricule,
          category: data.category
      };
      
      setUser(userProfile);
      setToken(data.token);
      localStorage.setItem('jwt_token', data.token);
      addNotification(`Heureux de vous revoir, ${userProfile.firstName}`, 'success');

    } catch (error: any) {
      console.error("Login Error:", error);
      addNotification(error.message, 'error');
      throw error; // Propager l'erreur pour le formulaire
    } finally {
      hideLoading();
    }
  };

  const register = async (formData: any) => {
    try {
      showLoading();
      const response = await fetch(`${API_URL}/api/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'inscription");
      }

      addNotification("Inscription réussie ! Vous pouvez vous connecter.", "success");
      
    } catch (error: any) {
      addNotification(error.message, 'error');
      throw error;
    } finally {
        hideLoading();
    }
  };

  const updateUser = (data: Partial<UserProfile>) => {
    if (!user) return;
    setUser({ ...user, ...data });
  };

  const impersonate = (member: Member) => {
    if (!user) return;
    setIsSwitching(true);
    // Simulation visuelle uniquement, pas d'appel API pour l'impersonation pour l'instant
    setTimeout(() => {
        if (!originalAdminSession) setOriginalAdminSession({ user, token: token || '' });
        setUser({
          id: member.id,
          email: member.email,
          firstName: member.firstName,
          lastName: member.lastName,
          role: member.role,
          matricule: member.matricule,
          category: member.category,
          originalRole: member.role 
        });
        setIsSwitching(false);
        addNotification(`Vue: ${member.firstName} (${member.role})`, 'info');
    }, 500); 
  };

  const stopImpersonation = () => {
    if (!originalAdminSession) return;
    setIsSwitching(true);
    setTimeout(() => {
        setUser(originalAdminSession.user);
        setToken(originalAdminSession.token);
        setOriginalAdminSession(null);
        setIsSwitching(false);
        addNotification("Retour vue Admin", 'success');
    }, 500);
  };

  const getRedirectPath = useCallback(() => {
    return '/app';
  }, []);

  const refreshProfile = async () => {};
  const loginAsGuest = () => {
      addNotification("Mode invité désactivé en production.", "warning");
  };

  return (
    <AuthContext.Provider 
      value={{ user, token, isAuthenticated: !!user, isImpersonating: !!originalAdminSession, isSwitching, login, register, logout, updateUser, impersonate, stopImpersonation, getRedirectPath, refreshProfile, loginAsGuest }}
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
