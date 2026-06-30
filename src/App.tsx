import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Linkedin, Trash2 } from 'lucide-react';
import { useMediaQuery } from './hooks/useMediaQuery';
import { useScrollOrchestrator } from './hooks/useScrollOrchestrator';
import { Calendar } from './components/Calendar';
import { Summary } from './components/Summary';
import { LegalInfo } from './components/LegalInfo';
import { LegalReferences } from './components/LegalReferences';
import { LetterGenerator } from './components/LetterGenerator';
import { ScrollIndicator } from './components/ScrollIndicator';
import { CelebrationModal } from './components/CelebrationModal';
import { FeedbackBanner } from './components/FeedbackBanner';
import { ProgressStepper } from './components/ProgressStepper';
import { CalendarLegend } from './components/CalendarLegend';
import { SectionCard } from './components/SectionCard';
import { NextStepsCard } from './components/NextStepsCard';
import { NavigationAnchor } from './components/NavigationAnchor';
import { PostPlanningNavBar } from './components/PostPlanningNavBar';
import { ScenarioSelector } from './components/ScenarioSelector';
import { SupplementaryLeaveCard } from './components/SupplementaryLeaveCard';
import { Button } from './components/Button';
import { ResetConfirmDialog } from './components/ResetConfirmDialog';
import { HeroHeader } from './components/HeroHeader';
import { PlanningModeSelector } from './components/PlanningModeSelector';
import { usePaternityPlanning } from './hooks/usePaternityPlanning';
import { fadeIn, fadeInUp, staggerContainer, useAppMotion } from './lib/motion';

