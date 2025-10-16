import { differenceInDays } from 'date-fns';
import { LeaveBlock } from '../utils/paternityLeave';

interface ProgressCounterProps {
  birthDate: Date | null;
  remainingBlocks: LeaveBlock[];
}

export function ProgressCounter({ birthDate, remainingBlocks }: ProgressCounterProps) {
  if (!birthDate) return null;

  const totalDays = 28; // 3 + 4 + 21
  const employerDays = 3;
  const mandatoryDays = 4;

  const remainingDaysPlanned = remainingBlocks.reduce((sum, block) =>
    sum + (differenceInDays(block.end, block.start) + 1), 0
  );

  const plannedDays = employerDays + mandatoryDays + remainingDaysPlanned;
  const daysLeft = 21 - remainingDaysPlanned;
  const progressPercentage = (plannedDays / totalDays) * 100;

  const isComplete = plannedDays === totalDays;

  return (
    <div className="max-w-2xl mx-auto mb-6 animate-slide-up">
      <div className={`
        bg-gradient-to-br from-white to-slate-50 rounded-2xl border-2 p-5 shadow-lg
        transition-all duration-500
        ${isComplete
          ? 'border-emerald-400 shadow-emerald-200/50 shadow-xl'
          : 'border-slate-200 hover:shadow-xl'
        }
      `}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`
              w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl shadow-md
              transition-all duration-500
              ${isComplete
                ? 'bg-gradient-to-br from-emerald-500 to-green-500 text-white animate-pulse-subtle scale-110'
                : 'bg-gradient-to-br from-teal-500 to-emerald-500 text-white'
              }
            `}>
              {isComplete ? '✓' : '📊'}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {isComplete ? 'Planning complet !' : 'Progression'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                <span className="font-bold text-teal-700">{plannedDays}</span>
                <span className="text-slate-400 mx-1">/</span>
                <span className="font-semibold">{totalDays} jours</span>
              </p>
            </div>
          </div>

          {!isComplete && daysLeft > 0 && (
            <div className="text-right">
              <p className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600">
                {daysLeft}
              </p>
              <p className="text-xs text-slate-500 font-medium">
                jour{daysLeft > 1 ? 's' : ''} restant{daysLeft > 1 ? 's' : ''}
              </p>
            </div>
          )}

          {isComplete && (
            <div className="text-right">
              <p className="text-2xl sm:text-3xl animate-bounce">
                🎉
              </p>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner">
            <div
              className={`
                h-full rounded-full transition-all duration-700 ease-out
                ${isComplete
                  ? 'bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500 animate-pulse-subtle'
                  : 'bg-gradient-to-r from-teal-500 to-emerald-500'
                }
              `}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Percentage label */}
          <div className="absolute -top-6 right-0">
            <span className={`
              text-xs font-bold px-2 py-1 rounded-lg shadow-sm
              ${isComplete
                ? 'bg-emerald-500 text-white'
                : 'bg-teal-500 text-white'
              }
            `}>
              {Math.round(progressPercentage)}%
            </span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="grid grid-cols-3 gap-2 mt-4 text-center">
          <div className="bg-sky-100 rounded-lg p-2">
            <p className="text-xs text-sky-600 font-medium">Employeur</p>
            <p className="text-lg font-bold text-sky-700">{employerDays}j</p>
          </div>
          <div className="bg-amber-100 rounded-lg p-2">
            <p className="text-xs text-amber-600 font-medium">Obligatoire</p>
            <p className="text-lg font-bold text-amber-700">{mandatoryDays}j</p>
          </div>
          <div className={`rounded-lg p-2 ${isComplete ? 'bg-emerald-100' : 'bg-teal-100'}`}>
            <p className={`text-xs font-medium ${isComplete ? 'text-emerald-600' : 'text-teal-600'}`}>
              Fractionnés
            </p>
            <p className={`text-lg font-bold ${isComplete ? 'text-emerald-700' : 'text-teal-700'}`}>
              {remainingDaysPlanned}/21j
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
