
import { Member, Contribution, Event, InternalMeetingReport, CommissionFinancialReport, BudgetRequest, AdiyaCampaign, FundraisingEvent, Task, LibraryResource, Vehicle, Driver, TransportSchedule, SocialProject, SocialCase, TicketItem, InventoryItem, KhassaideModule, Partner, SocialPost, StudyGroup, CommissionType, MemberDocument } from '../types';
import { supabase } from '../lib/supabase';

const handleSupabaseError = (error: any) => {
  if (error) {
    console.error("Supabase Error:", error);
    // Don't throw for everything to keep UI alive, but log it.
    // throw new Error(error.message); 
  }
};

// --- MEMBERS (MAPPED TO PROFILES TABLE & COMMISSION_MEMBERSHIPS) ---
// ... (code membre existant inchangé)
export const dbFetchMembers = async (): Promise<Member[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
        *,
        commission_memberships (
            id,
            commission_type,
            role_commission,
            permissions
        ),
        member_documents (
            id,
            name,
            type,
            file_path,
            verified,
            created_at
        )
    `)
    .order('created_at', { ascending: false });

  if (error) {
      console.error("Fetch Profiles Error:", error);
      return [];
  }

  return (data || []).map((p: any) => {
    let coords = { lat: 14.7167, lng: -17.4677 }; 
    if (p.location_data && typeof p.location_data === 'object') {
        if(p.location_data.lat && p.location_data.lng) {
            coords = { lat: Number(p.location_data.lat), lng: Number(p.location_data.lng) };
        }
    }

    const mappedCommissions = (p.commission_memberships || []).map((cm: any) => ({
        id: cm.id,
        type: cm.commission_type as CommissionType,
        role_commission: cm.role_commission || 'Membre',
        permissions: cm.permissions || []
    }));

    const mappedDocuments = (p.member_documents || []).map((doc: any) => ({
        id: doc.id,
        name: doc.name,
        type: doc.type,
        date: doc.created_at,
        url: doc.file_path,
        verified: doc.verified
    }));

    return {
      id: p.id,
      firstName: p.first_name || '',
      lastName: p.last_name || '',
      email: p.email || '',
      phone: p.phone || '',
      role: p.role || 'MEMBRE',
      category: p.category || 'Sympathisant',
      matricule: p.matricule || 'N/A',
      status: p.status || 'active', 
      address: p.address || 'Non renseignée',
      birthDate: p.birth_date, 
      gender: p.gender, 
      joinDate: p.created_at,
      coordinates: coords, 
      commissions: mappedCommissions,
      bio: p.bio,
      academicInfo: p.academic_info,
      professionalInfo: p.professional_info,
      level: p.academic_info?.level || p.professional_info?.position || '',
      documents: mappedDocuments,
      preferences: p.preferences || {
          notifications: { email: true, push: true, sms: false },
          privacy: { showPhone: false, showAddress: false }
      }
    };
  });
};

export const dbCreateMember = async (member: Member) => {
  const profileData = {
    id: member.id || undefined, 
    first_name: member.firstName,
    last_name: member.lastName,
    email: member.email,
    phone: member.phone,
    role: member.role,
    category: member.category,
    matricule: member.matricule,
    address: member.address,
    birth_date: member.birthDate,
    gender: member.gender,
    location_data: member.coordinates,
    academic_info: member.academicInfo || {},
    professional_info: member.professionalInfo || {},
    preferences: member.preferences || {},
    status: member.status
  };

  const { data: newProfile, error: profileError } = await supabase
    .from('profiles')
    .insert([profileData])
    .select()
    .single();
  
  if (profileError) {
      handleSupabaseError(profileError);
      return;
  }

  if (member.commissions && member.commissions.length > 0 && newProfile) {
      const memberships = member.commissions.map(c => ({
          member_id: newProfile.id,
          commission_type: c.type,
          role_commission: c.role_commission,
          permissions: c.permissions || []
      }));
      const { error: commError } = await supabase.from('commission_memberships').insert(memberships);
      handleSupabaseError(commError);
  }
};

export const dbUpdateMember = async (id: string, updates: Partial<Member>) => {
  const dbUpdates: any = {};
  if (updates.firstName) dbUpdates.first_name = updates.firstName;
  if (updates.lastName) dbUpdates.last_name = updates.lastName;
  if (updates.email) dbUpdates.email = updates.email;
  if (updates.phone) dbUpdates.phone = updates.phone;
  if (updates.role) dbUpdates.role = updates.role;
  if (updates.category) dbUpdates.category = updates.category;
  if (updates.bio) dbUpdates.bio = updates.bio;
  if (updates.address) dbUpdates.address = updates.address;
  if (updates.birthDate) dbUpdates.birth_date = updates.birthDate;
  if (updates.gender) dbUpdates.gender = updates.gender;
  if (updates.coordinates) dbUpdates.location_data = updates.coordinates;
  if (updates.preferences) dbUpdates.preferences = updates.preferences;
  if (updates.status) dbUpdates.status = updates.status;
  if (updates.academicInfo) dbUpdates.academic_info = updates.academicInfo;
  if (updates.professionalInfo) dbUpdates.professional_info = updates.professionalInfo;

  if (Object.keys(dbUpdates).length > 0) {
      const { error } = await supabase.from('profiles').update(dbUpdates).eq('id', id);
      handleSupabaseError(error);
  }

  if (updates.commissions) {
      await supabase.from('commission_memberships').delete().eq('member_id', id);
      if (updates.commissions.length > 0) {
          const memberships = updates.commissions.map(c => ({
              member_id: id,
              commission_type: c.type,
              role_commission: c.role_commission,
              permissions: c.permissions || []
          }));
          const { error: commError } = await supabase.from('commission_memberships').insert(memberships);
          handleSupabaseError(commError);
      }
  }
};

export const dbDeleteMember = async (id: string) => {
  const { error } = await supabase.from('profiles').delete().eq('id', id);
  handleSupabaseError(error);
};

// --- MEMBER DOCUMENTS ---
export const dbUploadMemberDocument = async (memberId: string, file: File, docType: 'PDF' | 'IMAGE' | 'AUTRE' = 'AUTRE') => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${memberId}/${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from('member-docs').upload(fileName, file);

    if (uploadError) {
        console.error("Upload Error:", uploadError);
        throw uploadError;
    }

    const { data, error: dbError } = await supabase.from('member_documents').insert([{
            member_id: memberId,
            name: file.name,
            type: docType,
            file_path: fileName,
            size: file.size,
            verified: false
        }]).select().single();
    
    if (dbError) handleSupabaseError(dbError);
    return data;
};

export const dbDeleteMemberDocument = async (docId: string, filePath: string) => {
    const { error: storageError } = await supabase.storage.from('member-docs').remove([filePath]);
    if (storageError) console.warn("Storage remove error (might already be gone):", storageError);

    const { error } = await supabase.from('member_documents').delete().eq('id', docId);
    handleSupabaseError(error);
};


// --- CONTRIBUTIONS (FINANCE) ---
export const dbFetchContributions = async (): Promise<Contribution[]> => {
  const { data, error } = await supabase.from('contributions').select('*').order('date', { ascending: false });
  if (error) return [];
  
  return (data || []).map((c: any) => ({
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
  const { error } = await supabase.from('contributions').insert([{
      member_id: contribution.memberId,
      type: contribution.type,
      amount: contribution.amount,
      date: contribution.date,
      event_label: contribution.eventLabel,
      payment_method: contribution.paymentMethod || 'Espèces',
      status: contribution.status,
      transaction_id: contribution.transactionId || `TX-${Date.now()}`
  }]);
  handleSupabaseError(error);
};

export const dbUpdateContribution = async (id: string, updates: Partial<Contribution>) => {
    const dbUpdates: any = {};
    if(updates.amount) dbUpdates.amount = updates.amount;
    if(updates.status) dbUpdates.status = updates.status;
    if(updates.eventLabel) dbUpdates.event_label = updates.eventLabel;
    
    const { error } = await supabase.from('contributions').update(dbUpdates).eq('id', id);
    handleSupabaseError(error);
};

export const dbDeleteContribution = async (id: string) => {
    const { error } = await supabase.from('contributions').delete().eq('id', id);
    handleSupabaseError(error);
};

// --- ADIYA CAMPAIGNS ---
export const dbFetchAdiyaCampaigns = async (): Promise<AdiyaCampaign[]> => {
  const { data, error } = await supabase.from('adiya_campaigns').select('*').order('created_at', { ascending: false });
  if (error) return [];
  
  return data.map((c: any) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      unitAmount: c.unit_amount,
      targetAmount: c.target_amount,
      deadline: c.deadline,
      status: c.status,
      participants: c.participants || [], // JSONB
      createdBy: c.created_by
  }));
};

export const dbCreateAdiyaCampaign = async (campaign: Partial<AdiyaCampaign>) => {
  const { error } = await supabase.from('adiya_campaigns').insert([{
      title: campaign.title,
      description: campaign.description,
      unit_amount: campaign.unitAmount,
      target_amount: campaign.targetAmount,
      deadline: campaign.deadline,
      status: campaign.status,
      participants: campaign.participants || [],
      created_by: campaign.createdBy
  }]);
  handleSupabaseError(error);
};

export const dbUpdateAdiyaCampaign = async (id: string, updates: Partial<AdiyaCampaign>) => {
  const dbUpdates: any = {};
  if (updates.participants) dbUpdates.participants = updates.participants;
  if (updates.status) dbUpdates.status = updates.status;
  
  const { error } = await supabase.from('adiya_campaigns').update(dbUpdates).eq('id', id);
  handleSupabaseError(error);
};

// --- FUNDRAISING EVENTS ---
export const dbFetchFundraisingEvents = async (): Promise<FundraisingEvent[]> => {
    const { data, error } = await supabase.from('fundraising_events').select('*').order('created_at', { ascending: false });
    if (error) return [];
    
    return data.map((e: any) => ({
        id: e.id,
        name: e.name,
        type: e.type,
        status: e.status,
        deadline: e.deadline,
        groups: e.groups || [], // JSONB
        createdAt: e.created_at
    }));
};

export const dbCreateFundraisingEvent = async (event: Partial<FundraisingEvent>) => {
    const { error } = await supabase.from('fundraising_events').insert([{
        name: event.name,
        type: event.type,
        status: event.status,
        deadline: event.deadline,
        groups: event.groups || []
    }]);
    handleSupabaseError(error);
};

export const dbUpdateFundraisingEvent = async (id: string, updates: Partial<FundraisingEvent>) => {
    const dbUpdates: any = {};
    if(updates.groups) dbUpdates.groups = updates.groups;
    if(updates.status) dbUpdates.status = updates.status;
    
    const { error } = await supabase.from('fundraising_events').update(dbUpdates).eq('id', id);
    handleSupabaseError(error);
};

// ... (Rest of modules unchanged)
// --- BUDGET REQUESTS ---
export const dbFetchBudgetRequests = async (): Promise<BudgetRequest[]> => {
  const { data, error } = await supabase.from('budget_requests').select('*');
  if (error) return [];
  
  return data.map((b: any) => ({
    id: b.id,
    commission: b.commission,
    title: b.title,
    description: b.description,
    amountRequested: b.amount_requested,
    amountApproved: b.amount_approved,
    category: b.category,
    priority: b.priority,
    timeline: b.timeline,
    breakdown: b.breakdown,
    expectedOutcomes: b.expected_outcomes,
    status: b.status,
    submittedBy: b.submitted_by,
    submittedAt: b.submitted_at,
    rejectionReason: b.rejection_reason
  }));
};

export const dbCreateBudgetRequest = async (request: Partial<BudgetRequest>) => {
  const { error } = await supabase.from('budget_requests').insert([{
    commission: request.commission,
    title: request.title,
    description: request.description,
    amount_requested: request.amountRequested,
    category: request.category,
    priority: request.priority,
    timeline: request.timeline,
    breakdown: request.breakdown,
    expected_outcomes: request.expectedOutcomes,
    status: request.status,
    submitted_by: request.submittedBy,
    submitted_at: request.submittedAt
  }]);
  handleSupabaseError(error);
};

export const dbUpdateBudgetRequest = async (id: string, updates: Partial<BudgetRequest>) => {
  const dbUpdates: any = {};
  if (updates.status) dbUpdates.status = updates.status;
  if (updates.amountApproved !== undefined) dbUpdates.amount_approved = updates.amountApproved;
  if (updates.rejectionReason) dbUpdates.rejection_reason = updates.rejectionReason;

  const { error } = await supabase.from('budget_requests').update(dbUpdates).eq('id', id);
  handleSupabaseError(error);
};

// --- FINANCIAL REPORTS ---
export const dbFetchFinancialReports = async (): Promise<CommissionFinancialReport[]> => {
  const { data, error } = await supabase.from('financial_reports').select('*');
  if (error) return [];

  return data.map((r: any) => ({
    id: r.id,
    commission: r.commission,
    period: r.period,
    startDate: r.start_date,
    endDate: r.end_date,
    totalBudgetAllocated: r.total_budget_allocated,
    totalExpenses: r.total_expenses,
    balance: r.balance,
    expenses: r.expenses,
    status: r.status,
    submittedBy: r.submitted_by,
    submittedAt: r.submitted_at,
    rejectionReason: r.rejection_reason
  }));
};

export const dbCreateFinancialReport = async (report: Partial<CommissionFinancialReport>) => {
  const { error } = await supabase.from('financial_reports').insert([{
    commission: report.commission,
    period: report.period,
    start_date: report.startDate,
    end_date: report.endDate,
    total_budget_allocated: report.totalBudgetAllocated,
    total_expenses: report.totalExpenses,
    expenses: report.expenses,
    status: report.status,
    submitted_by: report.submittedBy,
    submitted_at: report.submittedAt
  }]);
  handleSupabaseError(error);
};

export const dbUpdateFinancialReport = async (id: string, updates: Partial<CommissionFinancialReport>) => {
    const dbUpdates: any = {};
    if (updates.status) dbUpdates.status = updates.status;
    if (updates.rejectionReason) dbUpdates.rejection_reason = updates.rejectionReason;
    
    const { error } = await supabase.from('financial_reports').update(dbUpdates).eq('id', id);
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
