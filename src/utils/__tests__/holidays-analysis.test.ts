import { describe, expect, it } from 'vitest';
import {
  countWorkingDaysInRange,
  countWeekendsInRange,
  countHolidaysInRange,
  analyzePeriod
} from '../holidays';

describe('countWorkingDaysInRange', () => {
  it('compte correctement les jours ouvres dans une semaine normale', () => {
    // Lundi 8 janvier au vendredi 12 janvier 2024
    const start = new Date(2024, 0, 8); // Lundi
    const end = new Date(2024, 0, 12);   // Vendredi
    
    const count = countWorkingDaysInRange(start, end);
    expect(count).toBe(5); // 5 jours ouvres
  });

  it('exclut les weekends du comptage', () => {
    // Vendredi 12 janvier au lundi 15 janvier 2024
    const start = new Date(2024, 0, 12); // Vendredi
    const end = new Date(2024, 0, 15);   // Lundi
    
    const count = countWorkingDaysInRange(start, end);
    expect(count).toBe(2); // Vendredi + Lundi (pas samedi/dimanche)
  });

  it('exclut le 1er janvier (Jour de l\'An)', () => {
    // 1er janvier 2024 (lundi ferie) au 3 janvier
    const start = new Date(2024, 0, 1); // Lundi ferie
    const end = new Date(2024, 0, 3);   // Mercredi
    
    const count = countWorkingDaysInRange(start, end);
    expect(count).toBe(2); // Mardi 2 + Mercredi 3 (pas lundi 1er ferie)
  });

  it('exclut Noel (25 decembre)', () => {
    // 23 decembre (lundi) au 27 decembre 2024 (vendredi)
    const start = new Date(2024, 11, 23); // Lundi
    const end = new Date(2024, 11, 27);   // Vendredi
    
    const count = countWorkingDaysInRange(start, end);
    // Lun 23, Mar 24, (Mer 25 = Noel ferie), Jeu 26, Ven 27
    // = 4 jours ouvres (exclut 25)
    expect(count).toBe(4);
  });
});

describe('countWeekendsInRange', () => {
  it('compte correctement les weekends dans une semaine', () => {
    // Lundi 8 janvier au dimanche 14 janvier 2024
    const start = new Date(2024, 0, 8);  // Lundi
    const end = new Date(2024, 0, 14);   // Dimanche
    
    const count = countWeekendsInRange(start, end);
    expect(count).toBe(2); // Samedi 13 + Dimanche 14
  });

  it('compte zero weekends dans une semaine de travail', () => {
    // Lundi 8 janvier au vendredi 12 janvier 2024
    const start = new Date(2024, 0, 8);  // Lundi
    const end = new Date(2024, 0, 12);   // Vendredi
    
    const count = countWeekendsInRange(start, end);
    expect(count).toBe(0);
  });

  it('compte 4 weekends sur 2 semaines completes', () => {
    // Lundi 8 janvier au dimanche 21 janvier 2024
    const start = new Date(2024, 0, 8);  // Lundi
    const end = new Date(2024, 0, 21);   // Dimanche
    
    const count = countWeekendsInRange(start, end);
    expect(count).toBe(4); // 2 samedis + 2 dimanches
  });
});

describe('countHolidaysInRange', () => {
  it('detecte le 1er janvier', () => {
    const start = new Date(2024, 0, 1);
    const end = new Date(2024, 0, 5);
    
    const count = countHolidaysInRange(start, end);
    expect(count).toBe(1); // 1er janvier
  });

  it('detecte le 25 decembre (Noel)', () => {
    const start = new Date(2024, 11, 20);
    const end = new Date(2024, 11, 30);
    
    const count = countHolidaysInRange(start, end);
    expect(count).toBe(1); // 25 decembre
  });

  it('detecte le 14 juillet (Fete nationale)', () => {
    const start = new Date(2024, 6, 10);
    const end = new Date(2024, 6, 20);
    
    const count = countHolidaysInRange(start, end);
    expect(count).toBe(1); // 14 juillet
  });

  it('detecte plusieurs feries consecutifs (Noel + Jour de l\'An)', () => {
    // 20 decembre 2024 au 5 janvier 2025
    const start = new Date(2024, 11, 20);
    const end = new Date(2025, 0, 5);
    
    const count = countHolidaysInRange(start, end);
    expect(count).toBe(2); // 25 dec + 1er jan
  });

  it('compte zero feries dans une periode normale', () => {
    // Semaine normale en fevrier
    const start = new Date(2024, 1, 5);
    const end = new Date(2024, 1, 9);
    
    const count = countHolidaysInRange(start, end);
    expect(count).toBe(0);
  });
});

