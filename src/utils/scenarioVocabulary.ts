import { LeaveScenarioConfig } from './paternityLeave';

export interface ScenarioVocabulary {
  eventName: string;
  eventDateLabel: string;
  eventDateShortLabel: string;
  eventDateActionLabel: string;
  afterEventReason: string;
  employerLeaveLabel: string;
  fixedPeriodsHint: string;
  totalDetail: string;
  initialLeaveLabel: string;
}

export const FRACTIONABLE_PERIODS_HINT =
  '1 ou 2 périodes, minimum 5 jours calendaires chacune en cas de fractionnement';

export function getScenarioVocabulary(scenario: LeaveScenarioConfig | null | undefined): ScenarioVocabulary {
  const fractionableDays = scenario?.fractionableDays ?? 21;

  return {
    eventName: 'naissance',
    eventDateLabel: 'Date de naissance',
    eventDateShortLabel: 'Naissance',
    eventDateActionLabel: 'date de naissance',
    afterEventReason: 'Disponible uniquement après la naissance',
    employerLeaveLabel: 'Congé de naissance (3j)',
    fixedPeriodsHint: '3 jours employeur + 4 jours obligatoires',
    totalDetail: `3j employeur + 4j obligatoires + ${fractionableDays}j fractionnables`,
    initialLeaveLabel: "congé de paternité et d'accueil de l'enfant"
  };
}
