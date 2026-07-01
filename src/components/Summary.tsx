import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { memo } from 'react';
import { Calendar, CheckCircle2, Clock, Trash2 } from 'lucide-react';
import { LeaveBlock, LeaveScenarioConfig, countCalendarDays } from '../utils/paternityLeave';
import { SupplementaryLeaveDuration, SupplementaryLeaveMode } from '../utils/supplementaryBirthLeave';
import { getScenarioVocabulary } from '../utils/scenarioVocabulary';

interface SummaryProps {
  birthDate: Date | null;
  employerPeriod: LeaveBlock | null;
  mandatoryPeriod: LeaveBlock | null;
  remainingBlocks: LeaveBlock[];
  onRemoveBlock: (index: number) => void;
  totalFractionableDays: number;
  scenario: LeaveScenarioConfig;
  supplementaryLeavePeriods?: LeaveBlock[];
  supplementaryLeaveDuration?: SupplementaryLeaveDuration;
  supplementaryLeaveMode?: SupplementaryLeaveMode;
}

export const Summary = memo(function Summary({
  birthDate,
  employerPeriod,
  mandatoryPeriod,
  remainingBlocks,
  onRemoveBlock,
  totalFractionableDays,
  scenario,
  supplementaryLeavePeriods,
  supplementaryLeaveDuration,
  supplementaryLeaveMode
}: SummaryProps) {
  if (!birthDate) return null;

  const totalRemainingDays = remainingBlocks.reduce(
    (sum, block) => sum + countCalendarDays(block.start, block.end),
    0
  );
  const remainingDaysLeft = totalFractionableDays - totalRemainingDays;
  const vocabulary = getScenarioVocabulary(scenario);

  return (
    <div className="rounded-card border border-slate-200 bg-white p-5 sm:p-7 shadow-depth-md">
      <header className="mb-6 sm:mb-7 flex items-center gap-3 sm:gap-4">
        <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-md shadow-brand-500/20">
          <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div>
          <h2 className="text-xl sm:text-[1.6rem] font-bold font-display text-slate-900">Récapitulatif</h2>
          <p className="text-sm sm:text-base text-slate-500 font-medium">Votre planning complet</p>
        </div>
      </header>

      <div className="space-y-5 sm:space-y-6">
        {/* Situation Card */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Votre situation</p>
            <span className="px-2.5 py-1 rounded-lg bg-white text-xs font-bold text-slate-700 border border-slate-200 shadow-sm">
              {scenario.limitMonthsAfterBirth} mois
            </span>
          </div>
          <p className="text-lg font-bold text-slate-900">{scenario.label}</p>
          <p className="text-sm text-slate-600 mt-1 font-medium">
            Droit total : <span className="text-slate-900">{totalFractionableDays + 7} jours</span> ({vocabulary.totalDetail})
          </p>
        </div>

        {/* Timeline */}
        <div className="relative pl-4 border-l-2 border-slate-200 space-y-6 sm:space-y-8">
          {/* Date de départ */}
          <div className="relative">
            <div className="absolute -left-[21px] top-1 h-4 w-4 rounded-full border-[3px] border-white bg-slate-900 shadow-sm shadow-slate-900/20" />
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Point de départ</p>
            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
              <Calendar className="w-5 h-5 text-slate-700" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium text-slate-500">{vocabulary.eventDateLabel}</p>
                <p className="text-base font-bold text-slate-900 capitalize">
                  {format(birthDate, 'EEEE d MMMM yyyy', { locale: fr })}
                </p>
              </div>
            </div>
          </div>

          {/* Périodes fixes */}
          {(employerPeriod || mandatoryPeriod) && (
            <div className="relative">
              <div className="absolute -left-[21px] top-6 h-4 w-4 rounded-full border-[3px] border-white bg-brand-600 shadow-sm shadow-brand-600/20" />
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Périodes automatiques</p>
              <div className="space-y-3">
                {employerPeriod && (
                  <div className="flex gap-3 sm:gap-4 items-start p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-brand-50/80 to-brand-50/30 border border-brand-100 shadow-sm">
                    <div className="w-1 self-stretch bg-brand-300 rounded-full flex-shrink-0" />
                    <div>
                      <p className="font-bold text-brand-900 text-sm">{vocabulary.employerLeaveLabel}</p>
                      <p className="text-xs text-brand-700 mt-1 font-medium">
                        Du {format(employerPeriod.start, 'd MMM', { locale: fr })} au {format(employerPeriod.end, 'd MMM yyyy', { locale: fr })}
                      </p>
                    </div>
                  </div>
                )}
                {mandatoryPeriod && (
                  <div className="flex gap-3 sm:gap-4 items-start p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-brand-50/80 to-brand-50/30 border border-brand-100 shadow-sm">
                    <div className="w-1 self-stretch bg-brand-600 rounded-full flex-shrink-0" />
                    <div>
                      <p className="font-bold text-brand-900 text-sm">Période obligatoire (4j)</p>
                      <p className="text-xs text-brand-700 mt-1 font-medium">
                        Du {format(mandatoryPeriod.start, 'd MMM', { locale: fr })} au {format(mandatoryPeriod.end, 'd MMM yyyy', { locale: fr })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Jours fractionnables */}
          <div className="relative">
            <div className="absolute -left-[21px] top-1 h-4 w-4 rounded-full border-[3px] border-white bg-success-500 shadow-sm shadow-success-500/20" />
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Vos périodes choisies</p>
              <div className="text-right">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  remainingDaysLeft === 0
                    ? 'bg-success-100 text-success-700 border border-success-200'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                  {remainingDaysLeft > 0 ? `${remainingDaysLeft} jours restants` : 'Planning complet !'}
                </span>
              </div>
            </div>

            {remainingBlocks.length > 0 ? (
              <div className="space-y-3">
                {remainingBlocks.map((block, index) => (
                  <div
                    key={index}
                    className="group flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200 hover:border-red-200 hover:bg-red-50/30 transition-all duration-200 shadow-sm"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex flex-col items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-success-500 to-success-600 text-white font-bold text-xs shadow-sm shadow-success-500/20">
                        <span>{countCalendarDays(block.start, block.end)}j</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900">Période {index + 1}</p>
                        <p className="text-xs text-slate-500 font-medium">
                          Du {format(block.start, 'd MMM', { locale: fr })} au {format(block.end, 'd MMM yyyy', { locale: fr })}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveBlock(index)}
                      type="button"
                      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-300 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
                      title="Supprimer cette période"
                      aria-label={`Supprimer la période ${index + 1}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-xl border-2 border-dashed border-slate-200 text-center bg-slate-50/50">
                <p className="text-sm text-slate-500 font-medium">Aucune période planifiée</p>
                <p className="text-xs text-slate-400 mt-1">Cliquez sur une date dans le calendrier pour placer une période (min. 5 jours consécutifs)</p>
              </div>
            )}
          </div>

          {supplementaryLeavePeriods && supplementaryLeavePeriods.length > 0 && (
            <div className="relative">
              <div className="absolute -left-[21px] top-1 h-4 w-4 rounded-full border-[3px] border-white bg-slate-900 shadow-sm" />
              <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Congé supplémentaire 2026
                </p>
                <div className="flex items-center gap-2">
                  {supplementaryLeaveMode === 'split' && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                      2 × 1 mois
                    </span>
                  )}
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-900 text-white shadow-sm">
                    {supplementaryLeaveDuration ?? 1} mois
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                {supplementaryLeavePeriods.map((entry, index) => (
                  <div
                    key={`${entry.start.getTime()}-${index}`}
                    className="flex gap-3 sm:gap-4 items-start p-3.5 sm:p-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md shadow-slate-900/20"
                  >
                    <div className="w-1 self-stretch bg-brand-400 rounded-full flex-shrink-0" />
                    <div>
                      <p className="font-bold text-sm">
                        {supplementaryLeavePeriods.length > 1
                          ? `Période ${index + 1} (1 mois)`
                          : 'Période complémentaire ajoutée'}
                      </p>
                      <p className="text-xs text-slate-300 mt-1 font-medium">
                        Du {format(entry.start, 'd MMM', { locale: fr })} au {format(entry.end, 'd MMM yyyy', { locale: fr })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Totals */}
        <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-slate-100 to-white rounded-lg text-slate-500 shadow-sm">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-400">Total planifié</p>
              <p className="text-xl font-bold text-slate-900">
                {totalRemainingDays} <span className="text-sm font-medium text-slate-500">/ {totalFractionableDays} jours</span>
                {remainingDaysLeft === 0 && (
                  <span className="ml-3 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-sm shadow-emerald-500/20">
                    Complet
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
