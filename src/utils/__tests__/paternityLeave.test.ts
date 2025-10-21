import { addDays, addMonths, startOfDay } from 'date-fns';
import { describe, expect, it } from 'vitest';

import {
  LEAVE_SCENARIOS,
  LeaveBlock,
  calculateAutomaticRemainingPeriod,
  calculateEmployerPeriod,
  calculateMandatoryPeriod,
  validateRemainingBlock
} from '../paternityLeave';

const standardScenario = LEAVE_SCENARIOS.standard;
const hospitalizedScenario = LEAVE_SCENARIOS['hospitalized-newborn'];

describe('calculateEmployerPeriod', () => {
  it('calcule 3 jours ouvrables (lundi-samedi hors fériés) depuis une naissance le samedi', () => {
    const birthDate = new Date(2024, 0, 6); // Samedi 6 janvier 2024

    const period = calculateEmployerPeriod(birthDate);

    // Le samedi 6 janvier est ouvrable (pas dimanche, pas férié)
    // Donc : samedi 6 + lundi 8 + mardi 9 (le dimanche 7 est exclu)
    const expectedStart = startOfDay(new Date(2024, 0, 6)); // Samedi
    const expectedEnd = startOfDay(new Date(2024, 0, 9)); // Mardi

    expect(period.start.getTime()).toBe(expectedStart.getTime());
    expect(period.end.getTime()).toBe(expectedEnd.getTime());
    expect(period.days).toBe(3);
    expect(period.workingDatesOnly).toHaveLength(3);
    // [6 (samedi), 1 (lundi), 2 (mardi)]
    expect(period.workingDatesOnly?.map(date => date.getDay())).toEqual([6, 1, 2]);
  });

  it('calcule 3 jours ouvrables depuis une naissance le dimanche', () => {
    const birthDate = new Date(2024, 0, 7); // Dimanche 7 janvier 2024

    const period = calculateEmployerPeriod(birthDate);

    // Le dimanche est exclu, donc commence lundi 8
    // Lundi 8 + mardi 9 + mercredi 10
    const expectedStart = startOfDay(new Date(2024, 0, 8)); // Lundi
    const expectedEnd = startOfDay(new Date(2024, 0, 10)); // Mercredi

    expect(period.start.getTime()).toBe(expectedStart.getTime());
    expect(period.end.getTime()).toBe(expectedEnd.getTime());
    expect(period.days).toBe(3);
    expect(period.workingDatesOnly).toHaveLength(3);
    // [1 (lundi), 2 (mardi), 3 (mercredi)]
    expect(period.workingDatesOnly?.map(date => date.getDay())).toEqual([1, 2, 3]);
  });

  it('calcule 3 jours ouvrables depuis une naissance le lundi', () => {
    const birthDate = new Date(2024, 0, 8); // Lundi 8 janvier 2024

    const period = calculateEmployerPeriod(birthDate);

    // Lundi 8 + mardi 9 + mercredi 10
    const expectedStart = startOfDay(new Date(2024, 0, 8)); // Lundi
    const expectedEnd = startOfDay(new Date(2024, 0, 10)); // Mercredi

    expect(period.start.getTime()).toBe(expectedStart.getTime());
    expect(period.end.getTime()).toBe(expectedEnd.getTime());
    expect(period.days).toBe(3);
    expect(period.workingDatesOnly).toHaveLength(3);
  });
});

describe('validateRemainingBlock', () => {
  const birthDate = startOfDay(new Date(2024, 0, 2));
  const employerPeriod = calculateEmployerPeriod(birthDate);
  const mandatoryPeriod = calculateMandatoryPeriod(employerPeriod.end);

  it('rejects blocks that exceed the allowed post-birth period', () => {
    const start = addMonths(birthDate, standardScenario.limitMonthsAfterBirth);
    const end = addDays(start, 6);
    const block: LeaveBlock = { start, end, days: 7, type: 'remaining' };

    const result = validateRemainingBlock(
      block.start,
      block.end,
      birthDate,
      employerPeriod,
      mandatoryPeriod,
      [],
      0,
      standardScenario
    );

    expect(result.valid).toBe(false);
    expect(result.error).toBe(
      `Les jours doivent être pris dans les ${standardScenario.limitMonthsAfterBirth} mois suivant la naissance`
    );
  });

  it('rejects blocks that would exceed the available fractionable days', () => {
    const start = addDays(mandatoryPeriod.end, 1);
    const end = addDays(start, 5);
    const block: LeaveBlock = { start, end, days: 6, type: 'remaining' };

    const totalUsedDays = standardScenario.fractionableDays - 2; // only 2 days left

    const result = validateRemainingBlock(
      block.start,
      block.end,
      birthDate,
      employerPeriod,
      mandatoryPeriod,
      [],
      totalUsedDays,
      standardScenario
    );

    expect(result.valid).toBe(false);
    expect(result.error).toContain(`${standardScenario.fractionableDays} jours calendaires disponibles`);
  });

  it('accepts a valid block inside the allowed window', () => {
    const start = addDays(mandatoryPeriod.end, 1);
    const end = addDays(start, 10);
    const block: LeaveBlock = { start, end, days: 11, type: 'remaining' };

    const result = validateRemainingBlock(
      block.start,
      block.end,
      birthDate,
      employerPeriod,
      mandatoryPeriod,
      [],
      0,
      standardScenario
    );

    expect(result.valid).toBe(true);
  });
});

describe('calculateAutomaticRemainingPeriod', () => {
  const birthDate = startOfDay(new Date(2024, 0, 2));

  it('returns null when attempting to plan before the birth date', () => {
    const result = calculateAutomaticRemainingPeriod(
      birthDate,
      addDays(birthDate, -1),
      5,
      standardScenario
    );

    expect(result).toBeNull();
  });

  it('returns null when the block would extend beyond the limit for the scenario', () => {
    const start = addMonths(birthDate, hospitalizedScenario.limitMonthsAfterBirth);

    const result = calculateAutomaticRemainingPeriod(
      birthDate,
      start,
      5,
      hospitalizedScenario
    );

    expect(result).toBeNull();
  });

  it('creates a block inside the allowed window for an extended scenario', () => {
    const start = addMonths(birthDate, hospitalizedScenario.limitMonthsAfterBirth - 1);
    const result = calculateAutomaticRemainingPeriod(
      birthDate,
      start,
      5,
      hospitalizedScenario
    );

    expect(result).not.toBeNull();
    expect(result?.start.getTime()).toBe(startOfDay(start).getTime());
    expect(result?.days).toBe(5);
  });
});
