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
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-lg">
        <div className="flex items-center justify-between relative">
          {/* Progress bar background */}
          <div
            className="absolute left-0 right-0 h-1 rounded-full bg-slate-200"
            style={{ top: '20px' }}
          >
            <div
              className="h-full rounded-full bg-teal-500 transition-all duration-500 ease-out"
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
            />
          </div>

          {/* Steps */}
          {steps.map(step => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            const isPending = currentStep < step.number;

            return (
              <div key={step.number} className="flex flex-col items-center relative z-10 flex-1">
                {/* Circle */}
                <div
                  className={`
                    w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-sm sm:text-base
                    transition-all duration-300 ease-out
                    ${isCompleted ? 'bg-emerald-500 text-white shadow-md' : ''}
                    ${isCurrent ? 'bg-teal-600 text-white shadow-md scale-110' : ''}
                    ${isPending ? 'bg-slate-200 text-slate-500 scale-95' : ''}
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={3} />
                  ) : (
                    <span>{step.number}</span>
                  )}
                </div>

                {/* Label */}
                <div className="mt-2 sm:mt-3 text-center">
                  <p className={`
                    text-xs sm:text-sm font-semibold transition-all duration-300
                    ${isCompleted ? 'text-emerald-700' : ''}
                    ${isCurrent ? 'text-teal-700' : ''}
                    ${isPending ? 'text-slate-400' : ''}
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
