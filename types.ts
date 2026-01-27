
export enum MemberCategory {
  ELEVE = 'Élève',
  ETUDIANT = 'Étudiant',
  TRAVAILLEUR = 'Travailleur'
}

export enum GlobalRole {
  ADMIN = 'ADMIN',
  SG = 'SG',
  ADJOINT_SG = 'ADJOINT_SG',
  DIEUWRINE = 'DIEUWRINE',
  MEMBRE = 'MEMBRE'
}

export enum CommissionType {
  COMMUNICATION = 'Communication',
  ADMINISTRATION = 'Administration',
  FINANCE = 'Finance',
  ORGANISATION = 'Organisation',
  SOCIAL = 'Social',
  PEDAGOGIQUE = 'Pédagogique',
  SANTE = 'Santé',
  RELATIONS_EXT = 'Relations Extérieures',
  TRANSPORT = 'Transport',
  CULTURELLE = 'Culturelle'
}

export interface NotificationSettings {
  channels: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  types: {
    meetings: boolean;     // Rappels réunions
    contributions: boolean; // Rappels Sass/Adiyas
    events: boolean;       // Magal, Ziar, etc.
    info: boolean;         // Annonces générales
    security: boolean;     // Connexions suspectes
  };
}

export interface LoginActivity {
  id: string;
  device: string;
  location: string;
  ip: string;
  date: string;
  status: 'current' | 'active' | 'expired';
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  matricule: string;
  role: string;
  avatar?: string;
  preferences: {
    darkMode: boolean;
    language: string;
  };
  notifications: NotificationSettings;
  security: {
    twoFactorEnabled: boolean;
    lastPasswordUpdate: string;
    loginHistory: LoginActivity[];
  };
}

export interface CommissionAssignment {
  type: CommissionType;
  role_commission: string;
  permissions: string[];
}

