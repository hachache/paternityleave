import { addDays, addMonths, addYears, startOfDay } from 'date-fns';
import { describe, expect, it } from 'vitest';
import { 
  validateBirthDate, 
  validateBirthDateSimple,
  isBirthDateInFuture,
  isBirthDateInPast
} from '../dateValidation';

describe('validateBirthDate', () => {
  const today = startOfDay(new Date());

  describe('Date = Aujourd\'hui', () => {
    it('accepte la date d\'aujourd\'hui', () => {
      const result = validateBirthDate(today);
      
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
      expect(result.context).toBe('today');
      expect(result.warning).toBeUndefined();
    });
  });

  describe('Dates futures', () => {
    it('accepte une date 1 mois dans le futur', () => {
      const futureDate = addMonths(today, 1);
      const result = validateBirthDate(futureDate);
      
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
      expect(result.context).toBe('future');
    });

    it('accepte une date 6 mois dans le futur', () => {
      const futureDate = addMonths(today, 6);
      const result = validateBirthDate(futureDate);
      
      expect(result.valid).toBe(true);
      expect(result.context).toBe('future');
    });

    it('accepte une date 9 mois dans le futur (limite grossesse)', () => {
      const futureDate = addMonths(today, 9);
      const result = validateBirthDate(futureDate);
      
      expect(result.valid).toBe(true);
      expect(result.context).toBe('future');
    });

    it('rejette une date 10 mois dans le futur', () => {
      const tooFarFuture = addMonths(today, 10);
      const result = validateBirthDate(tooFarFuture);
      
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain('9 mois');
      expect(result.context).toBe('future');
    });

    it('rejette une date 1 an dans le futur', () => {
      const tooFarFuture = addYears(today, 1);
      const result = validateBirthDate(tooFarFuture);
      
      expect(result.valid).toBe(false);
      expect(result.error).toContain('9 mois');
    });

    it('rejette une date 5 ans dans le futur', () => {
      const absurdFuture = addYears(today, 5);
      const result = validateBirthDate(absurdFuture);
      
      expect(result.valid).toBe(false);
    });
  });

  describe('Dates passees recentes (< 6 mois)', () => {
    it('accepte une date d\'hier avec avertissement', () => {
      const yesterday = addDays(today, -1);
      const result = validateBirthDate(yesterday);
      
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
      expect(result.context).toBe('past');
      expect(result.warning).toBeDefined();
      expect(result.warning).toContain('deja survenue');
    });

    it('accepte une date 1 semaine passee avec avertissement', () => {
      const lastWeek = addDays(today, -7);
      const result = validateBirthDate(lastWeek);
      
      expect(result.valid).toBe(true);
      expect(result.context).toBe('past');
      expect(result.warning).toContain('deja survenue');
    });

    it('accepte une date 3 mois passee avec avertissement', () => {
      const threeMonthsAgo = addMonths(today, -3);
      const result = validateBirthDate(threeMonthsAgo);
      
      expect(result.valid).toBe(true);
      expect(result.context).toBe('past');
      expect(result.warning).toContain('deja survenue');
    });

    it('accepte une date 5 mois passee avec avertissement', () => {
      const fiveMonthsAgo = addMonths(today, -5);
      const result = validateBirthDate(fiveMonthsAgo);
      
      expect(result.valid).toBe(true);
      expect(result.warning).toContain('deja survenue');
    });
  });

  describe('Dates passees anciennes (> 6 mois, < 1 an)', () => {
    it('accepte une date 7 mois passee avec avertissement delai depasse', () => {
      const sevenMonthsAgo = addMonths(today, -7);
      const result = validateBirthDate(sevenMonthsAgo);
      
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
      expect(result.context).toBe('past');
      expect(result.warning).toBeDefined();
      expect(result.warning).toContain('6 mois');
      expect(result.warning).toContain('hospitalisation');
    });

    it('accepte une date 9 mois passee avec avertissement delai depasse', () => {
      const nineMonthsAgo = addMonths(today, -9);
      const result = validateBirthDate(nineMonthsAgo);
      
      expect(result.valid).toBe(true);
      expect(result.warning).toContain('6 mois');
    });

    it('accepte une date 11 mois passee avec avertissement', () => {
      const elevenMonthsAgo = addMonths(today, -11);
      const result = validateBirthDate(elevenMonthsAgo);
      
      expect(result.valid).toBe(true);
      expect(result.warning).toBeDefined();
    });
  });

  describe('Dates passees trop anciennes (> 1 an)', () => {
    it('rejette une date 13 mois passee', () => {
      const thirteenMonthsAgo = addMonths(today, -13);
      const result = validateBirthDate(thirteenMonthsAgo);
      
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain('plus d\'un an');
      expect(result.context).toBe('past');
    });

    it('rejette une date 2 ans passee', () => {
      const twoYearsAgo = addYears(today, -2);
      const result = validateBirthDate(twoYearsAgo);
      
      expect(result.valid).toBe(false);
      expect(result.error).toContain('plus d\'un an');
    });

    it('rejette une date 5 ans passee', () => {
      const fiveYearsAgo = addYears(today, -5);
      const result = validateBirthDate(fiveYearsAgo);
      
      expect(result.valid).toBe(false);
    });
  });

  describe('Cas limites exacts', () => {
    it('accepte exactement 9 mois dans le futur', () => {
      const exactLimit = addMonths(today, 9);
      const result = validateBirthDate(exactLimit);
      
      expect(result.valid).toBe(true);
    });

    it('rejette 9 mois + 1 jour dans le futur', () => {
      const justOverLimit = addDays(addMonths(today, 9), 1);
      const result = validateBirthDate(justOverLimit);
      
      expect(result.valid).toBe(false);
    });

    it('accepte exactement 1 an passe', () => {
      const exactPastLimit = addYears(today, -1);
      const result = validateBirthDate(exactPastLimit);
      
      expect(result.valid).toBe(true);
    });

    it('rejette 1 an + 1 jour passe', () => {
      const justOverPastLimit = addDays(addYears(today, -1), -1);
      const result = validateBirthDate(justOverPastLimit);
      
      expect(result.valid).toBe(false);
    });
  });
});

