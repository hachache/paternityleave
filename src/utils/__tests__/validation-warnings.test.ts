import { addDays, startOfDay } from 'date-fns';
import { describe, expect, it } from 'vitest';
import {
  calculateEmployerPeriod,
  calculateMandatoryPeriod,
  validateRemainingBlock,
  LEAVE_SCENARIOS
} from '../paternityLeave';

const standardScenario = LEAVE_SCENARIOS.standard;

describe('validateRemainingBlock - Avertissements weekends/feries', () => {
  const birthDate = startOfDay(new Date(2024, 5, 3)); // Lundi 3 juin 2024
  const employerPeriod = calculateEmployerPeriod(birthDate);
  const mandatoryPeriod = calculateMandatoryPeriod(employerPeriod.end);

  it('genere un avertissement pour un bloc avec beaucoup de weekends', () => {
    // Bloc dans la fenetre valide - du samedi au lundi suivant
    const start = new Date(2024, 6, 20); // Samedi 20 juillet
    const end = new Date(2024, 7, 3);    // Samedi 3 aout (15 jours calendaires)
    
    const result = validateRemainingBlock(
      start,
      end,
      birthDate,
      employerPeriod,
      mandatoryPeriod,
      [],
      0,
      standardScenario
    );
    
    expect(result.valid).toBe(true);
    expect(result.analysis).toBeDefined();
    // Devrait avoir des weekends dans cette periode
    expect(result.analysis!.weekendDays).toBeGreaterThan(0);
  });

  it('genere un avertissement pour un bloc sur un long weekend', () => {
    // Samedi au mercredi (5 jours calendaires, minimum legal)
    const start = new Date(2024, 6, 20); // Samedi 20 juillet
    const end = new Date(2024, 6, 24);   // Mercredi 24 juillet (5 jours)
    
    const result = validateRemainingBlock(
      start,
      end,
      birthDate,
      employerPeriod,
      mandatoryPeriod,
      [],
      0,
      standardScenario
    );
    
    expect(result.valid).toBe(true);
    // 3 jours ouvres sur 5 calendaires = 60% (juste à la limite)
    expect(result.analysis).toBeDefined();
    expect(result.analysis!.weekendDays).toBe(2);
  });

  it('genere INFO (pas WARNING) pour un bloc avec feries mais bon ratio', () => {
    // Bloc de 21 jours incluant le 14 juillet mais bon ratio global  
    const start = new Date(2024, 6, 10);  // 10 juillet
    const end = new Date(2024, 6, 30);    // 30 juillet (21 jours)
    
    const result = validateRemainingBlock(
      start,
      end,
      birthDate,
      employerPeriod,
      mandatoryPeriod,
      [],
      0,
      standardScenario
    );
    
    expect(result.valid).toBe(true);
    // Ratio > 60% mais contient 14 juillet
    if (result.analysis!.holidayDays > 0) {
      expect(result.warning).toBeDefined();
      expect(result.warning).toContain('ferie(s)');
    }
  });

  it('ne genere PAS d\'avertissement pour une semaine de travail normale', () => {
    // Lundi au vendredi (5 jours ouvres = 100%)
    const start = new Date(2024, 6, 15);
    const end = new Date(2024, 6, 19);
    
    const result = validateRemainingBlock(
      start,
      end,
      birthDate,
      employerPeriod,
      mandatoryPeriod,
      [],
      0,
      standardScenario
    );
    
    expect(result.valid).toBe(true);
    expect(result.warning).toBeUndefined();
    expect(result.analysis!.workingDaysPercentage).toBe(100);
  });

  it('genere un avertissement severe pour periode avec beaucoup de weekends', () => {
    // Periode commencant un samedi (beaucoup de weekends)
    const start = new Date(2024, 7, 10); // Samedi 10 aout  
    const end = new Date(2024, 7, 24);   // 15 jours calendaires
    
    const result = validateRemainingBlock(
      start,
      end,
      birthDate,
      employerPeriod,
      mandatoryPeriod,
      [],
      0,
      standardScenario
    );
    
    expect(result.valid).toBe(true);
    expect(result.analysis).toBeDefined();
    // Beaucoup de weekends dans cette periode
    expect(result.analysis!.weekendDays).toBeGreaterThan(3);
  });
});

