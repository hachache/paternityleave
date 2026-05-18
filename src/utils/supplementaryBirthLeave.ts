import { addDays, addMonths, differenceInCalendarDays, isAfter, isBefore, startOfDay } from 'date-fns';
import { LeaveBlock, LeaveScenarioConfig, countCalendarDays, hasOverlap } from './paternityLeave';

export type SupplementaryLeaveDuration = 1 | 2;

/**
 * Mode de prise du congé supplémentaire de naissance (LFSS 2026, art. 99-V).
 *
 * - 'consecutive' : 1 ou 2 mois pris de manière continue à compter du jour
 *   suivant la fin du congé paternité.
 * - 'split' : 2 périodes d'un mois calendaire prises de manière disjointe,
 *   chacune dans le délai légal de prise. Cas explicitement autorisé par
 *   les articles L1225-46-2 et suivants du Code du Travail.
 */
export type SupplementaryLeaveMode = 'consecutive' | 'split';

export interface SupplementaryLeaveEligibility {
  isEligibleBirthDate: boolean;
  isAvailableNow: boolean;
  canActivate: boolean;
  /** Jours restants avant le 1er juillet 2026 (affichage informatif uniquement). */
  daysUntilActivation: number | null;
  minBirthDate: Date;
  activationDate: Date;
  limitDate: Date | null;
  reason: string | null;
}

export const SUPPLEMENTARY_LEAVE_MIN_BIRTH_DATE = startOfDay(new Date(2026, 0, 1));
export const SUPPLEMENTARY_LEAVE_ACTIVATION_DATE = startOfDay(new Date(2026, 6, 1));
export const SUPPLEMENTARY_LEAVE_TRANSITION_LAST_BIRTH_DATE = startOfDay(new Date(2026, 5, 30));
export const SUPPLEMENTARY_LEAVE_TRANSITION_LIMIT_DATE = startOfDay(new Date(2027, 2, 31));

const BASE_PATERNITY_FRACTIONABLE_DAYS = 21;

function getExtendedWindowDays(scenario?: LeaveScenarioConfig): number {
  if (!scenario) return 0;
  return Math.max(scenario.fractionableDays - BASE_PATERNITY_FRACTIONABLE_DAYS, 0);
}

export function getSupplementaryLeaveLimitDate(
  birthDate: Date,
  scenario?: LeaveScenarioConfig
): Date {
  const normalizedBirth = startOfDay(birthDate);
  const extensionDays = getExtendedWindowDays(scenario);

  const transitionLimit = addDays(
    SUPPLEMENTARY_LEAVE_TRANSITION_LIMIT_DATE,
    extensionDays
  );

  if (
    !isBefore(normalizedBirth, SUPPLEMENTARY_LEAVE_MIN_BIRTH_DATE) &&
    !isAfter(normalizedBirth, SUPPLEMENTARY_LEAVE_TRANSITION_LAST_BIRTH_DATE)
  ) {
    return transitionLimit;
  }

  return addDays(addMonths(normalizedBirth, 9), extensionDays);
}

function getDaysUntilActivation(today: Date, activationDate: Date): number | null {
  if (!isBefore(today, activationDate)) {
    return null;
  }
  return differenceInCalendarDays(activationDate, today);
}

/** Libellé informatif ; ne modifie pas les droits d’activation (`canActivate`). */
export function formatSupplementaryActivationCountdown(
  daysUntilActivation: number | null
): string | null {
  if (daysUntilActivation === null || daysUntilActivation < 0) {
    return null;
  }
  if (daysUntilActivation === 0) {
    return 'Activation prévue aujourd’hui (1er juillet 2026)';
  }
  if (daysUntilActivation === 1) {
    return 'Activation demain (1er juillet 2026)';
  }
  return `Activation dans ${daysUntilActivation} jours (1er juillet 2026)`;
}

