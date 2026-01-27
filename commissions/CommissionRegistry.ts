
import React, { lazy } from 'react';
import { 
  ShieldCheck, Wallet, MessageSquare, ListTodo, 
  Heart, Briefcase, Activity, Landmark, Bus, BookHeart
} from 'lucide-react';
import { CommissionType } from '../types';

export interface CommissionModuleConfig {
  id: string;
  name: CommissionType;
  icon: any;
  color: string;
  gradient: string;
  description: string;
  features: string[];
  widgets: string[];
  DashboardComponent: React.LazyExoticComponent<any>;
  subComponents?: Record<string, React.LazyExoticComponent<any>>;
}

export const COMMISSION_REGISTRY: Record<string, CommissionModuleConfig> = {
  [CommissionType.ADMINISTRATION]: {
    id: 'administration',
    name: CommissionType.ADMINISTRATION,
    icon: ShieldCheck,
    color: 'emerald',
    gradient: 'from-emerald-600 to-teal-800',
    description: 'Pilotage stratégique, gestion des effectifs et coordination des instances.',
    features: ['Registre des PV', 'Suivi de Présence', 'Validation Rôles', 'Gestion Conflits'],
    widgets: ['MemberStats', 'MeetingCalendar', 'SectorOverview'],
    DashboardComponent: lazy(() => import('./administration/AdministrationDashboard')),
  },
  [CommissionType.FINANCE]: {
    id: 'finance',
    name: CommissionType.FINANCE,
    icon: Wallet,
    color: 'blue',
    gradient: 'from-blue-600 to-indigo-800',
    description: 'Transparence financière, gestion des cotisations et budget prévisionnel.',
    features: ['Grand Livre', 'Campagnes Adiyas', 'Rapports Fiscaux', 'Audit Interne'],
    widgets: ['ContributionFlow', 'BudgetVsActual', 'DebtTracker'],
    DashboardComponent: lazy(() => import('./finance/FinanceDashboard')),
  },
  [CommissionType.COMMUNICATION]: {
    id: 'communication',
    name: CommissionType.COMMUNICATION,
    icon: MessageSquare,
    color: 'amber',
    gradient: 'from-amber-500 to-orange-700',
    description: 'Rayonnement du Dahira, réseaux sociaux et publications numériques.',
    features: ['Media Library', 'Social Scheduler', 'Analytics Engagement', 'Event Coverage'],
    widgets: ['SocialReach', 'ContentCalendar', 'CoverageStatus'],
    DashboardComponent: lazy(() => import('./communication/MediaDashboard')),
  },
  [CommissionType.ORGANISATION]: {
    id: 'organisation',
    name: CommissionType.ORGANISATION,
    icon: ListTodo,
    color: 'purple',
    gradient: 'from-purple-600 to-fuchsia-800',
    description: 'Logistique événementielle, coordination des sous-commissions Gott.',
    features: ['Inventory Manager', 'Team Planning', 'Logistics Checklist'],
    widgets: ['LogisticsStatus', 'EquipmentAudit'],
    DashboardComponent: lazy(() => import('./organisation/OrganisationDashboard')),
  },
  [CommissionType.SOCIAL]: {
    id: 'social',
    name: CommissionType.SOCIAL,
    icon: Heart,
    color: 'rose',
    gradient: 'from-rose-500 to-red-700',
    description: 'Entraide communautaire, solidarité et cohésion sociale.',
    features: ['Calendrier Social', 'Community Builder', 'Wellbeing Tracking', 'Patrimoine'],
    widgets: ['CohesionIndex', 'MatchingStats'],
    DashboardComponent: lazy(() => import('./social/SocialDashboard')),
  },
  [CommissionType.PEDAGOGIQUE]: {
    id: 'pedagogique',
    name: CommissionType.PEDAGOGIQUE,
    icon: Briefcase,
    color: 'cyan',
    gradient: 'from-cyan-600 to-sky-800',
    description: 'Enseignement des Xassaids et éducation par secteur.',
    features: ['Spiritual Curriculum', 'Learning Resources', 'Study Groups', 'Sector Hubs'],
    widgets: ['LearningProgress', 'SpiritualCurriculum'],
    DashboardComponent: lazy(() => import('./pedagogique/PedagogicalDashboard')),
  },
  [CommissionType.SANTE]: {
    id: 'sante',
    name: CommissionType.SANTE,
    icon: Activity,
    color: 'teal',
    gradient: 'from-teal-500 to-emerald-700',
    description: 'Bien-être physique, prévention santé et assistance médicale.',
    features: ['Health Alerts', 'Wellness challenges', 'Medical Support', 'Emergency Response'],
    widgets: ['HealthScore', 'WellnessProgress'],
    DashboardComponent: lazy(() => import('./sante/HealthDashboard')),
  },
  [CommissionType.RELATIONS_EXT]: {
    id: 'relations-ext',
    name: CommissionType.RELATIONS_EXT,
    icon: Landmark,
    color: 'slate',
    gradient: 'from-slate-600 to-slate-900',
    description: 'Relations inter-Dahiras et partenariats institutionnels.',
    features: ['Partner Network', 'Protocol & VIP', 'External Comm', 'International Liaison'],
    widgets: ['InfluenceMap', 'PartnerEvents'],
    DashboardComponent: lazy(() => import('./relations-ext/ExternalDashboard')),
  },
  [CommissionType.TRANSPORT]: {
    id: 'transport',
    name: CommissionType.TRANSPORT,
    icon: Bus,
    color: 'orange',
    gradient: 'from-orange-500 to-red-600',
    description: 'Gestion de la flotte, planification des convois et logistique de déplacement.',
    features: ['Fleet Management', 'Trip Planner', 'Ticketing', 'Driver Roster'],
    widgets: ['FleetStatus', 'UpcomingTrips'],
    DashboardComponent: lazy(() => import('./transport/TransportDashboard')),
  },
  [CommissionType.CULTURELLE]: {
    id: 'culturelle',
    name: CommissionType.CULTURELLE,
    icon: BookHeart,
    color: 'indigo',
    gradient: 'from-indigo-600 to-violet-900',
    description: 'Promotion du patrimoine, médiathèque spirituelle et événements culturels.',
    features: ['Bibliothèque Numérique', 'Académie Khassaide', 'Agenda Culturel', 'Archives'],
    widgets: ['LibraryStats', 'AcademyProgress'],
    DashboardComponent: lazy(() => import('./culturelle/CulturalDashboard')),
  }
};
