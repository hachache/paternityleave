import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, RotateCcw } from 'lucide-react';
import { fadeInUp, useAppMotion } from '../lib/motion';

interface HeroHeaderProps {
  hasBirthDate: boolean;
  onResetRequest: () => void;
}

export function HeroHeader({ hasBirthDate, onResetRequest }: HeroHeaderProps) {
  const { transition } = useAppMotion();

  return (
    <motion.header
      className="relative mb-5 text-center sm:mb-7"
      variants={fadeInUp}
      transition={transition}
    >
      <div className="absolute top-0 right-2 sm:right-0">
        <button
          type="button"
          onClick={onResetRequest}
          className={`group flex min-h-10 min-w-10 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-0 py-0 text-sm font-normal text-slate-600 transition-colors duration-200 hover:border-slate-300 hover:text-brand-600 active:scale-95 sm:px-4 sm:py-2 ${!hasBirthDate ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          <RotateCcw className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-500" />
          <span className="hidden sm:inline">Réinitialiser</span>
        </button>
      </div>

      <div className="mb-3 flex justify-center sm:mb-4">
        <button
          type="button"
          onClick={onResetRequest}
          aria-label="Réinitialiser le simulateur"
          className={`relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 text-white transition-transform duration-200 hover:scale-[1.01] active:scale-95 sm:h-16 sm:w-16 ${hasBirthDate ? 'cursor-pointer' : 'cursor-default'}`}
          title={hasBirthDate ? 'Cliquer pour réinitialiser' : 'Calendrier'}
        >
          <CalendarIcon className="h-6 w-6 sm:h-8 sm:w-8" strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>

      <h1 className="relative mb-2 inline-block max-w-full text-[2.25rem] font-semibold leading-[1.07] tracking-[-0.012em] text-[#1d1d1f] sm:mb-3 sm:text-[52px]">
        Congé <span className="text-brand-600">Paternité</span>
        {' '}
        <span
          aria-hidden="true"
          className="absolute -right-14 -top-8 hidden whitespace-nowrap rounded-full border border-slate-200 bg-[#fafafc] px-3 py-1 text-xs font-normal tracking-[-0.01em] text-slate-600 sm:inline-block"
        >
          Version 2026
        </span>
      </h1>
      <p className="mx-auto mb-0 max-w-xs px-4 text-[16px] font-normal leading-[1.42] tracking-[-0.012em] text-slate-600 sm:max-w-2xl sm:text-[22px] sm:leading-[1.2]">
        Planifiez simplement votre congé de paternité et préparez le courrier employeur.
      </p>
    </motion.header>
  );
}
