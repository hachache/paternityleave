import { addDays, addMonths, differenceInDays, isAfter, isBefore, isSameDay, startOfDay } from 'date-fns';
import { isWorkingDay, isWorkableDay, analyzePeriod } from './holidays';

export interface LeaveBlock {
  start: Date;
  end: Date;
  days: number;
  type: 'employer' | 'mandatory' | 'remaining' | 'supplementary';
  workingDatesOnly?: Date[]; // Pour la période employeur : stocke uniquement les jours ouvrés
}

export type LeaveScenarioId =
  | 'standard'
  | 'multiple-births'
  | 'hospitalized-newborn';

export interface LeaveScenarioConfig {
  id: LeaveScenarioId;
  label: string;
  description: string;
  fractionableDays: number;
  limitMonthsAfterBirth: number;
}

/**
 * Configuration des scénarios de congé de paternité selon la législation française.
 * 
 * LÉGISLATION : Articles L1225-35 et suivants du Code du travail (depuis 1er juillet 2021)
 * 
 * STRUCTURE COMPLETE DU CONGE :
 * 1. Conge de naissance : 3 jours OUVRABLES (lundi-samedi hors feries) a charge employeur
 * 2. Conge obligatoire : 4 jours CALENDAIRES immediatement apres
 * 3. Conge fractionnable : 21 ou 28 jours CALENDAIRES selon situation
 * 
 * IMPORTANT : Les jours fractionnables sont CALENDAIRES
 * - Ils incluent les samedis, dimanches et jours feries
 * - Minimum 5 jours calendaires par bloc
 * - A prendre en 1 ou 2 periodes maximum
 * 
 * SECTEUR : Secteur prive uniquement
 * - Secteur public (fonction publique) : regles differentes
 * - Certaines conventions collectives : jours supplementaires possibles
 */
