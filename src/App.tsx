import { useEffect, useRef, useState } from 'react';
import {
  ArrowUp,
  CalendarDays as CalendarDaysIcon,
  Linkedin,
  MousePointer2,
  Settings2,
  SlidersHorizontal,
  Star,
  Trash2,
  Zap
} from 'lucide-react';
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
import { AuroraBackground } from './components/AuroraBackground';
import { ResetConfirmDialog } from './components/ResetConfirmDialog';
import { HeroHeader } from './components/HeroHeader';
import { usePaternityPlanning } from './hooks/usePaternityPlanning';

function App() {
  const [showLegalReferences, setShowLegalReferences] = useState(false);
  const [calendarHighlight, setCalendarHighlight] = useState(false);
  const calendarHighlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
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
    clearAllBlocks();
  };

  const handleStartVisualSelection = () => {
    startVisualSelection();
    scheduleSmoothScroll(calendarRef);
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
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-brand-100 selection:text-brand-900">
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-brand-100 selection:text-brand-900 overflow-x-hidden">
      <AuroraBackground />

      <a
        href={`#${mainContentId}`}
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-50 bg-brand-600 text-white px-4 py-2 rounded-lg shadow-lg transition-transform"
      >
        Aller directement au contenu principal
      </a>

      <main id={mainContentId} className="flex-1 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-5xl pt-20 sm:pt-24 pb-20 md:pb-12">
          <HeroHeader hasBirthDate={Boolean(birthDate)} onResetRequest={handleResetRequest} />

          <ScrollIndicator show={birthDate !== null} />

          <NavigationAnchor
            show={birthDate !== null && hasScrolledPastStart}
            showSupplementaryLink={isPaternityPlanComplete && isEligibleForSupplementaryLeave}
          />

          <div className="max-w-3xl mx-auto mb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <SectionCard
              title="Votre situation"
              description="Adaptez le calendrier à votre cas spécifique"
              accent="brand"
            >
              <ScenarioSelector selectedScenario={scenarioId} onScenarioChange={setScenarioId} />
            </SectionCard>
          </div>

          <div className="max-w-3xl mx-auto mb-12">
            <ProgressStepper
              currentStep={planningStep}
              fractionableDays={totalFractionableDays}
              scenario={scenario}
            />
            {birthDate && (
              <p className="mt-4 text-center text-sm font-medium text-slate-500 bg-white/50 py-2 px-4 rounded-full inline-block mx-auto border border-white shadow-sm backdrop-blur-sm">
                {totalPlannedDays} / {totalFractionableDays} jours planifiés
              </p>
            )}
          </div>

          <div className="max-w-3xl mx-auto mb-12">
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

        <ResetConfirmDialog
          open={showResetConfirm}
          onCancel={handleResetCancel}
          onConfirm={handleResetConfirm}
        />

        {(error || (successMessage && !visualSelectionMode)) && (
          <div className={`max-w-3xl mx-auto space-y-4 mb-8 ${isCoarsePointer ? '' : 'animate-fade-in'}`}>
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

        {/* Bannière d'instruction pour le mode sélection visuelle */}
        {visualSelectionMode && selectionStep !== 'idle' && (
          <div className="mb-6 max-w-3xl mx-auto animate-fade-in-up sticky top-24 z-30">
            <div className="rounded-2xl border border-brand-200 bg-white/90 backdrop-blur-xl p-5 shadow-2xl shadow-brand-900/10 ring-1 ring-black/5">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-brand-500 text-white flex items-center justify-center font-bold font-display text-xl shadow-lg shadow-brand-500/30">
                    {selectionStep === 'selecting-start' ? '1' : '2'}
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-brand-900 mb-1 font-display">
                    {selectionStep === 'selecting-start'
                      ? 'Sélectionnez le DÉBUT'
                      : 'Sélectionnez la FIN'}
                  </h4>
                  <p className="text-sm text-brand-700 font-medium">
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
          </div>
        )}

        <div
          ref={calendarRef}
          id="calendar"
          className={`mb-8 sm:mb-12 max-w-3xl mx-auto scroll-mt-28 relative z-20 rounded-[3rem] transition-shadow duration-500 ${calendarHighlight ? 'animate-calendar-focus ring-4 ring-brand-400/60 shadow-[0_0_60px_-10px_rgba(2,132,199,0.45)]' : ''}`}
        >
           {/* Glow effect behind calendar */}
           <div className="absolute inset-0 -z-10 bg-brand-500/5 blur-3xl rounded-[3rem] transform scale-105"></div>
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

        {birthDate && mandatoryPeriod && remainingBlocks.length === 0 && !customMode && (
          <div ref={planningRef} className={`max-w-3xl mx-auto mb-8 sm:mb-12 ${isCoarsePointer ? '' : 'animate-fade-in'} scroll-mt-28`}>
            <div className={`premium-card p-6 sm:p-8 ${isCoarsePointer ? '' : 'transition-all duration-500'}`}>
              <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 mb-4 shadow-inner">
                  <CalendarDaysIcon className="h-8 w-8" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold font-display text-slate-900 mb-2">
                  Planifiez vos {totalFractionableDays} jours
                </h3>
                <p className="text-slate-500 text-lg max-w-md mx-auto leading-relaxed">
                  Deux modes au choix selon vos préférences.
                </p>
              </div>

              <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
                {/* Mode simple (recommandé) */}
                <div className="relative flex flex-col rounded-2xl border-2 border-brand-200 bg-gradient-to-br from-brand-50/80 to-white p-6 shadow-lg shadow-brand-500/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-500/20">
                  <span className="absolute -top-3 left-6 inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md shadow-brand-500/30">
                    <Star className="h-3 w-3" aria-hidden="true" />
                    Recommandé
                  </span>

                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white shadow-md shadow-brand-500/30">
                      <Zap className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold font-display text-slate-900">Mode simple</h4>
                      <p className="text-xs font-bold uppercase tracking-wider text-brand-600">
                        1 clic = {totalFractionableDays} jours
                      </p>
                    </div>
                  </div>

                  <div className="mb-5 rounded-xl border border-brand-100 bg-white/80 p-4 shadow-sm">
                    <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Période unique
                    </p>
                    <div className="flex h-12 items-center justify-center rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 text-sm font-bold text-white shadow-inner">
                      {totalFractionableDays} jours consécutifs
                    </div>
                  </div>

                  <p className="mb-5 flex-1 text-sm leading-relaxed text-slate-600">
                    Cliquez sur une date dans le calendrier ci-dessus, vos {totalFractionableDays} jours
                    se placent automatiquement à la suite.
                  </p>

                  <Button
                    onClick={handleFocusCalendar}
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
                <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700 shadow-sm">
                      <Settings2 className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold font-display text-slate-900">Mode personnalisé</h4>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        2 périodes ajustables
                      </p>
                    </div>
                  </div>

                  <div className="mb-5 rounded-xl border border-slate-100 bg-slate-50/80 p-4 shadow-sm">
                    <div className="mb-2 flex gap-2 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <span className="flex-1">Période 1</span>
                      <span className="flex-1">Période 2</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex h-12 flex-1 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-bold text-slate-700">
                        {customFirstBlockDays}j
                      </div>
                      <div className="flex h-12 flex-1 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-bold text-slate-700">
                        {secondBlockDays}j
                      </div>
                    </div>
                  </div>

                  <p className="mb-5 flex-1 text-sm leading-relaxed text-slate-600">
                    Définissez vous-même la durée de chaque période (minimum 5 jours par bloc).
                  </p>

                  <Button
                    onClick={() => {
                      setCustomMode(true);
                      scheduleSmoothScroll(customModeRef);
                    }}
                    variant="secondary"
                    size="md"
                    fullWidth
                  >
                    Activer le mode personnalisé
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mode personnalisé actif */}
        {birthDate && mandatoryPeriod && remainingBlocks.length === 0 && customMode && !visualSelectionMode && (
          <div ref={customModeRef} className="max-w-3xl mx-auto mb-8 sm:mb-12 animate-fade-in-up scroll-mt-28">
            <div className="premium-card p-6 sm:p-8">
              <div className="flex items-start gap-5 mb-8">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white flex items-center justify-center text-3xl shadow-lg shadow-brand-600/30">
                    <Settings2 className="h-8 w-8" aria-hidden="true" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold font-display text-slate-900 mb-2">
                    Mode personnalisé
                  </h3>
                  <p className="text-lg text-slate-500 font-medium">
                    Choisissez votre méthode de sélection
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
                {/* Option 1 : Avec Slider */}
                <div className="bg-slate-50/80 rounded-3xl p-6 border border-slate-100 hover:border-brand-200 hover:bg-white hover:shadow-md transition-all group backdrop-blur-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white text-slate-700 border border-slate-200 flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform">
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

                {/* Option 2 : Sélection visuelle */}
                <div className="bg-slate-50/80 rounded-3xl p-6 border border-slate-100 hover:border-brand-200 hover:bg-white hover:shadow-md transition-all group relative overflow-hidden backdrop-blur-sm">
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform">
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
                      onClick={handleStartVisualSelection}
                      variant="primary"
                      size="sm"
                      fullWidth
                      className="shadow-none"
                    >
                      Commencer
                    </Button>
                  </div>
                </div>
              </div>

              {/* Slider personnalisé */}
              <div className="bg-slate-50/50 rounded-3xl p-6 sm:p-8 mb-6 border border-slate-100 backdrop-blur-sm">
                <div className="text-center mb-8">
                  <p className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">
                    Répartition des jours
                  </p>
                  <div className="flex gap-4 justify-center items-center">
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/20 flex items-center justify-center text-3xl font-bold font-display mb-2">
                        {customFirstBlockDays}
                      </div>
                      <span className="text-xs font-bold text-brand-700 uppercase">Période 1</span>
                    </div>
                    <div className="text-2xl text-slate-300 font-light">+</div>
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 flex items-center justify-center text-3xl font-bold font-display mb-2">
                        {secondBlockDays}
                      </div>
                      <span className="text-xs font-bold text-emerald-600 uppercase">Période 2</span>
                    </div>
                  </div>
                </div>

                {/* Barre visuelle */}
                <div className="h-4 bg-slate-200 rounded-full overflow-hidden mb-6 flex">
                  <div
                    className="h-full bg-brand-500 transition-all duration-300 ease-out"
                    style={{ width: `${(customFirstBlockDays / totalFractionableDays) * 100}%` }}
                  />
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300 ease-out"
                    style={{ width: `${(secondBlockDays / totalFractionableDays) * 100}%` }}
                  />
                </div>

                {/* Slider */}
                <div className="relative h-12 flex items-center">
                  <input
                    type="range"
                    min="5"
                    max={sliderMax}
                    value={customFirstBlockDays}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomFirstBlockDays(Number(e.target.value))}
                    className="w-full absolute z-20 opacity-0 cursor-pointer h-full"
                  />
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                     <div
                        className="h-full bg-slate-300"
                        style={{ width: `${((customFirstBlockDays - 5) / (sliderMax - 5)) * 100}%` }}
                     />
                  </div>
                  <div
                    className="absolute h-8 w-8 bg-white border-4 border-brand-500 rounded-full shadow-lg pointer-events-none transition-all duration-75"
                    style={{ left: `calc(${((customFirstBlockDays - 5) / (sliderMax - 5)) * 100}% - 16px)` }}
                  />
                </div>
                <p className="text-xs text-center text-slate-400 font-medium mt-2">
                  Glissez pour ajuster (min. 5 jours par période)
                </p>
              </div>

              <Button
                onClick={() => setCustomMode(false)}
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


        {/* Message pendant le placement personnalisé */}
        {customMode && remainingBlocks.length === 1 && !visualSelectionMode && (
          <div className="max-w-3xl mx-auto mb-8 sm:mb-12 animate-fade-in-up sticky top-24 z-30">
             <div className="rounded-2xl border border-emerald-200 bg-emerald-50/90 backdrop-blur-md p-5 shadow-2xl shadow-emerald-500/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold font-display text-xl shadow-lg shadow-emerald-500/30 flex-shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-emerald-900 mb-1 font-display">
                    Dernière étape
                  </h4>
                  <p className="text-emerald-800 font-medium">
                    Cliquez sur une date pour placer les <span className="font-bold">{secondBlockDays} jours restants</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bouton Effacer tous les blocs */}
        {remainingBlocks.length > 0 && (
          <div className={`max-w-3xl mx-auto mb-12 ${isCoarsePointer ? '' : 'animate-fade-in'}`}>
            <Button
              onClick={handleClearAllBlocks}
              variant="outline"
              size="md"
              fullWidth
              className="bg-white text-slate-500 border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors group"
            >
              <Trash2 className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
              Recommencer la planification
            </Button>
          </div>
        )}

        {isPaternityPlanComplete && (
          <PostPlanningNavBar showSupplementaryLink={isEligibleForSupplementaryLeave} />
        )}

        {birthDate && isPaternityPlanComplete && (
          <div
            ref={supplementaryLeaveRef}
            id="conge-supplementaire"
            className={`max-w-3xl mx-auto mb-12 ${isCoarsePointer ? '' : 'animate-fade-in'}`}
          >
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
          </div>
        )}

        {birthDate && (
          <>
            <div className={`max-w-3xl mx-auto mb-12 ${isCoarsePointer ? '' : 'animate-fade-in'}`} id="summary">
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
            </div>

            {mandatoryPeriod && (
              <div ref={letterRef} className={`max-w-3xl mx-auto mb-12 ${isCoarsePointer ? '' : 'animate-fade-in-delay'}`} id="letter">
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
            )}
          </>
        )}

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
              className="text-xs font-bold text-slate-800 hover:text-brand-600 transition-colors flex items-center gap-1.5"
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
              className="hover:text-brand-600 transition-colors"
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
