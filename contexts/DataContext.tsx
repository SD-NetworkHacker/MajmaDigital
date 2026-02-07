
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
    Member, Event, Contribution, InternalMeetingReport, CommissionFinancialReport, BudgetRequest, 
    AdiyaCampaign, FundraisingEvent, Task, Vehicle, Driver, TransportSchedule, 
    LibraryResource, SocialCase, SocialProject, TicketItem, InventoryItem, KhassaideModule,
    Partner, SocialPost, StudyGroup 
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
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  
  // States
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

    try {
      // Stratégie : On charge les données vitales d'abord
      const [m, c, e] = await Promise.all([
        dbFetchMembers().catch(() => []),
        dbFetchContributions().catch(() => []),
        dbFetchEvents().catch(() => [])
      ]);
      
      setMembers(m);
      setContributions(c);
      setEvents(e);

      // On charge le reste en arrière-plan sans bloquer
      Promise.all([
        dbFetchAdiyaCampaigns().then(setAdiyaCampaigns).catch(() => {}),
        dbFetchBudgetRequests().then(setBudgetRequests).catch(() => {}),
        dbFetchFinancialReports().then(setFinancialReports).catch(() => {}),
        dbFetchTasks().then(setTasks).catch(() => {}),
        dbFetchFleet().then(setFleet).catch(() => {}),
        dbFetchDrivers().then(setDrivers).catch(() => {}),
        dbFetchSchedules().then(setSchedules).catch(() => {}),
        dbFetchTickets().then(setTickets).catch(() => {}),
        dbFetchInventory().then(setInventory).catch(() => {}),
        dbFetchResources().then(setLibrary).catch(() => {}),
        dbFetchKhassaideModules().then(setKhassaideModules).catch(() => {}),
        dbFetchSocialCases().then(setSocialCases).catch(() => {}),
        dbFetchSocialProjects().then(setSocialProjects).catch(() => {}),
        dbFetchPartners().then(setPartners).catch(() => {}),
        dbFetchSocialPosts().then(setSocialPosts).catch(() => {}),
        dbFetchStudyGroups().then(setStudyGroups).catch(() => {})
      ]);

    } catch (error) {
      console.error("Critical Data Fetch Error:", error);
      setServerError(true);
    } finally {
      setIsLoading(false); // DÉBLOCAGE GARANTI
    }
  };

  useEffect(() => { loadData(); }, [isAuthenticated]);

  const totalTreasury = contributions.reduce((acc, c) => acc + (Number(c.amount) || 0), 0);
  const activeMembersCount = members.filter(m => m.status === 'active').length;

  return (
    <DataContext.Provider value={{
      members, events, contributions, adiyaCampaigns, budgetRequests, financialReports, tasks,
      fleet, drivers, schedules, tickets, inventory, library, khassaideModules, socialCases, socialProjects,
      partners, socialPosts, studyGroups, totalTreasury, activeMembersCount, isLoading, serverError
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
