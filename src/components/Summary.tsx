import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, CheckCircle2, Clock } from 'lucide-react';
import { LeaveBlock, LeaveScenarioConfig, countCalendarDays } from '../utils/paternityLeave';

interface SummaryProps {
  birthDate: Date | null;
  employerPeriod: LeaveBlock | null;
  mandatoryPeriod: LeaveBlock | null;
  remainingBlocks: LeaveBlock[];
  onRemoveBlock: (index: number) => void;
  totalFractionableDays: number;
  scenario: LeaveScenarioConfig;
}

export function Summary({
  birthDate,
  employerPeriod,
  mandatoryPeriod,
  remainingBlocks,
  onRemoveBlock,
  totalFractionableDays,
  scenario
}: SummaryProps) {
  if (!birthDate) {
    return null;
  }

  const totalRemainingDays = remainingBlocks.reduce(
    (sum, block) => sum + countCalendarDays(block.start, block.end),
    0
  );
  const remainingDaysLeft = totalFractionableDays - totalRemainingDays;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-lg transition-apple-smooth">
      <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
        <div className="p-2 rounded-xl bg-teal-100 text-teal-700">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        Votre planning
      </h2>

      <div className="space-y-4">
        <div className="rounded-2xl border border-teal-200 bg-teal-50 p-5 transition-apple-smooth hover:shadow-md">
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-700 mb-1">Situation</p>
          <p className="text-sm font-semibold text-teal-900">{scenario.label}</p>
          <p className="text-xs text-teal-700 mt-1">
            {totalFractionableDays} jours fractionnables • Jusqu&apos;à {scenario.limitMonthsAfterBirth} mois après la naissance
          </p>
        </div>

        <div className="flex items-start gap-3 pb-4 border-b border-slate-200 mb-4">
          <Calendar className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs font-medium text-slate-500 mb-1">Date de naissance</p>
            <p className="text-slate-900 font-medium text-sm capitalize">
              {format(birthDate, 'EEEE d MMMM yyyy', { locale: fr })}
            </p>
          </div>
        </div>

        {employerPeriod && (
          <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5 mb-3 transition-apple-smooth hover:shadow-md">
            <p className="font-semibold text-sky-900 text-base mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-sky-500 rounded-full" />
              Période employeur
            </p>
            <p className="text-sm text-sky-700 mb-2 font-medium">3 jours ouvrés</p>
            <p className="text-sm text-sky-800">
              Du {format(employerPeriod.start, 'd MMM', { locale: fr })} au{' '}
              {format(employerPeriod.end, 'd MMM yyyy', { locale: fr })}
            </p>
          </div>
        )}

        {mandatoryPeriod && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 mb-3 transition-apple-smooth hover:shadow-md">
            <p className="font-semibold text-amber-900 text-base mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-500 rounded-full" />
              Période obligatoire
            </p>
            <p className="text-sm text-amber-700 mb-2 font-medium">4 jours calendaires</p>
            <p className="text-sm text-amber-800">
              Du {format(mandatoryPeriod.start, 'd MMM', { locale: fr })} au{' '}
              {format(mandatoryPeriod.end, 'd MMM yyyy', { locale: fr })}
            </p>
          </div>
        )}

        <div className="rounded-2xl border border-teal-200 bg-teal-50 p-5 transition-apple-smooth hover:shadow-md">
          <p className="font-semibold text-teal-900 text-base mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-teal-500 rounded-full" />
            Jours fractionnables
          </p>
          {remainingBlocks.length > 0 ? (
            <div className="space-y-3">
              {remainingBlocks.map((block, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-4 group hover:bg-red-50 transition-apple-smooth hover:shadow-md cursor-pointer border border-teal-200/40 hover:border-red-300"
                  onClick={() => onRemoveBlock(index)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-teal-700 font-semibold mb-2 group-hover:text-red-700 transition-colors">
                        Bloc {index + 1}
                      </p>
                      <p className="text-sm text-slate-900 mb-1 group-hover:text-red-900 transition-colors font-medium">
                        Du {format(block.start, 'd MMM', { locale: fr })} au{' '}
                        {format(block.end, 'd MMM yyyy', { locale: fr })}
                      </p>
                      <p className="text-xs text-slate-500 group-hover:text-red-600 transition-colors font-semibold">
                        {countCalendarDays(block.start, block.end)} jours
                      </p>
                    </div>
                    <span className="text-xs text-slate-400 group-hover:text-red-600 font-semibold transition-colors">
                      ✕ Supprimer
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-teal-700 font-medium">Aucun bloc planifié</p>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Jours restants</p>
              <p className="text-slate-900 font-semibold text-2xl">
                {remainingDaysLeft}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">sur {totalFractionableDays} jours</p>
          </div>
        </div>
      </div>
    </div>
  );
}
