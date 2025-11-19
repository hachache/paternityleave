import { useCallback, useEffect, useRef, useState } from 'react';
import { useMediaQuery } from './hooks/useMediaQuery';
import { Calendar as CalendarIcon, RotateCcw, Linkedin } from 'lucide-react';
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
import { ScenarioSelector } from './components/ScenarioSelector';
import { Button } from './components/Button';
import { usePaternityPlanning } from './hooks/usePaternityPlanning';

function App() {
  const [showLegalReferences, setShowLegalReferences] = useState(false);
  const [hasScrolledPastStart, setHasScrolledPastStart] = useState(false);
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

  const mainContentId = 'contenu-principal';
  const currentYear = new Date().getFullYear();
  const secondBlockDays = Math.max(totalFractionableDays - customFirstBlockDays, 0);
  const sliderMax = Math.max(5, totalFractionableDays - 5);

  // Refs for smooth scrolling
  const calendarRef = useRef<HTMLDivElement>(null);
  const planningRef = useRef<HTMLDivElement>(null);
  const customModeRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolledPastStart(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  // Smooth scroll utility - STABLE (pas de dépendances)
  const smoothScrollTo = useCallback((ref: React.RefObject<HTMLDivElement>) => {
    const node = ref.current;
    if (!node) return;
    node.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  // Schedule scroll after RAF to avoid race conditions;
  // rely on CSS scroll-padding/scroll-margin for alignment to reduce jank
  const scheduleSmoothScroll = useCallback((ref: React.RefObject<HTMLDivElement>, _offset: number = -20) => {
    requestAnimationFrame(() => {
      const node = ref.current;
      if (!node) return;
      // Always use smooth behavior (desktop and mobile) for a léger auto-scroll
      const behavior: ScrollBehavior = 'smooth';
      node.scrollIntoView({ behavior, block: 'start' });
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

  const handleShowLegalReferences = () => {
    setShowLegalReferences(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHideLegalReferences = () => {
    setShowLegalReferences(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scroll to top on initial page load and when toggling legal references
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [showLegalReferences]);

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
      {/* Animated Aurora Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="aurora-blob aurora-1 rounded-full mix-blend-multiply blur-3xl opacity-40"></div>
        <div className="aurora-blob aurora-2 rounded-full mix-blend-multiply blur-3xl opacity-40"></div>
        <div className="aurora-blob aurora-3 rounded-full mix-blend-multiply blur-3xl opacity-40"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
        
        {/* Floating Thematic Particles */}
        <div className="absolute top-[15%] left-[10%] text-4xl opacity-[0.08] animate-float blur-[1px] select-none" style={{ animationDelay: '0s' }}>🍼</div>
        <div className="absolute top-[25%] right-[15%] text-3xl opacity-[0.06] animate-float blur-[1px] select-none" style={{ animationDelay: '2.5s' }}>🧸</div>
        <div className="absolute bottom-[20%] left-[20%] text-5xl opacity-[0.05] animate-float blur-[2px] select-none" style={{ animationDelay: '4s' }}>✨</div>
        <div className="absolute bottom-[30%] right-[10%] text-4xl opacity-[0.07] animate-float blur-[1px] select-none" style={{ animationDelay: '1.5s' }}>👶</div>
        <div className="absolute top-[40%] left-[50%] text-2xl opacity-[0.06] animate-float blur-[1px] select-none" style={{ animationDelay: '3s' }}>📅</div>
      </div>

      <a
        href={`#${mainContentId}`}
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-50 bg-brand-600 text-white px-4 py-2 rounded-lg shadow-lg transition-transform"
      >
        Aller directement au contenu principal
      </a>
      
      <main id={mainContentId} className="flex-1 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-5xl pt-20 sm:pt-24 pb-20 md:pb-12">
          <header className="mb-12 sm:mb-16 text-center animate-fade-in-up relative">
            <div className="absolute top-0 right-2 sm:right-0">
               <button
                onClick={handleResetRequest}
                className={`px-4 py-2 bg-white/80 backdrop-blur-md text-slate-600 rounded-xl hover:bg-white hover:text-brand-600 hover:shadow-lg transition-all duration-300 text-sm font-medium active:scale-95 border border-white shadow-sm flex items-center gap-2 group ${!birthDate ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
              >
                <RotateCcw className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-500" />
                <span className="hidden sm:inline">Réinitialiser</span>
              </button>
            </div>

            {/* Logo avec animation de construction */}
            <div className="inline-flex mb-6 relative group">
              <div className="absolute inset-0 bg-brand-400 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
              <button
                onClick={handleResetRequest}
                className={`relative inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-2xl shadow-brand-500/30 transition-transform duration-500 hover:scale-105 active:scale-95 animate-logo-appear ${birthDate ? 'cursor-pointer animate-logo-glow' : 'cursor-default'}`}
                title={birthDate ? 'Cliquer pour réinitialiser' : 'Calendrier'}
              >
                <div className="logo-icon-container w-12 h-12 relative drop-shadow-md">
                  <CalendarIcon className="logo-icon-part w-full h-full text-white" strokeWidth={1.5} style={{ clipPath: 'polygon(0 0, 50% 0, 50% 50%, 0 50%)' }} />
                  <CalendarIcon className="logo-icon-part w-full h-full text-white" strokeWidth={1.5} style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 50%, 50% 50%)' }} />
                  <CalendarIcon className="logo-icon-part w-full h-full text-white" strokeWidth={1.5} style={{ clipPath: 'polygon(0 50%, 50% 50%, 50% 100%, 0 100%)' }} />
                  <CalendarIcon className="logo-icon-part w-full h-full text-white" strokeWidth={1.5} style={{ clipPath: 'polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)' }} />
                </div>
              </button>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight font-display leading-[1.1] relative inline-block">
              Congé <span className="text-gradient-animate">Paternité</span>
              <span className="absolute -top-8 -right-10 rotate-12 bg-brand-100 text-brand-700 text-sm font-bold px-3 py-1.5 rounded-xl border border-brand-200 shadow-sm animate-bounce-subtle hidden sm:inline-block">
                2025 Ready ✨
              </span>
            </h1>
            <p className="text-slate-600 text-2xl sm:text-3xl font-hand -rotate-1 mb-8 px-4 max-w-2xl mx-auto leading-relaxed text-brand-900/80">
              L'outil moderne pour planifier simplement votre congé paternité.
            </p>

            {/* Made by badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-md rounded-full border border-white/60 shadow-lg shadow-brand-900/5 hover:shadow-xl hover:scale-105 transition-all duration-300 mt-2">
              <span className="text-xs text-slate-500 font-medium">Made with</span>
              <span className="text-red-500 animate-pulse-heart text-base" aria-label="amour">❤️</span>
              <span className="text-xs text-slate-500 font-medium">by</span>
              <a
                href="https://www.linkedin.com/in/hedi-a-2382551a1/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-slate-800 hover:text-brand-600 transition-colors flex items-center gap-1.5"
                aria-label="Profil LinkedIn de Hedi ACHACHE"
              >
                <Linkedin className="w-3.5 h-3.5 text-[#0A66C2]" aria-hidden="true" />
                Hedi ACHACHE
              </a>
            </div>
          </header>

          <ScrollIndicator show={birthDate !== null} />

          <NavigationAnchor show={birthDate !== null && hasScrolledPastStart} />

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
            <ProgressStepper currentStep={planningStep} fractionableDays={totalFractionableDays} />
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
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 px-4 animate-fade-in">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-brand-900/20 max-w-md w-full p-8 animate-pop transform transition-all border border-white/50">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 mb-5 shadow-inner">
                  <RotateCcw className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold font-display text-slate-900 mb-3">
                  Réinitialiser le planning ?
                </h3>
                <p className="text-slate-600 text-base leading-relaxed">
                  Toute votre progression actuelle sera perdue. Cette action est irréversible.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={handleResetCancel}
                  variant="secondary"
                  size="lg"
                  className="w-full"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleResetConfirm}
                  variant="danger"
                  size="lg"
                  className="w-full"
                >
                  Confirmer
                </Button>
              </div>
            </div>
          </div>
        )}

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

        <div ref={calendarRef} className="mb-8 sm:mb-12 max-w-3xl mx-auto scroll-mt-28 relative z-20" id="calendar">
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
          <CalendarLegend />
        </div>

        {birthDate && mandatoryPeriod && remainingBlocks.length === 0 && !customMode && (
          <div ref={planningRef} className={`max-w-3xl mx-auto mb-8 sm:mb-12 ${isCoarsePointer ? '' : 'animate-fade-in'} scroll-mt-28`}>
            <div className={`premium-card p-6 sm:p-8 ${isCoarsePointer ? '' : 'transition-all duration-500'}`}>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 mb-4 shadow-inner">
                  <span className="text-3xl">📅</span>
                </div>
                <h3 className="text-2xl font-bold font-display text-slate-900 mb-2">
                  Planifiez vos {totalFractionableDays} jours
                </h3>
                <p className="text-slate-500 text-lg max-w-md mx-auto leading-relaxed">
                  Cliquez sur une date pour placer vos jours automatiquement, ou choisissez une méthode personnalisée.
                </p>
              </div>

              {/* Mode personnalisé toggle */}
              <div className="group bg-slate-50/50 hover:bg-brand-50/30 border border-slate-200/60 hover:border-brand-200/60 rounded-2xl p-6 mb-6 transition-all duration-300 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-slate-900 group-hover:text-brand-900 mb-1 font-display">
                      Mode personnalisé
                    </h4>
                    <p className="text-sm text-slate-600 group-hover:text-brand-700 leading-relaxed">
                      Définissez vous-même la durée de vos périodes (min. 5j)
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      setCustomMode(true);
                      scheduleSmoothScroll(customModeRef, -100);
                    }}
                    variant="primary"
                    size="md"
                    className="flex-shrink-0 ml-4 shadow-none bg-slate-900 hover:bg-brand-600"
                  >
                    Activer
                  </Button>
                </div>

                {/* Prévisualisation */}
                <div className="bg-white/80 rounded-xl p-4 border border-slate-100 shadow-sm">
                  <div className="flex gap-3 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
                    <span className="flex-1">Période 1</span>
                    <span className="flex-1">Période 2</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 font-bold text-sm border border-slate-200">
                      {customFirstBlockDays} jours
                    </div>
                    <div className="flex-1 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 font-bold text-sm border border-slate-200">
                      {secondBlockDays} jours
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions simples */}
              <div className="text-center">
                <p className="text-sm text-slate-400 font-medium">
                  💡 <span className="text-slate-700">Mode simple</span> : 1 clic = {totalFractionableDays} jours consécutifs
                </p>
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
                    <span aria-hidden="true">⚙️</span>
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
                      <span aria-hidden="true">🎚️</span>
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
                        <span aria-hidden="true">👆</span>
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
              <span className="group-hover:scale-110 transition-transform duration-300 mr-2">🗑️</span>
              Recommencer la planification
            </Button>
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
              />
            </div>

            {mandatoryPeriod && (
              <div ref={letterRef} className={`max-w-3xl mx-auto mb-12 ${isCoarsePointer ? '' : 'animate-fade-in-delay'}`} id="letter">
                <LetterGenerator
                  birthDate={birthDate}
                  mandatoryPeriod={mandatoryPeriod}
                  remainingBlocks={remainingBlocks}
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
            <span className="text-xs text-slate-500 font-medium">Made with</span>
            <span className="text-red-500 animate-pulse-heart text-sm">❤️</span>
            <span className="text-xs text-slate-500 font-medium">by</span>
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
