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
    <div className="max-w-3xl mx-auto mb-8 animate-slide-up">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/50 p-4 sm:p-6 shadow-soft relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-100 via-brand-50 to-transparent opacity-50" />

        <div className="flex items-center justify-between relative">
          <div
            className="absolute left-0 right-0 h-0.5 rounded-full bg-slate-100"
            style={{ top: '20px' }}
          >
            <div
              className="h-full rounded-full bg-brand-500 shadow-[0_0_10px_rgba(14,165,233,0.5)] transition-all duration-700 ease-out"
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
                    w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center font-display font-bold text-base sm:text-lg
                    transition-all duration-500
                    border-2
                    ${isCompleted ? 'bg-brand-500 border-brand-500 text-white shadow-lg shadow-brand-500/30 scale-90' : ''}
                    ${isCurrent ? 'bg-white border-brand-500 text-brand-600 shadow-xl shadow-brand-500/20 scale-105 ring-4 ring-brand-500/10' : ''}
                    ${isPending ? 'bg-white border-slate-100 text-slate-300 scale-90' : ''}
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={3} />
                  ) : (
                    <span>{step.number}</span>
                  )}
                </div>

                <div
                  className={`mt-2 sm:mt-3 text-center transition-all duration-500 px-0.5 ${
                    isCurrent ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-80'
                  }`}
                >
                  <p
                    className={`
                    text-[10px] sm:text-xs font-bold tracking-wide uppercase leading-tight
                    ${isCompleted ? 'text-brand-600' : ''}
                    ${isCurrent ? 'text-slate-900' : ''}
                    ${isPending ? 'text-slate-300' : ''}
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
