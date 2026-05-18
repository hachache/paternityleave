import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarDays, CheckCircle2, Clock3, Info } from 'lucide-react';
import { LeaveBlock } from '../utils/paternityLeave';
import {
  SupplementaryLeaveDuration,
  SupplementaryLeaveEligibility
} from '../utils/supplementaryBirthLeave';

interface SupplementaryLeaveCardProps {
  enabled: boolean;
  duration: SupplementaryLeaveDuration;
  eligibility: SupplementaryLeaveEligibility;
  startDate: Date | null;
  period: LeaveBlock | null;
  error: string | null;
  onEnabledChange: (enabled: boolean) => void;
  onDurationChange: (duration: SupplementaryLeaveDuration) => void;
}

function formatDate(date: Date): string {
  return format(date, 'd MMMM yyyy', { locale: fr });
}

export function SupplementaryLeaveCard({
  enabled,
  duration,
  eligibility,
  startDate,
  period,
  error,
  onEnabledChange,
  onDurationChange
}: SupplementaryLeaveCardProps) {
  const canActivate = eligibility.canActivate;
  const disabledReason = !canActivate ? eligibility.reason : null;

  const handleToggle = () => {
    if (!canActivate) return;
    onEnabledChange(!enabled);
  };

  const statusLabel = period
    ? 'Activé'
    : canActivate
      ? 'Optionnel'
      : 'À venir';

  return (
    <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 sm:p-6 shadow-lg shadow-slate-200/30">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
            <CalendarDays className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold font-display text-slate-900">
                Congé supplémentaire 2026
              </h2>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-slate-600">
                {statusLabel}
              </span>
            </div>
            <p className="max-w-xl text-sm font-medium leading-relaxed text-slate-600">
              Module secondaire pour projeter le nouveau congé de naissance applicable à partir du 1 juillet 2026.
            </p>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          disabled={!canActivate}
          onClick={handleToggle}
          className={`inline-flex h-8 w-14 shrink-0 items-center rounded-full border p-1 transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-50 ${
            enabled
              ? 'border-brand-600 bg-brand-600'
              : 'border-slate-200 bg-slate-100'
          }`}
        >
          <span
            className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${
              enabled ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400">
            <Clock3 className="h-4 w-4" aria-hidden="true" />
            Délai légal
          </div>
          <p className="text-sm font-bold text-slate-900">
            {eligibility.limitDate ? `Jusqu'au ${formatDate(eligibility.limitDate)}` : 'Date de naissance requise'}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            Début projeté
          </div>
          <p className="text-sm font-bold text-slate-900">
            {startDate ? formatDate(startDate) : 'Après le planning paternité'}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
          Durée à projeter
        </p>
        <div className="grid grid-cols-2 gap-3">
          {[1, 2].map((value) => {
            const typedValue = value as SupplementaryLeaveDuration;
            const selected = duration === typedValue;

            return (
              <button
                key={value}
                type="button"
                disabled={!canActivate}
                onClick={() => onDurationChange(typedValue)}
                className={`rounded-2xl border px-4 py-3 text-left transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-50 ${
                  selected
                    ? 'border-slate-900 bg-slate-900 text-white shadow-md shadow-slate-900/20'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className="block text-base font-bold">{value} mois</span>
                <span className={`mt-1 block text-xs font-medium ${selected ? 'text-slate-300' : 'text-slate-500'}`}>
                  {value === 1 ? 'Projection courte' : 'Projection complète'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {(disabledReason || error || period) && (
        <div
          className={`mt-5 rounded-2xl border p-4 ${
            period
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
              : 'border-amber-200 bg-amber-50 text-amber-900'
          }`}
        >
          <div className="flex gap-3">
            {period ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            ) : (
              <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            )}
            <p className="text-sm font-medium leading-relaxed">
              {period
                ? `Période ajoutée au résumé : du ${formatDate(period.start)} au ${formatDate(period.end)}.`
                : error || disabledReason}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
