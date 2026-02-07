
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
    Member, Event, Contribution, InternalMeetingReport, CommissionFinancialReport, BudgetRequest, 
    UserProfile, AdiyaCampaign, Task, Vehicle, Driver, TransportSchedule, 
    LibraryResource, SocialCase, SocialProject, TicketItem, InventoryItem, KhassaideModule,
    Partner, SocialPost, StudyGroup 
} from '../types';
import { 
  dbFetchMembers, dbFetchContributions, dbFetchEvents, dbFetchReports, 
  dbCreateMember, dbUpdateMember, dbDeleteMember,
  dbCreateContribution, dbFetchAdiyaCampaigns,
  dbFetchBudgetRequests, dbUpdateBudgetRequest,
  dbFetchFinancialReports,
  dbFetchTasks, dbFetchFleet, dbFetchDrivers, dbFetchSchedules, dbFetchResources,
  dbFetchSocialCases, dbFetchSocialProjects, dbFetchTickets, dbFetchInventory,
  dbFetchKhassaideModules, dbFetchPartners, dbFetchSocialPosts, dbFetchStudyGroups,
  dbUploadMemberDocument, dbDeleteMemberDocument,
  dbBatchApproveMembers
} from '../services/dbService';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { RefreshCcw, ServerCrash } from 'lucide-react';

interface DataContextType {
  members: Member[];
  events: Event[];
  contributions: Contribution[];
  adiyaCampaigns: AdiyaCampaign[];
  budgetRequests: BudgetRequest[];
  financialReports: CommissionFinancialReport[];
  // ... (Autres états inchangés)
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
  
  // Methodes
  addContribution: (c: Partial<Contribution>) => Promise<void>;
  updateBudgetRequest: (id: string, d: Partial<BudgetRequest>) => Promise<void>;
  updateMember: (id: string, data: Partial<Member>) => void;
  // ... 
  totalTreasury: number;
  isLoading: boolean;
  serverError: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const { addNotification } = useNotification();
  
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  
  const [members, setMembers] = useState<Member[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [adiyaCampaigns, setAdiyaCampaigns] = useState<AdiyaCampaign[]>([]);
  const [budgetRequests, setBudgetRequests] = useState<BudgetRequest[]>([]);
  const [financialReports, setFinancialReports] = useState<CommissionFinancialReport[]>([]);
  // ... (Initialisations vides pour les autres)
  const [events, setEvents] = useState<Event[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [fleet, setFleet] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [schedules, setSchedules] = useState<TransportSchedule[]>([]);
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [library, setLibrary] = useState<LibraryResource[]>([]);
  const [khassaideModules, setKhassaideModules] = useState<KhassaideModule[]>([]);
  const [socialCases, setSocialCases] = useState<SocialCase[]>([]);
  const [socialProjects, setSocialProjects] = useState<SocialProject[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);

  const loadData = async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const [m, c, a, br, fr, e, t] = await Promise.all([
        dbFetchMembers(), 
        dbFetchContributions(), 
        dbFetchAdiyaCampaigns(),
        dbFetchBudgetRequests(),
        dbFetchFinancialReports(),
        dbFetchEvents(),
        dbFetchTasks()
      ]);
      
      setMembers(m);
      setContributions(c);
      setAdiyaCampaigns(a);
      setBudgetRequests(br);
      setFinancialReports(fr);
      setEvents(e);
      setTasks(t);
      // ... charger les autres modules
    } catch (error) {
      setServerError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [isAuthenticated]);

  const addContribution = async (c: Partial<Contribution>) => {
    try {
      await dbCreateContribution(c);
      const updated = await dbFetchContributions();
      setContributions(updated);
      addNotification("Paiement enregistré avec succès", "success");
    } catch (e) {
      addNotification("Erreur lors de l'enregistrement", "error");
    }
  };

  const updateBudgetRequest = async (id: string, d: Partial<BudgetRequest>) => {
      await dbUpdateBudgetRequest(id, d);
      setBudgetRequests(prev => prev.map(r => r.id === id ? { ...r, ...d } : r));
      addNotification("Décision budgétaire enregistrée", "info");
  };

  const totalTreasury = contributions.reduce((acc, c) => acc + c.amount, 0);

  return (
    <DataContext.Provider value={{
      members, events, contributions, adiyaCampaigns, budgetRequests, financialReports, tasks,
      fleet, drivers, schedules, tickets, inventory, library, khassaideModules, socialCases, socialProjects,
      partners, socialPosts, studyGroups,
      addContribution, updateBudgetRequest, 
      totalTreasury, isLoading, serverError
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
