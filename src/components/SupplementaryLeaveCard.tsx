import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarClock, Clock3, ShieldCheck } from 'lucide-react';
import { LeaveBlock } from '../utils/paternityLeave';
import {
  SupplementaryLeaveDuration,
  SupplementaryLeaveEligibility
} from '../utils/supplementaryBirthLeave';

interface SupplementaryLeaveCardProps {
  birthDate: Date | null;
  isPaternityPlanComplete: boolean;
  supplementaryLeaveEnabled: boolean;
  supplementaryLeaveDuration: SupplementaryLeaveDuration;
  supplementaryLeaveEligibility: SupplementaryLeaveEligibility;
  supplementaryLeaveStartDate: Date | null;
  supplementaryLeavePeriod: LeaveBlock | null;
  supplementaryLeaveError: string | null;
  onToggle: (enabled: boolean) => void;
  onDurationChange: (duration: SupplementaryLeaveDuration) => void;
}

function formatDate(value: Date) {
  return format(value, 'd MMMM yyyy', { locale: fr });
}

export function SupplementaryLeaveCard({
  birthDate,
  isPaternityPlanComplete,
  supplementaryLeaveEnabled,
  supplementaryLeaveDuration,
  supplementaryLeaveEligibility,
  supplementaryLeaveStartDate,
  supplementaryLeavePeriod,
  supplementaryLeaveError,
  onToggle,
  onDurationChange
}: SupplementaryLeaveCardProps) {
  const canConfigure =
    supplementaryLeaveEligibility.canActivate &&
    isPaternityPlanComplete &&
    Boolean(supplementaryLeaveStartDate);

  return (
    <div className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#6e6e73]">
            Mise à jour 2026
          </p>
          <h3 className="text-xl sm:text-2xl font-semibold text-[#1d1d1f] mt-2">
            Congé supplémentaire de naissance
          </h3>
          <p className="text-sm text-[#424245] mt-2 max-w-2xl">
            Option de 1 ou 2 mois, à ajouter après le congé maternité/paternité/adoption.
          </p>
        </div>
        <div className="rounded-full border border-black/10 bg-[#f5f5f7] px-3 py-1 text-xs font-semibold text-[#1d1d1f]">
          1 ou 2 mois
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-black/10 bg-[#f5f5f7] p-4">
          <p className="text-[11px] uppercase tracking-wider text-[#6e6e73]">Activation</p>
          <p className="mt-1 text-sm font-semibold text-[#1d1d1f]">
            {formatDate(supplementaryLeaveEligibility.activationDate)}
          </p>
        </div>
        <div className="rounded-2xl border border-black/10 bg-[#f5f5f7] p-4">
          <p className="text-[11px] uppercase tracking-wider text-[#6e6e73]">Éligibilité</p>
          <p className="mt-1 text-sm font-semibold text-[#1d1d1f]">
            Naissance dès {formatDate(supplementaryLeaveEligibility.minBirthDate)}
          </p>
        </div>
        <div className="rounded-2xl border border-black/10 bg-[#f5f5f7] p-4">
          <p className="text-[11px] uppercase tracking-wider text-[#6e6e73]">Date limite</p>
          <p className="mt-1 text-sm font-semibold text-[#1d1d1f]">
            {supplementaryLeaveEligibility.limitDate
              ? formatDate(supplementaryLeaveEligibility.limitDate)
              : 'À calculer'}
          </p>
        </div>
      </div>

      {!birthDate && (
        <div className="mt-6 rounded-2xl border border-black/10 bg-[#f5f5f7] p-4 text-sm text-[#424245]">
          Définissez d’abord la date de naissance pour activer cette simulation.
        </div>
      )}

      {birthDate && supplementaryLeaveEligibility.reason && (
        <div className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          {supplementaryLeaveEligibility.reason}
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-black/10 bg-white p-4 sm:p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-black text-white flex items-center justify-center">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1d1d1f]">Intégrer dans le planning</p>
              <p className="text-xs text-[#6e6e73]">
                Active la projection de la période supplémentaire
              </p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={supplementaryLeaveEnabled}
            onClick={() => onToggle(!supplementaryLeaveEnabled)}
            disabled={!canConfigure}
            className={`relative inline-flex h-7 w-12 items-center rounded-full border transition-all duration-300 ${
              supplementaryLeaveEnabled
                ? 'bg-black border-black'
                : 'bg-white border-black/20'
            } ${!canConfigure ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${
                supplementaryLeaveEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onDurationChange(1)}
            disabled={!canConfigure}
            className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-300 ${
              supplementaryLeaveDuration === 1
                ? 'border-black bg-black text-white'
                : 'border-black/10 bg-[#f5f5f7] text-[#1d1d1f]'
            } ${!canConfigure ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            1 mois
          </button>
          <button
            type="button"
            onClick={() => onDurationChange(2)}
            disabled={!canConfigure}
            className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-300 ${
              supplementaryLeaveDuration === 2
                ? 'border-black bg-black text-white'
                : 'border-black/10 bg-[#f5f5f7] text-[#1d1d1f]'
            } ${!canConfigure ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            2 mois
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-black/10 bg-[#f5f5f7] p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <CalendarClock className="h-5 w-5 text-[#0071e3] mt-0.5" />
          <div className="space-y-2">
            <p className="text-sm font-semibold text-[#1d1d1f]">Projection calendrier</p>
            {supplementaryLeaveStartDate ? (
              <p className="text-sm text-[#424245]">
                Début estimé: <span className="font-semibold text-[#1d1d1f]">{formatDate(supplementaryLeaveStartDate)}</span>
              </p>
            ) : (
              <p className="text-sm text-[#424245]">
                Le début sera calculé dès que les périodes obligatoires sont définies.
              </p>
            )}
            {supplementaryLeavePeriod && (
              <p className="text-sm text-[#1d1d1f] font-medium">
                Du {format(supplementaryLeavePeriod.start, 'd MMM yyyy', { locale: fr })} au{' '}
                {format(supplementaryLeavePeriod.end, 'd MMM yyyy', { locale: fr })}{' '}
                ({supplementaryLeavePeriod.days} jours calendaires)
              </p>
            )}
            {supplementaryLeaveError && (
              <p className="text-sm text-amber-900 bg-amber-50 border border-amber-300 rounded-xl px-3 py-2">
                {supplementaryLeaveError}
              </p>
            )}
            {!supplementaryLeaveError && supplementaryLeaveEnabled && supplementaryLeavePeriod && (
              <p className="text-sm text-emerald-700 flex items-center gap-2">
                <Clock3 className="h-4 w-4" />
                Période conforme au délai légal calculé.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
