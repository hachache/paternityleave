import { useEffect, useState } from 'react';
import type { Transition, Variants } from 'framer-motion';
import { useMediaQuery } from '../hooks/useMediaQuery';

const fluidEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const springs = {
  soft: { type: 'spring', stiffness: 260, damping: 26, mass: 0.55 },
  snappy: { stiffness: 360, damping: 32, mass: 0.55 },
  gentle: { stiffness: 180, damping: 24, mass: 0.62 }
} as const;

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

export const expandIn: Variants = {
  hidden: { opacity: 0, y: -6 },
  visible: { opacity: 1, y: 0 }
};

export const collapseFade: Variants = {
  hidden: { opacity: 0, y: -4 },
  visible: { opacity: 1, y: 0 }
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 }
};

export function staggerContainer(delay = 0.08): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: delay
      }
    }
  };
}

interface MotionPolicyInput {
  prefersReducedMotion: boolean;
  isCoarsePointer: boolean;
  isNarrowViewport: boolean;
}

interface AppMotionPolicy {
  shouldReduce: boolean;
  shouldConstrain: boolean;
  allowDecorativeMotion: boolean;
  allowLayoutMotion: boolean;
  scrollBehavior: ScrollBehavior;
  transition: Transition;
}

export function getAppMotionPolicy({
  prefersReducedMotion,
  isCoarsePointer,
  isNarrowViewport
}: MotionPolicyInput): AppMotionPolicy {
  const shouldConstrain = isCoarsePointer || isNarrowViewport;
  const shouldReduce = prefersReducedMotion || shouldConstrain;

  return {
    shouldReduce,
    shouldConstrain,
    allowDecorativeMotion: !shouldReduce,
    allowLayoutMotion: !shouldReduce,
    scrollBehavior: shouldReduce ? 'auto' : 'smooth',
    transition: shouldReduce ? { duration: 0 } : { duration: 0.24, ease: fluidEase }
  };
}

export function useAppMotion(): AppMotionPolicy {
  const [shouldReduce, setShouldReduce] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  const isCoarsePointer = useMediaQuery('(pointer: coarse)');
  const isNarrowViewport = useMediaQuery('(max-width: 900px)');

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setShouldReduce(media.matches);
    updatePreference();
    media.addEventListener('change', updatePreference);
    return () => media.removeEventListener('change', updatePreference);
  }, []);

  return getAppMotionPolicy({
    prefersReducedMotion: shouldReduce,
    isCoarsePointer,
    isNarrowViewport
  });
}
