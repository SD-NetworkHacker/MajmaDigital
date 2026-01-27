
import { CommissionType } from '../types';
import { INITIAL_COMMISSIONS } from '../constants';

export interface CommissionHealth {
  commission: CommissionType;
  complianceScore: number; // 0-100
  budgetUtilization: number; // %
  lastReportDate: string;
  pendingRequests: number;
  pendingReports: number;
  status: 'healthy' | 'warning' | 'critical';
  alerts: string[];
}

export interface GlobalKPI {
  totalBudget: number;
  totalSpent: number;
  complianceRate: number;
  pendingApprovals: number;
  activeAlerts: number;
}

// Fonction de santé vide (sera hydratée par les vraies données dans les composants si besoin,
// mais ici on retourne une structure neutre pour le démarrage)
export const getCommissionHealthMatrix = (): CommissionHealth[] => {
  return INITIAL_COMMISSIONS.map((comm) => {
    return {
      commission: comm.name,
      complianceScore: 100, // Démarre à 100 par défaut
      budgetUtilization: 0,
      lastReportDate: 'Aucun rapport',
      pendingRequests: 0,
      pendingReports: 0,
      status: 'healthy',
      alerts: []
    };
  });
};

export const getGlobalKPI = (): GlobalKPI => {
  return {
    totalBudget: 0,
    totalSpent: 0,
    complianceRate: 100,
    pendingApprovals: 0,
    activeAlerts: 0
  };
};

export const getBudgetQueue = () => {
  return []; // File d'attente vide par défaut
};
