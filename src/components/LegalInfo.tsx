import { BookOpen, Scale, AlertCircle, ChevronDown } from 'lucide-react';
import { LEAVE_SCENARIOS } from '../utils/paternityLeave';

interface LegalInfoProps {
  onShowLegalReferences?: () => void;
}

export function LegalInfo({ onShowLegalReferences }: LegalInfoProps) {
  const standard = LEAVE_SCENARIOS.standard;
  const multiples = LEAVE_SCENARIOS['multiple-births'];
  const hospitalized = LEAVE_SCENARIOS['hospitalized-newborn'];
  const adoption = LEAVE_SCENARIOS.adoption;
  const multiplesBonus = multiples.fractionableDays - standard.fractionableDays;

  return (
    <details className="group bg-white border border-slate-200 rounded-2xl shadow-depth hover:shadow-depth-md transition-all duration-300">
      <summary className="cursor-pointer p-5 sm:p-6 hover:bg-slate-50/50 transition-all duration-300 flex items-center gap-3 active:scale-[0.99] rounded-2xl list-none [&::-webkit-details-marker]:hidden">
        <div className="p-2 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-sm">
          <BookOpen className="w-5 h-5 flex-shrink-0" />
        </div>
        <span className="text-base font-bold text-slate-800 flex-1">Cadre légal</span>
        <ChevronDown className="w-5 h-5 text-slate-400 transition-transform duration-300 group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="px-5 sm:px-6 pb-6 animate-slide-in space-y-4">
        {/* Avertissement perimetre de l'application */}
        <div className="p-4 bg-gradient-to-r from-amber-50 to-amber-50/60 border border-amber-200 rounded-xl flex items-start gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 space-y-2">
            <p className="text-sm font-semibold text-amber-900">
              Périmètre du calcul
            </p>
            <p className="text-xs text-amber-800 leading-relaxed">
              Le <strong>congé de paternité</strong> calculé ci-dessous suit le Code du travail
              (articles L1225-35 et suivants), donc le <strong>secteur privé</strong>. Les agents de la
              <strong> fonction publique</strong> et certains régimes spéciaux relèvent de règles
              propres ; les <strong>conventions collectives</strong> peuvent prévoir des jours
              supplémentaires.
            </p>
            <p className="text-xs text-amber-800 leading-relaxed">
              Le <strong>congé supplémentaire de naissance 2026</strong> (LFSS 2026, art. 99-V) est plus
              large : il couvre <strong>tous les actifs</strong> (salariés, indépendants, non-salariés
              agricoles, fonctionnaires, militaires).
            </p>
          </div>
        </div>

        <ul className="space-y-3 text-sm text-slate-700">
          <li className="flex gap-3 items-start p-3 bg-white/60 rounded-xl hover:bg-white hover:shadow-sm transition-all duration-200 border border-transparent hover:border-slate-100">
            <span className="font-bold text-slate-900 min-w-[4rem] text-base">3 jours</span>
            <div className="flex-1">
              <span className="font-medium">ouvrables à la charge de l'employeur</span>
              <p className="text-xs text-slate-500 mt-1">
                Jours ouvrables = lundi à samedi (hors dimanches et jours fériés)
              </p>
            </div>
          </li>
          <li className="flex gap-3 items-start p-3 bg-white/60 rounded-xl hover:bg-white hover:shadow-sm transition-all duration-200 border border-transparent hover:border-slate-100">
            <span className="font-bold text-slate-900 min-w-[4rem] text-base">4 jours</span>
            <div className="flex-1">
              <span className="font-medium">calendaires obligatoires immédiatement après</span>
              <p className="text-xs text-slate-500 mt-1">
                Jours calendaires = weekends et jours fériés inclus
              </p>
            </div>
          </li>
          <li className="flex gap-3 items-start p-3 bg-white/60 rounded-xl hover:bg-white hover:shadow-sm transition-all duration-200 border border-transparent hover:border-slate-100">
            <span className="font-bold text-slate-900 min-w-[4rem] text-base">{standard.fractionableDays} jours</span>
            <div className="flex-1">
              <span className="font-medium">
                calendaires fractionnables en situation standard (minimum 5 jours calendaires consécutifs), à poser dans les {standard.limitMonthsAfterBirth} mois
              </span>
              <p className="text-xs text-slate-500 mt-1">
                Jours calendaires = incluant samedis, dimanches et jours fériés
              </p>
            </div>
          </li>
          <li className="flex gap-3 items-start p-3 bg-white/60 rounded-xl hover:bg-white hover:shadow-sm transition-all duration-200 border border-transparent hover:border-slate-100">
            <span className="font-bold text-slate-900 min-w-[4rem] text-base">+{multiplesBonus} jours</span>
            <div className="flex-1">
              <span className="font-medium">calendaires en cas de naissances multiples (soit {multiples.fractionableDays} jours fractionnables)</span>
            </div>
          </li>
          <li className="flex gap-3 items-start p-3 bg-white/60 rounded-xl hover:bg-white hover:shadow-sm transition-all duration-200 border border-transparent hover:border-slate-100">
            <span className="font-bold text-slate-900 min-w-[4rem] text-base">Hospitalisation</span>
            <span className="font-medium">report possible jusqu'à {hospitalized.limitMonthsAfterBirth} mois après la naissance</span>
          </li>
          <li className="flex gap-3 items-start p-3 bg-white/60 rounded-xl hover:bg-white hover:shadow-sm transition-all duration-200 border border-transparent hover:border-slate-100">
            <span className="font-bold text-slate-900 min-w-[4rem] text-base">Adoption</span>
            <span className="font-medium">{adoption.fractionableDays} jours calendaires fractionnables à prendre dans les {adoption.limitMonthsAfterBirth} mois suivant l'arrivée</span>
          </li>
          <li className="flex gap-3 items-start p-3 bg-gradient-to-r from-blue-50 to-blue-50/60 rounded-xl hover:from-blue-100 hover:to-blue-50 transition-all duration-200 border border-blue-100 shadow-sm">
            <span className="font-bold text-blue-700 min-w-[4rem] text-base">+1 à 2 mois</span>
            <div className="flex-1">
              <span className="font-medium text-blue-900">
                Congé supplémentaire de naissance 2026 (LFSS 2026, art. 99-V)
              </span>
              <p className="text-xs text-blue-800 mt-1 leading-relaxed">
                Demande possible à partir du 1er juin 2026, avec un début effectif au plus tôt le
                1er juillet 2026, pour les enfants nés/adoptés à partir du 1er janvier 2026.
                Indemnisation : 70% du salaire net le premier mois, 60% le second (plafond SS).
                Fractionnable en 2 périodes d'1 mois.
              </p>
            </div>
          </li>
        </ul>

        {onShowLegalReferences && (
          <div className="mt-6 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onShowLegalReferences}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-br from-brand-50 to-brand-50/60 hover:from-brand-100 hover:to-brand-50 text-brand-700 rounded-xl transition-all duration-300 hover:shadow-md font-medium text-sm border border-brand-100"
            >
              <Scale className="w-4 h-4" />
              Consulter toutes les références légales
            </button>
            <p className="text-xs text-slate-400 text-center mt-2 font-medium">
              Textes de loi, articles du Code du travail, liens vers Légifrance et Service-Public.fr
            </p>
          </div>
        )}
      </div>
    </details>
  );
}
