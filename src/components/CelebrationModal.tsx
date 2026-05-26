import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import Confetti from 'react-confetti';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { LeaveScenarioConfig } from '../utils/paternityLeave';
import { getScenarioVocabulary } from '../utils/scenarioVocabulary';
import { fadeIn, slideUp, staggerContainer, useAppMotion } from '../lib/motion';

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
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
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
    setShowConfetti(false);
    setTimeout(action, isCoarsePointer ? 300 : 400);
  }, [isCoarsePointer, shouldReduce]);

  useEffect(() => {
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      }, 100);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setShowConfetti(!shouldReduce);
      const timer = setTimeout(() => setShowConfetti(false), isCoarsePointer ? 1000 : 3000);
      return () => clearTimeout(timer);
    }
    setIsVisible(false);
    setShowConfetti(false);
  }, [show, shouldReduce, isCoarsePointer]);

  useEffect(() => {
    if (!show) {
      return undefined;
    }

    if (isCoarsePointer) {
      return undefined;
    }

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

    const focusDialog = () => {
      if (!dialogRef.current) return;
      const focusable =
        dialogRef.current.querySelector<HTMLElement>('[data-autofocus]') ??
        dialogRef.current.querySelector<HTMLElement>(
          'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
      focusable?.focus();
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

      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dismissWithAnimation, onClose, show, isCoarsePointer]);

  useEffect(() => {
    if (!show && previouslyFocusedRef.current && !isCoarsePointer) {
      previouslyFocusedRef.current.focus();
      previouslyFocusedRef.current = null;
    }
  }, [show, isCoarsePointer]);

  if (!show && !isVisible) return null;

  const subtitle = showSupplementaryAction
    ? 'Découvrez le congé supplémentaire 2026 ou passez directement au courrier employeur.'
    : 'Générez votre courrier pour informer votre employeur.';

  if (isCoarsePointer) {
    return (
      <>
        {showConfetti && (
          <Confetti
            width={windowSize.width}
            height={Math.min(windowSize.height, 220)}
            numberOfPieces={24}
            recycle={false}
            gravity={0.35}
            colors={['#10b981', '#34d399', '#a7f3d0']}
            style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, pointerEvents: 'none' }}
          />
        )}
        <AnimatePresence>
          {isVisible && (
            <motion.div
              key="mobile-celebration-sheet"
              className="fixed inset-x-0 bottom-3 z-50 px-4"
              role="dialog"
              aria-label="Planification complète"
              initial={shouldReduce ? false : { y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={transition}
            >
              <div className="mx-auto max-w-md rounded-2xl border border-emerald-200 bg-white/95 shadow-lg p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-bold text-slate-900">Planification complète</p>
                    <p className="text-sm text-slate-600 mt-0.5">
                      Planning complet ({totalDays} jours). {subtitle}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {showSupplementaryAction && (
                    <button
                      type="button"
                      onClick={() => dismissWithAnimation(onGoToSupplementary)}
                      className="w-full px-3 py-2.5 bg-violet-600 text-white rounded-lg text-sm font-semibold"
                      data-autofocus
                    >
                      Congé supplémentaire 2026
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => dismissWithAnimation(onGoToLetter)}
                    className={`w-full px-3 py-2.5 rounded-lg text-sm font-semibold ${
                      showSupplementaryAction
                        ? 'bg-white border border-slate-200 text-slate-800'
                        : 'bg-emerald-600 text-white'
                    }`}
                    data-autofocus={!showSupplementaryAction}
                  >
                    {showSupplementaryAction ? 'Courrier employeur' : 'Générer le courrier'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <>
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={Math.min(
            160,
            Math.max(40, Math.floor((windowSize.width * windowSize.height) / 80000))
          )}
          recycle={false}
          gravity={0.3}
          colors={['#0f766e', '#14b8a6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6', '#f43f5e']}
          style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, pointerEvents: 'none' }}
        />
      )}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed inset-0 bg-slate-900/30 flex items-center justify-center z-50 px-4"
            initial={shouldReduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={shouldReduce ? { duration: 0 } : { duration: 0.25 }}
            style={{ backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
            onClick={() => dismissWithAnimation(onClose)}
          >
            <motion.div
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative overflow-hidden"
              initial={shouldReduce ? false : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={shouldReduce ? { duration: 0 } : { type: 'spring', stiffness: 200, damping: 15 }}
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label="Planification complète"
              tabIndex={-1}
              onClick={event => event.stopPropagation()}
            >
              {!shouldReduce && (
                <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                  {Array.from({ length: 8 }, (_, index) => {
                    const direction = index < 4 ? -1 : 1;
                    const distance = 36 + (index % 4) * 12;

                    return (
                      <motion.div
                        key={index}
                        className="absolute left-1/2 top-12 h-2.5 w-2.5 rounded-full"
                        style={{
                          backgroundColor: ['#10b981', '#34d399', '#f59e0b', '#8b5cf6'][index % 4]
                        }}
                        initial={{ x: 0, y: 0, opacity: 0, rotate: 0 }}
                        animate={{
                          x: direction * distance,
                          y: [0, -36 - (index % 3) * 8, 32],
                          opacity: [0, 1, 0],
                          rotate: direction * 180
                        }}
                        transition={{ delay: index * 0.05, duration: 0.9, ease: 'easeOut' }}
                      />
                    );
                  })}
                </div>
              )}

              <motion.div
                className="text-center relative z-10"
                initial="hidden"
                animate="visible"
                variants={staggerContainer(shouldReduce ? 0 : 0.08)}
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500 rounded-full mb-4 shadow-lg">
                  <CheckCircle className="w-12 h-12 text-white" strokeWidth={2.5} />
                </div>

                <motion.h3 className="text-3xl font-bold text-slate-900 mb-3" variants={slideUp} transition={transition}>
                  Planification complète
                </motion.h3>

                <motion.p className="text-slate-600 text-base mb-2" variants={slideUp} transition={transition}>
                  Votre planning de {vocabulary.initialLeaveLabel} est complet
                </motion.p>

                <motion.div
                  className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 mt-4"
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

                <div className="mt-6 space-y-3">
                  {showSupplementaryAction && (
                    <button
                      type="button"
                      onClick={() => dismissWithAnimation(onGoToSupplementary)}
                      className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold w-full transition-colors"
                      data-autofocus
                    >
                      Configurer le congé supplémentaire
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => dismissWithAnimation(onGoToLetter)}
                    className={`px-6 py-3 rounded-xl font-semibold w-full transition-colors ${
                      showSupplementaryAction
                        ? 'bg-white border-2 border-slate-200 text-slate-800 hover:bg-slate-50'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                    data-autofocus={!showSupplementaryAction}
                  >
                    {showSupplementaryAction ? 'Générer le courrier employeur' : 'Générer le courrier'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
