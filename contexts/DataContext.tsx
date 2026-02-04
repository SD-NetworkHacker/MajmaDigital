
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Member, Event, Contribution, InternalMeetingReport, CommissionFinancialReport, BudgetRequest, UserProfile, AdiyaCampaign, FundraisingEvent, Task, Vehicle, Driver, TransportSchedule, LibraryResource } from '../types';
import { 
  dbFetchMembers, dbFetchContributions, dbFetchEvents, dbFetchReports, 
  dbCreateMember, dbUpdateMember, dbDeleteMember,
  dbCreateContribution, dbCreateEvent, dbCreateReport, dbFetchTasks, 
  dbFetchAdiyaCampaigns, dbFetchFleet, dbFetchDrivers, dbFetchSchedules, dbFetchResources,
  dbCreateVehicle, dbCreateDriver, dbCreateSchedule, dbCreateResource, dbUpdateVehicle
} from '../services/dbService';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { WifiOff, RefreshCcw, ServerCrash } from 'lucide-react';

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
  fleet: Vehicle[];
  drivers: Driver[];
  schedules: TransportSchedule[];
  library: LibraryResource[];
  
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
  
  // Transport
  addVehicle: (vehicle: Vehicle) => void;
  updateVehicleStatus: (id: string, status: any) => void;
  addDriver: (driver: Driver) => void;
  addSchedule: (trip: TransportSchedule) => void;

  // Culture
  addResource: (res: LibraryResource) => void;

  // Placeholders
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
  serverError: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { addNotification } = useNotification();
  
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  
  const [userProfile, setUserProfile] = useState<UserProfile>({} as UserProfile);
  const [members, setMembers] = useState<Member[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [reports, setReports] = useState<InternalMeetingReport[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [adiyaCampaigns, setAdiyaCampaigns] = useState<AdiyaCampaign[]>([]);
  
  // Transport & Culture Data
  const [fleet, setFleet] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [schedules, setSchedules] = useState<TransportSchedule[]>([]);
  const [library, setLibrary] = useState<LibraryResource[]>([]);

  // Placeholders
  const [financialReports] = useState<CommissionFinancialReport[]>([]);
  const [budgetRequests] = useState<BudgetRequest[]>([]);
  const [fundraisingEvents] = useState<FundraisingEvent[]>([]);

  // --- CHARGEMENT INITIAL (PRODUCTION) ---
  const loadData = async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    setServerError(false);
    
    try {
      // Chargement parallèle de toutes les collections
      const [m, c, e, r, t, a, f, d, s, l] = await Promise.all([
        dbFetchMembers(),
        dbFetchContributions(),
        dbFetchEvents(),
        dbFetchReports(),
        dbFetchTasks(),
        dbFetchAdiyaCampaigns(),
        dbFetchFleet(),
        dbFetchDrivers(),
        dbFetchSchedules(),
        dbFetchResources()
      ]);
      
      setMembers(m);
      setContributions(c);
      setEvents(e);
      setReports(r);
      setTasks(t);
      setAdiyaCampaigns(a);
      setFleet(f);
      setDrivers(d);
      setSchedules(s);
      setLibrary(l);
      
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

  // --- REAL ACTIONS ---
  
  const updateUserProfile = (data: Partial<UserProfile>) => setUserProfile({ ...userProfile, ...data });

  const addMember = async (m: Member) => {
      try {
          await dbCreateMember(m);
          setMembers(await dbFetchMembers()); 
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

  // --- TRANSPORT ACTIONS ---
  const addVehicle = async (v: Vehicle) => {
      try {
          await dbCreateVehicle(v);
          setFleet(await dbFetchFleet());
          addNotification("Véhicule ajouté", "success");
      } catch(e: any) { addNotification(e.message, "error"); }
  };

  const updateVehicleStatus = async (id: string, status: any) => {
      try {
          await dbUpdateVehicle(id, { status });
          setFleet(prev => prev.map(v => v.id === id ? { ...v, status } : v));
          addNotification("Statut véhicule mis à jour", "success");
      } catch(e: any) { addNotification(e.message, "error"); }
  };

  const addDriver = async (d: Driver) => {
      try {
          await dbCreateDriver(d);
          setDrivers(await dbFetchDrivers());
          addNotification("Chauffeur ajouté", "success");
      } catch(e: any) { addNotification(e.message, "error"); }
  };

  const addSchedule = async (t: TransportSchedule) => {
      try {
          await dbCreateSchedule(t);
          setSchedules(await dbFetchSchedules());
          addNotification("Convoi planifié", "success");
      } catch(e: any) { addNotification(e.message, "error"); }
  };

  // --- CULTURE ACTIONS ---
  const addResource = async (r: LibraryResource) => {
      try {
          await dbCreateResource(r);
          setLibrary(await dbFetchResources());
          addNotification("Ressource ajoutée", "success");
      } catch(e: any) { addNotification(e.message, "error"); }
  };
  
  const addTask = async (t: Task) => {};
  const addAdiyaCampaign = () => {};
  const updateAdiyaCampaign = () => {};
  const addFundraisingEvent = () => {};
  const updateFundraisingEvent = () => {};
  const updateTask = () => {};
  const deleteTask = () => {};

  const totalTreasury = contributions.reduce((acc, c) => acc + c.amount, 0);
  const activeMembersCount = members.filter(m => m.status === 'active').length;
  
  const resetData = () => { localStorage.clear(); window.location.reload(); };

  // --- ECRAN D'ERREUR API ---
  if (serverError) {
      return (
          <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 text-slate-900 p-8 text-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl mb-6 animate-pulse">
                  <WifiOff size={48} className="text-rose-500" />
              </div>
              <h2 className="text-3xl font-black mb-3">Serveur Inaccessible</h2>
              <p className="text-slate-500 max-w-md mb-8 font-medium">
                  Impossible de contacter la base de données MajmaDigital. 
                  Vérifiez votre connexion internet ou réessayez dans quelques instants.
              </p>
              
              <div className="flex gap-4">
                  <button 
                      onClick={() => window.location.reload()}
                      className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:bg-black transition-all flex items-center gap-3"
                  >
                      <RefreshCcw size={16} /> Réessayer
                  </button>
                  <button 
                      onClick={() => { localStorage.removeItem('jwt_token'); window.location.reload(); }}
                      className="px-8 py-4 bg-white text-slate-600 border border-slate-200 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-50 transition-all"
                  >
                      Déconnexion
                  </button>
              </div>

              <div className="mt-12 p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-3 text-amber-800 text-xs font-bold">
                  <ServerCrash size={16} />
                  <span>Code Erreur: API_CONNECTION_TIMEOUT</span>
              </div>
          </div>
      );
  }

  return (
    <DataContext.Provider value={{
      userProfile, members, events, contributions, reports, financialReports, budgetRequests, adiyaCampaigns, fundraisingEvents, tasks,
      fleet, drivers, schedules, library,
      updateUserProfile, addMember, updateMember, deleteMember, importMembers, updateMemberStatus,
      addEvent, addContribution, updateContribution, deleteContribution, addReport,
      addVehicle, updateVehicleStatus, addDriver, addSchedule, addResource,
      addAdiyaCampaign, updateAdiyaCampaign,
      addFundraisingEvent, updateFundraisingEvent,
      addTask, updateTask, deleteTask,
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
