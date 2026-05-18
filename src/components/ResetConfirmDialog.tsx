import { RotateCcw } from 'lucide-react';
import { Button } from './Button';

interface ResetConfirmDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ResetConfirmDialog({ open, onCancel, onConfirm }: ResetConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 px-4 animate-fade-in">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-brand-900/20 max-w-md w-full p-8 animate-pop transform transition-all border border-white/50">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 mb-5 shadow-inner">
            <RotateCcw className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold font-display text-slate-900 mb-3">
            Réinitialiser le planning ?
          </h3>
          <p className="text-slate-600 text-base leading-relaxed">
            Toute votre progression actuelle sera perdue. Cette action est irréversible.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button onClick={onCancel} variant="secondary" size="lg" className="w-full">
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
