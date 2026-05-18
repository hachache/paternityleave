import { useCallback, useEffect, useRef, useState } from 'react';
import { Calendar as CalendarIcon, Menu, RotateCcw, X } from 'lucide-react';
import { Calendar } from './components/Calendar';
import { Summary } from './components/Summary';
import { LegalInfo } from './components/LegalInfo';
import { LegalReferences } from './components/LegalReferences';
import { LetterGenerator } from './components/LetterGenerator';
import { CelebrationModal } from './components/CelebrationModal';
import { FeedbackBanner } from './components/FeedbackBanner';
import { ProgressStepper } from './components/ProgressStepper';
import { CalendarLegend } from './components/CalendarLegend';
import { SectionCard } from './components/SectionCard';
import { NextStepsCard } from './components/NextStepsCard';
import { ScenarioSelector } from './components/ScenarioSelector';
import { SupplementaryLeaveCard } from './components/SupplementaryLeaveCard';
import { Button } from './components/Button';
import { usePaternityPlanning } from './hooks/usePaternityPlanning';

function App() {
  const [showLegalReferences, setShowLegalReferences] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    supplementaryLeaveEnabled,
    supplementaryLeaveDuration,
    supplementaryLeaveEligibility,
    supplementaryLeaveStartDate,
    supplementaryLeavePeriod,
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
    setSupplementaryLeaveDuration
  } = usePaternityPlanning();

  const mainContentId = 'contenu-principal';
  const currentYear = new Date().getFullYear();
  const secondBlockDays = Math.max(totalFractionableDays - customFirstBlockDays, 0);
  const sliderMax = Math.max(5, totalFractionableDays - 5);

  const calendarRef = useRef<HTMLDivElement>(null);
  const planningRef = useRef<HTMLDivElement>(null);
  const customModeRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);

  const smoothScrollTo = useCallback((ref: React.RefObject<HTMLDivElement>) => {
    const node = ref.current;
    if (!node) return;
    node.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const scheduleSmoothScroll = useCallback((ref: React.RefObject<HTMLDivElement>) => {
    requestAnimationFrame(() => {
      const node = ref.current;
      if (!node) return;
      node.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, []);

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

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (!section) return;
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileMenuOpen(false);
  };

  const handleSelectBirthDate = (date: Date) => {
    selectBirthDate(date);
  };

  const handleStartVisualSelection = () => {
    startVisualSelection();
    scheduleSmoothScroll(calendarRef);
  };

  const handleShowLegalReferences = () => {
    setShowLegalReferences(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHideLegalReferences = () => {
    setShowLegalReferences(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [showLegalReferences]);

  const previousScenarioId = useRef(scenarioId);
  useEffect(() => {
    if (previousScenarioId.current !== scenarioId && !birthDate) {
      scheduleSmoothScroll(calendarRef);
    }
    previousScenarioId.current = scenarioId;
  }, [scenarioId, birthDate, scheduleSmoothScroll]);

  const previousBirthDateTs = useRef<number | null>(null);
  useEffect(() => {
    const planningIntroVisible = Boolean(birthDate && mandatoryPeriod && remainingBlocks.length === 0 && !customMode);
    if (!planningIntroVisible) return;
    const ts = birthDate ? birthDate.getTime() : null;
    if (ts && previousBirthDateTs.current !== ts) {
      previousBirthDateTs.current = ts;
      scheduleSmoothScroll(planningRef);
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

  if (showLegalReferences) {
    return (
      <div className="min-h-screen app-shell text-[var(--text)] selection:bg-brand-100 selection:text-brand-900">
        <a
          href={`#${mainContentId}`}
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-50 bg-black text-white px-4 py-2 rounded-lg"
        >
          Aller directement au contenu principal
        </a>
        <main id={mainContentId} className="py-8 px-4">
          <div className="max-w-[1200px] mx-auto mb-8">
            <Button onClick={handleHideLegalReferences} variant="secondary" size="sm">
              Retour au planificateur
            </Button>
          </div>
          <LegalReferences />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen app-shell flex flex-col selection:bg-brand-100 selection:text-brand-900 overflow-x-hidden" id="top">
      <a
        href={`#${mainContentId}`}
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-50 bg-black text-white px-4 py-2 rounded-lg"
      >
        Aller directement au contenu principal
      </a>

      <header className="sticky top-0 z-50 border-b border-black/10 bg-white/70 backdrop-blur-xl">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <button onClick={() => scrollToSection('top')} className="text-sm font-semibold tracking-tight text-[#1d1d1f]">
            Planning Paternité
          </button>

          <nav className="hidden md:flex items-center gap-6 text-sm text-[#1d1d1f]/80">
            <button onClick={() => scrollToSection('calendar')} className="hover:opacity-60 transition-opacity duration-300">Calendrier</button>
            <button onClick={() => scrollToSection('summary')} className="hover:opacity-60 transition-opacity duration-300">Résumé</button>
            <button onClick={() => scrollToSection('letter')} className="hover:opacity-60 transition-opacity duration-300">Courrier</button>
            <button onClick={() => scrollToSection('legal')} className="hover:opacity-60 transition-opacity duration-300">Légal</button>
          </nav>

          <div className="flex items-center gap-2">
            {birthDate && (
              <button
                onClick={requestReset}
                className="hidden sm:inline-flex px-3 py-1.5 text-xs rounded-full border border-black/10 bg-white hover:bg-[#f5f5f7] transition-all duration-300"
              >
                Réinitialiser
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen((s) => !s)}
              className="md:hidden p-2 rounded-lg border border-black/10 bg-white"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-white/92 backdrop-blur-xl">
          <div className="max-w-[1200px] mx-auto px-6 pt-24 grid gap-5 text-2xl font-medium text-[#1d1d1f]">
            <button onClick={() => scrollToSection('calendar')} className="text-left">Calendrier</button>
            <button onClick={() => scrollToSection('summary')} className="text-left">Résumé</button>
            <button onClick={() => scrollToSection('letter')} className="text-left">Courrier</button>
            <button onClick={() => scrollToSection('legal')} className="text-left">Légal</button>
          </div>
        </div>
      )}

      <main id={mainContentId} className="flex-1">
        <section className="relative px-4 sm:px-6 pt-16 sm:pt-24 pb-20 sm:pb-28 border-b border-black/5">
          <div className="absolute inset-0 pointer-events-none">
            <div className="aurora-blob aurora-1 rounded-full" />
            <div className="aurora-blob aurora-2 rounded-full" />
            <div className="aurora-blob aurora-3 rounded-full" />
          </div>
          <div className="max-w-[1200px] mx-auto text-center relative z-10">
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-[#1d1d1f] tracking-tight leading-[0.95]">
              Planification précise.
              <br />
              Exécution sereine.
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-[#424245] max-w-2xl mx-auto leading-relaxed">
              Un outil clair et sophistiqué pour organiser votre congé paternité avec une lecture immédiate et une confiance totale.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
              <button
                onClick={() => scrollToSection('calendar')}
                className="px-6 py-3 rounded-full bg-black text-white text-sm font-medium hover:opacity-85 transition-all duration-300"
              >
                Commencer la planification
              </button>
              <button
                onClick={() => scrollToSection('legal')}
                className="text-[#0071e3] text-sm font-medium hover:opacity-70 transition-opacity duration-300"
              >
                Voir le cadre légal
              </button>
            </div>
            <div className="mt-12 sm:mt-16 rounded-[28px] overflow-hidden border border-black/10 shadow-soft">
              <img
                src="/social-card.png"
                alt="Interface de planification"
                className="w-full h-auto object-cover"
                loading="eager"
              />
            </div>
          </div>
        </section>

        <section className="bg-white py-20 sm:py-[120px] px-4 sm:px-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="max-w-3xl mx-auto mb-14 animate-fade-in-up">
              <SectionCard
                title="Votre situation"
                description="Sélectionnez le scénario applicable et lancez la planification"
                accent="brand"
              >
                <ScenarioSelector selectedScenario={scenarioId} onScenarioChange={setScenarioId} />
              </SectionCard>
            </div>

            <div className="max-w-3xl mx-auto mb-14 animate-fade-in-up">
              <SupplementaryLeaveCard
                birthDate={birthDate}
                isPaternityPlanComplete={isPaternityPlanComplete}
                supplementaryLeaveEnabled={supplementaryLeaveEnabled}
                supplementaryLeaveDuration={supplementaryLeaveDuration}
                supplementaryLeaveEligibility={supplementaryLeaveEligibility}
                supplementaryLeaveStartDate={supplementaryLeaveStartDate}
                supplementaryLeavePeriod={supplementaryLeavePeriod}
                supplementaryLeaveError={supplementaryLeaveError}
                onToggle={setSupplementaryLeaveEnabled}
                onDurationChange={setSupplementaryLeaveDuration}
              />
            </div>

            <div className="max-w-3xl mx-auto mb-14 animate-fade-in-up">
              <ProgressStepper currentStep={planningStep} fractionableDays={totalFractionableDays} />
              {birthDate && (
                <p className="mt-4 text-center text-sm font-medium text-[#424245] bg-[#f5f5f7] py-2 px-4 rounded-full inline-block mx-auto border border-black/10">
                  {totalPlannedDays} / {totalFractionableDays} jours planifiés
                </p>
              )}
            </div>

            <div className="max-w-3xl mx-auto animate-fade-in-up">
              <SectionCard
                title="Prochaines étapes"
                description="Suivez une progression claire jusqu’à la génération du courrier"
                accent="slate"
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
          </div>
        </section>

        <section className="bg-[#f5f5f7] py-20 sm:py-[120px] px-4 sm:px-6" id="calendar">
          <div className="max-w-[1200px] mx-auto">
            {(error || (successMessage && !visualSelectionMode)) && (
              <div className="max-w-3xl mx-auto space-y-4 mb-8 animate-fade-in">
                {error && <FeedbackBanner tone="error" title="Attention" message={error} />}
                {successMessage && !visualSelectionMode && (
                  <FeedbackBanner tone="success" title="Succès" message={successMessage} />
                )}
              </div>
            )}

            {visualSelectionMode && selectionStep !== 'idle' && (
              <div className="mb-6 max-w-3xl mx-auto animate-fade-in-up sticky top-20 z-30">
                <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-soft">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-semibold text-sm">
                      {selectionStep === 'selecting-start' ? '1' : '2'}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-[#1d1d1f]">
                        {selectionStep === 'selecting-start' ? 'Sélectionnez le début' : 'Sélectionnez la fin'}
                      </h4>
                      <p className="text-sm text-[#424245]">
                        {selectionStep === 'selecting-start'
                          ? 'Cliquez sur la première date de votre période'
                          : 'Cliquez sur la dernière date (minimum 5 jours)'}
                      </p>
                      {selectionStartDate && selectionStep === 'selecting-end' && (
                        <p className="mt-1 text-xs text-[#6e6e73]">
                          Début : {selectionStartDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                        </p>
                      )}
                    </div>
                    <Button onClick={cancelVisualSelection} variant="secondary" size="sm">
                      Annuler
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div ref={calendarRef} className="mb-10 sm:mb-14 max-w-3xl mx-auto scroll-mt-24 relative z-20">
              <Calendar
                birthDate={birthDate}
                onSelectBirthDate={handleSelectBirthDate}
                employerPeriod={employerPeriod}
                mandatoryPeriod={mandatoryPeriod}
                remainingBlocks={remainingBlocks}
                supplementaryPeriod={supplementaryLeavePeriod}
                onSelectRemainingDay={selectRemainingDay}
                onRemoveBlock={removeBlock}
                scenario={scenario}
              />
              <CalendarLegend showSupplementary={Boolean(supplementaryLeavePeriod)} />
            </div>

            {birthDate && mandatoryPeriod && remainingBlocks.length === 0 && !customMode && (
              <div ref={planningRef} className="max-w-3xl mx-auto mb-10 sm:mb-14 animate-fade-in scroll-mt-24">
                <div className="premium-card p-6 sm:p-8">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-black text-white mb-4 shadow-soft">
                      <CalendarIcon className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#1d1d1f] mb-2">
                      Planifiez vos {totalFractionableDays} jours
                    </h3>
                    <p className="text-[#424245] text-base max-w-md mx-auto">
                      Choisissez une date pour placer vos jours automatiquement, ou activez le mode personnalisé.
                    </p>
                  </div>

                  <div className="group bg-[#f5f5f7] border border-black/10 rounded-2xl p-6 mb-6 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-[#1d1d1f] mb-1">Mode personnalisé</h4>
                        <p className="text-sm text-[#424245]">Définissez vous-même la durée de vos périodes.</p>
                      </div>
                      <Button
                        onClick={() => {
                          setCustomMode(true);
                          scheduleSmoothScroll(customModeRef);
                        }}
                        variant="primary"
                        size="md"
                        className="flex-shrink-0 ml-4"
                      >
                        Activer
                      </Button>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-black/10">
                      <div className="flex gap-3 mb-2 text-xs font-semibold text-[#6e6e73] uppercase tracking-wider text-center">
                        <span className="flex-1">Période 1</span>
                        <span className="flex-1">Période 2</span>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1 h-12 bg-[#f5f5f7] rounded-lg flex items-center justify-center text-[#1d1d1f] font-semibold text-sm border border-black/10">
                          {customFirstBlockDays} jours
                        </div>
                        <div className="flex-1 h-12 bg-[#f5f5f7] rounded-lg flex items-center justify-center text-[#1d1d1f] font-semibold text-sm border border-black/10">
                          {secondBlockDays} jours
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {birthDate && mandatoryPeriod && remainingBlocks.length === 0 && customMode && !visualSelectionMode && (
              <div ref={customModeRef} className="max-w-3xl mx-auto mb-10 sm:mb-14 animate-fade-in-up scroll-mt-24">
                <div className="premium-card p-6 sm:p-8">
                  <div className="flex items-start gap-4 mb-8">
                    <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">C</div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-[#1d1d1f] mb-1">Mode personnalisé</h3>
                      <p className="text-base text-[#424245]">Choisissez votre méthode de sélection.</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
                    <div className="bg-[#f5f5f7] rounded-2xl p-5 border border-black/10">
                      <h4 className="text-base font-semibold text-[#1d1d1f]">Curseur</h4>
                      <p className="text-xs uppercase tracking-wider text-[#6e6e73] mt-1">Simple et rapide</p>
                      <p className="text-sm text-[#424245] mt-3">Ajustez la répartition puis cliquez sur le calendrier.</p>
                    </div>
                    <div className="bg-[#f5f5f7] rounded-2xl p-5 border border-black/10">
                      <h4 className="text-base font-semibold text-[#1d1d1f]">Sélection directe</h4>
                      <p className="text-xs uppercase tracking-wider text-[#6e6e73] mt-1">Précision</p>
                      <p className="text-sm text-[#424245] mt-3">Sélectionnez manuellement début et fin sur le calendrier.</p>
                      <Button onClick={handleStartVisualSelection} variant="secondary" size="sm" fullWidth className="mt-4">
                        Commencer
                      </Button>
                    </div>
                  </div>

                  <div className="bg-[#f5f5f7] rounded-2xl p-6 mb-6 border border-black/10">
                    <div className="text-center mb-7">
                      <p className="text-xs font-semibold uppercase tracking-widest text-[#6e6e73] mb-5">Répartition des jours</p>
                      <div className="flex gap-4 justify-center items-center">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 rounded-xl bg-black text-white flex items-center justify-center text-2xl font-bold mb-2">
                            {customFirstBlockDays}
                          </div>
                          <span className="text-xs font-semibold text-[#1d1d1f] uppercase">Période 1</span>
                        </div>
                        <div className="text-xl text-[#6e6e73]">+</div>
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 rounded-xl bg-[#0071e3] text-white flex items-center justify-center text-2xl font-bold mb-2">
                            {secondBlockDays}
                          </div>
                          <span className="text-xs font-semibold text-[#1d1d1f] uppercase">Période 2</span>
                        </div>
                      </div>
                    </div>

                    <div className="h-3 bg-white rounded-full overflow-hidden mb-6 flex border border-black/10">
                      <div className="h-full bg-black transition-all duration-300" style={{ width: `${(customFirstBlockDays / totalFractionableDays) * 100}%` }} />
                      <div className="h-full bg-[#0071e3] transition-all duration-300" style={{ width: `${(secondBlockDays / totalFractionableDays) * 100}%` }} />
                    </div>

                    <div className="relative h-10 flex items-center">
                      <input
                        type="range"
                        min="5"
                        max={sliderMax}
                        value={customFirstBlockDays}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomFirstBlockDays(Number(e.target.value))}
                        className="w-full absolute z-20 opacity-0 cursor-pointer h-full"
                      />
                      <div className="w-full h-1.5 bg-white rounded-full overflow-hidden border border-black/10">
                        <div className="h-full bg-black" style={{ width: `${((customFirstBlockDays - 5) / (sliderMax - 5)) * 100}%` }} />
                      </div>
                      <div
                        className="absolute h-6 w-6 bg-white border-2 border-black rounded-full shadow-sm pointer-events-none transition-all duration-75"
                        style={{ left: `calc(${((customFirstBlockDays - 5) / (sliderMax - 5)) * 100}% - 12px)` }}
                      />
                    </div>
                  </div>

                  <Button onClick={() => setCustomMode(false)} variant="ghost" size="lg" fullWidth>
                    Revenir au mode simple
                  </Button>
                </div>
              </div>
            )}

            {customMode && remainingBlocks.length === 1 && !visualSelectionMode && (
              <div className="max-w-3xl mx-auto mb-8 sm:mb-12 animate-fade-in-up sticky top-20 z-30">
                <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-soft">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">2</div>
                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-[#1d1d1f]">Dernière étape</h4>
                      <p className="text-sm text-[#424245]">Cliquez sur une date pour placer les {secondBlockDays} jours restants.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {remainingBlocks.length > 0 && (
              <div className="max-w-3xl mx-auto mb-10 animate-fade-in">
                <Button
                  onClick={clearAllBlocks}
                  variant="outline"
                  size="md"
                  fullWidth
                  className="bg-white text-[#424245] border-black/10 hover:bg-[#f5f5f7] hover:text-[#1d1d1f]"
                >
                  Recommencer la planification
                </Button>
              </div>
            )}
          </div>
        </section>

        <section className="bg-black py-16 sm:py-20 px-4 sm:px-6">
          <div className="max-w-[1200px] mx-auto text-center">
            <h2 className="text-white text-3xl sm:text-4xl font-semibold tracking-tight">Précision industrielle, simplicité absolue.</h2>
            <p className="text-white/75 text-base sm:text-lg max-w-2xl mx-auto mt-4">
              Chaque étape est optimisée pour la clarté: moins de friction, plus de contrôle, et une lecture immédiate.
            </p>
          </div>
        </section>

        <section className="bg-white py-20 sm:py-[120px] px-4 sm:px-6" id="summary">
          <div className="max-w-[1200px] mx-auto">
            {birthDate && (
              <div className="max-w-3xl mx-auto mb-12 animate-fade-in">
                <Summary
                  birthDate={birthDate}
                  employerPeriod={employerPeriod}
                  mandatoryPeriod={mandatoryPeriod}
                  remainingBlocks={remainingBlocks}
                  supplementaryPeriod={supplementaryLeavePeriod}
                  supplementaryLeaveEnabled={supplementaryLeaveEnabled}
                  onRemoveBlock={removeBlock}
                  totalFractionableDays={totalFractionableDays}
                  scenario={scenario}
                />
              </div>
            )}

            {mandatoryPeriod && (
              <div ref={letterRef} className="max-w-3xl mx-auto animate-fade-in-delay" id="letter">
                <LetterGenerator
                  birthDate={birthDate!}
                  mandatoryPeriod={mandatoryPeriod}
                  remainingBlocks={remainingBlocks}
                  supplementaryPeriod={supplementaryLeavePeriod}
                />
              </div>
            )}
          </div>
        </section>

        <section className="bg-[#f5f5f7] py-20 sm:py-[120px] px-4 sm:px-6" id="legal">
          <div className="max-w-[1200px] mx-auto">
            <div className="max-w-3xl mx-auto">
              <LegalInfo onShowLegalReferences={handleShowLegalReferences} />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#f5f5f7] border-t border-black/10 py-14 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-sm">
          <div>
            <p className="text-[#1d1d1f] font-semibold">Planning Paternité</p>
            <p className="text-[#6e6e73] mt-2">Conçu pour planifier efficacement vos périodes de congé.</p>
          </div>
          <div>
            <p className="text-[#1d1d1f] font-semibold">Navigation</p>
            <div className="mt-2 grid gap-1 text-[#6e6e73]">
              <button className="text-left hover:text-[#1d1d1f]" onClick={() => scrollToSection('calendar')}>Calendrier</button>
              <button className="text-left hover:text-[#1d1d1f]" onClick={() => scrollToSection('summary')}>Résumé</button>
              <button className="text-left hover:text-[#1d1d1f]" onClick={() => scrollToSection('letter')}>Courrier</button>
            </div>
          </div>
          <div>
            <p className="text-[#1d1d1f] font-semibold">Informations</p>
            <div className="mt-2 grid gap-1 text-[#6e6e73]">
              <button className="text-left hover:text-[#1d1d1f]" onClick={() => scrollToSection('legal')}>Cadre légal</button>
              <button className="text-left hover:text-[#1d1d1f]" onClick={() => setShowLegalReferences(true)}>Références</button>
            </div>
          </div>
          <div>
            <p className="text-[#1d1d1f] font-semibold">Version</p>
            <p className="text-[#6e6e73] mt-2">© {currentYear} · Interface minimaliste</p>
          </div>
        </div>
      </footer>

      <CelebrationModal
        show={showCelebration}
        onClose={() => {
          hideCelebration();
          scheduleSmoothScroll(letterRef);
        }}
        totalFractionableDays={totalFractionableDays}
      />

      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-soft max-w-md w-full p-8 animate-pop border border-black/10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#f5f5f7] text-[#1d1d1f] mb-4">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-semibold text-[#1d1d1f] mb-2">Réinitialiser le planning ?</h3>
              <p className="text-[#424245] text-sm leading-relaxed">Toute votre progression actuelle sera perdue.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button onClick={cancelReset} variant="secondary" size="lg" className="w-full">
                Annuler
              </Button>
              <Button onClick={confirmReset} variant="danger" size="lg" className="w-full">
                Confirmer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
