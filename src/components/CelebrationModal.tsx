import { useEffect, useRef, useState } from 'react';
import { CheckCircle } from 'lucide-react';
import Confetti from 'react-confetti';

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

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setShowConfetti(true);
      // Arrêter les confettis après 5 secondes
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      setShowConfetti(false);
    }
  }, [show]);

  useEffect(() => {
    if (!show) {
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
  }, [onClose, show]);

  useEffect(() => {
    if (!show && previouslyFocusedRef.current) {
      previouslyFocusedRef.current.focus();
      previouslyFocusedRef.current = null;
    }
  }, [show]);

  if (!show && !isVisible) return null;

  return (
    <>
      {/* Confettis plein écran */}
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={400}
          recycle={false}
          gravity={0.3}
          colors={['#0f766e', '#14b8a6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6', '#f43f5e']}
          style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, pointerEvents: 'none' }}
        />
      )}

      <div
        className={`
          fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center z-50 px-4
          transition-opacity duration-300
          ${isVisible ? 'opacity-100' : 'opacity-0'}
        `}
        onClick={() => {
          setIsVisible(false);
          setShowConfetti(false);
          setTimeout(onClose, 300);
        }}
      >
        <div
          className={`
            bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative overflow-hidden
            transition-all duration-500
            ${isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}
          `}
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
              setTimeout(onClose, 300);
            }}
            className="mt-6 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-all hover:shadow-lg hover:scale-105 active:scale-95 w-full"
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
