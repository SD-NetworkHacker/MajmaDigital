
import { Member, Contribution, Event, Task, CommissionFinancialReport, BudgetRequest, InternalMeetingReport, Vehicle, Driver, TransportSchedule, CulturalActivity, LibraryResource, KhassaideModule, AdiyaCampaign, FundraisingEvent, TicketItem } from '../types';
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

const mapAdiyaCampaign = (c: any): AdiyaCampaign => ({
  id: c.id || c._id,
  title: c.title,
  unitAmount: Number(c.unit_amount || c.unitAmount || 0),
  targetAmount: c.target_amount || c.targetAmount ? Number(c.target_amount || c.targetAmount) : undefined,
  deadline: c.deadline,
  status: c.status || 'open',
  participants: c.participants || [],
  createdBy: c.created_by || c.createdBy,
  description: c.description || ''
});

const mapTicket = (t: any): TicketItem => ({
  id: t.id,
  memberId: t.member_id || t.memberId,
  passenger: t.passenger,
  phone: t.phone,
  trip: t.trip,
  tripId: t.trip_id || t.tripId,
  seat: t.seat,
  status: t.status,
  type: t.type,
  amount: Number(t.amount),
  date: t.date
});

const mapVehicle = (v: any): Vehicle => ({
  id: v.id || v._id,
  type: v.type,
  capacity: Number(v.capacity),
  registrationNumber: v.registration_number || v.registrationNumber,
  status: v.status,
  features: v.features || [],
  ownership: v.ownership || 'internal',
  maintenance: v.maintenance || {
    lastDate: new Date().toISOString().split('T')[0],
    nextDate: new Date().toISOString().split('T')[0],
    status: 'ok'
  },
  externalDetails: v.external_details || v.externalDetails
});

const mapDriver = (d: any): Driver => ({
  id: d.id || d._id,
  memberId: d.member_id || d.memberId,
  name: d.name,
  licenseType: d.license_type || d.licenseType,
  status: d.status,
  phone: d.phone,
  tripsCompleted: Number(d.trips_completed || d.tripsCompleted || 0)
});

const mapSchedule = (s: any): TransportSchedule => ({
  id: s.id || s._id,
  eventId: s.event_id || s.eventId,
  eventTitle: s.event_title || s.eventTitle,
  departureDate: s.departure_date || s.departureDate,
  departureTime: s.departure_time || s.departureTime,
  origin: s.origin,
  destination: s.destination,
  stops: s.stops || [],
  assignedVehicleId: s.assigned_vehicle_id || s.assignedVehicleId,
  driverId: s.driver_id || s.driverId,
  status: s.status,
  seatsFilled: Number(s.seats_filled || s.seatsFilled || 0),
  totalCapacity: Number(s.total_capacity || s.totalCapacity || 0)
});

