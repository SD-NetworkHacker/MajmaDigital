
import { MemberCategory, GlobalRole, CommissionType, Member, Commission, Contribution, Event, InternalMeetingReport, Vehicle, TransportSchedule, Driver, CulturalActivity, LibraryResource, KhassaideModule, CommissionFinancialReport, BudgetRequest, AdiyaCampaign, FundraisingEvent } from './types';

// URL du Backend (Ngrok) - Source unique de vérité
export const API_URL = 'https://ab45-41-82-148-7.ngrok-free.app';

// La structure des commissions est structurelle, on la garde.
export const INITIAL_COMMISSIONS: Commission[] = [
  { 
    name: CommissionType.ADMINISTRATION, 
    slug: 'administration', 
    description: 'Gère l\'administration (adhésions, infos, présence) sous la tutelle du Secrétaire Général (Art V-1 RI).', 
    memberCount: 12, 
    dieuwrine: 'Sidy Sow' 
  },
  { 
    name: CommissionType.ORGANISATION, 
    slug: 'organisation', 
    description: 'Pilote les manifestations, déplacements, la restauration, la collation et l\'hygiène (Art V-2 RI).', 
    memberCount: 45, 
    dieuwrine: 'Moussa Diop' 
  },
  { 
    name: CommissionType.FINANCE, 
    slug: 'finance', 
    description: 'Gestion de la trésorerie, collecte du Sass, du Gott et financement des activités (Art V-3 RI).', 
    memberCount: 8, 
    dieuwrine: 'Fatou Ndiaye' 
  },
  { 
    name: CommissionType.CULTURELLE, 
    slug: 'culturelle', 
    description: 'Vulgarisation des écrits du Cheikh, enseignement religieux et déclamation des Xassidas (Art V-4 RI).', 
    memberCount: 30, 
    dieuwrine: 'Amadou Bamba' 
  },
  { 
    name: CommissionType.SOCIAL, 
    slug: 'social', 
    description: 'Raffermissement des liens, entraide et assistance aux membres en difficulté (Art V-5 RI).', 
    memberCount: 25, 
    dieuwrine: 'Aissatou Diallo' 
  },
  { 
    name: CommissionType.COMMUNICATION, 
    slug: 'communication', 
    description: 'Rayonnement numérique du Dahira et gestion des canaux d\'information.', 
    memberCount: 15, 
    dieuwrine: 'Oumar Fall' 
  },
  { 
    name: CommissionType.SANTE, 
    slug: 'sante', 
    description: 'Bien-être physique des membres et couverture médicale lors des événements.', 
    memberCount: 10, 
    dieuwrine: 'Dr. Sylla' 
  },
  { 
    name: CommissionType.RELATIONS_EXT, 
    slug: 'relations-ext', 
    description: 'Interface avec la Fédération et les autres Dahiras.', 
    memberCount: 5, 
    dieuwrine: 'El Hadj Malick' 
  },
  { 
    name: CommissionType.TRANSPORT, 
    slug: 'transport', 
    description: 'Logistique des convois (Magal, Ziar) et gestion du parc automobile.', 
    memberCount: 12, 
    dieuwrine: 'Cheikh Lo' 
  },
  { 
    name: CommissionType.PEDAGOGIQUE, 
    slug: 'pedagogique', 
    description: 'Encadrement scolaire et universitaire des secteurs Élèves et Étudiants.', 
    memberCount: 20, 
    dieuwrine: 'Pr. Touré' 
  },
];

// --- DONNÉES DE SIMULATION (SEED) ---
// Ces données servent de fallback si le backend est vide au démarrage
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
export const MOCK_MEMBERS = SEED_MEMBERS;
