
import { Member, Contribution, Event, InternalMeetingReport, CommissionFinancialReport, BudgetRequest, AdiyaCampaign, FundraisingEvent, Task, LibraryResource, Vehicle, Driver, TransportSchedule, SocialProject, SocialCase, TicketItem, InventoryItem, KhassaideModule, Partner, SocialPost, StudyGroup } from '../types';
import { supabase } from '../lib/supabase';

const handleSupabaseError = (error: any) => {
  if (error) {
    console.error("Supabase Error:", error);
    // Don't throw for everything to keep UI alive, but log it.
    // throw new Error(error.message); 
  }
};

// --- MEMBERS ---
export const dbFetchMembers = async (): Promise<Member[]> => {
  const { data, error } = await supabase.from('members').select('*');
  if (error) {
      console.error("Fetch Members Error:", error);
      return [];
  }
  return data || [];
};

export const dbCreateMember = async (member: Partial<Member>) => {
  const { error } = await supabase.from('members').insert([member]);
  handleSupabaseError(error);
};

export const dbUpdateMember = async (id: string, updates: Partial<Member>) => {
  const { error } = await supabase.from('members').update(updates).eq('id', id);
  handleSupabaseError(error);
};

export const dbDeleteMember = async (id: string) => {
  const { error } = await supabase.from('members').delete().eq('id', id);
  handleSupabaseError(error);
};

// --- CONTRIBUTIONS ---
export const dbFetchContributions = async (): Promise<Contribution[]> => {
  const { data, error } = await supabase.from('contributions').select('*');
  if (error) return [];
  return data || [];
};

export const dbCreateContribution = async (contribution: Partial<Contribution>) => {
  const { error } = await supabase.from('contributions').insert([contribution]);
  handleSupabaseError(error);
};

// --- EVENTS ---
export const dbFetchEvents = async (): Promise<Event[]> => {
  const { data, error } = await supabase.from('events').select('*');
  if (error) return [];
  return data || [];
};

export const dbCreateEvent = async (event: Partial<Event>) => {
  const { error } = await supabase.from('events').insert([event]);
  handleSupabaseError(error);
};

export const dbDeleteEvent = async (id: string) => {
  const { error } = await supabase.from('events').delete().eq('id', id);
  handleSupabaseError(error);
};

// --- REPORTS ---
export const dbFetchReports = async (): Promise<InternalMeetingReport[]> => {
  const { data, error } = await supabase.from('meeting_reports').select('*');
  if (error) return [];
  return data || [];
};

export const dbCreateReport = async (report: Partial<InternalMeetingReport>) => {
  const { error } = await supabase.from('meeting_reports').insert([report]);
  handleSupabaseError(error);
};

// --- TASKS ---
export const dbFetchTasks = async (): Promise<Task[]> => {
  const { data, error } = await supabase.from('tasks').select('*');
  if (error) return [];
  return data || [];
};

export const dbCreateTask = async (task: Partial<Task>) => {
  const { error } = await supabase.from('tasks').insert([task]);
  handleSupabaseError(error);
};

export const dbUpdateTask = async (id: string, updates: Partial<Task>) => {
  const { error } = await supabase.from('tasks').update(updates).eq('id', id);
  handleSupabaseError(error);
};

export const dbDeleteTask = async (id: string) => {
  const { error } = await supabase.from('tasks').delete().eq('id', id);
  handleSupabaseError(error);
};

// --- CAMPAIGNS ---
export const dbFetchAdiyaCampaigns = async (): Promise<AdiyaCampaign[]> => {
  const { data, error } = await supabase.from('adiya_campaigns').select('*');
  if (error) return [];
  return data || [];
};

export const dbCreateAdiyaCampaign = async (campaign: Partial<AdiyaCampaign>) => {
  const { error } = await supabase.from('adiya_campaigns').insert([campaign]);
  handleSupabaseError(error);
};

export const dbUpdateAdiyaCampaign = async (id: string, updates: Partial<AdiyaCampaign>) => {
  const { error } = await supabase.from('adiya_campaigns').update(updates).eq('id', id);
  handleSupabaseError(error);
};

// --- TRANSPORT ---
export const dbFetchFleet = async (): Promise<Vehicle[]> => {
  const { data, error } = await supabase.from('vehicles').select('*');
  if (error) return [];
  return data || [];
};

export const dbCreateVehicle = async (vehicle: Partial<Vehicle>) => {
  const { error } = await supabase.from('vehicles').insert([vehicle]);
  handleSupabaseError(error);
};

export const dbUpdateVehicle = async (id: string, updates: Partial<Vehicle>) => {
  const { error } = await supabase.from('vehicles').update(updates).eq('id', id);
  handleSupabaseError(error);
};

export const dbDeleteVehicle = async (id: string) => {
  const { error } = await supabase.from('vehicles').delete().eq('id', id);
  handleSupabaseError(error);
};

export const dbFetchDrivers = async (): Promise<Driver[]> => {
  const { data, error } = await supabase.from('drivers').select('*');
  if (error) return [];
  return data || [];
};

export const dbCreateDriver = async (driver: Partial<Driver>) => {
  const { error } = await supabase.from('drivers').insert([driver]);
  handleSupabaseError(error);
};

export const dbUpdateDriver = async (id: string, updates: Partial<Driver>) => {
  const { error } = await supabase.from('drivers').update(updates).eq('id', id);
  handleSupabaseError(error);
};

