import { LeaveScenarioConfig } from '../utils/paternityLeave';
import { buildChecklist } from '../utils/nextSteps';

interface NextStepsCardProps {
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

export function NextStepsCard({
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
}: NextStepsCardProps) {
  const checklist = buildChecklist({
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
  });

  return (
    <ol className="relative space-y-0">
      <div className="absolute left-[19px] sm:left-[21px] top-2 bottom-2 w-[2px] bg-surface-200 rounded-full" />
      {checklist.map(item => (
        <li key={item.label} className="group relative pl-14 sm:pl-16 py-4 sm:py-5 first:pt-0 last:pb-0 transition-all duration-300">
          <span
            className={`absolute left-0 top-4 sm:top-5 inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl text-sm font-bold shadow-sm ring-4 ring-white transition-all duration-500 ${
              item.status === 'done'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20 scale-100'
                : 'bg-white/70 backdrop-blur-sm text-slate-400 border border-surface-200 group-hover:border-brand-200 group-hover:text-brand-400'
            }`}
          >
            {item.status === 'done' ? '✓' : item.index}
          </span>
          <div
            className={`space-y-1.5 p-4 sm:p-5 rounded-2xl transition-all duration-300 ${
              item.status === 'active'
                ? 'bg-white border border-brand-100 shadow-soft sm:scale-[1.02]'
                : 'bg-white/60 border border-transparent group-hover:bg-white/90 group-hover:border-surface-200'
            }`}
          >
            <div className="flex justify-between items-start">
              <p
                className={`font-bold text-base sm:text-lg ${
                  item.status === 'done'
                    ? 'text-slate-900'
                    : item.status === 'active'
                      ? 'text-brand-900'
                      : 'text-slate-500'
                }`}
              >
                {item.label}
              </p>
            </div>
            {item.hint && <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.hint}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