describe('analyzePeriod', () => {
  it('analyse correctement une semaine de travail normale', () => {
    // Lundi 8 janvier au vendredi 12 janvier 2024
    const start = new Date(2024, 0, 8);
    const end = new Date(2024, 0, 12);
    
    const analysis = analyzePeriod(start, end);
    
    expect(analysis.calendarDays).toBe(5);
    expect(analysis.workingDays).toBe(5);
    expect(analysis.weekendDays).toBe(0);
    expect(analysis.holidayDays).toBe(0);
    expect(analysis.workingDaysPercentage).toBe(100);
  });

  it('analyse une periode incluant un weekend', () => {
    // Vendredi 12 au lundi 15 janvier 2024
    const start = new Date(2024, 0, 12);
    const end = new Date(2024, 0, 15);
    
    const analysis = analyzePeriod(start, end);
    
    expect(analysis.calendarDays).toBe(4);
    expect(analysis.workingDays).toBe(2); // Ven + Lun
    expect(analysis.weekendDays).toBe(2);  // Sam + Dim
    expect(analysis.holidayDays).toBe(0);
    expect(analysis.workingDaysPercentage).toBe(50);
  });

  it('analyse la periode de Noel (cas reel)', () => {
    // 23 decembre au 2 janvier (incluant Noel + Jour de l\'An + weekends)
    const start = new Date(2024, 11, 23); // Lundi 23 dec
    const end = new Date(2025, 0, 2);     // Jeudi 2 jan
    
    const analysis = analyzePeriod(start, end);
    
    expect(analysis.calendarDays).toBe(11);
    // Weekends : 28-29 dec (samedi-dimanche)
    expect(analysis.weekendDays).toBe(2); // Sam 28, Dim 29
    // Feries : 25 dec (Noel), 1er jan (Jour de l\'An)
    expect(analysis.holidayDays).toBe(2);
    // Jours ouvres : 7 jours sur 11 = 63%
    expect(analysis.workingDays).toBeGreaterThanOrEqual(5);
    // Ne genere pas d'avertissement car > 60%
    expect(analysis.workingDaysPercentage).toBeGreaterThanOrEqual(60);
  });

  it('analyse un bloc de 21 jours calendaires typique', () => {
    // 21 jours du lundi 8 janvier au dimanche 28 janvier 2024
    const start = new Date(2024, 0, 8);
    const end = new Date(2024, 0, 28);
    
    const analysis = analyzePeriod(start, end);
    
    expect(analysis.calendarDays).toBe(21);
    // 3 semaines = 6 weekends
    expect(analysis.weekendDays).toBe(6);
    // Pas de feries en janvier (hors 1er)
    expect(analysis.holidayDays).toBe(0);
    // 21 - 6 weekends = 15 jours ouvres
    expect(analysis.workingDays).toBe(15);
    expect(Math.round(analysis.workingDaysPercentage)).toBe(71);
  });
});

describe('Cas edge : periodes problematiques', () => {
  it('detecte une periode de vacances de Noel defavorable (beaucoup de jours perdus)', () => {
    // Du 20 decembre au 5 janvier (17 jours calendaires)
    const start = new Date(2024, 11, 20);
    const end = new Date(2025, 0, 5);
    
    const analysis = analyzePeriod(start, end);
    
    expect(analysis.calendarDays).toBe(17);
    // Weekends : 21-22 dec, 28-29 dec, 4-5 jan = 6 jours
    expect(analysis.weekendDays).toBeGreaterThanOrEqual(4);
    // Feries : 25 dec + 1er jan
    expect(analysis.holidayDays).toBe(2);
    // Pourcentage de jours ouvres faible
    expect(analysis.workingDaysPercentage).toBeLessThan(60);
  });

  it('detecte une periode autour de Paques (feries mobiles)', () => {
    // Paques 2024 = 31 mars (dimanche)
    // Lundi de Paques = 1er avril (ferie)
    const start = new Date(2024, 2, 30); // Samedi 30 mars
    const end = new Date(2024, 3, 4);    // Jeudi 4 avril
    
    const analysis = analyzePeriod(start, end);
    
    // Du 30 mars au 4 avril = 5 jours (calcul de différence)
    expect(analysis.calendarDays).toBe(5);
    // Feries : Lundi de Paques (1er avril)
    expect(analysis.holidayDays).toBe(1);
    // Weekends : 30-31 mars
    expect(analysis.weekendDays).toBeGreaterThanOrEqual(2);
  });

  it('periode favorable : que des jours ouvres (theorique)', () => {
    // 5 jours ouvres consecutifs
    const start = new Date(2024, 1, 5);  // Lundi
    const end = new Date(2024, 1, 9);    // Vendredi
    
    const analysis = analyzePeriod(start, end);
    
    expect(analysis.calendarDays).toBe(5);
    expect(analysis.workingDays).toBe(5);
    expect(analysis.weekendDays).toBe(0);
    expect(analysis.holidayDays).toBe(0);
    expect(analysis.workingDaysPercentage).toBe(100);
  });

  it('pire cas : bloc de 7 jours incluant 2 weekends complets', () => {
    // Du samedi au vendredi suivant
    const start = new Date(2024, 1, 10); // Samedi
    const end = new Date(2024, 1, 16);   // Vendredi
    
    const analysis = analyzePeriod(start, end);
    
    expect(analysis.calendarDays).toBe(7);
    expect(analysis.weekendDays).toBe(2); // Sam 10 + Dim 11
    expect(analysis.workingDays).toBe(5); // Lun-Ven
    expect(Math.round(analysis.workingDaysPercentage)).toBe(71);
  });
});