export function getSupplementaryLeaveEligibility(
  birthDate: Date | null,
  scenario?: LeaveScenarioConfig,
  today: Date = new Date()
): SupplementaryLeaveEligibility {
  const normalizedToday = startOfDay(today);
  const isAvailableNow = !isBefore(normalizedToday, SUPPLEMENTARY_LEAVE_ACTIVATION_DATE);
  const daysUntilActivation = getDaysUntilActivation(
    normalizedToday,
    SUPPLEMENTARY_LEAVE_ACTIVATION_DATE
  );

  if (!birthDate) {
    return {
      isEligibleBirthDate: false,
      isAvailableNow,
      canActivate: false,
      daysUntilActivation,
      minBirthDate: SUPPLEMENTARY_LEAVE_MIN_BIRTH_DATE,
      activationDate: SUPPLEMENTARY_LEAVE_ACTIVATION_DATE,
      limitDate: null,
      reason: 'Définissez d’abord la date de naissance.'
    };
  }

  const normalizedBirth = startOfDay(birthDate);
  const isEligibleBirthDate = !isBefore(
    normalizedBirth,
    SUPPLEMENTARY_LEAVE_MIN_BIRTH_DATE
  );

  if (!isEligibleBirthDate) {
    return {
      isEligibleBirthDate: false,
      isAvailableNow,
      canActivate: false,
      daysUntilActivation,
      minBirthDate: SUPPLEMENTARY_LEAVE_MIN_BIRTH_DATE,
      activationDate: SUPPLEMENTARY_LEAVE_ACTIVATION_DATE,
      limitDate: null,
      reason:
        'Réservé aux enfants nés/adoptés à partir du 1 janvier 2026 (hors cas prématuré non simulé).'
    };
  }

  if (!isAvailableNow) {
    return {
      isEligibleBirthDate: true,
      isAvailableNow,
      canActivate: false,
      daysUntilActivation,
      minBirthDate: SUPPLEMENTARY_LEAVE_MIN_BIRTH_DATE,
      activationDate: SUPPLEMENTARY_LEAVE_ACTIVATION_DATE,
      limitDate: getSupplementaryLeaveLimitDate(normalizedBirth, scenario),
      reason:
        'Activation prévue au 1 juillet 2026, sous réserve des textes d’application.'
    };
  }

  return {
    isEligibleBirthDate: true,
    isAvailableNow: true,
    canActivate: true,
    daysUntilActivation: null,
    minBirthDate: SUPPLEMENTARY_LEAVE_MIN_BIRTH_DATE,
    activationDate: SUPPLEMENTARY_LEAVE_ACTIVATION_DATE,
    limitDate: getSupplementaryLeaveLimitDate(normalizedBirth, scenario),
    reason: null
  };
}

export function calculateSupplementaryLeavePeriod(
  startDate: Date,
  durationMonths: SupplementaryLeaveDuration
): LeaveBlock {
  const start = startOfDay(startDate);
  const end = addDays(addMonths(start, durationMonths), -1);
  const days = countCalendarDays(start, end);

  return {
    start,
    end,
    days,
    type: 'supplementary'
  };
}

export interface SupplementaryLeaveSplitValidation {
  valid: boolean;
  blocks: LeaveBlock[];
  error: string | null;
}

/**
 * Calcule et valide les deux périodes d'1 mois prises de manière disjointe.
 *
 * LÉGISLATION : Articles L1225-46-2 et suivants du Code du Travail (LFSS 2026).
 * Chaque période fait 1 mois calendaire, ne peut pas chevaucher l'autre, et
 * doit rester comprise entre la fin du congé paternité et la date limite légale.
 *
 * @returns blocs valides triés par date de début, accompagnés d'une erreur
 *          contextuelle si la validation échoue.
 */
export function calculateSupplementaryLeaveSplitBlocks(
  firstStartDate: Date,
  secondStartDate: Date,
  earliestStartDate: Date,
  limitDate: Date
): SupplementaryLeaveSplitValidation {
  const normalizedFirst = startOfDay(firstStartDate);
  const normalizedSecond = startOfDay(secondStartDate);
  const normalizedEarliest = startOfDay(earliestStartDate);
  const normalizedLimit = startOfDay(limitDate);

  if (isBefore(normalizedFirst, normalizedEarliest) || isBefore(normalizedSecond, normalizedEarliest)) {
    return {
      valid: false,
      blocks: [],
      error: 'Chaque période doit débuter après la fin du congé paternité.'
    };
  }

  const firstBlock = calculateSupplementaryLeavePeriod(normalizedFirst, 1);
  const secondBlock = calculateSupplementaryLeavePeriod(normalizedSecond, 1);

  if (isAfter(firstBlock.end, normalizedLimit) || isAfter(secondBlock.end, normalizedLimit)) {
    return {
      valid: false,
      blocks: [],
      error: 'Une des périodes dépasse la date limite légale de prise.'
    };
  }

  if (hasOverlap(firstBlock.start, firstBlock.end, secondBlock.start, secondBlock.end)) {
    return {
      valid: false,
      blocks: [],
      error: 'Les deux périodes d\'1 mois ne peuvent pas se chevaucher.'
    };
  }

  const ordered = [firstBlock, secondBlock].sort(
    (a, b) => a.start.getTime() - b.start.getTime()
  );

  return { valid: true, blocks: ordered, error: null };
}
