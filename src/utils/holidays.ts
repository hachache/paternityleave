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
  return day === 0;
}

export function isFrenchHoliday(date: Date, holidays: Date[]): boolean {
  return holidays.some(holiday =>
    holiday.getDate() === date.getDate() &&
    holiday.getMonth() === date.getMonth() &&
    holiday.getFullYear() === date.getFullYear()
  );
}

export function isWorkingDay(date: Date): boolean {
  const year = getYear(date);
  const holidays = getFrenchHolidays(year);
  return !isWeekend(date) && !isFrenchHoliday(date, holidays);
}
