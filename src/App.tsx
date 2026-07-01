import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Linkedin, Trash2 } from 'lucide-react';
import { useMediaQuery } from './hooks/useMediaQuery';
import { useScrollOrchestrator } from './hooks/useScrollOrchestrator';
import { Calendar } from './components/Calendar';
import { Summary } from './components/Summary';
import { LegalInfo } from './components/LegalInfo';
import { ScrollIndicator } from './components/ScrollIndicator';
import { FeedbackBanner } from './components/FeedbackBanner';
import { ProgressStepper } from './components/ProgressStepper';
import { CalendarLegend } from './components/CalendarLegend';
import { SectionCard } from './components/SectionCard';
import { NextStepsCard } from './components/NextStepsCard';
import { NavigationAnchor } from './components/NavigationAnchor';
import { PostPlanningNavBar } from './components/PostPlanningNavBar';
import { ScenarioSelector } from './components/ScenarioSelector';
import { Button } from './components/Button';
import { ResetConfirmDialog } from './components/ResetConfirmDialog';
import { HeroHeader } from './components/HeroHeader';
import { PlanningModeSelector } from './components/PlanningModeSelector';
import { usePaternityPlanning } from './hooks/usePaternityPlanning';
import { expandIn, fadeIn, fadeInUp, staggerContainer, useAppMotion } from './lib/motion';

// Lazy-loaded components (non-critiques pour l'affichage initial)
const LetterGenerator = lazy(() => import('./components/LetterGenerator').then(m => ({ default: m.LetterGenerator })));
const LegalReferences = lazy(() => import('./components/LegalReferences').then(m => ({ default: m.LegalReferences })));
const SupplementaryLeaveCard = lazy(() => import('./components/SupplementaryLeaveCard').then(m => ({ default: m.SupplementaryLeaveCard })));
const CelebrationModal = lazy(() => import('./components/CelebrationModal').then(m => ({ default: m.CelebrationModal })));

/** Skeleton de chargement pour les composants lazy */
function LazyFallback({ height = 'h-64' }: { height?: string }) {
  return (
    <div className={`${height} rounded-2xl sm:rounded-[1.5rem] bg-white/60 border border-slate-200 animate-pulse flex items-center justify-center`}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-200" />
        <div className="w-32 h-3 rounded-full bg-slate-200" />
      </div>
    </div>
  );
}

