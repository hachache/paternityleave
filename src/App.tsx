import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Linkedin, Trash2 } from 'lucide-react';
import { useMediaQuery } from './hooks/useMediaQuery';
import { useScrollOrchestrator } from './hooks/useScrollOrchestrator';
import { Calendar } from './components/Calendar';
import { ScrollIndicator } from './components/ScrollIndicator';
import { FeedbackBanner } from './components/FeedbackBanner';
import { ProgressStepper } from './components/ProgressStepper';
import { CalendarLegend } from './components/CalendarLegend';
import { SectionCard } from './components/SectionCard';
import { NextStepsCard } from './components/NextStepsCard';
import { NavigationAnchor } from './components/NavigationAnchor';
import { ScenarioSelector } from './components/ScenarioSelector';
import { Button } from './components/Button';
import { ResetConfirmDialog } from './components/ResetConfirmDialog';
import { HeroHeader } from './components/HeroHeader';
import { PlanningModeSelector } from './components/PlanningModeSelector';
import { usePaternityPlanning } from './hooks/usePaternityPlanning';
import { useAppMotion } from './lib/motion';
import { scrollToTop } from './lib/scroll';

// Lazy-loaded components
const LetterGenerator = lazy(() => import('./components/LetterGenerator').then(m => ({ default: m.LetterGenerator })));
const Summary = lazy(() => import('./components/Summary').then(m => ({ default: m.Summary })));
const LegalInfo = lazy(() => import('./components/LegalInfo').then(m => ({ default: m.LegalInfo })));
const LegalReferences = lazy(() => import('./components/LegalReferences').then(m => ({ default: m.LegalReferences })));
const SupplementaryLeaveCard = lazy(() => import('./components/SupplementaryLeaveCard').then(m => ({ default: m.SupplementaryLeaveCard })));
const CelebrationModal = lazy(() => import('./components/CelebrationModal').then(m => ({ default: m.CelebrationModal })));

/** Skeleton de chargement premium */
function LazyFallback({ height = 'h-64' }: { height?: string }) {
  return (
    <div className={`${height} rounded-card bg-white/70 border border-slate-100 animate-pulse flex items-center justify-center shadow-sm overflow-hidden`}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-200 shimmer-bg" />
        <div className="w-32 h-3 rounded-full bg-slate-200 shimmer-bg" />
      </div>
    </div>
  );
}

