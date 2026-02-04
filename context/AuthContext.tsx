
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import { useNotification } from './NotificationContext';
import { useLoading } from './LoadingContext';
import { Member, GlobalRole } from '../types';
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const INACTIVITY_TIMEOUT = 30 * 60 * 1000;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  
  const [originalAdminSession, setOriginalAdminSession] = useState<{user: UserProfile, token: string} | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const { addNotification } = useNotification();
  const { showLoading, hideLoading } = useLoading();

  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const logout = useCallback((reason?: string) => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_profile');
    localStorage.removeItem('user_role');
    setToken(null);
    setUser(null);
    setOriginalAdminSession(null); 
    
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);

    if (reason) {
      addNotification(reason, 'warning');
    }
  }, [addNotification]);

  const resetInactivityTimer = useCallback(() => {
    if (!user) return;
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      logout('Session expirée pour cause d\'inactivité.');
    }, INACTIVITY_TIMEOUT);
  }, [user, logout]);

  // --- API CALLS VERS NGROK ---

  const login = async (email: string, password: string) => {
    try {
      showLoading();
      // Utilisation de l'API_URL définie dans constants.ts
      const response = await fetch(`${API_URL}/api/members/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Identifiants invalides');
      }

      const userProfile: UserProfile = {
        id: data._id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        matricule: data.matricule,
      };

      // Stockage Persistent
      localStorage.setItem('jwt_token', data.token);
      localStorage.setItem('user_profile', JSON.stringify(userProfile));
      localStorage.setItem('user_role', data.role);

      setToken(data.token);
      setUser(userProfile);
      addNotification(`Bienvenue, ${userProfile.firstName} !`, 'success');
      
    } catch (error: any) {
      console.error("Login Error:", error);
      addNotification(error.message, 'error');
      throw error;
    } finally {
      hideLoading();
    }
  };

  const register = async (formData: any) => {
    try {
      showLoading();
      const response = await fetch(`${API_URL}/api/members`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'inscription');
      }

      const userProfile: UserProfile = {
        id: data._id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        matricule: data.matricule,
      };

      localStorage.setItem('jwt_token', data.token);
      localStorage.setItem('user_profile', JSON.stringify(userProfile));
      localStorage.setItem('user_role', data.role);

      setToken(data.token);
      setUser(userProfile);
      addNotification("Inscription réussie !", "success");

    } catch (error: any) {
      addNotification(error.message, 'error');
      throw error;
    } finally {
      hideLoading();
    }
  };

  const updateUser = (data: Partial<UserProfile>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('user_profile', JSON.stringify(updatedUser));
  };

  // Fonction Admin pour tester d'autres vues
  const impersonate = (member: Member) => {
    if (!user) return;
    setIsSwitching(true);

    setTimeout(() => {
        if (!originalAdminSession) {
            setOriginalAdminSession({ user, token: token || '' });
        }

        const impersonatedProfile: UserProfile = {
          id: member.id,
          email: member.email,
          firstName: member.firstName,
          lastName: member.lastName,
          role: member.role,
          matricule: member.matricule,
          category: member.category,
          originalRole: member.role 
        };

        setUser(impersonatedProfile);
        setTimeout(() => {
             setIsSwitching(false);
             addNotification(`Mode incarnation : ${member.firstName}`, 'info');
        }, 800);
    }, 1500); 
  };

  const stopImpersonation = () => {
    if (!originalAdminSession) return;
    setIsSwitching(true);
    setTimeout(() => {
        setUser(originalAdminSession.user);
        setToken(originalAdminSession.token);
        setOriginalAdminSession(null);
        setIsSwitching(false);
        addNotification("Retour à la console Administrateur", 'success');
    }, 1000);
  };

  const getRedirectPath = useCallback(() => {
    if (!user) return '/login';
    // Redirection basée sur le rôle
    if (['ADMIN', 'SG', 'DIEUWRINE'].includes(user.role)) return '/admin';
    return '/app';
  }, [user]);

  const refreshProfile = async () => {
     // Implémentation future pour rafraîchir le profil via API
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('jwt_token');
    const storedUser = localStorage.getItem('user_profile');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (e) {
        logout();
      }
    }
    setIsInitialized(true);
  }, [logout]);

  useEffect(() => {
    if (!user) return;
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    const handleActivity = () => resetInactivityTimer();
    events.forEach(event => window.addEventListener(event, handleActivity));
    resetInactivityTimer();
    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, [user, resetInactivityTimer]);

  if (!isInitialized) return null;

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        isAuthenticated: !!user,
        isImpersonating: !!originalAdminSession, 
        isSwitching,
        login, 
        register,
        logout,
        updateUser,
        impersonate,
        stopImpersonation,
        getRedirectPath, 
        refreshProfile 
      }}
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