export interface Member {
  id: string;
  matricule: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  category: MemberCategory;
  level: string;
  role: GlobalRole;
  commissions: CommissionAssignment[];
  joinDate: string;
  status: 'active' | 'pending' | 'inactive';
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface SocialProject {
  id: string;
  title: string;
  category: 'Gott' | 'Secours' | 'Education' | 'Infrastructure';
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  status: 'active' | 'completed' | 'on_hold';
}

export interface Contribution {
  id: string;
  memberId: string;
  type: 'Adiyas' | 'Sass' | 'Diayanté';
  amount: number;
  date: string;
  eventLabel?: string;
  status: 'paid' | 'pending';
}

export interface Event {
  id: string;
  title: string;
  type: 'Magal' | 'Ziar' | 'Gott' | 'Thiant' | 'Réunion';
  date: string;
  location: string;
  organizingCommission: CommissionType;
  description: string;
}

export interface Commission {
  name: CommissionType;
  slug: string;
  description: string;
  memberCount: number;
  dieuwrine: string;
}

// --- Types Bureau Exécutif ---

export enum CrisisLevel {
  NORMAL = 'Normal',
  WATCH = 'Vigilance',
  WARNING = 'Alerte',
  CRITICAL = 'Crise'
}

export interface BureauDecision {
  id: string;
  title: string;
  description: string;
  proposer: string;
  date: string;
  status: 'Voting' | 'Approved' | 'Rejected' | 'Implemented';
  votes: { yes: number; no: number; abstain: number };
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
}

export interface BureauAlert {
  id: string;
  source: CommissionType | 'System';
  message: string;
  level: 'Info' | 'Warning' | 'Critical';
  timestamp: string;
  acknowledged: boolean;
}

// --- Types Analytics Prédictifs ---

export interface DataPoint {
  date: string;
  value: number;
  type?: 'real' | 'predicted';
}

export interface Anomaly {
  id: string;
  metric: string;
  value: number;
  expected: number;
  deviation: string;
  severity: 'low' | 'medium' | 'high';
  date: string;
}

export interface AttritionRisk {
  memberId: string;
  name: string;
  riskScore: number; // 0-100
  factors: string[];
  lastActivity: string;
}

export interface PredictionModel {
  label: string;
  currentValue: number;
  predictedValue: number;
  confidence: number; // 0-100
  trend: 'up' | 'down' | 'stable';
}

// --- Types Gestion de Crise ---

export type CrisisType = 'FINANCE' | 'SECURITY' | 'HEALTH' | 'SOCIAL' | 'LEGAL';

export interface CrisisProtocolStep {
  id: string;
  label: string;
  role: string; // Qui doit agir
  status: 'pending' | 'in_progress' | 'done';
  isCritical: boolean;
}

export interface CrisisScenario {
  id: string;
  type: CrisisType;
  title: string;
  description: string;
  severity: CrisisLevel;
  steps: CrisisProtocolStep[];
  contacts: { name: string; role: string; phone: string }[];
  communicationTemplate: string;
}

export interface ActiveCrisis {
  id: string;
  scenarioId: string;
  startTime: string;
  status: 'active' | 'resolved';
  log: { time: string; action: string; user: string }[];
  completedSteps: string[];
}

// --- Types Gestion Financière Commissions ---

export type FinancialReportStatus = 'brouillon' | 'soumis' | 'revu_finance' | 'approuve' | 'rejete' | 'cloture';
export type BudgetRequestStatus = 'brouillon' | 'soumis_finance' | 'revu_finance' | 'soumis_bureau' | 'approuve' | 'rejete' | 'finance_partiel';
export type BudgetCategory = 'evenement' | 'projet' | 'fonctionnement' | 'equipement' | 'urgence';
export type BudgetPriority = 'bas' | 'moyen' | 'eleve' | 'urgence';

export interface ExpenseItem {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  receiptUrl?: string;
}

export interface CommissionFinancialReport {
  id: string;
  commission: CommissionType;
  period: string; // 'Mensuel - Mai 2024'
  startDate: string;
  endDate: string;
  totalBudgetAllocated: number;
  totalExpenses: number;
  balance: number;
  expenses: ExpenseItem[];
  status: FinancialReportStatus;
  submittedBy: string;
  submittedAt: string;
  comments?: { user: string; comment: string; date: string }[];
}

export interface BudgetBreakdownItem {
  id: string;
  item: string;
  quantity: number;
  unitCost: number;
  total: number;
  justification: string;
}

export interface BudgetRequest {
  id: string;
  commission: CommissionType;
  title: string;
  description: string;
  category: BudgetCategory;
  priority: BudgetPriority;
  amountRequested: number;
  breakdown: BudgetBreakdownItem[];
  timeline: { startDate: string; endDate: string };
  expectedOutcomes: string;
  status: BudgetRequestStatus;
  submittedBy: string;
  submittedAt: string;
  amountApproved?: number;
  rejectionReason?: string;
}

// --- NOUVEAUX TYPES : COMPTES RENDUS DE RÉUNION (PV) ---

export type MeetingReportStatus = 'brouillon' | 'soumis_admin' | 'valide_admin' | 'soumis_bureau' | 'approuve_bureau' | 'archive';
export type MeetingType = 'ordinaire' | 'extraordinaire' | 'urgence' | 'planification';
export type AttendanceStatus = 'present' | 'absent_excuse' | 'absent';

export interface MeetingAttendee {
  memberId: string;
  name: string;
  role: string; // 'président', 'secrétaire', 'participant'
  status: AttendanceStatus;
}

export interface AgendaItem {
  id: string;
  title: string;
  duration: number; // minutes
  presenter: string;
  notes: string;
}

export interface MeetingActionItem {
  id: string;
  description: string;
  assignedTo: string; // Nom ou ID
  dueDate: string;
  status: 'a_faire' | 'en_cours' | 'termine' | 'retard';
}

export interface InternalMeetingReport {
  id: string;
  commission: CommissionType;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  type: MeetingType;
  attendees: MeetingAttendee[];
  agenda: AgendaItem[];
  discussions: string; // Résumé riche ou texte
  decisions: string[];
  actionItems: MeetingActionItem[];
  nextMeetingDate?: string;
  status: MeetingReportStatus;
  createdBy: string;
  createdAt: string;
  adminFeedback?: string;
  bureauFeedback?: string;
  confidentiality: 'interne' | 'confidentiel';
}

// --- Types Commission Transport ---

export type VehicleType = 'bus_grand' | 'bus_moyen' | 'minibus' | 'voiture';
export type VehicleStatus = 'disponible' | 'en_mission' | 'maintenance' | 'hors_service';

export interface Vehicle {
  id: string;
  type: VehicleType;
  capacity: number;
  registrationNumber: string;
  driverId?: string; // Driver ID
  status: VehicleStatus;
  features: string[];
  maintenance: {
    lastDate: string;
    nextDate: string;
    status: 'ok' | 'warning' | 'critical';
  };
}

export interface TripStop {
  id: string;
  location: string;
  time: string;
  expectedPassengers: number;
}

export interface TransportSchedule {
  id: string;
  eventId: string;
  eventTitle: string;
  departureDate: string;
  departureTime: string;
  origin: string;
  destination: string;
  stops: TripStop[];
  assignedVehicleId?: string;
  status: 'planifie' | 'en_cours' | 'termine' | 'annule';
  seatsFilled: number;
  totalCapacity: number;
}

export interface Driver {
  id: string;
  memberId: string;
  name: string;
  licenseType: string;
  status: 'disponible' | 'en_mission' | 'repos';
  phone: string;
  tripsCompleted: number;
}

// --- Types Commission Culturelle ---

export type CulturalActivityType = 'khassaide' | 'conference' | 'atelier' | 'veillee' | 'concours' | 'exposition';
export type LibraryResourceType = 'livre' | 'audio' | 'video' | 'document';
export type DifficultyLevel = 'debutant' | 'intermediaire' | 'avance';

export interface CulturalActivity {
  id: string;
  title: string;
  type: CulturalActivityType;
  date: string;
  time: string;
  location: string;
  description: string;
  targetAudience: string[];
  status: 'planifie' | 'en_cours' | 'termine';
}

export interface LibraryResource {
  id: string;
  title: string;
  author: string;
  type: LibraryResourceType;
  category: string;
  accessLevel: 'public' | 'membres' | 'avance';
  views: number;
  rating: number;
  url?: string; // Mock URL
  coverImage?: string;
}

export interface KhassaideLesson {
  id: string;
  title: string;
  lessonNumber: number;
  duration: string;
  status: 'locked' | 'unlocked' | 'completed';
}

export interface KhassaideModule {
  id: string;
  title: string;
  author: string;
  level: DifficultyLevel;
  lessons: KhassaideLesson[];
  progress: number; // 0-100
}
