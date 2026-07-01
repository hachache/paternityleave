import { AnimatePresence, motion } from 'framer-motion';
import { LEAVE_SCENARIOS, LeaveScenarioConfig, LeaveScenarioId } from '../utils/paternityLeave';
import { FRACTIONABLE_PERIODS_HINT } from '../utils/scenarioVocabulary';
import { springs, useAppMotion } from '../lib/motion';

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
  const { shouldReduce } = useAppMotion();
  const cardTransition = shouldReduce ? { duration: 0 } : springs.snappy;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = scenarios.findIndex(s => s.id === selectedScenario);
    const lastIndex = scenarios.length - 1;
    let nextIndex = currentIndex;

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        nextIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        nextIndex = currentIndex === 0 ? lastIndex : currentIndex - 1;
        break;
      default:
        return;
    }

    onScenarioChange(scenarios[nextIndex].id);
  };

  return (
    <div role="radiogroup" aria-label="Choix de la situation" onKeyDown={handleKeyDown} className="grid grid-cols-2 gap-2.5 sm:gap-4 auto-rows-auto sm:auto-rows-fr">
      {scenarios.map(config => {
        const isSelected = config.id === selectedScenario;
        const details = formatScenarioDetails(config);

        return (
          <motion.button
            key={config.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onScenarioChange(config.id)}
            whileHover={shouldReduce ? undefined : { y: -2 }}
            whileTap={shouldReduce ? undefined : { scale: 0.98 }}
            transition={cardTransition}
            className={`group relative rounded-2xl sm:rounded-3xl p-3 sm:p-6 text-left transition-[background-color,border-color,box-shadow,transform] duration-200 h-full flex flex-col border ${isSelected ? 'col-span-2 sm:col-span-1' : ''} ${
              isSelected
                ? 'border-brand-500 bg-brand-50/50 shadow-md shadow-brand-500/10 sm:border-transparent sm:shadow-lg'
                : 'border-slate-100 bg-white hover:border-brand-200 hover:shadow-md'
            }`}
          >
            {isSelected && (
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl sm:rounded-3xl border-2 border-brand-500 hidden sm:block"
              />
            )}
            {/* Selection Indicator */}
            <div className={`flex items-start justify-between gap-3 sm:gap-4 ${isSelected ? 'mb-2 sm:mb-4' : 'mb-0 sm:mb-4'}`}>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-1.5 sm:mb-2 ${isSelected ? 'text-brand-600' : 'text-slate-500 group-hover:text-brand-500'}`}>
                    {config.label}
                  </p>
                  {config.id === 'standard' && (
                    <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-600">
                      Standard
                    </span>
                  )}
                </div>
                <p className={`text-xs sm:text-lg text-slate-700 font-medium leading-relaxed ${isSelected ? 'line-clamp-2 sm:line-clamp-none' : 'hidden sm:block sm:line-clamp-none'}`}>
                  {config.description}
                </p>
              </div>
              <div
                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 items-center justify-center transition-colors duration-300 ${isSelected ? 'flex' : 'hidden sm:flex'} ${
                  isSelected ? 'border-brand-500 bg-brand-500 text-white' : 'border-slate-200 group-hover:border-brand-300'
                }`}
              >
                <AnimatePresence initial={false}>
                  {isSelected && (
                    <motion.span
                      key="selected-check"
                      className="text-xs font-bold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={cardTransition}
                    >
                      ✓
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className={`mt-auto pt-2.5 sm:pt-4 border-t border-slate-100/50 grid grid-cols-2 gap-2 sm:gap-3 ${isSelected ? '' : 'hidden sm:grid'}`}>
              <div className={`rounded-xl p-2.5 sm:p-3 transition-colors ${isSelected ? 'bg-white/60' : 'bg-slate-50 group-hover:bg-brand-50/30'}`}>
                <p className="font-bold text-slate-900 text-xs sm:text-sm">{details.totalText}</p>
                {details.bonusText && (
                  <p className="text-xs font-bold text-emerald-600 mt-0.5">{details.bonusText}</p>
                )}
              </div>
              <div className={`rounded-xl p-2.5 sm:p-3 transition-colors ${isSelected ? 'bg-white/60' : 'bg-slate-50 group-hover:bg-brand-50/30'}`}>
                <p className="font-bold text-slate-900 text-xs sm:text-sm">{details.limitText}</p>
                <p className="text-[10px] text-slate-500 mt-0.5 font-medium uppercase tracking-wide sm:hidden">
                  1 ou 2 périodes
                </p>
                <p className="hidden sm:block text-[10px] text-slate-500 mt-0.5 font-medium uppercase tracking-wide">
                  {FRACTIONABLE_PERIODS_HINT}
                </p>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
