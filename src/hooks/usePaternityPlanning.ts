import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { differenceInDays, isAfter, startOfDay } from 'date-fns';
import {
  calculateAutomaticRemainingPeriod,
  calculateEmployerPeriod,
  calculateMandatoryPeriod,
  calculateTotalUsedDays,
  validateRemainingBlock,
  LeaveBlock,
  LeaveScenarioConfig,
  LeaveScenarioId,
  DEFAULT_LEAVE_SCENARIO_ID,
  getLeaveScenarioConfig
} from '../utils/paternityLeave';
import { validateBirthDate } from '../utils/dateValidation';
import { useSupplementaryLeave } from './useSupplementaryLeave';
import { getScenarioVocabulary } from '../utils/scenarioVocabulary';

export type SelectionStep = 'idle' | 'selecting-start' | 'selecting-end';

export function usePaternityPlanning() {
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [employerPeriod, setEmployerPeriod] = useState<LeaveBlock | null>(null);
  const [mandatoryPeriod, setMandatoryPeriod] = useState<LeaveBlock | null>(null);
  const [remainingBlocks, setRemainingBlocks] = useState<LeaveBlock[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showScenarioConfirm, setShowScenarioConfirm] = useState(false);
  const pendingScenarioRef = useRef<LeaveScenarioId | null>(null);
  const [customMode, setCustomMode] = useState(false);
  const [scenarioId, setScenarioId] = useState<LeaveScenarioId>(DEFAULT_LEAVE_SCENARIO_ID);
  const [customFirstBlockDays, setCustomFirstBlockDays] = useState(() => {
    const config = getLeaveScenarioConfig(DEFAULT_LEAVE_SCENARIO_ID);
    return Math.max(5, Math.min(10, config.fractionableDays - 5));
  });
  const [visualSelectionMode, setVisualSelectionMode] = useState(false);
  const [selectionStep, setSelectionStep] = useState<SelectionStep>('idle');
  const [selectionStartDate, setSelectionStartDate] = useState<Date | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const computeDefaultFirstBlock = useCallback(
    (config: LeaveScenarioConfig) =>
      Math.max(5, Math.min(10, config.fractionableDays - 5)),
    []
  );
  const scenario = useMemo<LeaveScenarioConfig>(
    () => getLeaveScenarioConfig(scenarioId),
    [scenarioId]
  );
  const totalFractionableDays = scenario.fractionableDays;
  const minBlockLength = 5;
  const maxFirstBlockLength = Math.max(minBlockLength, totalFractionableDays - minBlockLength);

  const hasShownCelebration = useRef(false);
  const previousScenarioRef = useRef<LeaveScenarioId>(scenarioId);

  const totalPlannedDays = useMemo(
    () => calculateTotalUsedDays(remainingBlocks),
    [remainingBlocks]
  );

  const isPaternityPlanComplete = useMemo(
    () => Boolean(mandatoryPeriod) && totalPlannedDays === totalFractionableDays,
    [mandatoryPeriod, totalPlannedDays, totalFractionableDays]
  );

  const celebrationPendingOnPlanningComplete = useMemo(
    () =>
      isPaternityPlanComplete &&
      Boolean(birthDate && mandatoryPeriod && remainingBlocks.length > 0) &&
      !hasShownCelebration.current,
    [birthDate, mandatoryPeriod, remainingBlocks.length, isPaternityPlanComplete]
  );

  const paternityEndDate = useMemo(() => {
    if (!mandatoryPeriod) return null;
    return remainingBlocks.reduce(
      (latestEnd, block) => (isAfter(block.end, latestEnd) ? block.end : latestEnd),
      mandatoryPeriod.end
    );
  }, [mandatoryPeriod, remainingBlocks]);

  const supplementary = useSupplementaryLeave({
    birthDate,
    scenario,
    paternityEndDate,
    isPaternityPlanComplete
  });
  const resetSupplementary = supplementary.reset;

  useEffect(() => {
    if (birthDate && mandatoryPeriod && remainingBlocks.length > 0) {
      if (totalPlannedDays === totalFractionableDays && !hasShownCelebration.current) {
        hasShownCelebration.current = true;
        const timer = setTimeout(() => setShowCelebration(true), 500);
        return () => clearTimeout(timer);
      }
    }
    return undefined;
  }, [birthDate, mandatoryPeriod, remainingBlocks, totalFractionableDays, totalPlannedDays]);

  useEffect(() => {
    if (previousScenarioRef.current !== scenarioId) {
      previousScenarioRef.current = scenarioId;
      setCustomMode(false);
      setVisualSelectionMode(false);
      setSelectionStep('idle');
      setSelectionStartDate(null);
      setBirthDate(null);
      setCustomFirstBlockDays(computeDefaultFirstBlock(scenario));
      setRemainingBlocks([]);
      setSuccessMessage(null);
      setShowCelebration(false);
      resetSupplementary();

      if (totalPlannedDays > totalFractionableDays) {
        setError(
          `Le scénario sélectionné prévoit ${totalFractionableDays} jours fractionnables. Votre planning a été réinitialisé.`
        );
      } else {
        setError(null);
      }

      hasShownCelebration.current = false;
    }
  }, [
    computeDefaultFirstBlock,
    resetSupplementary,
    scenario,
    scenarioId,
    totalFractionableDays,
    totalPlannedDays
  ]);

  const planningStep = useMemo(() => {
    if (!birthDate) return 1;
    if (!mandatoryPeriod) return 2;
    if (totalPlannedDays >= totalFractionableDays) return 4;
    return 3;
  }, [birthDate, mandatoryPeriod, totalFractionableDays, totalPlannedDays]);

  const selectBirthDate = (date: Date) => {
    const normalized = startOfDay(date);
    
    // Validation complete de la date de naissance
    const vocabulary = getScenarioVocabulary(scenario);
    const validation = validateBirthDate(normalized, {
      eventName: vocabulary.eventName,
      eventDateLabel: vocabulary.eventDateActionLabel
    });
    
    if (!validation.valid) {
      setError(validation.error || 'Date de naissance invalide');
      return;
    }

    setBirthDate(normalized);

    const employer = calculateEmployerPeriod(normalized);
    setEmployerPeriod(employer);

    const mandatory = calculateMandatoryPeriod(employer.end);
    setMandatoryPeriod(mandatory);

    setRemainingBlocks([]);
    setError(null);
    
    // Afficher un avertissement si date passee ou cas particulier
    if (validation.warning) {
      setSuccessMessage(validation.warning);
    } else {
      setSuccessMessage(null);
    }
    
    setCustomMode(false);
    setVisualSelectionMode(false);
    setSelectionStep('idle');
    setSelectionStartDate(null);
    setShowCelebration(false);
    hasShownCelebration.current = false;
    resetSupplementary();
  };

  const selectRemainingDay = (date: Date) => {
    const normalized = startOfDay(date);
    setError(null);
    setSuccessMessage(null);

    if (!birthDate || !mandatoryPeriod) return;
    const eventName = scenario.id === 'adoption' ? "l'arrivée au foyer" : 'la naissance';

    if (visualSelectionMode && selectionStep === 'selecting-start') {
      if (normalized < birthDate) {
        setError(`Les jours fractionnables ne peuvent pas être posés avant ${eventName}`);
        return;
      }

      setSelectionStartDate(normalized);
      setSelectionStep('selecting-end');
      setSuccessMessage(
        `Date de début sélectionnée : ${normalized.toLocaleDateString(
          'fr-FR'
        )}. Cliquez maintenant sur la date de FIN de votre première période.`
      );
      return;
    }

    if (visualSelectionMode && selectionStep === 'selecting-end' && selectionStartDate) {
      const daysDiff = differenceInDays(normalized, selectionStartDate) + 1;

      if (daysDiff < minBlockLength) {
        setError('La première période doit contenir au minimum 5 jours');
        return;
      }

      if (daysDiff > maxFirstBlockLength) {
        setError(
          `La première période ne peut pas dépasser ${maxFirstBlockLength} jours (il doit rester au moins ${minBlockLength} jours pour la 2ème période)`
        );
        return;
      }

      if (normalized <= selectionStartDate) {
        setError('La date de fin doit être après la date de début');
        return;
      }

      const firstBlock: LeaveBlock = {
        start: selectionStartDate,
        end: normalized,
        days: daysDiff,
        type: 'remaining'
      };

      const validation = validateRemainingBlock(
        firstBlock.start,
        firstBlock.end,
        birthDate,
        employerPeriod,
        mandatoryPeriod,
        [],
        0,
        scenario
      );

      if (!validation.valid) {
        setError(validation.error || 'Bloc invalide');
        return;
      }

      const remainingAfterFirst = totalFractionableDays - daysDiff;
      setRemainingBlocks([firstBlock]);
      setVisualSelectionMode(false);
      setSelectionStep('idle');
      setSelectionStartDate(null);
      setCustomMode(false);
      setSuccessMessage(
        `Premier bloc de ${daysDiff} jours placé. Cliquez sur le calendrier pour placer les ${remainingAfterFirst} jours restants.`
      );
      return;
    }

    if (customMode && remainingBlocks.length === 0) {
      if (normalized < birthDate) {
        setError(`Les jours fractionnables ne peuvent pas être posés avant ${eventName}`);
        return;
      }

      const firstBlock = calculateAutomaticRemainingPeriod(
        birthDate,
        normalized,
        customFirstBlockDays,
        scenario
      );

      if (!firstBlock) {
        setError(
          `Impossible de planifier à partir de cette date : la période dépasse les ${scenario.limitMonthsAfterBirth} mois après ${eventName}`
        );
        return;
      }

      const validation = validateRemainingBlock(
        firstBlock.start,
        firstBlock.end,
        birthDate,
        employerPeriod,
        mandatoryPeriod,
        remainingBlocks,
        0,
        scenario
      );

      if (!validation.valid) {
        setError(validation.error || 'Bloc invalide');
        return;
      }

      const remainingAfterFirst = totalFractionableDays - customFirstBlockDays;
      setRemainingBlocks([firstBlock]);
      setSuccessMessage(
        `Premier bloc de ${customFirstBlockDays} jours placé. Cliquez sur une autre date pour placer les ${remainingAfterFirst} jours restants.`
      );
      return;
    }

    if (customMode && remainingBlocks.length === 1) {
      const remainingDays = totalFractionableDays - customFirstBlockDays;
      const secondBlock = calculateAutomaticRemainingPeriod(
        birthDate,
        normalized,
        remainingDays,
        scenario
      );

      if (!secondBlock) {
        setError(
          `Impossible de planifier à partir de cette date : la période dépasse les ${scenario.limitMonthsAfterBirth} mois après ${eventName}`
        );
        return;
      }

      const validation = validateRemainingBlock(
        secondBlock.start,
        secondBlock.end,
        birthDate,
        employerPeriod,
        mandatoryPeriod,
        remainingBlocks,
        customFirstBlockDays,
        scenario
      );

      if (!validation.valid) {
        setError(validation.error || 'Bloc invalide');
        return;
      }

      setRemainingBlocks(prev => [...prev, secondBlock]);
      setCustomMode(false);
      setSuccessMessage(
        `Planning complet. Les ${totalFractionableDays} jours ont été planifiés en 2 périodes personnalisées.`
      );
      return;
    }

    const totalUsedDays = calculateTotalUsedDays(remainingBlocks);
    const daysLeft = totalFractionableDays - totalUsedDays;

    if (daysLeft === 0) {
      return;
    }

    const autoBlock = calculateAutomaticRemainingPeriod(
      birthDate,
      normalized,
      daysLeft,
      scenario
    );

    if (!autoBlock) {
      setError(
        `Impossible de planifier à partir de cette date : la période dépasse les ${scenario.limitMonthsAfterBirth} mois après ${eventName}`
      );
      return;
    }

    const validation = validateRemainingBlock(
      autoBlock.start,
      autoBlock.end,
      birthDate,
      employerPeriod,
      mandatoryPeriod,
      remainingBlocks,
      totalUsedDays,
      scenario
    );

    if (!validation.valid) {
      setError(validation.error || 'Bloc invalide');
      return;
    }

    setRemainingBlocks(prev => [...prev, autoBlock]);
    setError(null);
    if (!customMode && totalUsedDays + autoBlock.days === totalFractionableDays) {
      setSuccessMessage(`Les ${totalFractionableDays} jours ont été planifiés automatiquement.`);
    } else if (!customMode) {
      const blocDays = autoBlock.days;
      setSuccessMessage(`Bloc de ${blocDays} jours planifié. ${totalFractionableDays - totalUsedDays - autoBlock.days} jours restants.`);
    }
  };

  const handleScenarioChange = (id: LeaveScenarioId) => {
    if (birthDate || remainingBlocks.length > 0) {
      pendingScenarioRef.current = id;
      setShowScenarioConfirm(true);
    } else {
      setScenarioId(id);
    }
  };

  const confirmScenarioChange = () => {
    if (pendingScenarioRef.current) {
      setScenarioId(pendingScenarioRef.current);
      pendingScenarioRef.current = null;
    }
    setShowScenarioConfirm(false);
  };

  const cancelScenarioChange = () => {
    pendingScenarioRef.current = null;
    setShowScenarioConfirm(false);
  };

  const requestReset = () => {
    if (!birthDate) return;
    setShowResetConfirm(true);
  };

  const confirmReset = () => {
    setBirthDate(null);
    setEmployerPeriod(null);
    setMandatoryPeriod(null);
    setRemainingBlocks([]);
    setError(null);
    setSuccessMessage(null);
    setShowResetConfirm(false);
    setShowCelebration(false);
    hasShownCelebration.current = false;
    setCustomMode(false);
    setVisualSelectionMode(false);
    setSelectionStep('idle');
    setSelectionStartDate(null);
    resetSupplementary();
  };

  const cancelReset = () => {
    setShowResetConfirm(false);
  };

  const removeBlock = (index: number) => {
    setRemainingBlocks(prev => prev.filter((_, i) => i !== index));
    hasShownCelebration.current = false;
  };

  const clearAllBlocks = () => {
    setRemainingBlocks([]);
    setError(null);
    setSuccessMessage(null);
    setCustomMode(false);
    setVisualSelectionMode(false);
    setSelectionStep('idle');
    setSelectionStartDate(null);
    hasShownCelebration.current = false;
    resetSupplementary();
  };

  const startVisualSelection = () => {
    setVisualSelectionMode(true);
    setSelectionStep('selecting-start');
    setSuccessMessage('Mode sélection visuelle activé. Cliquez sur la date de DÉBUT de votre première période.');
  };

  const cancelVisualSelection = () => {
    setVisualSelectionMode(false);
    setSelectionStep('idle');
    setSelectionStartDate(null);
    setError(null);
    setSuccessMessage(null);
  };

  const hideCelebration = () => {
    setShowCelebration(false);
  };

  return {
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
    planningStep,
    totalPlannedDays,
    totalFractionableDays,
    scenario,
    scenarioId,
    setScenarioId,
    handleScenarioChange,
    confirmScenarioChange,
    cancelScenarioChange,
    setCustomMode,
    setCustomFirstBlockDays,
    isPaternityPlanComplete,
    celebrationPendingOnPlanningComplete,
    supplementaryLeaveEnabled: supplementary.enabled,
    supplementaryLeaveDuration: supplementary.duration,
    supplementaryLeaveMode: supplementary.mode,
    supplementaryLeaveFirstStartDate: supplementary.firstStartDate,
    supplementaryLeaveSecondStartDate: supplementary.secondStartDate,
    supplementaryLeaveEligibility: supplementary.eligibility,
    supplementaryLeaveEarliestStartDate: supplementary.earliestStartDate,
    supplementaryLeavePeriod: supplementary.firstPeriod,
    supplementaryLeavePeriods: supplementary.periods,
    supplementaryLeaveError: supplementary.error,
    setSupplementaryLeaveEnabled: supplementary.setEnabled,
    setSupplementaryLeaveDuration: supplementary.setDuration,
    setSupplementaryLeaveMode: supplementary.setMode,
    setSupplementaryLeaveFirstStartDate: supplementary.setFirstStartDate,
    setSupplementaryLeaveSecondStartDate: supplementary.setSecondStartDate
  };
}
