import { LEAVE_SCENARIOS, LeaveScenarioConfig, LeaveScenarioId } from '../utils/paternityLeave';
import { FRACTIONABLE_PERIODS_HINT } from '../utils/scenarioVocabulary';

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
    <div role="radiogroup" aria-label="Choix de la situation" className="grid gap-4 sm:grid-cols-2 auto-rows-fr">
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
            className={`group relative rounded-3xl p-6 text-left transition-all duration-300 h-full flex flex-col border-2 ${
              isSelected
                ? 'border-brand-500 bg-brand-50/50 shadow-lg shadow-brand-500/10'
                : 'border-slate-100 bg-white hover:border-brand-200 hover:shadow-md'
            }`}
          >
            {/* Selection Indicator */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${isSelected ? 'text-brand-600' : 'text-slate-500 group-hover:text-brand-500'}`}>
                    {config.label}
                  </p>
                  {config.id === 'standard' && (
                    <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-600">
                      Courant
                    </span>
                  )}
                </div>
                <p className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed">{config.description}</p>
              </div>
              <div
                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${
                  isSelected ? 'border-brand-500 bg-brand-500 text-white' : 'border-slate-200 group-hover:border-brand-300'
                }`}
              >
                {isSelected && <span className="text-xs font-bold">✓</span>}
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-slate-100/50 grid sm:grid-cols-2 gap-3">
              <div className={`rounded-xl p-3 transition-colors ${isSelected ? 'bg-white/60' : 'bg-slate-50 group-hover:bg-brand-50/30'}`}>
                <p className="font-bold text-slate-900 text-sm">{details.totalText}</p>
                {details.bonusText && (
                  <p className="text-xs font-bold text-emerald-600 mt-0.5">{details.bonusText}</p>
                )}
              </div>
              <div className={`rounded-xl p-3 transition-colors ${isSelected ? 'bg-white/60' : 'bg-slate-50 group-hover:bg-brand-50/30'}`}>
                <p className="font-bold text-slate-900 text-sm">{details.limitText}</p>
                <p className="text-[10px] text-slate-500 mt-0.5 font-medium uppercase tracking-wide">
                  {FRACTIONABLE_PERIODS_HINT}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
