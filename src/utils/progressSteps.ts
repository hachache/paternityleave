import { LeaveScenarioConfig } from './paternityLeave';
import { getScenarioVocabulary } from './scenarioVocabulary';

export function buildProgressSteps(fractionableDays: number, scenario: LeaveScenarioConfig) {
  const vocabulary = getScenarioVocabulary(scenario);

  return [
    { number: 1, label: vocabulary.eventDateLabel, shortLabel: vocabulary.eventDateShortLabel },
    { number: 2, label: 'Périodes obligatoires', shortLabel: 'Obligatoire' },
    { number: 3, label: `Planification ${fractionableDays}j`, shortLabel: 'Planning' },
    { number: 4, label: 'Finalisation', shortLabel: 'Suite' }
  ];
}
