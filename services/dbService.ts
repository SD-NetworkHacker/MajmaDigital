
import { Member, Contribution, AdiyaCampaign, BudgetRequest, CommissionFinancialReport, CommissionType, Event, InternalMeetingReport, Task, Vehicle, Driver, TransportSchedule, LibraryResource, SocialCase, SocialProject, TicketItem, InventoryItem, KhassaideModule, Partner, SocialPost, StudyGroup } from '../types';
import { supabase } from '../lib/supabase';

const handleSupabaseError = (error: any) => {
  if (error) {
    console.error("Supabase Operation Error:", error);
    throw error;
  }
};

// --- MEMBERS ---
export const dbFetchMembers = async (): Promise<Member[]> => {
  const { data, error } = await supabase.from('profiles').select('*');
  handleSupabaseError(error);
  return (data || []).map(m => ({
    id: m.id,
    firstName: m.first_name,
    lastName: m.last_name,
    email: m.email,
    phone: m.phone,
    role: m.role,
    category: m.category,
    matricule: m.matricule,
    status: m.status,
    address: m.personal_info?.address || '',
    joinDate: m.join_date || m.created_at,
    coordinates: m.personal_info?.coordinates || { lat: 14.7167, lng: -17.4677 },
    commissions: m.commissions || [],
    bio: m.bio,
    birthDate: m.personal_info?.birthDate,
    gender: m.personal_info?.gender,
    academicInfo: m.academic_info,
    professionalInfo: m.professional_info,
    documents: m.documents || [],
    preferences: m.preferences
  }));
};

export const dbUpdateMember = async (id: string, updates: Partial<Member>) => {
  // On ne mappe que les champs qui existent en DB pour éviter les erreurs
  const dbUpdates: any = {};
  if (updates.firstName) dbUpdates.first_name = updates.firstName;
  if (updates.lastName) dbUpdates.last_name = updates.lastName;
  if (updates.phone) dbUpdates.phone = updates.phone;
  if (updates.role) dbUpdates.role = updates.role;
  if (updates.category) dbUpdates.category = updates.category;
  if (updates.status) dbUpdates.status = updates.status;
  if (updates.bio) dbUpdates.bio = updates.bio;
  if (updates.commissions) dbUpdates.commissions = updates.commissions;
  if (updates.documents) dbUpdates.documents = updates.documents;

  const { data, error } = await supabase
    .from('profiles')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();
    
  handleSupabaseError(error);
  return data;
};

// --- CONTRIBUTIONS ---
export const dbFetchContributions = async (memberId?: string): Promise<Contribution[]> => {
  let query = supabase.from('contributions').select('*');
  if (memberId) query = query.eq('member_id', memberId);
  const { data, error } = await query.order('date', { ascending: false });
  handleSupabaseError(error);
  return (data || []).map(c => ({
    id: c.id,
    memberId: c.member_id,
    type: c.type,
    amount: Number(c.amount),
    date: c.date,
    eventLabel: c.event_label,
    paymentMethod: c.payment_method,
    status: c.status,
    transactionId: c.transaction_id
  }));
};

// ... Reste des fonctions inchangées mais optimisées pour la DB
export const dbFetchEvents = async (): Promise<Event[]> => {
  const { data, error } = await supabase.from('events').select('*').order('date', { ascending: true });
  handleSupabaseError(error);
  return data || [];
};

export const dbFetchTasks = async (): Promise<Task[]> => {
  const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
  handleSupabaseError(error);
  return data || [];
};

// Stubs pour les autres tables
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
export const dbFetchReports = async () => [];
