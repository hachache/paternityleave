import { LeaveScenarioConfig } from './paternityLeave';
import { getScenarioVocabulary } from './scenarioVocabulary';

export function getCalendarLegendItems(scenario: LeaveScenarioConfig) {
  const vocabulary = getScenarioVocabulary(scenario);

  return [
    { label: vocabulary.eventDateLabel, color: 'bg-slate-900 shadow-sm' },
    { label: vocabulary.employerLeaveLabel, color: 'bg-brand-300' },
    { label: 'Période obligatoire (4j)', color: 'bg-brand-600 shadow-sm' },
    { label: 'Jours à planifier', color: 'bg-success-500 shadow-sm' }
  ] as const;
}
