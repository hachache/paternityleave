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
            className={`group relative rounded-3xl p-6 text-left transition-all duration-300 h-full flex flex-col border ${
              isSelected
                ? 'border-black bg-[#f5f5f7]'
                : 'border-black/10 bg-white hover:border-black/30'
            }`}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isSelected ? 'text-[#1d1d1f]' : 'text-[#6e6e73]'}`}>
                  {config.label}
                </p>
                <p className="text-base text-[#1d1d1f] font-medium leading-relaxed">{config.description}</p>
              </div>
              <div
                className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-colors duration-300 ${
                  isSelected ? 'border-black bg-black text-white' : 'border-black/20'
                }`}
              >
                {isSelected && <span className="text-xs font-semibold">✓</span>}
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-black/10 grid sm:grid-cols-2 gap-3">
              <div className="rounded-xl p-3 bg-white border border-black/10">
                <p className="font-semibold text-[#1d1d1f] text-sm">{details.totalText}</p>
                {details.bonusText && <p className="text-xs font-semibold text-[#0071e3] mt-0.5">{details.bonusText}</p>}
              </div>
              <div className="rounded-xl p-3 bg-white border border-black/10">
                <p className="font-semibold text-[#1d1d1f] text-sm">{details.limitText}</p>
                <p className="text-[10px] text-[#6e6e73] mt-0.5 font-medium uppercase tracking-wide">2 périodes min.</p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