describe('validateBirthDateSimple', () => {
  const today = startOfDay(new Date());

  it('retourne undefined pour une date valide', () => {
    const validDate = addMonths(today, 3);
    const error = validateBirthDateSimple(validDate);
    
    expect(error).toBeUndefined();
  });

  it('retourne un message d\'erreur pour une date invalide', () => {
    const invalidDate = addYears(today, 2);
    const error = validateBirthDateSimple(invalidDate);
    
    expect(error).toBeDefined();
    expect(typeof error).toBe('string');
  });

  it('retourne undefined pour aujourd\'hui', () => {
    const error = validateBirthDateSimple(today);
    expect(error).toBeUndefined();
  });
});

describe('isBirthDateInFuture', () => {
  const today = startOfDay(new Date());

  it('retourne true pour une date future', () => {
    const futureDate = addDays(today, 1);
    expect(isBirthDateInFuture(futureDate)).toBe(true);
  });

  it('retourne false pour aujourd\'hui', () => {
    expect(isBirthDateInFuture(today)).toBe(false);
  });

  it('retourne false pour une date passee', () => {
    const pastDate = addDays(today, -1);
    expect(isBirthDateInFuture(pastDate)).toBe(false);
  });
});

describe('isBirthDateInPast', () => {
  const today = startOfDay(new Date());

  it('retourne true pour une date passee', () => {
    const pastDate = addDays(today, -1);
    expect(isBirthDateInPast(pastDate)).toBe(true);
  });

  it('retourne false pour aujourd\'hui', () => {
    expect(isBirthDateInPast(today)).toBe(false);
  });

  it('retourne false pour une date future', () => {
    const futureDate = addDays(today, 1);
    expect(isBirthDateInPast(futureDate)).toBe(false);
  });
});

