
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
  loginAsGuest: () => void; // Nouvelle fonction pour le mode démo
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// PROFIL DE SECOURS (Mode Démo / Panne Backend)
const DEFAULT_SG_PROFILE: UserProfile = {
  id: 'sg-demo-id',
  firstName: 'Sidy',
  lastName: 'Sow',
  email: 'sg@majma.sn',
  bio: "Compte Secrétaire Général - Mode Démo",
  matricule: 'MAJ-SG-001',
  role: GlobalRole.SG,
  category: 'Travailleur'
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialisation à NULL pour afficher le GuestDashboard par défaut
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  
  const [originalAdminSession, setOriginalAdminSession] = useState<{user: UserProfile, token: string} | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);

  const { addNotification } = useNotification();
  const { showLoading, hideLoading } = useLoading();

  const logout = useCallback((reason?: string) => {
    localStorage.removeItem('jwt_token');
    setUser(null);
    setToken(null);
    if (reason) addNotification(reason, 'info');
    // Pas de reload forcé, on laisse le state React gérer l'affichage du GuestDashboard
  }, [addNotification]);

  const login = async (email: string, password: string) => {
    try {
      showLoading();
      // Tentative de connexion réelle
      const response = await fetch(`${API_URL}/api/members/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) throw new Error('Connexion échouée, passage en mode hors ligne.');
      
      const data = await response.json();
      const userProfile = { ...data, id: data._id };
      
      setUser(userProfile);
      setToken(data.token);
      localStorage.setItem('jwt_token', data.token);
      addNotification(`Connexion réussie: ${userProfile.firstName}`, 'success');

    } catch (error: any) {
      console.warn("Backend unreachable, engaging Demo Mode fallback:", error);
      // Fallback automatique si échec connexion réelle (pour dev/demo)
      loginAsGuest(); 
    } finally {
      hideLoading();
    }
  };

  // Fonction explicite pour activer le mode démo (depuis le GuestDashboard)
  const loginAsGuest = () => {
    setUser(DEFAULT_SG_PROFILE);
    setToken('demo-token');
    addNotification("Mode Démo SG activé", "success");
  };

  const register = async (formData: any) => {
    addNotification("Inscription simulée réussie (Mode Démo)", "success");
  };

  const updateUser = (data: Partial<UserProfile>) => {
    if (!user) return;
    setUser({ ...user, ...data });
  };

  const impersonate = (member: Member) => {
    if (!user) return;
    setIsSwitching(true);
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
    }, 1000); 
  };

  const stopImpersonation = () => {
    if (!originalAdminSession) return;
    setIsSwitching(true);
    setTimeout(() => {
        setUser(originalAdminSession.user);
        setToken(originalAdminSession.token);
        setOriginalAdminSession(null);
        setIsSwitching(false);
        addNotification("Retour vue SG", 'success');
    }, 800);
  };

  const getRedirectPath = useCallback(() => {
    return '/app';
  }, []);

  const refreshProfile = async () => {};

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
