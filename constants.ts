
import { MemberCategory, GlobalRole, CommissionType, Member, Commission, Contribution, Event, InternalMeetingReport, Vehicle, TransportSchedule, Driver, CulturalActivity, LibraryResource, KhassaideModule, CommissionFinancialReport, BudgetRequest, AdiyaCampaign, FundraisingEvent } from './types';

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

export const SEED_MEMBERS: Member[] = [
  {
    id: 'admin-sidy',
    matricule: 'MAJ-ADMIN-001',
    firstName: 'Sidy',
    lastName: 'Sow',
    email: 'sidysow.admin@gmail.com',
    phone: '770000000',
    category: MemberCategory.TRAVAILLEUR,
    level: 'Senior',
    role: GlobalRole.ADMIN,
    commissions: [
        { type: CommissionType.ADMINISTRATION, role_commission: 'Secrétaire Général', permissions: ['all'] },
        { type: CommissionType.FINANCE, role_commission: 'Superviseur', permissions: ['read', 'validate'] }
    ],
    joinDate: new Date('2020-01-15').toISOString(),
    status: 'active',
    address: 'Dakar, Plateau',
    coordinates: { lat: 14.6928, lng: -17.4467 }
  },
  {
    id: 'mem-fatou',
    matricule: 'MAJ-2021-045',
    firstName: 'Fatou',
    lastName: 'Ndiaye',
    email: 'fatou.finance@majma.sn',
    phone: '776543210',
    category: MemberCategory.TRAVAILLEUR,
    level: 'Expert',
    role: GlobalRole.DIEUWRINE,
    commissions: [
        { type: CommissionType.FINANCE, role_commission: 'Trésorière Principale', permissions: ['all'] }
    ],
    joinDate: new Date('2021-03-10').toISOString(),
    status: 'active',
    address: 'Mermoz, Dakar',
    coordinates: { lat: 14.7088, lng: -17.4727 }
  },
  {
    id: 'mem-amadou',
    matricule: 'MAJ-2022-112',
    firstName: 'Amadou',
    lastName: 'Bamba',
    email: 'amadou.culture@majma.sn',
    phone: '761234567',
    category: MemberCategory.ETUDIANT,
    level: 'Intermédiaire',
    role: GlobalRole.MEMBRE,
    commissions: [
        { type: CommissionType.CULTURELLE, role_commission: 'Responsable Khassaid', permissions: ['read', 'create'] }
    ],
    joinDate: new Date('2022-09-01').toISOString(),
    status: 'active',
    address: 'UCAD, Dakar',
    coordinates: { lat: 14.6908, lng: -17.4658 }
  },
  {
    id: 'mem-ousmane',
    matricule: 'MAJ-2023-008',
    firstName: 'Ousmane',
    lastName: 'Diop',
    email: 'ousmane@gmail.com',
    phone: '778889900',
    category: MemberCategory.ELEVE,
    level: 'Junior',
    role: GlobalRole.MEMBRE,
    commissions: [],
    joinDate: new Date('2023-10-12').toISOString(),
    status: 'pending',
    address: 'Parcelles Assainies',
    coordinates: { lat: 14.7431, lng: -17.4418 }
  }
];

export const SEED_EVENTS: Event[] = [
  {
    id: 'evt-1',
    title: 'Grand Magal de Touba 2024',
    type: 'Magal',
    date: '2024-08-23',
    location: 'Touba, Grande Mosquée',
    organizingCommission: CommissionType.ORGANISATION,
    description: 'Rassemblement annuel majeur. Départ des convois prévu le 21 Août à 08h00.'
  },
  {
    id: 'evt-2',
    title: 'Ziarra Générale',
    type: 'Ziar',
    date: '2024-05-15',
    location: 'Diarra Bousso',
    organizingCommission: CommissionType.CULTURELLE,
    description: 'Journée de prières et de recueillement.'
  },
  {
    id: 'evt-3',
    title: 'Réunion Mensuelle Bureau',
    type: 'Réunion',
    date: '2024-04-10',
    location: 'Siège Dahira / Zoom',
    organizingCommission: CommissionType.ADMINISTRATION,
    description: 'Ordre du jour : Bilan trimestriel et préparation Ramadan.'
  }
];

export const SEED_CONTRIBUTIONS: Contribution[] = [
  {
    id: 'TX-1001',
    memberId: 'mem-fatou',
    type: 'Adiyas',
    amount: 100000,
    date: '2024-03-25',
    eventLabel: 'Don Spécial Magal',
    status: 'paid'
  },
  {
    id: 'TX-1002',
    memberId: 'admin-sidy',
    type: 'Sass',
    amount: 5000,
    date: '2024-04-01',
    eventLabel: 'Mensualité Avril',
    status: 'paid'
  },
  {
    id: 'TX-1003',
    memberId: 'mem-amadou',
    type: 'Sass',
    amount: 2500,
    date: '2024-04-02',
    eventLabel: 'Mensualité Avril',
    status: 'paid'
  },
  {
    id: 'TX-1004',
    memberId: 'admin-sidy',
    type: 'Diayanté',
    amount: 2500000000,
    date: '2024-03-15',
    eventLabel: 'Soutien Social',
    status: 'paid'
  }
];

