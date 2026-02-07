
import { CommissionType, Commission, Member, Event, Contribution, InternalMeetingReport, Vehicle, TransportSchedule, Driver, CulturalActivity, LibraryResource, KhassaideModule, CommissionFinancialReport, BudgetRequest, AdiyaCampaign, FundraisingEvent } from './types';

// --- SYSTEM HEALTH CONSTANTS ---
export const APP_VERSION = '2.0.0-supabase'; 
export const SUPABASE_PROJECT_ID = 'qwsivjyohprhwacjgimc';

// --- CLEANUP : Suppression définitive des Ghosts ---
export const API_URL = ''; 

export const INITIAL_COMMISSIONS: Commission[] = [
  { name: CommissionType.ADMINISTRATION, slug: 'administration', description: 'Gère l\'administration sous la tutelle du SG.', memberCount: 0, dieuwrine: 'Non assigné' },
  { name: CommissionType.ORGANISATION, slug: 'organisation', description: 'Pilote les manifestations et la logistique.', memberCount: 0, dieuwrine: 'Non assigné' },
  { name: CommissionType.FINANCE, slug: 'finance', description: 'Gestion de la trésorerie et des collectes.', memberCount: 0, dieuwrine: 'Non assigné' },
  { name: CommissionType.CULTURELLE, slug: 'culturelle', description: 'Vulgarisation des écrits du Cheikh.', memberCount: 0, dieuwrine: 'Non assigné' },
  { name: CommissionType.SOCIAL, slug: 'social', description: 'Raffermissement des liens et entraide.', memberCount: 0, dieuwrine: 'Non assigné' },
  { name: CommissionType.COMMUNICATION, slug: 'communication', description: 'Rayonnement numérique du Dahira.', memberCount: 0, dieuwrine: 'Non assigné' },
  { name: CommissionType.SANTE, slug: 'sante', description: 'Bien-être physique des membres.', memberCount: 0, dieuwrine: 'Non assigné' },
  { name: CommissionType.RELATIONS_EXT, slug: 'relations-ext', description: 'Interface avec la Fédération.', memberCount: 0, dieuwrine: 'Non assigné' },
  { name: CommissionType.TRANSPORT, slug: 'transport', description: 'Logistique des convois.', memberCount: 0, dieuwrine: 'Non assigné' },
  { name: CommissionType.PEDAGOGIQUE, slug: 'pedagogique', description: 'Encadrement scolaire et universitaire.', memberCount: 0, dieuwrine: 'Non assigné' },
];

export const SEED_MEMBERS: Member[] = [];
export const SEED_EVENTS: Event[] = [];
export const SEED_CONTRIBUTIONS: Contribution[] = [];
export const SEED_REPORTS: InternalMeetingReport[] = [];
export const SEED_BUDGET_REQUESTS: BudgetRequest[] = [];
export const SEED_FINANCIAL_REPORTS: CommissionFinancialReport[] = [];
export const SEED_ADIYA_CAMPAIGNS: AdiyaCampaign[] = [];
export const SEED_FUNDRAISING_EVENTS: FundraisingEvent[] = [];
export const SEED_FLEET: Vehicle[] = [];
export const SEED_SCHEDULES: TransportSchedule[] = [];
export const SEED_DRIVERS: Driver[] = [];
export const SEED_CULTURAL_ACTIVITIES: CulturalActivity[] = [];
export const SEED_LIBRARY: LibraryResource[] = [];
export const SEED_KHASSAIDE_MODULES: KhassaideModule[] = [];
export const MOCK_MEMBERS: Member[] = [];
