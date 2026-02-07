
import { format, parseISO, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Formate une date (string ISO ou objet Date) en chaîne lisible.
 * Format par défaut : '25 Déc 2023' (dd MMM yyyy)
 */
export const formatDate = (date: string | Date | undefined | null, formatStr: string = 'dd MMM yyyy'): string => {
  if (!date) return '-';
  
  let dateObj: Date;

  if (typeof date === 'string') {
    // Gestion des dates seulement "YYYY-MM-DD" ou ISO complètes
    dateObj = parseISO(date);
  } else {
    dateObj = date;
  }

  if (!isValid(dateObj)) return '-';

  return format(dateObj, formatStr, { locale: fr });
};

/**
 * Retourne l'heure formatée (ex: 14:30)
 */
export const formatTime = (date: string | Date | undefined | null): string => {
    return formatDate(date, 'HH:mm');
};

/**
 * Retourne le jour du mois (ex: 25)
 */
export const getDay = (date: string | Date): string => {
    return formatDate(date, 'd');
};

/**
 * Retourne le mois abrégé (ex: Déc)
 */
export const getMonth = (date: string | Date): string => {
    // capitalise la première lettre car date-fns retourne "déc" ou "déc."
    const m = formatDate(date, 'MMM');
    return m.charAt(0).toUpperCase() + m.slice(1).replace('.', '');
};
