import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, Sparkles } from 'lucide-react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { LeaveScenarioConfig } from '../utils/paternityLeave';
import { getScenarioVocabulary } from '../utils/scenarioVocabulary';
import { fadeIn, slideUp, useAppMotion } from '../lib/motion';

interface CelebrationModalProps {
  show: boolean;
  onClose: () => void;
  totalFractionableDays: number;
  scenario: LeaveScenarioConfig;
  showSupplementaryAction: boolean;
  onGoToSupplementary: () => void;
  onGoToLetter: () => void;
}

// Particules décoratives pour l'animation de célébration
function CelebrationParticles() {
  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 3 + Math.random() * 4,
    delay: Math.random() * 0.5,
    duration: 1.5 + Math.random() * 1,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: ['#0071e3', '#22c55e', '#f59e0b', '#8b5cf6'][p.id % 4],
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1.2, 0],
            y: [0, -20 - Math.random() * 20],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            repeatDelay: 1 + Math.random(),
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
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
    setTimeout(action, 250);
  }, [shouldReduce]);

  useEffect(() => {
    setIsVisible(show);
  }, [show]);

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

  useEffect(() => {
    if (show && isVisible) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [show, isVisible]);

  if (!show && !isVisible) return null;

  const subtitle = showSupplementaryAction
    ? 'Découvrez le congé supplémentaire 2026 ou passez directement au courrier employeur.'
    : 'Générez votre courrier pour informer votre employeur.';

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 px-4"
            initial={shouldReduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={shouldReduce ? { duration: 0 } : { duration: 0.3 }}
            style={{ backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
            onClick={() => dismissWithAnimation(onClose)}
          >
            <motion.div
              className="max-h-[calc(100vh-2rem)] max-w-md w-full overflow-y-auto rounded-2xl bg-white/95 backdrop-blur-xl p-6 shadow-xl sm:rounded-3xl sm:p-8 relative border border-white/50"
              initial={shouldReduce ? false : { opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -5 }}
              transition={shouldReduce ? { duration: 0 } : { type: 'spring', stiffness: 280, damping: 18, mass: 0.8 }}
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label="Planification complète"
              tabIndex={-1}
              onClick={event => event.stopPropagation()}
            >
              <CelebrationParticles />

              <motion.div
                className="text-center relative z-10"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={transition}
              >
                <div className="relative mb-4 inline-flex h-20 w-20 items-center justify-center sm:h-24 sm:w-24">
                  <motion.div
                    className="relative z-10 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 sm:h-20 sm:w-20"
                    initial={shouldReduce ? false : { scale: 0, rotate: -15 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={shouldReduce ? { duration: 0 } : { type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
                  >
                    <CheckCircle className="w-9 h-9 sm:w-12 sm:h-12" strokeWidth={2.5} aria-hidden="true" />
                  </motion.div>
                </div>

                <motion.h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 tracking-tight" variants={slideUp} transition={transition}>
                  Planification complète
                </motion.h3>

                <motion.p className="text-sm sm:text-base text-slate-600 mb-2" variants={slideUp} transition={transition}>
                  Votre planning de {vocabulary.initialLeaveLabel} est complet
                </motion.p>

                <motion.div
                  className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-50/50 p-3.5 sm:p-4 mt-4 shadow-sm"
                  variants={slideUp}
                  transition={transition}
                >
                  <p className="text-sm font-semibold text-emerald-900">
                    <Sparkles className="w-4 h-4 inline-block mr-1.5 -mt-0.5 text-emerald-500" aria-hidden="true" />
                    {totalDays} jours planifiés avec succès
                  </p>
                  <p className="text-xs text-emerald-700 mt-1 font-medium">
                    3 jours employeur + 4 jours obligatoires + {totalFractionableDays} jours fractionnés
                  </p>
                </motion.div>

                <motion.p className="text-xs text-slate-400 mt-4" variants={fadeIn} transition={transition}>
                  {subtitle}
                </motion.p>

                <div className="mt-5 sm:mt-6 space-y-3">
                  {showSupplementaryAction && (
                    <button
                      type="button"
                      onClick={() => dismissWithAnimation(onGoToSupplementary)}
                      className="px-5 sm:px-6 py-3 bg-gradient-to-br from-brand-500 to-brand-700 hover:from-brand-600 hover:to-brand-800 text-white rounded-xl font-semibold w-full transition-all duration-300 active:scale-95 shadow-lg shadow-brand-500/20 hover:shadow-brand-600/30"
                      data-autofocus
                    >
                      Configurer le congé supplémentaire
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => dismissWithAnimation(onGoToLetter)}
                    className={`px-5 sm:px-6 py-3 rounded-xl font-semibold w-full transition-all duration-300 active:scale-95 ${
                      showSupplementaryAction
                        ? 'bg-white border-2 border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300 shadow-sm'
                        : 'bg-gradient-to-br from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/20'
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
