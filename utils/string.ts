/**
 * Sécurise l'appel à toLowerCase sur n'importe quelle valeur.
 * @param str Valeur à transformer
 * @returns Chaîne en minuscule ou vide si la valeur est invalide
 */
export const safeLower = (str: any): string => {
  if (str === null || str === undefined) return '';
  return String(str).toLowerCase();
};

/**
 * Vérifie si une chaîne contient une autre de manière sécurisée et insensible à la casse.
 */
export const safeIncludes = (target: any, search: string): boolean => {
  const safeTarget = safeLower(target);
  const safeSearch = safeLower(search);
  if (!safeSearch) return true;
  return safeTarget.includes(safeSearch);
};
