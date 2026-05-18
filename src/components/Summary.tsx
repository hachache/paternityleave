import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, CheckCircle2, Clock, Trash2 } from 'lucide-react';
import { LeaveBlock, LeaveScenarioConfig, countCalendarDays } from '../utils/paternityLeave';

interface SummaryProps {
  birthDate: Date | null;
  employerPeriod: LeaveBlock | null;
  mandatoryPeriod: LeaveBlock | null;
  remainingBlocks: LeaveBlock[];
  supplementaryPeriod: LeaveBlock | null;
  supplementaryLeaveEnabled: boolean;
  onRemoveBlock: (index: number) => void;
  totalFractionableDays: number;
  scenario: LeaveScenarioConfig;
}

export function Summary({
  birthDate,
  employerPeriod,
  mandatoryPeriod,
  remainingBlocks,
  supplementaryPeriod,
  supplementaryLeaveEnabled,
  onRemoveBlock,
  totalFractionableDays,
  scenario
}: SummaryProps) {
  if (!birthDate) return null;

  const totalRemainingDays = remainingBlocks.reduce(
    (sum, block) => sum + countCalendarDays(block.start, block.end),
    0
  );
  const remainingDaysLeft = totalFractionableDays - totalRemainingDays;

  return (
    <div className="rounded-[2rem] border border-white/10 bg-surface-100 p-6 sm:p-8 shadow-xl shadow-slate-950/40">
      <header className="mb-8 flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-brand-50/55 text-brand-700">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold text-[var(--text)]">Récapitulatif</h2>
          <p className="text-[var(--muted)] font-medium">Votre planning complet</p>
        </div>
      </header>

      <div className="space-y-6">
        {/* Situation Card */}
        <div className="rounded-2xl bg-surface-50 border border-white/10 p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Votre situation</p>
            <span className="px-2 py-1 rounded-md bg-surface-100 text-xs font-bold text-brand-700 border border-white/15 shadow-sm">
              {scenario.limitMonthsAfterBirth} mois
            </span>
          </div>
          <p className="text-lg font-bold text-[var(--text)]">{scenario.label}</p>
          <p className="text-sm text-[var(--muted)] mt-1 font-medium">
            Droit total : <span className="text-[var(--text)]">{totalFractionableDays + 7} jours</span> (3j naissance + 4j obligatoires + {totalFractionableDays}j fractionnables)
          </p>
        </div>

        <div className="relative pl-4 border-l-2 border-white/10 space-y-8">
          {/* Date de naissance */}
          <div className="relative">
            <div className="absolute -left-[21px] top-1 h-4 w-4 rounded-full border-2 border-surface-100 bg-white shadow-sm" />
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-2)] mb-1">Point de départ</p>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-[var(--muted)]" />
              <div>
                <p className="text-sm font-medium text-[var(--muted)]">Date de naissance</p>
                <p className="text-base font-bold text-[var(--text)] capitalize">
                  {format(birthDate, 'EEEE d MMMM yyyy', { locale: fr })}
                </p>
              </div>
            </div>
          </div>

          {/* Périodes fixes */}
          {(employerPeriod || mandatoryPeriod) && (
            <div className="relative">
              <div className="absolute -left-[21px] top-6 h-4 w-4 rounded-full border-2 border-surface-100 bg-brand-600 shadow-sm" />
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-2)] mb-3">Périodes automatiques</p>
              <div className="space-y-3">
                {employerPeriod && (
                  <div className="flex gap-4 items-start p-4 rounded-xl bg-brand-50/35 border border-brand-400/25">
                    <div className="w-1 h-full bg-brand-300 rounded-full" />
                    <div>
                      <p className="font-bold text-brand-800 text-sm">Congé de naissance (3j)</p>
                      <p className="text-xs text-brand-700 mt-1">
                        Du {format(employerPeriod.start, 'd MMM', { locale: fr })} au {format(employerPeriod.end, 'd MMM yyyy', { locale: fr })}
                      </p>
                    </div>
                  </div>
                )}
                {mandatoryPeriod && (
                  <div className="flex gap-4 items-start p-4 rounded-xl bg-brand-50/35 border border-brand-400/25">
                    <div className="w-1 h-full bg-brand-600 rounded-full" />
                    <div>
                      <p className="font-bold text-brand-800 text-sm">Période obligatoire (4j)</p>
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
            <div className="absolute -left-[21px] top-1 h-4 w-4 rounded-full border-2 border-surface-100 bg-success-500 shadow-sm" />
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-2)]">Vos périodes choisies</p>
              <div className="text-right">
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${remainingDaysLeft === 0 ? 'bg-success-100 text-success-500' : 'bg-surface-50 text-[var(--muted)]'}`}>
                  {remainingDaysLeft > 0 ? `${remainingDaysLeft} jours restants` : 'Planning complet !'}
                </span>
              </div>
            </div>

            {remainingBlocks.length > 0 ? (
              <div className="space-y-3">
                {remainingBlocks.map((block, index) => (
                  <div
                    key={index}
                    className="group flex items-center justify-between p-4 rounded-xl bg-surface-50 border border-white/10 hover:border-red-500/30 hover:bg-red-950/25 transition-all duration-200 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center justify-center w-10 h-10 rounded-lg bg-success-100 text-success-500 font-bold text-xs">
                        <span>{countCalendarDays(block.start, block.end)}j</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[var(--text)]">Période {index + 1}</p>
                        <p className="text-xs text-[var(--muted)] font-medium">
                          Du {format(block.start, 'd MMM', { locale: fr })} au {format(block.end, 'd MMM yyyy', { locale: fr })}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveBlock(index)}
                      className="p-2 rounded-lg text-[var(--muted-2)] hover:bg-red-500/15 hover:text-red-300 transition-colors"
                      title="Supprimer cette période"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-xl border-2 border-dashed border-white/20 text-center">
                <p className="text-sm text-[var(--muted)] font-medium">Aucune période planifiée</p>
                <p className="text-xs text-[var(--muted-2)] mt-1">Cliquez sur le calendrier pour ajouter vos jours</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Totals */}
        <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-surface-50 rounded-lg text-[var(--muted)]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-[var(--muted-2)]">Total planifié</p>
              <p className="text-xl font-bold text-[var(--text)]">
                {totalRemainingDays} <span className="text-sm font-medium text-[var(--muted)]">/ {totalFractionableDays} jours</span>
                {remainingDaysLeft === 0 && (
                  <span className="ml-3 text-emerald-500 font-hand text-2xl font-bold -rotate-2 inline-block">Tout est bon ! 👌</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {supplementaryLeaveEnabled && (
          <div className="rounded-2xl border border-[#0071e3]/30 bg-[#0071e3]/10 p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-[#6e6e73] mb-2">
              Congé supplémentaire de naissance (2026)
            </p>
            {supplementaryPeriod ? (
              <p className="text-sm text-[var(--text)] font-medium">
                Du {format(supplementaryPeriod.start, 'd MMM yyyy', { locale: fr })} au{' '}
                {format(supplementaryPeriod.end, 'd MMM yyyy', { locale: fr })} ({supplementaryPeriod.days} jours calendaires)
              </p>
            ) : (
              <p className="text-sm text-[var(--muted)]">
                Option activée, période en attente de validation (complétez le plan paternité et vérifiez la limite légale).
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
