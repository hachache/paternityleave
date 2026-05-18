import { format, startOfDay } from 'date-fns';
import { describe, expect, it } from 'vitest';

import { LEAVE_SCENARIOS } from '../paternityLeave';
import {
  calculateSupplementaryLeavePeriod,
  getSupplementaryLeaveEligibility,
  getSupplementaryLeaveLimitDate
} from '../supplementaryBirthLeave';

const standardScenario = LEAVE_SCENARIOS.standard;
const multipleBirthsScenario = LEAVE_SCENARIOS['multiple-births'];

function dateKey(date: Date | null): string | null {
  return date ? format(date, 'yyyy-MM-dd') : null;
}

describe('getSupplementaryLeaveEligibility', () => {
  it('refuse une naissance avant le 1 janvier 2026', () => {
    const result = getSupplementaryLeaveEligibility(
      new Date(2025, 11, 31),
      standardScenario,
      new Date(2026, 6, 1)
    );

    expect(result.isEligibleBirthDate).toBe(false);
    expect(result.canActivate).toBe(false);
    expect(result.limitDate).toBeNull();
    expect(result.reason).toContain('1 janvier 2026');
  });

  it('marque une naissance du 1 janvier 2026 eligible mais non activable avant le 1 juillet 2026', () => {
    const result = getSupplementaryLeaveEligibility(
      new Date(2026, 0, 1),
      standardScenario,
      new Date(2026, 5, 30)
    );

    expect(result.isEligibleBirthDate).toBe(true);
    expect(result.isAvailableNow).toBe(false);
    expect(result.canActivate).toBe(false);
    expect(dateKey(result.limitDate)).toBe('2027-03-31');
    expect(result.reason).toContain('1 juillet 2026');
  });

  it('autorise l activation a partir du 1 juillet 2026', () => {
    const result = getSupplementaryLeaveEligibility(
      new Date(2026, 0, 1),
      standardScenario,
      new Date(2026, 6, 1)
    );

    expect(result.isEligibleBirthDate).toBe(true);
    expect(result.isAvailableNow).toBe(true);
    expect(result.canActivate).toBe(true);
    expect(result.reason).toBeNull();
  });
});

describe('getSupplementaryLeaveLimitDate', () => {
  it('applique la limite transitoire du 31 mars 2027 pour le premier semestre 2026', () => {
    const result = getSupplementaryLeaveLimitDate(
      new Date(2026, 5, 30),
      standardScenario
    );

    expect(dateKey(result)).toBe('2027-03-31');
  });

  it('applique la limite generale a naissance plus 9 mois hors periode transitoire', () => {
    const result = getSupplementaryLeaveLimitDate(
      new Date(2026, 6, 2),
      standardScenario
    );

    expect(dateKey(result)).toBe('2027-04-02');
  });

  it('etend la limite pour les naissances multiples', () => {
    const result = getSupplementaryLeaveLimitDate(
      new Date(2026, 6, 2),
      multipleBirthsScenario
    );

    expect(dateKey(result)).toBe('2027-04-09');
  });
});

describe('calculateSupplementaryLeavePeriod', () => {
  it('calcule une periode de 1 mois calendaire', () => {
    const result = calculateSupplementaryLeavePeriod(new Date(2026, 6, 1), 1);

    expect(result.start.getTime()).toBe(startOfDay(new Date(2026, 6, 1)).getTime());
    expect(dateKey(result.end)).toBe('2026-07-31');
    expect(result.days).toBe(31);
    expect(result.type).toBe('supplementary');
  });

  it('calcule une periode de 2 mois calendaires', () => {
    const result = calculateSupplementaryLeavePeriod(new Date(2026, 6, 1), 2);

    expect(result.start.getTime()).toBe(startOfDay(new Date(2026, 6, 1)).getTime());
    expect(dateKey(result.end)).toBe('2026-08-31');
    expect(result.days).toBe(62);
    expect(result.type).toBe('supplementary');
  });
});
