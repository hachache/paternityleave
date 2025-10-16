import { BookOpen } from 'lucide-react';

export function LegalInfo() {
  return (
    <details className="bg-slate-50 border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-apple">
      <summary className="cursor-pointer p-5 hover:bg-slate-100 transition-apple flex items-center gap-3 active:scale-[0.99]">
        <BookOpen className="w-5 h-5 text-slate-500 flex-shrink-0" />
        <span className="text-sm font-medium text-slate-700">Cadre légal</span>
      </summary>
      <div className="px-5 pb-5 animate-slide-in">
        <ul className="space-y-2 text-xs text-slate-600">
          <li className="flex gap-2">
            <span className="font-semibold text-slate-900 min-w-[3rem]">3 jours</span>
            <span>à la charge de l'employeur</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-slate-900 min-w-[3rem]">25 jours</span>
            <span>calendaires indemnisés par la Sécurité sociale</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-slate-900 min-w-[3rem]">4 jours</span>
            <span>obligatoires immédiatement après</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-slate-900 min-w-[3rem]">21 jours</span>
            <span>restants fractionnables (min 5 jours consécutifs)</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-slate-900 min-w-[3rem]">6 mois</span>
            <span>maximum pour prendre les jours</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-slate-900 min-w-[3rem]">+7 jours</span>
            <span>supplémentaires en cas de naissances multiples</span>
          </li>
        </ul>
      </div>
    </details>
  );
}
