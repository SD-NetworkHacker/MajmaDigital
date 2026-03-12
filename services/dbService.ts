
import { Member, Contribution, Event, Task, CommissionFinancialReport, BudgetRequest, InternalMeetingReport, Vehicle, Driver, TransportSchedule, CulturalActivity, LibraryResource, KhassaideModule } from '../types';
import { supabase } from '../lib/supabase';
import { SEED_CULTURAL_ACTIVITIES, SEED_LIBRARY, SEED_KHASSAIDE_MODULES } from '../constants';

/**
 * Moteur d'accès aux données hybride
 * Priorise l'API (MongoDB/Express) avec fallback LocalStorage
 */

const USE_MONGO_API = false; // Flag pour basculer entre API et Supabase/Local
const API_BASE_URL = '/api'; // À adapter selon l'environnement

let isApiOnline = true;

// --- HELPERS PERSISTENCE ---

const getLocal = <T>(key: string, fallback: T): T => {
  const data = localStorage.getItem(`majma_${key}`);
  return data ? JSON.parse(data) : fallback;
};

const setLocal = (key: string, data: any) => {
  localStorage.setItem(`majma_${key}`, JSON.stringify(data));
};

const mongoFetch = async (endpoint: string, options: RequestInit = {}) => {
  if (!USE_MONGO_API || !isApiOnline) return null;

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        // Token expiré ou invalide
        localStorage.removeItem('token');
      }
      return null;
    }

    return await response.json();
  } catch (err) {
    console.warn(`API Offline (${endpoint}):`, err);
    isApiOnline = false; // Circuit breaker
    return null;
  }
};

// --- MAPPING ---

const mapMember = (m: any): Member => ({
  id: m.id || m._id,
  firstName: m.first_name || m.firstName || '',
  lastName: m.last_name || m.lastName || '',
  email: m.email || '',
  phone: m.phone || '',
  role: m.role || 'MEMBRE',
  category: m.category || 'Étudiant',
  matricule: m.matricule || 'MAJ-NEW',
  status: m.status || 'pending',
  address: m.personal_info?.address || m.address || '',
  joinDate: m.created_at || m.joinDate,
  coordinates: m.personal_info?.coordinates || m.coordinates || { lat: 14.7167, lng: -17.4677 },
  commissions: m.commissions || [],
  bio: m.bio || ''
});

const mapContribution = (c: any): Contribution => ({
  id: c.id || c._id,
  memberId: c.member_id || c.memberId,
  type: c.type,
  amount: Number(c.amount),
  date: c.date,
  eventLabel: c.event_label || c.eventLabel,
  status: c.status,
  transactionId: c.transaction_id || c.transactionId
});

// --- API ACTIONS ---

export const dbFetchMembers = async (): Promise<Member[]> => {
  // 1. Essayer l'API
  const apiData = await mongoFetch('/members');
  if (apiData) {
    const members = apiData.map(mapMember);
    setLocal('members', members);
    return members;
  }

  // 2. Fallback Supabase (si configuré) ou LocalStorage
  try {
    const { data, error } = await supabase.from('profiles').select('*').order('last_name');
    if (!error && data) {
      const members = data.map(mapMember);
      setLocal('members', members);
      return members;
    }
  } catch (e) {
    console.error("Supabase fallback failed", e);
  }

  return getLocal('members', []);
};

export const dbFetchContributions = async (): Promise<Contribution[]> => {
  const apiData = await mongoFetch('/contributions');
  if (apiData) {
    const contributions = apiData.map(mapContribution);
    setLocal('contributions', contributions);
    return contributions;
  }

  try {
    const { data, error } = await supabase.from('contributions').select('*').order('date', { ascending: false });
    if (!error && data) {
      const contributions = data.map(mapContribution);
      setLocal('contributions', contributions);
      return contributions;
    }
  } catch (e) {}

  return getLocal('contributions', []);
};

export const dbAddContribution = async (c: Partial<Contribution>) => {
  // Optimiste: mise à jour locale immédiate
  const local = getLocal<Contribution[]>('contributions', []);
  const tempId = `temp_${Date.now()}`;
  const newContrib = { ...c, id: tempId, status: 'paid', date: new Date().toISOString() } as Contribution;
  setLocal('contributions', [newContrib, ...local]);

  // Appel API
  const apiData = await mongoFetch('/contributions', {
    method: 'POST',
    body: JSON.stringify(c)
  });

  if (apiData) {
    const saved = mapContribution(apiData);
    // Remplacer le temporaire par le réel
    setLocal('contributions', [saved, ...local]);
    return saved;
  }

  // Fallback Supabase
  try {
    const { data, error } = await supabase.from('contributions').insert([{
      member_id: c.memberId,
      type: c.type,
      amount: c.amount,
      event_label: c.eventLabel,
      status: 'paid'
    }]).select().single();
    
    if (!error && data) return mapContribution(data);
  } catch (e) {}

  return newContrib;
};

