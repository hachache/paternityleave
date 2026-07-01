import { Check } from 'lucide-react';
import { LeaveScenarioConfig } from '../utils/paternityLeave';
import { buildProgressSteps } from '../utils/progressSteps';

interface ProgressStepperProps {
  currentStep: number;
  fractionableDays: number;
  scenario: LeaveScenarioConfig;
}

export function ProgressStepper({ currentStep, fractionableDays, scenario }: ProgressStepperProps) {
  const steps = buildProgressSteps(fractionableDays, scenario);

  const progressPercent = currentStep <= 1 ? 0 : ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="reveal max-w-3xl mx-auto mb-8">
      <div className="glass-card p-3.5 sm:p-6 relative overflow-hidden">
        {/* Barre lumineuse supérieure */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-300 via-brand-500 to-brand-300 opacity-60" />

        <div className="flex items-center justify-between relative">
          {/* Ligne de progression de fond */}
          <div
            className="absolute left-0 right-0 h-[3px] rounded-full bg-slate-100"
            style={{ top: '22px' }}
            role="progressbar"
            aria-valuenow={Math.round(progressPercent)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progression du planning"
          >
            {/* Barre de progression active avec gradient */}
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400 shadow-[0_0_10px_rgba(0,113,227,0.4)] transition-[width] duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {steps.map(step => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            const isPending = currentStep < step.number;

            return (
              <div key={step.number} className="flex flex-col items-center relative z-10 flex-1 min-w-0 group">
                <div
                  className={`
                    w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center font-display font-bold text-sm sm:text-lg
                    border-2 transition-all duration-300
                    ${isCompleted ? 'bg-gradient-to-br from-brand-500 to-brand-600 border-brand-500 text-white shadow-md shadow-brand-500/20 scale-90' : ''}
                    ${isCurrent ? 'bg-white border-brand-500 text-brand-600 shadow-lg shadow-brand-500/15 scale-105 ring-4 ring-brand-500/10 animate-glow-pulse' : ''}
                    ${isPending ? 'bg-white border-slate-200 text-slate-400 scale-90' : ''}
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={3} aria-hidden="true" />
                  ) : (
                    <span>{step.number}</span>
                  )}
                </div>

                <div
                  className={`mt-2 sm:mt-3 text-center transition-all duration-500 px-1 ${
                    isCurrent ? 'translate-y-0 opacity-100' : 'translate-y-0.5 opacity-75'
                  }`}
                >
                  <p
                    className={`
                    text-[10px] sm:text-xs font-bold tracking-wide uppercase leading-tight
                    ${isCompleted ? 'text-brand-600' : ''}
                    ${isCurrent ? 'text-slate-900' : ''}
                    ${isPending ? 'text-slate-400' : ''}
                  `}
                  >
                    <span className="hidden lg:inline">{step.label}</span>
                    <span className="lg:hidden">{step.shortLabel}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
