import { addMonths, addYears, startOfDay } from 'date-fns';
import { describe, expect, it } from 'vitest';
import { validateBirthDate } from '../dateValidation';
import { calculateEmployerPeriod, calculateMandatoryPeriod } from '../paternityLeave';

describe('Integration : Validation date naissance + calcul periodes', () => {
  const today = startOfDay(new Date());

  it('accepte une date future et calcule correctement les periodes', () => {
    const futureDate = addMonths(today, 3);
    
    // Etape 1 : Validation
    const validation = validateBirthDate(futureDate);
    expect(validation.valid).toBe(true);
    expect(validation.error).toBeUndefined();
    expect(validation.context).toBe('future');
    
    // Etape 2 : Calcul periodes (si validation OK)
    if (validation.valid) {
      const employer = calculateEmployerPeriod(futureDate);
      const mandatory = calculateMandatoryPeriod(employer.end);
      
      expect(employer.days).toBe(3);
      expect(mandatory.days).toBe(4);
    }
  });

  it('accepte aujourd\'hui et calcule les periodes', () => {
    // Etape 1 : Validation
    const validation = validateBirthDate(today);
    expect(validation.valid).toBe(true);
    expect(validation.context).toBe('today');
    expect(validation.warning).toBeUndefined();
    
    // Etape 2 : Calcul periodes
    const employer = calculateEmployerPeriod(today);
    const mandatory = calculateMandatoryPeriod(employer.end);
    
    expect(employer.type).toBe('employer');
    expect(mandatory.type).toBe('mandatory');
  });

  it('accepte une date passee recente avec avertissement', () => {
    const recentPast = addMonths(today, -2);
    
    // Etape 1 : Validation
    const validation = validateBirthDate(recentPast);
    expect(validation.valid).toBe(true);
    expect(validation.context).toBe('past');
    expect(validation.warning).toBeDefined();
    expect(validation.warning).toContain('deja survenue');
    
    // Etape 2 : Meme avec avertissement, on peut calculer les periodes
    const employer = calculateEmployerPeriod(recentPast);
    const mandatory = calculateMandatoryPeriod(employer.end);
    
    expect(employer.days).toBe(3);
    expect(mandatory.days).toBe(4);
  });

  it('accepte une date passee ancienne (7 mois) avec avertissement delai', () => {
    const oldPast = addMonths(today, -7);
    
    // Etape 1 : Validation
    const validation = validateBirthDate(oldPast);
    expect(validation.valid).toBe(true);
    expect(validation.context).toBe('past');
    expect(validation.warning).toBeDefined();
    expect(validation.warning).toContain('6 mois');
    expect(validation.warning).toContain('hospitalisation');
  });

  it('rejette une date trop future et ne calcule pas les periodes', () => {
    const tooFarFuture = addYears(today, 2);
    
    // Etape 1 : Validation
    const validation = validateBirthDate(tooFarFuture);
    expect(validation.valid).toBe(false);
    expect(validation.error).toBeDefined();
    expect(validation.error).toContain('9 mois');
    
    // Etape 2 : Ne devrait PAS calculer les periodes si validation echoue
    // (dans l'app, selectBirthDate() return avant de calculer)
  });

  it('rejette une date trop ancienne et ne calcule pas les periodes', () => {
    const tooOldPast = addYears(today, -2);
    
    // Etape 1 : Validation
    const validation = validateBirthDate(tooOldPast);
    expect(validation.valid).toBe(false);
    expect(validation.error).toBeDefined();
    expect(validation.error).toContain('plus d\'un an');
  });

  describe('Scenarios realistes complets', () => {
    it('Scenario 1 : Pere planifiant 5 mois avant naissance', () => {
      const expectedBirth = addMonths(today, 5);
      
      const validation = validateBirthDate(expectedBirth);
      expect(validation.valid).toBe(true);
      expect(validation.warning).toBeUndefined();
      
      const employer = calculateEmployerPeriod(expectedBirth);
      expect(employer.days).toBe(3);
    });

    it('Scenario 2 : Pere utilisant l\'app le jour de la naissance', () => {
      const validation = validateBirthDate(today);
      expect(validation.valid).toBe(true);
      expect(validation.context).toBe('today');
      
      const employer = calculateEmployerPeriod(today);
      const mandatory = calculateMandatoryPeriod(employer.end);
      
      // Calcul correct des periodes
      expect(employer.start).toBeDefined();
      expect(mandatory.start).toBeDefined();
    });

    it('Scenario 3 : Pere utilisant l\'app 2 semaines apres naissance', () => {
      const twoWeeksAgo = addMonths(today, -0.5); // ~15 jours
      
      const validation = validateBirthDate(twoWeeksAgo);
      expect(validation.valid).toBe(true);
      expect(validation.warning).toContain('deja survenue');
      
      // Meme si date passee, calculs restent corrects
      const employer = calculateEmployerPeriod(twoWeeksAgo);
      expect(employer.days).toBe(3);
    });

    it('Scenario 4 : Pere ayant oublie de planifier (8 mois apres)', () => {
      const eightMonthsAgo = addMonths(today, -8);
      
      const validation = validateBirthDate(eightMonthsAgo);
      expect(validation.valid).toBe(true);
      expect(validation.warning).toContain('6 mois');
      
      // Peut encore utiliser si cas d'hospitalisation (12 mois)
    });

    it('Scenario 5 : Date absurde (naissance dans 3 ans)', () => {
      const absurdFuture = addYears(today, 3);
      
      const validation = validateBirthDate(absurdFuture);
      expect(validation.valid).toBe(false);
      expect(validation.error).toContain('9 mois');
    });

    it('Scenario 6 : Date absurde (naissance il y a 5 ans)', () => {
      const absurdPast = addYears(today, -5);
      
      const validation = validateBirthDate(absurdPast);
      expect(validation.valid).toBe(false);
      expect(validation.error).toContain('plus d\'un an');
    });
  });
});