export const SEED_REPORTS: InternalMeetingReport[] = [
    {
        id: 'rpt-1',
        commission: CommissionType.FINANCE,
        title: 'Bilan Trimestre 1 - 2024',
        date: '2024-03-31',
        startTime: '10:00',
        endTime: '12:30',
        location: 'Siège',
        type: 'ordinaire',
        attendees: [],
        agenda: [{ id: '1', title: 'Revue des cotisations', duration: 45, presenter: 'Fatou Ndiaye', notes: '' }],
        discussions: 'Le taux de recouvrement est satisfaisant (85%). Nécessité de relancer les retardataires du secteur Élève.',
        decisions: [{ id: 'd1', description: 'Lancement campagne SMS rappel', votes: { for: 8, against: 0, abstain: 0 }, status: 'adopted' }],
        actionItems: [],
        status: 'valide_admin',
        createdBy: 'Fatou Ndiaye',
        confidentiality: 'interne',
        createdAt: new Date().toISOString()
    }
];

export const SEED_BUDGET_REQUESTS: BudgetRequest[] = [
    {
        id: 'req-1',
        commission: CommissionType.ORGANISATION,
        title: 'Achat Bâches & Nattes',
        description: 'Renouvellement du matériel pour les Thiant hebdomadaires.',
        category: 'equipement',
        priority: 'moyen',
        amountRequested: 150000,
        amountApproved: 150000,
        breakdown: [],
        timeline: { startDate: '2024-04-10', endDate: '2024-04-12' },
        expectedOutcomes: 'Meilleur confort des talibés.',
        status: 'approuve',
        submittedBy: 'Moussa Diop',
        submittedAt: '2024-03-20'
    }
];

export const SEED_FINANCIAL_REPORTS: CommissionFinancialReport[] = [];
export const SEED_ADIYA_CAMPAIGNS: AdiyaCampaign[] = [];
export const SEED_FUNDRAISING_EVENTS: FundraisingEvent[] = [];
export const SEED_FLEET: Vehicle[] = [
    {
        id: 'v1',
        type: 'bus_grand',
        capacity: 60,
        registrationNumber: 'DK-2044-BC',
        status: 'disponible',
        features: ['Clim', 'Soute'],
        maintenance: { lastDate: '2024-01-10', nextDate: '2024-05-10', status: 'ok' },
        ownership: 'internal'
    },
    {
        id: 'v2',
        type: 'minibus',
        capacity: 30,
        registrationNumber: 'TH-4520-A',
        status: 'en_mission',
        features: ['Sono'],
        maintenance: { lastDate: '2024-02-15', nextDate: '2024-06-15', status: 'ok' },
        ownership: 'internal'
    }
];
export const SEED_SCHEDULES: TransportSchedule[] = [];
export const SEED_DRIVERS: Driver[] = [
    { id: 'd1', memberId: 'm100', name: 'Moussa Konaté', licenseType: 'Permis D', status: 'disponible', phone: '775556677', tripsCompleted: 45 },
    { id: 'd2', memberId: 'm101', name: 'Ibrahima Seck', licenseType: 'Permis D', status: 'en_mission', phone: '768889900', tripsCompleted: 32 }
];
export const SEED_CULTURAL_ACTIVITIES: CulturalActivity[] = [];
export const SEED_LIBRARY: LibraryResource[] = [
    { id: 'l1', title: 'Massalikoul Djinan', author: 'Cheikh A. Bamba', type: 'livre', category: 'Khassaide', accessLevel: 'public', views: 1500, rating: 5 },
    { id: 'l2', title: 'Conférence Magal 2023', author: 'S. Mountakha', type: 'video', category: 'Conférence', accessLevel: 'public', views: 3200, rating: 5 }
];
export const SEED_KHASSAIDE_MODULES: KhassaideModule[] = [
    { 
        id: 'k1', 
        title: 'Mawahibou Nafiha', 
        author: 'Cheikh A. Bamba', 
        level: 'debutant', 
        progress: 35, 
        lessons: [
            { id: 'l1', title: 'Versets 1-10', lessonNumber: 1, duration: '20 min', status: 'completed' },
            { id: 'l2', title: 'Versets 11-20', lessonNumber: 2, duration: '25 min', status: 'unlocked' },
            { id: 'l3', title: 'Versets 21-30', lessonNumber: 3, duration: '25 min', status: 'locked' },
        ]
    }
];

export const MOCK_MEMBERS = SEED_MEMBERS;
