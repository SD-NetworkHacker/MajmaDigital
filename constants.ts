
import { MemberCategory, GlobalRole, CommissionType, Member, Commission, Contribution, Event, InternalMeetingReport, Vehicle, TransportSchedule, Driver, CulturalActivity, LibraryResource, KhassaideModule, CommissionFinancialReport, BudgetRequest } from './types';

export const INITIAL_COMMISSIONS: Commission[] = [
  { name: CommissionType.COMMUNICATION, slug: 'communication', description: 'Gère les réseaux, médias et publications du Dahira.', memberCount: 0, dieuwrine: '' },
  { name: CommissionType.ADMINISTRATION, slug: 'administration', description: 'Gestion des membres, réunions et coordination.', memberCount: 0, dieuwrine: '' },
  { name: CommissionType.FINANCE, slug: 'finance', description: 'Suivi des cotisations et budget.', memberCount: 0, dieuwrine: '' },
  { name: CommissionType.ORGANISATION, slug: 'organisation', description: 'Logistique et événements.', memberCount: 0, dieuwrine: '' },
  { name: CommissionType.SOCIAL, slug: 'social', description: 'Animation et cohésion sociale.', memberCount: 0, dieuwrine: '' },
  { name: CommissionType.PEDAGOGIQUE, slug: 'pedagogique', description: 'Éducation et formation spirituelle.', memberCount: 0, dieuwrine: '' },
  { name: CommissionType.SANTE, slug: 'sante', description: 'Bien-être et prévention.', memberCount: 0, dieuwrine: '' },
  { name: CommissionType.RELATIONS_EXT, slug: 'relations-ext', description: 'Partenariats et autres Dahiras.', memberCount: 0, dieuwrine: '' },
  { name: CommissionType.TRANSPORT, slug: 'transport', description: 'Logistique de déplacement et gestion parc auto.', memberCount: 0, dieuwrine: '' },
  { name: CommissionType.CULTURELLE, slug: 'culturelle', description: 'Patrimoine, arts et médiathèque.', memberCount: 0, dieuwrine: '' },
];

// --- SEED DATA : DONNÉES INITIALES POUR LE DÉMARRAGE ---

export const SEED_MEMBERS: Member[] = []; // Démarrage à vide pour forcer la création
export const SEED_CONTRIBUTIONS: Contribution[] = [];
export const SEED_EVENTS: Event[] = [];

export const SEED_REPORTS: InternalMeetingReport[] = [
  {
    id: 'RPT-INIT-001',
    commission: CommissionType.ADMINISTRATION,
    title: 'Réunion de Coordination Générale',
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '12:00',
    location: 'Siège Dahira',
    type: 'ordinaire',
    attendees: [],
    agenda: [{ id: '1', title: 'Lancement Digital', duration: 30, presenter: 'SG', notes: '' }],
    discussions: 'Mise en place de la nouvelle plateforme MajmaDigital.',
    decisions: ['Validation du budget IT', 'Formation des membres'],
    actionItems: [],
    status: 'valide_admin',
    createdBy: 'Admin',
    createdAt: new Date().toISOString(),
    confidentiality: 'interne'
  }
];

export const SEED_FINANCIAL_REPORTS: CommissionFinancialReport[] = [];
export const SEED_BUDGET_REQUESTS: BudgetRequest[] = [];

export const SEED_FLEET: Vehicle[] = [
  { id: 'V1', type: 'bus_grand', capacity: 60, registrationNumber: 'DK-2024-AA', status: 'disponible', features: ['Clim'], maintenance: { lastDate: '2024-01-01', nextDate: '2024-06-01', status: 'ok' } },
  { id: 'V2', type: 'minibus', capacity: 15, registrationNumber: 'DK-8899-BB', status: 'en_mission', features: [], maintenance: { lastDate: '2024-02-01', nextDate: '2024-05-01', status: 'warning' } }
];

export const SEED_SCHEDULES: TransportSchedule[] = [];
export const SEED_DRIVERS: Driver[] = [
  { id: 'D1', memberId: 'M001', name: 'Moussa Diop', licenseType: 'Permis D', status: 'disponible', phone: '770000000', tripsCompleted: 12 }
];

