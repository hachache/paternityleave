import { useEffect, useMemo, useRef, useState } from 'react';
import { differenceInDays, startOfDay } from 'date-fns';
import {
  calculateAutomaticRemainingPeriod,
  calculateEmployerPeriod,
  calculateMandatoryPeriod,
  calculateTotalUsedDays,
  validateRemainingBlock,
  LeaveBlock
} from '../utils/paternityLeave';

export type SelectionStep = 'idle' | 'selecting-start' | 'selecting-end';

export function usePaternityPlanning() {
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [employerPeriod, setEmployerPeriod] = useState<LeaveBlock | null>(null);
  const [mandatoryPeriod, setMandatoryPeriod] = useState<LeaveBlock | null>(null);
  const [remainingBlocks, setRemainingBlocks] = useState<LeaveBlock[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [customMode, setCustomMode] = useState(false);
  const [customFirstBlockDays, setCustomFirstBlockDays] = useState(10);
  const [visualSelectionMode, setVisualSelectionMode] = useState(false);
  const [selectionStep, setSelectionStep] = useState<SelectionStep>('idle');
  const [selectionStartDate, setSelectionStartDate] = useState<Date | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const hasShownCelebration = useRef(false);

  const totalPlannedDays = useMemo(
    () => calculateTotalUsedDays(remainingBlocks),
    [remainingBlocks]
  );

  useEffect(() => {
    if (birthDate && mandatoryPeriod && remainingBlocks.length > 0) {
      if (totalPlannedDays === 21 && !hasShownCelebration.current) {
        hasShownCelebration.current = true;
        const timer = setTimeout(() => setShowCelebration(true), 500);
        return () => clearTimeout(timer);
      }
    }
    return undefined;
  }, [birthDate, mandatoryPeriod, remainingBlocks, totalPlannedDays]);

  const planningStep = useMemo(() => {
    if (!birthDate) return 1;
    if (totalPlannedDays === 21) return 3;
    return 2;
  }, [birthDate, totalPlannedDays]);

  const selectBirthDate = (date: Date) => {
    const normalized = startOfDay(date);
    setBirthDate(normalized);

    const employer = calculateEmployerPeriod(normalized);
    setEmployerPeriod(employer);

    const mandatory = calculateMandatoryPeriod(employer.end);
    setMandatoryPeriod(mandatory);

    setRemainingBlocks([]);
    setError(null);
    setSuccessMessage(null);
    setCustomMode(false);
    setVisualSelectionMode(false);
    setSelectionStep('idle');
    setSelectionStartDate(null);
    setShowCelebration(false);
    hasShownCelebration.current = false;
  };

  const selectRemainingDay = (date: Date) => {
    const normalized = startOfDay(date);
    setError(null);
    setSuccessMessage(null);

    if (!birthDate || !mandatoryPeriod) return;

    if (visualSelectionMode && selectionStep === 'selecting-start') {
      if (normalized < birthDate) {
        setError('Les jours fractionnables ne peuvent pas être posés avant la date de naissance');
        return;
      }

      setSelectionStartDate(normalized);
      setSelectionStep('selecting-end');
      setSuccessMessage(
        `✅ Date de début sélectionnée : ${normalized.toLocaleDateString('fr-FR')}. Cliquez maintenant sur la date de FIN de votre première période.`
      );
      return;
    }

    if (visualSelectionMode && selectionStep === 'selecting-end' && selectionStartDate) {
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
      setSuccessMessage(
        `✅ Premier bloc de ${daysDiff} jours placé ! Cliquez sur le calendrier pour placer les ${21 - daysDiff} jours restants.`
      );
      return;
    }

    if (customMode && remainingBlocks.length === 0) {
      if (normalized < birthDate) {
        setError('Les jours fractionnables ne peuvent pas être posés avant la date de naissance');
        return;
      }

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

      setRemainingBlocks([firstBlock]);
      setSuccessMessage(
        `✅ Premier bloc de ${customFirstBlockDays} jours placé ! Cliquez sur une autre date pour placer les ${21 - customFirstBlockDays} jours restants.`
      );
      return;
    }

    if (customMode && remainingBlocks.length === 1) {
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

      setRemainingBlocks(prev => [...prev, secondBlock]);
      setCustomMode(false);
      setSuccessMessage('🎉 Planning complet ! Les 21 jours ont été planifiés en 2 périodes personnalisées.');
      return;
    }

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

    setRemainingBlocks(prev => [...prev, autoBlock]);
    setError(null);
    if (!customMode) {
      setSuccessMessage('✅ Les 21 jours ont été planifiés automatiquement !');
    }
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
  };

  const startVisualSelection = () => {
    setVisualSelectionMode(true);
    setSelectionStep('selecting-start');
    setSuccessMessage('🎯 Mode sélection visuelle activé ! Cliquez sur la date de DÉBUT de votre première période.');
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
    setCustomMode,
    setCustomFirstBlockDays
  };
}
