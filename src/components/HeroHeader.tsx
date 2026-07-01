import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, RotateCcw } from 'lucide-react';
import { fadeInUp, useAppMotion } from '../lib/motion';

interface HeroHeaderProps {
  hasBirthDate: boolean;
  onResetRequest: () => void;
}

export function HeroHeader({ hasBirthDate, onResetRequest }: HeroHeaderProps) {
  const { allowDecorativeMotion, shouldReduce, transition } = useAppMotion();

  return (
    <motion.header
      className="mb-6 sm:mb-14 text-center relative"
      variants={fadeInUp}
      transition={transition}
    >
      <div className="absolute top-0 right-2 sm:right-0 z-20">
        <button
          type="button"
          onClick={onResetRequest}
          aria-label="Réinitialiser le planificateur"
          className={`flex h-11 w-11 sm:h-auto sm:w-auto items-center justify-center gap-2 rounded-xl border border-white px-2.5 py-2 text-sm font-medium text-slate-600 shadow-sm transition-[background-color,color,box-shadow,opacity,transform] duration-200 hover:bg-white hover:text-brand-600 hover:shadow-lg active:scale-95 sm:px-4 group ${shouldReduce ? 'bg-white' : 'bg-white/80 backdrop-blur-md'} ${!hasBirthDate ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          <RotateCcw className="w-4 h-4 shrink-0 group-hover:-rotate-180 transition-transform duration-500" />
          <span className="hidden sm:inline">Réinitialiser</span>
        </button>
      </div>

      <div className="flex justify-center mb-4 sm:mb-6 relative">
        {allowDecorativeMotion && (
          <div className="absolute inset-0 hidden bg-brand-400 rounded-3xl blur-2xl opacity-20 transition-opacity duration-500 sm:block"></div>
        )}
        <motion.button
          type="button"
          onClick={onResetRequest}
          aria-label="Réinitialiser le simulateur"
          className={`relative inline-flex items-center justify-center w-14 h-14 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-md sm:shadow-xl shadow-brand-500/20 sm:shadow-brand-500/25 transition-transform duration-200 ${hasBirthDate ? 'cursor-pointer hover:scale-105 active:scale-95' : 'cursor-default'}`}
          title={hasBirthDate ? 'Cliquer pour réinitialiser' : 'Calendrier'}
        >
          <CalendarIcon className="w-7 h-7 sm:w-12 sm:h-12 drop-shadow-md" strokeWidth={1.8} aria-hidden="true" />
        </motion.button>
      </div>

      <h1 className="text-[2.35rem] sm:text-5xl md:text-5xl font-extrabold text-slate-900 mb-2 sm:mb-5 tracking-tight font-display leading-[1.05] relative inline-block max-w-full">
        Congé <span className="text-brand-600">Paternité</span>
        {' '}
        <motion.span
          aria-hidden="true"
          className="absolute -top-8 -right-10 rotate-12 bg-brand-100 text-brand-700 text-sm font-bold px-3 py-1.5 rounded-xl border border-brand-200 shadow-sm hidden sm:inline-block"
          animate={shouldReduce ? undefined : { y: [0, -4, 0] }}
          transition={shouldReduce ? undefined : { duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          2026 Ready
        </motion.span>
      </h1>
      <p className="text-sm sm:text-2xl font-medium mb-0 sm:mb-6 px-4 max-w-xs sm:max-w-2xl mx-auto leading-relaxed text-brand-900/80">
        L'outil moderne pour planifier facilement votre congé paternité.
      </p>
    </motion.header>
  );
}
