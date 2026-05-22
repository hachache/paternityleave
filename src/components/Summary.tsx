import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
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

export function Summary({
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
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/40">
      <header className="mb-8 flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-brand-100 text-brand-600">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-900">Récapitulatif</h2>
          <p className="text-slate-500 font-medium">Votre planning complet</p>
        </div>
      </header>

      <div className="space-y-6">
        {/* Situation Card */}
        <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Votre situation</p>
            <span className="px-2 py-1 rounded-md bg-white text-xs font-bold text-slate-700 border border-slate-200 shadow-sm">
              {scenario.limitMonthsAfterBirth} mois
            </span>
          </div>
          <p className="text-lg font-bold text-slate-900">{scenario.label}</p>
          <p className="text-sm text-slate-600 mt-1 font-medium">
            Droit total : <span className="text-slate-900">{totalFractionableDays + 7} jours</span> ({vocabulary.totalDetail})
          </p>
        </div>

        <div className="relative pl-4 border-l-2 border-slate-100 space-y-8">
          {/* Date de départ */}
          <div className="relative">
            <div className="absolute -left-[21px] top-1 h-4 w-4 rounded-full border-2 border-white bg-slate-900 shadow-sm" />
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Point de départ</p>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-slate-700" />
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
              <div className="absolute -left-[21px] top-6 h-4 w-4 rounded-full border-2 border-white bg-brand-600 shadow-sm" />
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Périodes automatiques</p>
              <div className="space-y-3">
                {employerPeriod && (
                  <div className="flex gap-4 items-start p-4 rounded-xl bg-brand-50/50 border border-brand-100">
                    <div className="w-1 h-full bg-brand-300 rounded-full" />
                    <div>
                      <p className="font-bold text-brand-900 text-sm">{vocabulary.employerLeaveLabel}</p>
                      <p className="text-xs text-brand-700 mt-1">
                        Du {format(employerPeriod.start, 'd MMM', { locale: fr })} au {format(employerPeriod.end, 'd MMM yyyy', { locale: fr })}
                      </p>
                    </div>
                  </div>
                )}
                {mandatoryPeriod && (
                  <div className="flex gap-4 items-start p-4 rounded-xl bg-brand-50/50 border border-brand-100">
                    <div className="w-1 h-full bg-brand-600 rounded-full" />
                    <div>
                      <p className="font-bold text-brand-900 text-sm">Période obligatoire (4j)</p>
                      <p className="text-xs text-brand-700 mt-1">
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
            <div className="absolute -left-[21px] top-1 h-4 w-4 rounded-full border-2 border-white bg-success-500 shadow-sm" />
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Vos périodes choisies</p>
              <div className="text-right">
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${remainingDaysLeft === 0 ? 'bg-success-100 text-success-700' : 'bg-slate-100 text-slate-600'}`}>
                  {remainingDaysLeft > 0 ? `${remainingDaysLeft} jours restants` : 'Planning complet !'}
                </span>
              </div>
            </div>

            {remainingBlocks.length > 0 ? (
              <div className="space-y-3">
                {remainingBlocks.map((block, index) => (
                  <div
                    key={index}
                    className="group flex items-center justify-between p-4 rounded-xl bg-white border border-slate-200 hover:border-red-200 hover:bg-red-50/30 transition-all duration-200 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center justify-center w-10 h-10 rounded-lg bg-success-100 text-success-700 font-bold text-xs">
                        <span>{countCalendarDays(block.start, block.end)}j</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Période {index + 1}</p>
                        <p className="text-xs text-slate-500 font-medium">
                          Du {format(block.start, 'd MMM', { locale: fr })} au {format(block.end, 'd MMM yyyy', { locale: fr })}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveBlock(index)}
                      type="button"
                      className="p-2 rounded-lg text-slate-400 hover:bg-red-100 hover:text-red-600 transition-colors"
                      title="Supprimer cette période"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-xl border-2 border-dashed border-slate-200 text-center">
                <p className="text-sm text-slate-500 font-medium">Aucune période planifiée</p>
                <p className="text-xs text-slate-400 mt-1">Cliquez sur le calendrier pour ajouter vos jours</p>
              </div>
            )}
          </div>

          {supplementaryLeavePeriods && supplementaryLeavePeriods.length > 0 && (
            <div className="relative">
              <div className="absolute -left-[21px] top-1 h-4 w-4 rounded-full border-2 border-white bg-slate-900 shadow-sm" />
              <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Congé supplémentaire 2026
                </p>
                <div className="flex items-center gap-2">
                  {supplementaryLeaveMode === 'split' && (
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                      2 × 1 mois
                    </span>
                  )}
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-slate-900 text-white">
                    {supplementaryLeaveDuration ?? 1} mois
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                {supplementaryLeavePeriods.map((entry, index) => (
                  <div
                    key={`${entry.start.getTime()}-${index}`}
                    className="flex gap-4 items-start p-4 rounded-xl bg-slate-900 text-white shadow-sm"
                  >
                    <div className="w-1 h-full bg-brand-300 rounded-full" />
                    <div>
                      <p className="font-bold text-sm">
                        {supplementaryLeavePeriods.length > 1
                          ? `Période ${index + 1} (1 mois)`
                          : 'Période complémentaire ajoutée'}
                      </p>
                      <p className="text-xs text-slate-300 mt-1">
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
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-400">Total planifié</p>
              <p className="text-xl font-bold text-slate-900">
                {totalRemainingDays} <span className="text-sm font-medium text-slate-500">/ {totalFractionableDays} jours</span>
                {remainingDaysLeft === 0 && (
                  <span className="ml-3 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
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
}
