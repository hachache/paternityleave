import { addDays, addMonths, isAfter, isBefore, startOfDay } from 'date-fns';
import { LeaveBlock, LeaveScenarioConfig, countCalendarDays } from './paternityLeave';

export type SupplementaryLeaveDuration = 1 | 2;

export interface SupplementaryLeaveEligibility {
  isEligibleBirthDate: boolean;
  isAvailableNow: boolean;
  canActivate: boolean;
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

export function getSupplementaryLeaveEligibility(
  birthDate: Date | null,
  scenario?: LeaveScenarioConfig,
  today: Date = new Date()
): SupplementaryLeaveEligibility {
  const normalizedToday = startOfDay(today);
  const isAvailableNow = !isBefore(normalizedToday, SUPPLEMENTARY_LEAVE_ACTIVATION_DATE);

  if (!birthDate) {
    return {
      isEligibleBirthDate: false,
      isAvailableNow,
      canActivate: false,
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
