
import { Member, Contribution, Event, Task, CommissionFinancialReport, BudgetRequest } from '../types';
import { supabase } from '../lib/supabase';

/**
 * Moteur d'accès aux données optimisé
 * Centralise les appels Supabase et le mapping des objets
 */

// --- HELPERS ---
const mapMember = (m: any): Member => ({
  id: m.id,
  firstName: m.first_name || '',
  lastName: m.last_name || '',
  email: m.email || '',
  phone: m.phone || '',
  role: m.role || 'MEMBRE',
  category: m.category || 'Étudiant',
  matricule: m.matricule || 'MAJ-NEW',
  status: m.status || 'pending',
  address: m.personal_info?.address || '',
  joinDate: m.created_at,
  coordinates: m.personal_info?.coordinates || { lat: 14.7167, lng: -17.4677 },
  commissions: m.commissions || [],
  bio: m.bio || ''
});

const mapContribution = (c: any): Contribution => ({
  id: c.id,
  memberId: c.member_id,
  type: c.type,
  amount: Number(c.amount),
  date: c.date,
  eventLabel: c.event_label,
  status: c.status,
  transactionId: c.transaction_id
});

// --- API ACTIONS ---

export const dbFetchMembers = async (): Promise<Member[]> => {
  const { data, error } = await supabase.from('profiles').select('*').order('last_name');
  if (error) throw error;
  return (data || []).map(mapMember);
};

export const dbFetchContributions = async (): Promise<Contribution[]> => {
  const { data, error } = await supabase.from('contributions').select('*').order('date', { ascending: false });
  if (error) throw error;
  return (data || []).map(mapContribution);
};

export const dbAddContribution = async (c: Partial<Contribution>) => {
  const { data, error } = await supabase.from('contributions').insert([{
    member_id: c.memberId,
    type: c.type,
    amount: c.amount,
    event_label: c.eventLabel,
    status: 'paid'
  }]).select().single();
  if (error) throw error;
  return mapContribution(data);
};

export const dbFetchEvents = async (): Promise<Event[]> => {
  const { data, error } = await supabase.from('events').select('*').order('date');
  if (error) throw error;
  return data || [];
};

export const dbFetchTasks = async (): Promise<Task[]> => {
  const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const dbAddTask = async (t: Partial<Task>) => {
  const { data, error } = await supabase.from('tasks').insert([t]).select().single();
  if (error) throw error;
  return data;
};

// Stubs pour maintenir la compatibilité DataContext
export const dbFetchAdiyaCampaigns = async () => [];
export const dbFetchBudgetRequests = async () => [];
export const dbFetchFinancialReports = async () => [];
export const dbFetchFleet = async () => [];
export const dbFetchDrivers = async () => [];
export const dbFetchSchedules = async () => [];
export const dbFetchTickets = async () => [];
export const dbFetchInventory = async () => [];
export const dbFetchResources = async () => [];
export const dbFetchKhassaideModules = async () => [];
export const dbFetchSocialCases = async () => [];
export const dbFetchSocialProjects = async () => [];
export const dbFetchPartners = async () => [];
export const dbFetchSocialPosts = async () => [];
export const dbFetchStudyGroups = async () => [];
