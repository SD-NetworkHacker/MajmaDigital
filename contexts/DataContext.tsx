
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { Member, Event, Contribution, Task, InternalMeetingReport, CommissionFinancialReport, BudgetRequest, AdiyaCampaign, FundraisingEvent, TransportSchedule, Vehicle, Driver, TicketItem } from '../types';
import * as db from '../services/dbService';

interface DataContextType {
  members: Member[];
  events: Event[];
  contributions: Contribution[];
  tasks: Task[];
  reports: InternalMeetingReport[];
  financialReports: CommissionFinancialReport[];
  budgetRequests: BudgetRequest[];
  adiyaCampaigns: AdiyaCampaign[];
  fundraisingEvents: FundraisingEvent[];
  schedules: TransportSchedule[];
  fleet: Vehicle[];
  drivers: Driver[];
  khassaideModules: any[];
  tickets: TicketItem[];
  totalTreasury: number;
  activeMembersCount: number;
  isLoading: boolean;
  refreshAll: () => Promise<void>;
  addContribution: (c: any) => Promise<void>;
  updateContribution: (id: string, updates: any) => Promise<void>;
  deleteContribution: (id: string) => Promise<void>;
  updateMemberStatus: (id: string, status: string) => Promise<void>;
  updateMember: (id: string, updates: any) => Promise<void>;
  addTicket: (t: any) => Promise<void>;
  updateTicket: (id: string, updates: any) => Promise<void>;
  addAdiyaCampaign: (c: any) => Promise<void>;
  updateAdiyaCampaign: (id: string, updates: any) => Promise<void>;
  addFundraisingEvent: (e: any) => Promise<void>;
  updateFundraisingEvent: (id: string, updates: any) => Promise<void>;
  addVehicle: (v: any) => Promise<void>;
  updateVehicleStatus: (id: string, status: string) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
  addDriver: (d: any) => Promise<void>;
  updateDriver: (id: string, updates: any) => Promise<void>;
  deleteDriver: (id: string) => Promise<void>;
  addSchedule: (s: any) => Promise<void>;
  updateSchedule: (id: string, updates: any) => Promise<void>;
  deleteSchedule: (id: string) => Promise<void>;
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
  const [financialReports, setFinancialReports] = useState<CommissionFinancialReport[]>([]);
  const [budgetRequests, setBudgetRequests] = useState<BudgetRequest[]>([]);
  const [adiyaCampaigns, setAdiyaCampaigns] = useState<AdiyaCampaign[]>([]);
  const [fundraisingEvents, setFundraisingEvents] = useState<FundraisingEvent[]>([]);
  const [schedules, setSchedules] = useState<TransportSchedule[]>([]);
  const [fleet, setFleet] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [khassaideModules, setKhassaideModules] = useState<any[]>([]);
  const [tickets, setTickets] = useState<TicketItem[]>([]);