export const dbFetchEvents = async (): Promise<Event[]> => {
  const apiData = await mongoFetch('/events');
  if (apiData) {
    setLocal('events', apiData);
    return apiData;
  }

  const { data } = await supabase.from('events').select('*').order('date');
  if (data) {
    setLocal('events', data);
    return data;
  }

  return getLocal('events', []);
};

export const dbFetchTasks = async (): Promise<Task[]> => {
  const apiData = await mongoFetch('/tasks');
  if (apiData) {
    setLocal('tasks', apiData);
    return apiData;
  }

  const { data } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
  if (data) {
    setLocal('tasks', data);
    return data;
  }

  return getLocal('tasks', []);
};

export const dbAddTask = async (t: Partial<Task>) => {
  const apiData = await mongoFetch('/tasks', {
    method: 'POST',
    body: JSON.stringify(t)
  });

  if (apiData) return apiData;

  const { data, error } = await supabase.from('tasks').insert([t]).select().single();
  if (error) throw error;
  return data;
};

export const dbUpdateContribution = async (id: string, updates: any) => {
  const apiData = await mongoFetch(`/contributions/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates)
  });

  if (apiData) return mapContribution(apiData);

  const { data, error } = await supabase.from('contributions').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return mapContribution(data);
};

export const dbDeleteContribution = async (id: string) => {
  const apiData = await mongoFetch(`/contributions/${id}`, {
    method: 'DELETE'
  });

  if (apiData) return true;

  const { error } = await supabase.from('contributions').delete().eq('id', id);
  if (error) throw error;
  return true;
};

export const dbUpdateMemberStatus = async (id: string, status: string) => {
  const apiData = await mongoFetch(`/members/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });

  if (apiData) return mapMember(apiData);

  const { data, error } = await supabase.from('profiles').update({ status }).eq('id', id).select().single();
  if (error) throw error;
  return mapMember(data);
};

export const dbUpdateMember = async (id: string, updates: any) => {
  const apiData = await mongoFetch(`/members/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates)
  });

  if (apiData) return mapMember(apiData);

  const { data, error } = await supabase.from('profiles').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return mapMember(data);
};

export const dbAddTicket = async (t: any) => {
  const apiData = await mongoFetch('/tickets', {
    method: 'POST',
    body: JSON.stringify(t)
  });

  if (apiData) return apiData;

  const { data, error } = await supabase.from('tickets').insert([t]).select().single();
  if (error) throw error;
  return data;
};

export const dbUpdateTicket = async (id: string, updates: any) => {
  const apiData = await mongoFetch(`/tickets/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates)
  });

  if (apiData) return apiData;

  const { data, error } = await supabase.from('tickets').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const dbFetchProfile = async (userId: string) => {
  const apiData = await mongoFetch(`/members/${userId}`);
  if (apiData) return mapMember(apiData);

  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
  if (error) return null;
  return data ? mapMember(data) : null;
};

export const dbFetchReports = async (): Promise<InternalMeetingReport[]> => {
  const apiData = await mongoFetch('/reports');
  if (apiData) {
    setLocal('reports', apiData);
    return apiData;
  }

  const { data } = await supabase.from('meeting_reports').select('*').order('date', { ascending: false });
  if (data) {
    setLocal('reports', data);
    return data;
  }

  return getLocal('reports', []);
};

export const dbAddReport = async (report: Partial<InternalMeetingReport>) => {
  const apiData = await mongoFetch('/reports', {
    method: 'POST',
    body: JSON.stringify(report)
  });

  if (apiData) return apiData;

  const { data, error } = await supabase.from('meeting_reports').insert([report]).select().single();
  if (error) throw error;
  return data;
};

