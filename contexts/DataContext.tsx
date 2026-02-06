
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
    Member, Event, Contribution, InternalMeetingReport, CommissionFinancialReport, BudgetRequest, 
    UserProfile, AdiyaCampaign, FundraisingEvent, Task, Vehicle, Driver, TransportSchedule, 
    LibraryResource, SocialCase, SocialProject, TicketItem, InventoryItem, KhassaideModule,
    Partner, SocialPost, StudyGroup 
} from '../types';
import { 
  dbFetchMembers, dbFetchContributions, dbFetchEvents, dbFetchReports, 
  dbCreateMember, dbUpdateMember, dbDeleteMember,
  dbCreateContribution, dbCreateEvent, dbCreateReport, dbFetchTasks, 
  dbFetchAdiyaCampaigns, dbFetchFleet, dbFetchDrivers, dbFetchSchedules, dbFetchResources,
  dbFetchSocialCases, dbFetchSocialProjects, dbFetchTickets, dbFetchInventory,
  dbCreateVehicle, dbCreateDriver, dbCreateSchedule, dbCreateResource, dbUpdateVehicle, 
  dbDeleteVehicle, dbUpdateDriver, dbDeleteDriver, dbDeleteResource,
  dbCreateTask, dbUpdateTask, dbDeleteTask, dbCreateAdiyaCampaign, dbUpdateAdiyaCampaign,
  dbCreateSocialCase, dbCreateSocialProject, dbCreateTicket, dbUpdateTicket, dbDeleteTicket,
  dbCreateInventoryItem, dbDeleteInventoryItem, dbDeleteEvent,
  dbFetchKhassaideModules, dbCreateKhassaideModule, dbUpdateKhassaideModule,
  dbFetchPartners, dbCreatePartner,
  dbFetchSocialPosts, dbCreateSocialPost,
  dbFetchStudyGroups, dbCreateStudyGroup
} from '../services/dbService';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { WifiOff, RefreshCcw, ServerCrash } from 'lucide-react';

interface DataContextType {
  // ... existing types
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
  
