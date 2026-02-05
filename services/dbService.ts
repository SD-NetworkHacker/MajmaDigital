
import { Member, Contribution, Event, InternalMeetingReport, CommissionFinancialReport, BudgetRequest, AdiyaCampaign, FundraisingEvent, Task, LibraryResource, Vehicle, Driver, TransportSchedule, SocialProject, SocialCase } from '../types';
import { supabase } from '../src/lib/supabase';

// --- HELPERS ---

const handleSupabaseError = (error: any) => {
  if (error) {
    console.error("Supabase Error:", error);
    throw new Error(error.message);
  }
};

// --- MEMBERS ---
export const dbFetchMembers = async (): Promise<Member[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*');
  
  if (error) {
      console.warn("Erreur fetch members (peut être vide):", error.message);
      return [];
  }

  // Mapping DB -> Frontend Types
  return (data || []).map((p: any) => ({
      id: p.id,
      firstName: p.first_name,
      lastName: p.last_name,
      email: p.email,
      phone: p.phone,
      role: p.role,
      matricule: p.matricule,
      category: p.category,
      status: p.status || 'active',
      commissions: p.commissions || [], // Supposant un champ JSONB
      joinDate: p.created_at,
      address: p.address,
      coordinates: p.coordinates || { lat: 14.7167, lng: -17.4677 },
      birthDate: p.birth_date,
      gender: p.gender
  }));
};

export const dbCreateMember = async (member: Member) => {
    // Note: La création se fait généralement via Auth.register
    // Cette fonction insère directement dans profiles (pour admin)
    const { data, error } = await supabase
        .from('profiles')
        .insert([{
            first_name: member.firstName,
            last_name: member.lastName,
            email: member.email,
            phone: member.phone,
            role: member.role,
            category: member.category,
            matricule: member.matricule,
            commissions: member.commissions,
            birth_date: member.birthDate,
            gender: member.gender
        }])
        .select();
    handleSupabaseError(error);
    return data;
};

export const dbUpdateMember = async (id: string, updates: Partial<Member>) => {
  // Mapping inverse pour update
  const dbUpdates: any = {};
  if (updates.firstName) dbUpdates.first_name = updates.firstName;
  if (updates.lastName) dbUpdates.last_name = updates.lastName;
  if (updates.role) dbUpdates.role = updates.role;
  if (updates.status) dbUpdates.status = updates.status;
  if (updates.birthDate) dbUpdates.birth_date = updates.birthDate;
  if (updates.gender) dbUpdates.gender = updates.gender;
  // ... autres champs
  
  const { error } = await supabase
    .from('profiles')
    .update(dbUpdates)
    .eq('id', id);
  handleSupabaseError(error);
};

export const dbDeleteMember = async (id: string) => {
  const { error } = await supabase.from('profiles').delete().eq('id', id);
  handleSupabaseError(error);
};

// --- FINANCE ---
export const dbFetchContributions = async (): Promise<Contribution[]> => {
  const { data, error } = await supabase.from('contributions').select('*');
  if (error) return [];
  
  return (data || []).map((c: any) => ({
      id: c.id,
      memberId: c.member_id,
      type: c.type,
      amount: c.amount,
      date: c.date,
      eventLabel: c.event_label,
      status: c.status
  }));
};

export const dbCreateContribution = async (contribution: Contribution) => {
  const { error } = await supabase.from('contributions').insert([{
      member_id: contribution.memberId,
      type: contribution.type,
      amount: contribution.amount,
      date: contribution.date,
      event_label: contribution.eventLabel,
      status: contribution.status
  }]);
  handleSupabaseError(error);
};

// --- EVENTS ---
export const dbFetchEvents = async (): Promise<Event[]> => {
  const { data, error } = await supabase.from('events').select('*');
  if (error) return [];
  return data || [];
};

export const dbCreateEvent = async (event: Event) => {
  const { error } = await supabase.from('events').insert([event]);
  handleSupabaseError(error);
};

// --- REPORTS ---
export const dbFetchReports = async (): Promise<InternalMeetingReport[]> => {
   const { data, error } = await supabase.from('meeting_reports').select('*');
   if (error) return [];
   return data || [];
};

export const dbCreateReport = async (report: InternalMeetingReport) => {
   const { error } = await supabase.from('meeting_reports').insert([report]);
   handleSupabaseError(error);
};

// --- TASKS ---
export const dbFetchTasks = async (): Promise<Task[]> => {
    const { data, error } = await supabase.from('tasks').select('*');
    if (error) return [];
    return data || [];
};

export const dbCreateTask = async (task: Task) => {
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

// --- SOCIAL / ADIYA / RESOURCES ---
// Fallbacks safe si les tables n'existent pas encore
export const dbFetchAdiyaCampaigns = async (): Promise<AdiyaCampaign[]> => {
    const { data } = await supabase.from('adiya_campaigns').select('*');
    return data || [];
};
export const dbCreateAdiyaCampaign = async (c: AdiyaCampaign) => {
    await supabase.from('adiya_campaigns').insert([c]);
};
export const dbUpdateAdiyaCampaign = async (id: string, u: Partial<AdiyaCampaign>) => {
    await supabase.from('adiya_campaigns').update(u).eq('id', id);
};

// Resources
export const dbFetchResources = async (): Promise<LibraryResource[]> => {
    const { data } = await supabase.from('library_resources').select('*');
    return data || [];
};
export const dbCreateResource = async (r: LibraryResource) => {
    await supabase.from('library_resources').insert([r]);
};
export const dbDeleteResource = async (id: string) => {
    await supabase.from('library_resources').delete().eq('id', id);
};

// Social Cases
export const dbFetchSocialCases = async (): Promise<SocialCase[]> => {
    const { data } = await supabase.from('social_cases').select('*');
    return data || [];
};
export const dbCreateSocialCase = async (sc: Partial<SocialCase>) => {
    await supabase.from('social_cases').insert([sc]);
};

// Social Projects
export const dbFetchSocialProjects = async (): Promise<SocialProject[]> => {
    const { data } = await supabase.from('social_projects').select('*');
    return data || [];
};
export const dbCreateSocialProject = async (p: Partial<SocialProject>) => {
    await supabase.from('social_projects').insert([p]);
};

// --- PLACEHOLDERS / MOCKS ---
// Ces fonctions simulent des retours vides pour les parties non encore migrées en DB
export const dbFetchFleet = async (): Promise<Vehicle[]> => [];
export const dbFetchDrivers = async (): Promise<Driver[]> => [];
export const dbFetchSchedules = async (): Promise<TransportSchedule[]> => [];
export const dbCreateVehicle = async (v: Vehicle) => {};
export const dbUpdateVehicle = async (id: string, u: Partial<Vehicle>) => {};
export const dbDeleteVehicle = async (id: string) => {};
export const dbCreateDriver = async (d: Driver) => {};
export const dbUpdateDriver = async (id: string, u: Partial<Driver>) => {};
export const dbDeleteDriver = async (id: string) => {};
export const dbCreateSchedule = async (s: TransportSchedule) => {};
export const dbFetchFinancialReports = async (): Promise<CommissionFinancialReport[]> => [];
export const dbFetchBudgetRequests = async (): Promise<BudgetRequest[]> => [];
export const dbFetchFundraisingEvents = async (): Promise<FundraisingEvent[]> => [];
export const dbUpdateContribution = async (id: string, updates: Partial<Contribution>) => {};
export const dbDeleteContribution = async (id: string) => {};
