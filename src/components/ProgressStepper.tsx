import { Check } from 'lucide-react';

interface ProgressStepperProps {
  currentStep: number;
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
      <div className="bg-white rounded-3xl border border-black/10 p-6 sm:p-8 shadow-soft relative overflow-hidden">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 right-0 h-0.5 rounded-full bg-black/10" style={{ top: '24px' }}>
            <div
              className="h-full rounded-full bg-black transition-all duration-500 ease-out"
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
            />
          </div>

          {steps.map(step => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            const isPending = currentStep < step.number;

            return (
              <div key={step.number} className="flex flex-col items-center relative z-10 flex-1">
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-semibold text-lg border transition-all duration-300 ${
                    isCompleted ? 'bg-black border-black text-white' : ''
                  } ${isCurrent ? 'bg-white border-black text-black scale-105' : ''} ${isPending ? 'bg-white border-black/15 text-[#6e6e73]' : ''}`}
                >
                  {isCompleted ? <Check className="w-5 h-5" strokeWidth={2.5} /> : <span>{step.number}</span>}
                </div>

                <div className="mt-4 text-center">
                  <p className={`text-xs sm:text-sm font-medium tracking-wide ${isCurrent ? 'text-[#1d1d1f]' : 'text-[#6e6e73]'}`}>
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
