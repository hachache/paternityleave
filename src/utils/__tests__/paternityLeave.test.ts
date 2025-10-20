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
  it('starts on the next working day and spans three working days', () => {
    const birthDate = new Date(2024, 0, 6); // Saturday

    const period = calculateEmployerPeriod(birthDate);

    const expectedStart = startOfDay(new Date(2024, 0, 8)); // Monday
    const expectedEnd = startOfDay(new Date(2024, 0, 10)); // Wednesday

    expect(period.start.getTime()).toBe(expectedStart.getTime());
    expect(period.end.getTime()).toBe(expectedEnd.getTime());
    expect(period.days).toBe(3);
    expect(period.workingDatesOnly).toHaveLength(3);
    expect(period.workingDatesOnly?.map(date => date.getDay())).toEqual([1, 2, 3]);
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
    expect(result.error).toContain(`${standardScenario.fractionableDays} jours disponibles`);
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
