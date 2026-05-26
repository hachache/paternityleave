import { motion, useScroll, useTransform } from 'framer-motion';
import { useAppMotion } from '../lib/motion';

/**
 * Décor d'arrière-plan sobre.
 * Isolé pour alléger App.tsx et garder le rendu purement décoratif.
 */
export function AuroraBackground() {
  const { scrollY } = useScroll();
  const { shouldReduce } = useAppMotion();
  const opacity = useTransform(scrollY, [0, 800], [1, 0.3]);

  return (
    <motion.div
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      style={{ opacity: shouldReduce ? 1 : opacity }}
    >
      <div className="aurora-blob aurora-1 rounded-full mix-blend-multiply blur-3xl opacity-20"></div>
      <div className="aurora-blob aurora-2 rounded-full mix-blend-multiply blur-3xl opacity-20"></div>
      <div className="aurora-blob aurora-3 rounded-full mix-blend-multiply blur-3xl opacity-20"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
    </motion.div>
  );
}
