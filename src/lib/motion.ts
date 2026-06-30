import { useReducedMotion } from 'framer-motion';
import type { Transition, Variants } from 'framer-motion';

export const appleEase = [0.16, 1, 0.3, 1] as const;

export const springs = {
  soft: { type: 'spring', stiffness: 260, damping: 26 },
  snappy: { stiffness: 400, damping: 30 },
  gentle: { stiffness: 180, damping: 22 }
} as const;

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 10 },
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
  const shouldReduce = Boolean(useReducedMotion());

  return {
    shouldReduce,
    transition: shouldReduce ? { duration: 0 } : { duration: 0.32, ease: appleEase }
  };
}
