import { getEasterDate, getFrenchHolidays, isWorkableDay, isWorkingDay, isWeekend } from '../holidays';

describe('getEasterDate', () => {
  // Dates de Pâques vérifiées (source: calendrier liturgique officiel)
  const knownEasters = [
    { year: 2024, month: 3, day: 31 }, // Dimanche 31 mars 2024
    { year: 2025, month: 4, day: 20 }, // Dimanche 20 avril 2025
    { year: 2026, month: 4, day: 5 },  // Dimanche 5 avril 2026
    { year: 2027, month: 3, day: 28 }, // Dimanche 28 mars 2027
  ];

  knownEasters.forEach(({ year, month, day }) => {
    it(`calcule Pâques ${year} correctement (${day}/${month}/${year})`, () => {
      const easter = getEasterDate(year);
      expect(easter.getFullYear()).toBe(year);
      expect(easter.getMonth()).toBe(month - 1); // getMonth() est 0-indexé
      expect(easter.getDate()).toBe(day);
    });
  });
});

describe('getFrenchHolidays', () => {
  it('retourne exactement 11 jours fériés français', () => {
    const holidays = getFrenchHolidays(2024);
    expect(holidays.length).toBe(11);
  });

  it('inclut le 1er janvier (Jour de l\'An)', () => {
    const holidays = getFrenchHolidays(2024);
    const hasNewYear = holidays.some(
      h => h.getDate() === 1 && h.getMonth() === 0
    );
    expect(hasNewYear).toBe(true);
  });

  it('inclut le 25 décembre (Noël)', () => {
    const holidays = getFrenchHolidays(2024);
    const hasChristmas = holidays.some(
      h => h.getDate() === 25 && h.getMonth() === 11
    );
    expect(hasChristmas).toBe(true);
  });

  it('inclut le 14 juillet (Fête nationale)', () => {
    const holidays = getFrenchHolidays(2024);
    const hasBastilleDay = holidays.some(
      h => h.getDate() === 14 && h.getMonth() === 6
    );
    expect(hasBastilleDay).toBe(true);
  });
});

describe('isWeekend', () => {
  it('identifie le samedi comme weekend', () => {
    const saturday = new Date(2024, 0, 6); // 6 janvier 2024 = samedi
    expect(isWeekend(saturday)).toBe(true);
  });

  it('identifie le dimanche comme weekend', () => {
    const sunday = new Date(2024, 0, 7); // 7 janvier 2024 = dimanche
    expect(isWeekend(sunday)).toBe(true);
  });

  it('identifie le lundi comme jour de semaine', () => {
    const monday = new Date(2024, 0, 8); // 8 janvier 2024 = lundi
    expect(isWeekend(monday)).toBe(false);
  });
});

describe('isWorkingDay', () => {
  it('identifie un lundi normal comme jour ouvré', () => {
    const monday = new Date(2024, 0, 8); // 8 janvier 2024 = lundi
    expect(isWorkingDay(monday)).toBe(true);
  });

  it('exclut le samedi des jours ouvrés', () => {
    const saturday = new Date(2024, 0, 6); // 6 janvier 2024 = samedi
    expect(isWorkingDay(saturday)).toBe(false);
  });

  it('exclut le dimanche des jours ouvrés', () => {
    const sunday = new Date(2024, 0, 7); // 7 janvier 2024 = dimanche
    expect(isWorkingDay(sunday)).toBe(false);
  });

  it('exclut le 1er janvier (jour férié) des jours ouvrés', () => {
    const newYear = new Date(2024, 0, 1); // 1er janvier 2024 = lundi férié
    expect(isWorkingDay(newYear)).toBe(false);
  });

  it('exclut le 25 décembre (Noël) des jours ouvrés', () => {
    const christmas = new Date(2024, 11, 25); // 25 décembre 2024 = mercredi férié
    expect(isWorkingDay(christmas)).toBe(false);
  });
});

describe('isWorkableDay', () => {
  it('identifie un lundi normal comme jour ouvrable', () => {
    const monday = new Date(2024, 0, 8); // 8 janvier 2024 = lundi
    expect(isWorkableDay(monday)).toBe(true);
  });

  it('INCLUT le samedi dans les jours ouvrables (différence clé avec isWorkingDay)', () => {
    const saturday = new Date(2024, 0, 6); // 6 janvier 2024 = samedi
    expect(isWorkableDay(saturday)).toBe(true);
    expect(isWorkingDay(saturday)).toBe(false); // Comparaison
  });

  it('exclut le dimanche des jours ouvrables', () => {
    const sunday = new Date(2024, 0, 7); // 7 janvier 2024 = dimanche
    expect(isWorkableDay(sunday)).toBe(false);
  });

  it('exclut le 1er janvier (jour férié) des jours ouvrables', () => {
    const newYear = new Date(2024, 0, 1); // 1er janvier 2024 = lundi férié
    expect(isWorkableDay(newYear)).toBe(false);
  });

  it('exclut le 25 décembre (Noël) même si samedi', () => {
    const christmas = new Date(2021, 11, 25); // 25 décembre 2021 = samedi férié
    expect(isWorkableDay(christmas)).toBe(false);
  });

  it('identifie tous les jours lundi-vendredi normaux comme ouvrables', () => {
    // Semaine du 8 au 12 janvier 2024 (pas de fériés)
    const monday = new Date(2024, 0, 8);
    const tuesday = new Date(2024, 0, 9);
    const wednesday = new Date(2024, 0, 10);
    const thursday = new Date(2024, 0, 11);
    const friday = new Date(2024, 0, 12);

    expect(isWorkableDay(monday)).toBe(true);
    expect(isWorkableDay(tuesday)).toBe(true);
    expect(isWorkableDay(wednesday)).toBe(true);
    expect(isWorkableDay(thursday)).toBe(true);
    expect(isWorkableDay(friday)).toBe(true);
  });
});

