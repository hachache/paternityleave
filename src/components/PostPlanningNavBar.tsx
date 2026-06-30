import { FileText, LayoutList, Sparkles } from 'lucide-react';

interface PostPlanningNavBarProps {
  showSupplementaryLink: boolean;
}

const linkClass =
  'inline-flex min-h-11 items-center gap-1.5 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500';

function scrollToSection(sectionId: string) {
  const element = document.getElementById(sectionId);
  if (!element) return;
  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function PostPlanningNavBar({ showSupplementaryLink }: PostPlanningNavBarProps) {
  return (
    <nav
      className="sticky top-20 z-30 mx-auto mb-8 hidden max-w-4xl scroll-mt-28 sm:block"
      aria-label="Navigation après planification"
    >
      <div className="rounded-[18px] border border-slate-200 bg-white/95 p-2 shadow-card backdrop-blur">
        <p className="px-2.5 sm:px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Suite de votre dossier
        </p>
        <div className="flex flex-wrap gap-1 sm:gap-2">
          <button type="button" onClick={() => scrollToSection('summary')} className={linkClass}>
            <LayoutList className="h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
            Récap
          </button>
          {showSupplementaryLink && (
            <button
              type="button"
              onClick={() => scrollToSection('conge-supplementaire')}
              className={linkClass}
            >
              <Sparkles className="h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
              Congé 2026
            </button>
          )}
          <button type="button" onClick={() => scrollToSection('letter')} className={linkClass}>
            <FileText className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
            Courrier
          </button>
        </div>
      </div>
    </nav>
  );
}
