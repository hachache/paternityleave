import { useCallback, useEffect, useMemo, useState } from 'react';
import { isAfter, isBefore, startOfDay } from 'date-fns';

import { LeaveBlock, LeaveScenarioConfig } from '../utils/paternityLeave';
import {
  SupplementaryLeaveDuration,
  SupplementaryLeaveMode,
  calculateSupplementaryLeavePeriod,
  calculateSupplementaryLeaveSplitBlocks,
  getSupplementaryLeaveEarliestStartInfo,
  getSupplementaryLeaveEligibility
} from '../utils/supplementaryBirthLeave';

interface UseSupplementaryLeaveOptions {
  birthDate: Date | null;
  scenario: LeaveScenarioConfig;
  paternityEndDate: Date | null;
  isPaternityPlanComplete: boolean;
}

export interface SupplementaryLeaveState {
  enabled: boolean;
  prematureExpectedAfterMinDate: boolean;
  duration: SupplementaryLeaveDuration;
  mode: SupplementaryLeaveMode;
  firstStartDate: Date | null;
  secondStartDate: Date | null;
  eligibility: ReturnType<typeof getSupplementaryLeaveEligibility>;
  startInfo: ReturnType<typeof getSupplementaryLeaveEarliestStartInfo> | null;
  startDate: Date | null;
  periods: LeaveBlock[];
  firstPeriod: LeaveBlock | null;
  error: string | null;
  setEnabled: (enabled: boolean) => void;
  setPrematureExpectedAfterMinDate: (enabled: boolean) => void;
  setDuration: (duration: SupplementaryLeaveDuration) => void;
  setMode: (mode: SupplementaryLeaveMode) => void;
  setFirstStartDate: (date: Date | null) => void;
  setSecondStartDate: (date: Date | null) => void;
  reset: () => void;
}

/**
 * Hook dédié au congé supplémentaire de naissance (LFSS 2026, art. 99-V).
 *
 * Encapsule la sélection durée/mode/dates et la validation du calcul, pour
 * garder `usePaternityPlanning` focalisé sur le congé paternité classique.
 */
export function useSupplementaryLeave({
  birthDate,
  scenario,
  paternityEndDate,
  isPaternityPlanComplete
}: UseSupplementaryLeaveOptions): SupplementaryLeaveState {
  const [enabled, setEnabled] = useState(false);
  const [prematureExpectedAfterMinDate, setPrematureExpectedAfterMinDate] = useState(false);
  const [duration, setDuration] = useState<SupplementaryLeaveDuration>(1);
  const [mode, setMode] = useState<SupplementaryLeaveMode>('consecutive');
  const [firstStartDate, setFirstStartDate] = useState<Date | null>(null);
  const [secondStartDate, setSecondStartDate] = useState<Date | null>(null);

  const eligibility = useMemo(
    () => getSupplementaryLeaveEligibility(birthDate, scenario, new Date(), {
      prematureExpectedAfterMinDate
    }),
    [birthDate, prematureExpectedAfterMinDate, scenario]
  );

  const startInfo = useMemo(() => {
    if (!paternityEndDate) return null;
    return getSupplementaryLeaveEarliestStartInfo(
      paternityEndDate,
      eligibility.activationDate,
      birthDate
    );
  }, [birthDate, eligibility.activationDate, paternityEndDate]);
  const startDate = startInfo?.startDate ?? null;
  const selectedStartDate = useMemo(() => {
    if (!startDate) return null;
    return firstStartDate ? startOfDay(firstStartDate) : startDate;
  }, [firstStartDate, startDate]);

  const reset = useCallback(() => {
    setEnabled(false);
    setPrematureExpectedAfterMinDate(false);
    setDuration(1);
    setMode('consecutive');
    setFirstStartDate(null);
    setSecondStartDate(null);
  }, []);

  useEffect(() => {
    if (enabled && (!isPaternityPlanComplete || !eligibility.canPlan)) {
      setEnabled(false);
    }
  }, [enabled, eligibility.canPlan, isPaternityPlanComplete]);

  useEffect(() => {
    if (duration === 1 && mode === 'split') {
      setMode('consecutive');
      setSecondStartDate(null);
    }
  }, [duration, mode]);

  useEffect(() => {
    if (mode !== 'split') {
      setSecondStartDate(null);
    }
  }, [mode]);

  const periods = useMemo<LeaveBlock[]>(() => {
    if (!enabled) return [];
    if (!startDate || !selectedStartDate) return [];
    if (!isPaternityPlanComplete) return [];

    const legalLimit = eligibility.limitDate;
    if (!legalLimit) return [];
    if (isBefore(selectedStartDate, startDate) || isAfter(selectedStartDate, legalLimit)) return [];

    if (mode === 'split' && duration === 2) {
      if (!secondStartDate) return [];
      const validation = calculateSupplementaryLeaveSplitBlocks(
        selectedStartDate,
        secondStartDate,
        startDate,
        legalLimit
      );
      return validation.valid ? validation.blocks : [];
    }

    const projected = calculateSupplementaryLeavePeriod(selectedStartDate, duration);
    if (isAfter(projected.end, legalLimit)) return [];
    return [projected];
  }, [
    duration,
    eligibility.limitDate,
    enabled,
    selectedStartDate,
    mode,
    secondStartDate,
    startDate,
    isPaternityPlanComplete
  ]);

  const error = useMemo(() => {
    if (!enabled) return null;
    if (!eligibility.canPlan) {
      return eligibility.reason;
    }
    if (!isPaternityPlanComplete) {
      return 'Planifiez d’abord 100% du congé initial pour projeter ce congé.';
    }
    if (!startDate || !selectedStartDate) {
      return 'Date de début indisponible.';
    }
    const legalLimit = eligibility.limitDate;
    if (!legalLimit) {
      return 'Date limite légale indisponible.';
    }
    if (isBefore(selectedStartDate, startDate)) {
      return 'La date de début choisie est antérieure à la date minimale autorisée.';
    }
    if (isAfter(selectedStartDate, legalLimit)) {
      return 'La date de début choisie dépasse la date limite légale.';
    }

    if (mode === 'split' && duration === 2) {
      if (!secondStartDate) {
        return 'Sélectionnez la date de début de la seconde période d’1 mois.';
      }
      const validation = calculateSupplementaryLeaveSplitBlocks(
        selectedStartDate,
        secondStartDate,
        startDate,
        legalLimit
      );
      return validation.error;
    }

    const projected = calculateSupplementaryLeavePeriod(selectedStartDate, duration);
    if (isAfter(projected.end, legalLimit)) {
      return 'La période projetée dépasse le délai légal de prise.';
    }
    return null;
  }, [
    duration,
    eligibility.canPlan,
    eligibility.limitDate,
    eligibility.reason,
    enabled,
    mode,
    selectedStartDate,
    secondStartDate,
    startDate,
    isPaternityPlanComplete
  ]);

  return {
    enabled,
    prematureExpectedAfterMinDate,
    duration,
    mode,
    firstStartDate,
    secondStartDate,
    eligibility,
    startInfo,
    startDate: selectedStartDate,
    periods,
    firstPeriod: periods[0] ?? null,
    error,
    setEnabled,
    setPrematureExpectedAfterMinDate,
    setDuration,
    setMode,
    setFirstStartDate,
    setSecondStartDate,
    reset
  };
}
