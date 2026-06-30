import { addDays, addMonths, format, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, CheckCircle2, Clock3, Info, Wallet, Users, Split } from 'lucide-react';
import { useId } from 'react';
import { LeaveBlock, LeaveScenarioConfig } from '../utils/paternityLeave';
import {
  formatSupplementaryActivationCountdown,
  SupplementaryLeaveEarliestStartInfo,
  SupplementaryLeaveDuration,
  SupplementaryLeaveEligibility,
  SupplementaryLeaveMode
} from '../utils/supplementaryBirthLeave';
import { getScenarioVocabulary } from '../utils/scenarioVocabulary';
import { getSupplementaryLeaveStatusLabel } from '../utils/supplementaryLeaveCopy';
import { useAppMotion } from '../lib/motion';

interface SupplementaryLeaveCardProps {
  enabled: boolean;
  duration: SupplementaryLeaveDuration;
  mode: SupplementaryLeaveMode;
  firstStartDate: Date | null;
  secondStartDate: Date | null;
  prematureExpectedAfterMinDate: boolean;
  eligibility: SupplementaryLeaveEligibility;
  startInfo: SupplementaryLeaveEarliestStartInfo | null;
  startDate: Date | null;
  periods: LeaveBlock[];
  error: string | null;
  scenario: LeaveScenarioConfig;
  onEnabledChange: (enabled: boolean) => void;
  onPrematureExpectedAfterMinDateChange: (enabled: boolean) => void;
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

function parseInputDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const [, year, month, day] = match;
  return startOfDay(new Date(Number(year), Number(month) - 1, Number(day)));
}

function getLatestStartDate(limitDate: Date | null, durationMonths: SupplementaryLeaveDuration): Date | null {
  if (!limitDate) return null;
  return startOfDay(addMonths(addDays(limitDate, 1), -durationMonths));
}

