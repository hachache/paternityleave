import { useEffect, useState } from 'react';
import type { Transition, Variants } from 'framer-motion';

export const springs = {
  soft: { type: 'spring', stiffness: 260, damping: 26 },
  snappy: { stiffness: 400, damping: 30 },
  gentle: { stiffness: 180, damping: 22 }
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

export function useAppMotion(): { shouldReduce: boolean; transition: Transition } {
  const [shouldReduce, setShouldReduce] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setShouldReduce(media.matches);
    updatePreference();
    media.addEventListener('change', updatePreference);
    return () => media.removeEventListener('change', updatePreference);
  }, []);

  return {
    shouldReduce,
    transition: shouldReduce ? { duration: 0 } : springs.soft
  };
}