export const dbDeleteDriver = async (id: string) => {
  const { error } = await supabase.from('drivers').delete().eq('id', id);
  handleSupabaseError(error);
};

export const dbFetchSchedules = async (): Promise<TransportSchedule[]> => {
  const { data, error } = await supabase.from('transport_schedules').select('*');
  if (error) return [];
  return data || [];
};

export const dbCreateSchedule = async (schedule: Partial<TransportSchedule>) => {
  const { error } = await supabase.from('transport_schedules').insert([schedule]);
  handleSupabaseError(error);
};

export const dbFetchTickets = async (): Promise<TicketItem[]> => {
  const { data, error } = await supabase.from('tickets').select('*');
  if (error) return [];
  return data || [];
};

export const dbCreateTicket = async (ticket: Partial<TicketItem>) => {
  const { error } = await supabase.from('tickets').insert([ticket]);
  handleSupabaseError(error);
};

export const dbUpdateTicket = async (id: string, updates: Partial<TicketItem>) => {
  const { error } = await supabase.from('tickets').update(updates).eq('id', id);
  handleSupabaseError(error);
};

export const dbDeleteTicket = async (id: string) => {
  const { error } = await supabase.from('tickets').delete().eq('id', id);
  handleSupabaseError(error);
};

// --- INVENTORY ---
export const dbFetchInventory = async (): Promise<InventoryItem[]> => {
  const { data, error } = await supabase.from('inventory').select('*');
  if (error) return [];
  return data || [];
};

export const dbCreateInventoryItem = async (item: Partial<InventoryItem>) => {
  const { error } = await supabase.from('inventory').insert([item]);
  handleSupabaseError(error);
};

export const dbDeleteInventoryItem = async (id: string) => {
  const { error } = await supabase.from('inventory').delete().eq('id', id);
  handleSupabaseError(error);
};

// --- RESOURCES / KHASSAIDE ---
export const dbFetchResources = async (): Promise<LibraryResource[]> => {
  const { data, error } = await supabase.from('library_resources').select('*');
  if (error) return [];
  return data || [];
};

export const dbCreateResource = async (resource: Partial<LibraryResource>) => {
  const { error } = await supabase.from('library_resources').insert([resource]);
  handleSupabaseError(error);
};

export const dbDeleteResource = async (id: string) => {
  const { error } = await supabase.from('library_resources').delete().eq('id', id);
  handleSupabaseError(error);
};

export const dbFetchKhassaideModules = async (): Promise<KhassaideModule[]> => {
  const { data, error } = await supabase.from('khassaide_modules').select('*');
  if (error) return [];
  return data || [];
};

export const dbCreateKhassaideModule = async (module: Partial<KhassaideModule>) => {
  const { error } = await supabase.from('khassaide_modules').insert([module]);
  handleSupabaseError(error);
};

export const dbUpdateKhassaideModule = async (id: string, updates: Partial<KhassaideModule>) => {
  const { error } = await supabase.from('khassaide_modules').update(updates).eq('id', id);
  handleSupabaseError(error);
};

// --- SOCIAL ---
export const dbFetchSocialCases = async (): Promise<SocialCase[]> => {
  const { data, error } = await supabase.from('social_cases').select('*');
  if (error) return [];
  return data || [];
};

export const dbCreateSocialCase = async (socialCase: Partial<SocialCase>) => {
  const { error } = await supabase.from('social_cases').insert([socialCase]);
  handleSupabaseError(error);
};

export const dbFetchSocialProjects = async (): Promise<SocialProject[]> => {
  const { data, error } = await supabase.from('social_projects').select('*');
  if (error) return [];
  return data || [];
};

export const dbCreateSocialProject = async (project: Partial<SocialProject>) => {
  const { error } = await supabase.from('social_projects').insert([project]);
  handleSupabaseError(error);
};

// --- PARTNERS (Relations Ext) ---
export const dbFetchPartners = async (): Promise<Partner[]> => {
    const { data, error } = await supabase.from('partners').select('*');
    if (error) return [];
    return data || [];
};
export const dbCreatePartner = async (p: Partial<Partner>) => {
    const { error } = await supabase.from('partners').insert([p]);
    handleSupabaseError(error);
};

// --- COMMUNICATION (Posts) ---
export const dbFetchSocialPosts = async (): Promise<SocialPost[]> => {
    const { data, error } = await supabase.from('social_posts').select('*');
    if (error) return [];
    return data || [];
};
export const dbCreateSocialPost = async (p: Partial<SocialPost>) => {
    const { error } = await supabase.from('social_posts').insert([p]);
    handleSupabaseError(error);
};

// --- PEDAGOGIE (Groups) ---
export const dbFetchStudyGroups = async (): Promise<StudyGroup[]> => {
    const { data, error } = await supabase.from('study_groups').select('*');
    if (error) return [];
    // Adapter le retour si les noms de colonnes DB diffèrent
    return data.map((g: any) => ({
        id: g.id,
        name: g.name,
        theme: g.theme,
        membersCount: g.members_count || 0
    }));
};
export const dbCreateStudyGroup = async (g: Partial<StudyGroup>) => {
    const { error } = await supabase.from('study_groups').insert([{
        name: g.name,
        theme: g.theme,
        members_count: g.membersCount
    }]);
    handleSupabaseError(error);
};
