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
      <div className="absolute left-[17px] sm:left-[19px] top-2 bottom-2 w-[3px] bg-slate-100 rounded-full" />
      {checklist.map(item => (
        <li key={item.label} className="group relative pl-12 sm:pl-14 py-3 sm:py-4 first:pt-0 last:pb-0 transition-all duration-300">
          <span
            className={`absolute left-0 top-3 sm:top-4 inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl text-sm font-bold shadow-sm ring-4 ring-white transition-all duration-500 ${
              item.status === 'done'
                ? 'bg-emerald-500 text-white scale-100'
                : 'bg-white text-slate-400 border-2 border-slate-100 group-hover:border-brand-200 group-hover:text-brand-300'
            }`}
          >
            {item.status === 'done' ? '✓' : item.index}
          </span>
          <div
            className={`space-y-1 p-3.5 sm:p-4 rounded-xl transition-all duration-300 ${
              item.status === 'active'
                ? 'bg-white border border-brand-100 shadow-soft sm:scale-[1.02]'
                : 'group-hover:bg-slate-50'
            }`}
          >
            <div className="flex justify-between items-start">
              <p
                className={`font-bold text-base ${
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
