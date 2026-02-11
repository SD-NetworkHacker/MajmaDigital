/**
 * Sécurise l'appel à toLowerCase sur n'importe quelle valeur.
 */
export const safeLower = (str: any): string => {
  if (str === null || str === undefined) return '';
  return String(str).toLowerCase().trim();
};

/**
 * Recherche insensible à la casse et sécurisée.
 */
export const safeIncludes = (target: any, search: string): boolean => {
  const t = safeLower(target);
  const s = safeLower(search);
  if (!s) return true;
  return t.includes(s);
};