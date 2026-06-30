import { addMonths, startOfDay } from 'date-fns';
import { describe, expect, it } from 'vitest';

import { buildCalendarDayAriaLabel, getInitialEventDateMetadata } from '../calendarDay';
import { validateBirthDate } from '../dateValidation';
import {
  ARTICLE_L1225_46_2,
  LFSS_2021,
  SERVICE_PUBLIC_CONGE_PATERNITE,
  SERVICE_PUBLIC_CONGE_SUPPLEMENTAIRE,
  SERVICE_PUBLIC_CONGE_SUPPLEMENTAIRE_PUBLIC
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

  it('garde le scénario adoption hors du simulateur paternité classique', () => {
    const vocabulary = getScenarioVocabulary(LEAVE_SCENARIOS.standard);
    const progressSteps = buildProgressSteps(
      LEAVE_SCENARIOS.standard.fractionableDays,
      LEAVE_SCENARIOS.standard
    );
    const legendItems = getCalendarLegendItems(LEAVE_SCENARIOS.standard);
    const checklist = buildChecklist({
      planningStep: 1,
      totalPlannedDays: 0,
      hasBirthDate: false,
      hasMandatory: false,
      remainingBlocks: 0,
      fractionableDays: LEAVE_SCENARIOS.standard.fractionableDays,
      isEligibleForSupplementaryLeave: false,
      supplementaryLeaveConfigured: false,
      supplementaryLeaveActivationHint: null,
      supplementaryLeaveDaysUntilActivation: null,
      scenario: LEAVE_SCENARIOS.standard
    });

    expect(Object.keys(LEAVE_SCENARIOS)).not.toContain('adoption');
    expect(vocabulary.eventDateLabel).toBe('Date de naissance');
    expect(progressSteps[0].label).toBe('Date de naissance');
    expect(legendItems[0].label).toBe('Date de naissance');
    expect(checklist[0].label).toContain('date de naissance');
  });

  it('pointe vers les références légales officielles à jour', () => {
    expect(SERVICE_PUBLIC_CONGE_PATERNITE.url).toContain('F3156');
    expect(SERVICE_PUBLIC_CONGE_PATERNITE.url).not.toContain('F583');
    expect(ARTICLE_L1225_46_2.url).toBe(
      'https://www.legifrance.gouv.fr/codes/id/LEGIARTI000053271698'
    );
    expect(SERVICE_PUBLIC_CONGE_SUPPLEMENTAIRE.url).toContain('F39685');
    expect(SERVICE_PUBLIC_CONGE_SUPPLEMENTAIRE_PUBLIC.url).toContain('F39693');
    expect(LFSS_2021.article).toContain('loi n° 2020-1576');
    expect(LFSS_2021.url).toContain('JORFARTI000042665368');
  });

  it('présente le congé 2026 comme planifiable avant juillet puis projeté', () => {
    const eligibility = getSupplementaryLeaveEligibility(
      new Date(2026, 0, 1),
      LEAVE_SCENARIOS.standard,
      new Date(2026, 5, 1)
    );

    expect(getSupplementaryLeaveStatusLabel(true, true, false)).toBe('Projeté');
    expect(getSupplementaryLeaveStatusLabel(false, true, false)).toBe('Planifiable');
    expect(getSupplementaryLeaveStatusLabel(false, true, true)).toBe('Optionnel');
    expect(eligibility.canPlan).toBe(true);
    expect(eligibility.canActivate).toBe(false);
  });
});
