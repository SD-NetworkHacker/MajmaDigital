
/**
 * Service générique de persistance des données (Local Database)
 * Permet de sauvegarder, lire, modifier et supprimer des données pour n'importe quel module.
 */

// Clés de stockage pour les différents modules
export const STORAGE_KEYS = {
  FLEET: 'MAJMA_DB_FLEET',
  DRIVERS: 'MAJMA_DB_DRIVERS',
  TRIPS: 'MAJMA_DB_TRIPS',
  INVENTORY: 'MAJMA_DB_INVENTORY',
  LIBRARY: 'MAJMA_DB_LIBRARY',
  SOCIAL_EVENTS: 'MAJMA_DB_SOCIAL_EVENTS',
  CULTURAL_ACTIVITIES: 'MAJMA_DB_CULTURAL_ACTIVITIES',
  TASKS_DECO: 'MAJMA_DB_TASKS_DECO',
  TICKETS: 'MAJMA_DB_TICKETS',
  INSPECTIONS: 'MAJMA_DB_INSPECTIONS'
};

// Récupérer toutes les données d'une collection
export const getCollection = <T>(key: string): T[] => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Erreur chargement ${key}:`, error);
    return [];
  }
};

// Sauvegarder toute une collection (écrasement)
export const saveCollection = <T>(key: string, data: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    // Émettre un événement pour synchroniser les onglets si nécessaire
    window.dispatchEvent(new Event('storage'));
  } catch (error) {
    console.error(`Erreur sauvegarde ${key}:`, error);
  }
};

// Ajouter un item à une collection
export const addItem = <T>(key: string, item: T): T[] => {
  const collection = getCollection<T>(key);
  const newCollection = [item, ...collection];
  saveCollection(key, newCollection);
  return newCollection;
};

// Mettre à jour un item dans une collection
export const updateItem = <T extends { id: string }>(key: string, id: string, updates: Partial<T>): T[] => {
  const collection = getCollection<T>(key);
  const newCollection = collection.map(item => 
    item.id === id ? { ...item, ...updates } : item
  );
  saveCollection(key, newCollection);
  return newCollection;
};

// Supprimer un item d'une collection
export const deleteItem = <T extends { id: string }>(key: string, id: string): T[] => {
  const collection = getCollection<T>(key);
  const newCollection = collection.filter(item => item.id !== id);
  saveCollection(key, newCollection);
  return newCollection;
};
