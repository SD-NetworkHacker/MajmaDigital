
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Member, Event, Contribution, InternalMeetingReport, CommissionFinancialReport, BudgetRequest, UserProfile } from '../types';
import { getAllReports } from '../services/reportService';

interface DataContextType {
  userProfile: UserProfile;
  members: Member[];
  events: Event[];
  contributions: Contribution[];
  reports: InternalMeetingReport[];
  financialReports: CommissionFinancialReport[];
  budgetRequests: BudgetRequest[];
  
  // Actions User
  updateUserProfile: (data: Partial<UserProfile>) => void;

  // Actions Membres
  addMember: (member: Member) => void;
  updateMember: (id: string, data: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  importMembers: (newMembers: Member[]) => void;
  updateMemberStatus: (id: string, status: 'active' | 'inactive') => void;

  // Actions Autres
  addEvent: (event: Event) => void;
  addContribution: (contribution: Contribution) => void;
  addReport: (report: InternalMeetingReport) => void;
  
  // Computed
  totalTreasury: number;
  activeMembersCount: number;
  
  // Maintenance
  resetData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Helper pour charger les données depuis le LocalStorage
const loadFromStorage = <T,>(key: string, defaultData: T): T => {
  try {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : defaultData;
  } catch (error) {
    console.error(`Erreur de chargement pour ${key}`, error);
    return defaultData;
  }
};

// PROFIL UNIQUE ADMINISTRATEUR (SUPER ADMIN)
const DEFAULT_USER_PROFILE: UserProfile = {
  firstName: 'Administrateur',
  lastName: 'Principal',
  email: 'admin@majma.sn',
  bio: "Compte de gestion globale de la plateforme MajmaDigital.",
  matricule: 'ADMIN-001',
  role: 'Super Admin',
  preferences: {
    darkMode: false,
    language: 'Français (Sénégal)'
  },
  notifications: {
    channels: { email: true, push: true, sms: true },
    types: { meetings: true, contributions: true, events: true, info: true, security: true }
  },
  security: {
    twoFactorEnabled: true,
    lastPasswordUpdate: new Date().toISOString(),
    loginHistory: []
  }
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // --- INITIALISATION DES ÉTATS (Démarrage à vide) ---
  
  const [userProfile, setUserProfile] = useState<UserProfile>(() => 
    loadFromStorage('MAJMA_USER_PROFILE', DEFAULT_USER_PROFILE)
  );

  const [members, setMembers] = useState<Member[]>(() => 
    loadFromStorage('MAJMA_MEMBERS', [])
  );

  const [events, setEvents] = useState<Event[]>(() => 
    loadFromStorage('MAJMA_EVENTS', [])
  );

  const [contributions, setContributions] = useState<Contribution[]>(() => 
    loadFromStorage('MAJMA_CONTRIBUTIONS', [])
  );

  const [reports, setReports] = useState<InternalMeetingReport[]>(() => 
    loadFromStorage('MAJMA_REPORTS', [])
  );

  const [financialReports, setFinancialReports] = useState<CommissionFinancialReport[]>(() => 
    loadFromStorage('MAJMA_FIN_REPORTS', [])
  );

  const [budgetRequests, setBudgetRequests] = useState<BudgetRequest[]>(() => 
    loadFromStorage('MAJMA_BUDGET_REQS', [])
  );

  // --- EFFETS DE SAUVEGARDE AUTOMATIQUE ---
  useEffect(() => { localStorage.setItem('MAJMA_USER_PROFILE', JSON.stringify(userProfile)); }, [userProfile]);
  useEffect(() => { localStorage.setItem('MAJMA_MEMBERS', JSON.stringify(members)); }, [members]);
  useEffect(() => { localStorage.setItem('MAJMA_EVENTS', JSON.stringify(events)); }, [events]);
  useEffect(() => { localStorage.setItem('MAJMA_CONTRIBUTIONS', JSON.stringify(contributions)); }, [contributions]);
  useEffect(() => { localStorage.setItem('MAJMA_REPORTS', JSON.stringify(reports)); }, [reports]);
  useEffect(() => { localStorage.setItem('MAJMA_FIN_REPORTS', JSON.stringify(financialReports)); }, [financialReports]);
  useEffect(() => { localStorage.setItem('MAJMA_BUDGET_REQS', JSON.stringify(budgetRequests)); }, [budgetRequests]);

  // --- CALCULS DÉRIVÉS ---
  const totalTreasury = contributions.reduce((acc, c) => acc + c.amount, 0);
  const activeMembersCount = members.filter(m => m.status === 'active').length;

  // --- ACTIONS (LOGIQUE MÉTIER) ---
  const updateUserProfile = (data: Partial<UserProfile>) => setUserProfile(prev => ({ ...prev, ...data }));
  const addMember = (member: Member) => setMembers(prev => [member, ...prev]);
  const updateMember = (id: string, data: Partial<Member>) => setMembers(prev => prev.map(m => m.id === id ? { ...m, ...data } : m));
  const deleteMember = (id: string) => setMembers(prev => prev.filter(m => m.id !== id));
  
  const importMembers = (newMembers: Member[]) => {
    const existingIds = new Set(members.map(m => m.id));
    const uniqueNewMembers = newMembers.filter(m => !existingIds.has(m.id));
    setMembers(prev => [...uniqueNewMembers, ...prev]);
  };

  const updateMemberStatus = (id: string, status: 'active' | 'inactive') => setMembers(prev => prev.map(m => m.id === id ? { ...m, status } : m));
  const addEvent = (event: Event) => setEvents(prev => [event, ...prev]);
  const addContribution = (contribution: Contribution) => setContributions(prev => [contribution, ...prev]);
  const addReport = (report: InternalMeetingReport) => setReports(prev => [report, ...prev]);

  const resetData = () => {
    if(confirm("Attention : Cette action va effacer TOUTES les données de la plateforme et restaurer le profil Admin par défaut. Continuer ?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <DataContext.Provider value={{
      userProfile, members, events, contributions, reports, financialReports, budgetRequests,
      updateUserProfile, addMember, updateMember, deleteMember, importMembers, updateMemberStatus,
      addEvent, addContribution, addReport,
      totalTreasury, activeMembersCount, resetData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