/** Ornement décoratif pour la page */
function PageDecoration() {
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10" aria-hidden="true">
        {/* Grille de points subtile */}
        <div className="absolute inset-0 dot-pattern opacity-40" />
        {/* Dégradé radial central */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-brand-100/15 to-transparent blur-3xl" />
        {/* Blob décoratif haut-droit */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-brand-100/20 to-brand-50/10 rounded-full blur-3xl" />
        {/* Blob décoratif bas-gauche */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-tr from-brand-50/15 to-transparent rounded-full blur-3xl" />
      </div>
    </>
  );
}

function App() {
  const [showLegalReferences, setShowLegalReferences] = useState(false);
  const [showClearBlocksConfirm, setShowClearBlocksConfirm] = useState(false);
  const [calendarHighlight, setCalendarHighlight] = useState(false);
  const calendarHighlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isCoarsePointer = useMediaQuery('(pointer: coarse)');
  const { shouldReduce } = useAppMotion();
  const {
    birthDate,
    employerPeriod,
    mandatoryPeriod,
    remainingBlocks,
    error,
    successMessage,
    showResetConfirm,
    showScenarioConfirm,
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
    isPaternityPlanComplete,
    celebrationPendingOnPlanningComplete,
    supplementaryLeaveEnabled,
    supplementaryLeaveDuration,
    supplementaryLeaveMode,
    supplementaryLeaveFirstStartDate,
    supplementaryLeaveSecondStartDate,
    supplementaryLeaveEligibility,
    supplementaryLeaveEarliestStartDate,
    supplementaryLeavePeriods,
    supplementaryLeaveError,
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
    handleScenarioChange,
    confirmScenarioChange,
    cancelScenarioChange,
    setCustomMode,
    setCustomFirstBlockDays,
    setSupplementaryLeaveEnabled,
    setSupplementaryLeaveDuration,
    setSupplementaryLeaveMode,
    setSupplementaryLeaveFirstStartDate,
    setSupplementaryLeaveSecondStartDate
  } = usePaternityPlanning();

  const mainContentId = 'contenu-principal';
  const currentYear = new Date().getFullYear();
  const secondBlockDays = Math.max(totalFractionableDays - customFirstBlockDays, 0);
  const sliderMax = Math.max(5, totalFractionableDays - 5);
  const isEligibleForSupplementaryLeave = supplementaryLeaveEligibility.isEligibleBirthDate;
  const supplementaryLeaveConfigured =
    supplementaryLeaveEnabled &&
    supplementaryLeavePeriods.length > 0 &&
    !supplementaryLeaveError;

  const {
    calendarRef,
    planningRef,
    customModeRef,
    supplementaryLeaveRef,
    letterRef,
    hasScrolledPastStart,
    scheduleSmoothScroll,
    schedulePostPlanningScroll
  } = useScrollOrchestrator({
    birthDate,
    mandatoryPeriodPresent: Boolean(mandatoryPeriod),
    remainingBlocksCount: remainingBlocks.length,
    customMode,
    scenarioId,
    totalPlannedDays,
    totalFractionableDays,
    skipAutoScrollOnPlanningComplete: celebrationPendingOnPlanningComplete
  });

  const handleSelectBirthDate = useCallback((date: Date) => {
    selectBirthDate(date);
  }, [selectBirthDate]);

  const handleSelectRemainingDay = useCallback((date: Date) => {
    selectRemainingDay(date);
  }, [selectRemainingDay]);

  const handleResetRequest = useCallback(() => {
    requestReset();
  }, [requestReset]);

  const handleResetConfirm = useCallback(() => {
    confirmReset();
  }, [confirmReset]);

  const handleResetCancel = useCallback(() => {
    cancelReset();
  }, [cancelReset]);

  const handleRemoveBlock = useCallback((index: number) => {
    removeBlock(index);
  }, [removeBlock]);

  const handleClearAllBlocks = useCallback(() => {
    setShowClearBlocksConfirm(true);
  }, []);

  const handleClearAllBlocksConfirm = useCallback(() => {
    clearAllBlocks();
    setShowClearBlocksConfirm(false);
  }, [clearAllBlocks]);

  const handleClearAllBlocksCancel = useCallback(() => {
    setShowClearBlocksConfirm(false);
  }, []);

  const handleStartVisualSelection = useCallback(() => {
    startVisualSelection();
    scheduleSmoothScroll(calendarRef);
  }, [calendarRef, scheduleSmoothScroll, startVisualSelection]);

  const handleActivateCustomMode = useCallback(() => {
    setCustomMode(true);
    scheduleSmoothScroll(customModeRef);
  }, [customModeRef, scheduleSmoothScroll, setCustomMode]);

  const handleCancelCustomMode = useCallback(() => {
    setCustomMode(false);
  }, [setCustomMode]);

  const handleCustomFirstBlockDaysChange = useCallback((days: number) => {
    setCustomFirstBlockDays(days);
  }, [setCustomFirstBlockDays]);

  const handleFocusCalendar = useCallback(() => {
    scheduleSmoothScroll(calendarRef);
    setCalendarHighlight(true);
    if (calendarHighlightTimer.current) {
      clearTimeout(calendarHighlightTimer.current);
    }
    calendarHighlightTimer.current = setTimeout(() => {
      setCalendarHighlight(false);
      calendarHighlightTimer.current = null;
    }, 2500);
  }, [calendarRef, scheduleSmoothScroll]);

  useEffect(() => {
    return () => {
      if (calendarHighlightTimer.current) {
        clearTimeout(calendarHighlightTimer.current);
      }
    };
  }, []);

  const handleCancelVisualSelection = useCallback(() => {
    cancelVisualSelection();
  }, [cancelVisualSelection]);

  const handleShowLegalReferences = useCallback(() => {
    setShowLegalReferences(true);
    scrollToTop(shouldReduce);
  }, [shouldReduce]);

  const handleHideLegalReferences = useCallback(() => {
    setShowLegalReferences(false);
    scrollToTop(shouldReduce);
  }, [shouldReduce]);

  const handleGoToSupplementaryLeave = useCallback(() => {
    hideCelebration();
    scheduleSmoothScroll(supplementaryLeaveRef);
  }, [hideCelebration, scheduleSmoothScroll, supplementaryLeaveRef]);

  const handleGoToLetter = useCallback(() => {
    hideCelebration();
    scheduleSmoothScroll(letterRef);
  }, [hideCelebration, letterRef, scheduleSmoothScroll]);

  useEffect(() => {
    scrollToTop(true);
  }, [showLegalReferences]);

  // Legal references page
  if (showLegalReferences) {
    return (
      <div className="min-h-screen bg-surface-100 text-slate-900 font-sans selection:bg-brand-100 selection:text-brand-900">
        <PageDecoration />
        <a
          href={`#${mainContentId}`}
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-50 bg-brand-600 text-white px-4 py-2 rounded-lg shadow-lg transition-transform"
        >
          Aller directement au contenu principal
        </a>
        <main id={mainContentId} className="py-8 px-4 relative">
          <div className="max-w-5xl mx-auto mb-6">
            <Button
              onClick={handleHideLegalReferences}
              variant="secondary"
              size="sm"
            >
              ← Retour au planificateur
            </Button>
          </div>
          <Suspense fallback={<LazyFallback height="h-[600px]" />}>
            <LegalReferences />
          </Suspense>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-100 flex flex-col font-sans selection:bg-brand-100 selection:text-brand-900 overflow-x-hidden">
      <PageDecoration />

      <a
        href={`#${mainContentId}`}
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-50 bg-brand-600 text-white px-4 py-2 rounded-lg shadow-lg transition-transform"
      >
        Aller directement au contenu principal
      </a>

      <main id={mainContentId} className="flex-1 relative z-10">
        <div className="container mx-auto px-4 sm:px-8 py-6 sm:py-12 max-w-5xl pt-8 sm:pt-24 pb-28 sm:pb-12">
          <div className="space-y-0">
            <HeroHeader hasBirthDate={Boolean(birthDate)} onResetRequest={handleResetRequest} />

            <ScrollIndicator show={birthDate !== null && !hasScrolledPastStart} />

            <NavigationAnchor
              show={birthDate !== null && hasScrolledPastStart}
              showSupplementaryLink={isPaternityPlanComplete && isEligibleForSupplementaryLeave}
            />

            {/* Section: Situation */}
            <div className="reveal max-w-3xl mx-auto mb-12">
              <SectionCard
                title="Votre situation"
                description="Adaptez le calendrier à votre cas spécifique"
                accent="brand"
              >
                <ScenarioSelector selectedScenario={scenarioId} onScenarioChange={handleScenarioChange} />
              </SectionCard>
            </div>

            {/* Section: Progression + Calendrier */}
            <div className="reveal max-w-3xl mx-auto mb-12">
              <ProgressStepper
                currentStep={planningStep}
                fractionableDays={totalFractionableDays}
                scenario={scenario}
              />
              {birthDate && (
                <p className="reveal-subtle mt-4 text-center text-sm font-medium text-slate-400 bg-white/70 backdrop-blur-sm py-2 px-4 rounded-full inline-block mx-auto border border-white/80 shadow-sm">
                  <span className="font-bold text-slate-600">{totalPlannedDays}</span> / {totalFractionableDays} jours planifiés
                </p>
              )}
            </div>

            <div
              ref={calendarRef}
              id="calendar"
              className={`mb-12 max-w-3xl mx-auto scroll-mt-28 relative z-20 rounded-card transition-shadow duration-300 ${calendarHighlight ? 'animate-calendar-focus ring-4 ring-brand-400/60 shadow-[0_0_42px_-16px_rgba(0,113,227,0.4)]' : ''}`}
            >
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
              <CalendarLegend scenario={scenario} />
            </div>

            {/* Section: Next Steps */}
            <div className="reveal max-w-3xl mx-auto mb-12">
              <SectionCard
                title="Prochaines étapes"
                description="Votre guide pour finaliser la demande"
                accent="slate"
              >
                <NextStepsCard
                  planningStep={planningStep}
                  totalPlannedDays={totalPlannedDays}
                  hasBirthDate={Boolean(birthDate)}
                  hasMandatory={Boolean(mandatoryPeriod)}
                  remainingBlocks={remainingBlocks.length}
                  fractionableDays={totalFractionableDays}
                  isEligibleForSupplementaryLeave={isEligibleForSupplementaryLeave}
                  supplementaryLeaveConfigured={supplementaryLeaveConfigured}
                  supplementaryLeaveActivationHint={supplementaryLeaveEligibility.reason}
                  supplementaryLeaveDaysUntilActivation={
                    supplementaryLeaveEligibility.daysUntilActivation
                  }
                  scenario={scenario}
                />
              </SectionCard>
            </div>
          </div>

          {/* Celebration Modal */}
          {showCelebration && (
            <Suspense fallback={null}>
              <CelebrationModal
                show={showCelebration}
                onClose={() => {
                  hideCelebration();
                  schedulePostPlanningScroll();
                }}
                totalFractionableDays={totalFractionableDays}
                scenario={scenario}
                showSupplementaryAction={isEligibleForSupplementaryLeave}
                onGoToSupplementary={handleGoToSupplementaryLeave}
                onGoToLetter={handleGoToLetter}
              />
            </Suspense>
          )}

          {/* Dialogues de confirmation */}
          <ResetConfirmDialog
            open={showResetConfirm}
            onCancel={handleResetCancel}
            onConfirm={handleResetConfirm}
          />

          <ResetConfirmDialog
            open={showScenarioConfirm}
            onCancel={() => cancelScenarioChange()}
            onConfirm={() => confirmScenarioChange()}
            title="Changer de situation ?"
            description="Modifier votre situation (naissance standard, multiples, adoption…) réinitialisera votre planning actuel. Cette action est irréversible."
          />

          <ResetConfirmDialog
            open={showClearBlocksConfirm}
            onCancel={handleClearAllBlocksCancel}
            onConfirm={handleClearAllBlocksConfirm}
            title="Effacer toutes les périodes ?"
            description="Toutes vos périodes planifiées seront supprimées. Votre date de naissance sera conservée."
          />

          {/* Feedback messages */}
          {(error || (successMessage && !visualSelectionMode)) && (
            <div
              key="feedback"
              className="reveal-subtle max-w-3xl mx-auto space-y-4 mb-8 overflow-hidden"
            >
              {error && (
                <FeedbackBanner
                  tone="error"
                  title="Attention"
                  message={error}
                />
              )}

              {successMessage && !visualSelectionMode && (
                <FeedbackBanner
                  tone="success"
                  title="Succès"
                  message={successMessage}
                />
              )}
            </div>
          )}

          {/* Visual selection banner */}
          {visualSelectionMode && selectionStep !== 'idle' && (
            <div
              key="visual-selection-banner"
              className="reveal-subtle fixed inset-x-3 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-40 max-w-[calc(100vw-1.5rem)] sm:max-w-3xl sm:sticky sm:inset-x-auto sm:bottom-auto sm:top-24 sm:z-30 sm:mx-auto sm:mb-6"
            >
              <div className="rounded-card border border-brand-200 bg-white/90 backdrop-blur-xl p-4 sm:p-5 shadow-depth-lg ring-1 ring-black/5">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white flex items-center justify-center font-bold font-display text-lg sm:text-xl shadow-md shadow-brand-500/20">
                      {selectionStep === 'selecting-start' ? '1' : '2'}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base sm:text-lg font-bold text-brand-900 mb-1 font-display">
                      {selectionStep === 'selecting-start'
                        ? 'Sélectionnez le DÉBUT'
                        : 'Sélectionnez la FIN'}
                    </h4>
                    <p className="text-xs sm:text-sm text-brand-700 font-medium">
                      {selectionStep === 'selecting-start'
                        ? 'Cliquez sur la première date de votre période'
                        : 'Cliquez sur la dernière date (min. 5 jours)'}
                    </p>
                    {selectionStartDate && selectionStep === 'selecting-end' && (
                      <div className="mt-2 inline-flex px-3 py-1.5 bg-white rounded-lg text-xs font-bold text-brand-700 shadow-sm border border-brand-100">
                        Début : {selectionStartDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={handleCancelVisualSelection}
                    variant="secondary"
                    size="sm"
                    className="bg-white hover:bg-white shadow-sm"
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            </div>
          )}

          <PlanningModeSelector
            isChoiceVisible={Boolean(birthDate && mandatoryPeriod && remainingBlocks.length === 0 && !customMode)}
            isCustomModeVisible={Boolean(
              birthDate && mandatoryPeriod && remainingBlocks.length === 0 && customMode && !visualSelectionMode
            )}
            isFinalStepVisible={customMode && remainingBlocks.length === 1 && !visualSelectionMode}
            isCoarsePointer={isCoarsePointer}
            planningRef={planningRef}
            customModeRef={customModeRef}
            totalFractionableDays={totalFractionableDays}
            customFirstBlockDays={customFirstBlockDays}
            secondBlockDays={secondBlockDays}
            sliderMax={sliderMax}
            onFocusCalendar={handleFocusCalendar}
            onActivateCustomMode={handleActivateCustomMode}
            onStartVisualSelection={handleStartVisualSelection}
            onCancelCustomMode={handleCancelCustomMode}
            onCustomFirstBlockDaysChange={handleCustomFirstBlockDaysChange}
          />

          {/* Clear all blocks button */}
          {remainingBlocks.length > 0 && (
            <div
              key="clear-all-blocks"
              className="reveal-subtle max-w-3xl mx-auto mb-12 overflow-hidden"
            >
              <Button
                onClick={handleClearAllBlocks}
                variant="outline"
                size="md"
                fullWidth
                className="bg-white/80 backdrop-blur-sm text-slate-500 border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-300 group"
              >
                <Trash2 className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
                Effacer mes périodes
              </Button>
            </div>
          )}

          {/* Supplementary leave */}
          {birthDate && isPaternityPlanComplete && (
            <div
              key="supplementary-leave-card"
              ref={supplementaryLeaveRef}
              id="conge-supplementaire"
              className="reveal-subtle content-auto max-w-3xl mx-auto mb-12 overflow-hidden"
            >
              <Suspense fallback={<LazyFallback height="h-[400px]" />}>
                <SupplementaryLeaveCard
                  enabled={supplementaryLeaveEnabled}
                  duration={supplementaryLeaveDuration}
                  mode={supplementaryLeaveMode}
                  secondStartDate={supplementaryLeaveSecondStartDate}
                  eligibility={supplementaryLeaveEligibility}
                  firstStartDate={supplementaryLeaveFirstStartDate}
                  earliestStartDate={supplementaryLeaveEarliestStartDate}
                  periods={supplementaryLeavePeriods}
                  error={supplementaryLeaveError}
                  scenario={scenario}
                  onEnabledChange={setSupplementaryLeaveEnabled}
                  onDurationChange={setSupplementaryLeaveDuration}
                  onModeChange={setSupplementaryLeaveMode}
                  onFirstStartDateChange={setSupplementaryLeaveFirstStartDate}
                  onSecondStartDateChange={setSupplementaryLeaveSecondStartDate}
                />
              </Suspense>
            </div>
          )}

          {/* Summary */}
          {birthDate && (
            <div
              key="summary"
              className="reveal-subtle content-auto max-w-3xl mx-auto mb-12 overflow-hidden"
              id="summary"
            >
              <Suspense fallback={<LazyFallback height="h-[420px]" />}>
                <Summary
                  birthDate={birthDate}
                  employerPeriod={employerPeriod}
                  mandatoryPeriod={mandatoryPeriod}
                  remainingBlocks={remainingBlocks}
                  onRemoveBlock={handleRemoveBlock}
                  totalFractionableDays={totalFractionableDays}
                  scenario={scenario}
                  supplementaryLeavePeriods={supplementaryLeavePeriods}
                  supplementaryLeaveDuration={supplementaryLeaveDuration}
                  supplementaryLeaveMode={supplementaryLeaveMode}
                />
              </Suspense>
            </div>
          )}

          {/* Letter generator */}
          {birthDate && mandatoryPeriod && (
            <div
              key="letter-generator"
              ref={letterRef}
              className="reveal-subtle content-auto max-w-3xl mx-auto mb-12 overflow-hidden"
              id="letter"
            >
              <Suspense fallback={<LazyFallback height="h-[600px]" />}>
                <LetterGenerator
                  birthDate={birthDate}
                  employerPeriod={employerPeriod}
                  mandatoryPeriod={mandatoryPeriod}
                  remainingBlocks={remainingBlocks}
                  scenario={scenario}
                  supplementaryLeavePeriods={supplementaryLeavePeriods}
                  supplementaryLeaveDuration={supplementaryLeaveDuration}
                  supplementaryLeaveMode={supplementaryLeaveMode}
                />
              </Suspense>
            </div>
          )}

          <div className="content-auto mt-16 sm:mt-24 max-w-3xl mx-auto mb-16" id="legal">
            <Suspense fallback={<LazyFallback height="h-40" />}>
              <LegalInfo onShowLegalReferences={handleShowLegalReferences} />
            </Suspense>
          </div>
        </div>
      </main>

      <footer className="bg-white/80 backdrop-blur-xl border-t border-slate-100 py-8 sm:py-10 relative z-10 mt-auto">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center text-center gap-6">
          {/* Logo & Tagline */}
          <div>
            <p className="text-slate-900 font-bold font-display text-lg">
              Congé Paternité
            </p>
            <p className="text-sm text-slate-500 font-medium">
              Simplifiez vos démarches administratives.
            </p>
          </div>

          {/* Signature Badge */}
          <div className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-full border border-slate-100 shadow-md transition-all duration-300 hover:bg-white hover:shadow-lg">
            <span className="text-xs text-slate-500 font-medium">Créé par</span>
            <a
              href="https://www.linkedin.com/in/hedi-a-2382551a1/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center gap-1.5 text-xs font-bold text-slate-800 transition-colors hover:text-brand-600"
            >
              <Linkedin className="w-3.5 h-3.5 text-[#0A66C2]" aria-hidden="true" />
              Hedi ACHACHE
            </a>
          </div>

          {/* Copyright & Back to top */}
          <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
            <span>© {currentYear}</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" aria-hidden="true" />
            <button
              onClick={() => scrollToTop(shouldReduce)}
              className="inline-flex min-h-11 items-center px-2 transition-all duration-200 hover:text-brand-600 hover:scale-105"
            >
              Remonter ↑
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
