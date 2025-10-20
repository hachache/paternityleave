import { addDays, addMonths, differenceInDays, isAfter, isBefore, isSameDay, startOfDay } from 'date-fns';
import { isWorkingDay } from './holidays';

export interface LeaveBlock {
  start: Date;
  end: Date;
  days: number;
  type: 'employer' | 'mandatory' | 'remaining';
  workingDatesOnly?: Date[]; // Pour la période employeur : stocke uniquement les jours ouvrés
}

export type LeaveScenarioId =
  | 'standard'
  | 'multiple-births'
  | 'hospitalized-newborn'
  | 'adoption';

export interface LeaveScenarioConfig {
  id: LeaveScenarioId;
  label: string;
  description: string;
  fractionableDays: number;
  limitMonthsAfterBirth: number;
}

export const LEAVE_SCENARIOS: Record<LeaveScenarioId, LeaveScenarioConfig> = {
  standard: {
    id: 'standard',
    label: 'Naissance simple',
    description: '21 jours fractionnables à prendre dans les 6 mois suivant la naissance.',
    fractionableDays: 21,
    limitMonthsAfterBirth: 6
  },
  'multiple-births': {
    id: 'multiple-births',
    label: 'Naissances multiples',
    description: '28 jours fractionnables (7 jours supplémentaires) à prendre dans les 6 mois.',
    fractionableDays: 28,
    limitMonthsAfterBirth: 6
  },
  'hospitalized-newborn': {
    id: 'hospitalized-newborn',
    label: 'Hospitalisation du nouveau-né',
    description: '21 jours fractionnables pouvant être reportés jusqu’à 12 mois après la naissance.',
    fractionableDays: 21,
    limitMonthsAfterBirth: 12
  },
  adoption: {
    id: 'adoption',
    label: 'Adoption',
    description: '21 jours fractionnables à prendre dans les 6 mois suivant l’arrivée de l’enfant.',
    fractionableDays: 21,
    limitMonthsAfterBirth: 6
  }
};

export const DEFAULT_LEAVE_SCENARIO_ID: LeaveScenarioId = 'standard';

export function getLeaveScenarioConfig(
  id: LeaveScenarioId = DEFAULT_LEAVE_SCENARIO_ID
): LeaveScenarioConfig {
  return LEAVE_SCENARIOS[id] ?? LEAVE_SCENARIOS[DEFAULT_LEAVE_SCENARIO_ID];
}

export function getNextWorkingDay(date: Date): Date {
  let current = startOfDay(date);

  if (isWorkingDay(current)) {
    return current;
  }

  current = addDays(current, 1);
  while (!isWorkingDay(current)) {
    current = addDays(current, 1);
  }
  return current;
}

export function addWorkingDays(startDate: Date, days: number): Date {
  let current = startOfDay(startDate);
  let count = 0;

  // Compter les jours ouvrés à partir de startDate (inclus)
  while (count < days) {
    if (isWorkingDay(current)) {
      count++;
    }
    // Si on n'a pas encore atteint le nombre de jours requis, avancer
    if (count < days) {
      current = addDays(current, 1);
    }
  }

  return current;
}

export function calculateEmployerPeriod(birthDate: Date): LeaveBlock {
  let start = startOfDay(birthDate);

  if (!isWorkingDay(start)) {
    start = getNextWorkingDay(start);
  }

  // Collecter les 3 jours ouvrés individuels
  const workingDates: Date[] = [];
  let current = start;

  while (workingDates.length < 3) {
    if (isWorkingDay(current)) {
      workingDates.push(new Date(current));
    }
    if (workingDates.length < 3) {
      current = addDays(current, 1);
    }
  }

  const end = workingDates[workingDates.length - 1];

  return {
    start,
    end,
    days: 3,
    type: 'employer',
    workingDatesOnly: workingDates
  };
}

export function calculateMandatoryPeriod(employerEnd: Date): LeaveBlock {
  const start = addDays(employerEnd, 1);
  const end = addDays(start, 3);

  return {
    start,
    end,
    days: 4,
    type: 'mandatory'
  };
}

export function getLimitDate(birthDate: Date, monthsAfterBirth: number): Date {
  return startOfDay(addMonths(birthDate, monthsAfterBirth));
}

export function getSixMonthsLimit(birthDate: Date): Date {
  return getLimitDate(birthDate, 6);
}