const mapFundraisingEvent = (e: any): FundraisingEvent => ({
  id: e.id,
  name: e.name,
  type: e.type,
  status: e.status,
  deadline: e.deadline,
  groups: e.groups || [],
  createdAt: e.created_at || e.createdAt
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

export const dbAddTicket = async (t: Partial<TicketItem>) => {
  const apiData = await mongoFetch('/tickets', {
    method: 'POST',
    body: JSON.stringify(t)
  });

  if (apiData) return mapTicket(apiData);

  const { data, error } = await supabase.from('tickets').insert([{
    member_id: t.memberId,
    passenger: t.passenger,
    phone: t.phone,
    trip: t.trip,
    trip_id: t.tripId,
    amount: t.amount,
    date: t.date,
    status: t.status || 'payé',
    type: t.type || 'Aller-Retour'
  }]).select().single();
  
  if (error) throw error;
  return mapTicket(data);
};

export const dbUpdateTicket = async (id: string, updates: Partial<TicketItem>) => {
  const apiData = await mongoFetch(`/tickets/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates)
  });

  if (apiData) return mapTicket(apiData);

  const dbUpdates: any = { ...updates };
  if (updates.memberId !== undefined) {
    dbUpdates.member_id = updates.memberId;
    delete dbUpdates.memberId;
  }
  if (updates.tripId !== undefined) {
    dbUpdates.trip_id = updates.tripId;
    delete dbUpdates.tripId;
  }

  const { data, error } = await supabase.from('tickets').update(dbUpdates).eq('id', id).select().single();
  if (error) throw error;
  return mapTicket(data);
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
    const fleet = apiData.map(mapVehicle);
    setLocal('fleet', fleet);
    return fleet;
  }

  const { data } = await supabase.from('vehicles').select('*');
  if (data) {
    const fleet = data.map(mapVehicle);
    setLocal('fleet', fleet);
    return fleet;
  }

  return getLocal('fleet', []);
};

export const dbAddVehicle = async (v: Partial<Vehicle>) => {
  const apiData = await mongoFetch('/fleet', {
    method: 'POST',
    body: JSON.stringify(v)
  });

  if (apiData) return mapVehicle(apiData);

  const { data, error } = await supabase.from('vehicles').insert([{
    type: v.type,
    capacity: v.capacity,
    registration_number: v.registrationNumber,
    status: v.status || 'disponible',
    features: v.features || [],
    ownership: v.ownership || 'internal',
    maintenance: v.maintenance,
    external_details: v.externalDetails
  }]).select().single();
  
  if (error) throw error;
  return mapVehicle(data);
};

export const dbUpdateVehicleStatus = async (id: string, status: string) => {
  const apiData = await mongoFetch(`/fleet/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });

  if (apiData) return mapVehicle(apiData);

  const { data, error } = await supabase.from('vehicles').update({ status }).eq('id', id).select().single();
  if (error) throw error;
  return mapVehicle(data);
};

export const dbDeleteVehicle = async (id: string) => {
  const apiData = await mongoFetch(`/fleet/${id}`, {
    method: 'DELETE'
  });

  if (apiData) return true;

  const { error } = await supabase.from('vehicles').delete().eq('id', id);
  if (error) throw error;
  return true;
};

export const dbFetchDrivers = async (): Promise<Driver[]> => {
  const apiData = await mongoFetch('/drivers');
  if (apiData) {
    const drivers = apiData.map(mapDriver);
    setLocal('drivers', drivers);
    return drivers;
  }

  const { data } = await supabase.from('drivers').select('*');
  if (data) {
    const drivers = data.map(mapDriver);
    setLocal('drivers', drivers);
    return drivers;
  }

  return getLocal('drivers', []);
};

export const dbAddDriver = async (d: Partial<Driver>) => {
  const apiData = await mongoFetch('/drivers', {
    method: 'POST',
    body: JSON.stringify(d)
  });

  if (apiData) return mapDriver(apiData);

  const { data, error } = await supabase.from('drivers').insert([{
    member_id: d.memberId,
    name: d.name,
    license_type: d.licenseType,
    status: d.status || 'disponible',
    phone: d.phone,
    trips_completed: d.tripsCompleted || 0
  }]).select().single();
  
  if (error) throw error;
  return mapDriver(data);
};

export const dbUpdateDriver = async (id: string, updates: Partial<Driver>) => {
  const apiData = await mongoFetch(`/drivers/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates)
  });

  if (apiData) return mapDriver(apiData);

  const dbUpdates: any = { ...updates };
  if (updates.licenseType) {
    dbUpdates.license_type = updates.licenseType;
    delete dbUpdates.licenseType;
  }
  if (updates.tripsCompleted !== undefined) {
    dbUpdates.trips_completed = updates.tripsCompleted;
    delete dbUpdates.tripsCompleted;
  }

  const { data, error } = await supabase.from('drivers').update(dbUpdates).eq('id', id).select().single();
  if (error) throw error;
  return mapDriver(data);
};

export const dbDeleteDriver = async (id: string) => {
  const apiData = await mongoFetch(`/drivers/${id}`, {
    method: 'DELETE'
  });

  if (apiData) return true;

  const { error } = await supabase.from('drivers').delete().eq('id', id);
  if (error) throw error;
  return true;
};

export const dbFetchSchedules = async (): Promise<TransportSchedule[]> => {
  const apiData = await mongoFetch('/schedules');
  if (apiData) {
    const schedules = apiData.map(mapSchedule);
    setLocal('schedules', schedules);
    return schedules;
  }

  const { data } = await supabase.from('trips').select('*');
  if (data) {
    const schedules = data.map(mapSchedule);
    setLocal('schedules', schedules);
    return schedules;
  }

  return getLocal('schedules', []);
};

export const dbAddSchedule = async (s: Partial<TransportSchedule>) => {
  const apiData = await mongoFetch('/schedules', {
    method: 'POST',
    body: JSON.stringify(s)
  });

  if (apiData) return mapSchedule(apiData);

  const { data, error } = await supabase.from('trips').insert([{
    event_id: s.eventId,
    event_title: s.eventTitle,
    departure_date: s.departureDate,
    departure_time: s.departureTime,
    origin: s.origin,
    destination: s.destination,
    stops: s.stops,
    assigned_vehicle_id: s.assignedVehicleId,
    driver_id: s.driverId,
    status: s.status || 'planifie',
    seats_filled: s.seatsFilled || 0,
    total_capacity: s.totalCapacity
  }]).select().single();
  
  if (error) throw error;
  return mapSchedule(data);
};

export const dbUpdateSchedule = async (id: string, updates: Partial<TransportSchedule>) => {
  const apiData = await mongoFetch(`/schedules/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates)
  });

  if (apiData) return mapSchedule(apiData);

  const dbUpdates: any = { ...updates };
  if (updates.eventId) {
    dbUpdates.event_id = updates.eventId;
    delete dbUpdates.eventId;
  }
  if (updates.eventTitle) {
    dbUpdates.event_title = updates.eventTitle;
    delete dbUpdates.eventTitle;
  }
  if (updates.departureDate) {
    dbUpdates.departure_date = updates.departureDate;
    delete dbUpdates.departureDate;
  }
  if (updates.departureTime) {
    dbUpdates.departure_time = updates.departureTime;
    delete dbUpdates.departureTime;
  }
  if (updates.assignedVehicleId) {
    dbUpdates.assigned_vehicle_id = updates.assignedVehicleId;
    delete dbUpdates.assignedVehicleId;
  }
  if (updates.driverId) {
    dbUpdates.driver_id = updates.driverId;
    delete dbUpdates.driverId;
  }
  if (updates.seatsFilled !== undefined) {
    dbUpdates.seats_filled = updates.seatsFilled;
    delete dbUpdates.seatsFilled;
  }
  if (updates.totalCapacity !== undefined) {
    dbUpdates.total_capacity = updates.totalCapacity;
    delete dbUpdates.totalCapacity;
  }

  const { data, error } = await supabase.from('trips').update(dbUpdates).eq('id', id).select().single();
  if (error) throw error;
  return mapSchedule(data);
};

