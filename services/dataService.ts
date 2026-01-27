
export const syncData = async (isSilent: boolean = false) => {
  // Simule un délai réseau pour la synchronisation
  return new Promise((resolve) => {
    const delay = isSilent ? 500 : 1500;
    setTimeout(() => {
      const timestamp = new Date().toISOString();
      localStorage.setItem('majma_last_sync', timestamp);
      // Ici, on pourrait ajouter une logique de fetch vers un vrai backend
      resolve(timestamp);
    }, delay);
  });
};

export const getLastSync = () => {
  return localStorage.getItem('majma_last_sync');
};