export const LEAVE_SCENARIOS: Record<LeaveScenarioId, LeaveScenarioConfig> = {
  standard: {
    id: 'standard',
    label: 'Naissance simple',
    description: '21 jours calendaires fractionnables a prendre dans les 6 mois suivant la naissance.',
    fractionableDays: 21,
    limitMonthsAfterBirth: 6
  },
  'multiple-births': {
    id: 'multiple-births',
    label: 'Naissances multiples',
    description: '28 jours calendaires fractionnables (7 jours supplementaires) a prendre dans les 6 mois.',
    fractionableDays: 28,
    limitMonthsAfterBirth: 6
  },
  'hospitalized-newborn': {
    id: 'hospitalized-newborn',
    label: 'Hospitalisation du nouveau-ne',
    description: '21 jours calendaires fractionnables. Les reports ou conges specifiques lies a une hospitalisation doivent etre verifies avec la CPAM ou l’employeur.',
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

/**
 * Trouve le prochain jour ouvre (lundi-vendredi hors feries).
 * Utilise pour les calculs de jours ouvres.
 */
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

/**
 * Trouve le prochain jour ouvrable (lundi-samedi hors feries et dimanche).
 * Utilise pour le conge de naissance a charge de l'employeur.
 * 
 * @legal Article L1225-35-3 du Code du travail
 */
export function getNextWorkableDay(date: Date): Date {
  let current = startOfDay(date);

  if (isWorkableDay(current)) {
    return current;
  }

  current = addDays(current, 1);
  while (!isWorkableDay(current)) {
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

/**
 * Calcule la periode de conge de naissance a charge de l'employeur.
 * 
 * LEGISLATION : Article L1225-35-3 du Code du travail (France)
 * - 3 jours OUVRABLES (lundi a samedi, hors feries et dimanche)
 * - Pris immediatement apres la naissance
 * - Ne peut pas etre fractionne
 * - A la charge de l'employeur (remuneration complete)
 * - Commence le premier jour ouvrable apres la naissance
 * 
 * IMPORTANT : Jours ouvrables != jours ouvres
 * - Ouvrables = lundi-samedi (samedi INCLUS)
 * - Ouvres = lundi-vendredi (samedi EXCLU)
 * 
 * @param birthDate Date de naissance (peut etre week-end ou jour ferie)
 * @returns LeaveBlock avec 3 jours ouvrables stockes dans workingDatesOnly
 */
export function calculateEmployerPeriod(birthDate: Date): LeaveBlock {
  let start = startOfDay(birthDate);

  if (!isWorkableDay(start)) {
    start = getNextWorkableDay(start);
  }

  // Collecter les 3 jours ouvrables individuels (lundi-samedi hors fériés)
  const workableDates: Date[] = [];
  let current = start;

  while (workableDates.length < 3) {
    if (isWorkableDay(current)) {
      workableDates.push(new Date(current));
    }
    if (workableDates.length < 3) {
      current = addDays(current, 1);
    }
  }

  const end = workableDates[workableDates.length - 1];

  return {
    start,
    end,
    days: 3,
    type: 'employer',
    workingDatesOnly: workableDates // Note: contient des jours ouvrables (lundi-samedi)
  };
}

/**
 * Calcule la periode obligatoire immediate.
 * 
 * LÉGISLATION : Article L1225-35-1 du Code du travail
 * - 4 jours CALENDAIRES obligatoires (incluant weekends et feries)
 * - Debut : jour calendaire suivant la fin du conge de naissance employeur
 * - Non modifiable, non reportable, non fractionnable
 * - A la charge de la securite sociale (indemnites journalieres)
 * 
 * @param employerEnd Date de fin du conge de naissance (dernier jour ouvrable)
 * @returns LeaveBlock avec 4 jours calendaires consecutifs
 */
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

/**
 * Valide un bloc de congé fractionnable.
 * 
 * LEGISLATION : Les jours fractionnables sont CALENDAIRES
 * - Incluent les samedis, dimanches et jours feries
 * - Minimum 5 jours calendaires consecutifs par bloc
 * - Maximum 2 blocs (donc minimum 5j + 5j si 2 blocs)
 * - A prendre dans le delai legal de 6 mois, sauf report specifique justifie
 * 
 * @returns { valid: boolean, error?: string, warning?: string, analysis? } Resultat de validation
 */
export function validateRemainingBlock(
  start: Date,
  end: Date,
  birthDate: Date,
  employerPeriod: LeaveBlock | null,
  mandatoryPeriod: LeaveBlock | null,
  existingBlocks: LeaveBlock[],
  totalUsedDays: number,
  scenario: LeaveScenarioConfig
): { valid: boolean; error?: string; warning?: string; analysis?: ReturnType<typeof analyzePeriod> } {
  const usageLimit = getLimitDate(birthDate, scenario.limitMonthsAfterBirth);
  const eventName = 'la naissance';

  // Les jours fractionnables ne peuvent pas être posés AVANT la naissance
  if (isBefore(start, birthDate)) {
    return { valid: false, error: `Les jours fractionnables ne peuvent pas être posés avant ${eventName}` };
  }

  if (isAfter(end, usageLimit)) {
    return {
      valid: false,
      error: `Les jours doivent être pris dans les ${scenario.limitMonthsAfterBirth} mois suivant ${eventName}`
    };
  }

  // IMPORTANT : Jours CALENDAIRES (incluant weekends et fériés)
  const calendarDays = differenceInDays(end, start) + 1;
  if (calendarDays < 5) {
    return { valid: false, error: 'Chaque bloc doit contenir au moins 5 jours calendaires consécutifs (weekends et fériés inclus)' };
  }

  const remaining = scenario.fractionableDays - totalUsedDays;
  if (calendarDays > remaining) {
    return {
      valid: false,
      error: `Ce bloc dépasse les ${scenario.fractionableDays} jours calendaires disponibles (${remaining} jours restants)`
    };
  }

  if (employerPeriod && hasOverlap(start, end, employerPeriod.start, employerPeriod.end)) {
    return { valid: false, error: 'Ce bloc chevauche la période de congé de naissance (employeur)' };
  }

  if (mandatoryPeriod && hasOverlap(start, end, mandatoryPeriod.start, mandatoryPeriod.end)) {
    return { valid: false, error: 'Ce bloc chevauche la période obligatoire' };
  }

  for (const block of existingBlocks) {
    if (hasOverlap(start, end, block.start, block.end)) {
      return { valid: false, error: 'Ce bloc chevauche un bloc existant' };
    }
  }

  // Analyse de la periode pour detecter les weekends/feries
  const analysis = analyzePeriod(start, end);
  
  // Avertissement si beaucoup de weekends/feries (< 60% de jours ouvres)
  let warning: string | undefined;
  
  if (analysis.workingDaysPercentage < 60) {
    const lostDays = analysis.calendarDays - analysis.workingDays;
    warning = `Attention : Ce bloc contient ${lostDays} jour(s) de weekend/feries. Vous posez ${analysis.calendarDays} jours calendaires mais ne travaillez reellement que ${analysis.workingDays} jours.`;
  } else if (analysis.holidayDays > 0) {
    warning = `Info : Ce bloc contient ${analysis.holidayDays} jour(s) ferie(s). Les jours calendaires incluent les feries (c'est normal).`;
  }

  return { valid: true, warning, analysis };
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
