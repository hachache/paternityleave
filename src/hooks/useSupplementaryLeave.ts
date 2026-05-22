import { useCallback, useEffect, useMemo, useState } from 'react';
import { addDays, isAfter, startOfDay } from 'date-fns';

import { LeaveBlock, LeaveScenarioConfig } from '../utils/paternityLeave';
import {
  SupplementaryLeaveDuration,
  SupplementaryLeaveMode,
  calculateSupplementaryLeavePeriod,
  calculateSupplementaryLeaveSplitBlocks,
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
  duration: SupplementaryLeaveDuration;
  mode: SupplementaryLeaveMode;
  secondStartDate: Date | null;
  eligibility: ReturnType<typeof getSupplementaryLeaveEligibility>;
  startDate: Date | null;
  periods: LeaveBlock[];
  firstPeriod: LeaveBlock | null;
  error: string | null;
  setEnabled: (enabled: boolean) => void;
  setDuration: (duration: SupplementaryLeaveDuration) => void;
  setMode: (mode: SupplementaryLeaveMode) => void;
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
  const [duration, setDuration] = useState<SupplementaryLeaveDuration>(1);
  const [mode, setMode] = useState<SupplementaryLeaveMode>('consecutive');
  const [secondStartDate, setSecondStartDate] = useState<Date | null>(null);

  const eligibility = useMemo(
    () => getSupplementaryLeaveEligibility(birthDate, scenario),
    [birthDate, scenario]
  );

  const startDate = useMemo(() => {
    if (!paternityEndDate) return null;
    return addDays(startOfDay(paternityEndDate), 1);
  }, [paternityEndDate]);

  const reset = useCallback(() => {
    setEnabled(false);
    setDuration(1);
    setMode('consecutive');
    setSecondStartDate(null);
  }, []);

  useEffect(() => {
    if (enabled && (!isPaternityPlanComplete || !eligibility.canActivate)) {
      setEnabled(false);
    }
  }, [enabled, eligibility.canActivate, isPaternityPlanComplete]);

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
    if (!startDate) return [];
    if (!isPaternityPlanComplete) return [];

    const legalLimit = eligibility.limitDate;
    if (!legalLimit) return [];

    if (mode === 'split' && duration === 2) {
      if (!secondStartDate) return [];
      const validation = calculateSupplementaryLeaveSplitBlocks(
        startDate,
        secondStartDate,
        startDate,
        legalLimit
      );
      return validation.valid ? validation.blocks : [];
    }

    const projected = calculateSupplementaryLeavePeriod(startDate, duration);
    if (isAfter(projected.end, legalLimit)) return [];
    return [projected];
  }, [
    duration,
    eligibility.limitDate,
    enabled,
    mode,
    secondStartDate,
    startDate,
    isPaternityPlanComplete
  ]);

  const error = useMemo(() => {
    if (!enabled) return null;
    if (!eligibility.canActivate) {
      return eligibility.reason;
    }
    if (!isPaternityPlanComplete) {
      return 'Planifiez d’abord 100% du congé initial pour projeter ce congé.';
    }
    if (!startDate) {
      return 'Date de début indisponible.';
    }
    const legalLimit = eligibility.limitDate;
    if (!legalLimit) {
      return 'Date limite légale indisponible.';
    }

    if (mode === 'split' && duration === 2) {
      if (!secondStartDate) {
        return 'Sélectionnez la date de début de la seconde période d’1 mois.';
      }
      const validation = calculateSupplementaryLeaveSplitBlocks(
        startDate,
        secondStartDate,
        startDate,
        legalLimit
      );
      return validation.error;
    }

    const projected = calculateSupplementaryLeavePeriod(startDate, duration);
    if (isAfter(projected.end, legalLimit)) {
      return 'La période projetée dépasse le délai légal de prise.';
    }
    return null;
  }, [
    duration,
    eligibility.canActivate,
    eligibility.limitDate,
    eligibility.reason,
    enabled,
    mode,
    secondStartDate,
    startDate,
    isPaternityPlanComplete
  ]);

  return {
    enabled,
    duration,
    mode,
    secondStartDate,
    eligibility,
    startDate,
    periods,
    firstPeriod: periods[0] ?? null,
    error,
    setEnabled,
    setDuration,
    setMode,
    setSecondStartDate,
    reset
  };
}
