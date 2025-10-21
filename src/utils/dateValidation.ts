import { addMonths, addYears, isAfter, isBefore, startOfDay } from 'date-fns';

/**
 * Resultat de validation d'une date de naissance.
 */
export interface BirthDateValidationResult {
  valid: boolean;
  error?: string;
  warning?: string;
  context?: 'future' | 'past' | 'today';
}

/**
 * Valide une date de naissance pour le conge de paternite.
 * 
 * LEGISLATION : Article L1225-65 du Code du Travail
 * - Les jours fractionnables doivent etre pris dans les 6 mois (standard) ou 12 mois (hospitalisation)
 * - Le conge de naissance (3j employeur) est pris immediatement apres la naissance
 * 
 * LIMITES RAISONNABLES :
 * - Futur : Maximum 9 mois (duree de grossesse + marge)
 * - Passe : Maximum 1 an (au-dela, delai legal de 6 mois depasse)
 * 
 * CAS D'USAGE :
 * 1. Futur parent planifiant a l'avance (date future)
 * 2. Parent venant d'accoucher (date = aujourd'hui)
 * 3. Parent utilisant l'app apres naissance (date passee recente)
 * 
 * @param date Date de naissance a valider
 * @returns Resultat de validation avec erreur ou avertissement eventuel
 */
export function validateBirthDate(date: Date): BirthDateValidationResult {
  const normalized = startOfDay(date);
  const today = startOfDay(new Date());

  // Cas 1 : Date = Aujourd'hui (cas nominal)
  if (normalized.getTime() === today.getTime()) {
    return { 
      valid: true, 
      context: 'today',
      warning: undefined
    };
  }

  // Cas 2 : Date future
  if (isAfter(normalized, today)) {
    // Limite superieure : +9 mois (duree maximale de grossesse)
    const maxFutureDate = addMonths(today, 9);
    
    if (isAfter(normalized, maxFutureDate)) {
      return { 
        valid: false, 
        error: 'La date de naissance ne peut pas depasser 9 mois dans le futur (duree maximale de grossesse)',
        context: 'future'
      };
    }

    return { 
      valid: true, 
      context: 'future',
      warning: undefined
    };
  }

  // Cas 3 : Date passee
  if (isBefore(normalized, today)) {
    // Limite inferieure : -1 an (au-dela, delai legal de 6 mois depasse)
    const minPastDate = addYears(today, -1);
    
    if (isBefore(normalized, minPastDate)) {
      return { 
        valid: false, 
        error: 'Cette naissance date de plus d\'un an. Le delai legal de 6 mois pour poser les jours fractionnables est depasse.',
        context: 'past'
      };
    }

    // Cas 3a : Date passee entre -6 mois et -1 an
    const sixMonthsAgo = addMonths(today, -6);
    if (isBefore(normalized, sixMonthsAgo)) {
      return {
        valid: true,
        context: 'past',
        warning: 'Attention : Cette naissance date de plus de 6 mois. Le delai legal standard est depasse, sauf cas d\'hospitalisation du nouveau-ne (12 mois).'
      };
    }

    // Cas 3b : Date passee recente (moins de 6 mois)
    return { 
      valid: true, 
      context: 'past',
      warning: 'Cette naissance est deja survenue. Certains jours ont peut-etre deja ete pris (conge de naissance + periode obligatoire).'
    };
  }

  // Fallback (ne devrait jamais arriver)
  return { valid: false, error: 'Date invalide' };
}

/**
 * Valide une date de naissance et retourne un message d'erreur simple pour l'UI.
 * 
 * @param date Date de naissance a valider
 * @returns Message d'erreur si invalide, undefined sinon
 */
export function validateBirthDateSimple(date: Date): string | undefined {
  const result = validateBirthDate(date);
  return result.valid ? undefined : result.error;
}

/**
 * Verifie si une date de naissance est dans le futur.
 * 
 * @param date Date de naissance
 * @returns true si la date est future
 */
export function isBirthDateInFuture(date: Date): boolean {
  const normalized = startOfDay(date);
  const today = startOfDay(new Date());
  return isAfter(normalized, today);
}

/**
 * Verifie si une date de naissance est dans le passe.
 * 
 * @param date Date de naissance
 * @returns true si la date est passee
 */
export function isBirthDateInPast(date: Date): boolean {
  const normalized = startOfDay(date);
  const today = startOfDay(new Date());
  return isBefore(normalized, today);
}

