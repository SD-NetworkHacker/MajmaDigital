
import { Contribution, Member, Event, DataPoint, Anomaly, AttritionRisk, PredictionModel } from '../types';

/**
 * Moteur d'Agrégation de Données (Data Aggregation Engine)
 * Simule la récupération et la normalisation des données de toutes les commissions
 */
export const aggregateSystemData = (members: Member[], contributions: Contribution[], events: Event[]) => {
  // Simulation de calculs complexes et de mise en cache
  const totalFunds = contributions.reduce((acc, c) => acc + c.amount, 0);
  const activeMembers = members.filter(m => m.status === 'active').length;
  const eventParticipationRate = 0.85; // Mock: taux moyen calculé sur les events passés

  return {
    finance: { totalFunds, history: contributions },
    hr: { activeMembers, totalMembers: members.length },
    ops: { eventParticipationRate, eventsCount: events.length }
  };
};

/**
 * Algorithme de Régression Linéaire Simple (Least Squares)
 * Pour prédire les tendances futures basées sur l'historique
 */
export const calculateLinearRegression = (data: number[]): { slope: number; intercept: number; nextValue: number } => {
  const n = data.length;
  if (n === 0) return { slope: 0, intercept: 0, nextValue: 0 };

  const x = Array.from({ length: n }, (_, i) => i); // [0, 1, 2, ...]
  const y = data;

  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((acc, val, i) => acc + val * y[i], 0);
  const sumXX = x.reduce((acc, val) => acc + val * val, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const nextValue = slope * n + intercept;

  return { slope, intercept, nextValue };
};

/**
 * Détection d'Anomalies (Statistical Deviation)
 * Identifie les points de données qui s'écartent de plus de 2 écarts-types de la moyenne
 */
export const detectAnomalies = (data: { date: string; value: number }[], metricName: string): Anomaly[] => {
  if (data.length < 2) return [];

  const values = data.map(d => d.value);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);

  const anomalies: Anomaly[] = [];

  data.forEach((point) => {
    // Seuil de 2 sigma (95% confidence)
    if (Math.abs(point.value - mean) > 2 * stdDev) {
      const deviation = point.value > mean ? `+${Math.round(((point.value - mean) / mean) * 100)}%` : `-${Math.round(((mean - point.value) / mean) * 100)}%`;
      anomalies.push({
        id: `anom-${Date.now()}-${point.date}`,
        metric: metricName,
        value: point.value,
        expected: Math.round(mean),
        deviation,
        severity: Math.abs(point.value - mean) > 3 * stdDev ? 'high' : 'medium',
        date: point.date
      });
    }
  });

  return anomalies;
};

/**
 * Algorithme de Scoring de Risque d'Attrition (Member Churn Prediction)
 * Basé sur la récence des contributions et l'activité
 */
export const predictAttrition = (members: Member[], contributions: Contribution[]): AttritionRisk[] => {
  const risks: AttritionRisk[] = [];
  const now = new Date();

  members.forEach(member => {
    let riskScore = 0;
    const factors: string[] = [];

    // Facteur 1: Récence Contribution
    const memberContribs = contributions.filter(c => c.memberId === member.id);
    const lastContrib = memberContribs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    
    let daysSinceLastContrib = 90; // Default if no contrib
    if (lastContrib) {
      daysSinceLastContrib = Math.floor((now.getTime() - new Date(lastContrib.date).getTime()) / (1000 * 3600 * 24));
    }

    if (daysSinceLastContrib > 90) {
      riskScore += 40;
      factors.push('Aucune cotisation > 3 mois');
    } else if (daysSinceLastContrib > 60) {
      riskScore += 20;
      factors.push('Retard cotisation');
    }

    // Facteur 2: Statut (Simulation)
    // Dans une vraie app, on utiliserait les logs de présence aux réunions
    if (member.status === 'pending') {
      riskScore += 10;
      factors.push('Statut non validé');
    }

    // Facteur 3: Randomisation pour démo (Simulation de baisse d'engagement)
    const randomEngagementDrop = Math.random() > 0.8;
    if (randomEngagementDrop) {
        riskScore += 15;
        factors.push('Baisse interaction digitale');
    }

    if (riskScore >= 40) {
      risks.push({
        memberId: member.id,
        name: `${member.firstName} ${member.lastName}`,
        riskScore,
        factors,
        lastActivity: lastContrib ? lastContrib.date : 'Inconnue'
      });
    }
  });

  return risks.sort((a, b) => b.riskScore - a.riskScore);
};

/**
 * Générateur de Prévisions Financières
 */
export const generateFinancialForecast = (history: Contribution[]): DataPoint[] => {
  // Agrégation par mois (Mockée pour la démo basée sur des données constantes + bruit)
  const months = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin'];
  const baseData = [450000, 520000, 610000, 580000, 720000, 890000]; // Données réelles simulées
  
  const { slope, intercept } = calculateLinearRegression(baseData);
  
  const forecast: DataPoint[] = [];
  
  // Données historiques
  baseData.forEach((val, i) => {
    forecast.push({ date: months[i], value: val, type: 'real' });
  });

  // Prédictions pour les 3 prochains mois
  const futureMonths = ['Juil', 'Août', 'Sept'];
  futureMonths.forEach((m, i) => {
    const x = baseData.length + i;
    const predicted = slope * x + intercept;
    forecast.push({ date: m, value: Math.round(predicted), type: 'predicted' });
  });

  return forecast;
};

/**
 * Export CSV Utility
 */
export const exportToCSV = (filename: string, rows: object[]) => {
  if (!rows || !rows.length) return;
  const separator = ',';
  const keys = Object.keys(rows[0]);
  const csvContent =
    keys.join(separator) +
    '\n' +
    rows.map(row => {
      return keys.map(k => {
        let cell = (row as any)[k] === null || (row as any)[k] === undefined ? '' : (row as any)[k];
        cell = cell instanceof Date ? cell.toLocaleString() : cell.toString().replace(/"/g, '""');
        if (cell.search(/("|,|\n)/g) >= 0) cell = `"${cell}"`;
        return cell;
      }).join(separator);
    }).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
