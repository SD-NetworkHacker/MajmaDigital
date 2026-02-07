
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
    Member, Event, Contribution, AdiyaCampaign, BudgetRequest, CommissionFinancialReport, 
    Task, Vehicle, Driver, TransportSchedule, LibraryResource, SocialCase, SocialProject, 
    TicketItem, InventoryItem, KhassaideModule, Partner, SocialPost, StudyGroup 
} from '../types';
import { 
  dbFetchMembers, dbFetchContributions, dbFetchAdiyaCampaigns, dbFetchBudgetRequests, 
  dbFetchFinancialReports, dbFetchEvents, dbFetchTasks, dbFetchFleet, dbFetchDrivers, 
  dbFetchSchedules, dbFetchTickets, dbFetchInventory, dbFetchResources, 
  dbFetchKhassaideModules, dbFetchSocialCases, dbFetchSocialProjects, 
  dbFetchPartners, dbFetchSocialPosts, dbFetchStudyGroups
} from '../services/dbService';
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
  totalTreasury: number;
  activeMembersCount: number;
  isLoading: boolean;
  serverError: boolean;
  addContribution: (c: any) => Promise<void>;
  addMember: (m: any) => Promise<void>;
  updateMember: (id: string, u: any) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  
  const [members, setMembers] = useState<Member[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [adiyaCampaigns, setAdiyaCampaigns] = useState<AdiyaCampaign[]>([]);
  const [budgetRequests, setBudgetRequests] = useState<BudgetRequest[]>([]);
  const [financialReports, setFinancialReports] = useState<CommissionFinancialReport[]>([]);
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
    setServerError(false);

    const wrap = async (fn: any, setter: any) => {
      try {
        // Timeout individuel par table (4 secondes)
        const res = await Promise.race([
          fn(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 4000))
        ]);
        setter(res || []);
      } catch (e) {
        console.warn(`Fetch issue for table:`, e);
        setter([]);
      }
    };

    try {
      // Chargement en parallèle avec un timeout global de 10 secondes pour libérer l'UI
      await Promise.race([
        Promise.all([
          wrap(dbFetchMembers, setMembers),
          wrap(dbFetchContributions, setContributions),
          wrap(dbFetchEvents, setEvents),
          wrap(dbFetchTasks, setTasks),
          wrap(dbFetchBudgetRequests, setBudgetRequests),
          wrap(dbFetchFinancialReports, setFinancialReports),
          wrap(dbFetchAdiyaCampaigns, setAdiyaCampaigns),
          wrap(dbFetchFleet, setFleet),
          wrap(dbFetchDrivers, setDrivers),
          wrap(dbFetchSchedules, setSchedules),
          wrap(dbFetchTickets, setTickets),
          wrap(dbFetchInventory, setInventory),
          wrap(dbFetchResources, setLibrary),
          wrap(dbFetchKhassaideModules, setKhassaideModules),
          wrap(dbFetchSocialCases, setSocialCases),
          wrap(dbFetchSocialProjects, setSocialProjects),
          wrap(dbFetchPartners, setPartners),
          wrap(dbFetchSocialPosts, setSocialPosts),
          wrap(dbFetchStudyGroups, setStudyGroups)
        ]),
        new Promise((resolve) => setTimeout(resolve, 10000))
      ]);
    } catch (error) {
      console.error("Data loading engine error:", error);
      setServerError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { 
    loadData(); 
  }, [isAuthenticated]);

  const totalTreasury = contributions.reduce((acc, c) => acc + (Number(c.amount) || 0), 0);
  const activeMembersCount = members.filter(m => m.status === 'active').length;

  const addContribution = async (c: any) => { console.log('Add contrib', c); await loadData(); };
  const addMember = async (m: any) => { console.log('Add member', m); await loadData(); };
  const updateMember = async (id: string, u: any) => { console.log('Update member', id, u); await loadData(); };

  return (
    <DataContext.Provider value={{
      members, events, contributions, adiyaCampaigns, budgetRequests, financialReports, tasks,
      fleet, drivers, schedules, tickets, inventory, library, khassaideModules, socialCases, socialProjects,
      partners, socialPosts, studyGroups, totalTreasury, activeMembersCount, isLoading, serverError,
      addContribution, addMember, updateMember
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
