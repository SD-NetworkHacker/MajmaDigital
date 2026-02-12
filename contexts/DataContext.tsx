import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { Member, Event, Contribution, Task, InternalMeetingReport } from '../types';

interface DataContextType {
  members: Member[];
  events: Event[];
  contributions: Contribution[];
  tasks: Task[];
  reports: InternalMeetingReport[];
  totalTreasury: number;
  activeMembersCount: number;
  isLoading: boolean;
  refreshAll: () => Promise<void>;
  addContribution: (c: any) => Promise<void>;
  updateContribution: (id: string, updates: any) => Promise<void>;
  deleteContribution: (id: string) => Promise<void>;
  updateMemberStatus: (id: string, status: string) => Promise<void>;
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

  const refreshAll = useCallback(async () => {
    if (!user) {
        setIsLoading(false);
        return;
    }
    
    setIsLoading(true);

    try {
      const [mRes, eRes, cRes, tRes, rRes] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('events').select('*'),
        supabase.from('contributions').select('*'),
        supabase.from('tasks').select('*'),
        supabase.from('meeting_reports').select('*')
      ]);

      if (mRes.data) setMembers(mRes.data.map((x: any) => ({
          id: x.id, firstName: x.first_name, lastName: x.last_name, email: x.email, 
          phone: x.phone, role: x.role, category: x.category, matricule: x.matricule,
          status: x.status, address: x.address, joinDate: x.created_at,
          commissions: x.commissions || []
      })));
      
      if (eRes.data) setEvents(eRes.data);
      if (cRes.data) setContributions(cRes.data);
      if (tRes.data) setTasks(tRes.data);
      if (rRes.data) setReports(rRes.data);

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
    const { error } = await supabase.from('contributions').insert([{
        member_id: c.memberId,
        type: c.type,
        amount: Number(c.amount),
        event_label: c.eventLabel,
        status: 'paid',
        date: new Date().toISOString().split('T')[0]
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

  const updateMemberStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('profiles').update({ status }).eq('id', id);
    if (!error) refreshAll();
  };

  // Calcul unique pour tout le site
  const totalTreasury = contributions.reduce((acc, c) => acc + (Number(c.amount) || 0), 0);
  const activeMembersCount = members.filter(m => m.status === 'active').length;

  return (
    <DataContext.Provider value={{ 
      members, events, contributions, tasks, reports,
      totalTreasury, activeMembersCount, isLoading, refreshAll,
      addContribution, updateContribution, deleteContribution, updateMemberStatus
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