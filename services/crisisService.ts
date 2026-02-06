
import { CrisisScenario, CrisisLevel, ActiveCrisis } from '../types';

// Ces scénarios sont des "modèles" de configuration, donc acceptables en dur car ce sont des constantes métier
// Cependant, l'état d'une crise active doit être géré par le contexte/DB
export const CRISIS_SCENARIOS: CrisisScenario[] = [
  {
    id: 'FIN_01',
    type: 'FINANCE',
    title: 'Rupture de Trésorerie Majeure (Gott)',
    description: 'Fonds insuffisants pour couvrir les dépenses immédiates d\'un événement critique (ex: Magal).',
    severity: 'Crise', // Fixed type string from enum usage in constant definition
    steps: [
      { id: 's1', label: 'Geler toutes les dépenses non-essentielles', role: 'Trésorier', status: 'pending', isCritical: true },
      { id: 's2', label: 'Réunion d\'urgence Bureau + Commission Finance', role: 'SG', status: 'pending', isCritical: true },
      { id: 's3', label: 'Lancer appel de fonds exceptionnel (Diayanté)', role: 'Dieuwrine', status: 'pending', isCritical: true },
      { id: 's4', label: 'Négocier délai paiement fournisseurs', role: 'Resp. Achat', status: 'pending', isCritical: false },
    ],
    contacts: [
      { name: 'Banque Principale', role: 'Conseiller Pro', phone: '33 800 00 00' },
      { name: 'Moussa Ndiaye', role: 'Dieuwrine Finance', phone: '77 000 00 00' }
    ],
    communicationTemplate: "URGENT : Chers membres, une situation financière critique nécessite votre attention immédiate pour la réussite du Magal. Une session extraordinaire est ouverte."
  },
  // ... (Autres scénarios inchangés car structurels)
];

// Fonction utilitaire pour initialiser une crise (Devrait idéalement être une mutation DB)
export const startCrisis = (scenarioId: string): ActiveCrisis => {
  return {
    id: Date.now().toString(),
    scenarioId,
    startTime: new Date().toISOString(),
    status: 'active',
    log: [{ time: new Date().toISOString(), action: 'Activation du protocole', user: 'Dieuwrine' }],
    completedSteps: []
  };
};
