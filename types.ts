export enum CommissionType {
  ADMINISTRATION = 'Administration',
  FINANCE = 'Finance',
  COMMUNICATION = 'Communication',
  ORGANISATION = 'Organisation',
  SOCIAL = 'Social',
  PEDAGOGIQUE = 'Pédagogie',
  SANTE = 'Santé',
  RELATIONS_EXT = 'Relations Ext.',
  TRANSPORT = 'Transport',
  CULTURELLE = 'Culturelle'
}

export enum GlobalRole {
  ADMIN = 'ADMIN',
  SG = 'SG',
  ADJOINT_SG = 'ADJOINT_SG',
  DIEUWRINE = 'DIEUWRINE',
  MEMBRE = 'MEMBRE'
}

export enum MemberCategory {
  ETUDIANT = 'Étudiant',
  TRAVAILLEUR = 'Travailleur',
  ELEVE = 'Élève'
}

export interface CommissionAssignment {
  type: CommissionType;
  role_commission: string;
  permissions: string[];
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: GlobalRole | string;
  category: MemberCategory | string;
  matricule: string;
  status: 'active' | 'inactive' | 'pending';
  address: string;
  joinDate: string;
  coordinates: { lat: number; lng: number };
  commissions: CommissionAssignment[];
  bio?: string;
  avatarUrl?: string;
  birthDate?: string;
  gender?: 'Homme' | 'Femme' | 'M' | 'F';
  academicInfo?: { establishment: string; level: string; field: string };
  professionalInfo?: { company: string; position: string; sector: string };
  documents?: MemberDocument[];
  preferences?: any;
  level?: string;
}

export interface MemberDocument {
  id: string;
  name: string;
  type: 'PDF' | 'IMAGE' | 'AUTRE';
  date: string;
  url?: string;
  verified?: boolean;
}

export interface Contribution {
  id: string;
  memberId: string;
  type: 'Adiyas' | 'Sass' | 'Diayanté' | 'Gott' | 'Adiya Élite';
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'failed';
  eventLabel?: string;
  transactionId?: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done' | 'blocked' | 'waiting';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface TaskComment {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  date: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  commission: CommissionType;
  assignedTo: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  createdBy: string;
  createdAt: string;
  comments: TaskComment[];
}

export interface Commission {
  name: CommissionType;
  slug: string;
  description: string;
  memberCount: number;
  dieuwrine: string;
}

export interface Event {
  id: string;
  title: string;
  type: 'Magal' | 'Ziar' | 'Gott' | 'Thiant' | 'Réunion' | 'Atelier' | 'Sortie' | 'Dîner' | 'Sport' | 'Autre';
  date: string;
  time?: string;
  location: string;
  organizingCommission: string | CommissionType;
  description?: string;
  status?: string;
}

export type MeetingReportStatus = 'brouillon' | 'soumis_admin' | 'valide_admin' | 'soumis_bureau' | 'approuve_bureau' | 'archive';
export type MeetingType = 'ordinaire' | 'extraordinaire' | 'urgence' | 'planification';
export type AttendanceStatus = 'present' | 'absent_excuse' | 'absent';

export interface MeetingAttendee {
  memberId: string;
  name: string;
  role: string;
  status: AttendanceStatus;
}

export interface AgendaItem {
  id: string;
  title: string;
  duration: number;
  presenter: string;
  notes: string;
}

export interface MeetingDecision {
  id: string;
  description: string;
  votes: { for: number; against: number; abstain: number };
  status: 'adopted' | 'rejected' | 'pending';
}

export interface MeetingActionItem {
  id: string;
  description: string;
  assignedTo: string;
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
  discussions: string;
  decisions: MeetingDecision[];
  actionItems: MeetingActionItem[];
  status: MeetingReportStatus;
  createdBy: string;
  confidentiality?: 'interne' | 'confidentiel' | 'public';
  meetingQrCode?: string;
  adminFeedback?: string;
  bureauFeedback?: string;
}

export type VehicleType = 'bus_grand' | 'bus_moyen' | 'minibus' | 'voiture';
export type VehicleStatus = 'disponible' | 'en_mission' | 'maintenance' | 'hors_service';

export interface Vehicle {
  id: string;
  type: VehicleType;
  capacity: number;
  registrationNumber: string;
  status: VehicleStatus;
  features: string[];
  ownership: 'internal' | 'external';
  maintenance: {
    lastDate: string;
    nextDate: string;
    status: 'ok' | 'warning' | 'critical';
  };
  externalDetails?: {
    companyName: string;
    contactPhone: string;
    dailyCost: number;
  };
}

export interface TransportSchedule {
  id: string;
  eventId?: string;
  eventTitle: string;
  departureDate: string;
  departureTime: string;
  origin: string;
  destination: string;
  stops: { id: string; location: string; time: string; expectedPassengers: number }[];
  assignedVehicleId?: string;
  status: 'planifie' | 'en_cours' | 'termine' | 'annule';
  seatsFilled: number;
  totalCapacity: number;
}

