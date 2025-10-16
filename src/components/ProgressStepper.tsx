import { Check } from 'lucide-react';

interface ProgressStepperProps {
  currentStep: number; // 1, 2, or 3
}

export function ProgressStepper({ currentStep }: ProgressStepperProps) {
  const steps = [
    { number: 1, label: 'Date de naissance', shortLabel: 'Naissance' },
    { number: 2, label: 'Périodes obligatoires', shortLabel: 'Obligatoire' },
    { number: 3, label: 'Planification 21j', shortLabel: 'Planning' }
  ];

  return (
    <div className="max-w-2xl mx-auto mb-8 px-4 animate-slide-up">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-slate-200 p-4 sm:p-6 shadow-lg">
        <div className="flex items-center justify-between relative">
          {/* Progress bar background */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-slate-200 rounded-full -z-0" style={{ top: '20px' }}>
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
            />
          </div>

          {/* Steps */}
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            const isPending = currentStep < step.number;

            return (
              <div key={step.number} className="flex flex-col items-center relative z-10 flex-1">
                {/* Circle */}
                <div
                  className={`
                    w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-sm sm:text-base
                    transition-all duration-500 ease-out
                    ${isCompleted ? 'bg-gradient-to-br from-emerald-500 to-green-500 text-white shadow-lg scale-100' : ''}
                    ${isCurrent ? 'bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-xl scale-110 animate-pulse-subtle' : ''}
                    ${isPending ? 'bg-slate-200 text-slate-400 scale-90' : ''}
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 sm:w-6 sm:h-6 animate-scale-in" strokeWidth={3} />
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
