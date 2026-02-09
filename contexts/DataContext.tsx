import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { 
    Member, Event, Contribution, AdiyaCampaign, BudgetRequest, CommissionFinancialReport, 
    Task, Vehicle, Driver, TransportSchedule, LibraryResource, SocialCase, SocialProject, 
    TicketItem, InventoryItem, KhassaideModule, Partner, SocialPost, StudyGroup, FundraisingEvent,
    InternalMeetingReport, UserProfile
} from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

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
  fundraisingEvents: FundraisingEvent[];
  reports: InternalMeetingReport[];
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
  batchApproveMembers: (ids: string[]) => Promise<void>;
  addEvent: (e: any) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  addSocialCase: (c: any) => Promise<void>;
  addSocialProject: (p: any) => Promise<void>;
  addFinancialReport: (r: any) => Promise<void>;
  updateFinancialReport: (id: string, updates: any) => Promise<void>;
  addBudgetRequest: (r: any) => Promise<void>;
  updateBudgetRequest: (id: string, updates: any) => Promise<void>;
  addAdiyaCampaign: (c: any) => Promise<void>;
  updateAdiyaCampaign: (id: string, updates: any) => Promise<void>;
  addFundraisingEvent: (e: any) => Promise<void>;
  updateFundraisingEvent: (id: string, updates: any) => Promise<void>;
  addVehicle: (v: any) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
  updateVehicleStatus: (id: string, status: string) => Promise<void>;
  addDriver: (d: any) => Promise<void>;
  deleteDriver: (id: string) => Promise<void>;
  updateDriver: (id: string, updates: any) => Promise<void>;
  addSchedule: (s: any) => Promise<void>;
  addTicket: (t: any) => Promise<void>;
  updateTicket: (id: string, updates: any) => Promise<void>;
  deleteTicket: (id: string) => Promise<void>;
  addInventoryItem: (i: any) => Promise<void>;
  deleteInventoryItem: (id: string) => Promise<void>;
  addResource: (r: any) => Promise<void>;
  deleteResource: (id: string) => Promise<void>;
  addKhassaideModule: (m: any) => Promise<void>;
  updateKhassaideModule: (id: string, updates: any) => Promise<void>;
  addPartner: (p: any) => Promise<void>;
  addSocialPost: (p: any) => Promise<void>;
  addStudyGroup: (g: any) => Promise<void>;
  importMembers: (data: any[]) => Promise<void>;
  uploadMemberDocument: (memberId: string, file: File, type: string) => Promise<void>;
  deleteMemberDocument: (docId: string, filePath: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  const [members, setMembers] = useState<Member[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [adiyaCampaigns, setAdiyaCampaigns] = useState<AdiyaCampaign[]>([]);
  const [budgetRequests, setBudgetRequests] = useState<BudgetRequest[]>([]);
  const [financialReports, setFinancialReports] = useState<CommissionFinancialReport[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [fleet, setFleet] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [schedules, setSchedules] = useState<TransportSchedule[]>([]);
  const [library, setLibrary] = useState<LibraryResource[]>([]);
  const [socialCases, setSocialCases] = useState<SocialCase[]>([]);
  const [socialProjects, setSocialProjects] = useState<SocialProject[]>([]);
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [khassaideModules, setKhassaideModules] = useState<KhassaideModule[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [fundraisingEvents, setFundraisingEvents] = useState<FundraisingEvent[]>([]);
  const [reports, setReports] = useState<InternalMeetingReport[]>([]);

  const refreshAll = useCallback(async () => {
    if (!user) {
        setIsLoading(false);
        return;
    }
    
    setIsLoading(true);
    console.log("DataContext: Début du chargement des données métier...");

    try {
      const [
        { data: m, error: errM }, 
        { data: e, error: errE }, 
        { data: c, error: errC }, 
        { data: t, error: errT }, 
        { data: r, error: errR }
      ] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('events').select('*'),
        supabase.from('contributions').select('*'),
        supabase.from('tasks').select('*'),
        supabase.from('meeting_reports').select('*')
      ]);

      if (errM) console.error("DataContext: Erreur fetch 'profiles'", errM);
      if (errE) console.error("DataContext: Erreur fetch 'events'", errE);
      if (errC) console.error("DataContext: Erreur fetch 'contributions'", errC);
      if (errT) console.error("DataContext: Erreur fetch 'tasks'", errT);
      if (errR) console.error("DataContext: Erreur fetch 'meeting_reports'", errR);

      if (m) setMembers(m.map(x => ({
          id: x.id, firstName: x.first_name, lastName: x.last_name, email: x.email, 
          phone: x.phone, role: x.role, category: x.category, matricule: x.matricule,
          status: x.status, address: x.address, joinDate: x.created_at,
          coordinates: x.coordinates || { lat: 0, lng: 0 }, commissions: x.commissions || [],
          documents: x.documents || []
      })));
      if (e) setEvents(e);
      if (c) setContributions(c);
      if (t) setTasks(t);
      if (r) setReports(r);
      
      const { data: inv } = await supabase.from('inventory').select('*');
      if (inv) setInventory(inv);
      const { data: flt } = await supabase.from('fleet').select('*');
      if (flt) setFleet(flt);

    } catch (err) {
      console.error("DataContext: Erreur globale refreshAll:", err);
    } finally {
      setIsLoading(false);
      console.log("DataContext: Synchronisation terminée.");
    }
  }, [user]);

  useEffect(() => { 
    refreshAll(); 

    // Safety Timeout 4s pour isDataLoading
    const safetyTimer = setTimeout(() => {
        if (isLoading) {
            console.warn("DataContext: Timeout sécurité 4s atteint pour les données métier. Forçage UI.");
            setIsLoading(false);
        }
    }, 4000);

    return () => clearTimeout(safetyTimer);
  }, [refreshAll, isLoading]);

  // Mutations (Supabase Direct)
  const addContribution = async (c: any) => {
    const { error } = await supabase.from('contributions').insert([c]);
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

  const batchApproveMembers = async (ids: string[]) => {
    const { error } = await supabase.from('profiles').update({ status: 'active' }).in('id', ids);
    if (!error) refreshAll();
  };

  const addEvent = async (e: any) => {
    const { error } = await supabase.from('events').insert([e]);
    if (!error) refreshAll();
  };

  const deleteEvent = async (id: string) => {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (!error) refreshAll();
  };

  const addSocialCase = async (c: any) => {
    const { error } = await supabase.from('social_cases').insert([c]);
    if (!error) refreshAll();
  };

  const addSocialProject = async (p: any) => {
    const { error } = await supabase.from('social_projects').insert([p]);
    if (!error) refreshAll();
  };

  const addFinancialReport = async (r: any) => {
    const { error } = await supabase.from('financial_reports').insert([r]);
    if (!error) refreshAll();
  };

  const updateFinancialReport = async (id: string, updates: any) => {
    const { error } = await supabase.from('financial_reports').update(updates).eq('id', id);
    if (!error) refreshAll();
  };

  const addBudgetRequest = async (r: any) => {
    const { error } = await supabase.from('budget_requests').insert([r]);
    if (!error) refreshAll();
  };

  const updateBudgetRequest = async (id: string, updates: any) => {
    const { error } = await supabase.from('budget_requests').update(updates).eq('id', id);
    if (!error) refreshAll();
  };

  const addAdiyaCampaign = async (c: any) => {
    const { error } = await supabase.from('adiya_campaigns').insert([c]);
    if (!error) refreshAll();
  };

  const updateAdiyaCampaign = async (id: string, updates: any) => {
    const { error } = await supabase.from('adiya_campaigns').update(updates).eq('id', id);
    if (!error) refreshAll();
  };

  const addFundraisingEvent = async (e: any) => {
    const { error } = await supabase.from('fundraising_events').insert([e]);
    if (!error) refreshAll();
  };

  const updateFundraisingEvent = async (id: string, updates: any) => {
    const { error } = await supabase.from('fundraising_events').update(updates).eq('id', id);
    if (!error) refreshAll();
  };

  const addVehicle = async (v: any) => {
    const { error } = await supabase.from('fleet').insert([v]);
    if (!error) refreshAll();
  };

  const deleteVehicle = async (id: string) => {
    const { error } = await supabase.from('fleet').delete().eq('id', id);
    if (!error) refreshAll();
  };

  const updateVehicleStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('fleet').update({ status }).eq('id', id);
    if (!error) refreshAll();
  };

  const addDriver = async (d: any) => {
    const { error } = await supabase.from('drivers').insert([d]);
    if (!error) refreshAll();
  };

  const deleteDriver = async (id: string) => {
    const { error } = await supabase.from('drivers').delete().eq('id', id);
    if (!error) refreshAll();
  };

  const updateDriver = async (id: string, updates: any) => {
    const { error } = await supabase.from('drivers').update(updates).eq('id', id);
    if (!error) refreshAll();
  };

  const addSchedule = async (s: any) => {
    const { error } = await supabase.from('trips').insert([s]);
    if (!error) refreshAll();
  };

  const addTicket = async (t: any) => {
    const { error } = await supabase.from('tickets').insert([t]);
    if (!error) refreshAll();
  };

  const updateTicket = async (id: string, updates: any) => {
    const { error } = await supabase.from('tickets').update(updates).eq('id', id);
    if (!error) refreshAll();
  };

  const deleteTicket = async (id: string) => {
    const { error } = await supabase.from('tickets').delete().eq('id', id);
    if (!error) refreshAll();
  };

  const addInventoryItem = async (i: any) => {
    const { error } = await supabase.from('inventory').insert([i]);
    if (!error) refreshAll();
  };

  const deleteInventoryItem = async (id: string) => {
    const { error } = await supabase.from('inventory').delete().eq('id', id);
    if (!error) refreshAll();
  };

  const addResource = async (r: any) => {
    const { error } = await supabase.from('library').insert([r]);
    if (!error) refreshAll();
  };

  const deleteResource = async (id: string) => {
    const { error } = await supabase.from('library').delete().eq('id', id);
    if (!error) refreshAll();
  };

  const addKhassaideModule = async (m: any) => {
    const { error } = await supabase.from('khassaide_modules').insert([m]);
    if (!error) refreshAll();
  };

  const updateKhassaideModule = async (id: string, updates: any) => {
    const { error } = await supabase.from('khassaide_modules').update(updates).eq('id', id);
    if (!error) refreshAll();
  };

  const addPartner = async (p: any) => {
    const { error } = await supabase.from('partners').insert([p]);
    if (!error) refreshAll();
  };

  const addSocialPost = async (p: any) => {
    const { error } = await supabase.from('social_posts').insert([p]);
    if (!error) refreshAll();
  };

  const addStudyGroup = async (g: any) => {
    const { error } = await supabase.from('study_groups').insert([g]);
    if (!error) refreshAll();
  };

  const importMembers = async (data: any[]) => {
    const { error } = await supabase.from('profiles').insert(data);
    if (!error) refreshAll();
  };

  const uploadMemberDocument = async (memberId: string, file: File, type: string) => {
    const filePath = `${memberId}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage.from('member-docs').upload(filePath, file);
    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage.from('member-docs').getPublicUrl(filePath);
    const { data: m } = await supabase.from('profiles').select('documents').eq('id', memberId).single();
    const newDocs = [...(m?.documents || []), { id: Date.now().toString(), name: file.name, type, url: publicUrl, date: new Date().toISOString(), verified: false }];
    await updateMember(memberId, { documents: newDocs });
  };

  const deleteMemberDocument = async (docId: string, filePath: string) => {
    refreshAll();
  };

  const totalTreasury = contributions.reduce((acc, c) => acc + (c.status === 'paid' ? c.amount : 0), 0);
  const activeMembersCount = members.filter(m => m.status === 'active').length;

  return (
    <DataContext.Provider value={{ 
      members, events, contributions, adiyaCampaigns, budgetRequests, 
      financialReports, tasks, fleet, drivers, schedules, library, 
      socialCases, socialProjects, tickets, inventory, khassaideModules, 
      partners, socialPosts, studyGroups, fundraisingEvents, reports,
      totalTreasury, activeMembersCount, isLoading, refreshAll,
      addContribution, updateContribution, deleteContribution, addTask, updateTask, deleteTask,
      addMember, updateMember, deleteMember, updateMemberStatus, batchApproveMembers,
      addEvent, deleteEvent, addSocialCase, addSocialProject, addFinancialReport, updateFinancialReport,
      addBudgetRequest, updateBudgetRequest, addAdiyaCampaign, updateAdiyaCampaign, addFundraisingEvent, updateFundraisingEvent,
      addVehicle, deleteVehicle, updateVehicleStatus, addDriver, deleteDriver, updateDriver,
      addSchedule, addTicket, updateTicket, deleteTicket, addInventoryItem, deleteInventoryItem,
      addResource, deleteResource, addKhassaideModule, updateKhassaideModule, addPartner,
      addSocialPost, addStudyGroup, importMembers, uploadMemberDocument, deleteMemberDocument
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