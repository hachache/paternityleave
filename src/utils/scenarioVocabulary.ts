import { LeaveScenarioConfig, LeaveScenarioId } from './paternityLeave';

export interface ScenarioVocabulary {
  isAdoption: boolean;
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

export function isAdoptionScenario(
  scenario: LeaveScenarioConfig | LeaveScenarioId | null | undefined
): boolean {
  if (!scenario) return false;
  return typeof scenario === 'string' ? scenario === 'adoption' : scenario.id === 'adoption';
}

export function getScenarioVocabulary(scenario: LeaveScenarioConfig | null | undefined): ScenarioVocabulary {
  const isAdoption = isAdoptionScenario(scenario);
  const fractionableDays = scenario?.fractionableDays ?? 21;

  return {
    isAdoption,
    eventName: isAdoption ? 'arrivée au foyer' : 'naissance',
    eventDateLabel: isAdoption ? "Date d'arrivée au foyer" : 'Date de naissance',
    eventDateShortLabel: isAdoption ? 'Arrivée' : 'Naissance',
    eventDateActionLabel: isAdoption
      ? "date d'arrivée au foyer"
      : 'date de naissance',
    afterEventReason: isAdoption
      ? "Disponible uniquement après l'arrivée au foyer"
      : 'Disponible uniquement après la naissance',
    employerLeaveLabel: isAdoption ? 'Congé employeur (3j)' : 'Congé de naissance (3j)',
    fixedPeriodsHint: '3 jours employeur + 4 jours obligatoires',
    totalDetail: `3j employeur + 4j obligatoires + ${fractionableDays}j fractionnables`,
    initialLeaveLabel: isAdoption
      ? "congé d'accueil/adoption"
      : "congé de paternité et d'accueil de l'enfant"
  };
}
