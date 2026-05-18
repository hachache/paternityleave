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
}

interface ScrollOrchestrator {
  calendarRef: React.RefObject<HTMLDivElement>;
  planningRef: React.RefObject<HTMLDivElement>;
  customModeRef: React.RefObject<HTMLDivElement>;
  letterRef: React.RefObject<HTMLDivElement>;
  hasScrolledPastStart: boolean;
  scheduleSmoothScroll: (ref: React.RefObject<HTMLDivElement>) => void;
  scrollIntoViewIfNeeded: (ref: React.RefObject<HTMLDivElement>) => void;
}

export function useScrollOrchestrator({
  birthDate,
  mandatoryPeriodPresent,
  remainingBlocksCount,
  customMode,
  scenarioId,
  totalPlannedDays,
  totalFractionableDays
}: UseScrollOrchestratorOptions): ScrollOrchestrator {
  const [hasScrolledPastStart, setHasScrolledPastStart] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const planningRef = useRef<HTMLDivElement>(null);
  const customModeRef = useRef<HTMLDivElement>(null);
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
    if (
      previousPlannedDays.current < totalFractionableDays &&
      totalPlannedDays === totalFractionableDays
    ) {
      scrollIntoViewIfNeeded(letterRef);
    }
    previousPlannedDays.current = totalPlannedDays;
  }, [scrollIntoViewIfNeeded, totalFractionableDays, totalPlannedDays]);

  return {
    calendarRef,
    planningRef,
    customModeRef,
    letterRef,
    hasScrolledPastStart,
    scheduleSmoothScroll,
    scrollIntoViewIfNeeded
  };
}
