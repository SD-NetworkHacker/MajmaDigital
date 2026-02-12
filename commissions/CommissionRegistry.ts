import { 
  ShieldCheck, Wallet, MessageSquare, ListTodo, 
  Heart, Briefcase, Activity, Landmark, Bus, Library
} from 'lucide-react';
import { CommissionType } from '../types';

// Imports statiques pour éviter l'erreur "Failed to fetch dynamically imported module"
import AdministrationDashboard from './administration/AdministrationDashboard';
import FinanceDashboard from './finance/FinanceDashboard';
import MediaDashboard from './communication/MediaDashboard';
import OrganisationDashboard from './organisation/OrganisationDashboard';
import SocialDashboard from './social/SocialDashboard';
import PedagogicalDashboard from './pedagogique/PedagogicalDashboard';
import HealthDashboard from './sante/HealthDashboard';
import ExternalDashboard from './relations-ext/ExternalDashboard';
import TransportDashboard from './transport/TransportDashboard';
import CulturalDashboard from './culturelle/CulturalDashboard';

export interface CommissionModuleConfig {
  id: string;
  name: CommissionType;
  icon: any;
  color: string;
  gradient: string;
  description: string;
  features: string[];
  widgets: string[];
  DashboardComponent: any;
}

export const COMMISSION_REGISTRY: Record<string, CommissionModuleConfig> = {
  [CommissionType.ADMINISTRATION]: {
    id: 'administration',
    name: CommissionType.ADMINISTRATION,
    icon: ShieldCheck,
    color: 'emerald',
    gradient: 'from-emerald-600 to-teal-800',
    description: 'Pilotage stratégique, gestion des effectifs et coordination des instances.',
    features: ['Registre des PV', 'Suivi de Présence', 'Validation Rôles'],
    widgets: ['MemberStats', 'MeetingCalendar'],
    DashboardComponent: AdministrationDashboard,
  },
  [CommissionType.FINANCE]: {
    id: 'finance',
    name: CommissionType.FINANCE,
    icon: Wallet,
    color: 'blue',
    gradient: 'from-blue-600 to-indigo-800',
    description: 'Transparence financière, gestion des cotisations et budget prévisionnel.',
    features: ['Grand Livre', 'Campagnes Adiyas', 'Rapports'],
    widgets: ['ContributionFlow', 'BudgetVsActual'],
    DashboardComponent: FinanceDashboard,
  },
  [CommissionType.COMMUNICATION]: {
    id: 'communication',
    name: CommissionType.COMMUNICATION,
    icon: MessageSquare,
    color: 'amber',
    gradient: 'from-amber-500 to-orange-700',
    description: 'Rayonnement du Dahira, réseaux sociaux et publications numériques.',
    features: ['Media Library', 'Social Scheduler'],
    widgets: ['SocialReach', 'ContentCalendar'],
    DashboardComponent: MediaDashboard,
  },
  [CommissionType.ORGANISATION]: {
    id: 'organisation',
    name: CommissionType.ORGANISATION,
    icon: ListTodo,
    color: 'purple',
    gradient: 'from-purple-600 to-fuchsia-800',
    description: 'Logistique événementielle, coordination des sous-commissions Gott.',
    features: ['Inventory Manager', 'Team Planning'],
    widgets: ['LogisticsStatus'],
    DashboardComponent: OrganisationDashboard,
  },
  [CommissionType.SOCIAL]: {
    id: 'social',
    name: CommissionType.SOCIAL,
    icon: Heart,
    color: 'rose',
    gradient: 'from-rose-500 to-red-700',
    description: 'Entraide communautaire, solidarité et cohésion sociale.',
    features: ['Calendrier Social', 'Community Builder'],
    widgets: ['CohesionIndex'],
    DashboardComponent: SocialDashboard,
  },
  [CommissionType.PEDAGOGIQUE]: {
    id: 'pedagogique',
    name: CommissionType.PEDAGOGIQUE,
    icon: Briefcase,
    color: 'cyan',
    gradient: 'from-cyan-600 to-sky-800',
    description: 'Enseignement des Xassaids et éducation par secteur.',
    features: ['Spiritual Curriculum', 'Study Groups'],
    widgets: ['LearningProgress'],
    DashboardComponent: PedagogicalDashboard,
  },
  [CommissionType.SANTE]: {
    id: 'sante',
    name: CommissionType.SANTE,
    icon: Activity,
    color: 'teal',
    gradient: 'from-teal-500 to-emerald-700',
    description: 'Bien-être physique, prévention santé et assistance médicale.',
    features: ['Health Alerts', 'Wellness challenges'],
    widgets: ['HealthScore'],
    DashboardComponent: HealthDashboard,
  },
  [CommissionType.RELATIONS_EXT]: {
    id: 'relations-ext',
    name: CommissionType.RELATIONS_EXT,
    icon: Landmark,
    color: 'slate',
    gradient: 'from-slate-600 to-slate-900',
    description: 'Relations inter-Dahiras et partenariats institutionnels.',
    features: ['Partner Network', 'Protocol'],
    widgets: ['InfluenceMap'],
    DashboardComponent: ExternalDashboard,
  },
  [CommissionType.TRANSPORT]: {
    id: 'transport',
    name: CommissionType.TRANSPORT,
    icon: Bus,
    color: 'orange',
    gradient: 'from-orange-500 to-red-600',
    description: 'Gestion de la flotte, planification des convois et logistique.',
    features: ['Fleet Management', 'Trip Planner'],
    widgets: ['FleetStatus'],
    DashboardComponent: TransportDashboard,
  },
  [CommissionType.CULTURELLE]: {
    id: 'culturelle',
    name: CommissionType.CULTURELLE,
    icon: Library,
    color: 'indigo',
    gradient: 'from-indigo-600 to-violet-900',
    description: 'Promotion du patrimoine, médiathèque spirituelle et événements.',
    features: ['Bibliothèque Numérique', 'Archives'],
    widgets: ['LibraryStats'],
    DashboardComponent: CulturalDashboard,
  }
};