
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Member, Event, Contribution, InternalMeetingReport, CommissionFinancialReport, BudgetRequest, UserProfile, AdiyaCampaign, FundraisingEvent, Task } from '../types';
import { 
  dbFetchMembers, dbFetchContributions, dbFetchEvents, dbFetchReports, 
  dbCreateMember, dbUpdateMember, dbDeleteMember,
  dbCreateContribution, dbCreateEvent, dbCreateReport, dbFetchTasks, dbFetchAdiyaCampaigns
} from '../services/dbService';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';

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

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { addNotification } = useNotification();
  
  const [isLoading, setIsLoading] = useState(false);
  
  const [userProfile, setUserProfile] = useState<UserProfile>({} as UserProfile);
  const [members, setMembers] = useState<Member[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [reports, setReports] = useState<InternalMeetingReport[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [adiyaCampaigns, setAdiyaCampaigns] = useState<AdiyaCampaign[]>([]);
  
  const [financialReports] = useState<CommissionFinancialReport[]>([]);
  const [budgetRequests] = useState<BudgetRequest[]>([]);
  const [fundraisingEvents] = useState<FundraisingEvent[]>([]);

  // --- CHARGEMENT INITIAL (PRODUCTION) ---
  useEffect(() => {
    const loadData = async () => {
      if (!isAuthenticated) return;

      setIsLoading(true);
      try {
        const [m, c, e, r, t, a] = await Promise.all([
          dbFetchMembers(),
          dbFetchContributions(),
          dbFetchEvents(),
          dbFetchReports(),
          dbFetchTasks(),
          dbFetchAdiyaCampaigns()
        ]);
        
        setMembers(m);
        setContributions(c);
        setEvents(e);
        setReports(r);
        setTasks(t);
        setAdiyaCampaigns(a);
        
      } catch (error: any) {
        console.error("Erreur critique chargement données:", error);
        addNotification("Erreur de connexion au serveur. Certaines données peuvent être indisponibles.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated]);

  // --- REAL ACTIONS ---
  
  const updateUserProfile = (data: Partial<UserProfile>) => setUserProfile({ ...userProfile, ...data });

  const addMember = async (m: Member) => {
      try {
          await dbCreateMember(m);
          setMembers(await dbFetchMembers()); // Refresh list
          addNotification("Membre ajouté avec succès", "success");
      } catch (e: any) {
          addNotification("Erreur ajout membre: " + e.message, "error");
      }
  };

  const updateMember = async (id: string, d: Partial<Member>) => {
      try {
          await dbUpdateMember(id, d);
          setMembers(prev => prev.map(m => m.id === id ? {...m, ...d} : m));
          addNotification("Profil mis à jour", "success");
      } catch (e: any) {
          addNotification("Erreur mise à jour: " + e.message, "error");
      }
  };

  const deleteMember = async (id: string) => {
      try {
          await dbDeleteMember(id);
          setMembers(prev => prev.filter(m => m.id !== id));
          addNotification("Membre supprimé", "info");
      } catch (e: any) {
          addNotification("Erreur suppression: " + e.message, "error");
      }
  };

  const importMembers = (ms: Member[]) => {
      // Pour l'instant, on ajoute un par un, à optimiser avec un endpoint /bulk
      ms.forEach(m => addMember(m));
  };

  const updateMemberStatus = async (id: string, s: 'active'|'inactive') => {
      await updateMember(id, { status: s });
  };
  
  const addEvent = async (e: Event) => {
      try {
          await dbCreateEvent(e);
          setEvents(await dbFetchEvents());
          addNotification("Événement créé", "success");
      } catch (err: any) {
          addNotification(err.message, "error");
      }
  };

  const addContribution = async (c: Contribution) => {
      try {
          await dbCreateContribution(c);
          setContributions(await dbFetchContributions());
          addNotification("Paiement enregistré", "success");
      } catch (err: any) {
          addNotification(err.message, "error");
      }
  };

  const updateContribution = (id: string, d: Partial<Contribution>) => {};
  const deleteContribution = (id: string) => {};
  
  const addReport = async (r: InternalMeetingReport) => {
      try {
          await dbCreateReport(r);
          setReports(await dbFetchReports());
          addNotification("Rapport créé", "success");
      } catch (err: any) {
          addNotification(err.message, "error");
      }
  };
  
  const addTask = async (t: Task) => {
      // Placeholder: Implement create task api
  };
  
  const addAdiyaCampaign = () => {};
  const updateAdiyaCampaign = () => {};
  const addFundraisingEvent = () => {};
  const updateFundraisingEvent = () => {};
  const updateTask = () => {};
  const deleteTask = () => {};

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