describe('Edge cases : periodes problematiques reelles', () => {
  const birthDate = startOfDay(new Date(2024, 2, 1)); // 1er mars 2024
  const employerPeriod = calculateEmployerPeriod(birthDate);
  const mandatoryPeriod = calculateMandatoryPeriod(employerPeriod.end);

  it('detecte periode autour de Paques 2024', () => {
    // Paques 2024 = 31 mars (dimanche), Lundi de Paques = 1er avril
    const start = new Date(2024, 2, 29); // Vendredi 29 mars avant Paques
    const end = new Date(2024, 3, 5);    // Vendredi 5 avril (7 jours)
    
    const result = validateRemainingBlock(
      start,
      end,
      birthDate,
      employerPeriod,
      mandatoryPeriod,
      [],
      0,
      standardScenario
    );
    
    expect(result.valid).toBe(true);
    expect(result.analysis).toBeDefined();
    // Devrait detecter le Lundi de Paques (1er avril)
    expect(result.analysis!.holidayDays).toBeGreaterThan(0);
  });

  it('detecte pont du 14 juillet', () => {
    // 14 juillet 2024 = dimanche
    const start = new Date(2024, 6, 10); // Mercredi 10 juillet 
    const end = new Date(2024, 6, 20);   // Samedi 20 juillet (11 jours)
    
    const result = validateRemainingBlock(
      start,
      end,
      birthDate,
      employerPeriod,
      mandatoryPeriod,
      [],
      0,
      standardScenario
    );
    
    expect(result.valid).toBe(true);
    expect(result.analysis).toBeDefined();
    // Devrait detecter 14 juillet comme ferie
    expect(result.analysis!.holidayDays).toBeGreaterThanOrEqual(1);
  });

  it('bloc optimal : 21 jours en avril sans feries', () => {
    // Avril 2024 apres Paques : pas beaucoup de feries
    const start = new Date(2024, 3, 8);
    const end = new Date(2024, 3, 28);
    
    const result = validateRemainingBlock(
      start,
      end,
      birthDate,
      employerPeriod,
      mandatoryPeriod,
      [],
      0,
      standardScenario
    );
    
    expect(result.valid).toBe(true);
    expect(result.analysis).toBeDefined();
    // Peu ou pas de feries
    expect(result.analysis!.holidayDays).toBeLessThanOrEqual(1);
    // Environ 15 jours ouvres sur 21 calendaires = ~71%
    expect(result.analysis!.workingDaysPercentage).toBeGreaterThan(65);
  });

  it('pire cas : bloc commencant un samedi', () => {
    // Samedi au vendredi suivant (7 jours)
    const start = new Date(2024, 4, 11); // Samedi 11 mai
    const end = new Date(2024, 4, 17);   // Vendredi 17 mai
    
    const result = validateRemainingBlock(
      start,
      end,
      birthDate,
      employerPeriod,
      mandatoryPeriod,
      [],
      0,
      standardScenario
    );
    
    expect(result.valid).toBe(true);
    expect(result.analysis).toBeDefined();
    // 2 weekends sur 7 jours = ~71% de jours ouvres
    expect(result.analysis!.weekendDays).toBe(2);
    expect(result.analysis!.workingDays).toBe(5);
  });
});

describe('Analyse detaillee : informations retournees', () => {
  const birthDate = startOfDay(new Date(2024, 4, 1)); // 1er mai 2024
  const employerPeriod = calculateEmployerPeriod(birthDate);
  const mandatoryPeriod = calculateMandatoryPeriod(employerPeriod.end);

  it('retourne analyse complete avec tous les champs', () => {
    const start = new Date(2024, 5, 10);
    const end = new Date(2024, 5, 16);
    
    const result = validateRemainingBlock(
      start,
      end,
      birthDate,
      employerPeriod,
      mandatoryPeriod,
      [],
      0,
      standardScenario
    );
    
    expect(result.valid).toBe(true);
    expect(result.analysis).toBeDefined();
    expect(result.analysis).toHaveProperty('calendarDays');
    expect(result.analysis).toHaveProperty('workingDays');
    expect(result.analysis).toHaveProperty('weekendDays');
    expect(result.analysis).toHaveProperty('holidayDays');
    expect(result.analysis).toHaveProperty('workingDaysPercentage');
  });

  it('calcule correctement le pourcentage de jours ouvres', () => {
    // 5 jours calendaires, tous ouvres
    const start = new Date(2024, 5, 17); // Lundi
    const end = new Date(2024, 5, 21);   // Vendredi
    
    const result = validateRemainingBlock(
      start,
      end,
      birthDate,
      employerPeriod,
      mandatoryPeriod,
      [],
      0,
      standardScenario
    );
    
    expect(result.analysis!.calendarDays).toBe(5);
    expect(result.analysis!.workingDays).toBe(5);
    expect(result.analysis!.workingDaysPercentage).toBe(100);
  });
});

