
import { CrisisScenario, CrisisLevel, ActiveCrisis } from '../types';

export const CRISIS_SCENARIOS: CrisisScenario[] = [
  {
    id: 'FIN_01',
    type: 'FINANCE',
    title: 'Rupture de Trésorerie Majeure (Gott)',
    description: 'Fonds insuffisants pour couvrir les dépenses immédiates d\'un événement critique (ex: Magal).',
    severity: CrisisLevel.CRITICAL,
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
  {
    id: 'SEC_01',
    type: 'SECURITY',
    title: 'Accident Transport / Logistique',
    description: 'Accident impliquant un bus de convoi ou un véhicule de matériel.',
    severity: CrisisLevel.CRITICAL,
    steps: [
      { id: 's1', label: 'Contacter services de secours (Sapeurs/SAMU)', role: 'Resp. Convoi', status: 'pending', isCritical: true },
      { id: 's2', label: 'Recenser les membres impliqués (Liste présence)', role: 'Admin', status: 'pending', isCritical: true },
      { id: 's3', label: 'Sécuriser la zone et le matériel', role: 'Sécurité', status: 'pending', isCritical: false },
      { id: 's4', label: 'Informer les familles (après validation)', role: 'Social', status: 'pending', isCritical: true },
    ],
    contacts: [
      { name: 'Gendarmerie', role: 'Secours', phone: '18' },
      { name: 'Hôpital Régional', role: 'Urgences', phone: '15' }
    ],
    communicationTemplate: "INFO IMPORTANTE : Un incident a eu lieu sur le convoi. Les secours sont sur place. Nous vous tiendrons informés. Priez pour nous."
  },
  {
    id: 'HEA_01',
    type: 'HEALTH',
    title: 'Intoxication Alimentaire Massive',
    description: 'Plusieurs cas de malaises digestifs signalés lors d\'un événement.',
    severity: CrisisLevel.CRITICAL,
    steps: [
      { id: 's1', label: 'Arrêter immédiatement la distribution de repas', role: 'Resp. Cuisine', status: 'pending', isCritical: true },
      { id: 's2', label: 'Isoler les cas symptomatiques', role: 'Commission Santé', status: 'pending', isCritical: true },
      { id: 's3', label: 'Prélever échantillons plats témoins', role: 'Hygiène', status: 'pending', isCritical: true },
      { id: 's4', label: 'Organiser évacuation vers centre santé', role: 'Logistique', status: 'pending', isCritical: false },
    ],
    contacts: [
      { name: 'Dr. Diop', role: 'Médecin Dahira', phone: '77 123 45 67' },
      { name: 'Service Hygiène', role: 'État', phone: '33 822 22 22' }
    ],
    communicationTemplate: "ALERTE SANTÉ : Par précaution, la restauration est suspendue. Si vous ressentez des symptômes, rapprochez-vous immédiatement du pôle médical."
  }
];

export const detectAnomalies = () => {
  // Pas d'anomalie détectée par défaut
  return [];
};

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
