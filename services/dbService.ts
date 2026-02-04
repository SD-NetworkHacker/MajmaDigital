
import { Member, Contribution, Event, InternalMeetingReport, CommissionFinancialReport, BudgetRequest, AdiyaCampaign, FundraisingEvent, Task, LibraryResource } from '../types';
import { SEED_MEMBERS, SEED_CONTRIBUTIONS, SEED_EVENTS, SEED_REPORTS, SEED_BUDGET_REQUESTS, SEED_FINANCIAL_REPORTS, SEED_ADIYA_CAMPAIGNS, SEED_FUNDRAISING_EVENTS, SEED_LIBRARY, API_URL } from '../constants';

const SEED_TASKS: Task[] = []; 

// --- CONFIGURATION API ---
const BASE_API = `${API_URL}/api`;

let isApiOnline = true; 

// --- LOCAL STORAGE HELPERS (FALLBACK) ---
const getLocal = <T>(key: string, seed: T): T => {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : seed;
    } catch { return seed; }
};

const setLocal = (key: string, data: any) => {
    try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
};

// --- API FETCH WRAPPER ---
async function mongoFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
    if (!isApiOnline) return null;

    try {
        const token = localStorage.getItem('jwt_token');
        const headers: HeadersInit = { 
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
        };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

        const res = await fetch(`${BASE_API}${endpoint}`, { 
            headers, 
            signal: controller.signal,
            ...options 
        });
        
        clearTimeout(timeoutId);

        if (!res.ok) {
           if (res.status === 401) {
               // Token expiré ou invalide
               console.warn("Session expirée");
           }
           return null; 
        }
        
        const json = await res.json();
        return json.data !== undefined ? json.data : json;
    } catch (e) {
        console.warn(`Erreur API (${endpoint}):`, e);
        return null;
    }
}

// --- MEMBERS ---
export const dbFetchMembers = async (): Promise<Member[]> => {
    const apiData = await mongoFetch<Member[]>('/members');
    if (apiData) return apiData.map((m: any) => ({ ...m, id: m._id }));
    return getLocal('MAJMA_MEMBERS', SEED_MEMBERS);
};

export const dbCreateMember = async (member: Member) => {
    await mongoFetch('/members', { method: 'POST', body: JSON.stringify(member) });
    // Optimistic Update local
    const current = getLocal<Member[]>('MAJMA_MEMBERS', SEED_MEMBERS);
    setLocal('MAJMA_MEMBERS', [member, ...current]);
};

