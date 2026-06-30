import type { ChangeEvent, RefObject } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays as CalendarDaysIcon, MousePointer2, Settings2 } from 'lucide-react';
import { Button } from './Button';
import { fadeIn, fadeInUp, useAppMotion } from '../lib/motion';

interface PlanningModeSelectorProps {
  isChoiceVisible: boolean;
  isCustomModeVisible: boolean;
  isFinalStepVisible: boolean;
  isCoarsePointer: boolean;
  planningRef: RefObject<HTMLDivElement>;
  customModeRef: RefObject<HTMLDivElement>;
  totalFractionableDays: number;
  customFirstBlockDays: number;
  secondBlockDays: number;
  sliderMax: number;
  onActivateCustomMode: () => void;
  onStartVisualSelection: () => void;
  onCancelCustomMode: () => void;
  onCustomFirstBlockDaysChange: (days: number) => void;
}

function getRatioPercentage(value: number, total: number) {
  if (total <= 0) return 0;
  return (value / total) * 100;
}

function getSliderPercentage(value: number, max: number) {
  if (max <= 5) return 0;
  return ((value - 5) / (max - 5)) * 100;
}

export function PlanningModeSelector({
  isChoiceVisible,
  isCustomModeVisible,
  isFinalStepVisible,
  isCoarsePointer,
  planningRef,
  customModeRef,
  totalFractionableDays,
  customFirstBlockDays,
  secondBlockDays,
  sliderMax,
  onActivateCustomMode,
  onStartVisualSelection,
  onCancelCustomMode,
  onCustomFirstBlockDaysChange
}: PlanningModeSelectorProps) {
  const sliderPercentage = getSliderPercentage(customFirstBlockDays, sliderMax);
  const firstBlockPercentage = getRatioPercentage(customFirstBlockDays, totalFractionableDays);
  const secondBlockPercentage = getRatioPercentage(secondBlockDays, totalFractionableDays);
  const { transition } = useAppMotion();

  const handleCustomFirstBlockDaysChange = (event: ChangeEvent<HTMLInputElement>) => {
    onCustomFirstBlockDaysChange(Number(event.target.value));
  };

  return (
    <AnimatePresence initial={false}>
      {isChoiceVisible && (
        <motion.div
          key="planning-choice"
          className="mx-auto mb-8 max-w-4xl scroll-mt-28 sm:mb-10"
          initial={isCoarsePointer ? false : 'hidden'}
          animate="visible"
          exit="hidden"
          variants={fadeIn}
          transition={transition}
        >
          <div ref={planningRef} className="premium-card scroll-mt-28 p-4 sm:p-5">
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1d1d1f] text-white">
                <CalendarDaysIcon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-lg font-semibold tracking-[-0.018em] text-[#1d1d1f] sm:text-xl">
                  Planifier les {totalFractionableDays} jours restants
                </h3>
                <p className="mt-1 text-sm font-normal leading-relaxed text-slate-500">
                  Pour le mode simple, cliquez directement sur la date de début dans le calendrier.
                </p>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-[#fafafc] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">Mode simple</p>
                <p className="mt-1 text-sm font-semibold text-[#1d1d1f]">
                  {totalFractionableDays} jours consécutifs
                </p>
                <p className="mt-2 text-xs font-normal leading-relaxed text-slate-600">
                  Le calendrier place automatiquement toute la période à partir du jour choisi.
                </p>
              </div>

              <button
                type="button"
                onClick={onActivateCustomMode}
                className="rounded-lg border border-slate-200 bg-white p-4 text-left transition-colors hover:border-slate-300 hover:bg-[#fafafc] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5f5f7] text-slate-700">
                    <Settings2 className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1d1d1f]">Mode personnalisé</p>
                    <p className="text-xs font-normal text-slate-500">1 ou 2 périodes, minimum 5 jours.</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {isCustomModeVisible && (
        <motion.div
          key="planning-custom"
          className="mx-auto mb-8 max-w-4xl scroll-mt-28 sm:mb-10"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={fadeInUp}
          transition={transition}
        >
          <div ref={customModeRef} className="premium-card scroll-mt-28 p-4 sm:p-6">
            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1d1d1f] text-white">
                <Settings2 className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-lg font-semibold tracking-[-0.018em] text-[#1d1d1f] sm:text-xl">Mode personnalisé</h3>
                <p className="mt-1 text-sm font-normal leading-relaxed text-slate-500">
                  Ajustez la répartition puis choisissez les dates dans le calendrier.
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-[#fafafc] p-4">
              <div className="mb-4 grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-white p-3 text-center ring-1 ring-slate-200">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-600">Période 1</p>
                  <p className="mt-1 text-2xl font-semibold text-[#1d1d1f]">{customFirstBlockDays}</p>
                  <p className="text-xs font-normal text-slate-500">jours</p>
                </div>
                <div className="rounded-lg bg-white p-3 text-center ring-1 ring-slate-200">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-700">Période 2</p>
                  <p className="mt-1 text-2xl font-semibold text-[#1d1d1f]">{secondBlockDays}</p>
                  <p className="text-xs font-normal text-slate-500">jours</p>
                </div>
              </div>

              <div className="mb-4 flex h-2 overflow-hidden rounded-full bg-slate-200" aria-hidden="true">
                <div className="h-full bg-brand-600 transition-[width] duration-200" style={{ width: `${firstBlockPercentage}%` }} />
                <div className="h-full bg-emerald-500 transition-[width] duration-200" style={{ width: `${secondBlockPercentage}%` }} />
              </div>

              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="custom-first-block-days">
                Répartition de la première période
              </label>
              <div className="relative mt-2 h-10 flex items-center">
                <input
                  id="custom-first-block-days"
                  type="range"
                  min="5"
                  max={sliderMax}
                  value={customFirstBlockDays}
                  onChange={handleCustomFirstBlockDaysChange}
                  className="absolute z-20 h-full w-full cursor-pointer opacity-0"
                />
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full bg-slate-400" style={{ width: `${sliderPercentage}%` }} />
                </div>
                <div
                  className="absolute h-7 w-7 rounded-full border-4 border-brand-600 bg-white shadow-sm pointer-events-none transition-[left] duration-75"
                  style={{ left: `calc(${sliderPercentage}% - 14px)` }}
                />
              </div>
              <p className="text-xs font-normal text-slate-500">Minimum 5 jours calendaires par période.</p>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <Button onClick={onStartVisualSelection} variant="primary" size="md" fullWidth className="shadow-none">
                <MousePointer2 className="mr-2 h-4 w-4" aria-hidden="true" />
                Sélection directe
              </Button>
              <Button onClick={onCancelCustomMode} variant="secondary" size="md" fullWidth>
                Revenir au mode simple
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {isFinalStepVisible && (
        <motion.div
          key="planning-final-step"
          className="sticky top-4 z-30 mx-auto mb-8 max-w-4xl sm:top-24 sm:mb-10"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={fadeInUp}
          transition={transition}
        >
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-soft">
            <p className="text-sm font-bold text-emerald-950">Deuxième période</p>
            <p className="mt-1 text-sm font-medium leading-relaxed text-emerald-800">
              Cliquez sur une date pour placer les {secondBlockDays} jours restants.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
