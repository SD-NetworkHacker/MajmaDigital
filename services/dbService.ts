
import { Member, Contribution, AdiyaCampaign, BudgetRequest, CommissionFinancialReport, CommissionType, Event, InternalMeetingReport, Task, Vehicle, Driver, TransportSchedule, LibraryResource, SocialCase, SocialProject, TicketItem, InventoryItem, KhassaideModule, Partner, SocialPost, StudyGroup } from '../types';
import { supabase } from '../lib/supabase';

// Helper pour centraliser les erreurs Supabase
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
    documents: m.documents,
    preferences: m.preferences
  }));
};

export const dbCreateMember = async (member: Partial<Member>) => {
  const { data, error } = await supabase.from('profiles').insert([{
    first_name: member.firstName,
    last_name: member.lastName,
    email: member.email,
    phone: member.phone,
    role: member.role || 'MEMBRE',
    category: member.category,
    matricule: member.matricule,
    status: member.status || 'pending',
    bio: member.bio,
    commissions: member.commissions || [],
    academic_info: member.academicInfo,
    professional_info: member.professionalInfo,
    personal_info: {
        address: member.address,
        birthDate: member.birthDate,
        gender: member.gender,
        coordinates: member.coordinates
    }
  }]).select().single();
  handleSupabaseError(error);
  return data;
};

export const dbUpdateMember = async (id: string, updates: Partial<Member>) => {
  const { data, error } = await supabase.from('profiles').update({
    first_name: updates.firstName,
    last_name: updates.lastName,
    email: updates.email,
    phone: updates.phone,
    role: updates.role,
    category: updates.category,
    status: updates.status,
    bio: updates.bio,
    commissions: updates.commissions,
    academic_info: updates.academicInfo,
    professional_info: updates.professionalInfo,
    personal_info: {
        address: updates.address,
        birthDate: updates.birthDate,
        gender: updates.gender,
        coordinates: updates.coordinates
    }
  }).eq('id', id).select().single();
  handleSupabaseError(error);
  return data;
};

export const dbDeleteMember = async (id: string) => {
  const { error } = await supabase.from('profiles').delete().eq('id', id);
  handleSupabaseError(error);
};