export const SEED_CULTURAL_ACTIVITIES: CulturalActivity[] = [
  { id: 'C1', title: 'Grand Thiant Annuel', type: 'khassaide', date: '2024-06-15', time: '20:00', location: 'Grande Place', description: 'Nuit dédiée aux écrits de Cheikh Ahmadou Bamba.', targetAudience: ['Tous'], status: 'planifie' }
];

export const SEED_LIBRARY: LibraryResource[] = [
  { id: 'L1', title: 'Masalikoul Jinan', author: 'Cheikh A. Bamba', type: 'livre', category: 'Soufisme', accessLevel: 'public', views: 1250, rating: 5 }
];

export const SEED_KHASSAIDE_MODULES: KhassaideModule[] = [
  { id: 'M1', title: 'Initiation : Jawartu', author: 'Commission Pédagogique', level: 'debutant', lessons: [], progress: 0 }
];

export const MOCK_MEMBERS: Member[] = [
  {
    id: 'M001',
    matricule: 'MAJ-2024-001',
    firstName: 'Modou',
    lastName: 'Diop',
    email: 'modou.diop@example.com',
    phone: '770000001',
    category: MemberCategory.TRAVAILLEUR,
    level: '',
    role: GlobalRole.DIEUWRINE,
    commissions: [
      { type: CommissionType.ADMINISTRATION, role_commission: 'Secrétaire Général', permissions: [] },
      { type: CommissionType.FINANCE, role_commission: 'Membre', permissions: [] }
    ],
    joinDate: '2024-01-01',
    status: 'active',
    address: 'Médina',
    coordinates: { lat: 14.6928, lng: -17.4467 }
  },
  {
    id: 'M002',
    matricule: 'MAJ-2024-002',
    firstName: 'Fatou',
    lastName: 'Sylla',
    email: 'fatou.sylla@example.com',
    phone: '770000002',
    category: MemberCategory.ETUDIANT,
    level: 'Master',
    role: GlobalRole.MEMBRE,
    commissions: [
      { type: CommissionType.COMMUNICATION, role_commission: 'Chargée de Com.', permissions: [] },
      { type: CommissionType.ADMINISTRATION, role_commission: 'Adjointe', permissions: [] }
    ],
    joinDate: '2024-01-15',
    status: 'active',
    address: 'Sicap Liberté',
    coordinates: { lat: 14.7100, lng: -17.4500 }
  },
  {
    id: 'M003',
    matricule: 'MAJ-2024-003',
    firstName: 'Saliou',
    lastName: 'Fall',
    email: 'saliou.fall@example.com',
    phone: '770000003',
    category: MemberCategory.TRAVAILLEUR,
    level: '',
    role: GlobalRole.MEMBRE,
    commissions: [
      { type: CommissionType.TRANSPORT, role_commission: 'Chauffeur', permissions: [] },
      { type: CommissionType.ORGANISATION, role_commission: 'Responsable Logistique', permissions: [] }
    ],
    joinDate: '2024-02-01',
    status: 'active',
    address: 'Grand Yoff',
    coordinates: { lat: 14.7300, lng: -17.4300 }
  },
  {
    id: 'M004',
    matricule: 'MAJ-2024-004',
    firstName: 'Awa',
    lastName: 'Ndiaye',
    email: 'awa.ndiaye@example.com',
    phone: '770000004',
    category: MemberCategory.ETUDIANT,
    level: 'Licence 3',
    role: GlobalRole.MEMBRE,
    commissions: [
      { type: CommissionType.SOCIAL, role_commission: 'Responsable Entraide', permissions: [] },
      { type: CommissionType.SANTE, role_commission: 'Secouriste', permissions: [] }
    ],
    joinDate: '2024-02-15',
    status: 'active',
    address: 'Fann',
    coordinates: { lat: 14.6900, lng: -17.4600 }
  },
  {
    id: 'M005',
    matricule: 'MAJ-2024-005',
    firstName: 'Omar',
    lastName: 'Gueye',
    email: 'omar.gueye@example.com',
    phone: '770000005',
    category: MemberCategory.ELEVE,
    level: 'Terminale',
    role: GlobalRole.MEMBRE,
    commissions: [
      { type: CommissionType.PEDAGOGIQUE, role_commission: 'Apprenant', permissions: [] },
      { type: CommissionType.CULTURELLE, role_commission: 'Membre', permissions: [] }
    ],
    joinDate: '2024-03-01',
    status: 'active',
    address: 'Parcelles Assainies',
    coordinates: { lat: 14.7500, lng: -17.4200 }
  }
];
