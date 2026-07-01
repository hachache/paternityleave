import { Calendar as CalendarIcon, RotateCcw } from 'lucide-react';

interface HeroHeaderProps {
  hasBirthDate: boolean;
  onResetRequest: () => void;
}

export function HeroHeader({ hasBirthDate, onResetRequest }: HeroHeaderProps) {
  return (
    <header className="reveal mb-8 sm:mb-14 text-center relative overflow-hidden px-2 sm:px-0">
      {/* Arrière-plan décoratif */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-50/40 to-transparent pointer-events-none" />
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-brand-100/20 to-transparent rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

      {/* Ornements décoratifs */}
      <div className="absolute top-8 left-4 sm:left-12 w-2 h-2 rounded-full bg-brand-300/40 hidden sm:block" aria-hidden="true" />
      <div className="absolute top-20 right-12 w-3 h-3 rounded-full bg-brand-400/30 hidden sm:block" aria-hidden="true" />
      <div className="absolute top-6 right-1/4 w-1.5 h-1.5 rounded-full bg-brand-200/50 hidden sm:block" aria-hidden="true" />

      <div className="absolute top-0 right-0 z-20">
        <button
          type="button"
          onClick={onResetRequest}
          aria-label="Réinitialiser le planificateur"
          className={`flex h-11 w-11 sm:h-auto sm:w-auto items-center justify-center gap-2 rounded-xl border border-white/80 bg-white/70 px-2.5 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-brand-600 hover:shadow-lg active:scale-95 sm:px-4 group ${
            !hasBirthDate ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <RotateCcw className="w-4 h-4 shrink-0 group-hover:-rotate-180 transition-transform duration-500" />
          <span className="hidden sm:inline">Réinitialiser</span>
        </button>
      </div>

      <div className="flex justify-center mb-5 sm:mb-8 relative">
        <div
          aria-hidden="true"
          className="reveal-subtle relative inline-flex items-center justify-center w-16 h-16 sm:w-24 sm:h-24 rounded-2xl sm:rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg sm:shadow-card-elevated shadow-brand-500/30"
        >
          <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2),transparent_70%)]" aria-hidden="true" />
          <CalendarIcon className="w-8 h-8 sm:w-12 sm:h-12 drop-shadow-md relative z-10" strokeWidth={1.8} aria-hidden="true" />
        </div>
      </div>

      <h1 className="text-[2.15rem] sm:text-[2.75rem] md:text-[3.25rem] font-extrabold text-slate-900 mb-3 sm:mb-5 tracking-tight font-display leading-[1.08] relative inline-block">
        Congé{' '}
        <span className="text-gradient">Paternité</span>
        <span
          aria-hidden="true"
          className="absolute -top-7 -right-9 rotate-6 bg-gradient-to-br from-brand-500 to-brand-700 text-white text-xs font-bold px-2.5 py-1.5 rounded-xl border border-brand-400/30 shadow-lg shadow-brand-500/20 hidden sm:inline-block"
        >
          2026 Ready
        </span>
      </h1>
      <p className="text-base sm:text-lg md:text-xl font-medium px-0 max-w-lg sm:max-w-xl mx-auto text-slate-500">
        L'outil moderne pour planifier facilement votre congé paternité.
      </p>
    </header>
  );
}
