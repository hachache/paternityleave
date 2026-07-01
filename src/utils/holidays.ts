import { getYear } from 'date-fns';

export function getEasterDate(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

export function getFrenchHolidays(year: number): Date[] {
  const holidays: Date[] = [];

  holidays.push(new Date(year, 0, 1));

  const easter = getEasterDate(year);
  holidays.push(new Date(easter.getTime() + 1 * 24 * 60 * 60 * 1000));
  holidays.push(new Date(easter.getTime() + 39 * 24 * 60 * 60 * 1000));
  holidays.push(new Date(easter.getTime() + 50 * 24 * 60 * 60 * 1000));

  holidays.push(new Date(year, 4, 1));
  holidays.push(new Date(year, 4, 8));
  holidays.push(new Date(year, 6, 14));
  holidays.push(new Date(year, 7, 15));
  holidays.push(new Date(year, 10, 1));
  holidays.push(new Date(year, 10, 11));
  holidays.push(new Date(year, 11, 25));

  return holidays;
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function isFrenchHoliday(date: Date, holidays: Date[]): boolean {
  return holidays.some(holiday =>
    holiday.getDate() === date.getDate() &&
    holiday.getMonth() === date.getMonth() &&
    holiday.getFullYear() === date.getFullYear()
  );
}

/**
 * Vérifie si un jour est ouvré (jour travaillé).
 * Jours ouvrés = Lundi à Vendredi, excluant les jours fériés.
 * 
 * @param date Date à vérifier
 * @returns true si le jour est ouvré (lundi-vendredi hors fériés)
 */
export function isWorkingDay(date: Date): boolean {
  const year = getYear(date);
  const holidays = getFrenchHolidays(year);
  return !isWeekend(date) && !isFrenchHoliday(date, holidays);
}

/**
 * Vérifie si un jour est ouvrable (jour légal de travail possible).
 * Jours ouvrables = Lundi à Samedi, excluant les jours fériés.
 * 
 * LÉGISLATION : Utilisé pour le congé de naissance (3 jours ouvrables à charge employeur)
 * selon l'article L1225-35-3 du Code du travail.
 * 
 * @param date Date à vérifier
 * @returns true si le jour est ouvrable (lundi-samedi hors fériés et dimanche)
 */
export function isWorkableDay(date: Date): boolean {
  const year = getYear(date);
  const holidays = getFrenchHolidays(year);
  const day = date.getDay();
  
  // Dimanche = 0, exclure uniquement dimanche (samedi = 6 est ouvrable)
  const isSunday = day === 0;
  
  return !isSunday && !isFrenchHoliday(date, holidays);
}

/**
 * Compte le nombre de jours ouvres (lun-ven hors feries) dans une periode.
 * Utile pour informer l'utilisateur du nombre reel de jours travailles.
 * 
 * @param startDate Date de debut (incluse)
 * @param endDate Date de fin (incluse)
 * @returns Nombre de jours ouvres dans la periode
 */
export function countWorkingDaysInRange(startDate: Date, endDate: Date): number {
  let count = 0;
  const current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    if (isWorkingDay(current)) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }

  return count;
}

/**
 * Compte le nombre de weekends (samedi + dimanche) dans une periode.
 * 
 * @param startDate Date de debut (incluse)
 * @param endDate Date de fin (incluse)
 * @returns Nombre de jours de weekend
 */
export function countWeekendsInRange(startDate: Date, endDate: Date): number {
  let count = 0;
  const current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    if (isWeekend(current)) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }

  return count;
}

/**
 * Compte le nombre de jours feries dans une periode.
 * 
 * @param startDate Date de debut (incluse)
 * @param endDate Date de fin (incluse)
 * @returns Nombre de jours feries
 */
export function countHolidaysInRange(startDate: Date, endDate: Date): number {
  const years = new Set<number>();
  let current = new Date(startDate);
  const end = new Date(endDate);

  // Première passe : collecter les années uniques
  while (current <= end) {
    years.add(current.getFullYear());
    current.setDate(current.getDate() + 1);
  }

  const allHolidays = Array.from(years).flatMap(year => getFrenchHolidays(year));

  // Seconde passe : compter les jours fériés
  let count = 0;
  current = new Date(startDate);
  while (current <= end) {
    if (isFrenchHoliday(current, allHolidays)) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }

  return count;
}

/**
 * Analyse detaillee d'une periode calendaire.
 * Retourne le nombre de jours calendaires, ouvres, weekends et feries.
 * 
 * @param startDate Date de debut (incluse)
 * @param endDate Date de fin (incluse)
 * @returns Analyse complete de la periode
 */
export interface PeriodAnalysis {
  calendarDays: number;
  workingDays: number;
  weekendDays: number;
  holidayDays: number;
  workingDaysPercentage: number;
}

export function analyzePeriod(startDate: Date, endDate: Date): PeriodAnalysis {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Calcul jours calendaires
  const calendarDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  // Calculs detailles
  const workingDays = countWorkingDaysInRange(start, end);
  const weekendDays = countWeekendsInRange(start, end);
  const holidayDays = countHolidaysInRange(start, end);
  
  const workingDaysPercentage = calendarDays > 0 ? (workingDays / calendarDays) * 100 : 0;
  
  return {
    calendarDays,
    workingDays,
    weekendDays,
    holidayDays,
    workingDaysPercentage
  };
}
