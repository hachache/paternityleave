import { Calendar as CalendarIcon, RotateCcw } from 'lucide-react';

interface HeroHeaderProps {
  hasBirthDate: boolean;
  onResetRequest: () => void;
}

export function HeroHeader({ hasBirthDate, onResetRequest }: HeroHeaderProps) {
  return (
    <header className="reveal mb-6 sm:mb-14 text-center relative overflow-hidden">
      {/* Arrière-plan décoratif */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-50/40 to-transparent pointer-events-none" />
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-brand-100/20 to-transparent rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

      {/* Ornements décoratifs */}
      <div className="absolute top-8 left-4 sm:left-12 w-2 h-2 rounded-full bg-brand-300/40 hidden sm:block" aria-hidden="true" />
      <div className="absolute top-20 right-12 w-3 h-3 rounded-full bg-brand-400/30 hidden sm:block" aria-hidden="true" />
      <div className="absolute top-6 right-1/4 w-1.5 h-1.5 rounded-full bg-brand-200/50 hidden sm:block" aria-hidden="true" />

      <div className="absolute top-0 right-2 sm:right-0 z-20">
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

      <div className="flex justify-center mb-4 sm:mb-6 relative">
        <div
          aria-hidden="true"
          className="reveal-subtle relative inline-flex items-center justify-center w-14 h-14 sm:w-24 sm:h-24 rounded-2xl sm:rounded-card bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg sm:shadow-card-elevated shadow-brand-500/30"
        >
          <div className="absolute inset-0 rounded-2xl sm:rounded-card bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2),transparent_70%)]" aria-hidden="true" />
          <CalendarIcon className="w-7 h-7 sm:w-12 sm:h-12 drop-shadow-md relative z-10" strokeWidth={1.8} aria-hidden="true" />
        </div>
      </div>

      <h1 className="text-[2.35rem] sm:text-5xl md:text-5xl font-extrabold text-slate-900 mb-2 sm:mb-5 tracking-tight font-display leading-[1.05] relative inline-block max-w-full">
        Congé{' '}
        <span className="text-gradient">Paternité</span>
        <span
          aria-hidden="true"
          className="absolute -top-8 -right-10 rotate-6 bg-gradient-to-br from-brand-500 to-brand-700 text-white text-sm font-bold px-3 py-1.5 rounded-xl border border-brand-400/30 shadow-lg shadow-brand-500/20 hidden sm:inline-block"
        >
          2026 Ready
        </span>
      </h1>
      <p className="text-sm sm:text-2xl font-medium mb-0 sm:mb-6 px-4 max-w-xs sm:max-w-2xl mx-auto leading-relaxed text-slate-500">
        L'outil moderne pour planifier facilement votre congé paternité.
      </p>
    </header>
  );
}
