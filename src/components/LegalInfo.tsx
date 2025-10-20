import { BookOpen } from 'lucide-react';
import { LEAVE_SCENARIOS } from '../utils/paternityLeave';

export function LegalInfo() {
  const standard = LEAVE_SCENARIOS.standard;
  const multiples = LEAVE_SCENARIOS['multiple-births'];
  const hospitalized = LEAVE_SCENARIOS['hospitalized-newborn'];
  const adoption = LEAVE_SCENARIOS.adoption;
  const multiplesBonus = multiples.fractionableDays - standard.fractionableDays;

  return (
    <details className="bg-white border border-slate-200 rounded-2xl shadow-md hover:shadow-lg transition-apple-smooth">
      <summary className="cursor-pointer p-6 hover:bg-slate-100 transition-apple-smooth flex items-center gap-3 active:scale-[0.99] rounded-2xl">
        <div className="p-2 rounded-xl bg-slate-900 text-white">
          <BookOpen className="w-5 h-5 flex-shrink-0" />
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
            <span className="font-bold text-slate-900 min-w-[4rem] text-base">4 jours</span>
            <span className="font-medium">obligatoires immédiatement après</span>
          </li>
          <li className="flex gap-3 items-start p-3 bg-white/60 rounded-xl hover:bg-white transition-apple-smooth">
            <span className="font-bold text-slate-900 min-w-[4rem] text-base">{standard.fractionableDays} jours</span>
            <span className="font-medium">
              fractionnables en situation standard (minimum 5 jours consécutifs), à poser dans les {standard.limitMonthsAfterBirth} mois
            </span>
          </li>
          <li className="flex gap-3 items-start p-3 bg-white/60 rounded-xl hover:bg-white transition-apple-smooth">
            <span className="font-bold text-slate-900 min-w-[4rem] text-base">+{multiplesBonus} jours</span>
            <span className="font-medium">en cas de naissances multiples (soit {multiples.fractionableDays} jours fractionnables)</span>
          </li>
          <li className="flex gap-3 items-start p-3 bg-white/60 rounded-xl hover:bg-white transition-apple-smooth">
            <span className="font-bold text-slate-900 min-w-[4rem] text-base">Hospitalisation</span>
            <span className="font-medium">report possible jusqu'à {hospitalized.limitMonthsAfterBirth} mois après la naissance</span>
          </li>
          <li className="flex gap-3 items-start p-3 bg-white/60 rounded-xl hover:bg-white transition-apple-smooth">
            <span className="font-bold text-slate-900 min-w-[4rem] text-base">Adoption</span>
            <span className="font-medium">{adoption.fractionableDays} jours fractionnables à prendre dans les {adoption.limitMonthsAfterBirth} mois suivant l'arrivée</span>
          </li>
        </ul>
      </div>
    </details>
  );
}
