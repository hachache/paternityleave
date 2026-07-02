import { Calendar as CalendarIcon, RotateCcw } from 'lucide-react';

interface HeroHeaderProps {
  hasBirthDate: boolean;
  onResetRequest: () => void;
}

export function HeroHeader({ hasBirthDate, onResetRequest }: HeroHeaderProps) {
  return (
    <header className="reveal mb-12 sm:mb-16 text-center relative overflow-hidden px-2 sm:px-0">
      {/* Arrière-plan décoratif */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-50/40 to-transparent pointer-events-none" />

      {/* Badge 2026 Ready inline */}
      <div className="flex justify-center mb-5 sm:mb-7 relative">
        <div
          aria-hidden="true"
          className="reveal-subtle relative inline-flex items-center justify-center w-20 h-20 sm:w-28 sm:h-28 rounded-2xl sm:rounded-[1.75rem] bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg sm:shadow-card-elevated shadow-brand-500/30 animate-pulse-lazy"
        >
          <div className="absolute inset-0 rounded-2xl sm:rounded-[1.75rem] bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.25),transparent_70%)]" aria-hidden="true" />
          <CalendarIcon className="w-9 h-9 sm:w-14 sm:h-14 drop-shadow-md relative z-10" strokeWidth={1.6} aria-hidden="true" />
        </div>
      </div>

      <h1 className="text-[2.5rem] sm:text-[3.5rem] md:text-[4rem] font-extrabold text-slate-900 mb-3 sm:mb-5 tracking-tight font-display leading-[1.06] relative inline-block">
        Congé{' '}
        <span className="text-gradient">Paternité</span>
        <span
          aria-hidden="true"
          className="relative -top-1 sm:-top-3 ml-2 sm:ml-3 inline-flex items-center gap-1.5 bg-gradient-to-br from-brand-500 to-brand-700 text-white text-[0.6rem] sm:text-xs font-bold px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl border border-brand-400/20 shadow-lg shadow-brand-500/20"
        >
          2026 Ready
        </span>
      </h1>

      <p className="text-base sm:text-lg md:text-xl font-medium px-0 max-w-lg sm:max-w-xl mx-auto text-slate-500">
        L'outil moderne pour planifier facilement votre congé paternité.
      </p>

      {/* Bouton reset — apparaît seulement quand une date est définie */}
      <div className={`mt-6 sm:mt-8 transition-all duration-500 ease-out ${hasBirthDate ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none absolute'}`}>
        <button
          type="button"
          onClick={onResetRequest}
          aria-label="Réinitialiser le planificateur"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-surface-200/60 bg-white/60 backdrop-blur-md text-sm font-medium text-slate-500 shadow-sm transition-all duration-300 hover:bg-white hover:text-brand-600 hover:border-brand-200 hover:shadow-md active:scale-95 group"
        >
          <RotateCcw className="w-4 h-4 shrink-0 group-hover:-rotate-180 transition-transform duration-500" />
          Réinitialiser
        </button>
      </div>
    </header>
  );
}
