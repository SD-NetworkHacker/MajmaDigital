
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Member, Event, Contribution, InternalMeetingReport, CommissionFinancialReport, BudgetRequest, UserProfile, AdiyaCampaign, FundraisingEvent, Task } from '../types';
import { 
  dbFetchMembers, dbFetchContributions, dbFetchEvents, dbFetchReports, 
  dbFetchFinancialReports, dbFetchBudgetRequests, dbFetchAdiyaCampaigns, 
  dbFetchFundraisingEvents, dbFetchTasks
} from '../services/dbService';
import { 
  SEED_MEMBERS, SEED_EVENTS, SEED_CONTRIBUTIONS, SEED_REPORTS, 
  SEED_FINANCIAL_REPORTS, SEED_BUDGET_REQUESTS, SEED_ADIYA_CAMPAIGNS, 
  SEED_FUNDRAISING_EVENTS 
} from '../constants';

// Interface inchangée...
interface DataContextType {
  userProfile: UserProfile;
  members: Member[];
  events: Event[];
  contributions: Contribution[];
  reports: InternalMeetingReport[];
  financialReports: CommissionFinancialReport[];
  budgetRequests: BudgetRequest[];
  adiyaCampaigns: AdiyaCampaign[];
  fundraisingEvents: FundraisingEvent[];
  tasks: Task[];
  
