
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { 
    Member, Event, Contribution, AdiyaCampaign, BudgetRequest, CommissionFinancialReport, 
    Task, Vehicle, Driver, TransportSchedule, LibraryResource, SocialCase, SocialProject, 
    TicketItem, InventoryItem, KhassaideModule, Partner, SocialPost, StudyGroup, FundraisingEvent,
    InternalMeetingReport
} from '../types';
import { supabase } from '../lib/supabase';
// Fix: Corrected path for AuthContext
import { useAuth } from './AuthContext';

interface DataContextType {
  members: Member[];
  events: Event[];
  contributions: Contribution[];
  tasks: Task[];
  reports: InternalMeetingReport[];
  inventory: InventoryItem[];
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
  budgetRequests: BudgetRequest[];
  financialReports: CommissionFinancialReport[];
  adiyaCampaigns: AdiyaCampaign[];
  fundraisingEvents: FundraisingEvent[];
  drivers: Driver[];
  schedules: TransportSchedule[];
  tickets: TicketItem[];
  khassaideModules: KhassaideModule[];
  library: LibraryResource[];
  addInventoryItem: (item: InventoryItem) => Promise<void>;
  deleteInventoryItem: (id: string) => Promise<void>;
  addVehicle: (v: Vehicle) => Promise<void>;
  updateVehicleStatus: (id: string, status: string) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
  addSchedule: (s: TransportSchedule) => Promise<void>;
  addDriver: (d: Driver) => Promise<void>;
  deleteDriver: (id: string) => Promise<void>;
  updateDriver: (id: string, updates: any) => Promise<void>;
  addAdiyaCampaign: (c: AdiyaCampaign) => Promise<void>;
  updateAdiyaCampaign: (id: string, updates: any) => Promise<void>;
  addFundraisingEvent: (e: FundraisingEvent) => Promise<void>;
  updateFundraisingEvent: (id: string, updates: any) => Promise<void>;
  addSocialCase: (c: any) => Promise<void>;
  addSocialProject: (p: any) => Promise<void>;
  addResource: (r: LibraryResource) => Promise<void>;
  deleteResource: (id: string) => Promise<void>;
  updateKhassaideModule: (id: string, updates: any) => Promise<void>;
  addKhassaideModule: (m: any) => Promise<void>;
  addPartner: (p: any) => Promise<void>;
  addSocialPost: (p: any) => Promise<void>;
  addStudyGroup: (g: any) => Promise<void>;
  addFinancialReport: (r: any) => Promise<void>;
  addBudgetRequest: (r: any) => Promise<void>;
  updateBudgetRequest: (id: string, updates: any) => Promise<void>;
  updateFinancialReport: (id: string, updates: any) => Promise<void>;
  uploadMemberDocument: (memberId: string, file: File, type: string) => Promise<void>;
  deleteMemberDocument: (docId: string, filePath: string) => Promise<void>;
  importMembers: (data: any) => Promise<void>;
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
        if (error.message?.includes('aborted') || error.message?.includes('signal')) {
            return [];
        }
        console.error(`DataContext: Erreur sur la table '${tableName}' :`, error.message);
        return [];
      }
      return data || [];
    } catch (e: any) {
      if (e.name === 'AbortError' || e.message?.includes('aborted')) return [];
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

    try {
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
      console.error("DataContext: refreshAll failed partially:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => { 
    let isMounted = true;
    if (user) {
        refreshAll().then(() => {
          if (!isMounted) return;
        });
    } else {
        setIsLoading(false);
    }
    return () => { isMounted = false; };
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

  // Implement placeholders
  const addInventoryItem = async (item: InventoryItem) => { console.log('Mock addInventoryItem'); };
  const deleteInventoryItem = async (id: string) => { console.log('Mock deleteInventoryItem'); };
  const addVehicle = async (v: Vehicle) => { console.log('Mock addVehicle'); };
  const updateVehicleStatus = async (id: string, status: string) => { console.log('Mock updateVehicleStatus'); };
  const deleteVehicle = async (id: string) => { console.log('Mock deleteVehicle'); };
  const addSchedule = async (s: TransportSchedule) => { console.log('Mock addSchedule'); };
  const addDriver = async (d: Driver) => { console.log('Mock addDriver'); };
  const deleteDriver = async (id: string) => { console.log('Mock deleteDriver'); };
  const updateDriver = async (id: string, updates: any) => { console.log('Mock updateDriver'); };
  const addAdiyaCampaign = async (c: AdiyaCampaign) => { console.log('Mock addAdiyaCampaign'); };
  const updateAdiyaCampaign = async (id: string, updates: any) => { console.log('Mock updateAdiyaCampaign'); };
  const addFundraisingEvent = async (e: FundraisingEvent) => { console.log('Mock addFundraisingEvent'); };
  const updateFundraisingEvent = async (id: string, updates: any) => { console.log('Mock updateFundraisingEvent'); };
  const addSocialCase = async (c: any) => { console.log('Mock addSocialCase'); };
  const addSocialProject = async (p: any) => { console.log('Mock addSocialProject'); };
  const addResource = async (r: LibraryResource) => { console.log('Mock addResource'); };
  const deleteResource = async (id: string) => { console.log('Mock deleteResource'); };
  const updateKhassaideModule = async (id: string, updates: any) => { console.log('Mock updateKhassaideModule'); };
  const addKhassaideModule = async (m: any) => { console.log('Mock addKhassaideModule'); };
  const addPartner = async (p: any) => { console.log('Mock addPartner'); };
  const addSocialPost = async (p: any) => { console.log('Mock addSocialPost'); };
  const addStudyGroup = async (g: any) => { console.log('Mock addStudyGroup'); };
  const addFinancialReport = async (r: any) => { console.log('Mock addFinancialReport'); };
  const addBudgetRequest = async (r: any) => { console.log('Mock addBudgetRequest'); };
  const updateBudgetRequest = async (id: string, updates: any) => { console.log('Mock updateBudgetRequest'); };
  const updateFinancialReport = async (id: string, updates: any) => { console.log('Mock updateFinancialReport'); };
  const uploadMemberDocument = async (memberId: string, file: File, type: string) => { console.log('Mock uploadMemberDocument'); };
  const deleteMemberDocument = async (docId: string, filePath: string) => { console.log('Mock deleteMemberDocument'); };
  const importMembers = async (data: any) => { console.log('Mock importMembers'); };

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
      drivers: [], schedules: [], tickets: [], khassaideModules: [], library: [],
      addInventoryItem, deleteInventoryItem, addVehicle, updateVehicleStatus, deleteVehicle,
      addSchedule, addDriver, deleteDriver, updateDriver, addAdiyaCampaign, updateAdiyaCampaign,
      addFundraisingEvent, updateFundraisingEvent, addSocialCase, addSocialProject,
      addResource, deleteResource, updateKhassaideModule, addKhassaideModule, addPartner,
      addSocialPost, addStudyGroup, addFinancialReport, addBudgetRequest, updateBudgetRequest,
      updateFinancialReport, uploadMemberDocument, deleteMemberDocument, importMembers
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
