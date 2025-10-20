import { LEAVE_SCENARIOS, LeaveScenarioConfig, LeaveScenarioId } from '../utils/paternityLeave';

interface ScenarioSelectorProps {
  selectedScenario: LeaveScenarioId;
  onScenarioChange: (id: LeaveScenarioId) => void;
}

function formatScenarioDetails(config: LeaveScenarioConfig) {
  const additionalDays = config.fractionableDays - LEAVE_SCENARIOS.standard.fractionableDays;
  const hasBonus = additionalDays > 0;

  return {
    totalText: `${config.fractionableDays} jours fractionnables`,
    bonusText: hasBonus ? `+${additionalDays} jours` : undefined,
    limitText: `À poser dans les ${config.limitMonthsAfterBirth} mois`
  };
}

export function ScenarioSelector({ selectedScenario, onScenarioChange }: ScenarioSelectorProps) {
  const scenarios = Object.values(LEAVE_SCENARIOS);

  return (
    <div role="radiogroup" aria-label="Choix de la situation" className="grid gap-3 sm:gap-4 sm:grid-cols-2 auto-rows-fr">
      {scenarios.map(config => {
        const isSelected = config.id === selectedScenario;
        const details = formatScenarioDetails(config);

        return (
          <button
            key={config.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onScenarioChange(config.id)}
            className={`rounded-2xl border-2 p-4 text-left transition-all h-full flex flex-col ${
              isSelected
                ? 'border-teal-500 bg-teal-50 shadow-lg'
                : 'border-slate-200 bg-white hover:border-teal-200 hover:shadow-md'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex-1">
                <p className="text-sm font-semibold uppercase tracking-wide text-teal-600">
                  {config.label}
                </p>
                <p className="mt-1 text-base text-slate-600 leading-relaxed">{config.description}</p>
              </div>
              <span
                className={`flex-shrink-0 inline-flex h-6 w-6 items-center justify-center rounded-full border ${
                  isSelected ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-300 text-slate-400'
                }`}
                aria-hidden="true"
              >
                {isSelected ? '✓' : ''}
              </span>
            </div>

            <div className="mt-auto grid gap-2 sm:gap-3 text-slate-700 sm:grid-cols-2 items-start">
              <div className="rounded-xl bg-white/80 p-3 space-y-1 h-full">
                <p className="font-semibold text-slate-900 text-base leading-relaxed">{details.totalText}</p>
                {details.bonusText && (
                  <p className="text-sm font-semibold text-emerald-600">{details.bonusText}</p>
                )}
              </div>
              <div className="rounded-xl bg-white/80 p-3 space-y-1 h-full">
                <p className="font-semibold text-slate-900 text-base leading-relaxed">{details.limitText}</p>
                <p className="text-sm text-slate-500 leading-relaxed">Fractionnement en 2 périodes minimum</p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