export const dbDeleteSchedule = async (id: string) => {
  const apiData = await mongoFetch(`/schedules/${id}`, {
    method: 'DELETE'
  });

  if (apiData) return true;

  const { error } = await supabase.from('trips').delete().eq('id', id);
  if (error) throw error;
  return true;
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

// Finance
export const dbFetchAdiyaCampaigns = async (): Promise<AdiyaCampaign[]> => {
  const apiData = await mongoFetch('/adiya-campaigns');
  if (apiData) {
    const campaigns = apiData.map(mapAdiyaCampaign);
    setLocal('adiya_campaigns', campaigns);
    return campaigns;
  }

  const { data } = await supabase.from('adiya_campaigns').select('*');
  if (data) {
    const campaigns = data.map(mapAdiyaCampaign);
    setLocal('adiya_campaigns', campaigns);
    return campaigns;
  }

  return getLocal('adiya_campaigns', []);
};

export const dbAddAdiyaCampaign = async (campaign: Partial<AdiyaCampaign>) => {
  const apiData = await mongoFetch('/adiya-campaigns', {
    method: 'POST',
    body: JSON.stringify(campaign)
  });

  if (apiData) return mapAdiyaCampaign(apiData);

  const { data, error } = await supabase.from('adiya_campaigns').insert([{
    title: campaign.title,
    unit_amount: campaign.unitAmount,
    target_amount: campaign.targetAmount,
    deadline: campaign.deadline,
    status: campaign.status || 'open',
    participants: campaign.participants || [],
    created_by: campaign.createdBy,
    description: campaign.description
  }]).select().single();
  
  if (error) throw error;
  return mapAdiyaCampaign(data);
};

export const dbUpdateAdiyaCampaign = async (id: string, updates: Partial<AdiyaCampaign>) => {
  const apiData = await mongoFetch(`/adiya-campaigns/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates)
  });

  if (apiData) return mapAdiyaCampaign(apiData);

  const dbUpdates: any = { ...updates };
  if (updates.unitAmount !== undefined) {
    dbUpdates.unit_amount = updates.unitAmount;
    delete dbUpdates.unitAmount;
  }
  if (updates.targetAmount !== undefined) {
    dbUpdates.target_amount = updates.targetAmount;
    delete dbUpdates.targetAmount;
  }
  if (updates.createdBy !== undefined) {
    dbUpdates.created_by = updates.createdBy;
    delete dbUpdates.createdBy;
  }

  const { data, error } = await supabase.from('adiya_campaigns').update(dbUpdates).eq('id', id).select().single();
  if (error) throw error;
  return mapAdiyaCampaign(data);
};

export const dbFetchFundraisingEvents = async (): Promise<FundraisingEvent[]> => {
  const apiData = await mongoFetch('/fundraising-events');
  if (apiData) {
    const events = apiData.map(mapFundraisingEvent);
    setLocal('fundraising_events', events);
    return events;
  }

  const { data } = await supabase.from('fundraising_events').select('*');
  if (data) {
    const events = data.map(mapFundraisingEvent);
    setLocal('fundraising_events', events);
    return events;
  }

  return getLocal('fundraising_events', []);
};

export const dbAddFundraisingEvent = async (event: Partial<FundraisingEvent>) => {
  const apiData = await mongoFetch('/fundraising-events', {
    method: 'POST',
    body: JSON.stringify(event)
  });

  if (apiData) return mapFundraisingEvent(apiData);

  const { data, error } = await supabase.from('fundraising_events').insert([{
    name: event.name,
    type: event.type,
    status: event.status || 'active',
    deadline: event.deadline,
    groups: event.groups || []
  }]).select().single();
  
  if (error) throw error;
  return mapFundraisingEvent(data);
};

export const dbUpdateFundraisingEvent = async (id: string, updates: Partial<FundraisingEvent>) => {
  const apiData = await mongoFetch(`/fundraising-events/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates)
  });

  if (apiData) return mapFundraisingEvent(apiData);

  const { data, error } = await supabase.from('fundraising_events').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return mapFundraisingEvent(data);
};

// Stubs pour maintenir la compatibilité DataContext
export const dbFetchAdiyaCampaignsOld = async () => getLocal('adiya', []);
export const dbFetchTickets = async (): Promise<TicketItem[]> => {
  const apiData = await mongoFetch('/tickets');
  if (apiData) {
    const tickets = apiData.map(mapTicket);
    setLocal('tickets', tickets);
    return tickets;
  }

  const { data } = await supabase.from('tickets').select('*').order('date', { ascending: false });
  if (data) {
    const tickets = data.map(mapTicket);
    setLocal('tickets', tickets);
    return tickets;
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
