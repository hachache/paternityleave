import { format, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AnimatePresence, motion } from 'framer-motion';
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
import { collapseFade, useAppMotion } from '../lib/motion';

interface SupplementaryLeaveCardProps {
  enabled: boolean;
  duration: SupplementaryLeaveDuration;
  mode: SupplementaryLeaveMode;
  firstStartDate: Date | null;
  secondStartDate: Date | null;
  eligibility: SupplementaryLeaveEligibility;
  earliestStartDate: Date | null;
  periods: LeaveBlock[];
  error: string | null;
  scenario: LeaveScenarioConfig;
  onEnabledChange: (enabled: boolean) => void;
  onDurationChange: (duration: SupplementaryLeaveDuration) => void;
  onModeChange: (mode: SupplementaryLeaveMode) => void;
  onFirstStartDateChange: (date: Date | null) => void;
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
  firstStartDate,
  secondStartDate,
  eligibility,
  earliestStartDate,
  periods,
  error,
  scenario,
  onEnabledChange,
  onDurationChange,
  onModeChange,
  onFirstStartDateChange,
  onSecondStartDateChange
}: SupplementaryLeaveCardProps) {
  const canPlan = eligibility.canPlan;
  const disabledReason = !canPlan ? eligibility.reason : null;
  const planningNotice =
    canPlan && !eligibility.isAvailableNow
      ? 'Vous pouvez préparer la demande employeur dès maintenant. Le congé projeté débutera au plus tôt le 1er juillet 2026.'
      : null;
  const activationCountdown = formatSupplementaryActivationCountdown(
    eligibility.daysUntilActivation
  );
  const isSplitAvailable = duration === 2;
  const isSplitActive = mode === 'split' && isSplitAvailable;
  const hasPeriods = periods.length > 0;
  const periodsValidated = enabled && hasPeriods && !error;
  const minDateValue = toInputValue(earliestStartDate);
  const maxDateValue = toInputValue(eligibility.limitDate);
  const effectiveStartDate = firstStartDate ?? earliestStartDate;
  const vocabulary = getScenarioVocabulary(scenario);
  const { shouldReduce, transition } = useAppMotion();

  const handleToggle = () => {
    if (!canPlan) return;
    onEnabledChange(!enabled);
  };

  const statusLabel = getSupplementaryLeaveStatusLabel(
    periodsValidated,
    canPlan,
    eligibility.isAvailableNow
  );

  return (
    <section className="rounded-2xl sm:rounded-card border border-slate-200 bg-white p-4 sm:p-6 shadow-depth-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-md shadow-slate-900/20">
            <CalendarDays className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
          </div>
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h2 id="supplementary-leave-title" className="text-lg sm:text-xl font-bold font-display text-slate-900">
                Congé supplémentaire 2026
              </h2>
              <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-slate-600 shadow-sm">
                {statusLabel}
              </span>
            </div>
            <p className="max-w-xl text-sm font-medium leading-relaxed text-slate-600">
              Module secondaire pour projeter le nouveau congé supplémentaire applicable à partir du 1er juillet 2026,
              sous réserve des décrets d'application.
            </p>
            {activationCountdown && (
              <p className="mt-2 inline-flex items-center rounded-full border border-brand-100 bg-gradient-to-r from-brand-50 to-brand-50/60 px-3 py-1 text-xs font-semibold text-brand-800 shadow-sm">
                {activationCountdown}
              </p>
            )}
          </div>
        </div>

        {/* Toggle switch */}
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          aria-labelledby="supplementary-leave-title"
          disabled={!canPlan}
          onClick={handleToggle}
          className={`inline-flex h-11 w-[4.25rem] shrink-0 items-center rounded-full border-2 p-1 transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-50 ${
            enabled
              ? 'border-brand-600 bg-brand-600 shadow-sm shadow-brand-500/20'
              : 'border-slate-200 bg-slate-100'
          }`}
        >
          <span
            className={`h-7 w-7 rounded-full bg-white shadow-md transition-transform duration-300 ${
              enabled ? 'translate-x-7' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Eligibility notice */}
      {!canPlan && eligibility.reason && (
        <div className="mt-5 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-amber-50/60 p-4 flex gap-3 shadow-sm">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
          <div>
            <p className="text-sm font-bold text-amber-900 mb-1">
              {eligibility.isEligibleBirthDate === false
                ? 'Date de naissance non éligible'
                : !eligibility.isRequestWindowOpen
                  ? 'Demande pas encore ouverte'
                  : 'Non disponible'}
            </p>
            <p className="text-sm font-medium text-amber-800 leading-relaxed">
              {eligibility.reason}
            </p>
            {!eligibility.isEligibleBirthDate && (
              <p className="mt-2 text-xs text-amber-700">
                Le congé supplémentaire est réservé aux enfants nés ou adoptés à partir du{' '}
                <strong>1er janvier 2026</strong>, conformément à la LFSS 2026 (article 99-V).
              </p>
            )}
            {!eligibility.isRequestWindowOpen && eligibility.daysUntilRequestWindow !== null && (
              <p className="mt-2 text-xs text-amber-700">
                La demande pourra être préparée dans <strong>{eligibility.daysUntilRequestWindow} jours</strong>.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Info cards */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-3.5 sm:p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400">
            <Clock3 className="h-4 w-4" aria-hidden="true" />
            Délai légal
          </div>
          <p className="text-sm font-bold text-slate-900">
            {eligibility.limitDate ? `Jusqu'au ${formatDate(eligibility.limitDate)}` : `${vocabulary.eventDateLabel} requise`}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-3.5 sm:p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            Début projeté
          </div>
          <p className="text-sm font-bold text-slate-900">
            {effectiveStartDate ? formatDate(effectiveStartDate) : 'Après le planning initial'}
          </p>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {enabled && (
          <motion.div
            key="supplementary-configuration"
            className="overflow-clip"
            initial={shouldReduce ? false : 'hidden'}
            animate="visible"
            exit="hidden"
            variants={collapseFade}
            transition={transition}
          >
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
                      disabled={!canPlan}
                      onClick={() => onDurationChange(typedValue)}
                      className={`rounded-2xl border px-3 sm:px-4 py-3 text-left transition-all duration-300 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-50 ${
                        selected
                          ? 'border-slate-900 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-lg shadow-slate-900/20'
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

            {/* First period start date picker */}
            {earliestStartDate && (
              <div className="mt-5">
                <label htmlFor="supplementary-first-start" className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Début de la première période
                </label>
                <input
                  id="supplementary-first-start"
                  type="date"
                  value={toInputValue(effectiveStartDate)}
                  min={toInputValue(earliestStartDate)}
                  max={toInputValue(eligibility.limitDate)}
                  disabled={!canPlan}
                  onChange={(event) => {
                    const value = event.target.value;
                    if (!value) {
                      onFirstStartDateChange(null);
                      return;
                    }
                    onFirstStartDateChange(startOfDay(new Date(value)));
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 shadow-sm hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                />
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  Au plus tôt le {formatDate(earliestStartDate)}. Laissez vide pour utiliser la date la plus proche.
                </p>
              </div>
            )}

            <AnimatePresence initial={false}>
              {isSplitAvailable && (
                <motion.div
                  key="supplementary-mode"
                  className="mt-5 overflow-clip"
                  initial={shouldReduce ? false : 'hidden'}
                  animate="visible"
                  exit="hidden"
                  variants={collapseFade}
                  transition={transition}
                >
                  <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                    <Split className="h-4 w-4" aria-hidden="true" />
                    Mode de prise
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {(['consecutive', 'split'] as SupplementaryLeaveMode[]).map((option) => {
                      const selected = mode === option;
                      const label = option === 'consecutive' ? '2 mois consécutifs' : '2 × 1 mois disjoints';
                      const hint =
                        option === 'consecutive'
                          ? "Pris d'affilée après le congé initial."
                          : "2 périodes d'1 mois prises séparément.";

                      return (
                        <button
                          key={option}
                          type="button"
                          disabled={!canPlan}
                          onClick={() => onModeChange(option)}
                          className={`rounded-2xl border px-3 sm:px-4 py-3 text-left transition-all duration-300 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-50 ${
                            selected
                              ? 'border-slate-900 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-lg shadow-slate-900/20'
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

                  <AnimatePresence initial={false}>
                    {isSplitActive && (
                      <motion.div
                        key="supplementary-second-date"
                        className="mt-4 overflow-clip rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 shadow-sm"
                        initial={shouldReduce ? false : 'hidden'}
                        animate="visible"
                        exit="hidden"
                        variants={collapseFade}
                        transition={transition}
                      >
                        <label htmlFor="supplementary-second-start" className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                          Début de la 2<sup>e</sup> période d'1 mois
                        </label>
                        <input
                          id="supplementary-second-start"
                          type="date"
                          value={toInputValue(secondStartDate)}
                          min={minDateValue || undefined}
                          max={maxDateValue || undefined}
                          disabled={!canPlan}
                          onChange={(event) => {
                            const value = event.target.value;
                            if (!value) {
                              onSecondStartDateChange(null);
                              return;
                            }
                            onSecondStartDateChange(startOfDay(new Date(value)));
                          }}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 shadow-sm hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                        />
                        <p className="mt-2 text-xs leading-relaxed text-slate-500">
                          Doit débuter après la fin du congé initial et se terminer avant la date limite légale.
                          La seconde période ne peut pas chevaucher la première.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Indemnisation */}
      <div className="mt-5 rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-4 shadow-sm">
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
          d'application.
        </p>
      </div>

      {/* Bénéficiaires */}
      <div className="mt-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
          <Users className="h-4 w-4" aria-hidden="true" />
          Bénéficiaires
        </div>
        <p className="text-sm leading-relaxed text-slate-600">
          Ouvert aux deux parents : salariés, indépendants, non-salariés agricoles, fonctionnaires et
          militaires. Pris simultanément ou en alternance, après les congés de maternité, de paternité
          et d'accueil de l'enfant ou d'adoption.
        </p>
      </div>

      {/* Status/Error */}
      {(disabledReason || planningNotice || error || periodsValidated) && (
        <div
          className={`mt-5 rounded-2xl border p-4 shadow-sm ${
            periodsValidated
              ? 'border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-50/60 text-emerald-900'
              : 'border-amber-200 bg-gradient-to-r from-amber-50 to-amber-50/60 text-amber-900'
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
                    Ajouté au récapitulatif, sous réserve des décrets d'application.
                  </li>
                </ul>
              ) : (
                <p>{error || disabledReason || planningNotice}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
