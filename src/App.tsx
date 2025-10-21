import { useCallback, useEffect, useRef } from 'react';
import { useMediaQuery } from './hooks/useMediaQuery';
import { Calendar as CalendarIcon, RotateCcw } from 'lucide-react';
import { Calendar } from './components/Calendar';
import { Summary } from './components/Summary';
import { LegalInfo } from './components/LegalInfo';
import { LetterGenerator } from './components/LetterGenerator';
import { ScrollIndicator } from './components/ScrollIndicator';
import { CelebrationModal } from './components/CelebrationModal';
import { FeedbackBanner } from './components/FeedbackBanner';
import { ProgressStepper } from './components/ProgressStepper';
import { CalendarLegend } from './components/CalendarLegend';
import { SectionCard } from './components/SectionCard';
import { NextStepsCard } from './components/NextStepsCard';
import { NavigationAnchor } from './components/NavigationAnchor';
import { ScenarioSelector } from './components/ScenarioSelector';
import { Button } from './components/Button';
import { usePaternityPlanning } from './hooks/usePaternityPlanning';

  function App() {
  const isCoarsePointer = useMediaQuery('(pointer: coarse)');
  const {
    birthDate,
    employerPeriod,
    mandatoryPeriod,
    remainingBlocks,
    error,
    successMessage,
    showResetConfirm,
    customMode,
    customFirstBlockDays,
    visualSelectionMode,
    selectionStep,
    selectionStartDate,
    showCelebration,
    planningStep,
    totalPlannedDays,
    totalFractionableDays,
    scenario,
    scenarioId,
    selectBirthDate,
    selectRemainingDay,
    requestReset,
    confirmReset,
    cancelReset,
    removeBlock,
    clearAllBlocks,
    startVisualSelection,
    cancelVisualSelection,
    hideCelebration,
    setScenarioId,
    setCustomMode,
    setCustomFirstBlockDays
  } = usePaternityPlanning();

  const secondBlockDays = Math.max(totalFractionableDays - customFirstBlockDays, 0);
  const sliderMax = Math.max(5, totalFractionableDays - 5);

  // Refs for smooth scrolling
  const calendarRef = useRef<HTMLDivElement>(null);
  const planningRef = useRef<HTMLDivElement>(null);
  const customModeRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);

  // Smooth scroll utility - STABLE (pas de dépendances)
  const smoothScrollTo = useCallback((ref: React.RefObject<HTMLDivElement>) => {
    const node = ref.current;
    if (!node) return;
    node.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  // Schedule scroll after RAF to avoid race conditions; use instant scroll on mobile
  const scheduleSmoothScroll = useCallback((ref: React.RefObject<HTMLDivElement>, offset: number = -20) => {
    requestAnimationFrame(() => {
      const node = ref.current;
      if (!node) return;
      const elementPosition = node.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset + offset;
      const behavior: ScrollBehavior = isCoarsePointer ? 'auto' : 'smooth';
      window.scrollTo({ top: offsetPosition, behavior });
    });
  }, [isCoarsePointer]);

  const scrollIntoViewIfNeeded = useCallback(
    (ref: React.RefObject<HTMLDivElement>) => {
      const node = ref.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const fullyVisible = rect.top >= 0 && rect.bottom <= viewportHeight;

      if (!fullyVisible) {
        smoothScrollTo(ref);
      }
    },
    [smoothScrollTo]
  );

  const handleSelectBirthDate = (date: Date) => {
    selectBirthDate(date);
    // Scrolling is deferred until planning section is mounted (effect below)
  };

  const handleSelectRemainingDay = (date: Date) => {
    selectRemainingDay(date);
  };

  const handleResetRequest = () => {
    requestReset();
  };

  const handleResetConfirm = () => {
    confirmReset();
  };

  const handleResetCancel = () => {
    cancelReset();
  };

  const handleRemoveBlock = (index: number) => {
    removeBlock(index);
  };

  const handleClearAllBlocks = () => {
    clearAllBlocks();
  };

  const handleStartVisualSelection = () => {
    startVisualSelection();
    scheduleSmoothScroll(calendarRef, -100);
  };

  const handleCancelVisualSelection = () => {
    cancelVisualSelection();
  };

  // Scroll to top on initial page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  // Auto-scroll to calendar after scenario selection
  const previousScenarioId = useRef(scenarioId);
  useEffect(() => {
    if (previousScenarioId.current !== scenarioId && !birthDate) {
      scheduleSmoothScroll(calendarRef, -100);
    }
    previousScenarioId.current = scenarioId;
  }, [scenarioId, birthDate, scheduleSmoothScroll]);

  // After selecting birth date, scroll to the planning section once it is mounted
  const previousBirthDateTs = useRef<number | null>(null);
  useEffect(() => {
    const planningIntroVisible = Boolean(birthDate && mandatoryPeriod && remainingBlocks.length === 0 && !customMode);
    if (!planningIntroVisible) return;
    const ts = birthDate ? birthDate.getTime() : null;
    if (ts && previousBirthDateTs.current !== ts) {
      previousBirthDateTs.current = ts;
      scheduleSmoothScroll(planningRef, -100);
    }
  }, [birthDate, mandatoryPeriod, remainingBlocks.length, customMode, scheduleSmoothScroll]);

  const previousPlannedDays = useRef(totalPlannedDays);
  useEffect(() => {
    if (
      previousPlannedDays.current < totalFractionableDays &&
      totalPlannedDays === totalFractionableDays
    ) {
      scrollIntoViewIfNeeded(letterRef);
    }
    previousPlannedDays.current = totalPlannedDays;
  }, [scrollIntoViewIfNeeded, totalFractionableDays, totalPlannedDays]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-12 max-w-5xl pt-16 sm:pt-20 md:pt-20 pb-16 md:pb-6">
        <header className="mb-8 sm:mb-12 text-center animate-fade-in relative">
          <button
            onClick={handleResetRequest}
            className={`absolute top-0 right-2 sm:right-4 px-3 sm:px-4 py-2 sm:py-2.5 bg-white/80 backdrop-blur-sm text-slate-700 rounded-xl hover:bg-white hover:shadow-lg transition-apple-smooth text-xs sm:text-sm font-semibold active:scale-[0.96] hover:scale-[1.02] border border-slate-300/50 flex items-center gap-1 sm:gap-2 ${!birthDate ? 'opacity-0 pointer-events-none' : 'opacity-100 animate-fade-in'}`}
          >
            <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Réinitialiser</span>
            <span className="sm:hidden">Reset</span>
          </button>

          <button
            onClick={handleResetRequest}
            className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 bg-teal-600 text-white shadow-lg transition-apple-smooth hover:shadow-xl hover:scale-105 active:scale-95 animate-logo-appear ${birthDate ? 'cursor-pointer animate-logo-glow' : 'cursor-default'}`}
            title={birthDate ? 'Cliquer pour réinitialiser' : 'Calendrier'}
          >
            <div className="logo-icon-container w-8 h-8 sm:w-10 sm:h-10 relative">
              <CalendarIcon className="logo-icon-part w-8 h-8 sm:w-10 sm:h-10 text-white" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 50%, 0 50%)' }} />
              <CalendarIcon className="logo-icon-part w-8 h-8 sm:w-10 sm:h-10 text-white" style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 50%, 50% 50%)' }} />
              <CalendarIcon className="logo-icon-part w-8 h-8 sm:w-10 sm:h-10 text-white" style={{ clipPath: 'polygon(0 50%, 50% 50%, 50% 100%, 0 100%)' }} />
              <CalendarIcon className="logo-icon-part w-8 h-8 sm:w-10 sm:h-10 text-white" style={{ clipPath: 'polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)' }} />
            </div>
          </button>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-3 sm:mb-4 tracking-tight leading-tight">
            Congé Paternité
          </h1>
          <p className="text-slate-600 text-base sm:text-lg font-medium mb-3 sm:mb-4 px-4 max-w-3xl mx-auto leading-relaxed">
            Planifiez votre congé selon la législation française
          </p>

        {/* Made by badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 rounded-full border border-slate-200 shadow-sm hover:shadow-md transition-apple-smooth hover:scale-105 mt-2">
          <span className="text-xs text-slate-600 font-medium">Made with</span>
          <span className="text-red-500 animate-pulse-subtle text-base">❤️</span>
          <span className="text-xs text-slate-600 font-medium">by</span>
          <span className="text-xs font-bold text-teal-700">
            Hedi ACHACHE
          </span>
        </div>
        </header>

        <ScrollIndicator show={birthDate !== null} />

        <NavigationAnchor show={birthDate !== null} />

        <div className="max-w-3xl mx-auto mb-8">
          <SectionCard
            title="1. Choisissez votre situation"
            description="Commencez par sélectionner votre cas pour adapter le nombre de jours"
            accent="teal"
          >
            <ScenarioSelector selectedScenario={scenarioId} onScenarioChange={setScenarioId} />
          </SectionCard>
        </div>

        <div className="max-w-3xl mx-auto mb-8">
          <ProgressStepper currentStep={planningStep} fractionableDays={totalFractionableDays} />
          {birthDate && (
            <p className="mt-3 text-center text-sm text-slate-600">
              {totalPlannedDays} / {totalFractionableDays} jours planifiés
            </p>
          )}
        </div>

        <div className="max-w-3xl mx-auto mb-8">
          <SectionCard
            title="Étapes suivantes"
            description="Suivez les actions à réaliser pour finaliser votre demande"
            accent="teal"
          >
            <NextStepsCard
              planningStep={planningStep}
              totalPlannedDays={totalPlannedDays}
              hasBirthDate={Boolean(birthDate)}
              hasMandatory={Boolean(mandatoryPeriod)}
              remainingBlocks={remainingBlocks.length}
              fractionableDays={totalFractionableDays}
            />
          </SectionCard>
        </div>

        {/* Celebration Modal */}
        <CelebrationModal
          show={showCelebration}
          onClose={() => {
            hideCelebration();
            scheduleSmoothScroll(letterRef, -100);
          }}
          totalFractionableDays={totalFractionableDays}
        />

        {/* Modal de confirmation de réinitialisation */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-spring-in">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500 text-white mb-4 shadow-md">
                  <RotateCcw className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Réinitialiser ?
                </h3>
                <p className="text-slate-600 text-base leading-relaxed">
                  Êtes-vous sûr de vouloir réinitialiser toute la planification ? Cette action ne peut pas être annulée.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleResetCancel}
                  variant="secondary"
                  size="lg"
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleResetConfirm}
                  variant="danger"
                  size="lg"
                  className="flex-1"
                >
                  Réinitialiser
                </Button>
              </div>
            </div>
          </div>
        )}

        {(error || (successMessage && !visualSelectionMode)) && (
          <div className={`max-w-3xl mx-auto space-y-3 mb-6 ${isCoarsePointer ? '' : 'animate-fade-in'}`}>
            {error && (
              <FeedbackBanner
                tone="error"
                title="Action requise"
                message={error}
              />
            )}

            {successMessage && !visualSelectionMode && (
              <FeedbackBanner
                tone="success"
                title="C’est enregistré"
                message={successMessage}
              />
            )}
          </div>
        )}

        {/* Bannière d'instruction pour le mode sélection visuelle - juste au-dessus du calendrier */}
        {visualSelectionMode && selectionStep !== 'idle' && (
          <div className="mb-4 max-w-3xl mx-auto animate-slide-up">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 sm:p-5 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-xl shadow-md">
                    {selectionStep === 'selecting-start' ? '1' : '2'}
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-base sm:text-lg font-bold text-emerald-900 mb-1">
                    {selectionStep === 'selecting-start'
                      ? '📍 Cliquez sur la date de DÉBUT'
                      : '📍 Cliquez sur la date de FIN'}
                  </h4>
                  <p className="text-sm sm:text-base text-emerald-800">
                    {selectionStep === 'selecting-start'
                      ? 'Choisissez le premier jour de votre première période'
                      : `Choisissez le dernier jour (min. 5 jours)`}
                  </p>
                  {selectionStartDate && selectionStep === 'selecting-end' && (
                    <div className="mt-2 p-2 bg-white/60 rounded-lg border border-emerald-200 animate-scale-in">
                      <p className="text-sm font-semibold text-emerald-900">
                        ✓ Début : {selectionStartDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleCancelVisualSelection}
                  className="flex-shrink-0 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-apple-smooth hover:shadow-md border border-slate-200 active:scale-95"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        <div ref={calendarRef} className="mb-6 sm:mb-8 max-w-3xl mx-auto scroll-mt-20" id="calendar">
          <Calendar
            birthDate={birthDate}
            onSelectBirthDate={handleSelectBirthDate}
            employerPeriod={employerPeriod}
            mandatoryPeriod={mandatoryPeriod}
            remainingBlocks={remainingBlocks}
            onSelectRemainingDay={handleSelectRemainingDay}
            onRemoveBlock={handleRemoveBlock}
            scenario={scenario}
          />
          <CalendarLegend />
        </div>

        {birthDate && mandatoryPeriod && remainingBlocks.length === 0 && !customMode && (
          <div ref={planningRef} className={`max-w-3xl mx-auto mb-6 sm:mb-8 ${isCoarsePointer ? '' : 'animate-fade-in'} scroll-mt-20`}>
            <div className={`bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-lg ${isCoarsePointer ? '' : 'transition-apple-smooth'}`}>
              <div className="text-center mb-6 sm:mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-teal-100 text-teal-700 mb-3 sm:mb-4 shadow-sm">
                  <span className="text-2xl sm:text-3xl" aria-hidden="true">
                    📅
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Planifiez vos {totalFractionableDays} jours restants
                </h3>
                <p className="text-slate-600 text-base px-4 leading-relaxed">
                  Cliquez sur une date dans le calendrier pour placer vos {totalFractionableDays} jours automatiquement
                </p>
              </div>

              {/* Mode personnalisé toggle */}
              <div className="bg-white border border-teal-200 rounded-2xl p-5 sm:p-6 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-base font-bold text-teal-900 mb-1">
                      Mode personnalisé
                    </h4>
                    <p className="text-base text-teal-700 leading-relaxed">
                      Choisissez vous-même où placer vos 2 périodes (min. 5j chacune)
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      setCustomMode(true);
                      scheduleSmoothScroll(customModeRef, -100);
                    }}
                    variant="primary"
                    size="md"
                    className="flex-shrink-0 ml-4"
                  >
                    Activer
                  </Button>
                </div>

                {/* Prévisualisation */}
                <div className="bg-white/90 rounded-xl p-3 sm:p-4">
                  <p className="text-sm text-slate-600 mb-2 text-center">
                    Répartition par défaut : {customFirstBlockDays}j + {secondBlockDays}j
                  </p>
                  <div className="flex gap-2">
                    <div className="flex-1 h-8 sm:h-10 bg-teal-500 rounded-lg flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-sm">
                      {customFirstBlockDays} jours
                    </div>
                    <div className="flex-1 h-8 sm:h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-sm">
                      {secondBlockDays} jours
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions simples */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                <p className="text-sm text-slate-700 font-medium">
                  💡 <span className="font-semibold">Mode simple</span> : 1 clic sur le calendrier = {totalFractionableDays} jours placés d'un coup
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Mode personnalisé actif */}
        {birthDate && mandatoryPeriod && remainingBlocks.length === 0 && customMode && !visualSelectionMode && (
          <div ref={customModeRef} className="max-w-3xl mx-auto mb-6 sm:mb-8 animate-spring-in scroll-mt-20">
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-teal-200 p-6 sm:p-8 shadow-lg">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold text-2xl shadow-md">
                    <span aria-hidden="true">⚙️</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-teal-900 mb-2">
                    Mode personnalisé
                  </h3>
                  <p className="text-base text-teal-800 mb-4 leading-relaxed">
                    Choisissez votre méthode de sélection
                  </p>
                </div>
              </div>

              {/* Deux options : Slider ou Sélection visuelle */}
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
                {/* Option 1 : Avec Slider */}
                <div className="bg-white rounded-2xl p-5 border border-teal-200 hover:border-teal-400 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center text-xl flex-shrink-0">
                      <span aria-hidden="true">🎚️</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Avec curseur</h4>
                      <p className="text-sm text-slate-600">Ajustez puis placez</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                    Utilisez le curseur pour choisir la répartition, puis cliquez 2 fois sur le calendrier
                  </p>
                </div>

                {/* Option 2 : Sélection visuelle */}
                <div className="bg-white rounded-2xl p-5 border border-emerald-200 hover:border-emerald-400 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl flex-shrink-0">
                      <span aria-hidden="true">👆</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Sélection directe</h4>
                      <p className="text-sm text-slate-600">Cliquez début + fin</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                    Cliquez sur la date de début, puis sur la date de fin de votre 1ère période
                  </p>
                  <Button
                    onClick={handleStartVisualSelection}
                    variant="primary"
                    size="sm"
                    fullWidth
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    Utiliser ce mode
                  </Button>
                </div>
              </div>

              {/* Slider personnalisé */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 mb-4 shadow-md">
                <div className="text-center mb-4">
                  <p className="text-sm font-semibold text-slate-700 mb-3">
                    Choisissez la répartition de vos {totalFractionableDays} jours
                  </p>
                  <div className="flex gap-2 justify-center items-center mb-3">
                    <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-teal-600 text-white shadow-md">
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold">{customFirstBlockDays}</div>
                        <div className="text-[10px] text-white/90">jours</div>
                      </div>
                    </div>
                    <div className="text-2xl text-slate-400 font-bold">+</div>
                    <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-emerald-600 text-white shadow-md">
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold">{secondBlockDays}</div>
                        <div className="text-[10px] text-white/90">jours</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Barre visuelle */}
                <div className="flex gap-2 mb-4">
                  <div
                    className="h-12 rounded-lg bg-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-sm transition-all"
                    style={{
                      width: `${(customFirstBlockDays / totalFractionableDays) * 100}%`
                    }}
                  >
                    Période 1
                  </div>
                  <div
                    className="h-12 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-sm transition-all"
                    style={{
                      width: `${(secondBlockDays / totalFractionableDays) * 100}%`
                    }}
                  >
                    Période 2
                  </div>
                </div>

                {/* Slider */}
                <input
                  type="range"
                  min="5"
                  max={sliderMax}
                  value={customFirstBlockDays}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomFirstBlockDays(Number(e.target.value))}
                  className="w-full h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer slider-thumb mb-2"
                />
                <p className="text-sm text-slate-500 text-center">
                  Déplacez le curseur • Minimum 5 jours par période
                </p>
              </div>

              {/* Instructions et boutons */}
              <div className="bg-white/60 rounded-xl p-4 mb-4 border-2 border-teal-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
                  <p className="text-sm text-teal-900 font-medium">
                    Cliquez sur le calendrier pour placer le 1er bloc de <span className="font-bold">{customFirstBlockDays} jours</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
                  <p className="text-sm text-emerald-900 font-medium">
                    Puis cliquez à nouveau pour placer le 2ème bloc de <span className="font-bold">{secondBlockDays} jours</span>
                  </p>
                </div>
              </div>

              <Button
                onClick={() => setCustomMode(false)}
                variant="outline"
                size="lg"
                fullWidth
              >
                Annuler et revenir au mode simple
              </Button>
            </div>
          </div>
        )}


        {/* Message pendant le placement personnalisé */}
        {customMode && remainingBlocks.length === 1 && !visualSelectionMode && (
          <div className="max-w-3xl mx-auto mb-6 sm:mb-8 animate-slide-up">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-md flex-shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="text-lg sm:text-xl font-bold text-emerald-900 mb-1">
                    Placez maintenant le second bloc
                  </h4>
                  <p className="text-sm text-emerald-800">
                    Cliquez sur une date dans le calendrier pour placer les {secondBlockDays} jours restants
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bouton Effacer tous les blocs */}
        {remainingBlocks.length > 0 && (
          <div className={`max-w-3xl mx-auto mb-8 ${isCoarsePointer ? '' : 'animate-fade-in'}`}>
            <Button
              onClick={handleClearAllBlocks}
              variant="outline"
              size="md"
              fullWidth
              className="bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 border-red-200 hover:border-red-300"
            >
              🗑️ Effacer tous les blocs et recommencer
            </Button>
          </div>
        )}

        {birthDate && (
          <>
            <div className={`max-w-3xl mx-auto mb-8 ${isCoarsePointer ? '' : 'animate-fade-in'}`} id="summary">
              <Summary
                birthDate={birthDate}
                employerPeriod={employerPeriod}
                mandatoryPeriod={mandatoryPeriod}
                remainingBlocks={remainingBlocks}
                onRemoveBlock={handleRemoveBlock}
                totalFractionableDays={totalFractionableDays}
                scenario={scenario}
              />
            </div>

            {mandatoryPeriod && (
              <div ref={letterRef} className={`max-w-3xl mx-auto mb-8 ${isCoarsePointer ? '' : 'animate-fade-in-delay'}`} id="letter">
                <LetterGenerator
                  birthDate={birthDate}
                  mandatoryPeriod={mandatoryPeriod}
                  remainingBlocks={remainingBlocks}
                />
              </div>
            )}
          </>
        )}


        {birthDate && (
          <div className="text-center mt-8 max-w-3xl mx-auto animate-fade-in-delay">
            <Button
              onClick={handleResetRequest}
              variant="secondary"
              size="md"
              icon={RotateCcw}
              iconPosition="left"
              className="mx-auto"
            >
              Réinitialiser
            </Button>
          </div>
        )}

        <div className="mt-16 max-w-3xl mx-auto mb-12" id="legal">
          <LegalInfo />
        </div>
      </div>
    </div>
  );
}

export default App;