export const dbUpdateReport = async (id: string, updates: Partial<InternalMeetingReport>) => {
  const apiData = await mongoFetch(`/reports/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates)
  });

  if (apiData) return apiData;

  const { data, error } = await supabase.from('meeting_reports').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const dbDeleteReport = async (id: string) => {
  const apiData = await mongoFetch(`/reports/${id}`, {
    method: 'DELETE'
  });

  if (apiData) return true;

  const { error } = await supabase.from('meeting_reports').delete().eq('id', id);
  if (error) throw error;
  return true;
};

// Transport
export const dbFetchFleet = async (): Promise<Vehicle[]> => {
  const apiData = await mongoFetch('/fleet');
  if (apiData) {
    setLocal('fleet', apiData);
    return apiData;
  }

  const { data } = await supabase.from('vehicles').select('*');
  if (data) {
    setLocal('fleet', data);
    return data;
  }

  return getLocal('fleet', []);
};

export const dbFetchDrivers = async (): Promise<Driver[]> => {
  const apiData = await mongoFetch('/drivers');
  if (apiData) {
    setLocal('drivers', apiData);
    return apiData;
  }

  const { data } = await supabase.from('drivers').select('*');
  if (data) {
    setLocal('drivers', data);
    return data;
  }

  return getLocal('drivers', []);
};

export const dbFetchSchedules = async (): Promise<TransportSchedule[]> => {
  const apiData = await mongoFetch('/schedules');
  if (apiData) {
    setLocal('schedules', apiData);
    return apiData;
  }

  const { data } = await supabase.from('trips').select('*');
  if (data) {
    setLocal('schedules', data);
    return data;
  }

  return getLocal('schedules', []);
};

// Finance
export const dbFetchFinancialReports = async (): Promise<CommissionFinancialReport[]> => {
  const apiData = await mongoFetch('/financial-reports');
  if (apiData) {
    setLocal('financial_reports', apiData);
    return apiData;
  }

  const { data } = await supabase.from('financial_reports').select('*');
  if (data) {
    setLocal('financial_reports', data);
    return data;
  }

  return getLocal('financial_reports', []);
};

export const dbAddFinancialReport = async (report: Partial<CommissionFinancialReport>) => {
  const apiData = await mongoFetch('/financial-reports', {
    method: 'POST',
    body: JSON.stringify(report)
  });

  if (apiData) return apiData;

  const { data, error } = await supabase.from('financial_reports').insert([report]).select().single();
  if (error) throw error;
  return data;
};

export const dbUpdateFinancialReport = async (id: string, updates: Partial<CommissionFinancialReport>) => {
  const apiData = await mongoFetch(`/financial-reports/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates)
  });

  if (apiData) return apiData;

  const { data, error } = await supabase.from('financial_reports').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const dbFetchBudgetRequests = async (): Promise<BudgetRequest[]> => {
  const apiData = await mongoFetch('/budget-requests');
  if (apiData) {
    setLocal('budget_requests', apiData);
    return apiData;
  }

  const { data } = await supabase.from('budget_requests').select('*');
  if (data) {
    setLocal('budget_requests', data);
    return data;
  }

  return getLocal('budget_requests', []);
};

export const dbAddBudgetRequest = async (request: Partial<BudgetRequest>) => {
  const apiData = await mongoFetch('/budget-requests', {
    method: 'POST',
    body: JSON.stringify(request)
  });

  if (apiData) return apiData;

  const { data, error } = await supabase.from('budget_requests').insert([request]).select().single();
  if (error) throw error;
  return data;
};

export const dbUpdateBudgetRequest = async (id: string, updates: Partial<BudgetRequest>) => {
  const apiData = await mongoFetch(`/budget-requests/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates)
  });

  if (apiData) return apiData;

  const { data, error } = await supabase.from('budget_requests').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

// Culture
export const dbFetchCulturalActivities = async (): Promise<CulturalActivity[]> => {
  const apiData = await mongoFetch('/cultural-activities');
  if (apiData) return apiData;

  const { data } = await supabase.from('cultural_activities').select('*');
  if (data) return data;

  return getLocal('cultural_activities', SEED_CULTURAL_ACTIVITIES);
};

export const dbFetchLibraryResources = async (): Promise<LibraryResource[]> => {
  const apiData = await mongoFetch('/library-resources');
  if (apiData) return apiData;

  const { data } = await supabase.from('library_resources').select('*');
  if (data) return data;

  return getLocal('library_resources', SEED_LIBRARY);
};

export const dbFetchKhassaideModules = async (): Promise<KhassaideModule[]> => {
  const apiData = await mongoFetch('/khassaide-modules');
  if (apiData) return apiData;

  const { data } = await supabase.from('khassaide_modules').select('*');
  if (data) return data;

  return getLocal('khassaide_modules', SEED_KHASSAIDE_MODULES);
};

// Stubs pour maintenir la compatibilité DataContext
export const dbFetchAdiyaCampaigns = async () => getLocal('adiya', []);
export const dbFetchTickets = async () => {
  const apiData = await mongoFetch('/tickets');
  if (apiData) {
    setLocal('tickets', apiData);
    return apiData;
  }

  const { data } = await supabase.from('tickets').select('*').order('created_at', { ascending: false });
  if (data) {
    setLocal('tickets', data);
    return data;
  }

  return getLocal('tickets', []);
};
export const dbFetchInventory = async () => getLocal('inventory', []);
export const dbFetchResources = async () => getLocal('resources', []);
export const dbFetchSocialCases = async () => getLocal('social_cases', []);
export const dbFetchSocialProjects = async () => getLocal('social_projects', []);
export const dbFetchPartners = async () => getLocal('partners', []);
export const dbFetchSocialPosts = async () => getLocal('social_posts', []);
export const dbFetchStudyGroups = async () => getLocal('study_groups', []);
