
import { Member, Contribution, Event, InternalMeetingReport, CommissionFinancialReport, BudgetRequest, AdiyaCampaign, FundraisingEvent, Task, LibraryResource } from '../types';
import { API_URL } from '../constants';

// --- CONFIGURATION API ---
const BASE_API = `${API_URL}/api`;

// --- API FETCH WRAPPER ---
async function mongoFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('jwt_token');
    const headers: HeadersInit = { 
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
        const res = await fetch(`${BASE_API}${endpoint}`, { 
            headers, 
            ...options 
        });

        if (!res.ok) {
           const errorBody = await res.json();
           throw new Error(errorBody.message || `Erreur API: ${res.status}`);
        }
        
        const json = await res.json();
        // Support pour les réponses enveloppées dans { data: ... } ou directes
        return json.data !== undefined ? json.data : json;
    } catch (e: any) {
        console.error(`❌ API Error (${endpoint}):`, e.message);
        throw e; // On propage l'erreur pour que l'UI puisse l'afficher
    }
}

// --- MEMBERS ---
export const dbFetchMembers = async (): Promise<Member[]> => {
    return await mongoFetch<Member[]>('/members');
};

export const dbCreateMember = async (member: Member) => {
    return await mongoFetch('/members', { method: 'POST', body: JSON.stringify(member) });
};

export const dbUpdateMember = async (id: string, updates: Partial<Member>) => {
    // Utilisation de PATCH pour la modification partielle (Promotion, etc.)
    return await mongoFetch(`/members/${id}`, { method: 'PATCH', body: JSON.stringify(updates) });
};

export const dbDeleteMember = async (id: string) => {
    return await mongoFetch(`/members/${id}`, { method: 'DELETE' });
};

// --- FINANCE ---
export const dbFetchContributions = async (): Promise<Contribution[]> => {
    return await mongoFetch<Contribution[]>('/finance');
};

export const dbCreateContribution = async (contribution: Contribution) => {
    return await mongoFetch('/finance/pay', { method: 'POST', body: JSON.stringify({
        memberId: contribution.memberId,
        type: contribution.type,
        amount: contribution.amount,
        eventLabel: contribution.eventLabel,
        date: contribution.date
    })});
};

export const dbUpdateContribution = async (id: string, updates: Partial<Contribution>) => {
    return await mongoFetch(`/finance/${id}`, { method: 'PATCH', body: JSON.stringify(updates) });
};

export const dbDeleteContribution = async (id: string) => {
    return await mongoFetch(`/finance/${id}`, { method: 'DELETE' });
};

// --- EVENTS ---
export const dbFetchEvents = async (): Promise<Event[]> => {
    return await mongoFetch<Event[]>('/events');
};

export const dbCreateEvent = async (event: Event) => {
    return await mongoFetch('/events', { method: 'POST', body: JSON.stringify(event) });
};

// --- REPORTS ---
export const dbFetchReports = async (): Promise<InternalMeetingReport[]> => {
    return await mongoFetch<InternalMeetingReport[]>('/reports');
};

export const dbCreateReport = async (report: InternalMeetingReport) => {
    return await mongoFetch('/reports', { method: 'POST', body: JSON.stringify(report) });
};

// --- TASKS ---
export const dbFetchTasks = async (): Promise<Task[]> => {
    return await mongoFetch<Task[]>('/tasks');
};

export const dbCreateTask = async (task: Task) => {
    return await mongoFetch('/tasks', { method: 'POST', body: JSON.stringify(task) });
};

// --- CAMPAIGNS ---
export const dbFetchAdiyaCampaigns = async (): Promise<AdiyaCampaign[]> => {
    return await mongoFetch<AdiyaCampaign[]>('/campaigns');
};

// --- RESOURCES ---
export const dbFetchResources = async (): Promise<LibraryResource[]> => {
    return await mongoFetch<LibraryResource[]>('/resources');
};

// --- PLACEHOLDERS (En attente d'implémentation backend) ---
export const dbFetchFinancialReports = async (): Promise<CommissionFinancialReport[]> => [];
export const dbFetchBudgetRequests = async (): Promise<BudgetRequest[]> => [];
export const dbFetchFundraisingEvents = async (): Promise<FundraisingEvent[]> => [];
