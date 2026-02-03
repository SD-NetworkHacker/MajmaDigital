
import { Contribution, Member, Event, DataPoint, Anomaly, AttritionRisk, PredictionModel } from '../types';

/**
 * Moteur d'Agrégation de Données (Data Aggregation Engine)
 * Simule la récupération et la normalisation des données de toutes les commissions
 */
export const aggregateSystemData = (members: Member[], contributions: Contribution[], events: Event[]) => {
  const totalFunds = contributions.reduce((acc, c) => acc + c.amount, 0);
  const activeMembers = members.filter(m => m.status === 'active').length;
  const eventParticipationRate = events.length > 0 ? 0.5 : 0; // Valeur par défaut neutre

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

    // Facteur 2: Statut
    if (member.status === 'pending') {
      riskScore += 10;
      factors.push('Statut non validé');
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
  if (history.length < 3) return [];

  // Agrégation par mois basée sur les données réelles
  const aggregated: Record<string, number> = {};
  history.forEach(c => {
      const month = new Date(c.date).toLocaleString('default', { month: 'short' });
      aggregated[month] = (aggregated[month] || 0) + c.amount;
  });

  const months = Object.keys(aggregated);
  const values = Object.values(aggregated);
  
  const { slope, intercept } = calculateLinearRegression(values);
  
  const forecast: DataPoint[] = [];
  
  // Données historiques
  months.forEach((m, i) => {
    forecast.push({ date: m, value: values[i], type: 'real' });
  });

  // Prédictions pour les 3 prochains mois (simulé simplement par extension linéaire)
  // Dans un cas réel, on gérerait les dates futures correctement
  const futureMonths = ['M+1', 'M+2', 'M+3'];
  futureMonths.forEach((m, i) => {
    const x = values.length + i;
    const predicted = Math.max(0, slope * x + intercept); // Pas de valeur négative
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
