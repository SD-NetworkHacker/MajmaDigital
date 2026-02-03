
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import { useNotification } from './NotificationContext';
import { useLoading } from './LoadingContext';
import { Member, GlobalRole } from '../types';

// Types pour l'utilisateur et le contexte
export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatarUrl?: string;
  originalRole?: string; // Pour garder trace du rôle réel lors du mapping
  matricule?: string; // Utile pour l'affichage
  bio?: string;
  category?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isImpersonating: boolean;
  isSwitching: boolean;
  login: (token: string, user: UserProfile) => void;
  logout: (reason?: string) => void;
  updateUser: (data: Partial<UserProfile>) => void; // Nouvelle méthode
  impersonate: (member: Member) => void;
  stopImpersonation: () => void;
  getRedirectPath: () => string;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Constantes de configuration
const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const REFRESH_TOKEN_INTERVAL = 14 * 60 * 1000; // 14 minutes

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  
  // Stockage de la session Admin originale pendant l'incarnation
  const [originalAdminSession, setOriginalAdminSession] = useState<{user: UserProfile, token: string} | null>(null);
  
  // État de transition visuelle
  const [isSwitching, setIsSwitching] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const { addNotification } = useNotification();
  const { showLoading, hideLoading } = useLoading();

  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const refreshTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // --- Gestion de l'inactivité ---
  const logout = useCallback((reason?: string) => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_profile');
    setToken(null);
    setUser(null);
    setOriginalAdminSession(null); 
    
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    if (refreshTimer.current) clearInterval(refreshTimer.current);

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

  // --- Gestion du Token ---
  const refreshAuthToken = async () => {
    try {
      // Simulation refresh token
    } catch (error) {
      console.error('Failed to refresh token', error);
      logout('Session invalide, veuillez vous reconnecter.');
    }
  };

  // --- Actions Publiques ---

  const login = (newToken: string, newUser: UserProfile) => {
    localStorage.setItem('jwt_token', newToken);
    localStorage.setItem('user_profile', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    addNotification(`Bienvenue, ${newUser.firstName} !`, 'success');
  };

  const updateUser = (data: Partial<UserProfile>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('user_profile', JSON.stringify(updatedUser));
    // addNotification("Profil mis à jour", "success");
  };

  // --- FONCTIONNALITÉ D'INCARNATION ---
  const impersonate = (member: Member) => {
    if (!user) return;

    // Déclenchement de l'animation de transition
    setIsSwitching(true);

    setTimeout(() => {
        // 1. Sauvegarde session Admin
        if (!originalAdminSession) {
            setOriginalAdminSession({ user, token: token || 'demo-token' });
        }

        // 2. Mapping
        let appRole: 'admin' | 'manager' | 'user' = 'user';
        if (member.role === GlobalRole.ADMIN || (member.role as string) === 'Super Admin') appRole = 'admin';
        else if (member.role === GlobalRole.SG || member.role === GlobalRole.DIEUWRINE) appRole = 'manager';
        else appRole = 'user';

        const impersonatedProfile: UserProfile = {
          id: member.id,
          email: member.email,
          firstName: member.firstName,
          lastName: member.lastName,
          role: appRole,
          matricule: member.matricule,
          category: member.category,
          avatarUrl: undefined, 
          originalRole: member.role 
        };

        // 3. Application
        setUser(impersonatedProfile);
        
        // Fin de la transition
        setTimeout(() => {
             setIsSwitching(false);
             addNotification(`Vous incarnez maintenant ${member.firstName}`, 'info');
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
    switch (user.role) {
      case 'admin': return '/admin/dashboard';
      case 'manager': return '/manager/overview';
      case 'user': return '/app/home';
      default: return '/';
    }
  }, [user]);

  const refreshProfile = async () => {
    showLoading();
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      addNotification('Erreur lors de la mise à jour du profil', 'error');
    } finally {
      hideLoading();
    }
  };

  // --- Effets de bord ---
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
    if (refreshTimer.current) clearInterval(refreshTimer.current);
    refreshTimer.current = setInterval(refreshAuthToken, REFRESH_TOKEN_INTERVAL);
    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      if (refreshTimer.current) clearInterval(refreshTimer.current);
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
