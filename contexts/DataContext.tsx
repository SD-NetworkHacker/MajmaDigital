
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Member, Event, Contribution, InternalMeetingReport, CommissionFinancialReport, BudgetRequest, UserProfile, AdiyaCampaign, FundraisingEvent, Task } from '../types';
import { 
  dbFetchMembers, dbCreateMember, dbUpdateMember, dbDeleteMember,
  dbFetchContributions, dbCreateContribution, dbUpdateContribution, dbDeleteContribution,
  dbFetchEvents, dbCreateEvent,
  dbFetchReports, dbCreateReport,
  dbFetchFinancialReports, dbCreateFinancialReport,
  dbFetchBudgetRequests, dbCreateBudgetRequest,
  dbFetchAdiyaCampaigns, dbCreateAdiyaCampaign, dbUpdateAdiyaCampaign,
  dbFetchFundraisingEvents, dbCreateFundraisingEvent, dbUpdateFundraisingEvent,
  dbFetchTasks, dbCreateTask, dbUpdateTask, dbDeleteTask
} from '../services/dbService';

const KEY_PROFILE = 'MAJMA_USER_PROFILE';

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

const loadFromStorage = <T,>(key: string, defaultData: T): T => {
  try {
    const storedData = localStorage.getItem(key);
    if (!storedData || storedData === "undefined") return defaultData;
    return JSON.parse(storedData);
  } catch (error) {
    return defaultData;
  }
};

const saveToStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {}
};

const DEFAULT_USER_PROFILE: UserProfile = {
  firstName: 'Administrateur',
  lastName: 'Principal',
  email: 'admin@majma.sn',
  bio: "Compte de gestion globale de la plateforme MajmaDigital.",
  matricule: 'ADMIN-001',
  role: 'Super Admin',
  preferences: { darkMode: false, language: 'Français (Sénégal)' },
  notifications: { channels: { email: true, push: true, sms: true }, types: { meetings: true, contributions: true, events: true, info: true, security: true } },
  security: { twoFactorEnabled: true, lastPasswordUpdate: new Date().toISOString(), loginHistory: [] }
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  const [userProfile, setUserProfile] = useState<UserProfile>(() => loadFromStorage(KEY_PROFILE, DEFAULT_USER_PROFILE));
  const [members, setMembers] = useState<Member[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [reports, setReports] = useState<InternalMeetingReport[]>([]);
  const [financialReports, setFinancialReports] = useState<CommissionFinancialReport[]>([]);
  const [budgetRequests, setBudgetRequests] = useState<BudgetRequest[]>([]);
  const [adiyaCampaigns, setAdiyaCampaigns] = useState<AdiyaCampaign[]>([]);
  const [fundraisingEvents, setFundraisingEvents] = useState<FundraisingEvent[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  // --- INITIAL LOAD ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [m, c, e, r, fr, br, ac, fe, t] = await Promise.all([
          dbFetchMembers(),
          dbFetchContributions(),
          dbFetchEvents(),
          dbFetchReports(),
          dbFetchFinancialReports(),
          dbFetchBudgetRequests(),
          dbFetchAdiyaCampaigns(),
          dbFetchFundraisingEvents(),
          dbFetchTasks()
        ]);
        
        setMembers(m);
        setContributions(c);
        setEvents(e);
        setReports(r);
        setFinancialReports(fr);
        setBudgetRequests(br);
        setAdiyaCampaigns(ac);
        setFundraisingEvents(fe);
        setTasks(t);
      } catch (error) {
        console.error("Data Sync Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- ACTIONS ---

  const updateUserProfile = (data: Partial<UserProfile>) => {
    const updated = { ...userProfile, ...data };
    setUserProfile(updated);
    saveToStorage(KEY_PROFILE, updated);
  };

  const addMember = async (member: Member) => {
    await dbCreateMember(member);
    const freshMembers = await dbFetchMembers();
    setMembers(freshMembers);
  };

  const updateMember = async (id: string, data: Partial<Member>) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...data } : m));
    await dbUpdateMember(id, data);
  };

  const deleteMember = async (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    await dbDeleteMember(id);
  };
  
  const importMembers = async (newMembers: Member[]) => {
    for (const m of newMembers) await dbCreateMember(m);
    const freshMembers = await dbFetchMembers();
    setMembers(freshMembers);
  };

  const updateMemberStatus = async (id: string, status: 'active' | 'inactive') => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, status } : m));
    await dbUpdateMember(id, { status });
  };

  const addEvent = async (event: Event) => {
    setEvents(prev => [event, ...prev]);
    await dbCreateEvent(event);
  };

  const addContribution = async (contribution: Contribution) => {
    setContributions(prev => [contribution, ...prev]);
    await dbCreateContribution(contribution);
    const freshContribs = await dbFetchContributions();
    setContributions(freshContribs);
  };

  const updateContribution = async (id: string, data: Partial<Contribution>) => {
    setContributions(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
    await dbUpdateContribution(id, data);
  };

  const deleteContribution = async (id: string) => {
    setContributions(prev => prev.filter(c => c.id !== id));
    await dbDeleteContribution(id);
  };

  const addReport = async (report: InternalMeetingReport) => {
    setReports(prev => [report, ...prev]);
    await dbCreateReport(report);
  };

  const addAdiyaCampaign = async (campaign: AdiyaCampaign) => {
    setAdiyaCampaigns(prev => [campaign, ...prev]);
    await dbCreateAdiyaCampaign(campaign);
  };

  const updateAdiyaCampaign = async (id: string, data: Partial<AdiyaCampaign>) => {
    setAdiyaCampaigns(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
    await dbUpdateAdiyaCampaign(id, data);
  };

  const addFundraisingEvent = async (event: FundraisingEvent) => {
    setFundraisingEvents(prev => [event, ...prev]);
    await dbCreateFundraisingEvent(event);
  };

  const updateFundraisingEvent = async (id: string, data: Partial<FundraisingEvent>) => {
    setFundraisingEvents(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
    await dbUpdateFundraisingEvent(id, data);
  };

  const addTask = async (task: Task) => {
    setTasks(prev => [task, ...prev]);
    await dbCreateTask(task);
  };

  const updateTask = async (id: string, data: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
    await dbUpdateTask(id, data);
  };

  const deleteTask = async (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    await dbDeleteTask(id);
  };

  const totalTreasury = contributions.reduce((acc, c) => acc + c.amount, 0);
  const activeMembersCount = members.filter(m => m.status === 'active').length;

  const resetData = () => {
    if(confirm("ATTENTION : Cela effacera les données locales. Si une base de données est connectée, elle ne sera pas affectée par cette action locale.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

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
