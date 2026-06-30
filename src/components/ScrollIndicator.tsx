import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAppMotion } from '../lib/motion';

interface ScrollIndicatorProps {
  show: boolean;
}

export function ScrollIndicator({ show }: ScrollIndicatorProps) {
  // Track whether indicator should be visually shown,
  // but keep a fixed-height wrapper to avoid layout shifts.
  const [visible, setVisible] = useState(false);
  const { shouldReduce, transition } = useAppMotion();

  useEffect(() => {
    setVisible(show);
  }, [show]);

  useEffect(() => {
    if (!visible) return;

    const handleScroll = (): void => {
      if (window.scrollY > 100) {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visible]);

  if (!show) {
    return <div className="h-2 sm:h-3" aria-hidden="true" />;
  }

  return (
    <div className="flex justify-center mb-6 h-8" aria-hidden={!visible}>
      <motion.div animate={{ opacity: visible ? 1 : 0 }} transition={transition}>
        <motion.div
          animate={shouldReduce ? undefined : { y: [0, -4, 0] }}
          transition={shouldReduce ? undefined : { duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-6 h-6 text-slate-400" />
        </motion.div>
      </motion.div>
    </div>
  );
}