export const dbUpdateMember = async (id: string, updates: Partial<Member>) => {
    await mongoFetch(`/members/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
    const current = getLocal<Member[]>('MAJMA_MEMBERS', SEED_MEMBERS);
    setLocal('MAJMA_MEMBERS', current.map(m => m.id === id ? { ...m, ...updates } : m));
};

export const dbDeleteMember = async (id: string) => {
    await mongoFetch(`/members/${id}`, { method: 'DELETE' });
    const current = getLocal<Member[]>('MAJMA_MEMBERS', SEED_MEMBERS);
    setLocal('MAJMA_MEMBERS', current.filter(m => m.id !== id));
};

// --- FINANCE ---
export const dbFetchContributions = async (): Promise<Contribution[]> => {
    const apiData = await mongoFetch<Contribution[]>('/finance');
    if (apiData) return apiData.map((c: any) => ({ ...c, id: c._id, memberId: c.member?._id || c.member }));
    return getLocal('MAJMA_CONTRIBUTIONS', SEED_CONTRIBUTIONS);
};

export const dbCreateContribution = async (contribution: Contribution) => {
    await mongoFetch('/finance/pay', { method: 'POST', body: JSON.stringify({
        memberId: contribution.memberId,
        type: contribution.type,
        amount: contribution.amount,
        eventLabel: contribution.eventLabel,
        date: contribution.date
    })});
    const current = getLocal<Contribution[]>('MAJMA_CONTRIBUTIONS', SEED_CONTRIBUTIONS);
    setLocal('MAJMA_CONTRIBUTIONS', [contribution, ...current]);
};

export const dbUpdateContribution = async (id: string, updates: Partial<Contribution>) => {
    // Note: L'update finance est sensible, souvent géré côté serveur uniquement pour la sécurité
    const current = getLocal<Contribution[]>('MAJMA_CONTRIBUTIONS', SEED_CONTRIBUTIONS);
    setLocal('MAJMA_CONTRIBUTIONS', current.map(c => c.id === id ? { ...c, ...updates } : c));
};

export const dbDeleteContribution = async (id: string) => {
    const current = getLocal<Contribution[]>('MAJMA_CONTRIBUTIONS', SEED_CONTRIBUTIONS);
    setLocal('MAJMA_CONTRIBUTIONS', current.filter(c => c.id !== id));
};

// --- EVENTS ---
export const dbFetchEvents = async (): Promise<Event[]> => {
    const apiData = await mongoFetch<Event[]>('/events');
    if (apiData) return apiData.map((e: any) => ({ ...e, id: e._id }));
    return getLocal('MAJMA_EVENTS', SEED_EVENTS);
};

export const dbCreateEvent = async (event: Event) => {
    await mongoFetch('/events', { method: 'POST', body: JSON.stringify(event) });
    const current = getLocal<Event[]>('MAJMA_EVENTS', SEED_EVENTS);
    setLocal('MAJMA_EVENTS', [event, ...current]);
};

// --- REPORTS ---
export const dbFetchReports = async (): Promise<InternalMeetingReport[]> => {
    const apiData = await mongoFetch<InternalMeetingReport[]>('/reports');
    if (apiData) return apiData.map((r: any) => ({ ...r, id: r._id }));
    return getLocal('MAJMA_REPORTS', SEED_REPORTS);
};

export const dbCreateReport = async (report: InternalMeetingReport) => {
    await mongoFetch('/reports', { method: 'POST', body: JSON.stringify(report) });
    const current = getLocal<InternalMeetingReport[]>('MAJMA_REPORTS', SEED_REPORTS);
    setLocal('MAJMA_REPORTS', [report, ...current]);
};

// --- TASKS ---
export const dbFetchTasks = async (): Promise<Task[]> => {
    const apiData = await mongoFetch<Task[]>('/tasks');
    if (apiData) return apiData.map((t: any) => ({ ...t, id: t._id }));
    return getLocal('MAJMA_TASKS', SEED_TASKS);
};

export const dbCreateTask = async (task: Task) => {
    await mongoFetch('/tasks', { method: 'POST', body: JSON.stringify(task) });
    const current = getLocal<Task[]>('MAJMA_TASKS', SEED_TASKS);
    setLocal('MAJMA_TASKS', [task, ...current]);
};

export const dbUpdateTask = async (id: string, updates: Partial<Task>) => {
    await mongoFetch(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
    const current = getLocal<Task[]>('MAJMA_TASKS', SEED_TASKS);
    setLocal('MAJMA_TASKS', current.map(t => t.id === id ? { ...t, ...updates } : t));
};

export const dbDeleteTask = async (id: string) => {
    await mongoFetch(`/tasks/${id}`, { method: 'DELETE' });
    const current = getLocal<Task[]>('MAJMA_TASKS', SEED_TASKS);
    setLocal('MAJMA_TASKS', current.filter(t => t.id !== id));
};

// --- ADIYA CAMPAIGNS ---
export const dbFetchAdiyaCampaigns = async (): Promise<AdiyaCampaign[]> => {
    const apiData = await mongoFetch<AdiyaCampaign[]>('/campaigns');
    if (apiData) return apiData.map((c: any) => ({ ...c, id: c._id }));
    return getLocal('MAJMA_CAMPAIGNS', SEED_ADIYA_CAMPAIGNS);
};

export const dbCreateAdiyaCampaign = async (campaign: AdiyaCampaign) => {
    await mongoFetch('/campaigns', { method: 'POST', body: JSON.stringify(campaign) });
    const current = getLocal<AdiyaCampaign[]>('MAJMA_CAMPAIGNS', SEED_ADIYA_CAMPAIGNS);
    setLocal('MAJMA_CAMPAIGNS', [campaign, ...current]);
};

export const dbUpdateAdiyaCampaign = async (id: string, updates: Partial<AdiyaCampaign>) => {
    await mongoFetch(`/campaigns/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
    const current = getLocal<AdiyaCampaign[]>('MAJMA_CAMPAIGNS', SEED_ADIYA_CAMPAIGNS);
    setLocal('MAJMA_CAMPAIGNS', current.map(c => c.id === id ? { ...c, ...updates } : c));
};

// --- LIBRARY RESOURCES ---
export const dbFetchResources = async (): Promise<LibraryResource[]> => {
    const apiData = await mongoFetch<LibraryResource[]>('/resources');
    if (apiData) return apiData.map((r: any) => ({ ...r, id: r._id }));
    return getLocal('MAJMA_RESOURCES', SEED_LIBRARY);
};

// --- LOCAL ONLY (Pour l'instant, pas de routes backend dédiées) ---
export const dbFetchFinancialReports = async (): Promise<CommissionFinancialReport[]> => getLocal('MAJMA_FIN_REPORTS', SEED_FINANCIAL_REPORTS);
export const dbCreateFinancialReport = async (report: CommissionFinancialReport) => {
    const current = getLocal<CommissionFinancialReport[]>('MAJMA_FIN_REPORTS', SEED_FINANCIAL_REPORTS);
    setLocal('MAJMA_FIN_REPORTS', [report, ...current]);
};

export const dbFetchBudgetRequests = async (): Promise<BudgetRequest[]> => getLocal('MAJMA_BUDGET_REQS', SEED_BUDGET_REQUESTS);
export const dbCreateBudgetRequest = async (request: BudgetRequest) => {
    const current = getLocal<BudgetRequest[]>('MAJMA_BUDGET_REQS', SEED_BUDGET_REQUESTS);
    setLocal('MAJMA_BUDGET_REQS', [request, ...current]);
};

export const dbFetchFundraisingEvents = async (): Promise<FundraisingEvent[]> => getLocal('MAJMA_FUNDRAISING', SEED_FUNDRAISING_EVENTS);
export const dbCreateFundraisingEvent = async (event: FundraisingEvent) => {
    const current = getLocal<FundraisingEvent[]>('MAJMA_FUNDRAISING', SEED_FUNDRAISING_EVENTS);
    setLocal('MAJMA_FUNDRAISING', [event, ...current]);
};
export const dbUpdateFundraisingEvent = async (id: string, updates: Partial<FundraisingEvent>) => {
    const current = getLocal<FundraisingEvent[]>('MAJMA_FUNDRAISING', SEED_FUNDRAISING_EVENTS);
    setLocal('MAJMA_FUNDRAISING', current.map(e => e.id === id ? { ...e, ...updates } : e));
};
