import { addMonths, startOfDay } from 'date-fns';
import { describe, expect, it } from 'vitest';

import { buildCalendarDayAriaLabel, getInitialEventDateMetadata } from '../calendarDay';
import { validateBirthDate } from '../dateValidation';
import {
  ARTICLE_L1225_46_2,
  LFSS_2021,
  SERVICE_PUBLIC_CONGE_PATERNITE
} from '../legalReferences';
import { LEAVE_SCENARIOS } from '../paternityLeave';
import {
  FRACTIONABLE_PERIODS_HINT,
  getScenarioVocabulary
} from '../scenarioVocabulary';
import { getSupplementaryLeaveEligibility } from '../supplementaryBirthLeave';
import { getCalendarLegendItems } from '../calendarLegend';
import { buildChecklist } from '../nextSteps';
import { buildProgressSteps } from '../progressSteps';
import { getSupplementaryLeaveStatusLabel } from '../supplementaryLeaveCopy';

describe('copies UI métier', () => {
  it('autorise la sélection initiale d une date passée et laisse la validation rejeter une date trop ancienne', () => {
    const today = startOfDay(new Date());
    const recentPast = addMonths(today, -2);
    const tooOld = addMonths(today, -13);

    expect(getInitialEventDateMetadata().selectable).toBe(true);
    expect(
      buildCalendarDayAriaLabel(recentPast, getInitialEventDateMetadata(), {
        eventDateLabel: 'Date de naissance',
        eventDateActionLabel: 'date de naissance'
      })
    ).toContain('sélectionner cette date comme date de naissance');
    expect(validateBirthDate(recentPast).valid).toBe(true);
    expect(validateBirthDate(tooOld).valid).toBe(false);
  });

  it('affiche la règle correcte de fractionnement en 1 ou 2 périodes', () => {
    const checklist = buildChecklist({
      planningStep: 3,
      totalPlannedDays: 0,
      hasBirthDate: true,
      hasMandatory: true,
      remainingBlocks: 0,
      fractionableDays: LEAVE_SCENARIOS.standard.fractionableDays,
      isEligibleForSupplementaryLeave: false,
      supplementaryLeaveConfigured: false,
      supplementaryLeaveActivationHint: null,
      supplementaryLeaveDaysUntilActivation: null,
      scenario: LEAVE_SCENARIOS.standard
    });

    const planningStep = checklist.find(item => item.label.includes('jours restants'));
    expect(FRACTIONABLE_PERIODS_HINT).toContain('1 ou 2 périodes');
    expect(planningStep?.hint).toContain('1 ou 2 périodes');
    expect(planningStep?.hint).not.toContain('2 périodes minimum');
  });

  it('adapte les libellés principaux au scénario adoption', () => {
    const adoption = LEAVE_SCENARIOS.adoption;
    const vocabulary = getScenarioVocabulary(adoption);
    const progressSteps = buildProgressSteps(adoption.fractionableDays, adoption);
    const legendItems = getCalendarLegendItems(adoption);
    const checklist = buildChecklist({
      planningStep: 1,
      totalPlannedDays: 0,
      hasBirthDate: false,
      hasMandatory: false,
      remainingBlocks: 0,
      fractionableDays: adoption.fractionableDays,
      isEligibleForSupplementaryLeave: false,
      supplementaryLeaveConfigured: false,
      supplementaryLeaveActivationHint: null,
      supplementaryLeaveDaysUntilActivation: null,
      scenario: adoption
    });

    expect(vocabulary.eventDateLabel).toBe("Date d'arrivée au foyer");
    expect(progressSteps[0].label).toBe("Date d'arrivée au foyer");
    expect(legendItems[0].label).toBe("Date d'arrivée au foyer");
    expect(checklist[0].label).toContain("date d'arrivée au foyer");
  });

  it('pointe vers les références légales officielles à jour', () => {
    expect(SERVICE_PUBLIC_CONGE_PATERNITE.url).toContain('F3156');
    expect(SERVICE_PUBLIC_CONGE_PATERNITE.url).not.toContain('F583');
    expect(ARTICLE_L1225_46_2.url).toBe(
      'https://www.legifrance.gouv.fr/codes/id/LEGIARTI000053271698'
    );
    expect(LFSS_2021.article).toContain('loi n° 2020-1576');
    expect(LFSS_2021.url).toContain('JORFARTI000042665368');
  });

  it('présente le congé 2026 comme projeté et sous réserve des décrets', () => {
    const eligibility = getSupplementaryLeaveEligibility(
      new Date(2026, 0, 1),
      LEAVE_SCENARIOS.standard,
      new Date(2026, 5, 30)
    );

    expect(getSupplementaryLeaveStatusLabel(true, true)).toBe('Projeté');
    expect(getSupplementaryLeaveStatusLabel(false, true)).toBe('Optionnel');
    expect(eligibility.reason).toContain('sous réserve des décrets');
  });
});