function App() {
  const [showLegalReferences, setShowLegalReferences] = useState(false);
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
    supplementaryLeavePrematureExpectedAfterMinDate,
    supplementaryLeaveEligibility,
    supplementaryLeaveStartInfo,
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
    setCustomMode,
    setCustomFirstBlockDays,
    setSupplementaryLeaveEnabled,
    setSupplementaryLeavePrematureExpectedAfterMinDate,
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
  const showSupplementarySetup =
    isEligibleForSupplementaryLeave || supplementaryLeaveEligibility.isPrematureBirthBefore2026;
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
    clearAllBlocks();
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

  const handleCancelVisualSelection = () => {
    cancelVisualSelection();
  };

  const handleShowLegalReferences = () => {
    setShowLegalReferences(true);
    window.scrollTo({ top: 0, behavior: shouldReduce ? 'auto' : 'smooth' });
  };

  const handleHideLegalReferences = () => {
    setShowLegalReferences(false);
    window.scrollTo({ top: 0, behavior: shouldReduce ? 'auto' : 'smooth' });
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
          <LegalReferences />
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
        <div className="container mx-auto max-w-[1120px] px-4 py-5 pt-5 pb-[calc(8rem+env(safe-area-inset-bottom))] sm:px-6 sm:py-8 sm:pt-14 sm:pb-12">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer(shouldReduce ? 0 : 0.08)}
          >
            <HeroHeader hasBirthDate={Boolean(birthDate)} onResetRequest={handleResetRequest} />

            <ScrollIndicator show={birthDate !== null} />

            <NavigationAnchor
              show={birthDate !== null && hasScrolledPastStart && !showCelebration}
              showSupplementaryLink={isPaternityPlanComplete && showSupplementarySetup}
            />

            <div className="mx-auto mb-8 grid max-w-[1080px] items-start gap-4 sm:mb-12 sm:gap-5 lg:grid-cols-[minmax(280px,320px)_minmax(0,1fr)] lg:gap-7">
              <motion.div
                className="min-w-0 lg:sticky lg:top-24"
                variants={fadeInUp}
                transition={transition}
              >
                <SectionCard
                  title="Votre situation"
                  description="Choisissez le cas qui correspond à votre demande."
                  accent="brand"
                >
                  <ScenarioSelector selectedScenario={scenarioId} onScenarioChange={setScenarioId} />
                </SectionCard>
              </motion.div>

              <div className="min-w-0 space-y-5 sm:space-y-6">
                <motion.div className="mx-auto max-w-[720px] lg:mx-0" variants={fadeInUp} transition={transition}>
                  <ProgressStepper
                    currentStep={planningStep}
                    fractionableDays={totalFractionableDays}
                    scenario={scenario}
                  />
                  <AnimatePresence>
                    {birthDate && (
                      <motion.p
                        className="mt-3 inline-block rounded-full border border-slate-200 bg-white px-4 py-2 text-center text-sm font-medium text-slate-500 shadow-sm"
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
                  className="relative z-20 mx-auto max-w-[720px] scroll-mt-28 rounded-[18px] lg:mx-0"
                  variants={fadeInUp}
                  transition={transition}
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
                </motion.div>
              </div>
            </div>

            <motion.div
              className="mx-auto mb-12 max-w-[880px]"
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

        <CelebrationModal
          show={showCelebration}
          onClose={() => {
            hideCelebration();
            schedulePostPlanningScroll();
          }}
          totalFractionableDays={totalFractionableDays}
          scenario={scenario}
          showSupplementaryAction={showSupplementarySetup}
          onGoToSupplementary={handleGoToSupplementaryLeave}
          onGoToLetter={handleGoToLetter}
        />

        <ResetConfirmDialog
          open={showResetConfirm}
          onCancel={handleResetCancel}
          onConfirm={handleResetConfirm}
        />

        <AnimatePresence>
          {(error || (successMessage && !visualSelectionMode)) && (
            <motion.div
              key="feedback"
              className="mx-auto mt-6 mb-8 max-w-4xl space-y-4 sm:mt-8"
              initial={isCoarsePointer ? false : 'hidden'}
              animate="visible"
              exit="hidden"
              variants={fadeIn}
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
              className="sticky top-4 z-30 mx-auto mb-6 max-w-4xl sm:top-24"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={fadeInUp}
              transition={transition}
            >
              <div className="rounded-[18px] border border-brand-200 bg-white/95 p-4 shadow-card backdrop-blur sm:p-5">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-lg font-bold text-white shadow-sm sm:h-12 sm:w-12 sm:text-xl">
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
              className="mx-auto mb-12 max-w-4xl"
              initial={isCoarsePointer ? false : 'hidden'}
              animate="visible"
              exit="hidden"
              variants={fadeIn}
              transition={transition}
            >
              <Button
                onClick={handleClearAllBlocks}
                variant="outline"
                size="md"
                fullWidth
                className="bg-white text-slate-500 border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors group"
              >
                <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
                Recommencer la planification
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isPaternityPlanComplete && !isCoarsePointer && (
            <motion.div
              key="post-planning-nav"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={fadeIn}
              transition={transition}
            >
              <PostPlanningNavBar showSupplementaryLink={showSupplementarySetup} />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {birthDate && isPaternityPlanComplete && (
            <motion.div
              key="supplementary-leave-card"
              id="conge-supplementaire"
              className="mx-auto mb-12 max-w-4xl"
              initial={isCoarsePointer ? false : 'hidden'}
              animate="visible"
              exit="hidden"
              variants={fadeIn}
              transition={transition}
            >
              <div ref={supplementaryLeaveRef}>
                <SupplementaryLeaveCard
                  enabled={supplementaryLeaveEnabled}
                  duration={supplementaryLeaveDuration}
                  mode={supplementaryLeaveMode}
                  firstStartDate={supplementaryLeaveFirstStartDate}
                  secondStartDate={supplementaryLeaveSecondStartDate}
                  prematureExpectedAfterMinDate={supplementaryLeavePrematureExpectedAfterMinDate}
                  eligibility={supplementaryLeaveEligibility}
                  startInfo={supplementaryLeaveStartInfo}
                  startDate={supplementaryLeaveStartDate}
                  periods={supplementaryLeavePeriods}
                  error={supplementaryLeaveError}
                  scenario={scenario}
                  onEnabledChange={setSupplementaryLeaveEnabled}
                  onPrematureExpectedAfterMinDateChange={setSupplementaryLeavePrematureExpectedAfterMinDate}
                  onDurationChange={setSupplementaryLeaveDuration}
                  onModeChange={setSupplementaryLeaveMode}
                  onFirstStartDateChange={setSupplementaryLeaveFirstStartDate}
                  onSecondStartDateChange={setSupplementaryLeaveSecondStartDate}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {birthDate && (
            <motion.div
              key="summary"
              className="mx-auto mb-12 max-w-4xl"
              id="summary"
              initial={isCoarsePointer ? false : 'hidden'}
              animate="visible"
              exit="hidden"
              variants={fadeIn}
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
              className="mx-auto mb-12 max-w-4xl"
              id="letter"
              initial={isCoarsePointer ? false : 'hidden'}
              animate="visible"
              exit="hidden"
              variants={fadeIn}
              transition={{ ...transition, delay: shouldReduce || isCoarsePointer ? 0 : 0.15 }}
            >
              <div ref={letterRef}>
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>

          <div className="mx-auto mt-24 mb-16 max-w-4xl" id="legal">
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
          <div className="flex items-center gap-2 px-5 py-2 bg-slate-50 rounded-full border border-slate-100 shadow-sm transition-colors duration-200 hover:bg-white">
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
              onClick={() => window.scrollTo({ top: 0, behavior: shouldReduce ? 'auto' : 'smooth' })}
              className="inline-flex min-h-10 items-center px-2 transition-colors hover:text-brand-600"
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
