import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { LeaveScenarioConfig } from '../utils/paternityLeave';
import { getScenarioVocabulary } from '../utils/scenarioVocabulary';
import { fadeIn, slideUp, staggerContainer, useAppMotion } from '../lib/motion';
import { Button } from './Button';

interface CelebrationModalProps {
  show: boolean;
  onClose: () => void;
  totalFractionableDays: number;
  scenario: LeaveScenarioConfig;
  showSupplementaryAction: boolean;
  onGoToSupplementary: () => void;
  onGoToLetter: () => void;
}

export function CelebrationModal({
  show,
  onClose,
  totalFractionableDays,
  scenario,
  showSupplementaryAction,
  onGoToSupplementary,
  onGoToLetter
}: CelebrationModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();
  const totalDays = 7 + totalFractionableDays;
  const vocabulary = getScenarioVocabulary(scenario);
  const { shouldReduce, transition } = useAppMotion();
  const isCoarsePointer = useMediaQuery('(pointer: coarse)');

  const dismissWithAnimation = useCallback((action: () => void) => {
    if (shouldReduce) {
      action();
      return;
    }
    setIsVisible(false);
    setTimeout(action, isCoarsePointer ? 300 : 400);
  }, [isCoarsePointer, shouldReduce]);

  useEffect(() => {
    setIsVisible(show);
  }, [show]);

  useEffect(() => {
    if (!show) {
      return undefined;
    }

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

    const focusDialog = () => {
      dialogRef.current?.focus();
    };

    const frame = requestAnimationFrame(focusDialog);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        dismissWithAnimation(onClose);
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables || focusables.length === 0) {
        return;
      }

      const focusableElements = Array.from(focusables).filter(
        element => !element.hasAttribute('disabled') && element.tabIndex !== -1
      );

      if (focusableElements.length === 0) {
        return;
      }

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);

      if (currentIndex === -1) {
        event.preventDefault();
        first.focus();
        return;
      }

      if (event.shiftKey) {
        event.preventDefault();
        const previous = currentIndex === 0 ? last : focusableElements[currentIndex - 1];
        previous.focus();
        return;
      }

      event.preventDefault();
      const next = currentIndex === focusableElements.length - 1 ? first : focusableElements[currentIndex + 1];
      next.focus();
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dismissWithAnimation, onClose, show]);

  useEffect(() => {
    if (!show && previouslyFocusedRef.current) {
      previouslyFocusedRef.current.focus();
      previouslyFocusedRef.current = null;
    }
  }, [show]);

  if (!show && !isVisible) return null;

  const subtitle = showSupplementaryAction
    ? 'Découvrez le congé supplémentaire 2026 ou passez directement au courrier employeur.'
    : 'Générez votre courrier pour informer votre employeur.';

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/25 px-4"
            initial={shouldReduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={shouldReduce ? { duration: 0 } : { duration: 0.25 }}
            style={{ backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
            onClick={() => dismissWithAnimation(onClose)}
          >
            <motion.div
              className="relative max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-[18px] bg-white p-5 shadow-elevated sm:p-8"
              initial={shouldReduce ? false : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={shouldReduce ? { duration: 0 } : { type: 'spring', stiffness: 200, damping: 15 }}
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={descriptionId}
              tabIndex={-1}
              onClick={event => event.stopPropagation()}
            >
              <motion.div
                className="text-center relative z-10"
                initial="hidden"
                animate="visible"
                variants={staggerContainer(shouldReduce ? 0 : 0.08)}
              >
                <div className="relative mb-4 inline-flex h-16 w-16 items-center justify-center">
                  <div className="relative z-10 inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white sm:h-16 sm:w-16">
                    <CheckCircle className="h-8 w-8 sm:h-9 sm:w-9" strokeWidth={2.25} aria-hidden="true" />
                  </div>
                </div>

                <motion.h3 id={titleId} className="mb-3 text-2xl font-semibold tracking-[-0.018em] text-[#1d1d1f] sm:text-3xl" variants={slideUp} transition={transition}>
                  Planification complète
                </motion.h3>

                <motion.p id={descriptionId} className="mb-2 text-sm leading-relaxed text-slate-600 sm:text-base" variants={slideUp} transition={transition}>
                  Votre planning de {vocabulary.initialLeaveLabel} est complet
                </motion.p>

                <motion.div
                  className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3.5 sm:p-4"
                  variants={slideUp}
                  transition={transition}
                >
                  <p className="text-sm font-semibold text-emerald-900">
                    ✓ {totalDays} jours planifiés avec succès
                  </p>
                  <p className="text-xs text-emerald-700 mt-1">
                    3 jours employeur + 4 jours obligatoires + {totalFractionableDays} jours fractionnés
                  </p>
                </motion.div>

                <motion.p className="text-xs text-slate-500 mt-4" variants={fadeIn} transition={transition}>
                  {subtitle}
                </motion.p>

                <div className="mt-5 space-y-3 sm:mt-6">
                  {showSupplementaryAction && (
                    <Button
                      onClick={() => dismissWithAnimation(onGoToSupplementary)}
                      variant="primary"
                      fullWidth
                    >
                      Configurer le congé supplémentaire
                    </Button>
                  )}
                  <Button
                    onClick={() => dismissWithAnimation(onGoToLetter)}
                    variant={showSupplementaryAction ? 'outline' : 'primary'}
                    fullWidth
                  >
                    {showSupplementaryAction ? 'Générer le courrier employeur' : 'Générer le courrier'}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