  const refreshAll = useCallback(async () => {
    if (!user) {
        setIsLoading(false);
        return;
    }
    
    setIsLoading(true);

    try {
      const [mRes, eRes, cRes, tRes, rRes, ticketsRes, finRes, budRes, adiyaRes, fundRes, schedRes, fleetRes, driversRes] = await Promise.all([
        db.dbFetchMembers(),
        db.dbFetchEvents(),
        db.dbFetchContributions(),
        db.dbFetchTasks(),
        db.dbFetchReports(),
        db.dbFetchTickets(),
        db.dbFetchFinancialReports(),
        db.dbFetchBudgetRequests(),
        db.dbFetchAdiyaCampaigns(),
        db.dbFetchFundraisingEvents(),
        db.dbFetchSchedules(),
        db.dbFetchFleet(),
        db.dbFetchDrivers()
      ]);

      setMembers(mRes || []);
      setEvents(eRes || []);
      setContributions(cRes || []);
      setTasks(tRes || []);
      setReports(rRes || []);
      setTickets(ticketsRes || []);
      setFinancialReports(finRes || []);
      setBudgetRequests(budRes || []);
      setAdiyaCampaigns(adiyaRes || []);
      setFundraisingEvents(fundRes || []);
      setSchedules(schedRes || []);
      setFleet(fleetRes || []);
      setDrivers(driversRes || []);

    } catch (err) {
      console.error("DataContext Error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => { 
    refreshAll();
  }, [refreshAll]);

  // Actions
  const addContribution = async (c: any) => {
    try {
      await db.dbAddContribution(c);
      refreshAll();
    } catch (err) {
      console.error("Add Contribution Error:", err);
    }
  };

  const updateContribution = async (id: string, updates: any) => {
    try {
      await db.dbUpdateContribution(id, updates);
      refreshAll();
    } catch (err) {
      console.error("Update Contribution Error:", err);
    }
  };

  const deleteContribution = async (id: string) => {
    try {
      await db.dbDeleteContribution(id);
      refreshAll();
    } catch (err) {
      console.error("Delete Contribution Error:", err);
    }
  };

  const updateMemberStatus = async (id: string, status: string) => {
    try {
      await db.dbUpdateMemberStatus(id, status);
      refreshAll();
    } catch (err) {
      console.error("Update Member Status Error:", err);
    }
  };

  const updateMember = async (id: string, updates: any) => {
    try {
      await db.dbUpdateMember(id, updates);
      refreshAll();
    } catch (err) {
      console.error("Update Member Error:", err);
    }
  };

  const addTicket = async (t: any) => {
    try {
      await db.dbAddTicket(t);
      refreshAll();
    } catch (err) {
      console.error("Add Ticket Error:", err);
    }
  };

  const updateTicket = async (id: string, updates: any) => {
    try {
      await db.dbUpdateTicket(id, updates);
      refreshAll();
    } catch (err) {
      console.error("Update Ticket Error:", err);
    }
  };

  const addAdiyaCampaign = async (c: any) => {
    try {
      await db.dbAddAdiyaCampaign(c);
      refreshAll();
    } catch (err) {
      console.error("Add Adiya Campaign Error:", err);
    }
  };

  const updateAdiyaCampaign = async (id: string, updates: any) => {
    try {
      await db.dbUpdateAdiyaCampaign(id, updates);
      refreshAll();
    } catch (err) {
      console.error("Update Adiya Campaign Error:", err);
    }
  };

  const addFundraisingEvent = async (e: any) => {
    try {
      await db.dbAddFundraisingEvent(e);
      refreshAll();
    } catch (err) {
      console.error("Add Fundraising Event Error:", err);
    }
  };

  const updateFundraisingEvent = async (id: string, updates: any) => {
    try {
      await db.dbUpdateFundraisingEvent(id, updates);
      refreshAll();
    } catch (err) {
      console.error("Update Fundraising Event Error:", err);
    }
  };

  const addVehicle = async (v: any) => {
    try {
      await db.dbAddVehicle(v);
      refreshAll();
    } catch (err) {
      console.error("Add Vehicle Error:", err);
    }
  };

  const updateVehicleStatus = async (id: string, status: string) => {
    try {
      await db.dbUpdateVehicleStatus(id, status);
      refreshAll();
    } catch (err) {
      console.error("Update Vehicle Status Error:", err);
    }
  };

  const deleteVehicle = async (id: string) => {
    try {
      await db.dbDeleteVehicle(id);
      refreshAll();
    } catch (err) {
      console.error("Delete Vehicle Error:", err);
    }
  };

  const addDriver = async (d: any) => {
    try {
      await db.dbAddDriver(d);
      refreshAll();
    } catch (err) {
      console.error("Add Driver Error:", err);
    }
  };

  const updateDriver = async (id: string, updates: any) => {
    try {
      await db.dbUpdateDriver(id, updates);
      refreshAll();
    } catch (err) {
      console.error("Update Driver Error:", err);
    }
  };

  const deleteDriver = async (id: string) => {
    try {
      await db.dbDeleteDriver(id);
      refreshAll();
    } catch (err) {
      console.error("Delete Driver Error:", err);
    }
  };

  const addSchedule = async (s: any) => {
    try {
      await db.dbAddSchedule(s);
      refreshAll();
    } catch (err) {
      console.error("Add Schedule Error:", err);
    }
  };

  const updateSchedule = async (id: string, updates: any) => {
    try {
      await db.dbUpdateSchedule(id, updates);
      refreshAll();
    } catch (err) {
      console.error("Update Schedule Error:", err);
    }
  };

  const deleteSchedule = async (id: string) => {
    try {
      await db.dbDeleteSchedule(id);
      refreshAll();
    } catch (err) {
      console.error("Delete Schedule Error:", err);
    }
  };

  // Calcul unique pour tout le site
  const totalTreasury = contributions.reduce((acc, c) => acc + (Number(c.amount) || 0), 0);
  const activeMembersCount = members.filter(m => m.status === 'active').length;

  return (
    <DataContext.Provider value={{ 
      members, events, contributions, tasks, reports, financialReports, budgetRequests, schedules, khassaideModules, tickets,
      adiyaCampaigns, fundraisingEvents, fleet, drivers,
      totalTreasury, activeMembersCount, isLoading, refreshAll,
      addContribution, updateContribution, deleteContribution, updateMemberStatus, updateMember,
      addTicket, updateTicket,
      addAdiyaCampaign, updateAdiyaCampaign, addFundraisingEvent, updateFundraisingEvent,
      addVehicle, updateVehicleStatus, deleteVehicle,
      addDriver, updateDriver, deleteDriver,
      addSchedule, updateSchedule, deleteSchedule
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