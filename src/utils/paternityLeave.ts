import { addDays, differenceInDays, isAfter, isBefore, isSameDay, startOfDay } from 'date-fns';
import { isWorkingDay } from './holidays';

export interface LeaveBlock {
  start: Date;
  end: Date;
  days: number;
  type: 'employer' | 'mandatory' | 'remaining';
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

  if (isWorkingDay(current)) {
    count = 1;
  }

  while (count < days) {
    current = addDays(current, 1);
    if (isWorkingDay(current)) {
      count++;
    }
  }

  return current;
}

export function calculateEmployerPeriod(birthDate: Date): LeaveBlock {
  let start = startOfDay(birthDate);

  if (!isWorkingDay(start)) {
    start = getNextWorkingDay(start);
  }

  const end = addWorkingDays(start, 3);

  return {
    start,
    end,
    days: 3,
    type: 'employer'
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

export function validateRemainingBlock(
  start: Date,
  end: Date,
  birthDate: Date,
  employerPeriod: LeaveBlock | null,
  mandatoryPeriod: LeaveBlock | null,
  existingBlocks: LeaveBlock[],
  totalUsedDays: number
): { valid: boolean; error?: string } {
  const sixMonthsLimit = addDays(birthDate, 180);

  if (isAfter(end, sixMonthsLimit)) {
    return { valid: false, error: 'Les jours doivent être pris dans les 6 mois suivant la naissance' };
  }

  const calendarDays = differenceInDays(end, start) + 1;
  if (calendarDays < 5) {
    return { valid: false, error: 'Chaque bloc doit contenir au moins 5 jours calendaires consécutifs' };
  }

  if (totalUsedDays + calendarDays > 21) {
    return { valid: false, error: `Ce bloc dépasse les 21 jours disponibles (${21 - totalUsedDays} jours restants)` };
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

export function isDateInRange(date: Date, start: Date, end: Date): boolean {
  const d = startOfDay(date);
  const s = startOfDay(start);
  const e = startOfDay(end);
  return (isSameDay(d, s) || isAfter(d, s)) && (isSameDay(d, e) || isBefore(d, e));
}

export function calculateAutomaticRemainingPeriod(
  birthDate: Date,
  startDateOrMandatoryEnd: Date,
  daysNeeded: number = 21
): LeaveBlock | null {
  const sixMonthsLimit = addDays(birthDate, 180);
  // Si la date fournie est déjà une date de début valide, on l'utilise directement
  // Sinon, on considère que c'est la fin de la période obligatoire
  let start = startOfDay(startDateOrMandatoryEnd);

  if (isAfter(start, sixMonthsLimit)) {
    return null;
  }

  const end = addDays(start, daysNeeded - 1);

  if (isAfter(end, sixMonthsLimit)) {
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
  blocksConfig: number[]
): LeaveBlock[] {
  const sixMonthsLimit = addDays(birthDate, 180);
  const blocks: LeaveBlock[] = [];
  let currentStart = addDays(mandatoryEnd, 1);

  for (const blockDays of blocksConfig) {
    if (blockDays < 5) continue;

    if (isAfter(currentStart, sixMonthsLimit)) {
      break;
    }

    const end = addDays(currentStart, blockDays - 1);

    if (isAfter(end, sixMonthsLimit)) {
      break;
    }

    blocks.push({
      start: currentStart,
      end,
      days: blockDays,
      type: 'remaining'
    });

    currentStart = addDays(end, 1);
  }

  return blocks;
}