  // Actions
  updateUserProfile: (data: Partial<UserProfile>) => void;
  addMember: (member: Member) => void;
  updateMember: (id: string, data: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  importMembers: (newMembers: Member[]) => void;
  updateMemberStatus: (id: string, status: 'active' | 'inactive') => void;
  
  addEvent: (event: Event) => void;
  deleteEvent: (id: string) => void;
  
  addContribution: (contribution: Contribution) => void;
  updateContribution: (id: string, data: Partial<Contribution>) => void;
  deleteContribution: (id: string) => void;
  
  addReport: (report: InternalMeetingReport) => void;
  
  addVehicle: (vehicle: Vehicle) => void;
  updateVehicleStatus: (id: string, status: any) => void;
  updateVehicle: (id: string, data: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  addDriver: (driver: Driver) => void;
  updateDriver: (id: string, data: Partial<Driver>) => void;
  deleteDriver: (id: string) => void;
  addSchedule: (trip: TransportSchedule) => void;

  addTicket: (ticket: TicketItem) => void;
  updateTicket: (id: string, data: Partial<TicketItem>) => void;
  deleteTicket: (id: string) => void;

  addInventoryItem: (item: InventoryItem) => void;
  deleteInventoryItem: (id: string) => void;

  addResource: (res: LibraryResource) => void;
  deleteResource: (id: string) => void;
  addKhassaideModule: (module: KhassaideModule) => void;
  updateKhassaideModule: (id: string, data: Partial<KhassaideModule>) => void;

  addAdiyaCampaign: (campaign: AdiyaCampaign) => void;
  updateAdiyaCampaign: (id: string, data: Partial<AdiyaCampaign>) => void;
  
  addTask: (task: Task) => void;
  updateTask: (id: string, data: Partial<Task>) => void;
  deleteTask: (id: string) => void;

  addSocialCase: (socialCase: Partial<SocialCase>) => void;
  addSocialProject: (project: Partial<SocialProject>) => void;

  addFundraisingEvent: (event: FundraisingEvent) => void;
  updateFundraisingEvent: (id: string, data: Partial<FundraisingEvent>) => void;

  // New Actions
  addPartner: (partner: Partial<Partner>) => void;
  addSocialPost: (post: Partial<SocialPost>) => void;
  addStudyGroup: (group: Partial<StudyGroup>) => void;
  
  totalTreasury: number;
  activeMembersCount: number;
  resetData: () => void;
  isLoading: boolean;
  serverError: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { addNotification } = useNotification();
  
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  
  // Data States
  const [userProfile, setUserProfile] = useState<UserProfile>({} as UserProfile);
  const [members, setMembers] = useState<Member[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [reports, setReports] = useState<InternalMeetingReport[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [adiyaCampaigns, setAdiyaCampaigns] = useState<AdiyaCampaign[]>([]);
  const [fleet, setFleet] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [schedules, setSchedules] = useState<TransportSchedule[]>([]);
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [library, setLibrary] = useState<LibraryResource[]>([]);
  const [khassaideModules, setKhassaideModules] = useState<KhassaideModule[]>([]);
  const [socialCases, setSocialCases] = useState<SocialCase[]>([]);
  const [socialProjects, setSocialProjects] = useState<SocialProject[]>([]);
  
  // New Data States
  const [partners, setPartners] = useState<Partner[]>([]);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);

  // Placeholders
  const [financialReports] = useState<CommissionFinancialReport[]>([]);
  const [budgetRequests] = useState<BudgetRequest[]>([]);
  const [fundraisingEvents, setFundraisingEvents] = useState<FundraisingEvent[]>([]);

  const loadData = async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    setServerError(false);
    
    try {
      const [
          m, c, e, r, t, a, f, d, s, tick, inv, l, k, sc, sp, 
          prt, pst, grp
      ] = await Promise.all([
        dbFetchMembers(),
        dbFetchContributions(),
        dbFetchEvents(),
        dbFetchReports(),
        dbFetchTasks(),
        dbFetchAdiyaCampaigns(),
        dbFetchFleet(),
        dbFetchDrivers(),
        dbFetchSchedules(),
        dbFetchTickets(),
        dbFetchInventory(),
        dbFetchResources(),
        dbFetchKhassaideModules(),
        dbFetchSocialCases(),
        dbFetchSocialProjects(),
        dbFetchPartners(),
        dbFetchSocialPosts(),
        dbFetchStudyGroups()
      ]);
      
      setMembers(m); setContributions(c); setEvents(e); setReports(r);
      setTasks(t); setAdiyaCampaigns(a); setFleet(f); setDrivers(d);
      setSchedules(s); setTickets(tick); setInventory(inv); setLibrary(l);
      setKhassaideModules(k); setSocialCases(sc); setSocialProjects(sp);
      setPartners(prt); setSocialPosts(pst); setStudyGroups(grp);
      
    } catch (error: any) {
      console.error("ERREUR CRITIQUE API:", error);
      setServerError(true);
      addNotification("Serveur inaccessible. Vérifiez votre connexion.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [isAuthenticated]);

  // Actions wrappers
  const updateUserProfile = (data: Partial<UserProfile>) => setUserProfile({ ...userProfile, ...data });
  const addMember = async (m: Member) => { await dbCreateMember(m); setMembers(await dbFetchMembers()); addNotification("Membre ajouté", "success"); };
  const updateMember = async (id: string, d: Partial<Member>) => { await dbUpdateMember(id, d); setMembers(prev => prev.map(m => m.id === id ? {...m, ...d} : m)); addNotification("Profil mis à jour", "success"); };
  const deleteMember = async (id: string) => { await dbDeleteMember(id); setMembers(prev => prev.filter(m => m.id !== id)); addNotification("Membre supprimé", "info"); };
  const importMembers = (ms: Member[]) => { ms.forEach(m => addMember(m)); };
  const updateMemberStatus = async (id: string, s: 'active'|'inactive') => { await updateMember(id, { status: s }); };
  const addEvent = async (e: Event) => { await dbCreateEvent(e); setEvents(await dbFetchEvents()); addNotification("Événement créé", "success"); };
  const deleteEvent = async (id: string) => { await dbDeleteEvent(id); setEvents(prev => prev.filter(e => e.id !== id)); addNotification("Événement supprimé", "info"); };
  const addContribution = async (c: Contribution) => { await dbCreateContribution(c); setContributions(await dbFetchContributions()); addNotification("Paiement enregistré", "success"); };
  const updateContribution = (id: string, d: Partial<Contribution>) => {}; // To Implement
  const deleteContribution = (id: string) => {}; // To Implement
  const addReport = async (r: InternalMeetingReport) => { await dbCreateReport(r); setReports(await dbFetchReports()); addNotification("Rapport créé", "success"); };
  
  // Transport wrappers
  const addVehicle = async (v: Vehicle) => { await dbCreateVehicle(v); setFleet(await dbFetchFleet()); addNotification("Véhicule ajouté", "success"); };
  const updateVehicleStatus = async (id: string, status: any) => { await dbUpdateVehicle(id, { status }); setFleet(prev => prev.map(v => v.id === id ? { ...v, status } : v)); };
  const updateVehicle = async (id: string, data: Partial<Vehicle>) => { await dbUpdateVehicle(id, data); setFleet(prev => prev.map(v => v.id === id ? { ...v, ...data } : v)); };
  const deleteVehicle = async (id: string) => { await dbDeleteVehicle(id); setFleet(prev => prev.filter(v => v.id !== id)); };
  const addDriver = async (d: Driver) => { await dbCreateDriver(d); setDrivers(await dbFetchDrivers()); };
  const updateDriver = async (id: string, data: Partial<Driver>) => { await dbUpdateDriver(id, data); setDrivers(prev => prev.map(d => d.id === id ? { ...d, ...data } : d)); };
  const deleteDriver = async (id: string) => { await dbDeleteDriver(id); setDrivers(prev => prev.filter(d => d.id !== id)); };
  const addSchedule = async (t: TransportSchedule) => { await dbCreateSchedule(t); setSchedules(await dbFetchSchedules()); };
  const addTicket = async (t: TicketItem) => { await dbCreateTicket(t); setTickets(await dbFetchTickets()); };
  const updateTicket = async (id: string, data: Partial<TicketItem>) => { await dbUpdateTicket(id, data); setTickets(prev => prev.map(t => t.id === id ? { ...t, ...data } : t)); };
  const deleteTicket = async (id: string) => { await dbDeleteTicket(id); setTickets(prev => prev.filter(t => t.id !== id)); };

  // Other wrappers
  const addInventoryItem = async (i: InventoryItem) => { await dbCreateInventoryItem(i); setInventory(await dbFetchInventory()); };
  const deleteInventoryItem = async (id: string) => { await dbDeleteInventoryItem(id); setInventory(prev => prev.filter(i => i.id !== id)); };
  const addResource = async (r: LibraryResource) => { await dbCreateResource(r); setLibrary(await dbFetchResources()); };
  const deleteResource = async (id: string) => { await dbDeleteResource(id); setLibrary(prev => prev.filter(r => r.id !== id)); };
  const addKhassaideModule = async (m: KhassaideModule) => { await dbCreateKhassaideModule(m); setKhassaideModules(await dbFetchKhassaideModules()); };
  const updateKhassaideModule = async (id: string, data: Partial<KhassaideModule>) => { await dbUpdateKhassaideModule(id, data); setKhassaideModules(prev => prev.map(m => m.id === id ? { ...m, ...data } : m)); };
  const addAdiyaCampaign = async (c: AdiyaCampaign) => { await dbCreateAdiyaCampaign(c); setAdiyaCampaigns(await dbFetchAdiyaCampaigns()); };
  const updateAdiyaCampaign = async (id: string, data: Partial<AdiyaCampaign>) => { await dbUpdateAdiyaCampaign(id, data); setAdiyaCampaigns(prev => prev.map(c => c.id === id ? { ...c, ...data } : c)); };
  const addTask = async (t: Task) => { await dbCreateTask(t); setTasks(await dbFetchTasks()); };
  const updateTask = async (id: string, data: Partial<Task>) => { await dbUpdateTask(id, data); setTasks(prev => prev.map(t => t.id === id ? { ...t, ...data } : t)); };
  const deleteTask = async (id: string) => { await dbDeleteTask(id); setTasks(prev => prev.filter(t => t.id !== id)); };
  const addSocialCase = async (sc: Partial<SocialCase>) => { await dbCreateSocialCase(sc); setSocialCases(await dbFetchSocialCases()); };
  const addSocialProject = async (p: Partial<SocialProject>) => { await dbCreateSocialProject(p); setSocialProjects(await dbFetchSocialProjects()); };
  
  // Placeholders
  const addFundraisingEvent = (event: FundraisingEvent) => { setFundraisingEvents(prev => [...prev, event]); };
  const updateFundraisingEvent = (id: string, data: Partial<FundraisingEvent>) => { setFundraisingEvents(prev => prev.map(e => e.id === id ? { ...e, ...data } : e)); };

  // New Actions Implementation
  const addPartner = async (p: Partial<Partner>) => {
      try {
          await dbCreatePartner(p);
          setPartners(await dbFetchPartners());
          addNotification("Partenaire ajouté", "success");
      } catch(e: any) { addNotification(e.message, "error"); }
  };
  
  const addSocialPost = async (p: Partial<SocialPost>) => {
      try {
          await dbCreateSocialPost(p);
          setSocialPosts(await dbFetchSocialPosts());
          addNotification("Post planifié", "success");
      } catch(e: any) { addNotification(e.message, "error"); }
  };

  const addStudyGroup = async (g: Partial<StudyGroup>) => {
      try {
          await dbCreateStudyGroup(g);
          setStudyGroups(await dbFetchStudyGroups());
          addNotification("Groupe créé", "success");
      } catch(e: any) { addNotification(e.message, "error"); }
  };

  const totalTreasury = contributions.reduce((acc, c) => acc + c.amount, 0);
  const activeMembersCount = members.filter(m => m.status === 'active').length;
  const resetData = () => { localStorage.clear(); window.location.reload(); };

  if (serverError) {
      // ... (Keep existing error UI)
      return <div className="p-10 text-center">Erreur Serveur (Voir console)</div>;
  }

  return (
    <DataContext.Provider value={{
      // ... existing props
      userProfile, members, events, contributions, reports, financialReports, budgetRequests, adiyaCampaigns, fundraisingEvents, tasks,
      fleet, drivers, schedules, tickets, inventory, library, khassaideModules, socialCases, socialProjects,
      // New props
      partners, socialPosts, studyGroups,
      
      updateUserProfile, addMember, updateMember, deleteMember, importMembers, updateMemberStatus,
      addEvent, deleteEvent, addContribution, updateContribution, deleteContribution, addReport,
      addVehicle, updateVehicleStatus, updateVehicle, deleteVehicle, addDriver, updateDriver, deleteDriver, addSchedule, 
      addTicket, updateTicket, deleteTicket,
      addInventoryItem, deleteInventoryItem,
      addResource, deleteResource, addKhassaideModule, updateKhassaideModule,
      addAdiyaCampaign, updateAdiyaCampaign,
      addFundraisingEvent, updateFundraisingEvent,
      addTask, updateTask, deleteTask,
      addSocialCase, addSocialProject,
      
      // New Actions
      addPartner, addSocialPost, addStudyGroup,
      
      totalTreasury, activeMembersCount, resetData, isLoading, serverError
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