  updateUserProfile: (data: Partial<UserProfile>) => void;
  addMember: (member: Member) => void;
  updateMember: (id: string, data: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  importMembers: (newMembers: Member[]) => void;
  updateMemberStatus: (id: string, status: 'active' | 'inactive') => void;
  addEvent: (event: Event) => void;
  addContribution: (contribution: Contribution) => void;
  updateContribution: (id: string, data: Partial<Contribution>) => void;
  deleteContribution: (id: string) => void;
  addReport: (report: InternalMeetingReport) => void;
  addAdiyaCampaign: (campaign: AdiyaCampaign) => void;
  updateAdiyaCampaign: (id: string, data: Partial<AdiyaCampaign>) => void;
  addFundraisingEvent: (event: FundraisingEvent) => void;
  updateFundraisingEvent: (id: string, data: Partial<FundraisingEvent>) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, data: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  totalTreasury: number;
  activeMembersCount: number;
  resetData: () => void;
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const DEFAULT_USER_PROFILE: UserProfile = {
  firstName: 'Sidy',
  lastName: 'Sow',
  email: 'sg@majma.sn',
  bio: "Secrétaire Général",
  matricule: 'MAJ-SG-001',
  role: 'SG',
  preferences: { darkMode: false, language: 'Français (Sénégal)' },
  notifications: { channels: { email: true, push: true, sms: true }, types: { meetings: true, contributions: true, events: true, info: true, security: true } },
  security: { twoFactorEnabled: true, lastPasswordUpdate: new Date().toISOString(), loginHistory: [] }
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false); // Démarrer à false pour afficher l'UI immédiatement
  
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [members, setMembers] = useState<Member[]>(SEED_MEMBERS);
  const [events, setEvents] = useState<Event[]>(SEED_EVENTS);
  const [contributions, setContributions] = useState<Contribution[]>(SEED_CONTRIBUTIONS);
  const [reports, setReports] = useState<InternalMeetingReport[]>(SEED_REPORTS);
  const [financialReports, setFinancialReports] = useState<CommissionFinancialReport[]>(SEED_FINANCIAL_REPORTS);
  const [budgetRequests, setBudgetRequests] = useState<BudgetRequest[]>(SEED_BUDGET_REQUESTS);
  const [adiyaCampaigns, setAdiyaCampaigns] = useState<AdiyaCampaign[]>(SEED_ADIYA_CAMPAIGNS);
  const [fundraisingEvents, setFundraisingEvents] = useState<FundraisingEvent[]>(SEED_FUNDRAISING_EVENTS);
  const [tasks, setTasks] = useState<Task[]>([]);

  // --- INITIAL LOAD WITH FAILSAFE ---
  useEffect(() => {
    const fetchData = async () => {
      // On ne met pas isLoading à true ici pour ne pas bloquer l'UI si le fetch est lent
      try {
        console.log("Tentative de connexion aux données...");
        const [m, c, e, r, fr, br, ac, fe, t] = await Promise.all([
          dbFetchMembers().catch(() => SEED_MEMBERS),
          dbFetchContributions().catch(() => SEED_CONTRIBUTIONS),
          dbFetchEvents().catch(() => SEED_EVENTS),
          dbFetchReports().catch(() => SEED_REPORTS),
          dbFetchFinancialReports().catch(() => SEED_FINANCIAL_REPORTS),
          dbFetchBudgetRequests().catch(() => SEED_BUDGET_REQUESTS),
          dbFetchAdiyaCampaigns().catch(() => SEED_ADIYA_CAMPAIGNS),
          dbFetchFundraisingEvents().catch(() => SEED_FUNDRAISING_EVENTS),
          dbFetchTasks().catch(() => [])
        ]);
        
        // Mise à jour si données reçues (sinon on garde les SEED par défaut)
        if (m && m.length > 0) setMembers(m);
        if (c) setContributions(c);
        if (e) setEvents(e);
        if (r) setReports(r);
        if (fr) setFinancialReports(fr);
        if (br) setBudgetRequests(br);
        if (ac) setAdiyaCampaigns(ac);
        if (fe) setFundraisingEvents(fe);
        if (t) setTasks(t);
        
      } catch (error) {
        console.warn("Mode Hors Ligne activé (Données de secours chargées)", error);
        // On garde les données SEED initiales
      }
    };

    fetchData();
  }, []);

  // --- MOCK ACTIONS (Pour que l'UI réagisse même sans backend) ---
  const updateUserProfile = (data: Partial<UserProfile>) => setUserProfile({ ...userProfile, ...data });
  const addMember = (m: Member) => setMembers(prev => [m, ...prev]);
  const updateMember = (id: string, d: Partial<Member>) => setMembers(prev => prev.map(m => m.id === id ? {...m, ...d} : m));
  const deleteMember = (id: string) => setMembers(prev => prev.filter(m => m.id !== id));
  const importMembers = (ms: Member[]) => setMembers(prev => [...ms, ...prev]);
  const updateMemberStatus = (id: string, s: 'active'|'inactive') => updateMember(id, {status: s});
  
  const addEvent = (e: Event) => setEvents(prev => [e, ...prev]);
  const addContribution = (c: Contribution) => setContributions(prev => [c, ...prev]);
  const updateContribution = (id: string, d: Partial<Contribution>) => setContributions(prev => prev.map(c => c.id === id ? {...c, ...d} : c));
  const deleteContribution = (id: string) => setContributions(prev => prev.filter(c => c.id !== id));
  
  const addReport = (r: InternalMeetingReport) => setReports(prev => [r, ...prev]);
  const addAdiyaCampaign = (c: AdiyaCampaign) => setAdiyaCampaigns(prev => [c, ...prev]);
  const updateAdiyaCampaign = (id: string, d: Partial<AdiyaCampaign>) => setAdiyaCampaigns(prev => prev.map(c => c.id === id ? {...c, ...d} : c));
  const addFundraisingEvent = (e: FundraisingEvent) => setFundraisingEvents(prev => [e, ...prev]);
  const updateFundraisingEvent = (id: string, d: Partial<FundraisingEvent>) => setFundraisingEvents(prev => prev.map(e => e.id === id ? {...e, ...d} : e));
  
  const addTask = (t: Task) => setTasks(prev => [t, ...prev]);
  const updateTask = (id: string, d: Partial<Task>) => setTasks(prev => prev.map(t => t.id === id ? {...t, ...d} : t));
  const deleteTask = (id: string) => setTasks(prev => prev.filter(t => t.id !== id));

  const totalTreasury = contributions.reduce((acc, c) => acc + c.amount, 0);
  const activeMembersCount = members.filter(m => m.status === 'active').length;
  
  const resetData = () => { localStorage.clear(); window.location.reload(); };

  return (
    <DataContext.Provider value={{
      userProfile, members, events, contributions, reports, financialReports, budgetRequests, adiyaCampaigns, fundraisingEvents, tasks,
      updateUserProfile, addMember, updateMember, deleteMember, importMembers, updateMemberStatus,
      addEvent, addContribution, updateContribution, deleteContribution, addReport,
      addAdiyaCampaign, updateAdiyaCampaign,
      addFundraisingEvent, updateFundraisingEvent,
      addTask, updateTask, deleteTask,
      totalTreasury, activeMembersCount, resetData, isLoading
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