export const dbBatchApproveMembers = async (ids: string[]) => {
  const { error } = await supabase.from('profiles').update({ status: 'active' }).in('id', ids);
  handleSupabaseError(error);
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

export const dbCreateContribution = async (contribution: Partial<Contribution>) => {
  const { data, error } = await supabase.from('contributions').insert([{
    member_id: contribution.memberId,
    type: contribution.type,
    amount: contribution.amount,
    date: contribution.date,
    event_label: contribution.eventLabel,
    payment_method: contribution.paymentMethod || 'Espèces',
    status: 'paid',
    transaction_id: `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  }]).select().single();
  handleSupabaseError(error);
  return data;
};

// --- BUDGETS & REPORTS ---
export const dbFetchBudgetRequests = async (commission?: CommissionType): Promise<BudgetRequest[]> => {
  let query = supabase.from('budget_requests').select('*');
  if (commission) query = query.eq('commission', commission);
  const { data, error } = await query.order('submitted_at', { ascending: false });
  handleSupabaseError(error);
  return (data || []).map(b => ({
    id: b.id,
    commission: b.commission as CommissionType,
    title: b.title,
    description: b.description,
    amountRequested: Number(b.amount_requested),
    amountApproved: b.amount_approved ? Number(b.amount_approved) : undefined,
    category: b.category as any,
    priority: b.priority as any,
    timeline: b.timeline,
    breakdown: b.breakdown,
    expectedOutcomes: b.expected_outcomes,
    status: b.status as any,
    submittedBy: b.submitted_by,
    submittedAt: b.submitted_at,
    rejectionReason: b.rejection_reason
  }));
};

export const dbUpdateBudgetRequest = async (id: string, updates: Partial<BudgetRequest>) => {
  const { error } = await supabase.from('budget_requests').update({
    status: updates.status,
    amount_approved: updates.amountApproved,
    rejection_reason: updates.rejectionReason
  }).eq('id', id);
  handleSupabaseError(error);
};

export const dbFetchFinancialReports = async (commission?: CommissionType): Promise<CommissionFinancialReport[]> => {
  let query = supabase.from('financial_reports').select('*');
  if (commission) query = query.eq('commission', commission);
  const { data, error } = await query.order('submitted_at', { ascending: false });
  handleSupabaseError(error);
  return (data || []).map(r => ({
    id: r.id,
    commission: r.commission as CommissionType,
    period: r.period,
    startDate: r.start_date,
    endDate: r.end_date,
    totalBudgetAllocated: Number(r.total_budget_allocated),
    totalExpenses: Number(r.total_expenses),
    balance: Number(r.balance),
    expenses: r.expenses,
    status: r.status as any,
    submittedBy: r.submitted_by,
    submittedAt: r.submitted_at
  }));
};

export const dbFetchAdiyaCampaigns = async (): Promise<AdiyaCampaign[]> => {
  const { data, error } = await supabase.from('adiya_campaigns').select('*').order('created_at', { ascending: false });
  handleSupabaseError(error);
  return (data || []).map(c => ({
    id: c.id,
    title: c.title,
    description: c.description,
    unitAmount: Number(c.unit_amount),
    targetAmount: Number(c.target_amount),
    deadline: c.deadline,
    status: c.status,
    participants: c.participants || [],
    createdBy: c.created_by
  }));
};

// --- EVENTS & TASKS ---
export const dbFetchEvents = async (): Promise<Event[]> => {
  const { data, error } = await supabase.from('events').select('*').order('date', { ascending: true });
  handleSupabaseError(error);
  return (data || []).map(e => ({
    id: e.id,
    title: e.title,
    type: e.type,
    date: e.date,
    time: e.time,
    location: e.location,
    organizingCommission: e.organizing_commission as CommissionType,
    description: e.description,
    status: e.status
  }));
};

export const dbFetchReports = async (): Promise<InternalMeetingReport[]> => {
  const { data, error } = await supabase.from('meeting_reports').select('*').order('date', { ascending: false });
  handleSupabaseError(error);
  return (data || []).map(r => ({
    id: r.id,
    commission: r.commission as CommissionType,
    title: r.title,
    date: r.date,
    startTime: r.start_time,
    endTime: r.end_time,
    location: r.location,
    type: r.type,
    attendees: r.attendees,
    agenda: r.agenda,
    discussions: r.discussions,
    decisions: r.decisions,
    actionItems: r.action_items,
    status: r.status,
    createdBy: r.created_by,
    confidentiality: r.confidentiality,
    meetingQrCode: r.meeting_qr_code,
    adminFeedback: r.admin_feedback,
    bureauFeedback: r.bureau_feedback
  }));
};

export const dbFetchTasks = async (): Promise<Task[]> => {
  const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
  handleSupabaseError(error);
  return (data || []).map(t => ({
    id: t.id,
    title: t.title,
    description: t.description,
    commission: t.commission as CommissionType,
    assignedTo: t.assigned_to,
    priority: t.priority as any,
    status: t.status as any,
    dueDate: t.due_date,
    createdBy: t.created_by,
    createdAt: t.created_at,
    comments: t.comments
  }));
};

// --- TRANSPORT & RESOURCES ---
export const dbFetchFleet = async (): Promise<Vehicle[]> => {
  const { data, error } = await supabase.from('vehicles').select('*');
  handleSupabaseError(error);
  return (data || []).map(v => ({
    id: v.id,
    type: v.type,
    capacity: v.capacity,
    registrationNumber: v.registration_number,
    status: v.status,
    features: v.features,
    ownership: v.ownership,
    maintenance: v.maintenance,
    externalDetails: v.external_details
  }));
};

export const dbFetchDrivers = async (): Promise<Driver[]> => {
  const { data, error } = await supabase.from('drivers').select('*');
  handleSupabaseError(error);
  return (data || []).map(d => ({
      id: d.id,
      memberId: d.member_id,
      name: d.name,
      licenseType: d.license_type,
      status: d.status,
      phone: d.phone,
      tripsCompleted: d.trips_completed
  }));
};

export const dbFetchSchedules = async (): Promise<TransportSchedule[]> => {
  const { data, error } = await supabase.from('trips').select('*').order('departure_date', { ascending: true });
  handleSupabaseError(error);
  return (data || []).map(s => ({
    id: s.id,
    eventId: s.event_id,
    eventTitle: s.event_title,
    departureDate: s.departure_date,
    departureTime: s.departure_time,
    origin: s.origin,
    destination: s.destination,
    stops: s.stops,
    assignedVehicleId: s.assigned_vehicle_id,
    status: s.status,
    seatsFilled: s.seats_filled,
    totalCapacity: s.total_capacity
  }));
};

export const dbFetchTickets = async (): Promise<TicketItem[]> => {
  const { data, error } = await supabase.from('tickets').select('*').order('date', { ascending: false });
  handleSupabaseError(error);
  return data || [];
};

export const dbFetchResources = async (): Promise<LibraryResource[]> => {
  const { data, error } = await supabase.from('library_resources').select('*').order('title', { ascending: true });
  handleSupabaseError(error);
  return data || [];
};

export const dbFetchSocialCases = async (): Promise<SocialCase[]> => {
  const { data, error } = await supabase.from('social_cases').select('*').order('created_at', { ascending: false });
  handleSupabaseError(error);
  return data || [];
};

export const dbFetchSocialProjects = async (): Promise<SocialProject[]> => {
  const { data, error } = await supabase.from('social_projects').select('*').order('created_at', { ascending: false });
  handleSupabaseError(error);
  return data || [];
};

export const dbFetchInventory = async (): Promise<InventoryItem[]> => {
  const { data, error } = await supabase.from('inventory').select('*').order('name', { ascending: true });
  handleSupabaseError(error);
  return data || [];
};

export const dbFetchKhassaideModules = async (): Promise<KhassaideModule[]> => {
  const { data, error } = await supabase.from('khassaide_modules').select('*');
  handleSupabaseError(error);
  return data || [];
};

export const dbFetchPartners = async (): Promise<Partner[]> => {
  const { data, error } = await supabase.from('partners').select('*');
  handleSupabaseError(error);
  return data || [];
};

export const dbFetchSocialPosts = async (): Promise<SocialPost[]> => {
  const { data, error } = await supabase.from('social_posts').select('*').order('date', { ascending: false });
  handleSupabaseError(error);
  return data || [];
};

export const dbFetchStudyGroups = async (): Promise<StudyGroup[]> => {
  const { data, error } = await supabase.from('study_groups').select('*');
  handleSupabaseError(error);
  return data || [];
};

// --- DOCUMENTS ---
export const dbUploadMemberDocument = async (memberId: string, file: File, type: string) => {
    console.log(`Document upload skipped (Simulation only): ${file.name}`);
    return null;
};

export const dbDeleteMemberDocument = async (docId: string, filePath: string) => {
    console.log(`Document delete skipped (Simulation only): ${docId}`);
    return null;
};
