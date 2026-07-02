import { memo, type ChangeEvent, type RefObject } from 'react';
import {
  ArrowUp,
  CalendarDays as CalendarDaysIcon,
  MousePointer2,
  Settings2,
  SlidersHorizontal,
  Sparkles,
  Zap
} from 'lucide-react';
import { Button } from './Button';

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
  onFocusCalendar: () => void;
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

function SparkleDecor() {
  return (
    <span aria-hidden="true" className="absolute -top-1 -right-1">
      <Sparkles className="w-3 h-3 text-yellow-300 animate-pulse-soft" />
    </span>
  );
}

export const PlanningModeSelector = memo(function PlanningModeSelector({
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
  onFocusCalendar,
  onActivateCustomMode,
  onStartVisualSelection,
  onCancelCustomMode,
  onCustomFirstBlockDaysChange
}: PlanningModeSelectorProps) {
  const sliderPercentage = getSliderPercentage(customFirstBlockDays, sliderMax);
  const firstBlockPercentage = getRatioPercentage(customFirstBlockDays, totalFractionableDays);
  const secondBlockPercentage = getRatioPercentage(secondBlockDays, totalFractionableDays);

  const handleCustomFirstBlockDaysChange = (event: ChangeEvent<HTMLInputElement>) => {
    onCustomFirstBlockDaysChange(Number(event.target.value));
  };

  return (
    <>
      {isChoiceVisible && (
        <div
          key="planning-choice"
          ref={planningRef}
          className="max-w-3xl mx-auto mb-16 sm:mb-12 scroll-mt-28"
        >
          <div className={`premium-card p-5 sm:p-7 ${isCoarsePointer ? '' : 'transition-all duration-300'}`}>
            <div className="text-center mb-6 sm:mb-7">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white mb-3 sm:mb-4 shadow-lg shadow-brand-500/20">
                <CalendarDaysIcon className="h-6 w-6 sm:h-8 sm:w-8" aria-hidden="true" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 mb-2">
                Planifiez vos {totalFractionableDays} jours
              </h3>
              <p className="text-sm sm:text-lg text-slate-500 max-w-md mx-auto">
                Deux modes au choix selon vos préférences.
              </p>
            </div>

            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
              {/* Mode simple - Carte recommandée */}
              <div className="relative flex flex-col rounded-2xl border-2 border-brand-200 bg-gradient-to-br from-brand-50/90 to-white p-4 sm:p-6 shadow-md shadow-brand-500/10 transition-all duration-300 active:scale-[0.98] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-500/15">
                <span className="absolute -top-3 left-6 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-warm-400 to-warm-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg shadow-warm-400/40">
                  <Sparkles className="h-3 w-3" aria-hidden="true" />
                  Recommandé
                  <SparkleDecor />
                </span>

                <div className="mb-4 sm:mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-md shadow-brand-500/20">
                    <Zap className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold font-display text-slate-900">Mode simple</h4>
                    <p className="text-xs font-bold uppercase tracking-wider text-brand-600">
                      1 clic = {totalFractionableDays} jours
                    </p>
                  </div>
                </div>

                <div className="mb-4 sm:mb-5 rounded-xl border border-brand-100 bg-white/90 p-3.5 sm:p-4 shadow-sm">
                  <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Période unique
                  </p>
                  <div className="flex h-12 items-center justify-center rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 text-sm font-bold text-white shadow-inner shadow-brand-500/20">
                    {totalFractionableDays} jours consécutifs
                  </div>
                </div>

                <p className="mb-4 sm:mb-5 flex-1 text-sm leading-relaxed text-slate-600">
                  Cliquez sur une date dans le calendrier ci-dessus, vos {totalFractionableDays} jours se placent
                  automatiquement à la suite.
                </p>

                <Button
                  onClick={onFocusCalendar}
                  variant="primary"
                  size="md"
                  icon={ArrowUp}
                  iconPosition="right"
                  fullWidth
                >
                  Choisir une date sur le calendrier
                </Button>
              </div>

              {/* Mode personnalisé */}
              <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm transition-all duration-300 active:scale-[0.98] hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
                <div className="mb-4 sm:mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700 shadow-sm">
                    <Settings2 className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold font-display text-slate-900">Mode personnalisé</h4>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      2 périodes ajustables
                    </p>
                  </div>
                </div>

                <div className="mb-4 sm:mb-5 rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 sm:p-4 shadow-sm">
                  <div className="mb-2 flex gap-2 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <span className="flex-1">Période 1</span>
                    <span className="flex-1">Période 2</span>
                  </div>
                  <div className="flex gap-2">
                    <div
                      className="flex h-12 flex-1 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-bold text-slate-700 transition-all duration-300 ease-out"
                    >
                      {customFirstBlockDays}j
                    </div>
                    <div
                      className="flex h-12 flex-1 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-bold text-slate-700 transition-all duration-300 ease-out"
                    >
                      {secondBlockDays}j
                    </div>
                  </div>
                </div>

                <p className="mb-4 sm:mb-5 flex-1 text-sm leading-relaxed text-slate-600">
                  Définissez vous-même la durée de chaque période (minimum 5 jours par bloc).
                </p>

                <Button onClick={onActivateCustomMode} variant="secondary" size="md" fullWidth>
                  Activer le mode personnalisé
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isCustomModeVisible && (
        <div
          key="planning-custom"
          ref={customModeRef}
          className="max-w-3xl mx-auto mb-16 sm:mb-12 scroll-mt-28"
        >
          <div className="premium-card p-5 sm:p-7">
            <div className="flex items-start gap-4 sm:gap-5 mb-6 sm:mb-8">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white flex items-center justify-center shadow-lg shadow-brand-600/20">
                  <Settings2 className="h-6 w-6 sm:h-8 sm:w-8" aria-hidden="true" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 mb-1 sm:mb-2">Mode personnalisé</h3>
                <p className="text-sm sm:text-lg text-slate-500 font-medium">Choisissez votre méthode de sélection</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-white rounded-card p-4 sm:p-6 border border-slate-200 hover:border-brand-200 hover:shadow-md transition-all duration-300 group hover:-translate-y-0.5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white text-slate-700 border border-slate-200 flex items-center justify-center text-2xl shadow-sm group-hover:border-brand-200 transition-all duration-300">
                    <SlidersHorizontal className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Curseur</h4>
                    <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Simple & Rapide</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Ajustez la répartition avec le curseur ci-dessous, puis cliquez sur le calendrier.
                </p>
              </div>

              <div className="relative bg-gradient-to-br from-brand-50/40 to-white rounded-card p-4 sm:p-6 border border-brand-100 hover:border-brand-200 hover:shadow-md transition-all duration-300 group hover:-translate-y-0.5 overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white flex items-center justify-center text-2xl shadow-md shadow-brand-500/20">
                      <MousePointer2 className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">Sélection directe</h4>
                      <p className="text-xs font-bold uppercase text-brand-500 tracking-wider">Précis</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-5 leading-relaxed">
                    Sélectionnez manuellement vos dates de début et de fin sur le calendrier.
                  </p>
                  <Button
                    onClick={onStartVisualSelection}
                    variant="primary"
                    size="sm"
                    fullWidth
                  >
                    Commencer
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-50/80 to-white rounded-card p-4 sm:p-8 mb-6 border border-slate-100 shadow-sm">
              <div className="text-center mb-6 sm:mb-8">
                <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-400 mb-5 sm:mb-6">
                  Répartition des jours
                </p>
                <div className="flex gap-4 justify-center items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-600/20 flex items-center justify-center text-2xl sm:text-3xl font-bold font-display mb-2 transition-all duration-300 ease-out"
                    >
                      {customFirstBlockDays}
                    </div>
                    <span className="text-xs font-bold text-brand-700 uppercase">Période 1</span>
                  </div>
                  <div className="text-2xl text-slate-300 font-light">+</div>
                  <div className="flex flex-col items-center">
                    <div
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20 flex items-center justify-center text-2xl sm:text-3xl font-bold font-display mb-2 transition-all duration-300 ease-out"
                    >
                      {secondBlockDays}
                    </div>
                    <span className="text-xs font-bold text-emerald-600 uppercase">Période 2</span>
                  </div>
                </div>
              </div>

              {/* Barre de progression */}
              <div className="h-4 bg-slate-200/60 rounded-full overflow-hidden mb-6 flex shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-brand-500 to-brand-400 transition-all duration-300 ease-out shadow-sm"
                  style={{ width: `${firstBlockPercentage}%` }}
                />
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-300 ease-out shadow-sm"
                  style={{ width: `${secondBlockPercentage}%` }}
                />
              </div>

              {/* Slider */}
              <div className="relative h-16 flex items-center px-1">
                <input
                  type="range"
                  min="5"
                  max={sliderMax}
                  value={customFirstBlockDays}
                  onChange={handleCustomFirstBlockDaysChange}
                  aria-label="Répartition de la première période"
                  className="w-full absolute inset-0 z-20 opacity-0 cursor-pointer h-16"
                />
                {/* Track background */}
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-500 to-brand-400 transition-all duration-150 ease-out rounded-full"
                    style={{ width: `${sliderPercentage}%` }}
                  />
                </div>
                {/* Thumb personnalisé */}
                <div
                  className="absolute h-10 w-10 bg-white border-[3px] border-brand-500 rounded-full shadow-lg shadow-brand-500/20 pointer-events-none transition-all duration-75 z-10"
                  style={{ left: `calc(${sliderPercentage}% - 20px)` }}
                />
              </div>
              <p className="text-xs text-center text-slate-400 font-medium mt-2">
                Glissez pour ajuster la répartition (min. 5 jours par période)
              </p>
            </div>

            <Button
              onClick={onCancelCustomMode}
              variant="ghost"
              size="lg"
              fullWidth
              className="text-slate-500 hover:text-slate-800"
            >
              Annuler et revenir au mode simple
            </Button>
          </div>
        </div>
      )}

      {isFinalStepVisible && (
        <div
          key="planning-final-step"
          className="fixed inset-x-3 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-40 max-w-[calc(100vw-1.5rem)] sm:max-w-3xl sm:sticky sm:inset-x-auto sm:bottom-auto sm:top-24 sm:z-30 sm:mx-auto sm:mb-12"
        >
          <div className="rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50/90 to-emerald-50/70 backdrop-blur-md p-4 sm:p-5 shadow-lg shadow-emerald-500/10">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center font-bold font-display text-lg sm:text-xl shadow-md shadow-emerald-500/20 flex-shrink-0">
                2
              </div>
              <div className="flex-1">
                <h4 className="text-base sm:text-lg font-bold text-emerald-900 mb-1 font-display">Dernière étape</h4>
                <p className="text-sm text-emerald-800 font-medium">
                  Cliquez sur une date pour placer les <span className="font-bold">{secondBlockDays} jours restants</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
});
