
import { Member, Contribution, Event, InternalMeetingReport, CommissionFinancialReport, BudgetRequest, AdiyaCampaign, FundraisingEvent, Task, LibraryResource, Vehicle, Driver, TransportSchedule } from '../types';
import { API_URL } from '../constants';

// --- CONFIGURATION API ---
const BASE_API = `${API_URL}/api`;

// Helper pour les headers avec token JWT
const getHeaders = () => {
  const token = localStorage.getItem('jwt_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
    'ngrok-skip-browser-warning': 'true'
  };
};

// Helper générique pour la réponse
const handleResponse = async (res: Response) => {
  if (res.status === 401) {
    // Optionnel: Redirection login
  }
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || `Erreur API: ${res.status}`);
  }
  return res.json();
};

// --- MEMBERS ---
export const dbFetchMembers = async (): Promise<Member[]> => {
  const res = await fetch(`${BASE_API}/members`, { headers: getHeaders() });
  const json = await handleResponse(res);
  return json.data || [];
};

export const dbCreateMember = async (member: Member) => {
  const res = await fetch(`${BASE_API}/members`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(member)
  });
  return handleResponse(res);
};

export const dbUpdateMember = async (id: string, updates: Partial<Member>) => {
  const res = await fetch(`${BASE_API}/members/${id}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(updates)
  });
  return handleResponse(res);
};

export const dbDeleteMember = async (id: string) => {
  const res = await fetch(`${BASE_API}/members/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return handleResponse(res);
};

// --- FINANCE ---
export const dbFetchContributions = async (): Promise<Contribution[]> => {
  const res = await fetch(`${BASE_API}/finance`, { headers: getHeaders() });
  const json = await handleResponse(res);
  return json.data || [];
};

export const dbCreateContribution = async (contribution: Contribution) => {
  const res = await fetch(`${BASE_API}/finance/pay`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
       memberId: contribution.memberId,
       type: contribution.type,
       amount: contribution.amount,
       eventLabel: contribution.eventLabel,
       date: contribution.date
    })
  });
  return handleResponse(res);
};

// --- EVENTS ---
export const dbFetchEvents = async (): Promise<Event[]> => {
  const res = await fetch(`${BASE_API}/events`, { headers: getHeaders() });
  const json = await handleResponse(res);
  return json.data || [];
};

export const dbCreateEvent = async (event: Event) => {
  const res = await fetch(`${BASE_API}/events`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(event)
  });
  return handleResponse(res);
};

// --- REPORTS ---
export const dbFetchReports = async (): Promise<InternalMeetingReport[]> => {
  const res = await fetch(`${BASE_API}/reports`, { headers: getHeaders() });
  const json = await handleResponse(res);
  return json.data || [];
};

export const dbCreateReport = async (report: InternalMeetingReport) => {
  const res = await fetch(`${BASE_API}/reports`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(report)
  });
  return handleResponse(res);
};

// --- TASKS ---
export const dbFetchTasks = async (): Promise<Task[]> => {
  try {
     const res = await fetch(`${BASE_API}/tasks`, { headers: getHeaders() });
     if(res.ok) {
         const json = await res.json();
         return json.data || [];
     }
  } catch(e) {}
  return [];
};

// --- CAMPAIGNS ---
export const dbFetchAdiyaCampaigns = async (): Promise<AdiyaCampaign[]> => {
    try {
        const res = await fetch(`${BASE_API}/campaigns`, { headers: getHeaders() });
        const json = await res.json();
        return json.data || [];
    } catch(e) { return []; }
};

// --- RESOURCES ---
export const dbFetchResources = async (): Promise<LibraryResource[]> => {
    try {
        const res = await fetch(`${BASE_API}/resources`, { headers: getHeaders() });
        const json = await res.json();
        return json.data || [];
    } catch(e) { return []; }
};

export const dbCreateResource = async (resource: LibraryResource) => {
    const res = await fetch(`${BASE_API}/resources`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(resource)
    });
    return handleResponse(res);
};

// --- TRANSPORT ---
export const dbFetchFleet = async (): Promise<Vehicle[]> => {
    try {
        const res = await fetch(`${BASE_API}/transport/fleet`, { headers: getHeaders() });
        const json = await res.json();
        return json.data || [];
    } catch(e) { return []; }
};

export const dbCreateVehicle = async (vehicle: Vehicle) => {
    const res = await fetch(`${BASE_API}/transport/fleet`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(vehicle)
    });
    return handleResponse(res);
};

export const dbUpdateVehicle = async (id: string, updates: Partial<Vehicle>) => {
    const res = await fetch(`${BASE_API}/transport/fleet/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates)
    });
    return handleResponse(res);
};

export const dbFetchDrivers = async (): Promise<Driver[]> => {
    try {
        const res = await fetch(`${BASE_API}/transport/drivers`, { headers: getHeaders() });
        const json = await res.json();
        return json.data || [];
    } catch(e) { return []; }
};

export const dbCreateDriver = async (driver: Driver) => {
    const res = await fetch(`${BASE_API}/transport/drivers`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(driver)
    });
    return handleResponse(res);
};

export const dbFetchSchedules = async (): Promise<TransportSchedule[]> => {
    try {
        const res = await fetch(`${BASE_API}/transport/trips`, { headers: getHeaders() });
        const json = await res.json();
        return json.data || [];
    } catch(e) { return []; }
};

export const dbCreateSchedule = async (trip: TransportSchedule) => {
    const res = await fetch(`${BASE_API}/transport/trips`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(trip)
    });
    return handleResponse(res);
};

// --- PLACEHOLDERS (Non implémentés Backend) ---
export const dbFetchFinancialReports = async (): Promise<CommissionFinancialReport[]> => [];
export const dbFetchBudgetRequests = async (): Promise<BudgetRequest[]> => [];
export const dbFetchFundraisingEvents = async (): Promise<FundraisingEvent[]> => [];
export const dbUpdateContribution = async (id: string, updates: Partial<Contribution>) => Promise.resolve();
export const dbDeleteContribution = async (id: string) => Promise.resolve();