function App() {
  const [showLegalReferences, setShowLegalReferences] = useState(false);
  const [showClearBlocksConfirm, setShowClearBlocksConfirm] = useState(false);
  const [calendarHighlight, setCalendarHighlight] = useState(false);
  const calendarHighlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isCoarsePointer = useMediaQuery('(pointer: coarse)');
  const { shouldReduce, transition } = useAppMotion();
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
    supplementaryLeaveSecondStartDate,
    supplementaryLeaveEligibility,
    supplementaryLeaveStartDate,
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
    setScenarioId,
    handleScenarioChange,
    confirmScenarioChange,
    cancelScenarioChange,
    setCustomMode,
    setCustomFirstBlockDays,
    setSupplementaryLeaveEnabled,
    setSupplementaryLeaveDuration,
    setSupplementaryLeaveMode,
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
    setShowClearBlocksConfirm(true);
  };

  const handleClearAllBlocksConfirm = () => {
    clearAllBlocks();
    setShowClearBlocksConfirm(false);
  };

  const handleClearAllBlocksCancel = () => {
    setShowClearBlocksConfirm(false);
  };

  const handleStartVisualSelection = () => {
    startVisualSelection();
    scheduleSmoothScroll(calendarRef);
  };

  const handleActivateCustomMode = () => {
    setCustomMode(true);
    scheduleSmoothScroll(customModeRef);
  };

  const handleCancelCustomMode = () => {
    setCustomMode(false);
  };

  const handleCustomFirstBlockDaysChange = (days: number) => {
    setCustomFirstBlockDays(days);
  };

  const handleFocusCalendar = () => {
    scheduleSmoothScroll(calendarRef);
    setCalendarHighlight(true);
    if (calendarHighlightTimer.current) {
      clearTimeout(calendarHighlightTimer.current);
    }
    calendarHighlightTimer.current = setTimeout(() => {
      setCalendarHighlight(false);
      calendarHighlightTimer.current = null;
    }, 2500);
  };

  useEffect(() => {
    return () => {
      if (calendarHighlightTimer.current) {
        clearTimeout(calendarHighlightTimer.current);
      }
    };
  }, []);

  const handleCancelVisualSelection = () => {
    cancelVisualSelection();
  };

  const handleShowLegalReferences = () => {
    setShowLegalReferences(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHideLegalReferences = () => {
    setShowLegalReferences(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToSupplementaryLeave = () => {
    hideCelebration();
    scheduleSmoothScroll(supplementaryLeaveRef);
  };

  const handleGoToLetter = () => {
    hideCelebration();
    scheduleSmoothScroll(letterRef);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [showLegalReferences]);

  // If showing legal references, render that view instead
  if (showLegalReferences) {
    return (
      <div className="min-h-screen bg-surface-100 text-slate-900 font-sans selection:bg-brand-100 selection:text-brand-900">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-50"></div>
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
      <a
        href={`#${mainContentId}`}
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-50 bg-brand-600 text-white px-4 py-2 rounded-lg shadow-lg transition-transform"
      >
        Aller directement au contenu principal
      </a>

      <main id={mainContentId} className="flex-1 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-12 max-w-5xl pt-8 sm:pt-24 pb-28 sm:pb-12">
          <motion.div
            className="space-y-0"
            initial="hidden"
            animate="visible"
            variants={staggerContainer(shouldReduce ? 0 : 0.08)}
          >
            <HeroHeader hasBirthDate={Boolean(birthDate)} onResetRequest={handleResetRequest} />

            <ScrollIndicator show={birthDate !== null} />

            <NavigationAnchor
              show={birthDate !== null && hasScrolledPastStart}
              showSupplementaryLink={isPaternityPlanComplete && isEligibleForSupplementaryLeave}
            />

            <motion.div
              className="max-w-3xl mx-auto mb-8 sm:mb-12"
              variants={fadeInUp}
              transition={transition}
            >
              <SectionCard
                title="Votre situation"
                description="Adaptez le calendrier à votre cas spécifique"
                accent="brand"
              >
                <ScenarioSelector selectedScenario={scenarioId} onScenarioChange={handleScenarioChange} />
              </SectionCard>
            </motion.div>

            <motion.div className="max-w-3xl mx-auto mb-8 sm:mb-12" variants={fadeInUp} transition={transition}>
              <ProgressStepper
                currentStep={planningStep}
                fractionableDays={totalFractionableDays}
                scenario={scenario}
              />
              <AnimatePresence>
                {birthDate && (
                  <motion.p
                    className="mt-4 text-center text-sm font-medium text-slate-500 bg-white/50 py-2 px-4 rounded-full inline-block mx-auto border border-white shadow-sm backdrop-blur-sm"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={fadeIn}
                    transition={transition}
                  >
                    {totalPlannedDays} / {totalFractionableDays} jours planifiés
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              ref={calendarRef}
              id="calendar"
              className={`mb-8 sm:mb-12 max-w-3xl -mx-4 sm:mx-auto scroll-mt-28 relative z-20 rounded-2xl sm:rounded-[2rem] transition-shadow duration-300 ${calendarHighlight ? 'animate-calendar-focus ring-4 ring-brand-400/60 shadow-[0_0_42px_-16px_rgba(0,113,227,0.4)]' : ''}`}
              variants={fadeInUp}
              transition={transition}
            >
              <div className="absolute inset-0 -z-10 hidden bg-brand-500/5 blur-3xl rounded-[2rem] transform scale-105 sm:block"></div>
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
            </motion.div>

            <motion.div
              className="max-w-3xl mx-auto mb-12"
              variants={fadeInUp}
              transition={transition}
            >
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
            </motion.div>
          </motion.div>

        <Suspense fallback={<LazyFallback height="h-48" />}>
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

        <AnimatePresence>
          {(error || (successMessage && !visualSelectionMode)) && (
            <motion.div
              key="feedback"
              className="max-w-3xl mx-auto space-y-4 mb-8 overflow-hidden"
              initial={isCoarsePointer ? false : 'hidden'}
              animate="visible"
              exit="hidden"
              variants={expandIn}
              transition={transition}
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bannière d'instruction pour le mode sélection visuelle */}
        <AnimatePresence>
          {visualSelectionMode && selectionStep !== 'idle' && (
            <motion.div
              key="visual-selection-banner"
              className="mb-6 max-w-3xl mx-auto sticky top-4 sm:top-24 z-30 overflow-hidden"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={expandIn}
              transition={transition}
            >
              <div className="rounded-2xl border border-brand-200 bg-white/95 backdrop-blur-xl p-4 sm:p-5 shadow-lg shadow-brand-900/5 ring-1 ring-black/5">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand-500 text-white flex items-center justify-center font-bold font-display text-lg sm:text-xl shadow-md shadow-brand-500/20">
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
                        : `Cliquez sur la dernière date (min. 5 jours)`}
                    </p>
                    {selectionStartDate && selectionStep === 'selecting-end' && (
                      <div className="mt-2 inline-flex px-3 py-1 bg-white rounded-lg text-xs font-bold text-brand-700 shadow-sm border border-brand-100">
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
            </motion.div>
          )}
        </AnimatePresence>

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

        {/* Bouton Effacer tous les blocs */}
        <AnimatePresence>
          {remainingBlocks.length > 0 && (
            <motion.div
              key="clear-all-blocks"
              className="max-w-3xl mx-auto mb-12 overflow-hidden"
              initial={isCoarsePointer ? false : 'hidden'}
              animate="visible"
              exit="hidden"
              variants={expandIn}
              transition={transition}
            >
              <Button
                onClick={handleClearAllBlocks}
                variant="outline"
                size="md"
                fullWidth
                className="bg-white text-slate-500 border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors group"
              >
                <Trash2 className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                Effacer mes périodes
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isPaternityPlanComplete && (
            <motion.div
              key="post-planning-nav"
              className="overflow-hidden"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={expandIn}
              transition={transition}
            >
              <PostPlanningNavBar showSupplementaryLink={isEligibleForSupplementaryLeave} />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {birthDate && isPaternityPlanComplete && (
            <motion.div
              key="supplementary-leave-card"
              ref={supplementaryLeaveRef}
              id="conge-supplementaire"
              className="max-w-3xl mx-auto mb-12 overflow-hidden"
              initial={isCoarsePointer ? false : 'hidden'}
              animate="visible"
              exit="hidden"
              variants={expandIn}
              transition={transition}
            >
              <Suspense fallback={<LazyFallback height="h-[400px]" />}>
                <SupplementaryLeaveCard
                  enabled={supplementaryLeaveEnabled}
                  duration={supplementaryLeaveDuration}
                  mode={supplementaryLeaveMode}
                  secondStartDate={supplementaryLeaveSecondStartDate}
                  eligibility={supplementaryLeaveEligibility}
                  startDate={supplementaryLeaveStartDate}
                  periods={supplementaryLeavePeriods}
                  error={supplementaryLeaveError}
                  scenario={scenario}
                  onEnabledChange={setSupplementaryLeaveEnabled}
                  onDurationChange={setSupplementaryLeaveDuration}
                  onModeChange={setSupplementaryLeaveMode}
                  onSecondStartDateChange={setSupplementaryLeaveSecondStartDate}
                />
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {birthDate && (
            <motion.div
              key="summary"
              className="max-w-3xl mx-auto mb-12 overflow-hidden"
              id="summary"
              initial={isCoarsePointer ? false : 'hidden'}
              animate="visible"
              exit="hidden"
              variants={expandIn}
              transition={transition}
            >
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
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {birthDate && mandatoryPeriod && (
            <motion.div
              key="letter-generator"
              ref={letterRef}
              className="max-w-3xl mx-auto mb-12 overflow-hidden"
              id="letter"
              initial={isCoarsePointer ? false : 'hidden'}
              animate="visible"
              exit="hidden"
              variants={expandIn}
              transition={{ ...transition, delay: shouldReduce || isCoarsePointer ? 0 : 0.15 }}
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
            </motion.div>
          )}
        </AnimatePresence>

          <div className="mt-24 max-w-3xl mx-auto mb-16" id="legal">
            <LegalInfo onShowLegalReferences={handleShowLegalReferences} />
          </div>
        </div>
      </main>
      <footer className="bg-white border-t border-slate-100 py-8 relative z-10">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center text-center gap-6">
          
          {/* Logo & Tagline */}
          <div>
            <p className="text-slate-900 font-bold font-display text-lg">
              Congé Paternité
            </p>
            <p className="text-sm text-slate-500">
              Simplifiez vos démarches administratives.
            </p>
          </div>

          {/* Signature Badge */}
          <div className="flex items-center gap-2 px-5 py-2 bg-slate-50 rounded-full border border-slate-100 shadow-sm transition-transform hover:scale-105 hover:bg-white">
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
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex min-h-11 items-center px-2 transition-colors hover:text-brand-600"
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
