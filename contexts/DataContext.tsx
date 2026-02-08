
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
    Member, Event, Contribution, AdiyaCampaign, BudgetRequest, CommissionFinancialReport, 
    Task, Vehicle, Driver, TransportSchedule, LibraryResource, SocialCase, SocialProject, 
    TicketItem, InventoryItem, KhassaideModule, Partner, SocialPost, StudyGroup 
} from '../types';
import * as db from '../services/dbService';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface DataContextType {
  members: Member[];
  events: Event[];
  contributions: Contribution[];
  adiyaCampaigns: AdiyaCampaign[];
  budgetRequests: BudgetRequest[];
  financialReports: CommissionFinancialReport[];
  tasks: Task[];
  fleet: Vehicle[];
  drivers: Driver[];
  schedules: TransportSchedule[];
  library: LibraryResource[];
  socialCases: SocialCase[];
  socialProjects: SocialProject[];
  tickets: TicketItem[];
  inventory: InventoryItem[];
  khassaideModules: KhassaideModule[];
  partners: Partner[];
  socialPosts: SocialPost[];
  studyGroups: StudyGroup[];
  totalTreasury: number;
  activeMembersCount: number;
  isLoading: boolean;
  addContribution: (c: any) => Promise<void>;
  addTask: (t: any) => Promise<void>;
  refresh: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const [members, setMembers] = useState<Member[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  // ... autres états initialisés à []

  const loadAllData = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const [m, c, e, t] = await Promise.all([
        db.dbFetchMembers(),
        db.dbFetchContributions(),
        db.dbFetchEvents(),
        db.dbFetchTasks()
      ]);
      setMembers(m);
      setContributions(c);
      setEvents(e);
      setTasks(t);
    } catch (err) {
      console.error("Data Load Error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadAllData();

    // REAL-TIME SUBSCRIPTION
    if (isAuthenticated) {
      const channel = supabase.channel('schema-db-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'contributions' }, () => loadAllData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => loadAllData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => loadAllData())
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
  }, [isAuthenticated, loadAllData]);

  const addContribution = async (c: any) => {
    await db.dbAddContribution(c);
    // Le refresh sera fait par l'écoute real-time
  };

  const addTask = async (t: any) => {
    await db.dbAddTask(t);
  };

  const totalTreasury = contributions.reduce((acc, c) => acc + c.amount, 0);
  const activeMembersCount = members.filter(m => m.status === 'active').length;

  return (
    <DataContext.Provider value={{
      members, events, contributions, tasks, 
      adiyaCampaigns: [], budgetRequests: [], financialReports: [],
      fleet: [], drivers: [], schedules: [], tickets: [], inventory: [], 
      library: [], khassaideModules: [], socialCases: [], socialProjects: [],
      partners: [], socialPosts: [], studyGroups: [],
      totalTreasury, activeMembersCount, isLoading, 
      addContribution, addTask, refresh: loadAllData
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
