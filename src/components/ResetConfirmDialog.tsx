import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { Button } from './Button';
import { fadeIn, useAppMotion } from '../lib/motion';

interface ResetConfirmDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ResetConfirmDialog({ open, onCancel, onConfirm }: ResetConfirmDialogProps) {
  const { shouldReduce, transition } = useAppMotion();

  if (!open) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 px-4"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      transition={transition}
    >
      <motion.div
        className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl shadow-brand-900/10 max-w-md w-full p-5 sm:p-8 transform border border-white/50"
        initial={{ opacity: 0, scale: shouldReduce ? 1 : 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={transition}
      >
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-amber-100 text-amber-600 mb-4 sm:mb-5 shadow-inner">
            <RotateCcw className="w-6 h-6 sm:w-8 sm:h-8" aria-hidden="true" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 mb-3">
            Réinitialiser le planning ?
          </h3>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Toute votre progression actuelle sera perdue. Cette action est irréversible.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <Button onClick={onCancel} variant="secondary" size="lg" className="w-full">
            Annuler
          </Button>
          <Button onClick={onConfirm} variant="danger" size="lg" className="w-full">
            Confirmer
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
