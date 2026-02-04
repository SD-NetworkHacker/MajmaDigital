
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
    // Gérer l'expiration du token si nécessaire
    // localStorage.removeItem('jwt_token');
    // window.location.href = '/'; 
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
export const dbCreateTask = async (task: Task) => {
    try {
        const res = await fetch(`${BASE_API}/tasks`, { 
            method: 'POST', 
            headers: getHeaders(),
            body: JSON.stringify(task)
        });
        return handleResponse(res);
    } catch(e) { return null; }
};

export const dbUpdateTask = async (id: string, updates: Partial<Task>) => {
    try {
        const res = await fetch(`${BASE_API}/tasks/${id}`, { 
            method: 'PUT', 
            headers: getHeaders(),
            body: JSON.stringify(updates)
        });
        return handleResponse(res);
    } catch(e) { return null; }
};

export const dbDeleteTask = async (id: string) => {
    try {
        const res = await fetch(`${BASE_API}/tasks/${id}`, { 
            method: 'DELETE', 
            headers: getHeaders()
        });
        return handleResponse(res);
    } catch(e) { return null; }
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

// --- TRANSPORT (Si endpoints dispos, sinon tableau vide pour éviter crash) ---
export const dbFetchFleet = async (): Promise<Vehicle[]> => [];
export const dbFetchDrivers = async (): Promise<Driver[]> => [];
export const dbFetchSchedules = async (): Promise<TransportSchedule[]> => [];

// --- PLACEHOLDERS ---
export const dbFetchFinancialReports = async (): Promise<CommissionFinancialReport[]> => [];
export const dbFetchBudgetRequests = async (): Promise<BudgetRequest[]> => [];
export const dbFetchFundraisingEvents = async (): Promise<FundraisingEvent[]> => [];
export const dbUpdateContribution = async (id: string, updates: Partial<Contribution>) => Promise.resolve();
export const dbDeleteContribution = async (id: string) => Promise.resolve();
