import { useEffect, useRef, useState, useMemo } from 'react';
import { CheckCircle } from 'lucide-react';
import Confetti from 'react-confetti';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface CelebrationModalProps {
  show: boolean;
  onClose: () => void;
  totalFractionableDays: number;
}

export function CelebrationModal({ show, onClose, totalFractionableDays }: CelebrationModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const totalDays = 7 + totalFractionableDays;
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const isCoarsePointer = useMediaQuery('(pointer: coarse)');

  useEffect(() => {
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      // Debounce pour éviter les re-renders pendant le resize
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
      // Désactiver les confettis sur mobile et quand motion réduit
      setShowConfetti(!prefersReducedMotion && !isCoarsePointer);
      const timer = setTimeout(() => setShowConfetti(false), isCoarsePointer ? 1500 : 4000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      setShowConfetti(false);
    }
  }, [show, prefersReducedMotion, isCoarsePointer]);

  useEffect(() => {
    if (!show) {
      return undefined;
    }

    // Sur mobile, éviter le focus programmatique et le piège du focus pour réduire le jank
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
        onClose();
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
  }, [onClose, show, isCoarsePointer]);

  useEffect(() => {
    if (!show && previouslyFocusedRef.current && !isCoarsePointer) {
      previouslyFocusedRef.current.focus();
      previouslyFocusedRef.current = null;
    }
  }, [show, isCoarsePointer]);

  if (!show && !isVisible) return null;

  return (
    <>
      {/* Confettis plein écran */}
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={Math.min(
            160,
            Math.max(40, Math.floor((windowSize.width * windowSize.height) / (isCoarsePointer ? 120000 : 80000)))
          )}
          recycle={false}
          gravity={isCoarsePointer ? 0.2 : 0.3}
          colors={['#0f766e', '#14b8a6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6', '#f43f5e']}
          style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, pointerEvents: 'none' }}
        />
      )}

      <div
        className={`
          fixed inset-0 bg-slate-900/30 flex items-center justify-center z-50 px-4
          ${isVisible ? 'opacity-100' : 'opacity-0'}
        `}
        style={{
          transition: `opacity ${isCoarsePointer ? 200 : 400}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
          backdropFilter: isCoarsePointer ? 'none' : (isVisible ? 'blur(4px)' : 'blur(0px)'),
          WebkitBackdropFilter: isCoarsePointer ? 'none' : (isVisible ? 'blur(4px)' : 'blur(0px)')
        }}
        onClick={() => {
          setIsVisible(false);
          setShowConfetti(false);
          setTimeout(onClose, isCoarsePointer ? 200 : 400);
        }}
      >
        <div
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative overflow-hidden"
          style={{
            transform: isCoarsePointer ? 'none' : (isVisible ? 'scale(1)' : 'scale(0.95)'),
            opacity: isVisible ? 1 : 0,
            transition: isCoarsePointer
              ? 'opacity 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              : 'transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Planification complète"
          tabIndex={-1}
          onClick={(e) => e.stopPropagation()}
        >

        {/* Contenu */}
        <div className="text-center relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500 rounded-full mb-4 shadow-lg">
            <CheckCircle className="w-12 h-12 text-white" strokeWidth={2.5} />
          </div>

          <h3 className="text-3xl font-bold text-slate-900 mb-3 animate-slide-up">
            Félicitations ! 🎉
          </h3>

          <p className="text-slate-600 text-base mb-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Votre planning de congé paternité est complet
          </p>

          <div
            className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 mt-4 animate-slide-up"
            style={{ animationDelay: '0.2s' }}
          >
            <p className="text-sm font-semibold text-emerald-900">
              ✓ {totalDays} jours planifiés avec succès
            </p>
            <p className="text-xs text-emerald-700 mt-1">
              3 jours employeur + 4 jours obligatoires + {totalFractionableDays} jours fractionnés
            </p>
          </div>

          <p className="text-xs text-slate-500 mt-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            Vous pouvez maintenant générer votre lettre pour l'employeur
          </p>

          <button
            onClick={() => {
              setIsVisible(false);
              setShowConfetti(false);
              setTimeout(onClose, isCoarsePointer ? 200 : 400);
            }}
            className="mt-6 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold w-full"
            style={{
              transition: 'background-color 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'scale(0.98)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            data-autofocus
          >
            Super ! 👍
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
