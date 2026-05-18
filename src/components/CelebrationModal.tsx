import { useEffect, useRef, useState } from 'react';
import { CheckCircle } from 'lucide-react';

interface CelebrationModalProps {
  show: boolean;
  onClose: () => void;
  totalFractionableDays: number;
}

export function CelebrationModal({ show, onClose, totalFractionableDays }: CelebrationModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const totalDays = 7 + totalFractionableDays;

  useEffect(() => {
    setIsVisible(show);
  }, [show]);

  useEffect(() => {
    if (!show) return undefined;

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

    const frame = requestAnimationFrame(() => {
      dialogRef.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
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
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Planification complète"
        className="bg-white rounded-3xl border border-black/10 shadow-soft max-w-md w-full p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-black rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-white" strokeWidth={2.2} />
          </div>

          <h3 className="text-2xl font-semibold text-[#1d1d1f] mb-2">Planification complète</h3>

          <p className="text-[#424245] text-sm mb-4">
            Vos {totalDays} jours sont correctement planifiés. Vous pouvez maintenant générer votre courrier.
          </p>

          <button
            onClick={onClose}
            className="mt-2 px-6 py-3 bg-black hover:opacity-85 text-white rounded-full font-medium w-full transition-all duration-300"
            data-autofocus
          >
            Continuer
          </button>
        </div>
      </div>
    </div>
  );
}
