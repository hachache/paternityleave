import { useCallback, useEffect, useRef } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from './Button';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface ResetConfirmDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export function ResetConfirmDialog({
  open,
  onCancel,
  onConfirm,
  title = 'Réinitialiser le planning ?',
  description = 'Toute votre progression actuelle sera perdue. Cette action est irréversible.'
}: ResetConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const isCoarsePointer = useMediaQuery('(pointer: coarse)');

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCancel();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables || focusables.length === 0) return;

      const focusableElements = Array.from(focusables).filter(
        (element) => !element.hasAttribute('disabled') && element.tabIndex !== -1
      );
      if (focusableElements.length === 0) return;

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
    },
    [onCancel]
  );

  useEffect(() => {
    if (!open) return;

    if (!isCoarsePointer) {
      previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    }

    const frame = requestAnimationFrame(() => {
      const cancelBtn = dialogRef.current?.querySelector<HTMLElement>('[data-autofocus]');
      cancelBtn?.focus();
    });

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, handleKeyDown, isCoarsePointer]);

  useEffect(() => {
    if (!open && previouslyFocusedRef.current && !isCoarsePointer) {
      previouslyFocusedRef.current.focus();
      previouslyFocusedRef.current = null;
    }
  }, [open, isCoarsePointer]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 px-4"
          onClick={onCancel}
        >
          <div
            ref={dialogRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="reset-dialog-title"
            aria-describedby="reset-dialog-desc"
            className="reveal-subtle bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl shadow-brand-900/10 max-w-md w-full p-5 sm:p-8 transform transition-all border border-white/50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-amber-100 text-amber-600 mb-4 sm:mb-5 shadow-inner">
                <RotateCcw className="w-6 h-6 sm:w-8 sm:h-8" aria-hidden="true" />
              </div>
              <h3 id="reset-dialog-title" className="text-xl sm:text-2xl font-bold font-display text-slate-900 mb-3">
                {title}
              </h3>
              <p id="reset-dialog-desc" className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <Button onClick={onCancel} variant="secondary" size="lg" className="w-full" data-autofocus>
                Annuler
              </Button>
              <Button onClick={onConfirm} variant="danger" size="lg" className="w-full">
                Confirmer
              </Button>
            </div>
          </div>
        </div>
  );
}
