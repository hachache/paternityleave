import { AnimatePresence, motion } from 'framer-motion';
import { LEAVE_SCENARIOS, LeaveScenarioConfig, LeaveScenarioId } from '../utils/paternityLeave';
import { FRACTIONABLE_PERIODS_HINT } from '../utils/scenarioVocabulary';
import { fadeIn, springs, useAppMotion } from '../lib/motion';

interface ScenarioSelectorProps {
  selectedScenario: LeaveScenarioId;
  onScenarioChange: (id: LeaveScenarioId) => void;
}

function formatScenarioDetails(config: LeaveScenarioConfig) {
  const additionalDays = config.fractionableDays - LEAVE_SCENARIOS.standard.fractionableDays;
  const isHospitalization = config.id === 'hospitalized-newborn';

  return {
    totalText: `${config.fractionableDays} jours`,
    bonusText: additionalDays > 0 ? `+${additionalDays} jours` : null,
    limitText: isHospitalization ? `${config.limitMonthsAfterBirth} mois simulés` : `${config.limitMonthsAfterBirth} mois`,
    cautionText: isHospitalization
      ? 'Les reports liés à une hospitalisation doivent être vérifiés avec justificatif auprès de la CPAM ou de l’employeur.'
      : null,
    periodHint: FRACTIONABLE_PERIODS_HINT
  };
}

export function ScenarioSelector({ selectedScenario, onScenarioChange }: ScenarioSelectorProps) {
  const scenarios = Object.values(LEAVE_SCENARIOS);
  const selectedConfig = LEAVE_SCENARIOS[selectedScenario];
  const selectedDetails = formatScenarioDetails(selectedConfig);
  const { shouldReduce } = useAppMotion();
  const selectionTransition = shouldReduce ? { duration: 0 } : springs.gentle;

  return (
    <div className="space-y-3.5">
      <fieldset className="grid gap-2">
        <legend className="sr-only">Choix de la situation</legend>
        {scenarios.map(config => {
          const isSelected = config.id === selectedScenario;
          const details = formatScenarioDetails(config);
          const inputId = `scenario-${config.id}`;

          return (
            <motion.label
              key={config.id}
              htmlFor={inputId}
              layout
              transition={selectionTransition}
              whileHover={shouldReduce ? undefined : { y: -1 }}
              className={`group flex min-h-12 items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors duration-200 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand-500 sm:min-h-12 sm:py-3 ${
                isSelected
                  ? 'border-brand-600 bg-[#fbfdff] text-[#1d1d1f]'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <input
                id={inputId}
                type="radio"
                name="leave-scenario"
                value={config.id}
                checked={isSelected}
                onChange={() => onScenarioChange(config.id)}
                className="h-4 w-4 shrink-0 accent-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
              />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold leading-snug tracking-[-0.018em] text-[#1d1d1f]">
                  {config.label}
                </span>
                <span className="mt-0.5 block text-xs font-normal text-slate-500">
                  {details.totalText}{details.bonusText ? ` · ${details.bonusText}` : ''}
                </span>
              </span>
              {config.id === 'standard' && (
                <span className="rounded-full bg-[#fafafc] px-2 py-1 text-[10px] font-normal tracking-[-0.01em] text-brand-600 ring-1 ring-slate-200">
                  Courant
                </span>
              )}
            </motion.label>
          );
        })}
      </fieldset>

      <AnimatePresence initial={false}>
        <motion.div
          key={selectedConfig.id}
          layout
          className="rounded-xl border border-slate-200 bg-[#fafafc] p-3.5"
          initial={shouldReduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          variants={fadeIn}
          transition={selectionTransition}
        >
          <p className="text-[13px] font-normal leading-relaxed tracking-[-0.01em] text-slate-700 sm:text-sm">
            {selectedConfig.description}
          </p>
          <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="min-w-0 rounded-lg bg-white px-3 py-2.5 ring-1 ring-slate-200">
              <dt className="truncate text-[10px] font-semibold uppercase tracking-[0.06em] text-slate-400">Fractionnable</dt>
              <dd className="mt-1 font-semibold text-[#1d1d1f]">{selectedDetails.totalText}</dd>
            </div>
            <div className="min-w-0 rounded-lg bg-white px-3 py-2.5 ring-1 ring-slate-200">
              <dt className="truncate text-[10px] font-semibold uppercase tracking-[0.06em] text-slate-400">Délai</dt>
              <dd className="mt-1 font-semibold text-[#1d1d1f]">{selectedDetails.limitText}</dd>
            </div>
          </dl>
          <p className="mt-2.5 text-[11px] font-normal leading-relaxed text-slate-500">
            {selectedDetails.periodHint}
          </p>
          {selectedDetails.cautionText && (
            <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs font-normal leading-relaxed text-amber-900">
              {selectedDetails.cautionText}
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
