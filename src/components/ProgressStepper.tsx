import { Check } from 'lucide-react';

interface ProgressStepperProps {
  currentStep: number; // 1, 2, or 3
  fractionableDays: number;
}

export function ProgressStepper({ currentStep, fractionableDays }: ProgressStepperProps) {
  const steps = [
    { number: 1, label: 'Date de naissance', shortLabel: 'Naissance' },
    { number: 2, label: 'Périodes obligatoires', shortLabel: 'Obligatoire' },
    { number: 3, label: `Planification ${fractionableDays}j`, shortLabel: 'Planning' }
  ];

  return (
    <div className="max-w-3xl mx-auto mb-8 animate-slide-up">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/50 p-6 sm:p-8 shadow-soft relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-100 via-brand-50 to-transparent opacity-50" />

        <div className="flex items-center justify-between relative">
          {/* Progress bar background */}
          <div
            className="absolute left-0 right-0 h-0.5 rounded-full bg-slate-100"
            style={{ top: '24px' }}
          >
            <div
              className="h-full rounded-full bg-brand-500 shadow-[0_0_10px_rgba(14,165,233,0.5)] transition-all duration-700 ease-out"
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
            />
          </div>

          {/* Steps */}
          {steps.map(step => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            const isPending = currentStep < step.number;

            return (
              <div key={step.number} className="flex flex-col items-center relative z-10 flex-1 group">
                {/* Circle */}
                <div
                  className={`
                    w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-display font-bold text-lg
                    transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)
                    border-2
                    ${isCompleted ? 'bg-brand-500 border-brand-500 text-white shadow-lg shadow-brand-500/30 scale-90' : ''}
                    ${isCurrent ? 'bg-white border-brand-500 text-brand-600 shadow-xl shadow-brand-500/20 scale-110 ring-4 ring-brand-500/10' : ''}
                    ${isPending ? 'bg-white border-slate-100 text-slate-300 scale-90' : ''}
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6" strokeWidth={3} />
                  ) : (
                    <span>{step.number}</span>
                  )}
                </div>

                {/* Label */}
                <div className={`mt-4 text-center transition-all duration-500 ${isCurrent ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-80'}`}>
                  <p className={`
                    text-xs sm:text-sm font-bold tracking-wide uppercase
                    ${isCompleted ? 'text-brand-600' : ''}
                    ${isCurrent ? 'text-slate-900' : ''}
                    ${isPending ? 'text-slate-300' : ''}
                  `}>
                    <span className="hidden sm:inline">{step.label}</span>
                    <span className="sm:hidden">{step.shortLabel}</span>
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
