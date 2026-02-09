
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { 
    Member, Event, Contribution, AdiyaCampaign, BudgetRequest, CommissionFinancialReport, 
    Task, Vehicle, Driver, TransportSchedule, LibraryResource, SocialCase, SocialProject, 
    TicketItem, InventoryItem, KhassaideModule, Partner, SocialPost, StudyGroup, FundraisingEvent,
    InternalMeetingReport
} from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface DataContextType {
  members: Member[];
  events: Event[];
  contributions: Contribution[];
  tasks: Task[];
  reports: InternalMeetingReport[];
  inventory: InventoryItem[];
  // Fix: keep the first definition of fleet (line 19)
  fleet: Vehicle[];
  totalTreasury: number;
  activeMembersCount: number;
  isLoading: boolean;
  refreshAll: () => Promise<void>;
  addContribution: (c: any) => Promise<void>;
  updateContribution: (id: string, updates: any) => Promise<void>;
  deleteContribution: (id: string) => Promise<void>;
  addTask: (t: any) => Promise<void>;
  updateTask: (id: string, updates: any) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addMember: (m: any) => Promise<void>;
  updateMember: (id: string, updates: any) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  updateMemberStatus: (id: string, status: string) => Promise<void>;
  addEvent: (e: any) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  // ... autres stubs conservés pour compatibilité
  budgetRequests: BudgetRequest[];
  financialReports: CommissionFinancialReport[];
  adiyaCampaigns: AdiyaCampaign[];
  fundraisingEvents: FundraisingEvent[];
  // Fix: removed duplicate 'fleet' definition from line 41
  drivers: Driver[];
  schedules: TransportSchedule[];
  tickets: TicketItem[];
  khassaideModules: KhassaideModule[];
  library: LibraryResource[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  const [members, setMembers] = useState<Member[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [reports, setReports] = useState<InternalMeetingReport[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [fleet, setFleet] = useState<Vehicle[]>([]);

  const safeFetch = async (tableName: string) => {
    try {
      const { data, error } = await supabase.from(tableName).select('*');
      if (error) {
        console.error(`DataContext: Erreur sur la table '${tableName}' :`, error.message);
        return [];
      }
      return data || [];
    } catch (e) {
      console.warn(`DataContext: Table '${tableName}' introuvable ou inaccessible.`);
      return [];
    }
  };

  const refreshAll = useCallback(async () => {
    if (!user) {
        setIsLoading(false);
        return;
    }
    
    setIsLoading(true);
    console.log("DataContext: Déclenchement de la synchronisation...");

    try {
      // On exécute les fetchs de manière indépendante pour ne pas bloquer si un échoue
      const [m, e, c, t, r, inv, flt] = await Promise.all([
        safeFetch('profiles'),
        safeFetch('events'),
        safeFetch('contributions'),
        safeFetch('tasks'),
        safeFetch('meeting_reports'),
        safeFetch('inventory'),
        safeFetch('fleet')
      ]);

      setMembers(m.map((x: any) => ({
          id: x.id, firstName: x.first_name, lastName: x.last_name, email: x.email, 
          phone: x.phone, role: x.role, category: x.category, matricule: x.matricule,
          status: x.status, address: x.address, joinDate: x.created_at,
          coordinates: x.coordinates || { lat: 14.7167, lng: -17.4677 }, commissions: x.commissions || [],
          documents: x.documents || []
      })));
      setEvents(e);
      setContributions(c);
      setTasks(t);
      setReports(r);
      setInventory(inv);
      setFleet(flt);

    } catch (err) {
      console.error("DataContext: Erreur fatale refreshAll:", err);
    } finally {
      setIsLoading(false);
      console.log("DataContext: Synchro terminée (mode résilient).");
    }
  }, [user]);

  useEffect(() => { 
    if (user) {
        refreshAll();
    } else {
        setIsLoading(false);
    }
  }, [user, refreshAll]);

  // Mutations
  const addContribution = async (c: any) => {
    const { error } = await supabase.from('contributions').insert([{
        member_id: c.memberId,
        type: c.type,
        amount: c.amount,
        event_label: c.eventLabel,
        status: 'paid'
    }]);
    if (!error) refreshAll();
  };

  const updateContribution = async (id: string, updates: any) => {
    const { error } = await supabase.from('contributions').update(updates).eq('id', id);
    if (!error) refreshAll();
  };

  const deleteContribution = async (id: string) => {
    const { error } = await supabase.from('contributions').delete().eq('id', id);
    if (!error) refreshAll();
  };

  const addTask = async (t: any) => {
    const { error } = await supabase.from('tasks').insert([t]);
    if (!error) refreshAll();
  };

  const updateTask = async (id: string, updates: any) => {
    const { error } = await supabase.from('tasks').update(updates).eq('id', id);
    if (!error) refreshAll();
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (!error) refreshAll();
  };

  const addMember = async (m: any) => {
    const { error } = await supabase.from('profiles').insert([m]);
    if (!error) refreshAll();
  };

  const updateMember = async (id: string, updates: any) => {
    const { error } = await supabase.from('profiles').update(updates).eq('id', id);
    if (!error) refreshAll();
  };

  const deleteMember = async (id: string) => {
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (!error) refreshAll();
  };

  const updateMemberStatus = async (id: string, status: string) => {
    await updateMember(id, { status });
  };

  const addEvent = async (e: any) => {
    const { error } = await supabase.from('events').insert([e]);
    if (!error) refreshAll();
  };

  const deleteEvent = async (id: string) => {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (!error) refreshAll();
  };

  const totalTreasury = contributions.reduce((acc, c) => acc + (c.status === 'paid' ? c.amount : 0), 0);
  const activeMembersCount = members.filter(m => m.status === 'active').length;

  return (
    <DataContext.Provider value={{ 
      members, events, contributions, tasks, reports, inventory, fleet,
      totalTreasury, activeMembersCount, isLoading, refreshAll,
      addContribution, updateContribution, deleteContribution, addTask, updateTask, deleteTask,
      addMember, updateMember, deleteMember, updateMemberStatus,
      addEvent, deleteEvent,
      budgetRequests: [], financialReports: [], adiyaCampaigns: [], fundraisingEvents: [],
      // Fix: removed duplicate 'fleet' property from Provider value object
      drivers: [], schedules: [], tickets: [], khassaideModules: [], library: []
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