export interface Driver {
  id: string;
  memberId?: string;
  name: string;
  licenseType: string;
  status: 'disponible' | 'en_mission' | 'repos';
  phone: string;
  tripsCompleted: number;
}

export type LibraryResourceType = 'livre' | 'audio' | 'video' | 'document';

export interface LibraryResource {
  id: string;
  title: string;
  author: string;
  type: LibraryResourceType;
  category: string;
  accessLevel: 'public' | 'membres' | 'avance';
  url: string;
  views: number;
  rating: number;
}

export interface KhassaideLesson {
  id: string;
  title: string;
  duration: string;
  status: 'locked' | 'unlocked' | 'completed';
}

export interface KhassaideModule {
  id: string;
  title: string;
  author: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'debutant' | 'intermediaire' | 'avance';
  progress: number;
  lessons: KhassaideLesson[];
}

export interface ExpenseItem {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
}

export interface CommissionFinancialReport {
  id: string;
  commission: CommissionType;
  period: string;
  startDate: string;
  endDate: string;
  totalBudgetAllocated: number;
  totalExpenses: number;
  balance: number;
  status: 'brouillon' | 'soumis' | 'valide' | 'rejete' | 'cloture';
  submittedBy: string;
  submittedAt: string;
  expenses: ExpenseItem[];
  rejectionReason?: string;
}

export type BudgetCategory = 'evenement' | 'projet' | 'equipement' | 'urgence';
export type BudgetPriority = 'bas' | 'moyen' | 'eleve' | 'urgence';

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
  timeline: { startDate: string; endDate: string };
  expectedOutcomes: string;
  amountRequested: number;
  amountApproved?: number;
  status: 'soumis_finance' | 'revu_finance' | 'soumis_bureau' | 'approuve' | 'rejete' | 'termine' | 'finance_partiel';
  submittedBy: string;
  submittedAt: string;
  breakdown: BudgetBreakdownItem[];
  rejectionReason?: string;
}

export interface AdiyaCampaign {
  id: string;
  title: string;
  unitAmount: number;
  targetAmount?: number;
  deadline: string;
  status: 'open' | 'closed' | 'draft';
  participants: any[];
  createdBy: string;
  description?: string;
}

export interface FundraisingGroup {
  id: string;
  name: string;
  amount: number;
}

export interface FundraisingEvent {
  id: string;
  name: string;
  type: 'Magal' | 'Ziar' | 'Gott' | 'Autre';
  status: 'active' | 'closed';
  deadline: string;
  groups: FundraisingGroup[];
  createdAt: string;
}

export interface SocialProject {
  id: string;
  title: string;
  theme: 'Éducation' | 'Santé' | 'Social' | 'Infrastructure' | string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  status: 'actif' | 'termine' | 'pause' | string;
  color: string;
}

export interface SocialPost {
  id: string;
  title: string;
  date: string;
  time: string;
  status: string;
  platforms: string[];
}

export interface InventoryItem {
  id: string;
  name: string;
  qty: number;
  condition: 'Neuf' | 'Bon état' | 'Usagé' | 'Réparation';
  sub: string;
  nextCheck: string;
}

export enum CrisisLevel {
  NORMAL = 'Normal',
  WARNING = 'Attention',
  CRITICAL = 'Crise'
}

export interface CrisisStep {
  id: string;
  label: string;
  role: string;
  status: 'pending' | 'done';
  isCritical: boolean;
}

export interface CrisisContact {
  name: string;
  role: string;
  phone: string;
}

export interface CrisisLog {
  time: string;
  action: string;
  user: string;
}

export interface CrisisScenario {
  id: string;
  type: string;
  title: string;
  description: string;
  severity: string;
  steps: CrisisStep[];
  contacts: CrisisContact[];
  communicationTemplate: string;
}

export interface ActiveCrisis {
  id: string;
  scenarioId: string;
  startTime: string;
  status: 'active' | 'resolved';
  log: CrisisLog[];
  completedSteps: string[];
}

export interface DataPoint {
  date: string;
  value: number;
  type: 'real' | 'predicted';
}

export interface Anomaly {
  id: string;
  metric: string;
  value: number;
  expected: number;
  deviation: string;
  severity: 'medium' | 'high';
  date: string;
}

export interface AttritionRisk {
  memberId: string;
  name: string;
  riskScore: number;
  factors: string[];
  lastActivity: string;
}

export interface PredictionModel {
  slope: number;
  intercept: number;
  nextValue: number;
}

export interface SocialCase {
  id: string;
  memberId: string;
  type: string;
  description: string;
  status: string;
}

export interface TicketItem {
  id: string;
  passenger: string;
  phone: string;
  trip: string;
  tripId: string;
  seat: string;
  status: string;
  type: string;
  amount: number;
  date: string;
}

export interface Partner {
  id: string;
  name: string;
  type: string;
  location: string;
  contact: string;
  status: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  theme: string;
  membersCount: number;
}

export interface CulturalActivity extends Event {}
