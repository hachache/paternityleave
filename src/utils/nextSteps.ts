import { LeaveScenarioConfig } from './paternityLeave';
import { FRACTIONABLE_PERIODS_HINT, getScenarioVocabulary } from './scenarioVocabulary';
import { formatSupplementaryActivationCountdown } from './supplementaryBirthLeave';

export type ChecklistItem = {
  label: string;
  hint?: string;
  status: 'pending' | 'active' | 'done';
  index: number;
  isFinale?: boolean;
};

export interface ChecklistArgs {
  planningStep: number;
  totalPlannedDays: number;
  hasBirthDate: boolean;
  hasMandatory: boolean;
  remainingBlocks: number;
  fractionableDays: number;
  isEligibleForSupplementaryLeave: boolean;
  supplementaryLeaveConfigured: boolean;
  supplementaryLeaveActivationHint: string | null;
  supplementaryLeaveDaysUntilActivation: number | null;
  scenario: LeaveScenarioConfig;
}

export function buildChecklist({
  planningStep,
  totalPlannedDays,
  hasBirthDate,
  hasMandatory,
  remainingBlocks,
  fractionableDays,
  isEligibleForSupplementaryLeave,
  supplementaryLeaveConfigured,
  supplementaryLeaveActivationHint,
  supplementaryLeaveDaysUntilActivation,
  scenario
}: ChecklistArgs): ChecklistItem[] {
  const steps: ChecklistItem[] = [];
  let index = 1;
  const vocabulary = getScenarioVocabulary(scenario);

  const isStep1Done = hasBirthDate;
  steps.push({
    label: `Définir la ${vocabulary.eventDateActionLabel}`,
    hint: 'Point de départ de tout le calcul',
    status: isStep1Done ? 'done' : 'active',
    index: index++
  });

  const isStep2Done = hasMandatory || planningStep > 1;
  steps.push({
    label: 'Valider la période obligatoire',
    hint: vocabulary.fixedPeriodsHint,
    status: isStep2Done ? 'done' : isStep1Done ? 'active' : 'pending',
    index: index++
  });

  const hasAllBlocks = totalPlannedDays >= fractionableDays;
  const remainingDays = Math.max(fractionableDays - totalPlannedDays, 0);

  steps.push({
    label: `Planifier vos ${fractionableDays} jours restants`,
    hint:
      remainingBlocks === 0
        ? `À poser en ${FRACTIONABLE_PERIODS_HINT}`
        : remainingDays > 0
          ? `${remainingDays} jours encore à planifier`
          : 'Planning complet',
    status: hasAllBlocks ? 'done' : isStep2Done ? 'active' : 'pending',
    index: index++
  });

  if (isEligibleForSupplementaryLeave) {
    const activationCountdown = formatSupplementaryActivationCountdown(
      supplementaryLeaveDaysUntilActivation
    );
    const supplementaryHint = !hasAllBlocks
      ? 'Disponible une fois le planning terminé'
      : supplementaryLeaveConfigured
        ? 'Option ajoutée au récapitulatif, sous réserve des décrets'
        : [activationCountdown, supplementaryLeaveActivationHint]
            .filter(Boolean)
            .join(' — ') ||
          '1 ou 2 mois calendaires après le congé initial (optionnel, sous réserve des décrets)';

    steps.push({
      label: 'Congé supplémentaire 2026',
      hint: supplementaryHint,
      status: !hasAllBlocks ? 'pending' : supplementaryLeaveConfigured ? 'done' : 'active',
      index: index++
    });
  }

  steps.push({
    label: 'Générer votre courrier employeur',
    hint: 'Modèle prêt à envoyer, avec ou sans congé supplémentaire',
    status: hasAllBlocks ? 'active' : 'pending',
    index: index++,
    isFinale: true
  });

  return steps;
}