export function validateRemainingBlock(
  start: Date,
  end: Date,
  birthDate: Date,
  employerPeriod: LeaveBlock | null,
  mandatoryPeriod: LeaveBlock | null,
  existingBlocks: LeaveBlock[],
  totalUsedDays: number,
  scenario: LeaveScenarioConfig
): { valid: boolean; error?: string } {
  const usageLimit = getLimitDate(birthDate, scenario.limitMonthsAfterBirth);

  // Les jours fractionnables ne peuvent pas être posés AVANT la naissance
  if (isBefore(start, birthDate)) {
    return { valid: false, error: 'Les jours fractionnables ne peuvent pas être posés avant la date de naissance' };
  }

  if (isAfter(end, usageLimit)) {
    return {
      valid: false,
      error: `Les jours doivent être pris dans les ${scenario.limitMonthsAfterBirth} mois suivant la naissance`
    };
  }

  const calendarDays = differenceInDays(end, start) + 1;
  if (calendarDays < 5) {
    return { valid: false, error: 'Chaque bloc doit contenir au moins 5 jours calendaires consécutifs' };
  }

  const remaining = scenario.fractionableDays - totalUsedDays;
  if (calendarDays > remaining) {
    return {
      valid: false,
      error: `Ce bloc dépasse les ${scenario.fractionableDays} jours disponibles (${remaining} jours restants)`
    };
  }

  if (employerPeriod && hasOverlap(start, end, employerPeriod.start, employerPeriod.end)) {
    return { valid: false, error: 'Ce bloc chevauche la période employeur' };
  }

  if (mandatoryPeriod && hasOverlap(start, end, mandatoryPeriod.start, mandatoryPeriod.end)) {
    return { valid: false, error: 'Ce bloc chevauche la période obligatoire' };
  }

  for (const block of existingBlocks) {
    if (hasOverlap(start, end, block.start, block.end)) {
      return { valid: false, error: 'Ce bloc chevauche un bloc existant' };
    }
  }

  return { valid: true };
}

export function hasOverlap(start1: Date, end1: Date, start2: Date, end2: Date): boolean {
  const s1 = startOfDay(start1);
  const e1 = startOfDay(end1);
  const s2 = startOfDay(start2);
  const e2 = startOfDay(end2);
  return !(isAfter(s1, e2) || isBefore(e1, s2));
}

export function countCalendarDays(start: Date, end: Date): number {
  return differenceInDays(end, start) + 1;
}

export function calculateTotalUsedDays(blocks: LeaveBlock[]): number {
  return blocks.reduce((sum, block) =>
    sum + (differenceInDays(block.end, block.start) + 1), 0
  );
}

export function isDateInRange(date: Date, start: Date, end: Date): boolean {
  const d = startOfDay(date);
  const s = startOfDay(start);
  const e = startOfDay(end);
  return (isSameDay(d, s) || isAfter(d, s)) && (isSameDay(d, e) || isBefore(d, e));
}

export function isDateInBlock(date: Date, block: LeaveBlock): boolean {
  const d = startOfDay(date);

  // Pour la période employeur, vérifier dans workingDatesOnly
  if (block.type === 'employer' && block.workingDatesOnly) {
    return block.workingDatesOnly.some(workingDate =>
      isSameDay(d, startOfDay(workingDate))
    );
  }

  // Pour les autres types, utiliser la logique normale
  return isDateInRange(d, block.start, block.end);
}

export function calculateAutomaticRemainingPeriod(
  birthDate: Date,
  startDateOrMandatoryEnd: Date,
  daysNeeded: number,
  scenario: LeaveScenarioConfig
): LeaveBlock | null {
  const usageLimit = getLimitDate(birthDate, scenario.limitMonthsAfterBirth);
  // Si la date fournie est déjà une date de début valide, on l'utilise directement
  // Sinon, on considère que c'est la fin de la période obligatoire
  const start = startOfDay(startDateOrMandatoryEnd);

  // Les jours fractionnables ne peuvent pas être posés avant la naissance
  if (isBefore(start, birthDate)) {
    return null;
  }

  if (isAfter(start, usageLimit)) {
    return null;
  }

  const end = addDays(start, daysNeeded - 1);

  if (isAfter(end, usageLimit)) {
    return null;
  }

  return {
    start,
    end,
    days: daysNeeded,
    type: 'remaining'
  };
}

export function calculateFractionnedPeriods(
  birthDate: Date,
  mandatoryEnd: Date,
  blocksConfig: number[],
  scenario: LeaveScenarioConfig = getLeaveScenarioConfig()
): { blocks: LeaveBlock[]; error?: string } {
  const usageLimit = getLimitDate(birthDate, scenario.limitMonthsAfterBirth);
  const blocks: LeaveBlock[] = [];

  if (blocksConfig.length === 0) {
    return { blocks, error: 'Configuration de blocs invalide' };
  }

  const firstBlockLength = blocksConfig[0];
  if (firstBlockLength < 5) {
    return { blocks, error: 'Chaque bloc doit contenir au moins 5 jours calendaires consécutifs' };
  }

  const currentStart = addDays(mandatoryEnd, 1);

  if (isAfter(currentStart, usageLimit)) {
    return {
      blocks,
      error: `Impossible de planifier : la période dépasse les ${scenario.limitMonthsAfterBirth} mois après la naissance`
    };
  }

  const end = addDays(currentStart, firstBlockLength - 1);
  if (isAfter(end, usageLimit)) {
    return {
      blocks,
      error: `Impossible de planifier : la période dépasse les ${scenario.limitMonthsAfterBirth} mois après la naissance`
    };
  }

  blocks.push({
    start: currentStart,
    end,
    days: firstBlockLength,
    type: 'remaining'
  });

  return { blocks };
}
