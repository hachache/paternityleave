import { useState, useRef, useEffect } from 'react';
import { startOfDay, differenceInDays, addDays } from 'date-fns';
import { Calendar as CalendarIcon, RotateCcw } from 'lucide-react';
import { Calendar } from './components/Calendar';
import { Summary } from './components/Summary';
import { LegalInfo } from './components/LegalInfo';
import { LetterGenerator } from './components/LetterGenerator';
import { ScrollIndicator } from './components/ScrollIndicator';
import { CelebrationModal } from './components/CelebrationModal';
import {
  calculateEmployerPeriod,
  calculateMandatoryPeriod,
  validateRemainingBlock,
  calculateAutomaticRemainingPeriod,
  calculateFractionnedPeriods,
  calculateTotalUsedDays,
  LeaveBlock
} from './utils/paternityLeave';

function App() {
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [employerPeriod, setEmployerPeriod] = useState<LeaveBlock | null>(null);
  const [mandatoryPeriod, setMandatoryPeriod] = useState<LeaveBlock | null>(null);
  const [remainingBlocks, setRemainingBlocks] = useState<LeaveBlock[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [firstBlockDays, setFirstBlockDays] = useState(10);

  // New state for interactive split mode
  const [splitMode, setSplitMode] = useState<'idle' | 'placing-first' | 'placing-second'>('idle');
  const [splitConfig, setSplitConfig] = useState<[number, number] | null>(null);
  const [previewBlock, setPreviewBlock] = useState<LeaveBlock | null>(null);

  // New state for custom mode
  const [customMode, setCustomMode] = useState(false);
  const [customFirstBlockDays, setCustomFirstBlockDays] = useState(10);

  // State for visual selection mode
  const [visualSelectionMode, setVisualSelectionMode] = useState(false);
  const [selectionStep, setSelectionStep] = useState<'idle' | 'selecting-start' | 'selecting-end'>('idle');
  const [selectionStartDate, setSelectionStartDate] = useState<Date | null>(null);

  // State for celebration modal
  const [showCelebration, setShowCelebration] = useState(false);
  const hasShownCelebration = useRef(false);

  // Refs for smooth scrolling
  const calendarRef = useRef<HTMLDivElement>(null);
  const planningRef = useRef<HTMLDivElement>(null);
  const customModeRef = useRef<HTMLDivElement>(null);
  const visualSelectionRef = useRef<HTMLDivElement>(null);

  // Smooth scroll utility
  const smoothScrollTo = (ref: React.RefObject<HTMLDivElement>, offset = -20) => {
    if (ref.current) {
      const elementPosition = ref.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset + offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Check if planning is complete and show celebration (ONCE)
  useEffect(() => {
    if (birthDate && mandatoryPeriod && remainingBlocks.length > 0) {
      const totalPlanned = calculateTotalUsedDays(remainingBlocks);
      if (totalPlanned === 21 && !hasShownCelebration.current) {
        hasShownCelebration.current = true;
        const timer = setTimeout(() => setShowCelebration(true), 500);
        return () => clearTimeout(timer);
      }
    }
  }, [remainingBlocks, birthDate, mandatoryPeriod]);

  const handleSelectBirthDate = (date: Date) => {
    const normalized = startOfDay(date);
    setBirthDate(normalized);

    const employer = calculateEmployerPeriod(normalized);
    setEmployerPeriod(employer);

    const mandatory = calculateMandatoryPeriod(employer.end);
    setMandatoryPeriod(mandatory);

    setRemainingBlocks([]);
    setError(null);
    setSuccessMessage(null);

    // Scroll doucement vers la section de planification après un court délai
    setTimeout(() => smoothScrollTo(planningRef, -100), 600);
  };

  const handleSelectRemainingDay = (date: Date) => {
    const normalized = startOfDay(date);
    setError(null);
    setSuccessMessage(null);

    if (!birthDate || !mandatoryPeriod) return;

    // Mode de sélection visuelle
    if (visualSelectionMode && selectionStep === 'selecting-start') {
      // Vérifier que la date de début n'est pas avant la naissance
      if (normalized < birthDate) {
        setError('Les jours fractionnables ne peuvent pas être posés avant la date de naissance');
        return;
      }

      setSelectionStartDate(normalized);
      setSelectionStep('selecting-end');
      setSuccessMessage(`✅ Date de début sélectionnée : ${normalized.toLocaleDateString('fr-FR')}. Cliquez maintenant sur la date de FIN de votre première période.`);

      // Pas de scroll, on garde le calendrier visible
      return;
    }

    if (visualSelectionMode && selectionStep === 'selecting-end' && selectionStartDate) {
      // Calculer le nombre de jours entre les deux dates
      const daysDiff = differenceInDays(normalized, selectionStartDate) + 1;

      if (daysDiff < 5) {
        setError('La première période doit contenir au minimum 5 jours');
        return;
      }

      if (daysDiff > 16) {
        setError('La première période ne peut pas dépasser 16 jours (il doit rester au moins 5 jours pour la 2ème période)');
        return;
      }

      if (normalized <= selectionStartDate) {
        setError('La date de fin doit être après la date de début');
        return;
      }

      // Créer le premier bloc
      const firstBlock = {
        start: selectionStartDate,
        end: normalized,
        days: daysDiff,
        type: 'remaining' as const
      };

      // Valider le bloc
      const validation = validateRemainingBlock(
        firstBlock.start,
        firstBlock.end,
        birthDate,
        employerPeriod,
        mandatoryPeriod,
        [],
        0
      );

      if (!validation.valid) {
        setError(validation.error || 'Bloc invalide');
        return;
      }

      const newBlocks = [firstBlock];
      setRemainingBlocks(newBlocks);
      setVisualSelectionMode(false);
      setSelectionStep('idle');
      setSelectionStartDate(null);
      setCustomMode(false);
      setSuccessMessage(`✅ Premier bloc de ${daysDiff} jours placé ! Cliquez sur le calendrier pour placer les ${21 - daysDiff} jours restants.`);
      return;
    }

    // Si on est en mode personnalisé (custom mode)
    if (customMode && remainingBlocks.length === 0) {
      // Vérifier que la date n'est pas avant la naissance
      if (normalized < birthDate) {
        setError('Les jours fractionnables ne peuvent pas être posés avant la date de naissance');
        return;
      }

      // Premier clic : placer le premier bloc
      const firstBlock = calculateAutomaticRemainingPeriod(birthDate, normalized, customFirstBlockDays);

      if (!firstBlock) {
        setError('Impossible de planifier à partir de cette date : la période dépasse les 6 mois après la naissance');
        return;
      }

      const validation = validateRemainingBlock(
        firstBlock.start,
        firstBlock.end,
        birthDate,
        employerPeriod,
        mandatoryPeriod,
        remainingBlocks,
        0
      );

      if (!validation.valid) {
        setError(validation.error || 'Bloc invalide');
        return;
      }

      const newBlocks = [firstBlock];
      setRemainingBlocks(newBlocks);
      setSuccessMessage(`✅ Premier bloc de ${customFirstBlockDays} jours placé ! Cliquez sur une autre date pour placer les ${21 - customFirstBlockDays} jours restants.`);
      return;
    }

    if (customMode && remainingBlocks.length === 1) {
      // Deuxième clic : placer le second bloc
      const remainingDays = 21 - customFirstBlockDays;
      const secondBlock = calculateAutomaticRemainingPeriod(birthDate, normalized, remainingDays);

      if (!secondBlock) {
        setError('Impossible de planifier à partir de cette date : la période dépasse les 6 mois après la naissance');
        return;
      }

      const validation = validateRemainingBlock(
        secondBlock.start,
        secondBlock.end,
        birthDate,
        employerPeriod,
        mandatoryPeriod,
        remainingBlocks,
        customFirstBlockDays
      );

      if (!validation.valid) {
        setError(validation.error || 'Bloc invalide');
        return;
      }

      const newBlocks = [...remainingBlocks, secondBlock];
      setRemainingBlocks(newBlocks);
      setCustomMode(false);
      setSuccessMessage('🎉 Planning complet ! Les 21 jours ont été planifiés en 2 périodes personnalisées.');
      return;
    }

    // Si on est en mode split interactif (ancien système - on le garde pour compatibilité)
    if (splitMode === 'placing-first' && splitConfig) {
      // Vérifier que la date n'est pas avant la naissance
      if (normalized < birthDate) {
        setError('Les jours fractionnables ne peuvent pas être posés avant la date de naissance');
        return;
      }

      const firstBlock = calculateAutomaticRemainingPeriod(birthDate, normalized, splitConfig[0]);

      if (!firstBlock) {
        setError('Impossible de planifier à partir de cette date : la période dépasse les 6 mois après la naissance');
        return;
      }

      const validation = validateRemainingBlock(
        firstBlock.start,
        firstBlock.end,
        birthDate,
        employerPeriod,
        mandatoryPeriod,
        remainingBlocks,
        0
      );

      if (!validation.valid) {
        setError(validation.error || 'Bloc invalide');
        return;
      }

      const newBlocks = [firstBlock];
      setRemainingBlocks(newBlocks);
      setSplitMode('placing-second');
      setSuccessMessage(`✅ Premier bloc de ${splitConfig[0]} jours placé ! Cliquez maintenant sur le calendrier pour placer le second bloc de ${splitConfig[1]} jours.`);
      return;
    }

    if (splitMode === 'placing-second' && splitConfig) {
      const secondBlock = calculateAutomaticRemainingPeriod(birthDate, normalized, splitConfig[1]);

      if (!secondBlock) {
        setError('Impossible de planifier à partir de cette date : la période dépasse les 6 mois après la naissance');
        return;
      }

      const validation = validateRemainingBlock(
        secondBlock.start,
        secondBlock.end,
        birthDate,
        employerPeriod,
        mandatoryPeriod,
        remainingBlocks,
        splitConfig[0]
      );

      if (!validation.valid) {
        setError(validation.error || 'Bloc invalide');
        return;
      }

      const newBlocks = [...remainingBlocks, secondBlock];
      setRemainingBlocks(newBlocks);
      setSplitMode('idle');
      setSplitConfig(null);
      setSuccessMessage('🎉 Planning complet ! Les 21 jours ont été planifiés en 2 périodes distinctes.');
      return;
    }

    // Mode simple/automatique : 1 clic = 21 jours
    const totalUsedDays = calculateTotalUsedDays(remainingBlocks);
    const daysLeft = 21 - totalUsedDays;

    if (daysLeft === 0) {
      setSuccessMessage('🎉 Planning complet ! Vous avez planifié les 28 jours de congé paternité (3j + 4j + 21j)');
      return;
    }

    const autoBlock = calculateAutomaticRemainingPeriod(birthDate, normalized, daysLeft);

    if (!autoBlock) {
      setError('Impossible de planifier à partir de cette date : la période dépasse les 6 mois après la naissance');
      return;
    }

    const validation = validateRemainingBlock(
      autoBlock.start,
      autoBlock.end,
      birthDate,
      employerPeriod,
      mandatoryPeriod,
      remainingBlocks,
      totalUsedDays
    );

    if (!validation.valid) {
      setError(validation.error || 'Bloc invalide');
      return;
    }

    const newBlocks = [...remainingBlocks, autoBlock];
    setRemainingBlocks(newBlocks);
    setError(null);
    if (!customMode) {
      setSuccessMessage('✅ Les 21 jours ont été planifiés automatiquement !');
    }
  };

  const handleResetRequest = () => {
    if (!birthDate) return;
    setShowResetConfirm(true);
  };

  const handleResetConfirm = () => {
    setBirthDate(null);
    setEmployerPeriod(null);
    setMandatoryPeriod(null);
    setRemainingBlocks([]);
    setError(null);
    setSuccessMessage(null);
    setShowResetConfirm(false);
    setShowCelebration(false);
    hasShownCelebration.current = false;
    setSplitMode('idle');
    setSplitConfig(null);
    setPreviewBlock(null);
    setCustomMode(false);
    setVisualSelectionMode(false);
    setSelectionStep('idle');
    setSelectionStartDate(null);
  };

  const handleResetCancel = () => {
    setShowResetConfirm(false);
  };

  const handleAutomaticPlanning = () => {
    if (!birthDate || !mandatoryPeriod) return;

    const totalUsedDays = calculateTotalUsedDays(remainingBlocks);
    const daysLeft = 21 - totalUsedDays;
    if (daysLeft < 5) {
      setError('Il ne reste pas assez de jours disponibles pour créer un bloc (minimum 5 jours)');
      return;
    }

    // Utiliser le jour après la fin de la période obligatoire comme date de début
    const startDate = addDays(mandatoryPeriod.end, 1);
    const autoBlock = calculateAutomaticRemainingPeriod(birthDate, startDate, daysLeft);

    if (!autoBlock) {
      setError('Impossible de planifier automatiquement : la période dépasse les 6 mois après la naissance');
      return;
    }

    const newBlocks = [...remainingBlocks, autoBlock];
    setRemainingBlocks(newBlocks);
    setError(null);
    setSuccessMessage('✅ Les 21 jours ont été planifiés automatiquement !');
  };

  const handleStartInteractiveSplit = () => {
    if (!birthDate || !mandatoryPeriod) return;

    const totalUsedDays = calculateTotalUsedDays(remainingBlocks);

    if (totalUsedDays > 0) {
      setError('Veuillez d\'abord effacer tous les blocs pour utiliser le mode fractionnement');
      return;
    }

    setError(null);
    setSuccessMessage(`🎯 Mode fractionnement activé ! Cliquez sur le calendrier pour placer le premier bloc de ${firstBlockDays} jours.`);
    setSplitMode('placing-first');
    setSplitConfig([firstBlockDays, 21 - firstBlockDays]);
  };

  const handleCancelSplitMode = () => {
    setSplitMode('idle');
    setSplitConfig(null);
    setPreviewBlock(null);
    setError(null);
    setSuccessMessage(null);
  };

  const handleRemoveBlock = (index: number) => {
    const newBlocks = remainingBlocks.filter((_: LeaveBlock, i: number) => i !== index);
    setRemainingBlocks(newBlocks);

    // Réinitialiser la célébration si on retire des blocs
    hasShownCelebration.current = false;
  };

  const handleClearAllBlocks = () => {
    setRemainingBlocks([]);
    setError(null);
    setSuccessMessage(null);
    setSplitMode('idle');
    setSplitConfig(null);
    setCustomMode(false);
    setVisualSelectionMode(false);
    setSelectionStep('idle');
    setSelectionStartDate(null);

    // Réinitialiser la célébration
    hasShownCelebration.current = false;
  };

  const handleStartVisualSelection = () => {
    setVisualSelectionMode(true);
    setSelectionStep('selecting-start');
    setSuccessMessage('🎯 Mode sélection visuelle activé ! Cliquez sur la date de DÉBUT de votre première période.');

    // Auto-scroll vers le calendrier après un court délai pour l'animation
    setTimeout(() => smoothScrollTo(calendarRef, -100), 300);
  };

  const handleCancelVisualSelection = () => {
    setVisualSelectionMode(false);
    setSelectionStep('idle');
    setSelectionStartDate(null);
    setError(null);
    setSuccessMessage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-12 max-w-5xl">
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
            className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 shadow-lg shadow-teal-200/50 transition-apple-smooth hover:shadow-xl hover:scale-105 active:scale-95 ${birthDate ? 'cursor-pointer' : 'cursor-default'}`}
            title={birthDate ? "Cliquer pour réinitialiser" : "Calendrier"}
          >
            <CalendarIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </button>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 mb-3 sm:mb-4 tracking-tight leading-tight">
            Congé Paternité
          </h1>
          <p className="text-slate-600 text-base sm:text-lg font-medium mb-3 sm:mb-4 px-4 max-w-2xl mx-auto">
            Planifiez votre congé selon la législation française
          </p>

          {/* Made by badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-slate-100/80 to-slate-200/80 backdrop-blur-sm rounded-full border border-slate-300/50 shadow-sm hover:shadow-md transition-apple-smooth hover:scale-105 mt-2">
            <span className="text-xs text-slate-600 font-medium">Made with</span>
            <span className="text-red-500 animate-pulse-subtle text-base">❤️</span>
            <span className="text-xs text-slate-600 font-medium">by</span>
            <span className="text-xs font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600">
              Hedi ACHACHE
            </span>
          </div>
        </header>

        <ScrollIndicator show={birthDate !== null} />

        {/* Celebration Modal */}
        <CelebrationModal
          show={showCelebration}
          onClose={() => setShowCelebration(false)}
        />

        {/* Modal de confirmation de réinitialisation */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-spring-in">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl mb-4">
                  <RotateCcw className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Réinitialiser ?
                </h3>
                <p className="text-slate-600 text-sm">
                  Êtes-vous sûr de vouloir réinitialiser toute la planification ? Cette action ne peut pas être annulée.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleResetCancel}
                  className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-apple-smooth hover:shadow-md active:scale-[0.98] hover:scale-[1.02]"
                >
                  Annuler
                </button>
                <button
                  onClick={handleResetConfirm}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white rounded-xl font-semibold transition-apple-smooth hover:shadow-lg active:scale-[0.98] hover:scale-[1.02]"
                >
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-5 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-2xl animate-shake max-w-2xl mx-auto shadow-lg backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center mt-0.5 shadow-md">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <p className="text-red-900 text-sm font-semibold flex-1">{error}</p>
            </div>
          </div>
        )}

        {successMessage && !visualSelectionMode && (
          <div className="mb-6 p-5 bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-2xl animate-slide-up max-w-2xl mx-auto shadow-lg backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center mt-0.5 shadow-md">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <p className="text-emerald-900 text-sm font-semibold flex-1">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Bannière d'instruction pour le mode sélection visuelle - juste au-dessus du calendrier */}
        {visualSelectionMode && selectionStep !== 'idle' && (
          <div className="mb-4 max-w-2xl mx-auto animate-slide-up">
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border-2 border-emerald-300 p-4 sm:p-5 shadow-lg glow-pulse">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md animate-pulse-subtle">
                    {selectionStep === 'selecting-start' ? '1' : '2'}
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-base sm:text-lg font-bold text-emerald-900 mb-1">
                    {selectionStep === 'selecting-start'
                      ? '📍 Cliquez sur la date de DÉBUT'
                      : '📍 Cliquez sur la date de FIN'}
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-800">
                    {selectionStep === 'selecting-start'
                      ? 'Choisissez le premier jour de votre première période'
                      : `Choisissez le dernier jour (min. 5 jours)`}
                  </p>
                  {selectionStartDate && selectionStep === 'selecting-end' && (
                    <div className="mt-2 p-2 bg-white/60 rounded-lg border border-emerald-200 animate-scale-in">
                      <p className="text-xs font-semibold text-emerald-900">
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

        <div ref={calendarRef} className="mb-6 sm:mb-8 max-w-2xl mx-auto scroll-mt-20">
          <Calendar
            birthDate={birthDate}
            onSelectBirthDate={handleSelectBirthDate}
            employerPeriod={employerPeriod}
            mandatoryPeriod={mandatoryPeriod}
            remainingBlocks={remainingBlocks}
            onSelectRemainingDay={handleSelectRemainingDay}
            onRemoveBlock={handleRemoveBlock}
          />
        </div>

        {birthDate && mandatoryPeriod && remainingBlocks.length === 0 && splitMode === 'idle' && !customMode && (
          <div ref={planningRef} className="max-w-3xl mx-auto mb-6 sm:mb-8 animate-fade-in scroll-mt-20">
            <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl sm:rounded-3xl border-2 border-slate-200/80 p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-apple-smooth">
              <div className="text-center mb-6 sm:mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl mb-3 sm:mb-4 shadow-lg">
                  <span className="text-2xl sm:text-3xl">📅</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                  Planifiez vos 21 jours restants
                </h3>
                <p className="text-slate-600 text-sm px-4">
                  Cliquez sur une date dans le calendrier pour placer vos 21 jours automatiquement
                </p>
              </div>

              {/* Mode personnalisé toggle */}
              <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border-2 border-teal-200 rounded-2xl p-5 sm:p-6 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-base sm:text-lg font-bold text-teal-900 mb-1">
                      Mode personnalisé
                    </h4>
                    <p className="text-xs sm:text-sm text-teal-700">
                      Choisissez vous-même où placer vos 2 périodes (min. 5j chacune)
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setCustomMode(true);
                      setTimeout(() => smoothScrollTo(customModeRef, -100), 300);
                    }}
                    className="flex-shrink-0 ml-4 px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-xl font-semibold transition-apple-smooth hover:shadow-lg hover:shadow-teal-200/50 hover:scale-[1.05] active:scale-[0.95] text-sm sm:text-base relative overflow-hidden"
                  >
                    <span className="relative z-10">Activer</span>
                  </button>
                </div>

                {/* Prévisualisation */}
                <div className="bg-white/80 rounded-xl p-3 sm:p-4">
                  <p className="text-xs text-slate-600 mb-2 text-center">Répartition par défaut : 10j + 11j</p>
                  <div className="flex gap-2">
                    <div className="flex-1 h-8 sm:h-10 bg-gradient-to-r from-teal-400 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-sm">
                      10 jours
                    </div>
                    <div className="flex-1 h-8 sm:h-10 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-sm">
                      11 jours
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions simples */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                <p className="text-sm text-slate-700 font-medium">
                  💡 <span className="font-semibold">Mode simple</span> : 1 clic sur le calendrier = 21 jours placés d'un coup
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Mode personnalisé actif */}
        {birthDate && mandatoryPeriod && remainingBlocks.length === 0 && customMode && !visualSelectionMode && (
          <div ref={customModeRef} className="max-w-3xl mx-auto mb-6 sm:mb-8 animate-spring-in scroll-mt-20">
            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl sm:rounded-3xl border-2 border-teal-300 p-6 sm:p-8 shadow-xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                    ⚙️
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-teal-900 mb-2">
                    Mode personnalisé
                  </h3>
                  <p className="text-sm sm:text-base text-teal-800 mb-4">
                    Choisissez votre méthode de sélection
                  </p>
                </div>
              </div>

              {/* Deux options : Slider ou Sélection visuelle */}
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {/* Option 1 : Avec Slider */}
                <div className="bg-white rounded-2xl p-5 border-2 border-teal-200 hover:border-teal-400 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-500 rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0">
                      🎚️
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Avec curseur</h4>
                      <p className="text-xs text-slate-600">Ajustez puis placez</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                    Utilisez le curseur pour choisir la répartition, puis cliquez 2 fois sur le calendrier
                  </p>
                </div>

                {/* Option 2 : Sélection visuelle */}
                <div className="bg-white rounded-2xl p-5 border-2 border-emerald-200 hover:border-emerald-400 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0">
                      👆
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Sélection directe</h4>
                      <p className="text-xs text-slate-600">Cliquez début + fin</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                    Cliquez sur la date de début, puis sur la date de fin de votre 1ère période
                  </p>
                  <button
                    onClick={handleStartVisualSelection}
                    className="w-full px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg text-sm font-semibold transition-apple-smooth hover:shadow-lg hover:shadow-emerald-200/50 hover:scale-[1.03] active:scale-[0.97] relative overflow-hidden"
                  >
                    <span className="relative z-10">Utiliser ce mode</span>
                  </button>
                </div>
              </div>

              {/* Slider personnalisé */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 mb-4 shadow-md">
                <div className="text-center mb-4">
                  <p className="text-sm font-semibold text-slate-700 mb-3">
                    Choisissez la répartition de vos 21 jours
                  </p>
                  <div className="flex gap-2 justify-center items-center mb-3">
                    <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-teal-400 to-teal-500 rounded-xl shadow-md">
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-white">{customFirstBlockDays}</div>
                        <div className="text-[10px] text-white/90">jours</div>
                      </div>
                    </div>
                    <div className="text-2xl text-slate-400 font-bold">+</div>
                    <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl shadow-md">
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-white">{21 - customFirstBlockDays}</div>
                        <div className="text-[10px] text-white/90">jours</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Barre visuelle */}
                <div className="flex gap-2 mb-4">
                  <div
                    className="h-12 bg-gradient-to-r from-teal-400 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm transition-all"
                    style={{ width: `${(customFirstBlockDays / 21) * 100}%` }}
                  >
                    Période 1
                  </div>
                  <div
                    className="h-12 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm transition-all"
                    style={{ width: `${((21 - customFirstBlockDays) / 21) * 100}%` }}
                  >
                    Période 2
                  </div>
                </div>

                {/* Slider */}
                <input
                  type="range"
                  min="5"
                  max="16"
                  value={customFirstBlockDays}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomFirstBlockDays(Number(e.target.value))}
                  className="w-full h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer slider-thumb mb-2"
                />
                <p className="text-xs text-slate-500 text-center">
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
                    Puis cliquez à nouveau pour placer le 2ème bloc de <span className="font-bold">{21 - customFirstBlockDays} jours</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setCustomMode(false)}
                className="w-full px-4 py-3 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-semibold transition-all hover:shadow-md border-2 border-slate-200 hover:border-slate-300"
              >
                Annuler et revenir au mode simple
              </button>
            </div>
          </div>
        )}


        {/* Message pendant le placement personnalisé */}
        {customMode && remainingBlocks.length === 1 && !visualSelectionMode && (
          <div className="max-w-3xl mx-auto mb-6 sm:mb-8 animate-slide-up">
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border-2 border-emerald-300 p-6 shadow-xl glow-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-500 to-green-500 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg animate-pulse-subtle flex-shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="text-lg sm:text-xl font-bold text-emerald-900 mb-1">
                    Placez maintenant le second bloc
                  </h4>
                  <p className="text-sm text-emerald-800">
                    Cliquez sur une date dans le calendrier pour placer les {21 - customFirstBlockDays} jours restants
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mode split actif - Instructions */}
        {splitMode !== 'idle' && splitConfig && (
          <div className="max-w-3xl mx-auto mb-8 animate-spring-in">
            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-3xl border-2 border-teal-300 p-8 shadow-xl">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg animate-pulse-subtle">
                    {splitMode === 'placing-first' ? '1' : '2'}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-teal-900 mb-2">
                    {splitMode === 'placing-first'
                      ? `Placez le premier bloc de ${splitConfig[0]} jours`
                      : `Placez le second bloc de ${splitConfig[1]} jours`}
                  </h3>
                  <p className="text-teal-800 mb-4">
                    👆 Cliquez sur une date dans le calendrier ci-dessus pour placer le {splitMode === 'placing-first' ? 'premier' : 'second'} bloc
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleCancelSplitMode}
                      className="px-6 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-semibold transition-all hover:shadow-md border-2 border-slate-200 hover:border-slate-300"
                    >
                      Annuler
                    </button>
                    {splitMode === 'placing-second' && (
                      <button
                        onClick={handleClearAllBlocks}
                        className="px-6 py-2.5 bg-white hover:bg-red-50 text-red-600 rounded-xl font-semibold transition-all hover:shadow-md border-2 border-red-200 hover:border-red-300"
                      >
                        Recommencer
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bouton Effacer tous les blocs */}
        {remainingBlocks.length > 0 && splitMode === 'idle' && (
          <div className="max-w-2xl mx-auto mb-8 animate-fade-in">
            <button
              onClick={handleClearAllBlocks}
              className="w-full px-4 py-3 bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 text-red-700 hover:text-red-800 border-2 border-red-200 hover:border-red-300 rounded-2xl text-sm font-semibold transition-all hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]"
            >
              🗑️ Effacer tous les blocs et recommencer
            </button>
          </div>
        )}

        {birthDate && (
          <>
            <div className="max-w-2xl mx-auto mb-8 animate-fade-in">
              <Summary
                birthDate={birthDate}
                employerPeriod={employerPeriod}
                mandatoryPeriod={mandatoryPeriod}
                remainingBlocks={remainingBlocks}
                onRemoveBlock={handleRemoveBlock}
              />
            </div>

            {mandatoryPeriod && (
              <div className="max-w-2xl mx-auto mb-8 animate-fade-in-delay">
                <LetterGenerator
                  birthDate={birthDate}
                  employerPeriod={employerPeriod}
                  mandatoryPeriod={mandatoryPeriod}
                  remainingBlocks={remainingBlocks}
                />
              </div>
            )}
          </>
        )}


        {birthDate && (
          <div className="text-center mt-8 max-w-2xl mx-auto animate-fade-in-delay">
            <button
              onClick={handleResetRequest}
              className="px-8 py-3 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 rounded-xl hover:from-slate-200 hover:to-slate-300 hover:shadow-lg transition-apple-smooth text-sm font-semibold active:scale-[0.96] hover:scale-[1.02] border border-slate-300/50 flex items-center gap-2 mx-auto"
            >
              <RotateCcw className="w-4 h-4" />
              Réinitialiser
            </button>
          </div>
        )}

        <div className="mt-16 max-w-2xl mx-auto mb-12">
          <LegalInfo />
        </div>
      </div>
    </div>
  );
}

export default App;
