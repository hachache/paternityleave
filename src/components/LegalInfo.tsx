import { BookOpen } from 'lucide-react';

export function LegalInfo() {
  return (
    <details className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200/60 rounded-2xl shadow-md hover:shadow-xl transition-apple-smooth">
      <summary className="cursor-pointer p-6 hover:bg-slate-100/50 transition-apple-smooth flex items-center gap-3 active:scale-[0.99] rounded-2xl">
        <div className="p-2 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl">
          <BookOpen className="w-5 h-5 text-white flex-shrink-0" />
        </div>
        <span className="text-base font-bold text-slate-800">Cadre légal</span>
      </summary>
      <div className="px-6 pb-6 animate-slide-in">
        <ul className="space-y-3 text-sm text-slate-700">
          <li className="flex gap-3 items-start p-3 bg-white/60 rounded-xl hover:bg-white transition-apple-smooth">
            <span className="font-bold text-slate-900 min-w-[4rem] text-base">3 jours</span>
            <span className="font-medium">à la charge de l'employeur</span>
          </li>
          <li className="flex gap-3 items-start p-3 bg-white/60 rounded-xl hover:bg-white transition-apple-smooth">
            <span className="font-bold text-slate-900 min-w-[4rem] text-base">25 jours</span>
            <span className="font-medium">calendaires indemnisés par la Sécurité sociale</span>
          </li>
          <li className="flex gap-3 items-start p-3 bg-white/60 rounded-xl hover:bg-white transition-apple-smooth">
            <span className="font-bold text-slate-900 min-w-[4rem] text-base">4 jours</span>
            <span className="font-medium">obligatoires immédiatement après</span>
          </li>
          <li className="flex gap-3 items-start p-3 bg-white/60 rounded-xl hover:bg-white transition-apple-smooth">
            <span className="font-bold text-slate-900 min-w-[4rem] text-base">21 jours</span>
            <span className="font-medium">restants fractionnables (min 5 jours consécutifs)</span>
          </li>
          <li className="flex gap-3 items-start p-3 bg-white/60 rounded-xl hover:bg-white transition-apple-smooth">
            <span className="font-bold text-slate-900 min-w-[4rem] text-base">6 mois</span>
            <span className="font-medium">maximum pour prendre les jours</span>
          </li>
          <li className="flex gap-3 items-start p-3 bg-white/60 rounded-xl hover:bg-white transition-apple-smooth">
            <span className="font-bold text-slate-900 min-w-[4rem] text-base">+7 jours</span>
            <span className="font-medium">supplémentaires en cas de naissances multiples</span>
          </li>
        </ul>
      </div>
    </details>
  );
}
