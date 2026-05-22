import { format, startOfDay } from 'date-fns';
import { describe, expect, it } from 'vitest';

import { LEAVE_SCENARIOS } from '../paternityLeave';
import {
  calculateSupplementaryLeavePeriod,
  calculateSupplementaryLeaveSplitBlocks,
  formatSupplementaryActivationCountdown,
  getSupplementaryLeaveEligibility,
  getSupplementaryLeaveLimitDate
} from '../supplementaryBirthLeave';

const standardScenario = LEAVE_SCENARIOS.standard;
const multipleBirthsScenario = LEAVE_SCENARIOS['multiple-births'];

function dateKey(date: Date | null): string | null {
  return date ? format(date, 'yyyy-MM-dd') : null;
}

describe('getSupplementaryLeaveEligibility', () => {
  it('refuse une naissance avant le 1er janvier 2026', () => {
    const result = getSupplementaryLeaveEligibility(
      new Date(2025, 11, 31),
      standardScenario,
      new Date(2026, 6, 1)
    );

    expect(result.isEligibleBirthDate).toBe(false);
    expect(result.canActivate).toBe(false);
    expect(result.limitDate).toBeNull();
    expect(result.reason).toContain('1er janvier 2026');
  });

  it('marque une naissance du 1er janvier 2026 eligible mais non activable avant le 1er juillet 2026', () => {
    const result = getSupplementaryLeaveEligibility(
      new Date(2026, 0, 1),
      standardScenario,
      new Date(2026, 5, 30)
    );

    expect(result.isEligibleBirthDate).toBe(true);
    expect(result.isAvailableNow).toBe(false);
    expect(result.canActivate).toBe(false);
    expect(result.daysUntilActivation).toBe(1);
    expect(formatSupplementaryActivationCountdown(result.daysUntilActivation)).toBe(
      'Activation demain (1er juillet 2026)'
    );
    expect(dateKey(result.limitDate)).toBe('2027-03-31');
    expect(result.reason).toContain('1er juillet 2026');
  });

  it('autorise l activation a partir du 1er juillet 2026', () => {
    const result = getSupplementaryLeaveEligibility(
      new Date(2026, 0, 1),
      standardScenario,
      new Date(2026, 6, 1)
    );

    expect(result.isEligibleBirthDate).toBe(true);
    expect(result.isAvailableNow).toBe(true);
    expect(result.canActivate).toBe(true);
    expect(result.daysUntilActivation).toBeNull();
    expect(result.reason).toBeNull();
  });

  it('calcule le nombre de jours avant activation pour une date intermediaire', () => {
    const result = getSupplementaryLeaveEligibility(
      new Date(2026, 0, 1),
      standardScenario,
      new Date(2026, 5, 1)
    );

    expect(result.daysUntilActivation).toBe(30);
    expect(formatSupplementaryActivationCountdown(result.daysUntilActivation)).toBe(
      'Activation dans 30 jours (1er juillet 2026)'
    );
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

describe('calculateSupplementaryLeaveSplitBlocks', () => {
  const earliest = new Date(2026, 6, 1);
  const limit = new Date(2027, 2, 31);

  it('produit deux blocs disjoints valides tries par date de debut', () => {
    const result = calculateSupplementaryLeaveSplitBlocks(
      new Date(2026, 8, 1),
      new Date(2026, 6, 1),
      earliest,
      limit
    );

    expect(result.valid).toBe(true);
    expect(result.error).toBeNull();
    expect(result.blocks).toHaveLength(2);
    expect(dateKey(result.blocks[0].start)).toBe('2026-07-01');
    expect(dateKey(result.blocks[0].end)).toBe('2026-07-31');
    expect(dateKey(result.blocks[1].start)).toBe('2026-09-01');
    expect(dateKey(result.blocks[1].end)).toBe('2026-09-30');
  });

  it('refuse une periode debutant avant la fin du conge initial', () => {
    const result = calculateSupplementaryLeaveSplitBlocks(
      new Date(2026, 5, 15),
      new Date(2026, 8, 1),
      earliest,
      limit
    );

    expect(result.valid).toBe(false);
    expect(result.blocks).toEqual([]);
    expect(result.error).toContain('fin du congé initial');
  });

  it('refuse une periode depassant la date limite legale', () => {
    const result = calculateSupplementaryLeaveSplitBlocks(
      new Date(2026, 6, 1),
      new Date(2027, 2, 15),
      earliest,
      limit
    );

    expect(result.valid).toBe(false);
    expect(result.error).toContain('date limite légale');
  });

  it('refuse un chevauchement entre les deux periodes', () => {
    const result = calculateSupplementaryLeaveSplitBlocks(
      new Date(2026, 6, 1),
      new Date(2026, 6, 20),
      earliest,
      limit
    );

    expect(result.valid).toBe(false);
    expect(result.error).toContain('chevaucher');
  });
});
