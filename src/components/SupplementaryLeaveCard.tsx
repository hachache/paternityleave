import { format, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarDays, CheckCircle2, Clock3, Info, Wallet, Users, Split } from 'lucide-react';
import { LeaveBlock, LeaveScenarioConfig } from '../utils/paternityLeave';
import {
  formatSupplementaryActivationCountdown,
  SupplementaryLeaveDuration,
  SupplementaryLeaveEligibility,
  SupplementaryLeaveMode
} from '../utils/supplementaryBirthLeave';
import { getScenarioVocabulary } from '../utils/scenarioVocabulary';
import { getSupplementaryLeaveStatusLabel } from '../utils/supplementaryLeaveCopy';

interface SupplementaryLeaveCardProps {
  enabled: boolean;
  duration: SupplementaryLeaveDuration;
  mode: SupplementaryLeaveMode;
  secondStartDate: Date | null;
  eligibility: SupplementaryLeaveEligibility;
  startDate: Date | null;
  periods: LeaveBlock[];
  error: string | null;
  scenario: LeaveScenarioConfig;
  onEnabledChange: (enabled: boolean) => void;
  onDurationChange: (duration: SupplementaryLeaveDuration) => void;
  onModeChange: (mode: SupplementaryLeaveMode) => void;
  onSecondStartDateChange: (date: Date | null) => void;
}

function formatDate(date: Date): string {
  return format(date, 'd MMMM yyyy', { locale: fr });
}

function toInputValue(date: Date | null): string {
  if (!date) return '';
  return format(date, 'yyyy-MM-dd');
}

export function SupplementaryLeaveCard({
  enabled,
  duration,
  mode,
  secondStartDate,
  eligibility,
  startDate,
  periods,
  error,
  scenario,
  onEnabledChange,
  onDurationChange,
  onModeChange,
  onSecondStartDateChange
}: SupplementaryLeaveCardProps) {
  const canActivate = eligibility.canActivate;
  const disabledReason = !canActivate ? eligibility.reason : null;
  const activationCountdown = formatSupplementaryActivationCountdown(
    eligibility.daysUntilActivation
  );
  const isSplitAvailable = duration === 2;
  const isSplitActive = mode === 'split' && isSplitAvailable;
  const hasPeriods = periods.length > 0;
  const periodsValidated = enabled && hasPeriods && !error;
  const minDateValue = toInputValue(startDate);
  const maxDateValue = toInputValue(eligibility.limitDate);
  const vocabulary = getScenarioVocabulary(scenario);

  const handleToggle = () => {
    if (!canActivate) return;
    onEnabledChange(!enabled);
  };

  const statusLabel = getSupplementaryLeaveStatusLabel(periodsValidated, canActivate);

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
              Module secondaire pour projeter le nouveau congé supplémentaire applicable à partir du 1er juillet 2026,
              sous réserve des décrets d&apos;application.
            </p>
            {activationCountdown && (
              <p className="mt-2 inline-flex items-center rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-800">
                {activationCountdown}
              </p>
            )}
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
            {eligibility.limitDate ? `Jusqu'au ${formatDate(eligibility.limitDate)}` : `${vocabulary.eventDateLabel} requise`}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            Début projeté
          </div>
          <p className="text-sm font-bold text-slate-900">
            {startDate ? formatDate(startDate) : 'Après le planning initial'}
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

      {isSplitAvailable && (
        <div className="mt-5">
          <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
            <Split className="h-4 w-4" aria-hidden="true" />
            Mode de prise
          </p>
          <div className="grid grid-cols-2 gap-3">
            {(['consecutive', 'split'] as SupplementaryLeaveMode[]).map((option) => {
              const selected = mode === option;
              const label = option === 'consecutive' ? '2 mois consécutifs' : '2 × 1 mois disjoints';
              const hint =
                option === 'consecutive'
                  ? 'Pris d\'affilée après le congé initial.'
                  : '2 périodes d\'1 mois prises séparément.';

              return (
                <button
                  key={option}
                  type="button"
                  disabled={!canActivate}
                  onClick={() => onModeChange(option)}
                  className={`rounded-2xl border px-4 py-3 text-left transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-50 ${
                    selected
                      ? 'border-slate-900 bg-slate-900 text-white shadow-md shadow-slate-900/20'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="block text-sm font-bold">{label}</span>
                  <span className={`mt-1 block text-xs font-medium ${selected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {hint}
                  </span>
                </button>
              );
            })}
          </div>

          {isSplitActive && (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Début de la 2<sup>e</sup> période d&apos;1 mois
              </label>
              <input
                type="date"
                value={toInputValue(secondStartDate)}
                min={minDateValue || undefined}
                max={maxDateValue || undefined}
                disabled={!canActivate}
                onChange={(event) => {
                  const value = event.target.value;
                  if (!value) {
                    onSecondStartDateChange(null);
                    return;
                  }
                  onSecondStartDateChange(startOfDay(new Date(value)));
                }}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                Doit débuter après la fin du congé initial et se terminer avant la date limite légale.
                La seconde période ne peut pas chevaucher la première.
              </p>
            </div>
          )}
        </div>
      )}

      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
          <Wallet className="h-4 w-4" aria-hidden="true" />
          Indemnisation (salariés)
        </div>
        <ul className="space-y-2 text-sm font-medium text-slate-700">
          <li className="flex items-baseline justify-between gap-3">
            <span>Premier mois</span>
            <span className="rounded-full bg-white px-2.5 py-0.5 font-bold text-slate-900 shadow-sm">
              70% du salaire net
            </span>
          </li>
          <li className="flex items-baseline justify-between gap-3">
            <span>Second mois</span>
            <span className="rounded-full bg-white px-2.5 py-0.5 font-bold text-slate-900 shadow-sm">
              60% du salaire net
            </span>
          </li>
        </ul>
        <p className="mt-3 text-xs leading-relaxed text-slate-500">
          Dans la limite du plafond de la Sécurité sociale. Montants exacts sous réserve des décrets
          d&apos;application.
        </p>
      </div>

      <div className="mt-3 rounded-2xl border border-slate-100 bg-white p-4">
        <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
          <Users className="h-4 w-4" aria-hidden="true" />
          Bénéficiaires
        </div>
        <p className="text-sm leading-relaxed text-slate-600">
          Ouvert aux deux parents : salariés, indépendants, non-salariés agricoles, fonctionnaires et
          militaires. Pris simultanément ou en alternance, après les congés de maternité, de paternité
          et d&apos;accueil de l&apos;enfant ou d&apos;adoption.
        </p>
      </div>

      {(disabledReason || error || periodsValidated) && (
        <div
          className={`mt-5 rounded-2xl border p-4 ${
            periodsValidated
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
              : 'border-amber-200 bg-amber-50 text-amber-900'
          }`}
        >
          <div className="flex gap-3">
            {periodsValidated ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            ) : (
              <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            )}
            <div className="flex-1 text-sm font-medium leading-relaxed">
              {periodsValidated ? (
                <ul className="space-y-1">
                  {periods.map((entry, index) => (
                    <li key={`${entry.start.getTime()}-${index}`}>
                      Période {index + 1} projetée : du {formatDate(entry.start)} au {formatDate(entry.end)}.
                    </li>
                  ))}
                  <li className="text-xs text-emerald-800">
                    Ajouté au récapitulatif, sous réserve des décrets d&apos;application.
                  </li>
                </ul>
              ) : (
                <p>{error || disabledReason}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
