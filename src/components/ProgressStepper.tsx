import { motion } from 'framer-motion';
import { LeaveScenarioConfig } from '../utils/paternityLeave';
import { buildProgressSteps } from '../utils/progressSteps';
import { slideUp, springs, useAppMotion } from '../lib/motion';

interface ProgressStepperProps {
  currentStep: number;
  fractionableDays: number;
  scenario: LeaveScenarioConfig;
}

const activeStepVariants = {
  initial: {
    scale: 0.96,
    boxShadow: '0 0 0 0 rgba(20, 124, 229, 0)'
  },
  animate: {
    scale: 1.05,
    boxShadow: '0 20px 25px -5px rgba(20, 124, 229, 0.2)'
  }
};

export function ProgressStepper({ currentStep, fractionableDays, scenario }: ProgressStepperProps) {
  const steps = buildProgressSteps(fractionableDays, scenario);
  const { shouldReduce, transition } = useAppMotion();

  const progressPercent = currentStep <= 1 ? 0 : ((currentStep - 1) / (steps.length - 1)) * 100;
  const progressTransition = shouldReduce ? { duration: 0 } : springs.gentle;

  return (
    <motion.div
      className="max-w-3xl mx-auto mb-8"
      initial="hidden"
      animate="visible"
      variants={slideUp}
      transition={transition}
    >
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/50 p-4 sm:p-6 shadow-soft relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-100 via-brand-50 to-transparent opacity-50" />

        <div className="flex items-center justify-between relative">
          <div
            className="absolute left-0 right-0 h-0.5 rounded-full bg-slate-100"
            style={{ top: '20px' }}
          >
            <motion.div
              className="h-full rounded-full bg-brand-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]"
              animate={{ width: `${progressPercent}%` }}
              transition={progressTransition}
            />
          </div>

          {steps.map(step => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            const isPending = currentStep < step.number;

            return (
              <div key={step.number} className="flex flex-col items-center relative z-10 flex-1 min-w-0 group">
                <motion.div
                  className={`
                    w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center font-display font-bold text-base sm:text-lg
                    border-2
                    ${isCompleted ? 'bg-brand-500 border-brand-500 text-white shadow-lg shadow-brand-500/30 scale-90' : ''}
                    ${isCurrent ? 'bg-white border-brand-500 text-brand-600 shadow-xl shadow-brand-500/20 scale-105 ring-4 ring-brand-500/10' : ''}
                    ${isPending ? 'bg-white border-slate-100 text-slate-300 scale-90' : ''}
                  `}
                  variants={isCurrent ? activeStepVariants : undefined}
                  initial={isCurrent ? 'initial' : false}
                  animate={isCurrent ? 'animate' : { scale: isCompleted || isPending ? 0.9 : 1 }}
                  transition={transition}
                >
                  {isCompleted ? (
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <motion.path
                        d="M20 6 9 17l-5-5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={shouldReduce ? { duration: 0 } : { duration: 0.4 }}
                      />
                    </svg>
                  ) : (
                    <span>{step.number}</span>
                  )}
                </motion.div>

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
    </motion.div>
  );
}
