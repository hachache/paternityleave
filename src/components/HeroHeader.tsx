import { motion, useScroll, useTransform } from 'framer-motion';
import { Calendar as CalendarIcon, RotateCcw } from 'lucide-react';
import { fadeInUp, useAppMotion } from '../lib/motion';

interface HeroHeaderProps {
  hasBirthDate: boolean;
  onResetRequest: () => void;
}

export function HeroHeader({ hasBirthDate, onResetRequest }: HeroHeaderProps) {
  const { shouldReduce, transition } = useAppMotion();
  const { scrollY } = useScroll();
  const logoScale = useTransform(scrollY, [0, 200], [1, 0.95]);

  return (
    <motion.header
      className="mb-12 sm:mb-16 text-center relative"
      variants={fadeInUp}
      transition={transition}
    >
      <div className="absolute top-0 right-2 sm:right-0">
        <button
          type="button"
          onClick={onResetRequest}
          className={`px-4 py-2 bg-white/80 backdrop-blur-md text-slate-600 rounded-xl hover:bg-white hover:text-brand-600 hover:shadow-lg transition-all duration-300 text-sm font-medium active:scale-95 border border-white shadow-sm flex items-center gap-2 group ${!hasBirthDate ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          <RotateCcw className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-500" />
          <span className="hidden sm:inline">Réinitialiser</span>
        </button>
      </div>

      <div className="flex justify-center mb-6 relative group">
        <div className="absolute inset-0 bg-brand-400 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
        <motion.button
          type="button"
          onClick={onResetRequest}
          aria-label="Réinitialiser le simulateur"
          className={`relative inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-2xl shadow-brand-500/30 transition-transform duration-500 hover:scale-105 active:scale-95 animate-logo-appear ${hasBirthDate ? 'cursor-pointer' : 'cursor-default'}`}
          style={{ scale: shouldReduce ? 1 : logoScale }}
          title={hasBirthDate ? 'Cliquer pour réinitialiser' : 'Calendrier'}
        >
          <div className="logo-icon-container w-12 h-12 relative drop-shadow-md">
            <CalendarIcon className="logo-icon-part w-full h-full text-white" strokeWidth={1.5} style={{ clipPath: 'polygon(0 0, 50% 0, 50% 50%, 0 50%)' }} />
            <CalendarIcon className="logo-icon-part w-full h-full text-white" strokeWidth={1.5} style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 50%, 50% 50%)' }} />
            <CalendarIcon className="logo-icon-part w-full h-full text-white" strokeWidth={1.5} style={{ clipPath: 'polygon(0 50%, 50% 50%, 50% 100%, 0 100%)' }} />
            <CalendarIcon className="logo-icon-part w-full h-full text-white" strokeWidth={1.5} style={{ clipPath: 'polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)' }} />
          </div>
        </motion.button>
      </div>

      <h1 className="text-4xl sm:text-5xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight font-display leading-[1.1] relative inline-block max-w-full">
        Congé <span className="text-brand-600">Paternité</span>
        <motion.span
          className="absolute -top-8 -right-10 rotate-12 bg-brand-100 text-brand-700 text-sm font-bold px-3 py-1.5 rounded-xl border border-brand-200 shadow-sm hidden sm:inline-block"
          animate={shouldReduce ? undefined : { y: [0, -4, 0] }}
          transition={shouldReduce ? undefined : { duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          2026 Ready
        </motion.span>
      </h1>
      <p className="text-lg sm:text-3xl font-hand -rotate-1 mb-8 px-4 max-w-xs sm:max-w-2xl mx-auto leading-relaxed text-brand-900/80">
        L'outil moderne pour planifier simplement votre congé paternité.
      </p>
    </motion.header>
  );
}
