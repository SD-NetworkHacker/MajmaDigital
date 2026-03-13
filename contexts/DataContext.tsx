
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { Member, Event, Contribution, Task, InternalMeetingReport, CommissionFinancialReport, BudgetRequest } from '../types';
import * as db from '../services/dbService';

interface DataContextType {
  members: Member[];
  events: Event[];
  contributions: Contribution[];
  tasks: Task[];
  reports: InternalMeetingReport[];
  financialReports: CommissionFinancialReport[];
  budgetRequests: BudgetRequest[];
  schedules: any[];
  khassaideModules: any[];
  tickets: any[];
  totalTreasury: number;
  activeMembersCount: number;
  isLoading: boolean;
  refreshAll: () => Promise<void>;
  addContribution: (c: any) => Promise<void>;
  updateContribution: (id: string, updates: any) => Promise<void>;
  deleteContribution: (id: string) => Promise<void>;
  updateMemberStatus: (id: string, status: string) => Promise<void>;
  updateMember: (id: string, updates: any) => Promise<void>;
  addTicket: (t: any) => void;
  updateTicket: (id: string, updates: any) => void;
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
  const [schedules, setSchedules] = useState<any[]>([]);
  const [khassaideModules, setKhassaideModules] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);

  const refreshAll = useCallback(async () => {
    if (!user) {
        setIsLoading(false);
        return;
    }
    
    setIsLoading(true);

    try {
      const [mRes, eRes, cRes, tRes, rRes, ticketsRes, finRes, budRes] = await Promise.all([
        db.dbFetchMembers(),
        db.dbFetchEvents(),
        db.dbFetchContributions(),
        db.dbFetchTasks(),
        db.dbFetchReports(),
        db.dbFetchTickets(),
        db.dbFetchFinancialReports(),
        db.dbFetchBudgetRequests()
      ]);

      setMembers(mRes);
      setEvents(eRes);
      setContributions(cRes);
      setTasks(tRes);
      setReports(rRes);
      setTickets(ticketsRes);
      setFinancialReports(finRes);
      setBudgetRequests(budRes);

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

  // Calcul unique pour tout le site
  const totalTreasury = contributions.reduce((acc, c) => acc + (Number(c.amount) || 0), 0);
  const activeMembersCount = members.filter(m => m.status === 'active').length;

  return (
    <DataContext.Provider value={{ 
      members, events, contributions, tasks, reports, financialReports, budgetRequests, schedules, khassaideModules, tickets,
      totalTreasury, activeMembersCount, isLoading, refreshAll,
      addContribution, updateContribution, deleteContribution, updateMemberStatus, updateMember,
      addTicket, updateTicket
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