export function SupplementaryLeaveCard({
  enabled,
  duration,
  mode,
  firstStartDate,
  secondStartDate,
  prematureExpectedAfterMinDate,
  eligibility,
  startInfo,
  startDate,
  periods,
  error,
  scenario,
  onEnabledChange,
  onPrematureExpectedAfterMinDateChange,
  onDurationChange,
  onModeChange,
  onFirstStartDateChange,
  onSecondStartDateChange
}: SupplementaryLeaveCardProps) {
  const firstStartDateId = useId();
  const secondStartDateId = useId();
  const canPlan = eligibility.canPlan;
  const disabledReason = !canPlan ? eligibility.reason : null;
  const planningNotice =
    canPlan && !eligibility.isAvailableNow
      ? 'Vous pouvez préparer la demande employeur dès maintenant. La date projetée tient compte du 1er juillet 2026 et du préavis légal.'
      : null;
  const activationCountdown = formatSupplementaryActivationCountdown(
    eligibility.daysUntilActivation
  );
  const isSplitAvailable = duration === 2;
  const isSplitActive = mode === 'split' && isSplitAvailable;
  const hasPeriods = periods.length > 0;
  const periodsValidated = enabled && hasPeriods && !error;
  const earliestFirstStartDate = startInfo?.startDate ?? null;
  const firstStartDateValue = firstStartDate ?? startDate;
  const minFirstStartDateValue = toInputValue(earliestFirstStartDate);
  const firstPeriodDuration = mode === 'split' ? 1 : duration;
  const latestFirstStartDate = getLatestStartDate(eligibility.limitDate, firstPeriodDuration);
  const latestSecondStartDate = getLatestStartDate(eligibility.limitDate, 1);
  const minSecondStartDateValue = toInputValue(startDate ? addMonths(startDate, 1) : null);
  const maxFirstStartDateValue = toInputValue(latestFirstStartDate);
  const maxSecondStartDateValue = toInputValue(latestSecondStartDate);
  const vocabulary = getScenarioVocabulary(scenario);
  const { shouldReduce, transition } = useAppMotion();
  const showPrematureControl = eligibility.isPrematureBirthBefore2026;
  const showHospitalizationCaution = scenario.id === 'hospitalized-newborn';

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
    <section className="rounded-[18px] border border-slate-200 bg-white p-4 shadow-card sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-3 sm:gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1d1d1f] text-white sm:h-11 sm:w-11">
            <CalendarDays className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h2 className="text-lg sm:text-xl font-semibold font-display text-[#1d1d1f]">
                Congé supplémentaire 2026
              </h2>
              <span className="rounded-full border border-slate-200 bg-[#fafafc] px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                {statusLabel}
              </span>
            </div>
            <p className="max-w-xl text-sm font-normal leading-relaxed text-slate-600">
              Module secondaire pour projeter le nouveau congé supplémentaire applicable à partir du 1er juillet 2026,
              sous réserve des décrets d&apos;application.
            </p>
            {activationCountdown && (
              <p className="mt-2 inline-flex items-center rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-800">
                {activationCountdown}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          aria-label="Activer la projection du congé supplémentaire 2026"
          disabled={!canPlan}
          onClick={handleToggle}
          className={`mt-1 inline-flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-50 ${
            enabled ? 'bg-brand-600' : 'bg-slate-300'
          }`}
        >
          <span
            className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
              enabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-[#fafafc] p-3.5 sm:p-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <Clock3 className="h-4 w-4" aria-hidden="true" />
            Délai légal
          </div>
          <p className="text-sm font-semibold text-[#1d1d1f]">
            {eligibility.limitDate ? `Jusqu'au ${formatDate(eligibility.limitDate)}` : `${vocabulary.eventDateLabel} requise`}
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-[#fafafc] p-3.5 sm:p-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            Début projeté
          </div>
          <p className="text-sm font-semibold text-[#1d1d1f]">
            {startDate ? formatDate(startDate) : 'Après le planning initial'}
          </p>
        </div>

        {startInfo && (
          <div className="rounded-lg border border-slate-200 bg-[#fafafc] p-3.5 sm:col-span-2 sm:p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              <Clock3 className="h-4 w-4" aria-hidden="true" />
              Préavis employeur
            </div>
            <p className="text-sm font-semibold text-[#1d1d1f]">
              Demande présumée aujourd’hui, préavis jusqu’au {formatDate(startInfo.noticeDate)}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              {startInfo.noticeReason}
            </p>
          </div>
        )}
      </div>

      {showPrematureControl && (
        <label className="mt-5 flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          <input
            type="checkbox"
            checked={prematureExpectedAfterMinDate}
            onChange={(event) => onPrematureExpectedAfterMinDateChange(event.target.checked)}
            className="mt-1 h-4 w-4 rounded border-amber-300 text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          />
          <span className="leading-relaxed">
            <span className="block font-semibold">Naissance prématurée avant 2026</span>
            Cochez uniquement si la naissance était médicalement prévue à partir du 1er janvier 2026.
            Ce cas peut ouvrir droit au congé supplémentaire 2026, avec justificatif.
          </span>
        </label>
      )}

      <AnimatePresence initial={false}>
        {enabled && (
          <motion.div
            key="supplementary-configuration"
            className="overflow-hidden"
            initial={shouldReduce ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={transition}
          >
            <div className="mt-5">
              <div className="mb-5 rounded-lg border border-slate-200 bg-[#fafafc] p-4">
                <label htmlFor={firstStartDateId} className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Début de la 1<sup>re</sup> période
                </label>
                <input
                  id={firstStartDateId}
                  type="date"
                  value={toInputValue(firstStartDateValue)}
                  min={minFirstStartDateValue || undefined}
                  max={maxFirstStartDateValue || undefined}
                  disabled={!canPlan || !earliestFirstStartDate}
                  onChange={(event) => onFirstStartDateChange(parseInputDate(event.target.value))}
                  className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-normal text-[#1d1d1f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  À choisir entre la date minimale calculée avec le préavis et la date limite légale.
                </p>
              </div>

              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
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
                      className={`rounded-lg border px-3 sm:px-4 py-3 text-left transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-50 ${
                        selected
                          ? 'border-brand-600 bg-brand-600 text-white'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-[#fafafc]'
                      }`}
                    >
                      <span className="block text-base font-semibold">{value} mois</span>
                      <span className={`mt-1 block text-xs font-medium ${selected ? 'text-brand-100' : 'text-slate-500'}`}>
                        {value === 1 ? 'Projection courte' : 'Projection complète'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <AnimatePresence initial={false}>
              {isSplitAvailable && (
                <motion.div
                  key="supplementary-mode"
                  className="mt-5 overflow-hidden"
                  initial={shouldReduce ? false : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={transition}
                >
                  <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <Split className="h-4 w-4" aria-hidden="true" />
                    Mode de prise
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
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
                          disabled={!canPlan}
                          onClick={() => onModeChange(option)}
                          className={`rounded-lg border px-3 sm:px-4 py-3 text-left transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-50 ${
                            selected
                              ? 'border-brand-600 bg-brand-600 text-white'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-[#fafafc]'
                          }`}
                        >
                          <span className="block text-sm font-semibold">{label}</span>
                          <span className={`mt-1 block text-xs font-medium ${selected ? 'text-brand-100' : 'text-slate-500'}`}>
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
                        className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-[#fafafc] p-4"
                        initial={shouldReduce ? false : { opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={transition}
                      >
                        <label htmlFor={secondStartDateId} className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Début de la 2<sup>e</sup> période d&apos;1 mois
                        </label>
                        <input
                          id={secondStartDateId}
                          type="date"
                          value={toInputValue(secondStartDate)}
                          min={minSecondStartDateValue || undefined}
                          max={maxSecondStartDateValue || undefined}
                          disabled={!canPlan}
                          onChange={(event) => {
                            onSecondStartDateChange(parseInputDate(event.target.value));
                          }}
                          className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-normal text-[#1d1d1f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        <p className="mt-2 text-xs leading-relaxed text-slate-500">
                          Doit débuter après la fin de la première période et se terminer avant la date limite légale.
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

      <div className="mt-5 rounded-lg border border-slate-200 bg-[#fafafc] p-4">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <Wallet className="h-4 w-4" aria-hidden="true" />
          Indemnisation (salariés)
        </div>
        <ul className="space-y-2 text-sm font-medium text-slate-700">
          <li className="flex items-baseline justify-between gap-3">
            <span>Premier mois</span>
            <span className="rounded-full bg-white px-2.5 py-0.5 font-semibold text-[#1d1d1f]">
              70% du salaire net
            </span>
          </li>
          <li className="flex items-baseline justify-between gap-3">
            <span>Second mois</span>
            <span className="rounded-full bg-white px-2.5 py-0.5 font-semibold text-[#1d1d1f]">
              60% du salaire net
            </span>
          </li>
        </ul>
        <p className="mt-3 text-xs leading-relaxed text-slate-500">
          Dans la limite du plafond de la Sécurité sociale. Montants exacts sous réserve des décrets
          d&apos;application.
        </p>
      </div>

      <div className="mt-3 rounded-lg border border-slate-200 bg-white p-4">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <Users className="h-4 w-4" aria-hidden="true" />
          Bénéficiaires
        </div>
        <p className="text-sm leading-relaxed text-slate-600">
          Ouvert aux deux parents : salariés, indépendants, non-salariés agricoles, fonctionnaires et
          militaires. Pris simultanément ou en alternance, après les congés de maternité, de paternité
          et d&apos;accueil de l&apos;enfant ou d&apos;adoption.
        </p>
      </div>

      {showHospitalizationCaution && (
        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-amber-700">
            <Info className="h-4 w-4" aria-hidden="true" />
            Hospitalisation
          </div>
          <p className="text-sm leading-relaxed text-amber-900">
            La date limite affichée pour le congé supplémentaire 2026 n’intègre pas automatiquement
            les reports liés à une hospitalisation. Vérifiez le délai applicable avec l’employeur
            ou la CPAM avant d’envoyer la demande.
          </p>
        </div>
      )}

      {(disabledReason || planningNotice || error || periodsValidated) && (
        <div
          className={`mt-5 rounded-lg border p-4 ${
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
                <p>{error || disabledReason || planningNotice}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
