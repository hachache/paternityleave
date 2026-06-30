import { format, startOfDay } from 'date-fns';
import { describe, expect, it } from 'vitest';

import { LEAVE_SCENARIOS } from '../paternityLeave';
import {
  calculateSupplementaryLeavePeriod,
  calculateSupplementaryLeaveSplitBlocks,
  formatSupplementaryActivationCountdown,
  getSupplementaryLeaveEarliestStartInfo,
  getSupplementaryLeaveEarliestStartDate,
  getSupplementaryLeaveEligibility,
  getSupplementaryLeaveLimitDate
} from '../supplementaryBirthLeave';

const standardScenario = LEAVE_SCENARIOS.standard;
const multipleBirthsScenario = LEAVE_SCENARIOS['multiple-births'];

function dateKey(date: Date | null): string | null {
  return date ? format(date, 'yyyy-MM-dd') : null;
}

describe('getSupplementaryLeaveEligibility', () => {
  it('refuse une naissance avant le 1er janvier 2026 sans confirmation du cas prématuré', () => {
    const result = getSupplementaryLeaveEligibility(
      new Date(2025, 11, 31),
      standardScenario,
      new Date(2026, 6, 1)
    );

    expect(result.isEligibleBirthDate).toBe(false);
    expect(result.canPlan).toBe(false);
    expect(result.canActivate).toBe(false);
    expect(result.limitDate).toBeNull();
    expect(result.reason).toContain('1er janvier 2026');
  });

  it('autorise un prématuré né en 2025 si la naissance était prévue après le 1er janvier 2026', () => {
    const result = getSupplementaryLeaveEligibility(
      new Date(2025, 11, 31),
      standardScenario,
      new Date(2026, 6, 1),
      { prematureExpectedAfterMinDate: true }
    );

    expect(result.isEligibleBirthDate).toBe(true);
    expect(result.isPrematureBirthBefore2026).toBe(true);
    expect(result.isPrematureExpectedAfterMinDate).toBe(true);
    expect(result.canPlan).toBe(true);
    expect(dateKey(result.limitDate)).toBe('2027-03-31');
  });

  it('marque une naissance du 1er janvier 2026 eligible mais non planifiable avant le 1er juin 2026', () => {
    const result = getSupplementaryLeaveEligibility(
      new Date(2026, 0, 1),
      standardScenario,
      new Date(2026, 4, 31)
    );

    expect(result.isEligibleBirthDate).toBe(true);
    expect(result.isRequestWindowOpen).toBe(false);
    expect(result.isAvailableNow).toBe(false);
    expect(result.canPlan).toBe(false);
    expect(result.canActivate).toBe(false);
    expect(result.daysUntilRequestWindow).toBe(1);
    expect(result.daysUntilActivation).toBe(31);
    expect(dateKey(result.limitDate)).toBe('2027-03-31');
    expect(result.reason).toContain('1er juin 2026');
  });

  it('autorise la planification a partir du 1er juin 2026 sans permettre un debut avant le 1er juillet', () => {
    const result = getSupplementaryLeaveEligibility(
      new Date(2026, 0, 1),
      standardScenario,
      new Date(2026, 5, 1)
    );

    expect(result.isEligibleBirthDate).toBe(true);
    expect(result.isRequestWindowOpen).toBe(true);
    expect(result.isAvailableNow).toBe(false);
    expect(result.canPlan).toBe(true);
    expect(result.canActivate).toBe(false);
    expect(result.daysUntilRequestWindow).toBeNull();
    expect(result.daysUntilActivation).toBe(30);
    expect(formatSupplementaryActivationCountdown(result.daysUntilActivation)).toBe(
      'Début possible dans 30 jours (1er juillet 2026)'
    );
    expect(result.reason).toBeNull();
  });

  it('autorise le debut effectif a partir du 1er juillet 2026', () => {
    const result = getSupplementaryLeaveEligibility(
      new Date(2026, 0, 1),
      standardScenario,
      new Date(2026, 6, 1)
    );

    expect(result.isEligibleBirthDate).toBe(true);
    expect(result.isRequestWindowOpen).toBe(true);
    expect(result.isAvailableNow).toBe(true);
    expect(result.canPlan).toBe(true);
    expect(result.canActivate).toBe(true);
    expect(result.daysUntilActivation).toBeNull();
    expect(result.reason).toBeNull();
  });

  it('calcule le nombre de jours avant debut effectif pour une date intermediaire', () => {
    const result = getSupplementaryLeaveEligibility(
      new Date(2026, 0, 1),
      standardScenario,
      new Date(2026, 5, 1)
    );

    expect(result.daysUntilActivation).toBe(30);
    expect(formatSupplementaryActivationCountdown(result.daysUntilActivation)).toBe(
      'Début possible dans 30 jours (1er juillet 2026)'
    );
  });
});

describe('getSupplementaryLeaveEarliestStartDate', () => {
  it('force le début au 1er juillet 2026 si le congé initial se termine avant et que le préavis est respecté', () => {
    const result = getSupplementaryLeaveEarliestStartDate(
      new Date(2026, 1, 15),
      undefined,
      new Date(2026, 0, 1),
      new Date(2026, 5, 1)
    );

    expect(dateKey(result)).toBe('2026-07-01');
  });

  it('démarre le lendemain du congé initial si celui-ci finit après le 1er juillet 2026', () => {
    const result = getSupplementaryLeaveEarliestStartDate(
      new Date(2026, 6, 10),
      undefined,
      new Date(2026, 5, 30),
      new Date(2026, 5, 1)
    );

    expect(dateKey(result)).toBe('2026-07-11');
  });

  it('repousse le début projeté quand le préavis standard d’un mois n’est pas respecté', () => {
    const result = getSupplementaryLeaveEarliestStartInfo(
      new Date(2026, 1, 15),
      undefined,
      new Date(2026, 0, 1),
      new Date(2026, 5, 30)
    );

    expect(dateKey(result.noticeDate)).toBe('2026-07-30');
    expect(dateKey(result.startDate)).toBe('2026-07-30');
    expect(result.noticeRule).toBe('standard-1-month');
  });

  it('applique le préavis réduit de 15 jours seulement en succession immédiate dans le mois suivant la naissance', () => {
    const result = getSupplementaryLeaveEarliestStartInfo(
      new Date(2026, 6, 27),
      undefined,
      new Date(2026, 5, 30),
      new Date(2026, 5, 30)
    );

    expect(dateKey(result.noticeDate)).toBe('2026-07-15');
    expect(dateKey(result.startDate)).toBe('2026-07-28');
    expect(result.noticeRule).toBe('reduced-15-days');
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

  it('applique la limite transitoire aux prématurés 2025 prévus après le 1er janvier 2026', () => {
    const result = getSupplementaryLeaveLimitDate(
      new Date(2025, 11, 31),
      standardScenario,
      { prematureExpectedAfterMinDate: true }
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
    expect(result.error).toContain('date autorisée');
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
