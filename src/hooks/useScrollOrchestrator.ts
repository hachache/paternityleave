import React, { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Hook centralisant la logique de scroll (apparition de l'ancre, scroll fluide
 * vers les sections, déclenchements après changements d'état).
 *
 * Séparé d'App.tsx pour conserver le composant lisible et permettre des tests
 * unitaires futurs sur la mécanique de scroll.
 */
interface UseScrollOrchestratorOptions {
  birthDate: Date | null;
  mandatoryPeriodPresent: boolean;
  remainingBlocksCount: number;
  customMode: boolean;
  scenarioId: string;
  totalPlannedDays: number;
  totalFractionableDays: number;
  /** Évite un double scroll : la modale de célébration gère le défilement à la fermeture. */
  skipAutoScrollOnPlanningComplete: boolean;
}

interface ScrollOrchestrator {
  calendarRef: React.RefObject<HTMLDivElement>;
  planningRef: React.RefObject<HTMLDivElement>;
  customModeRef: React.RefObject<HTMLDivElement>;
  supplementaryLeaveRef: React.RefObject<HTMLDivElement>;
  letterRef: React.RefObject<HTMLDivElement>;
  hasScrolledPastStart: boolean;
  scheduleSmoothScroll: (ref: React.RefObject<HTMLDivElement>) => void;
  scrollIntoViewIfNeeded: (ref: React.RefObject<HTMLDivElement>) => void;
  /** Congé supplémentaire si monté, sinon courrier — après fin de planning ou fermeture modale. */
  schedulePostPlanningScroll: () => void;
}

export function useScrollOrchestrator({
  birthDate,
  mandatoryPeriodPresent,
  remainingBlocksCount,
  customMode,
  scenarioId,
  totalPlannedDays,
  totalFractionableDays,
  skipAutoScrollOnPlanningComplete
}: UseScrollOrchestratorOptions): ScrollOrchestrator {
  const [hasScrolledPastStart, setHasScrolledPastStart] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const planningRef = useRef<HTMLDivElement>(null);
  const customModeRef = useRef<HTMLDivElement>(null);
  const supplementaryLeaveRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const previousScenarioId = useRef(scenarioId);
  const previousBirthDateTs = useRef<number | null>(null);
  const previousPlannedDays = useRef(totalPlannedDays);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolledPastStart(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const schedulePostPlanningScroll = useCallback(() => {
    requestAnimationFrame(() => {
      const targetRef = supplementaryLeaveRef.current ? supplementaryLeaveRef : letterRef;
      scrollIntoViewIfNeeded(targetRef);
    });
  }, [scrollIntoViewIfNeeded]);

  useEffect(() => {
    if (previousScenarioId.current !== scenarioId && !birthDate) {
      scheduleSmoothScroll(calendarRef);
    }
    previousScenarioId.current = scenarioId;
  }, [scenarioId, birthDate, scheduleSmoothScroll]);

  useEffect(() => {
    const planningIntroVisible = Boolean(
      birthDate && mandatoryPeriodPresent && remainingBlocksCount === 0 && !customMode
    );
    if (!planningIntroVisible) return;
    const ts = birthDate ? birthDate.getTime() : null;
    if (ts && previousBirthDateTs.current !== ts) {
      previousBirthDateTs.current = ts;
      scheduleSmoothScroll(planningRef);
    }
  }, [birthDate, mandatoryPeriodPresent, remainingBlocksCount, customMode, scheduleSmoothScroll]);

  useEffect(() => {
    const planningJustCompleted =
      mandatoryPeriodPresent &&
      previousPlannedDays.current < totalFractionableDays &&
      totalPlannedDays === totalFractionableDays;

    if (!planningJustCompleted) {
      previousPlannedDays.current = totalPlannedDays;
      return;
    }

    if (skipAutoScrollOnPlanningComplete) {
      previousPlannedDays.current = totalPlannedDays;
      return;
    }

    const frameId = requestAnimationFrame(() => {
      const targetRef = supplementaryLeaveRef.current ? supplementaryLeaveRef : letterRef;
      scrollIntoViewIfNeeded(targetRef);
      previousPlannedDays.current = totalPlannedDays;
    });

    return () => cancelAnimationFrame(frameId);
  }, [
    mandatoryPeriodPresent,
    skipAutoScrollOnPlanningComplete,
    scrollIntoViewIfNeeded,
    totalFractionableDays,
    totalPlannedDays
  ]);

  return {
    calendarRef,
    planningRef,
    customModeRef,
    supplementaryLeaveRef,
    letterRef,
    hasScrolledPastStart,
    scheduleSmoothScroll,
    scrollIntoViewIfNeeded,
    schedulePostPlanningScroll
  };
}
